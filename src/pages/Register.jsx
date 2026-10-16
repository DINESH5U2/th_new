import { Seo } from "../components/Seo";
import RegisterForm from "../components/TuringCup/RegisterForm";

export default function Register() {
  return (
    <>
      <Seo routename={"Register"} />
      <RegisterForm />
    </>
  );
}
