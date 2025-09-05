import Breadcrumb from "@/components/Breadcrumb";
import PatientDetailLayer from "@/components/patient/PatientDetailLayer";
import MasterLayout from "@/masterLayout/MasterLayout";

export const metadata = {
  title: "Dianne Russel",
  description:
    "Dianne Russel",
};

const Page = () => {
  return (
    <MasterLayout>
      <Breadcrumb title='Pasien' />
      <PatientDetailLayer />
    </MasterLayout>
  );
};

export default Page;
