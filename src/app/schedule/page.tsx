'use client'
import Breadcrumb from "@/components/Breadcrumb";
import ScheduleResource from "@/components/schedule/ScheduleResource";
import MasterLayout from "@/masterLayout/MasterLayout";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

export default function page() {
   return(
      <MasterLayout>
         <Breadcrumb title="Jadwal Kerja" />
             <DndProvider backend={HTML5Backend}>

         <ScheduleResource />
         </DndProvider>
         {/* <ScheduleList /> */}
      </MasterLayout>
   )
}