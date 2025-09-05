import Breadcrumb from "@/components/Breadcrumb";
import ComissionForm from "@/components/commission/CommissionForm";
import VoucherForm from "@/components/voucher/VoucerForm";
import MasterLayout from "@/masterLayout/MasterLayout";

export default function Page() {
  return (
    <MasterLayout>
      <Breadcrumb
        title="Voucher"
        icon="ri:coupon-2-fill"
        breadcrumb={[
          {label: 'Komisi', href: '/commission'  },
          {label: 'Buat Komisi', href: '/commission/create' ,active:true }
        ]}
      />
      <ComissionForm /> 
    </MasterLayout>
  )
}