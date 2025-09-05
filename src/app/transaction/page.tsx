import Breadcrumb from "@/components/Breadcrumb";
import TransactionLayer from "@/components/transaction/TransactionList";
import MasterLayout from "@/masterLayout/MasterLayout";

export default function page() {
  return(
    <MasterLayout>
      <Breadcrumb title={"Transaksi"} icon="mdi:money" />
      <TransactionLayer />
    </MasterLayout>
  )
}