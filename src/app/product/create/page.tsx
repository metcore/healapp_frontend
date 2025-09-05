import Breadcrumb from "@/components/Breadcrumb";
import Card from "@/components/primitive/card/Card";
import InputFile from "@/components/primitive/input-file/InputFile";
import Input from "@/components/primitive/input/Input";
import Select from "@/components/primitive/select/Select";
import ProductForm from "@/components/product/ProductForm";
import MasterLayout from "@/masterLayout/MasterLayout";

export const metadata = {
  title: "Buat Produk",
  description:
    "Data produk.",
};

export default function page() {
  return (
    <MasterLayout>
      <Breadcrumb
        title="Buat Item"
        icon="mdi:library"
          breadcrumb={[
          { label: 'Item', href: '/product' },
          {
            label: 'Buat Item',
            href: '/product/create',
            active: true,
          },
        ]}
      />

      {/* <Breadcrumb title='Buat Produk' /> */}
      <ProductForm />
    </MasterLayout>
  )
}