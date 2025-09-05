import Breadcrumb from "@/components/Breadcrumb";
import InventoryList from "@/components/inventory/InventoryList";
import MasterLayout from "@/masterLayout/MasterLayout";

export default function page(){
  return(
    <MasterLayout>
      <Breadcrumb  title={"Inventory"} icon={"mdi:warehouse"}/>
      <InventoryList />
    </MasterLayout>
  )
}