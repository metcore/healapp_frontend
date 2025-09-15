import Breadcrumb from "@/components/Breadcrumb";
import ErrorLayer from "@/components/ErrorLayer";
import Header from "@/masterLayout/Header";
import MasterLayout from "@/masterLayout/MasterLayout";

export default function NotFound() {
  return (
    <>
      {/* MasterLayout */}
      <Header/>
        {/* ErrorLayer */}
      <ErrorLayer />
    </>
  );
}
