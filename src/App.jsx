import { Helmet } from "react-helmet-async";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Root from "./components/Root";
import NotFound from "./pages/NotFound";
import { loadPost, postSlugs } from "./utils/content";
import siteMetadata from "./utils/siteMetadata";

const page = load => () =>
  load().then(module => ({ Component: module.default }));

// One route per post (event or newsletter) under `basePath`, as Gatsby
// generated from `{MarkdownRemark.frontmatter__slug}.js`. Any other slug falls
// through to the 404 route.
const postRoutes = (basePath, lazy) =>
  postSlugs.map(slug => ({
    path: `${basePath}/${slug}`,
    loader: () => loadPost(slug),
    lazy
  }));

const router = createBrowserRouter(
  [
    {
      element: <Root />,
      hydrateFallbackElement: <></>,
      children: [
        {
          lazy: page(() => import("./components/Layout")),
          children: [
            { path: "/", lazy: page(() => import("./pages/Index")) },
            { path: "/about", lazy: page(() => import("./pages/About")) },
            { path: "/contact", lazy: page(() => import("./pages/Contact")) },
            {
              path: "/events",
              lazy: page(() => import("./pages/events/Index"))
            },
            ...postRoutes(
              "/events",
              page(() => import("./pages/events/EventPost"))
            ),
            { path: "/icpc", lazy: page(() => import("./pages/Icpc")) },
            {
              path: "/newsletters",
              lazy: page(() => import("./pages/newsletters/Index"))
            },
            ...postRoutes(
              "/newsletters",
              page(() => import("./pages/newsletters/NewsletterPost"))
            ),
            {
              path: "/team",
              // The page renders as soon as its code is loaded; the photos it
              // opens with start downloading alongside it and appear as they
              // arrive, so navigation never waits for them.
              lazy: () => {
                import("./data/teamImages").then(
                  ({ preloadInitialTeamImages }) => preloadInitialTeamImages(),
                  () => {}
                );
                return page(() => import("./pages/Team"))();
              }
            },
            {
              path: "/turingcup",
              lazy: page(() => import("./pages/Turingcup"))
            }
          ]
        },
        { path: "/register", lazy: page(() => import("./pages/Register")) },
        { path: "*", element: <NotFound /> }
      ]
    }
  ],
  {
    future: {
      v7_fetcherPersist: true,
      v7_normalizeFormMethod: true,
      v7_partialHydration: true,
      v7_relativeSplatPath: true,
      v7_skipActionErrorRevalidation: true
    }
  }
);

export default function App() {
  return (
    <>
      <Helmet defaultTitle={siteMetadata.title} />
      <RouterProvider router={router} future={{ v7_startTransition: true }} />
    </>
  );
}
