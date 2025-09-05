import Breadcrumb from "@/components/Breadcrumb";
import TransactionPayment from "@/components/transaction/TransactionPayment";
import MasterLayout from "@/masterLayout/MasterLayout";

export default function Page() {
  return (
    <MasterLayout>
      <Breadcrumb title={"Payment"}/>
      <TransactionPayment />
    </MasterLayout>
  )
}