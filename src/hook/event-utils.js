
let eventGuid = 0
let todayStr = new Date().toISOString().replace(/T.*$/, '') // YYYY-MM-DD of today
console.log("tes",todayStr)
export const INITIAL_EVENTS = [
  {
    id: createEventId(),
    title:"Appointment",
    start: "2025-08-04T116:00:00",
    end: "2025-08-04T17:00:00",
    classNames: ['warning'],
          display: 'background',

    extendedProps: {
      pasien: { name: 'Slamet Riyad23123i' },
      branch: { name: "Lipo Mall Puri" },
      doctor: { name: "Dr Meliza" },
      type: "warning", // opsional, bisa untuk class juga
      tujuan:"konsul",
    }
  },
  {
    id: createEventId(),
    title:"Appointment",
    start: "2025-08-04T12:00:00",
    end: "2025-08-04T15:00:00",
    classNames: ['warning'],
    extendedProps: {
      pasien: { name: 'Slamet Riyadi' },
      branch: { name: "Lipo Mall Puri" },
      doctor: { name: "Dr Meliza" },
      type: "warning", // opsional, bisa untuk class juga
      tujuan:"konsul",
    }
  },
  {
    id: createEventId(),
    title:"Appointment",
    start: "2025-08-04T14:00:00",
    classNames: ['warning'],
    extendedProps: {
      pasien: { name: 'Slamet Riyadi' },
      branch: { name: "Lipo Mall Puri" },
      doctor: { name: "Dr Slamet Riyadi Sp kk" },
      type: "warning",
      tujuan:"Treatment",
    }
  },
  {
    id: createEventId(),
    title:"Appointment",
    start: "2025-08-07T14:00:00",
    classNames: ['warning'],
    extendedProps: {
      pasien: { name: 'Slamet Riyadi' },
      branch: { name: "Lipo Mall Puri" },
      doctor: { name: "Dr Slamet Riyadi Sp kk" },
      type: "warning",
      tujuan:"treatment",
    }
  },


  {
    id: createEventId(),
    title: ' tes Timed event',
    start: "2025-08-05" + 'T12:00:00'
  },
  {
    id: createEventId(),
    title: ' tes Timed event',
    start: "2025-08-05" + 'T12:00:00'
  }
]

export function createEventId() {
    return String(eventGuid++)
}
