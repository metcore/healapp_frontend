'use client'
import React, { useState } from "react";
import {
  Scheduler,
  SchedulerData,
  ViewType,
  DATE_FORMAT,
} from "react-big-schedule";
import "react-big-schedule/dist/css/style.css";
import dayjs from "dayjs";

// Komponen utama
export default function SchedulerExample() {
  // Buat instance SchedulerData (view = Weekly)
  const [schedulerData] = useState(
    new SchedulerData(dayjs().format(DATE_FORMAT), ViewType.Week, false, false)
  );

  // Atur resources (baris)
  schedulerData.setResources([
    { id: "r1", name: "Dokter A" },
    { id: "r2", name: "Dokter B" },
    { id: "r3", name: "Ruang 101" },
  ]);

  // Atur events (jadwal)
  schedulerData.setEvents([
    {
      id: 1,
      start: dayjs().hour(9).minute(0).format("YYYY-MM-DD HH:mm:ss"),
      end: dayjs().hour(10).minute(30).format("YYYY-MM-DD HH:mm:ss"),
      resourceId: "r1",
      title: "Pasien 001",
      bgColor: "#D9D9D9",
      resizable: true,
      movable: true,
    },
    {
      id: 2,
      start: dayjs().add(1, "day").hour(13).minute(0).format("YYYY-MM-DD HH:mm:ss"),
      end: dayjs().add(1, "day").hour(14).minute(30).format("YYYY-MM-DD HH:mm:ss"),
      resourceId: "r2",
      title: "Konsultasi Pasien 002",
      bgColor: "#77DD77",
      resizable: true,
      movable: true,
    },
  ]);

  // Handler klik event
  const onEventClick = (schedulerData, event) => {
    alert(`Klik event: ${event.title} (Resource: ${event.resourceId})`);
  };

  // Handler navigasi
  const prevClick = (schedulerData) => {
    schedulerData.prev();
    schedulerData.setEvents(schedulerData.events);
  };

  const nextClick = (schedulerData) => {
    schedulerData.next();
    schedulerData.setEvents(schedulerData.events);
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Demo Resource Calendar - React Big Schedule</h2>
      <Scheduler
        schedulerData={schedulerData}
        prevClick={prevClick}
        nextClick={nextClick}
        movable={true}
        resizable={true}
      />
    </div>
  );
}
