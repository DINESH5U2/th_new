import { useLoaderData } from "react-router-dom";
import NewslettersPage from "../../components/NewslettersPage";
import { Seo } from "../../components/Seo";

const NewsletterPost = () => {
  const post = useLoaderData();

  return (
    <>
      <NewslettersPage post={post} />
      <Seo
        routename={`Newsletter · Edition ${post.slug}`}
        description={post.summary.excerpt}
      />
    </>
  );
};

export default NewsletterPost;
