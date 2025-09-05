import Breadcrumb from "@/components/Breadcrumb";
import Card from "@/components/primitive/card/Card";
import ProductList from "@/components/product/ProductList";
import MasterLayout from "@/masterLayout/MasterLayout";

export const metadata = {
  title: "Data Treatment",
  description:
    "Data Treatment.",
};

const Page = () => {
  return (
    <>
      {/* MasterLayout */}
      <MasterLayout>
        {/* Breadcrumb */}
        <Breadcrumb title='Produk' hint="Kelola produk anda disini" />

        {/* product */}
        <ProductList />
      </MasterLayout>
    </>
  );
};

export default Page;
