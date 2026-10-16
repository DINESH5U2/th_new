import Faqs from "../components/Faqs";
import VisionMission from "../components/VisionMission";
import { Seo } from "../components/Seo";

export default function AboutPage() {
  return (
    <>
      <Seo routename={"About"} />
      <VisionMission />
      <Faqs />
    </>
  );
}
