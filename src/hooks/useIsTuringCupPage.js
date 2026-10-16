import { useLocation } from "react-router-dom";
import { isTuringCupPath } from "../utils/paths";

export default function useIsTuringCupPage() {
  const location = useLocation();
  return isTuringCupPath(location.pathname);
}
