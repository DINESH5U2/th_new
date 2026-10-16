import { useLoaderData } from "react-router-dom";
import EventPage from "../../components/EventPage";
import { Seo } from "../../components/Seo";

const EventPost = () => {
  const post = useLoaderData();

  return (
    <>
      <EventPage post={post} />
      <Seo routename={post.title} />
    </>
  );
};

export default EventPost;
