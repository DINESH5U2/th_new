import Hero from "../components/home/Hero";
import JoinCta from "../components/home/JoinCta";
import NewsletterTeaser from "../components/home/NewsletterTeaser";
import StatsBand from "../components/home/StatsBand";
import { Seo } from "../components/Seo";

function IndexPage() {
  return (
    <>
      <Seo routename={"Home"} />
      <Hero />
      <StatsBand />
      <NewsletterTeaser />
      <JoinCta />
    </>
  );
}

export default IndexPage;
