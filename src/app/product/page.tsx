import Breadcrumb from "@/components/Breadcrumb";
import Card from "@/components/primitive/card/Card";
import ProductList from "@/components/product/ProductList";
import ProductIndexSkeleton from "@/components/product/skeleton/ProductIndexSkeleton";
import MasterLayout from "@/masterLayout/MasterLayout";
import { Suspense } from "react";

export const metadata = {
  title: "Data Produk",
  description:
    "Data produk.",
};

const Page = () => {
  return (
    <>
      {/* MasterLayout */}
      <MasterLayout>
        {/* Breadcrumb */}
        <Breadcrumb
          title="Item"
          icon="mdi:library"
          breadcrumb={[
            {label: 'Item', href: '/item' ,active:true }
          ]}
        />
        {/* product */}
        <Suspense fallback={<ProductIndexSkeleton />}>
        <ProductList />
        </Suspense>
      </MasterLayout>
    </>
  );
};

export default Page;
