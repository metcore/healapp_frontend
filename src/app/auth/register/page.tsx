
import RegisterLayer from "@/components/auth/register/RegisterLayer";
import Header from "@/masterLayout/Header";
import { ToastContainer } from "react-toastify";
export const metadata = {
  title: `${process.env.NEXT_PUBLIC_APP_NAME} - Pendaftaran akun`,
  description:
    `${process.env.NEXT_PUBLIC_APP_NAME} is a developer-friendly, ready-to-use admin template designed for building attractive, scalable, and high-performing web applications.`,
};
export default function Page() {
  return (
    <section >
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
        <Header />
        <RegisterLayer />
      </section>
  );
}
