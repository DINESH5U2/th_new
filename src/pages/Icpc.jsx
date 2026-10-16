import ICPC from "../components/ICPC";
import { Seo } from "../components/Seo";

export default function IcpcPage() {
  return (
    <>
      <Seo routename={"ICPC Legacy"} />
      <ICPC />
    </>
  );
}
