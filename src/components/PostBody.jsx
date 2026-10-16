import { Fragment } from "react";
import {
  Box,
  Divider,
  Link,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from "@mui/material";
import Image from "./Image";

/*
 * Renders the `body` of a post (src/content/**.json): a list of blocks whose
 * text is either a string or a list of spans. See README for the format.
 */

/** Without an alt text, the file name with punctuation as spaces is used. */
const defaultAlt = src =>
  src
    .slice(src.lastIndexOf("/") + 1)
    .replace(/\.[^.]+$/, "")
    .replace(/[^A-Z0-9]/gi, " ");

const isExternal = href => /^[a-z][a-z\d+.-]*:/i.test(href);

/** A string, with "\n" as line breaks. */
function Lines({ text }) {
  return text.split("\n").map((line, index) => (
    <Fragment key={index}>
      {index > 0 && <br />}
      {line}
    </Fragment>
  ));
}

/** Inline content: a string or a list of spans (text, bold, italic, code, links). */
function RichText({ text }) {
  if (typeof text === "string") {
    return <Lines text={text} />;
  }
  if (Array.isArray(text)) {
    return text.map((span, index) => <RichText key={index} text={span} />);
  }
  if ("bold" in text) {
    return (
      <Box component="strong" sx={{ fontWeight: 700 }}>
        <RichText text={text.bold} />
      </Box>
    );
  }
  if ("italic" in text) {
    return (
      <em>
        <RichText text={text.italic} />
      </em>
    );
  }
  if ("code" in text) {
    return (
      <Box
        component="code"
        sx={{
          fontFamily: "monospace",
          fontSize: "0.9em",
          px: 0.5,
          borderRadius: 0.5,
          backgroundColor: "rgba(0, 0, 0, 0.06)"
        }}>
        {text.code}
      </Box>
    );
  }
  return (
    <Link
      href={text.href}
      underline="hover"
      sx={{ fontWeight: 500, overflowWrap: "anywhere" }}
      {...(isExternal(text.href) && {
        target: "_blank",
        rel: "noopener noreferrer"
      })}>
      <RichText text={text.text} />
    </Link>
  );
}

function PostImage({ src, alt, images, sx }) {
  const image = images[src];
  const description = alt || (image ? defaultAlt(src) : "");
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        "& img, & .image": { borderRadius: 1 },
        ...sx
      }}>
      {image ? (
        <Image
          className="post-image"
          style={{ maxWidth: image.width }}
          image={image}
          alt={description}
        />
      ) : (
        <Box
          component="img"
          src={src}
          alt={description}
          loading="lazy"
          decoding="async"
          sx={{ display: "block", maxWidth: "100%", height: "auto" }}
        />
      )}
    </Box>
  );
}

function ListItems({ items, ordered, marker }) {
  return (
    <Box
      component={ordered ? "ol" : "ul"}
      sx={{
        pl: 3,
        my: 0,
        listStyleType: marker === "alpha" ? "lower-alpha" : undefined,
        "& > li": { mb: 0.75 },
        "& > li::marker": { color: "primary.main", fontWeight: 600 }
      }}>
      {items.map((item, index) =>
        typeof item === "string" || Array.isArray(item) ? (
          <li key={index}>
            <RichText text={item} />
          </li>
        ) : (
          <li key={index}>
            <RichText text={item.text} />
            {item.items && (
              <Box sx={{ mt: 0.75 }}>
                <ListItems items={item.items} />
              </Box>
            )}
          </li>
        )
      )}
    </Box>
  );
}

const headingStyle = {
  fontWeight: 700,
  color: "#00452F",
  lineHeight: 1.3
};

function Block({ block, images }) {
  switch (block.type) {
    case "heading":
      return (
        <Typography
          variant="h6"
          component="h2"
          sx={{
            ...headingStyle,
            fontSize: { xs: "1.35rem", sm: "1.6rem" },
            mt: 4,
            mb: 1.5
          }}>
          <RichText text={block.text} />
        </Typography>
      );
    case "subheading":
      return (
        <Typography
          variant="h6"
          component="h3"
          sx={{ ...headingStyle, fontSize: "1.15rem", mt: 3, mb: 1 }}>
          <RichText text={block.text} />
        </Typography>
      );
    case "paragraph":
      return (
        <Typography variant="body1" sx={{ mb: 2 }}>
          <RichText text={block.text} />
        </Typography>
      );
    case "list":
      return (
        <Typography component="div" variant="body1" sx={{ mb: 2 }}>
          <ListItems
            items={block.items}
            ordered={block.ordered}
            marker={block.marker}
          />
        </Typography>
      );
    case "image":
      return (
        <PostImage
          src={block.src}
          alt={block.alt}
          images={images}
          sx={{ my: 3 }}
        />
      );
    case "gallery":
      return (
        <Box
          sx={{
            display: "grid",
            gap: 2,
            my: 3,
            gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)" },
            // with an odd number of images, the first one spans the full width
            ...(block.images.length % 2 === 1 && {
              "& > :first-of-type": { gridColumn: "1 / -1" }
            })
          }}>
          {block.images.map(image => (
            <PostImage
              key={image.src}
              src={image.src}
              alt={image.alt}
              images={images}
              sx={{ alignItems: "flex-start" }}
            />
          ))}
        </Box>
      );
    case "cards":
      return (
        <Box
          sx={{
            display: "grid",
            gap: 3,
            my: 3,
            gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)" }
          }}>
          {block.items.map((card, index) => (
            <Paper
              key={index}
              variant="outlined"
              sx={{ overflow: "hidden", borderRadius: 2 }}>
              {card.image && (
                <PostImage
                  src={card.image}
                  images={images}
                  sx={{ "& img, & .image": { borderRadius: 0 } }}
                />
              )}
              <Box sx={{ p: 2 }}>
                {card.text.map((text, i) => (
                  <Typography
                    key={i}
                    variant="body2"
                    sx={{ mb: i < card.text.length - 1 ? 1 : 0 }}>
                    <RichText text={text} />
                  </Typography>
                ))}
              </Box>
            </Paper>
          ))}
        </Box>
      );
    case "table":
      return (
        <TableContainer component={Paper} variant="outlined" sx={{ my: 2 }}>
          <Table size="small">
            {block.header && (
              <TableHead sx={{ backgroundColor: "#92d3c0" }}>
                <TableRow>
                  {block.header.map((cell, index) => (
                    <TableCell key={index} sx={{ fontWeight: 700 }}>
                      <RichText text={cell} />
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
            )}
            <TableBody>
              {block.rows.map((row, index) => (
                <TableRow key={index}>
                  {row.map((cell, i) => (
                    <TableCell key={i}>
                      <RichText text={cell} />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      );
    case "quote":
      return (
        <Box
          sx={{
            my: 2,
            px: 2,
            py: 1.5,
            borderLeft: 4,
            borderColor: "primary.main",
            borderRadius: 1,
            backgroundColor: "rgba(22, 101, 79, 0.06)",
            "& > :last-child": { mb: 0 }
          }}>
          {block.blocks.map((inner, index) => (
            <Block key={index} block={inner} images={images} />
          ))}
        </Box>
      );
    case "code":
      return (
        <Box
          component="pre"
          sx={{
            my: 2,
            p: 2,
            overflowX: "auto",
            borderRadius: 1,
            fontFamily: "monospace",
            backgroundColor: "rgba(0, 0, 0, 0.06)"
          }}>
          {block.text}
        </Box>
      );
    case "divider":
      return <Divider sx={{ my: 3 }} />;
    default:
      return null;
  }
}

/** The body of a post, with `images` the responsive data of its local images. */
export default function PostBody({ body, images = {} }) {
  return (
    <Box
      sx={{
        color: "text.primary",
        overflowWrap: "break-word",
        "& > :first-of-type": { mt: 0 }
      }}>
      {body.map((block, index) => (
        <Block key={index} block={block} images={images} />
      ))}
    </Box>
  );
}
