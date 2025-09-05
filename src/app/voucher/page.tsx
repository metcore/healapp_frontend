import Breadcrumb from "@/components/Breadcrumb";
import VoucherList from "@/components/voucher/VoucherList";
import MasterLayout from "@/masterLayout/MasterLayout";

export default function Page(){
  return(
    <MasterLayout>
      <Breadcrumb
        title="Voucher"
        icon="ri:coupon-2-fill"
        breadcrumb={[
          {label: 'Voucher', href: '/voucher' ,active:true }
        ]}
      />
      <VoucherList />
    </MasterLayout>
  )
}