import Breadcrumb from "@/components/Breadcrumb";
import CommissionList from "@/components/commission/CommissionList";
import MasterLayout from "@/masterLayout/MasterLayout";

export default function Page(){
  return(
    <MasterLayout>
      <Breadcrumb
        title="Komisi"
        icon="ri:coupon-2-fill"
        breadcrumb={[
          {label: 'Komisi', href: '/commission' ,active:true }
        ]}
      />
      <CommissionList />
    </MasterLayout>
  )
}