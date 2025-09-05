
import RegisterLayer from "@/components/auth/register/RegisterLayer";
import Header from "@/masterLayout/Header";
export const metadata = {
  title: `${process.env.NEXT_PUBLIC_APP_NAME} - Pendaftaran akun`,
  description:
    `${process.env.NEXT_PUBLIC_APP_NAME} is a developer-friendly, ready-to-use admin template designed for building attractive, scalable, and high-performing web applications.`,
};
export default function Page() {
  return (
    <>
      <Header />
      <RegisterLayer />
    </>
  );
}
