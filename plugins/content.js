/**
 * Vite plugin for the post files (events, newsletters) in src/content:
 *
 *   import post from "./post.json"        -> the whole post, including its `body`
 *   import meta from "./post.json?meta"   -> the post without its `body`, plus
 *                                            a `summary` of the body (see below)
 *
 * Listings (upcoming events, the newsletter archive) only need the metadata,
 * so they import `?meta` and don't bundle the content of every post; a post's
 * body is loaded when its page is opened.
 */
import { readFileSync } from "node:fs";

const QUERY = "?meta";
// The virtual module id must not end in ".json", or Vite's JSON plugin parses it.
const PREFIX = "\0content-meta:";
const SUFFIX = ".js";

const EXCERPT_LENGTH = 180;
const WORDS_PER_MINUTE = 200;
const MAX_TOPICS = 3;
// Sections most newsletters have; an edition's own headings say more about it
const RECURRING_SECTIONS = new Set([
  "opportunities",
  "highlights",
  "reading picks",
  "interesting reads",
  "todo problem",
  "links to the problem set"
]);
// "Greetings readers," and the like, before the first real sentence
const SALUTATION = /^(greetings|hello|hey|hi|dear)\b[^.!?]*[,!]?$/i;

/** Plain text of block text: a string or a list of spans. */
function plainText(text) {
  if (typeof text === "string") return text;
  if (Array.isArray(text)) return text.map(plainText).join("");
  if (!text) return "";
  return plainText(text.text ?? text.bold ?? text.italic ?? text.code ?? "");
}

function blockText(block) {
  switch (block.type) {
    case "list":
      return block.items.map(item => plainText(item.text ?? item)).join(" ");
    case "quote":
      return block.blocks.map(blockText).join(" ");
    case "table":
      return [...block.header, ...block.rows.flat()].map(plainText).join(" ");
    default:
      return plainText(block.text ?? "");
  }
}

// Ends on the last full sentence that fits, or else on a word with "…"
function truncate(text, length) {
  if (text.length <= length) return text;
  const cut = text.slice(0, length);
  const sentenceEnd = Math.max(
    ...[". ", "! ", "? "].map(s => cut.lastIndexOf(s))
  );
  if (sentenceEnd > length * 0.5) return cut.slice(0, sentenceEnd + 1);
  return `${cut.slice(0, cut.lastIndexOf(" ")).replace(/[\s,;:.–-]+$/, "")}…`;
}

// The opening line, and the next ones while it is short and they read on
function excerptOf(body) {
  const lines = body
    .filter(block => block.type === "paragraph")
    .flatMap(block => plainText(block.text).split("\n"))
    .map(line => line.replace(/\s+/g, " ").trim())
    .filter(line => line && !SALUTATION.test(line));
  let excerpt = lines[0] ?? "";
  for (const line of lines.slice(1)) {
    if (excerpt.length >= EXCERPT_LENGTH / 2 || !/[.!?]$/.test(excerpt)) break;
    excerpt = `${excerpt} ${line}`;
  }
  return truncate(excerpt, EXCERPT_LENGTH);
}

function topicsOf(body) {
  const headings = body
    .filter(block => block.type === "heading" || block.type === "subheading")
    // "Turing Cup 2K26 – One Team. One Dream" -> "Turing Cup 2K26"
    .map(block =>
      plainText(block.text)
        .split(/\s[–—-]\s/)[0]
        .trim()
    );
  const distinct = [...new Set(headings)];
  const own = distinct.filter(
    heading => !RECURRING_SECTIONS.has(heading.toLowerCase().replace(/-/g, " "))
  );
  return (own.length > 0 ? own : distinct).slice(0, MAX_TOPICS);
}

/** First local image of the body, if any (a path under src/assets). */
function leadImageOf(body) {
  const sources = body.flatMap(block => {
    switch (block.type) {
      case "image":
        return [block.src];
      case "gallery":
        return block.images.map(image => image.src);
      case "cards":
        return block.items.map(card => card.image).filter(Boolean);
      default:
        return [];
    }
  });
  return sources.find(src => src.startsWith("images/")) ?? null;
}

/** What a listing shows of a post without loading its body. */
export function summarize(body) {
  const words = body.map(blockText).join(" ").split(/\s+/).filter(Boolean);
  return {
    excerpt: excerptOf(body),
    topics: topicsOf(body),
    readingMinutes: Math.max(1, Math.round(words.length / WORDS_PER_MINUTE)),
    leadImage: leadImageOf(body)
  };
}

export default function content() {
  return {
    name: "turing-hut:content",
    enforce: "pre",
    async resolveId(source, importer) {
      if (!source.endsWith(`.json${QUERY}`)) {
        return null;
      }
      const resolved = await this.resolve(
        source.slice(0, -QUERY.length),
        importer,
        { skipSelf: true }
      );
      return resolved && `${PREFIX}${resolved.id}${SUFFIX}`;
    },
    load(id) {
      if (!id.startsWith(PREFIX)) {
        return null;
      }
      const file = id.slice(PREFIX.length, -SUFFIX.length);
      this.addWatchFile(file);
      const { body, ...meta } = JSON.parse(readFileSync(file, "utf8"));
      return `export default ${JSON.stringify({ ...meta, summary: summarize(body) })};`;
    }
  };
}
