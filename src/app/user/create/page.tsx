import Breadcrumb from "@/components/Breadcrumb";
import UserForm from "@/components/user/UserForm";
import UsersListLayer from "@/components/UsersListLayer";
import MasterLayout from "@/masterLayout/MasterLayout";

export const metadata = {
  title: "WowDash NEXT JS - Admin Dashboard Multipurpose Bootstrap 5 Template",
  description:
    "Wowdash NEXT JS is a developer-friendly, ready-to-use admin template designed for building attractive, scalable, and high-performing web applications.",
};

const Page = () => {
  return (
    <>
      {/* MasterLayout */}
      <MasterLayout>
        {/* Breadcrumb */}
        <Breadcrumb title='Buat Pengguna' />

        {/* UsersListLayer */}
        <UserForm />
      </MasterLayout>
    </>
  );
};

export default Page;
