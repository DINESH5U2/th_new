# Migration: `th_old/turing-hut-website` (Gatsby) → `th_new` (Vite + React)

## 1. Audit

### 1.1 What the old site is

`th_old/turing-hut-website` is a **Gatsby 5** site. It is already written in React 18 with **MUI 6** (Emotion) for
almost all styling, plus a handful of plain CSS files. There is no jQuery and no hand-written DOM scripting except one
orphaned canvas component. The migration is therefore mostly about replacing what Gatsby did at build time:

| Gatsby feature used                                           | Where                                                                                    |
| ------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| File-system routing (`src/pages`)                             | all pages                                                                                |
| File System Route API (`{MarkdownRemark.frontmatter__slug}`)  | `/events/:slug`, `/newsletters/:slug`                                                    |
| GraphQL data layer (`useStaticQuery`, page queries)           | Navbar, Landing, Faqs, Team, PastContests, TuringCupSponsors, UpcomingEvents, tables     |
| `gatsby-transformer-remark` + `gatsby-remark-images`          | markdown → HTML for events and newsletters, responsive inline images                     |
| `gatsby-plugin-image` / `gatsby-plugin-sharp` (`GatsbyImage`) | logo, Turing tape, team photos, winners photos, sponsor logos, event and newsletter hero |
| Head API (`export const Head`)                                | per-page `<title>` and meta tags                                                         |
| `gatsby-plugin-posthog`                                       | analytics snippet + `$pageview` on route change                                          |
| `gatsby` `<Link>` (trailing slash `always`, scroll restore)   | all internal navigation                                                                  |
| `GATSBY_*` env vars                                           | PostHog key, Firebase config                                                             |

### 1.2 File inventory (everything outside `.git`)

**Project/config files**

| File                                | Purpose                                                               |
| ----------------------------------- | --------------------------------------------------------------------- |
| `package.json`, `package-lock.json` | dependencies and scripts                                              |
| `gatsby-config.js`                  | site metadata (title, description, siteUrl, keywords), plugins        |
| `firebase.json`, `.firebaserc`      | Firebase Hosting config (project `turinghut-org`)                     |
| `.firebase/ConfigFirebase.js`       | Firestore init from `GATSBY_*` env vars (only used by commented code) |
| `.firebase/hosting.cHVibGlj.cache`  | Firebase deploy cache (generated)                                     |
| `.github/workflows/main.yml`        | build + deploy to Firebase on push to `main`                          |
| `.npmrc`                            | `legacy-peer-deps=true`                                               |
| `.prettierrc.js`, `.prettierignore` | formatting                                                            |
| `.gitignore`, `README.md`           |                                                                       |
| `id`                                | stray output of `git branch` (not part of the site)                   |
| `.DS_Store` ×5                      | macOS junk                                                            |
| `static/favicon.ico`                | favicon                                                               |

**Pages (`src/pages`)**: `index.js`, `about.js`, `contact.js`, `icpc.js`, `team.js`, `turingcup.js`, `register.js`,
`404.js`, `events/index.js`, `events/{MarkdownRemark.frontmatter__slug}.js`, `newsletters/index.js`,
`newsletters/{MarkdownRemark.frontmatter__slug}.js`.

**Components (`src/components`)**: `Layout`, `Navbar`, `Footer`, `Seo`, `Landing`, `Activities`, `UpcomingEvents`,
`VisionMission`, `Faqs`, `Team`, `TeamCard`, `EventsTable`, `EventPage`, `NewslettersTable`, `NewslettersPage`, `ICPC`,
`ICPCImage`, and under `TuringCup/`: `About`, `Faqs`, `Landingpage2`, `PastContests`, `Timelinee`, `Timers`,
`TuringCupPrizePool`, `TuringCupSponsors`, `OurSponsors`, `LandingPage`, `LandingPage1`.

**Hooks**: `src/hooks/use-site-metadata.js`.

**Styles**: `src/styles/global.css`, `src/components/TuringCup/{turingcup,LandingPage2,SponsorsCard,headingstyles,LandingStyle}.css`.

**Data**: `src/assets/team_data.json`, `src/assets/sponsors{23,24,25,26}.json`, `src/lib/icpc-timeline-data.json`.

**Content**: `src/assets/events/*.md` (22 files), `src/assets/newsletters/*.md` (29 files).

### 1.3 Pages and routes

Gatsby 5 defaults to `trailingSlash: "always"`, so the canonical URLs end in `/`.

| Route                 | Old file                                             | Layout | `<title>`                     | Content                                           |
| --------------------- | ---------------------------------------------------- | ------ | ----------------------------- | ------------------------------------------------- |
| `/`                   | `pages/index.js`                                     | yes    | `Home \| Turing Hut`          | Landing, Activities, UpcomingEvents               |
| `/about/`             | `pages/about.js`                                     | yes    | `About \| Turing Hut`         | VisionMission, Faqs                               |
| `/contact/`           | `pages/contact.js`                                   | yes    | `Contact \| Turing Hut`       | Google Maps iframe, address                       |
| `/events/`            | `pages/events/index.js`                              | yes    | `Events \| Turing Hut`        | EventsTable                                       |
| `/events/:slug/`      | `pages/events/{MarkdownRemark.frontmatter__slug}.js` | yes    | `<event title> \| Turing Hut` | EventPage                                         |
| `/icpc/`              | `pages/icpc.js`                                      | yes    | `ICPC Legacy \| Turing Hut`   | ICPC                                              |
| `/newsletters/`       | `pages/newsletters/index.js`                         | yes    | _(none)_                      | NewslettersTable                                  |
| `/newsletters/:slug/` | `pages/newsletters/{MarkdownRemark…}.js`             | yes    | _(none)_                      | NewslettersPage                                   |
| `/register/`          | `pages/register.js`                                  | **no** | `Register \| Turing Hut`      | notice points + "Redirect" button                 |
| `/team/`              | `pages/team.js`                                      | yes    | `Team \| Turing Hut`          | Team                                              |
| `/turingcup/`         | `pages/turingcup.js`                                 | yes    | `Turing Cup \| Turing Hut`    | Landingpage2, About, PastContests, TuringCup/Faqs |
| anything else         | `pages/404.js`                                       | **no** | `Not found`                   | "Page not found"                                  |

Notes on the dynamic routes:

- Both `{MarkdownRemark.frontmatter__slug}.js` templates create a page for **every** markdown node, because events and
  newsletters share one `MarkdownRemark` type. So `/events/27/` (a newsletter rendered with the event template) and
  `/newsletters/octcoder/` (an event rendered with the newsletter template) both exist in the old site.
- Slugs — events: `cp-workshop-2025`, `cp-workshop-2026`, `codenox-2-0-octcoder-reload-2024`, `cp-workshop-24`,
  `gsoc-outreachy-session`, `turing-cup-2023`, `turing-cup-2024`, `turing-cup-2025`, `code-frenzy-22`, `code-frenzy-23`,
  `code-frenzy-24`, `code-frenzy-25`, `code-frenzy-26`, `codeverse-2025`, `decode-icpc-2025`, `hack4sdg-2k24`,
  `intro-coding-platforms`, `mlh-info-session`, `octcoder`, `project-halloween`, `summer-practice-contest`,
  `turing-cup-2k26`; newsletters: `1` … `29`.

### 1.4 Shared sections

- **Layout** (`Layout.js`): MUI `ThemeProvider` (primary `#16654F`, secondary `#4C4D4F`, `h5` 30px), flex wrapper,
  `Navbar`, `<main>` with toolbar spacer, page content, `Footer`. Background and margin switch to the dark Turing Cup
  theme when the path contains `/turingcup` or `/register`.
- **Navbar**: fixed `AppBar` with logo avatar (links home), site name ("Turing Hut" / "Turing Cup"), 7 nav buttons on
  `md+`, hamburger + temporary `Drawer` (300px) below `md`. Active item highlighted by pathname.
- **Footer**: divider, mailto link, 4 social icon buttons with tooltips, "Contact Us" icon linking to `/contact`.
- **Seo**: `<title>`, `<meta name="description">`, `<meta name="url">` from site metadata.

### 1.5 Reusable UI patterns

- Two-tone section heading: two inline `h5`/`h4` Typographies (dark word + primary-colored word).
- Turing Cup section heading: `h3`, Gruppo font, bold, glow `textShadow`.
- Gold-outline Turing Cup button (`#101820FF` / `#F2AA4CFF`).
- FAQ accordion (single-open, `expanded` index state) — light and Turing Cup variants.
- Sortable, searchable, paginated MUI table (events, newsletters).
- Cards: activity card, upcoming-event card, event grid card, team card, ICPC timeline card.
- Gatsby responsive image (blur-up placeholder, `srcset`, webp, lazy loading, fade-in).

### 1.6 Assets

| Folder / file                          | Count | Used by                                                           |
| -------------------------------------- | ----- | ----------------------------------------------------------------- |
| `static/favicon.ico`                   | 1     | site favicon                                                      |
| `src/assets/images/turinghut_logo.png` | 1     | Navbar avatar, Landing                                            |
| `src/assets/images/turing_tape.png`    | 1     | Faqs                                                              |
| `src/assets/images/team/`              | 122   | Team (matched through `team_data.json`)                           |
| `src/assets/images/events/`            | 21    | event markdown frontmatter `image`                                |
| `src/assets/images/newsletter/`        | 41    | newsletter frontmatter `image`, inline `<img>` in newsletters     |
| `src/assets/images/icpc/`              | 22    | ICPC timeline, ICPCImage                                          |
| `src/assets/images/turingcup-winners/` | 4     | PastContests                                                      |
| `src/assets/images/sponsors26/`        | 3     | TuringCupSponsors (section currently disabled)                    |
| `src/assets/images/sponsors23,24,25/`  | 7     | not referenced by code (previous seasons)                         |
| `src/assets/images/Turingcup/`         | 6     | `landing_page_2.jpg` by `LandingPage` (orphan); rest unreferenced |
| `src/assets/events/*.md`               | 22    | events                                                            |
| `src/assets/newsletters/*.md`          | 29    | newsletters                                                       |
| `src/assets/*.json`, `src/lib/*.json`  | 6     | team, sponsors, ICPC timeline                                     |

No fonts, videos, PDFs or SVG files are stored in the repo.

Data quirks found (preserved, see §4):

- `team_data.json` references images by the **file name Gatsby emits** (`<name>.jpg` for `.jpg`/`.jpeg`/`.JPG` sources,
  `<name>.png` for PNG). E.g. `"jhansi.jpg"` resolves to `jhansi.jpeg`.
- `shoeb_2019.jpg` (Shoeb Moin, 2018-2019) has no file → card renders without a photo.
- `team/jaykumar_2018.jpg` is not referenced by any member.
- ICPC entry `2020-error404` has `imagePath: null` → card renders without an image.
- `sponsors23.json` / `sponsors24.json` reference `.png` names whose files are `.jpg` (not rendered anywhere).

### 1.7 External libraries, CDNs and embeds

| Library (old version)                                                                                                                                                                                       | Use                                                      |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------- |
| react / react-dom 18.3.1                                                                                                                                                                                    | UI                                                       |
| @mui/material 6.1.6, @mui/icons-material 6.1.6                                                                                                                                                              | all layout, components, icons                            |
| @emotion/react 11.13.3, @emotion/styled 11.13.0                                                                                                                                                             | MUI styling engine, `keyframes` in register page         |
| add-to-calendar-button 2.7.3                                                                                                                                                                                | `atcb_action` in `Landingpage2`                          |
| react-vertical-timeline-component 3.6.0                                                                                                                                                                     | `Timelinee`                                              |
| react-helmet 6.1.0                                                                                                                                                                                          | only in orphan `LandingPage1`                            |
| posthog-js 1.260.2 + gatsby-plugin-posthog 1.0.1                                                                                                                                                            | analytics                                                |
| gatsby 5 and its plugins                                                                                                                                                                                    | build, routing, data, images, markdown                   |
| firebase, react-hook-form, react-hot-toast                                                                                                                                                                  | only referenced from commented-out code in `register.js` |
| @mui/base, @mui/system, @mdx-js/react, dotenv, fs-extra, os-browserify, path-browserify, react-router-dom, gatsby-plugin-mdx, gatsby-plugin-env-variables, gatsby-plugin-posthog-analytics, CRA dev tooling | installed but not used by any rendered code              |

External URLs loaded at runtime:

- Google Fonts: `https://fonts.googleapis.com/css2?family=Gruppo&display=swap` (`@import` in `turingcup.css`).
- Custom cursor: `https://cur.cursors-4u.net/cursors/cur-11/cur1054.cur` (`global.css`, applied to `*`).
- Google Maps embed iframe on `/contact`.
- PostHog: `https://us.i.posthog.com`.
- Remote images inside newsletter markdown (googleusercontent, imgur, …).
- Orphan `LandingPage1` injected OwlCarousel / Counter-Up / jquery.countdown / jquery.lazy / ionicons / linearicons
  from CDNs through Helmet; none of them is used by any code (and jQuery itself is never loaded).

### 1.8 JavaScript behaviours

| Behaviour                                                                                                                                                                                       | Where                                |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------ |
| Mobile drawer open/close; active nav item by pathname; theme switch on Turing Cup paths                                                                                                         | Navbar, Layout, Footer               |
| Upcoming events: filter `date >= today`, sort ascending, long date format (client side)                                                                                                         | UpcomingEvents                       |
| Events directory: search by name, sort by Name/Date/Type (toggle asc/desc), pagination 10/15/20, table ↔ grid view toggle, status Today / Past Event / Upcoming Event, staggered `Grow` in grid | EventsTable                          |
| Newsletter directory: search by name or date, sort (date, then newsletter number), pagination                                                                                                   | NewslettersTable                     |
| Event page: date formatted after mount, link buttons only when not `NA`/empty                                                                                                                   | EventPage                            |
| Team: year `Select` (defaults to latest year), member count, image lookup by file name                                                                                                          | Team                                 |
| FAQ accordions: one panel open at a time                                                                                                                                                        | Faqs, TuringCup/Faqs                 |
| Turing Cup hero: SVG stroke animation (CSS keyframes); Register / Add-to-Calendar buttons shown only before `April 7, 2025 15:10`                                                               | Landingpage2                         |
| Previous editions: independent accordions, winners list, optional photo and report link                                                                                                         | PastContests                         |
| Countdown to `February 28, 2026 20:30` (1s interval)                                                                                                                                            | Timers (disabled)                    |
| Sponsor flip cards (CSS hover), modal (never opened)                                                                                                                                            | OurSponsors (disabled)               |
| Canvas particle text animation (`TextSparks`)                                                                                                                                                   | LandingPage1 (orphan)                |
| Image blur-up + fade-in, lazy loading                                                                                                                                                           | every `GatsbyImage`, markdown images |
| Hover transitions (cards scale/translate, icons, buttons), `pulse` keyframes on Redirect                                                                                                        | sx styles                            |
| Scroll to top on navigation, restore on back/forward                                                                                                                                            | Gatsby router                        |
| `$pageview` capture on every route change (production only)                                                                                                                                     | gatsby-plugin-posthog                |

### 1.9 API calls and env config

- **No live API calls.** The only network code is the Firestore registration flow in `pages/register.js`
  (collections `shortlists` and `payments`, via `.firebase/ConfigFirebase.js`), and it is **entirely commented out**. It
  also imports `date-fns`, which is not a dependency, so it could not have been re-enabled as is.
- Env vars: `GATSBY_POSTHOG_API_KEY` (live), `GATSBY_API_KEY`, `GATSBY_AUTH_DOMAIN`, `GATSBY_PROJECT_ID`,
  `GATSBY_STORAGE_BUCKET`, `GATSBY_MESSAGING_SENDER_ID`, `GATSBY_APP_ID` (Firebase, dead code only).
- Hardcoded config: site metadata in `gatsby-config.js`, PostHog host `https://us.i.posthog.com`.

### 1.10 State of the Turing Cup page

`pages/turingcup.js` keeps seasonal sections switched off with comments. Rendered today: `Landingpage2`, an empty `h3`,
`About`, a 50px spacer, `PastContests`, `Faqs`. Commented out: Register button, `RegisterForm`, `Timers`, `Timelinee`,
`TuringCupPrizePool`, `TuringCupSponsors`. `LandingPage` and `LandingPage1` are older hero variants that nothing imports.

Gatsby merges all imported CSS into one stylesheet and inlines it on every page whose code imports CSS. That is every
page that uses `Layout` (it imports `global.css`), so on those pages the CSS of the imported-but-unrendered components
(`SponsorsCard.css`, `react-vertical-timeline-component/style.min.css`) is present too, along with `LandingPage2.css`
(`svg text { … }`) and `turingcup.css` (Gruppo `@import`). `/register` and the 404 page import no CSS, so opened directly
they get **none** of it: default 8px body margin, no custom cursor, no Gruppo font. This was confirmed on the live site.
`LandingStyle.css` (orphan `LandingPage1`) and `headingstyles.css` (commented-out `Timers`) are not in the old bundle.

## 2. Plan

### 2.1 Stack

- Vite + `@vitejs/plugin-react`, JSX only, no TypeScript.
- React 18.3.1, MUI 6.1.6 and Emotion pinned to the exact versions resolved in the old lockfile, so every MUI component
  renders the same DOM and generates the same CSS as before.
- `react-router-dom` 6 (the `^6.28.0` range already listed in the old `package.json`) with a data router, for
  `<ScrollRestoration>`, route-level code splitting and loaders.
- `react-helmet-async` for per-page head tags; static head content in `index.html`.
- `vite-imagetools` (sharp) as the replacement for `gatsby-plugin-sharp`, driven by presets in `plugins/gatsbyImage.js`
  that reproduce Gatsby's sizes, crops, formats, `srcset`/`sizes` and placeholders.
- A local Vite plugin (`plugins/markdown.js`) compiles `*.md` at build time (frontmatter with `js-yaml`; body with
  `remark-parse` + `remark-gfm` + `remark-rehype` + `rehype-raw`) into an HTML syntax tree that is rendered to React
  elements with `hast-util-to-jsx-runtime`. This replaces `gatsby-transformer-remark` without `dangerouslySetInnerHTML`.
  - **Superseded:** the markdown (with its raw HTML, inline styles and `<br/>` line breaks) was later converted once
    into structured JSON posts in `src/content/{events,newsletters}/`, rendered by `components/PostBody.jsx` with MUI
    typography. `plugins/markdown.js`, `components/MarkdownContent.jsx` and the remark/rehype/unified/js-yaml
    dependencies are gone; `plugins/content.js` serves `post.json?meta` (a post without its body) for the listings,
    and the `remark` image preset is now `content`. `UpcomingEvents` now lists events only.
- `posthog-js`, loaded on demand and configured from `VITE_` env vars.

### 2.2 Target structure

```
th_new/
├─ index.html                     static <head>
├─ vite.config.js
├─ plugins/
│  ├─ gatsbyImage.js              image presets (replaces gatsby-plugin-sharp / gatsby-plugin-image queries)
│  └─ markdown.js                 *.md → { frontmatter, hast, images, heroImage }
├─ scripts/verify-migration.mjs   asset / reference / route checks against th_old
├─ public/favicon.ico
├─ .env.example
└─ src/
   ├─ main.jsx                    entry: HelmetProvider, analytics init
   ├─ App.jsx                     route table
   ├─ assets/                     same tree as th_old/src/assets (images, events, newsletters, json)
   ├─ lib/icpc-timeline-data.json
   ├─ data/                       lists that were inline in components, image indexes, Turing Cup switches
   ├─ styles/                     global.css, gatsby-image.css
   ├─ utils/                      content index, image helpers, site metadata, theme, analytics, paths
   ├─ hooks/
   ├─ components/                 shared + section components (+ TuringCup/)
   └─ pages/                      one component per route
```

### 2.3 Routing table

| Path                   | Page component                         | Layout | Title                       |
| ---------------------- | -------------------------------------- | ------ | --------------------------- |
| `/`                    | `pages/Index.jsx`                      | yes    | `Home \| Turing Hut`        |
| `/about/`              | `pages/About.jsx`                      | yes    | `About \| Turing Hut`       |
| `/contact/`            | `pages/Contact.jsx`                    | yes    | `Contact \| Turing Hut`     |
| `/events/`             | `pages/events/Index.jsx`               | yes    | `Events \| Turing Hut`      |
| `/events/<slug>/`      | `pages/events/EventPost.jsx`           | yes    | `<title> \| Turing Hut`     |
| `/icpc/`               | `pages/Icpc.jsx`                       | yes    | `ICPC Legacy \| Turing Hut` |
| `/newsletters/`        | `pages/newsletters/Index.jsx`          | yes    | `Turing Hut` (default)      |
| `/newsletters/<slug>/` | `pages/newsletters/NewsletterPost.jsx` | yes    | `Turing Hut` (default)      |
| `/team/`               | `pages/Team.jsx`                       | yes    | `Team \| Turing Hut`        |
| `/turingcup/`          | `pages/Turingcup.jsx`                  | yes    | `Turing Cup \| Turing Hut`  |
| `/register/`           | `pages/Register.jsx`                   | no     | `Register \| Turing Hut`    |
| anything else          | `pages/NotFound.jsx`                   | no     | `Not found`                 |

- `/events/<slug>/` and `/newsletters/<slug>/` are generated for every markdown document (51 slugs under each prefix,
  102 routes), exactly as the two Gatsby templates did. An unknown slug is a 404.
- React Router matches both `/x` and `/x/`. Internal links are emitted with a trailing slash, as Gatsby did.
- Every page and the layout are separate chunks, loaded on navigation (Gatsby also loaded a chunk and page data per
  page). Each markdown document is its own chunk and pulls in only the images it uses.

## 3. Final old → new mapping

### 3.1 Pages

| Old (`th_old/turing-hut-website/src`)                     | New (`th_new/src`)                                                                                      |
| --------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| `pages/index.js`                                          | `pages/Index.jsx`                                                                                       |
| `pages/about.js`                                          | `pages/About.jsx`                                                                                       |
| `pages/contact.js`                                        | `pages/Contact.jsx`                                                                                     |
| `pages/icpc.js`                                           | `pages/Icpc.jsx`                                                                                        |
| `pages/team.js`                                           | `pages/Team.jsx`                                                                                        |
| `pages/turingcup.js`                                      | `pages/Turingcup.jsx`, `data/turingCup.js` (section switches), `components/TuringCup/TuringCupHero.jsx` |
| `pages/register.js`                                       | `pages/Register.jsx` (page) + `components/TuringCup/RegisterForm.jsx` (form)                            |
| `pages/404.js`                                            | `pages/NotFound.jsx`                                                                                    |
| `pages/events/index.js`                                   | `pages/events/Index.jsx`                                                                                |
| `pages/events/{MarkdownRemark.frontmatter__slug}.js`      | `pages/events/EventPost.jsx` + `markdownRoutes("/events", …)` in `App.jsx`                              |
| `pages/newsletters/index.js`                              | `pages/newsletters/Index.jsx`                                                                           |
| `pages/newsletters/{MarkdownRemark.frontmatter__slug}.js` | `pages/newsletters/NewsletterPost.jsx` + `markdownRoutes("/newsletters", …)`                            |
| `export const Head` in each page                          | `<Seo>` rendered by the page (react-helmet-async)                                                       |
| GraphQL page queries                                      | route `loader` → `utils/content.js` → `plugins/markdown.js`                                             |

### 3.2 Components

| Old                                          | New                                                                                                      |
| -------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| `components/Layout.js`                       | `components/Layout.jsx` (route element with `<Outlet>`), `utils/theme.js`, `hooks/useIsTuringCupPage.js` |
| `components/Navbar.js`                       | `components/Navbar.jsx`, `components/NavDrawerContent.jsx`, `data/navItems.js`                           |
| `components/Footer.js`                       | `components/Footer.jsx`, `data/socialMediaItems.js`                                                      |
| `components/Seo.js`                          | `components/Seo.jsx`                                                                                     |
| `hooks/use-site-metadata.js`                 | `hooks/useSiteMetadata.js`, `utils/siteMetadata.js`                                                      |
| `components/Landing.js`                      | `components/Landing.jsx`                                                                                 |
| `components/Activities.js`                   | `components/Activities.jsx`, `data/activities.js`                                                        |
| `components/UpcomingEvents.js`               | `components/UpcomingEvents.jsx`                                                                          |
| `components/VisionMission.js`                | `components/VisionMission.jsx`                                                                           |
| `components/Faqs.js`                         | `components/Faqs.jsx`, `data/faqs.js`                                                                    |
| `components/Team.js`                         | `components/Team.jsx`, `data/teamImages.js`                                                              |
| `components/TeamCard.js`                     | `components/TeamCard.jsx`                                                                                |
| `components/EventsTable.js`                  | `components/EventsTable.jsx`, `components/EventGridCard.jsx`, `utils/eventStatus.js`                     |
| `components/EventPage.js`                    | `components/EventPage.jsx`, `components/MarkdownContent.jsx`, `components/MarkdownImage.jsx`             |
| `components/NewslettersTable.js`             | `components/NewslettersTable.jsx`                                                                        |
| `components/NewslettersPage.js`              | `components/NewslettersPage.jsx`                                                                         |
| `components/ICPC.js`                         | `components/ICPC.jsx`, `components/IcpcTimelineItem.jsx`, `data/icpcImages.js`                           |
| `components/ICPCImage.js`                    | `components/ICPCImage.jsx` (not mounted anywhere, as in the original)                                    |
| `components/TuringCup/About.js`              | `components/TuringCup/About.jsx`                                                                         |
| `components/TuringCup/Faqs.js`               | `components/TuringCup/Faqs.jsx`, `data/turingCupFaqs.js`                                                 |
| `components/TuringCup/Landingpage2.js`       | `components/TuringCup/Landingpage2.jsx`                                                                  |
| `components/TuringCup/PastContests.js`       | `components/TuringCup/PastContests.jsx`, `data/pastContests.js`, `data/winnersImages.js`                 |
| `components/TuringCup/Timelinee.js`          | `components/TuringCup/Timelinee.jsx`                                                                     |
| `components/TuringCup/Timers.js`             | `components/TuringCup/Timers.jsx`, `hooks/useCountdown.js`                                               |
| `components/TuringCup/TuringCupPrizePool.js` | `components/TuringCup/TuringCupPrizePool.jsx`                                                            |
| `components/TuringCup/TuringCupSponsors.js`  | `components/TuringCup/TuringCupSponsors.jsx`, `data/sponsorImages.js`                                    |
| `components/TuringCup/OurSponsors.js`        | `components/TuringCup/OurSponsors.jsx`                                                                   |
| `components/TuringCup/LandingPage.js`        | `components/TuringCup/LandingPage.jsx`                                                                   |
| `components/TuringCup/LandingPage1.js`       | `components/TuringCup/LandingPage1.jsx`, `hooks/useTextSparks.js`, `utils/TextSparks.js`                 |
| repeated Turing Cup heading / button styles  | `components/TuringCup/TuringCupHeading.jsx`, `components/TuringCup/styles.js`                            |

### 3.3 Gatsby features

| Gatsby                                                              | New                                                                                   |
| ------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| `gatsby` `<Link>`                                                   | `components/Link.jsx` (React Router link, trailing-slash URLs, `aria-current="page"`) |
| scroll reset / restore, focus wrapper, route announcer, `$pageview` | `components/Root.jsx`, `hooks/useRouteChange.js`, `hooks/usePageviewTracking.js`      |
| `allMarkdownRemark` / `markdownRemark`                              | `utils/content.js` (`markdownNodes`, `loadMarkdownBySlug`)                            |
| `gatsby-transformer-remark`                                         | `plugins/markdown.js` + `components/MarkdownContent.jsx`                              |
| `gatsby-remark-images`                                              | `?preset=remark` in `plugins/gatsbyImage.js` + `components/MarkdownImage.jsx`         |
| `<GatsbyImage>` / `<StaticImage>`                                   | `components/GatsbyImage.jsx` + `styles/gatsby-image.css`                              |
| `gatsbyImageData(...)` queries                                      | `?preset=constrained&…` and `?preset=placeholder&…` image imports                     |
| `fluid { srcSet }` (navbar logo)                                    | `?preset=fluid`                                                                       |
| `allFile(relativeDirectory …)`                                      | `import.meta.glob` in `data/teamImages.js`, `winnersImages.js`, `sponsorImages.js`    |
| `siteMetadata`                                                      | `utils/siteMetadata.js` (+ `.env`)                                                    |
| `gatsby-plugin-posthog`                                             | `utils/analytics.js`                                                                  |

### 3.4 Styles, assets and config

| Old                                                                                              | New                                                                     |
| ------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------- |
| `styles/global.css`                                                                              | `styles/global.css` (unchanged)                                         |
| `components/TuringCup/turingcup.css`, `LandingPage2.css`, `SponsorsCard.css`, `LandingStyle.css` | same paths (unchanged)                                                  |
| `react-vertical-timeline-component/style.min.css`                                                | same npm package, imported in `Layout.jsx`                              |
| styles injected by gatsby-plugin-image                                                           | `styles/gatsby-image.css`                                               |
| `src/assets/**` (images, markdown, JSON)                                                         | `src/assets/**` — identical tree and file names                         |
| `src/lib/icpc-timeline-data.json`                                                                | `src/lib/icpc-timeline-data.json`                                       |
| `static/favicon.ico`                                                                             | `public/favicon.ico`                                                    |
| `gatsby-config.js`                                                                               | `vite.config.js`, `utils/siteMetadata.js`, `index.html`, `.env.example` |
| `package.json` scripts (`develop`/`start`, `build`, `serve`, `format`)                           | `dev`, `build`, `preview`, `format` (+ `lint`, `verify`)                |
| `firebase.json`, `.firebaserc`                                                                   | same files; hosting now serves `dist/` with an SPA rewrite              |
| `.github/workflows/main.yml`                                                                     | `.github/workflows/main.yml` (builds `dist`, `VITE_POSTHOG_API_KEY`)    |
| `.prettierrc.js`, `.prettierignore`                                                              | `.prettierrc.json`, `.prettierignore`                                   |
| `.gitignore`, `README.md`                                                                        | rewritten for Vite                                                      |
| `GATSBY_POSTHOG_API_KEY`                                                                         | `VITE_POSTHOG_API_KEY`                                                  |

## 4. Deviations from the original, and why

Visible or behavioural:

1. **Title on `/newsletters/` and `/newsletters/<slug>/`.** The old pages define no title, so the browser tab shows the
   URL. They now show the site title, "Turing Hut". No page-specific title was invented.
2. **Footer "Contact Us" icon.** It was a plain `<a href="/contact">` (full page reload, then a redirect to
   `/contact/`). It is now a client-side link to `/contact/`.
3. **Meta tags on event pages.** The old template rendered `<Seo>` inside the page body, so the title worked but the
   description and `url` meta tags were not in `<head>`. They are now in `<head>` like on every other page.
4. **`<meta name="url">`.** Uses `https://turinghut.org/` from `th_old`'s `gatsby-config.js`. The live site currently
   outputs it without the trailing slash, so it was built from a slightly different config.
5. **Route announcement for screen readers.** Says "Navigated to <page title>". On the live site Gatsby reads the title
   before it is set and always falls back to "Navigated to new page at <path>".
6. **Analytics page views.** One `$pageview` per page view, sent from a route-change hook with PostHog's automatic
   capture turned off, so the first page is not counted twice. PostHog is loaded from the npm package, only in production builds with a
   key set, instead of the CDN snippet.
7. **Scroll position after navigation** is 0. On the live site it is 8px on some navigations (a side effect of
   Gatsby's focus handling).
8. **`react-router-dom` 6.30.6** instead of 6.28.0: the newest release inside the old `^6.28.0` range, taken because
   6.28.0 has high-severity advisories.

Markup-only changes with no visual effect (verified: identical element boxes against the live site):

9. Invalid nesting fixed, which removed React DOM-nesting warnings: the outer `<p>` in `TuringCup/About` is a `<div>`
   with the same style; the event body wrapper `Typography` renders a `<div>` instead of a `<p>`; the "click here"
   `Typography` in `PastContests` renders a `<span>`; the outer `Typography` in the legacy `LandingPage` hero is a `<div>`.
10. Invalid props fixed: `frameborder`/`allowfullscreen` → `frameBorder`/`allowFullScreen` on the map iframe;
    `webkitTextStroke*` → `WebkitTextStroke*`; the two `Grid`s in `TuringCup/Faqs` got the `item` prop MUI requires for
    `xs`/`md`; stray `m={…}` props on a `<div>` and on `Accordion` (which rendered as junk HTML attributes) removed;
    missing list `key`s added.
11. `GatsbyImage` output has no `<noscript>` fallback and no inline hydration `<script>` (both only make sense for
    server-rendered HTML). Markdown images get `title=""` like Gatsby's.
12. Image files: same pixel sizes, crops (sharp "attention"), `srcset` widths, `sizes`, webp variants and JPEG quality
    settings as Gatsby, but produced by a newer sharp, so the bytes differ slightly. Output file names are hashed by
    Vite (`/assets/<name>-<hash>.<ext>`) instead of `/static/<hash>/<hash>/<name>.<ext>`.

Preserved on purpose, although they look like bugs:

13. **`/register` and the 404 page have no global CSS when opened directly** (8px body margin, default cursor, Gruppo
    not loaded so the text falls back to the generic `cursive` font). This is exactly how the live site behaves, see
    §1.10. To give those pages the global styles, move the five CSS imports from `components/Layout.jsx` to
    `main.jsx`.
14. Small team photos (narrower than 350px) are stretched to the card width, as on the live site.
15. The events directory sorts "ascending" with the newest/highest first, any header click flips the direction, the
    table's pagination counts unfiltered rows, and searching does not reset the page. All unchanged.
16. `/events/<newsletter slug>/` and `/newsletters/<event slug>/` exist, as in the original.
17. `UpcomingEvents` includes newsletters dated in the future, as in the original (it reads every markdown document).
18. The newsletter page always shows `newsletter/img.jpeg` as its banner, whatever the frontmatter `image` is.
19. Horizontal overflow of 24px on the home page (MUI legacy `Grid` negative margins) is unchanged.
20. `id="panel1a-header"` / `aria-controls="panel1a-content"` are repeated on every "Previous editions" accordion.

Code-level changes (same rendered output):

- Turing Cup sections that were commented out in `pages/turingcup.js` are driven by flags in `src/data/turingCup.js`
  (all `false`, matching the original). Every section and all three hero variants were rendered once in the dev server
  with the flags on to confirm they work.
- `useEffect` + `setState` used to compute derived lists after hydration became direct computation (`useMemo` / module
  constants); the events list keeps its sort-in-place semantics through state.
- `Timers`: the interval is now cleared on unmount (the original leaked it).
- `LandingPage1`: the `TextSparks` engine takes the canvas and its text data as arguments instead of querying the DOM;
  the hidden `.sparkle` lists are still rendered.
- Data arrays moved out of components into `src/data`; the duplicated light/dark navbar markup was merged.
- Debug `console.log`s removed.

## 5. Not migrated

| Item                                                                                                                                                                                                                          | Reason                                                                                                                                                                                                                                                                                                                                                                                          |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Firestore registration flow in `pages/register.js` and `.firebase/ConfigFirebase.js` (collections `shortlists`, `payments`; fields `email`, `teamName`, `leaderName`, `phoneNumber`, `collegeName`, `transactionId`)          | Entirely commented out in the original, and it imports `date-fns`, which was never a dependency. Porting it would mean shipping untested code plus `firebase`, `react-hook-form` and `react-hot-toast`. The `GATSBY_API_KEY`, `GATSBY_AUTH_DOMAIN`, `GATSBY_PROJECT_ID`, `GATSBY_STORAGE_BUCKET`, `GATSBY_MESSAGING_SENDER_ID`, `GATSBY_APP_ID` env vars therefore have no `VITE_` counterpart. |
| `components/TuringCup/headingstyles.css`                                                                                                                                                                                      | Imported only by the disabled `Timers`. Its three rules cannot match anything (no element has class `one`; two of the selectors are invalid CSS, which also fails the CSS minifier).                                                                                                                                                                                                            |
| CDN links in `LandingPage1` (OwlCarousel, Counter-Up, jquery.countdown, jquery.lazy, ionicons, linearicons)                                                                                                                   | Unused: no code calls them, and jQuery itself was never loaded.                                                                                                                                                                                                                                                                                                                                 |
| Modal in `OurSponsors` and its `isFlipped` state                                                                                                                                                                              | Unreachable: nothing ever opened the modal. The flip card itself is ported.                                                                                                                                                                                                                                                                                                                     |
| Other commented-out code (old register button variants, commented FAQ entries, the 2020 contest entry, commented nav item "Contact", commented activity "Hands-on Workshops")                                                 | Dead in the original.                                                                                                                                                                                                                                                                                                                                                                           |
| `gatsby-plugin-mdx`, `@mdx-js/react`, `@mui/base`, `@mui/system`, `dotenv`, `fs-extra`, `os-browserify`, `path-browserify`, `gatsby-plugin-env-variables`, `gatsby-plugin-posthog-analytics`, `react-helmet`, CRA dev tooling | Not used by any rendered code (or replaced: `react-helmet` → `react-helmet-async`).                                                                                                                                                                                                                                                                                                             |
| `.npmrc` (`legacy-peer-deps=true`)                                                                                                                                                                                            | Not needed: the dependency tree installs without peer conflicts.                                                                                                                                                                                                                                                                                                                                |
| `id`, `.DS_Store` files, `.firebase/hosting.cHVibGlj.cache`                                                                                                                                                                   | Stray `git branch` output, macOS junk and a generated deploy cache.                                                                                                                                                                                                                                                                                                                             |
| `<meta name="generator" content="Gatsby …">`                                                                                                                                                                                  | No longer true.                                                                                                                                                                                                                                                                                                                                                                                 |
| Static HTML per page (SSR)                                                                                                                                                                                                    | The site is now a client-rendered SPA. `firebase.json` rewrites all paths to `index.html`. Pages no longer have server-rendered HTML for crawlers that do not run JavaScript.                                                                                                                                                                                                                   |

Data gaps that exist in the original and are unchanged: no photo file for "Shoeb Moin" (`shoeb_2019.jpg`);
`team/jaykumar_2018.jpg`, `images/Turingcup/*` (except `landing_page_2.jpg`), `sponsors23`–`25` images and JSON are not
referenced by rendered code (they are kept in `src/assets` but, as with Gatsby, not published).

## 6. Verification

All of this was run against the production build (`npm run build` + `npm run preview`) unless noted.

| Check                                                                                                                                                                                                                                                                                                                                                                                                | Result                                                                                                         |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| `npm run build`                                                                                                                                                                                                                                                                                                                                                                                      | no errors, no warnings                                                                                         |
| `npm run lint`                                                                                                                                                                                                                                                                                                                                                                                       | clean                                                                                                          |
| `npm run verify` — every old asset exists in `th_new`, byte-identical                                                                                                                                                                                                                                                                                                                                | 295 / 295                                                                                                      |
| `npm run verify` — asset references in code, JSON data and markdown resolve                                                                                                                                                                                                                                                                                                                          | 268 / 268 (1 note: `shoeb_2019.jpg`, missing in the original too)                                              |
| `npm run verify -- --url …` — every old route exists and responds                                                                                                                                                                                                                                                                                                                                    | 111 / 111                                                                                                      |
| Console errors/warnings, failed requests, broken images on all 64 routes (production)                                                                                                                                                                                                                                                                                                                | none                                                                                                           |
| Same on the dev server (development React, all top-level pages at 1440 / 820 / 390px)                                                                                                                                                                                                                                                                                                                | none                                                                                                           |
| Structure vs the **live site** (turinghut.org): element tree, CSS classes incl. generated emotion hashes, attributes, inline styles, image `srcset`/`sizes`, element boxes, text, page height — all 11 top-level pages at 1440, 820 and 390px                                                                                                                                                        | identical apart from §4 items 1–4, 9–11                                                                        |
| Same for all 51 event and newsletter pages at 1440px, and a sample of them at 390px                                                                                                                                                                                                                                                                                                                  | identical apart from §4 items 1, 3, 9, 11                                                                      |
| Full-page screenshot pixel diff vs live (15 pages × 2 widths)                                                                                                                                                                                                                                                                                                                                        | 0.00% on most pages; the rest is animation phase (Turing Cup hero, register button) and JPEG/PNG encoder noise |
| Scripted interaction walkthrough run on both live and new, outputs diffed: nav links, active state, theme switch, events search / sort / pagination / rows-per-page / grid view / card link, newsletter search / sort / pagination, team year select and counts, FAQ accordions, previous-editions accordions, footer links and tooltip, back button, mobile drawer open / navigate / backdrop close | identical apart from §4 items 1, 2, 7                                                                          |
| Focus moves to the page wrapper after navigation                                                                                                                                                                                                                                                                                                                                                     | same as live                                                                                                   |
| Disabled Turing Cup sections and the two alternate heroes (dev server, flags temporarily on)                                                                                                                                                                                                                                                                                                         | all render, no console errors                                                                                  |

Not verified:

- The old site was not built locally (Gatsby 5 was not installed); the live site was used as the reference instead.
  It is the same code except for small config differences (§4 item 4).
- PostHog events were not sent (no API key available).
- "Add to Calendar" in `Landingpage2` was not clicked: the buttons only render before 7 April 2025, as in the original.
- Firebase deployment and the GitHub workflow were not run.
- Browsers other than Chromium (Edge) were not tested.

## 7. Open items for the maintainers

- `npm audit` reports 2 moderate advisories in `react-router` 6 (open redirect through attacker-controlled link
  targets; an SSR-only issue). Neither is reachable here (all link targets are static, there is no SSR). The fix is
  React Router 7, a major upgrade.
- The workflow file must be at the repository root (`.github/workflows/`) to run, and needs the
  `VITE_POSTHOG_API_KEY` and `FIREBASE_TOKEN` secrets.
- Decide whether to keep item 13 of §4 (unstyled `/register` and 404 when opened directly).
