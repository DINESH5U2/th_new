import EventsShowcase from "../../components/EventsShowcase";
import { Seo } from "../../components/Seo";

export default function EventsPage() {
  return (
    <>
      <Seo routename={"Events"} />
      <EventsShowcase />
    </>
  );
}
