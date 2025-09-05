import Breadcrumb from "@/components/Breadcrumb";
import ScheduleList from "@/components/shift/ShiftList";
import MasterLayout from "@/masterLayout/MasterLayout";

export default function page() {
  return (
    <MasterLayout>
      <Breadcrumb title="Master Shift" icon="mdi:clock" />
      <ScheduleList />
    </MasterLayout>
  )
}