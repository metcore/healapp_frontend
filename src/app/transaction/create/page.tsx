import Breadcrumb from "@/components/Breadcrumb";
import TransactionForm from "@/components/transaction/TransactionForm";
import MasterLayout from "@/masterLayout/MasterLayout";

export default function page() {
  return (
    <MasterLayout>
      <Breadcrumb
        title="Buat transaksi"
      />
      <TransactionForm />
    </MasterLayout>
  )
}