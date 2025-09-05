import Breadcrumb from "@/components/Breadcrumb";
import PatientListLayer from "@/components/patient/PatientListLayer";
import MasterLayout from "@/masterLayout/MasterLayout";

export const metadata = {
  title: "Data Pasien",
};

const Page = () => {
  return (
    <>
      {/* MasterLayout */}
      <MasterLayout>
        {/* Breadcrumb */}
        <Breadcrumb title='Pasien' />

        {/* InvoiceListLayer */}
        <PatientListLayer />
      </MasterLayout>
    </>
  );
};

export default Page;
