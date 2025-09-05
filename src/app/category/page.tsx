import Breadcrumb from "@/components/Breadcrumb";
import CategoryList from "@/components/category/CategoryList";
import MasterLayout from "@/masterLayout/MasterLayout";

export default function page(){
  return (
    <MasterLayout>
      <Breadcrumb title={"Kategori"} />
      <CategoryList />
    </MasterLayout>
  )
}