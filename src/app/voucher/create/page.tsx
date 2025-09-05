import Breadcrumb from "@/components/Breadcrumb";
import VoucherForm from "@/components/voucher/VoucerForm";
import MasterLayout from "@/masterLayout/MasterLayout";

export default function Page() {
  return (
    <MasterLayout>
      <Breadcrumb
        title="Voucher"
        icon="ri:coupon-2-fill"
        breadcrumb={[
          {label: 'Voucher', href: '/voucher'  },
          {label: 'Buat Voucher', href: '/voucher/create' ,active:true }
        ]}
      />
      <VoucherForm />
    </MasterLayout>
  )
}