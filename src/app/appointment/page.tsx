import AppointmentLayer from "@/components/appointment/AppointmentLayer";
import MasterLayout from "@/masterLayout/MasterLayout";

export default function page() {
  return(
    <MasterLayout>
      <AppointmentLayer />
    </MasterLayout>
  )
}