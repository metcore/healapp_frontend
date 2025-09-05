import Breadcrumb from "@/components/Breadcrumb";
import RoomList from "@/components/room/RoomList";
import MasterLayout from "@/masterLayout/MasterLayout";

export default function page() {
  return(
    <MasterLayout>
      <Breadcrumb title="Room" hint="Kelola kamar operasi, ICU, rawat inap, poliklinik, dan fasilitas klinis lainnya. Mendukung multi-bed per ruangan"/>
      <RoomList />
    </MasterLayout>
  )
}