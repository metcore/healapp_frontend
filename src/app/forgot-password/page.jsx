import ForgotPasswordForm from "@/components/forgot-password/ForgotPasswordForm";
import { ToastContainer } from "react-toastify";

export const metadata = {
  title: "Heal App - Forgot Password",
  description:
    "Wowdash NEXT JS is a developer-friendly, ready-to-use admin template designed for building attractive, scalable, and high-performing web applications.",
};

const Page = () => {
  return (
    <>
      {/* ForgotPasswordLayer */}
      <ToastContainer />
      <ForgotPasswordForm />
    </>
  );
};

export default Page;
