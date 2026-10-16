import { Helmet } from "react-helmet-async";
import siteMetadata from "../utils/siteMetadata";

export const Seo = ({ title, description, pathname, routename }) => {
  const {
    title: defaultTitle,
    description: defaultDescription,
    siteUrl
  } = siteMetadata;

  const seo = {
    title: `${routename + ` | ` || ``}${title || defaultTitle}`,
    description: description || defaultDescription,
    url: `${siteUrl}${pathname || ``}`
  };
  return (
    <Helmet>
      <title>{seo.title}</title>
      <meta name="description" content={seo.description} />
      <meta name="url" content={seo.url} />
    </Helmet>
  );
};
