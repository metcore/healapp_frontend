"use client";

import { useMemo, useState, useEffect } from "react";
import Card from "../primitive/card/Card";
import Input from "../primitive/input/Input";
import Select from "../primitive/select/Select";
import { Modal } from "react-bootstrap";
import TextArea from "../primitive/textarea/TextArea";
import RoomForm from "./RoomForm";

// ✅ Halaman Manajemen Ruangan RS/Klinik (Bootstrap 5) dengan multi-bed per ruangan
// Cara setup Bootstrap (App Router):
// 1) npm i bootstrap
// 2) Import CSS di app/layout.tsx: import "bootstrap/dist/css/bootstrap.min.css";
// 3) (Opsional) JS: useEffect(() => import("bootstrap/dist/js/bootstrap.bundle.min.js"), [])
// 4) (Opsional) Icons: <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css" />

// === Types ===
export type RoomStatus = "available" | "occupied" | "cleaning" | "maintenance";
export type SanitationStatus = "Bersih" | "Sedang Dibersihkan" | "Perlu Disinfeksi";
export type RoomType =
  | "Poliklinik"
  | "UGD"
  | "Rawat Inap"
  | "ICU"
  | "OK" // Kamar Operasi
  | "Radiologi"
  | "Laboratorium"
  | "Vaksinasi"
  | "Perawatan Luka";

export type Equipment =
  | "Ventilator"
  | "USG"
  | "EKG"
  | "X-Ray"
  | "Infusion Pump"
  | "Defibrillator"
  | "Monitor Pasien"
  | "Negative Pressure"
  | "Incubator";

export type BedStatus = "available" | "occupied" | "cleaning" | "maintenance";
export type BedSanitation = SanitationStatus;

export type Bed = {
  id: string;           // unique bed id (eg. RS-A12-B1)
  label: string;        // eg. "Bed 1"
  status: BedStatus;    // per-bed status
  sanitation: BedSanitation; // per-bed sanitasi
  patientName?: string; // if occupied
  mrn?: string;         // medical record number (optional)
  nextAvailable?: string; // ISO time when bed ready
  notes?: string;
};

export type Room = {
  id: string;
  name: string;
  department: string; // Departemen/Spesialisasi (contoh: Anak, Bedah, Penyakit Dalam)
  floor: string; // Lantai/Area
  type: RoomType;
  capacity: number; // Kapasitas orang maksimal untuk ruangan non-inap
  beds?: Bed[];     // ⬅️ daftar kasur di dalam ruangan
  pricePerHour?: number; // opsional: tarif
  status: RoomStatus;
  sanitation: SanitationStatus;
  isolation?: boolean; // Isolasi/Negative Pressure
  equipment: Equipment[];
  doctorOnDuty?: string;
  supportsInsurance?: boolean;
  nextAvailable?: string; // ISO string
  image?: string;
  description?: string;
  is_mulitple_bed:boolean;
};

// === Mock Data ===
const INITIAL_ROOMS: Room[] = [
  {
    id: "rs-OK-01",
    name: "OK 1",
    department: "Bedah Umum",
    location: "Lantai 2 • Blok A",
    type: "OK",
    capacity: 6,
    beds: [
      { id: "OK1-B1", label: "Bed 1", status: "available", sanitation: "Bersih", nextAvailable: new Date(Date.now()+60*60*1000).toISOString() },
      { id: "OK1-B2", label: "Bed 2", status: "cleaning", sanitation: "Sedang Dibersihkan" },
    ],
    status: "available",
    sanitation: "Bersih",
    isolation: true,
    equipment: ["Defibrillator", "Monitor Pasien", "Infusion Pump"],
    doctorOnDuty: "dr. Wibowo, SpB",
    supportsInsurance: true,
    nextAvailable: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=1200&auto=format&fit=crop",
    description: "Kamar operasi dengan tekanan negatif dan set alat bedah lengkap.",
  },
  {
    id: "rs-ICU-03",
    name: "ICU 3",
    department: "Intensive Care",
    location: "Lantai 3 • Timur",
    type: "ICU",
    capacity: 4,
    beds: [
      { id: "ICU3-B1", label: "Bed 1", status: "occupied", sanitation: "Bersih", patientName: "A. Putra", mrn: "MR123456" },
      { id: "ICU3-B2", label: "Bed 2", status: "available", sanitation: "Bersih" },
      { id: "ICU3-B3", label: "Bed 3", status: "maintenance", sanitation: "Perlu Disinfeksi" },
    ],
    status: "occupied",
    sanitation: "Bersih",
    isolation: true,
    equipment: ["Ventilator", "Monitor Pasien", "Infusion Pump"],
    doctorOnDuty: "dr. Nabila, SpPD-KIC",
    supportsInsurance: true,
    nextAvailable: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(),
    image: "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?q=80&w=1200&auto=format&fit=crop",
    description: "Bed ICU dengan ventilator dan monitoring 24/7.",
  },
  {
    id: "rs-POLI-ENT",
    name: "Poli THT 2",
    department: "THT",
    location: "Lantai 1 • Klinik Spesialis",
    type: "Poliklinik",
    capacity: 3,
    beds: [ { id: "THT2-B1", label: "Bed 1", status: "cleaning", sanitation: "Sedang Dibersihkan" } ],
    status: "cleaning",
    sanitation: "Sedang Dibersihkan",
    isolation: false,
    equipment: ["EKG"],
    doctorOnDuty: "dr. Sinta, SpTHT",
    supportsInsurance: true,
    nextAvailable: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
    image: "https://images.unsplash.com/photo-1584982751630-7511fd8bfc02?q=80&w=1200&auto=format&fit=crop",
    description: "Ruang periksa THT dengan alat diagnostik dasar.",
  },
  {
    id: "rs-RWI-A-12",
    name: "Ruang Rawat A12",
    department: "Anak",
    location: "Lantai 4 • Sayap Barat",
    type: "Rawat Inap",
    capacity: 2,
    beds: [
      { id: "A12-B1", label: "Bed 1", status: "maintenance", sanitation: "Perlu Disinfeksi" },
      { id: "A12-B2", label: "Bed 2", status: "available", sanitation: "Bersih" },
    ],
    status: "maintenance",
    sanitation: "Perlu Disinfeksi",
    isolation: false,
    equipment: ["Monitor Pasien"],
    supportsInsurance: true,
    image: "https://images.unsplash.com/photo-1587906692191-c5ef2111640f?q=80&w=1200&auto=format&fit=crop",
    description: "Kamar rawat inap 2 bed untuk pasien anak.",
  },
];

// === Utils ===
const humanDateTime = (iso?: string) => {
  if (!iso) return "-";
  try {
    const d = new Date(iso);
    return d.toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" });
  } catch {
    return "-";
  }
};

const statusBadge = (s: RoomStatus) => {
  const map: Record<RoomStatus, string> = {
    available: "bg-success-subtle text-success border border-success-subtle",
    occupied: "bg-warning-subtle text-warning border border-warning-subtle",
    cleaning: "bg-info-subtle text-info border border-info-subtle",
    maintenance: "bg-danger-subtle text-danger border border-danger-subtle",
  };
  const label: Record<RoomStatus, string> = {
    available: "Tersedia",
    occupied: "Digunakan",
    cleaning: "Pembersihan",
    maintenance: "Maintenance",
  };
  return <span className={`badge rounded-pill ${map[s]}`}>{label[s]}</span>;
};

const sanitationBadge = (s: SanitationStatus) => {
  const map: Record<SanitationStatus, string> = {
    "Bersih": "text-bg-success",
    "Sedang Dibersihkan": "text-bg-info",
    "Perlu Disinfeksi": "text-bg-danger",
  };
  return <span className={`badge ${map[s]} ms-2`}>{s}</span>;
};

const equipBadge = (e: Equipment) => (
  <span key={e} className="badge text-bg-light border fw-normal me-1 mb-1">
    <i className="bi bi-plug me-1" />{e}
  </span>
);

export default function RoomList() {
  const [rooms, setRooms] = useState<Room[]>(INITIAL_ROOMS);

  // === UI State (Filters/Sorting/View) ===
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"all" | RoomStatus>("all");
  const [type, setType] = useState<"all" | RoomType>("all");
  const [dept, setDept] = useState<string | "all">("all");
  const [needsIsolation, setNeedsIsolation] = useState<boolean | "all">("all");
  const [minBeds, setMinBeds] = useState<number | "">("");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [sort, setSort] = useState<"name" | "capacity" | "beds">("name");
  const [equipFilter, setEquipFilter] = useState<Equipment[]>([]);

  // Modal state (room)
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Room | null>(null);

  // Modal state (bed)
  const [showBedModal, setShowBedModal] = useState(false);
  const [activeRoom, setActiveRoom] = useState<Room | null>(null);
  const [editingBed, setEditingBed] = useState<Bed | null>(null);

  // Bootstrap JS (opsional)
  useEffect(() => {
    import("bootstrap/dist/js/bootstrap.bundle.min.js").catch(() => {});
  }, []);

  const departments = useMemo(
    () => Array.from(new Set(rooms.map((r) => r.department))).sort(),
    [rooms]
  );

  const filtered = useMemo(() => {
    let data = [...rooms];

    if (query.trim()) {
      const q = query.toLowerCase();
      data = data.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          r.department.toLowerCase().includes(q) ||
          r.location.toLowerCase().includes(q) ||
          r.equipment.some((a) => a.toLowerCase().includes(q)) ||
          (r.beds || []).some((b) => b.label.toLowerCase().includes(q) || (b.patientName || "").toLowerCase().includes(q))
      );
    }
    if (status !== "all") data = data.filter((r) => r.status === status);
    if (type !== "all") data = data.filter((r) => r.type === type);
    if (dept !== "all") data = data.filter((r) => r.department === dept);
    if (needsIsolation !== "all") data = data.filter((r) => (!!r.isolation) === needsIsolation);
    if (minBeds !== "") data = data.filter((r) => (r.beds?.length || 0) >= Number(minBeds));
    if (equipFilter.length)
      data = data.filter((r) => equipFilter.every((eq) => r.equipment.includes(eq)));

    switch (sort) {
      case "capacity":
        data.sort((a, b) => (a.capacity || 0) - (b.capacity || 0));
        break;
      case "beds":
        data.sort((a, b) => (a.beds?.length || 0) - (b.beds?.length || 0));
        break;
      default:
        data.sort((a, b) => a.name.localeCompare(b.name));
    }
    return data;
  }, [rooms, query, status, type, dept, needsIsolation, minBeds, sort, equipFilter]);

  // === CRUD Helpers (Room) ===
  const resetForm = () => setEditing(null);

  const onSave = (payload: Partial<Room>) => {
    if (editing) {
      setRooms((prev) => prev.map((r) => (r.id === editing.id ? { ...editing, ...payload } as Room : r)));
    } else {
      const id = `rs-${Math.floor(Math.random() * 900 + 100)}`;
      setRooms((prev) => [
        {
          id,
          name: payload.name || "Ruang Baru",
          department: payload.department || "Umum",
          location: payload.location || "-",
          type: (payload.type as RoomType) || "Poliklinik",
          capacity: Number(payload.capacity) || 0,
          beds: payload.beds || [],
          pricePerHour: payload.pricePerHour ? Number(payload.pricePerHour) : undefined,
          status: (payload.status as RoomStatus) || "available",
          sanitation: (payload.sanitation as SanitationStatus) || "Bersih",
          isolation: !!payload.isolation,
          equipment: (payload.equipment as Equipment[]) || [],
          doctorOnDuty: payload.doctorOnDuty,
          supportsInsurance: payload.supportsInsurance ?? true,
          nextAvailable: payload.nextAvailable,
          image:
            payload.image ||
            "https://images.unsplash.com/photo-1584982751630-7511fd8bfc02?q=80&w=1200&auto=format&fit=crop",
          description: payload.description || "",
        },
        ...prev,
      ]);
    }
    setShowModal(false);
    resetForm();
  };

  const onDelete = (id: string) => setRooms((prev) => prev.filter((r) => r.id !== id));

  // Form state (Room)
  const [form, setForm] = useState<Partial<Room>>({ status: "available", sanitation: "Bersih", equipment: [], beds: [] });
  useEffect(() => {
    if (editing) setForm({ ...editing });
    else setForm({ status: "available", sanitation: "Bersih", equipment: [], beds: [] });
  }, [editing, showModal]);

  const toggleEquip = (a: Equipment) => {
    setForm((f) => {
      const list = new Set([...(f.equipment as Equipment[] | undefined || [])]);
      list.has(a) ? list.delete(a) : list.add(a);
      return { ...f, equipment: Array.from(list) };
    });
  };

  const toggleEquipFilter = (a: Equipment) => {
    setEquipFilter((prev) => (prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]));
  };

  // === KPI Cards ===
  const total = rooms.length;
  const totalBeds = rooms.reduce((acc, r) => acc + (r.beds?.length || 0), 0);
  const totalBedsAvail = rooms.reduce((acc, r) => acc + (r.beds?.filter(b => b.status === "available").length || 0), 0);
  const totalAvail = rooms.filter((r) => r.status === "available").length;
  const totalOcc = rooms.filter((r) => r.status === "occupied").length;
  const totalClean = rooms.filter((r) => r.status === "cleaning").length;

  // ==== Bed modal state & handlers ====
  const [bedForm, setBedForm] = useState<Partial<Bed>>({ status: "available", sanitation: "Bersih" });

  const openBedModal = (room: Room, bed: Bed | null) => {
    setActiveRoom(room);
    setEditingBed(bed);
    setBedForm(bed ? { ...bed } : { status: "available", sanitation: "Bersih" });
    setShowBedModal(true);
  };

  const saveBed = () => {
    if (!activeRoom) return;
    setRooms((prev) => prev.map((r) => {
      if (r.id !== activeRoom.id) return r;
      const beds = [...(r.beds || [])];
      if (editingBed) {
        const idx = beds.findIndex((b) => b.id === editingBed.id);
        if (idx !== -1) beds[idx] = { ...(editingBed as Bed), ...(bedForm as Bed) };
      } else {
        const newBed: Bed = {
          id: `${r.id}-B${(r.beds?.length || 0) + 1}`,
          label: bedForm.label || `Bed ${(r.beds?.length || 0) + 1}`,
          status: (bedForm.status as BedStatus) || "available",
          sanitation: (bedForm.sanitation as BedSanitation) || "Bersih",
          patientName: bedForm.patientName,
          mrn: bedForm.mrn,
          nextAvailable: bedForm.nextAvailable,
          notes: bedForm.notes,
        };
        beds.push(newBed);
      }
      return { ...r, beds };
    }));
    setShowBedModal(false);
    setActiveRoom(null);
    setEditingBed(null);
  };

  const deleteBed = (bedId: string) => {
    if (!activeRoom) return;
    setRooms((prev) => prev.map((r) => r.id === activeRoom.id ? { ...r, beds: (r.beds || []).filter(b => b.id !== bedId) } : r));
    setShowBedModal(false);
    setActiveRoom(null);
    setEditingBed(null);
  };

  return (
    <div className=" d-flex flex-column gap-2">

      {/* KPIs */}
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
        <div>
        </div>
        <div className="d-flex gap-2">
          <button className="btn btn-outline-secondary"><i className="bi bi-upload me-1"></i>Import</button>
          <button className="btn btn-outline-secondary"><i className="bi bi-download me-1"></i>Export</button>
          <button className="btn btn-primary" onClick={() => { setEditing(null as any); setShowModal(true); }}>
            <i className="bi bi-plus-lg me-1"></i> Tambah Ruangan
          </button>
        </div>
      </div>
      <div className="row g-3 mb-4">
        <div className="col-6 col-md-3">
          <Card>
            <div className="text-secondary small">Total Ruangan</div>
            <div className="h4 mb-0">{total}</div>
          </Card>
        </div>
        <div className="col-6 col-md-3">
          <Card>
            <div className="text-secondary small">Total Bed</div>
            <div className="h4 mb-0">{totalBeds}</div>
          </Card>
        </div>
        <div className="col-6 col-md-3">
          <Card>
            <div className="text-secondary small">Bed Tersedia</div>
            <div className="h4 mb-0">{totalBedsAvail}</div>
          </Card>
        </div>
        <div className="col-6 col-md-3">
          <Card>
            <div className="text-secondary small">Ruang Tersedia</div>
            <div className="h4 mb-0">{totalAvail}</div>
          </Card>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <div className="row g-3 align-items-end">
          <div className="col-12 col-lg-3">
            <Input label="Cari"/>
          </div>
          <div className="col-6 col-lg-2">
            <Select
              label="Status Ruangan"
              options={[
                {label:"Semua", value:"semua"},
                {label:"Tersedia", value:"Tersedia"},
                {label:"Digunakan", value:"Digunakan"},
                {label:"Pembersihan", value:"Pembersihan"},
                {label:"Maintenance", value:"Maintenance"},
              ]}
            />
          </div>
          <div className="col-6 col-lg-2">
            <Select
              label="Kegunaan Ruangan"
              options={[
                {label:"Poliklinik", value:"Poliklinik"},
                {label:"UGD", value:"UGD"},
                {label:"Rawat Inap", value:"Rawat Inap"},
                {label:"ICU", value:"ICU"},
                {label:"Radiologi", value:"Radiologi"},
                {label:"Laboratorium", value:"Laboratorium"},
              ]}
            />
          </div>
          <div className="col-6 col-lg-3">
            <Select
              label="Departemen"
              options={[
                {label:"Poliklinik", value:"Poliklinik"},
                {label:"UGD", value:"UGD"},
                {label:"Rawat Inap", value:"Rawat Inap"},
                {label:"ICU", value:"ICU"},
                {label:"Radiologi", value:"Radiologi"},
                {label:"Laboratorium", value:"Laboratorium"},
              ]}
            />
          </div>
          <div className="col-6 col-lg-2">
            <label className="form-label">Urut</label>
            <select className="form-select" value={sort} onChange={(e) => setSort(e.target.value as any)}>
              <option value="name">Nama</option>
              <option value="capacity">Kapasitas</option>
              <option value="beds">Jumlah Bed</option>
            </select>
          </div>
        </div>
        <div className="mt-3">
          <div className="d-flex flex-wrap gap-2 align-items-center">
            <span className="text-secondary small me-1">Filter Peralatan:</span>
            {(["Ventilator","USG","EKG","X-Ray","Infusion Pump","Defibrillator","Monitor Pasien","Negative Pressure","Incubator"] as Equipment[]).map((e) => {
              const active = equipFilter.includes(e);
              return (
                <button key={e} type="button" className={`btn btn-sm ${active ? "btn-primary" : "btn-outline-secondary"}`} onClick={() => toggleEquipFilter(e)}>
                  {e}
                </button>
              );
            })}
            <button className="btn btn-sm btn-outline-secondary ms-auto" onClick={() => setEquipFilter([])}>Reset Peralatan</button>
            <div className="btn-group">
              <button className={`btn ${view === "grid" ? "btn-primary" : "btn-outline-secondary"}`} onClick={() => setView("grid")} title="Grid view"><i className="bi bi-grid-3x3-gap" /></button>
              <button className={`btn ${view === "list" ? "btn-primary" : "btn-outline-secondary"}`} onClick={() => setView("list")} title="List view"><i className="bi bi-list" /></button>
            </div>
          </div>
        </div>
      </Card>

      {/* Content */}
      <Card>
        {view === "grid" ? (
          <div className="row g-4">
            {filtered.map((r) => (
              <div key={r.id} className="col-12 col-sm-6 col-lg-4">
                <Card>
                  {r.image && (
                    <div className="ratio ratio-16x9">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={r.image} alt={r.name} className="card-img-top object-fit-cover" />
                    </div>
                  )}
                  <div className="card-body d-flex flex-column">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <div>
                        <h5 className="card-title mb-0">{r.name} <span className="badge text-bg-secondary ms-2">{r.type}</span>{sanitationBadge(r.sanitation)}</h5>
                        <div className="text-secondary small mt-1"><i className="bi bi-geo-alt me-1" />{r.location} • {r.department}</div>
                      </div>
                      {statusBadge(r.status)}
                    </div>

                    <div className="d-flex flex-wrap gap-2 mb-2 small">
                      <span className="badge text-bg-secondary-subtle border"><i className="bi bi-hospital me-1" />{r.beds?.length || 0} bed</span>
                      <span className="badge text-bg-secondary-subtle border"><i className="bi bi-people me-1" />Kapasitas {r.capacity}</span>
                      {r.isolation && <span className="badge text-bg-warning-subtle border border-warning-subtle"><i className="bi bi-shield-exclamation me-1" />Isolasi</span>}
                      {r.supportsInsurance && <span className="badge text-bg-light border"><i className="bi bi-card-checklist me-1" />Asuransi</span>}
                    </div>

                    <div className="mb-2">{r.equipment.map(equipBadge)}</div>

                    {/* Bed badges */}
                    {r.beds && r.beds.length > 0 && (
                      <div className="mb-3">
                        {r.beds.map((b) => (
                          <button key={b.id} type="button" className={`btn btn-sm me-2 mb-2 ${b.status === 'available' ? 'btn-success-subtle border border-success-subtle' : b.status === 'occupied' ? 'btn-warning-subtle border border-warning-subtle' : b.status === 'cleaning' ? 'btn-info-subtle border border-info-subtle' : 'btn-danger-subtle border border-danger-subtle'}`} onClick={() => openBedModal(r, b)}>
                            {b.label} {b.patientName ? `• ${b.patientName}` : ''}
                          </button>
                        ))}
                        <button className="btn btn-sm btn-outline-secondary" onClick={() => openBedModal(r, null)}>
                          <i className="bi bi-plus-lg me-1" />Tambah Bed
                        </button>
                      </div>
                    )}

                    {r.description && <p className="text-secondary small mb-3">{r.description}</p>}

                    <div className="small text-secondary mb-3"><i className="bi bi-clock me-1" />Ketersediaan berikutnya: {humanDateTime(r.nextAvailable)}</div>

                    <div className="mt-auto d-flex gap-2">
                      <button className="btn btn-outline-primary" onClick={() => { setEditing(r); setShowModal(true); }}>
                        <i className="bi bi-pencil me-1" />Edit
                      </button>
                      <button className="btn btn-outline-danger" onClick={() => onDelete(r.id)}>
                        <i className="bi bi-trash me-1" />Hapus
                      </button>
                      <button className="btn btn-primary ms-auto">
                        <i className="bi bi-journal-plus me-1" />Buat Reservasi
                      </button>
                    </div>
                  </div>
                </Card>
              </div>
            ))}
            {filtered.length === 0 && (
              <div className="col-12">
                <div className="text-center text-secondary py-5 border rounded-3">
                  <i className="bi bi-search fs-2 d-block mb-2" />
                  Tidak ada ruangan yang cocok dengan filter.
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="card border-0 shadow-sm">
            <div className="table-responsive">
              <table className="table align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th style={{width: 56}}></th>
                    <th>Ruangan</th>
                    <th>Departemen</th>
                    <th>Lokasi</th>
                    <th className="text-center">Tipe</th>
                    <th className="text-center">Bed (A/T)</th>
                    <th className="text-center">Kapasitas</th>
                    <th>Status</th>
                    <th>Sanitasi</th>
                    <th className="text-end" style={{width: 260}}>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((r) => (
                    <tr key={r.id}>
                      <td>
                        <div className="ratio ratio-1x1 rounded overflow-hidden" style={{width: 44}}>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={r.image} alt={r.name} className="object-fit-cover" />
                        </div>
                      </td>
                      <td className="fw-medium">{r.name}</td>
                      <td>{r.department}</td>
                      <td className="text-secondary">{r.location}</td>
                      <td className="text-center"><span className="badge text-bg-secondary">{r.type}</span></td>
                      <td className="text-center">{`${r.beds?.filter(b=>b.status==='available').length || 0}/${r.beds?.length || 0}`}</td>
                      <td className="text-center">{r.capacity}</td>
                      <td>{statusBadge(r.status)}</td>
                      <td>{sanitationBadge(r.sanitation)}</td>
                      <td className="text-end">
                        <div className="btn-group">
                          <button className="btn btn-sm btn-outline-primary" onClick={() => { setEditing(r); setShowModal(true); }}><i className="bi bi-pencil" /></button>
                          <button className="btn btn-sm btn-outline-danger" onClick={() => onDelete(r.id)}><i className="bi bi-trash" /></button>
                          <button className="btn btn-sm btn-primary" onClick={() => openBedModal(r, null)}><i className="bi bi-plus-circle me-1" />Bed</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </Card>

      {/* Add/Edit Room Modal */}
      <Modal  show={showModal}  onHide={()=>setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <h6 className="modal-title">{editing ? "Edit Ruangan" : "Tambah Ruangan"}</h6>
        </Modal.Header>
        <Modal.Body>
          <RoomForm />
        </Modal.Body>

        <Modal.Footer>

                <button className="btn btn-outline-secondary" onClick={() => { setShowModal(false); resetForm(); }}>Batal</button>
                <button className="btn btn-primary" onClick={() => onSave(form)}>{editing ? "Simpan" : "Buat Ruangan"}</button>
        </Modal.Footer>
      </Modal>
      

      {/* Bed Add/Edit Modal */}
      {showBedModal && activeRoom && (
        <div className="modal fade show d-block" tabIndex={-1} role="dialog" aria-modal="true">
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{editingBed ? `Edit ${editingBed.label}` : `Tambah Bed (${activeRoom.name})`}</h5>
                <button className="btn-close" onClick={() => { setShowBedModal(false); setActiveRoom(null); setEditingBed(null); }} />
              </div>
              <div className="modal-body">
                <div className="row g-3">
                  <div className="col-md-4">
                    <label className="form-label">Label</label>
                    <input className="form-control" value={bedForm.label || ""} onChange={(e) => setBedForm({ ...bedForm, label: e.target.value })} />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Status</label>
                    <select className="form-select" value={(bedForm.status as any) || "available"} onChange={(e) => setBedForm({ ...bedForm, status: e.target.value as BedStatus })}>
                      <option value="available">Tersedia</option>
                      <option value="occupied">Digunakan</option>
                      <option value="cleaning">Pembersihan</option>
                      <option value="maintenance">Maintenance</option>
                    </select>
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Sanitasi</label>
                    <select className="form-select" value={(bedForm.sanitation as any) || "Bersih"} onChange={(e) => setBedForm({ ...bedForm, sanitation: e.target.value as BedSanitation })}>
                      <option value="Bersih">Bersih</option>
                      <option value="Sedang Dibersihkan">Sedang Dibersihkan</option>
                      <option value="Perlu Disinfeksi">Perlu Disinfeksi</option>
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Nama Pasien (jika digunakan)</label>
                    <input className="form-control" value={bedForm.patientName || ""} onChange={(e) => setBedForm({ ...bedForm, patientName: e.target.value })} />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">MRN</label>
                    <input className="form-control" value={bedForm.mrn || ""} onChange={(e) => setBedForm({ ...bedForm, mrn: e.target.value })} />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Next Available (ISO)</label>
                    <input className="form-control" placeholder="YYYY-MM-DDTHH:mm" value={bedForm.nextAvailable || ""} onChange={(e) => setBedForm({ ...bedForm, nextAvailable: e.target.value })} />
                  </div>
                  <div className="col-12">
                    <label className="form-label">Catatan</label>
                    <textarea className="form-control" rows={3} value={bedForm.notes || ""} onChange={(e) => setBedForm({ ...bedForm, notes: e.target.value })} />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                {editingBed && <button className="btn btn-outline-danger me-auto" onClick={() => deleteBed(editingBed.id)}><i className="bi bi-trash me-1"/>Hapus Bed</button>}
                <button className="btn btn-outline-secondary" onClick={() => { setShowBedModal(false); setActiveRoom(null); setEditingBed(null); }}>Batal</button>
                <button className="btn btn-primary" onClick={saveBed}>{editingBed ? "Simpan" : "Tambah"}</button>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show" onClick={() => { setShowBedModal(false); setActiveRoom(null); setEditingBed(null); }} />
        </div>
      )}
    </div>
  );
}
