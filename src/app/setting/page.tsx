

// ============================
// FILE: app/settings/page.tsx
// ============================
"use client";
import MasterLayout from "@/masterLayout/MasterLayout";
import { useEffect, useRef, useState } from "react";

const sections = [
  { id: "company", label: "Perusahaan", icon: "bi-building" },
  { id: "users", label: "Pengguna & Role", icon: "bi-people" },
  { id: "finance", label: "Keuangan", icon: "bi-cash-coin" },
  { id: "inventory", label: "Inventori", icon: "bi-box-seam" },
  { id: "integrations", label: "Integrasi", icon: "bi-plug" },
  { id: "notifications", label: "Notifikasi", icon: "bi-bell" },
  { id: "security", label: "Keamanan", icon: "bi-shield-lock" },
];

export default function SettingsPage() {
  const [active, setActive] = useState("company");
  const [saving, setSaving] = useState(false);
  const [theme, setTheme] = useState("light");
  const toastRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.documentElement.setAttribute("data-bs-theme", theme);
  }, [theme]);

  const onSave = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 900)); // simulate API
    setSaving(false);
    // show toast
    // @ts-ignore
    const toast = new (window as any).bootstrap.Toast(toastRef.current);
    toast.show();
  };

  return (
    <MasterLayout>
    <div className="container-fluid py-4">
      {/* Header */}
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h1 className="h3 fw-semibold mb-1">Pengaturan ERP</h1>
          <p className="text-secondary mb-0">Sesuaikan preferensi perusahaan, modul, dan integrasi.</p>
        </div>
        <div className="d-flex gap-2 align-items-center">
          {/* Theme toggle */}
          <div className="form-check form-switch">
            <input
              id="themeToggle"
              className="form-check-input"
              type="checkbox"
              role="switch"
              checked={theme === "dark"}
              onChange={(e) => setTheme(e.target.checked ? "dark" : "light")}
            />
            <label className="form-check-label" htmlFor="themeToggle">
              {theme === "dark" ? "Mode Gelap" : "Mode Terang"}
            </label>
          </div>
          <a className="btn btn-outline-secondary d-none d-md-inline-flex" href="#">
            <i className="bi bi-question-circle me-2"/>Bantuan
          </a>
        </div>
      </div>

      <div className="row g-3">
        {/* Sidebar */}
        <aside className="col-12 col-md-4 col-lg-3">
          <div className="card border-0 shadow-sm rounded-4">
            <div className="card-body p-0">
              <div className="list-group list-group-flush">
                {sections.map((s) => (
                  <button
                    key={s.id}
                    className={`list-group-item list-group-item-action d-flex align-items-center gap-3 py-3 ${active===s.id?"active":""}`}
                    onClick={() => setActive(s.id)}
                  >
                    <i className={`bi ${s.icon}`}/>
                    <span className="fw-semibold">{s.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Content */}
        <main className="col-12 col-md-8 col-lg-9">
          {active === "company" && <CompanyCard />}
          {active === "users" && <UsersCard />}
          {active === "finance" && <FinanceCard />}
          {active === "inventory" && <InventoryCard />}
          {active === "integrations" && <IntegrationsCard />}
          {active === "notifications" && <NotificationsCard />}
          {active === "security" && <SecurityCard />}
        </main>
      </div>

      {/* Sticky Footer Actions */}
      <div className="position-sticky bottom-0 mt-4" style={{zIndex: 10}}>
        <div className="card border-0 shadow rounded-4">
          <div className="card-body d-flex justify-content-between align-items-center py-3">
            <span className="text-secondary">Perubahan belum disimpan</span>
            <div className="d-flex gap-2">
              <button className="btn btn-light">Reset</button>
              <button className="btn btn-primary" onClick={onSave} disabled={saving}>
                {saving ? (<><span className="spinner-border spinner-border-sm me-2"/>Menyimpan...</>) : (<><i className="bi bi-check2-circle me-2"/>Simpan Pengaturan</>)}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Toast */}
      <div className="toast-container position-fixed bottom-0 end-0 p-3">
        <div ref={toastRef} className="toast align-items-center text-bg-success border-0" role="alert" aria-live="assertive" aria-atomic="true">
          <div className="d-flex">
            <div className="toast-body">
              Pengaturan berhasil disimpan.
            </div>
            <button type="button" className="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
          </div>
        </div>
      </div>
    </div>
    </MasterLayout>
  );
}

// --- Section Cards ---
function CardWrap({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div className="card border-0 shadow-sm rounded-4 mb-3">
      <div className="card-header bg-transparent border-0 pb-0">
        <h2 className="h5 mb-1">{title}</h2>
        {subtitle && <p className="text-secondary mb-0">{subtitle}</p>}
      </div>
      <div className="card-body">{children}</div>
    </div>
  );
}

function CompanyCard() {
  return (
    <CardWrap title="Profil Perusahaan" subtitle="Informasi dasar perusahaan Anda.">
      <div className="row g-3">
        <div className="col-md-6">
          <label className="form-label">Nama Legal</label>
          <input className="form-control" placeholder="PT Contoh Jaya Abadi" />
        </div>
        <div className="col-md-6">
          <label className="form-label">Nama Tampilan</label>
          <input className="form-control" placeholder="Contoh Group" />
        </div>
        <div className="col-md-6">
          <label className="form-label">NPWP</label>
          <input className="form-control" placeholder="00.000.000.0-000.000" />
        </div>
        <div className="col-md-6">
          <label className="form-label">Email Perusahaan</label>
          <input type="email" className="form-control" placeholder="finance@contoh.co.id" />
        </div>
        <div className="col-12">
          <label className="form-label">Alamat</label>
          <textarea className="form-control" rows={2} placeholder="Jalan Mawar No. 1, Jakarta" />
        </div>
        <div className="col-md-4">
          <label className="form-label">Kota</label>
          <input className="form-control" placeholder="Jakarta" />
        </div>
        <div className="col-md-4">
          <label className="form-label">Provinsi</label>
          <input className="form-control" placeholder="DKI Jakarta" />
        </div>
        <div className="col-md-4">
          <label className="form-label">Kode Pos</label>
          <input className="form-control" placeholder="12345" />
        </div>
        <div className="col-md-6">
          <label className="form-label">Logo</label>
          <input type="file" className="form-control" />
          <div className="form-text">PNG/SVG, max 1MB, rasio 1:1.</div>
        </div>
        <div className="col-md-6">
          <label className="form-label">Zona Waktu</label>
          <select className="form-select">
            <option>Asia/Jakarta (WIB)</option>
            <option>Asia/Makassar (WITA)</option>
            <option>Asia/Jayapura (WIT)</option>
          </select>
        </div>
      </div>
    </CardWrap>
  );
}

function UsersCard() {
  return (
    <CardWrap title="Pengguna & Role" subtitle="Kelola akses dan izin.">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div className="input-group" style={{maxWidth: 420}}>
          <span className="input-group-text"><i className="bi bi-search"/></span>
          <input className="form-control" placeholder="Cari pengguna" />
        </div>
        <button className="btn btn-primary"><i className="bi bi-person-plus me-2"/>Undang Pengguna</button>
      </div>

      <div className="table-responsive rounded-3 border">
        <table className="table align-middle mb-0">
          <thead className="table-light">
            <tr>
              <th>Nama</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th className="text-end">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {[
              { n: "Aditia", e: "adit@contoh.id", r: "Admin", s: "Aktif" },
              { n: "Sari", e: "sari@contoh.id", r: "Finance", s: "Aktif" },
              { n: "Herman", e: "herman@contoh.id", r: "Gudang", s: "Suspend" },
            ].map((u, i) => (
              <tr key={i}>
                <td className="fw-semibold">{u.n}</td>
                <td>{u.e}</td>
                <td>
                  <span className="badge bg-secondary-subtle text-secondary-emphasis border">{u.r}</span>
                </td>
                <td>
                  <span className={`badge ${u.s === "Aktif" ? "bg-success-subtle text-success-emphasis" : "bg-warning-subtle text-warning-emphasis"}`}>{u.s}</span>
                </td>
                <td className="text-end">
                  <div className="btn-group">
                    <button className="btn btn-sm btn-light">Edit</button>
                    <button className="btn btn-sm btn-outline-danger">Hapus</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </CardWrap>
  );
}

function FinanceCard() {
  return (
    <CardWrap title="Keuangan" subtitle="Mata uang, pajak, dan penomoran dokumen.">
      <div className="row g-3">
        <div className="col-md-6">
          <label className="form-label">Mata Uang Utama</label>
          <select className="form-select">
            <option value="IDR">IDR – Rupiah</option>
            <option value="USD">USD – US Dollar</option>
            <option value="EUR">EUR – Euro</option>
          </select>
        </div>
        <div className="col-md-6">
          <label className="form-label">Format Tanggal</label>
          <select className="form-select">
            <option>DD/MM/YYYY</option>
            <option>YYYY-MM-DD</option>
            <option>MM/DD/YYYY</option>
          </select>
        </div>
        <div className="col-md-6">
          <label className="form-label">PPN (Tax)</label>
          <div className="input-group">
            <input type="number" className="form-control" defaultValue={11} min={0} max={100} />
            <span className="input-group-text">%</span>
          </div>
        </div>
        <div className="col-md-6">
          <label className="form-label">Penomoran Faktur</label>
          <input className="form-control" placeholder="INV-{YYYY}-{####}" />
          <div className="form-text">Gunakan {"{YYYY}"}, {"{MM}"}, {"{####}"} untuk pola otomatis.</div>
        </div>
      </div>
    </CardWrap>
  );
}

function InventoryCard() {
  return (
    <CardWrap title="Inventori" subtitle="Gudang, SKU, dan manajemen stok.">
      <div className="row g-3">
        <div className="col-md-6">
          <label className="form-label">Metode Penilaian</label>
          <select className="form-select">
            <option>FIFO</option>
            <option>LIFO</option>
            <option>Average</option>
          </select>
        </div>
        <div className="col-md-6">
          <label className="form-label">Satuan Default</label>
          <input className="form-control" placeholder="PCS" />
        </div>
        <div className="col-md-6">
          <div className="form-check form-switch mt-4">
            <input className="form-check-input" type="checkbox" id="trackLot" defaultChecked />
            <label className="form-check-label" htmlFor="trackLot">Aktifkan tracking Batch/Lot</label>
          </div>
        </div>
        <div className="col-md-6">
          <div className="form-check form-switch mt-4">
            <input className="form-check-input" type="checkbox" id="lowStock" />
            <label className="form-check-label" htmlFor="lowStock">Notifikasi stok menipis</label>
          </div>
        </div>
      </div>
    </CardWrap>
  );
}

function IntegrationsCard() {
  const apps = [
    { name: "Xendit", desc: "Pembayaran online & VA.", icon: "bi-credit-card" },
    { name: "JNE", desc: "Pengiriman & tracking resi.", icon: "bi-truck" },
    { name: "WhatsApp", desc: "Kirim notifikasi otomatis.", icon: "bi-whatsapp" },
    { name: "Shopee", desc: "Sinkronisasi pesanan & stok.", icon: "bi-bag" },
  ];
  return (
    <CardWrap title="Integrasi" subtitle="Hubungkan aplikasi pihak ketiga.">
      <div className="row g-3">
        {apps.map((a) => (
          <div className="col-md-6" key={a.name}>
            <div className="card h-100 border rounded-4">
              <div className="card-body d-flex align-items-start gap-3">
                <div className="fs-3"><i className={`bi ${a.icon}`}/></div>
                <div className="flex-fill">
                  <h3 className="h6 mb-1">{a.name}</h3>
                  <p className="text-secondary mb-3">{a.desc}</p>
                  <div className="d-flex gap-2">
                    <button className="btn btn-sm btn-primary">Hubungkan</button>
                    <button className="btn btn-sm btn-outline-secondary">Detail</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </CardWrap>
  );
}

function NotificationsCard() {
  return (
    <CardWrap title="Notifikasi" subtitle="Preferensi email & WhatsApp.">
      <div className="row g-3">
        <div className="col-md-6">
          <label className="form-label">Alamat Email Default</label>
          <input className="form-control" type="email" placeholder="noreply@contoh.id" />
        </div>
        <div className="col-md-6">
          <label className="form-label">Nomor WhatsApp</label>
          <div className="input-group">
            <span className="input-group-text">+62</span>
            <input className="form-control" placeholder="812-xxxx-xxxx" />
          </div>
        </div>
        <div className="col-12">
          <div className="form-check form-switch">
            <input className="form-check-input" type="checkbox" id="notifInvoice" defaultChecked />
            <label className="form-check-label" htmlFor="notifInvoice">Kirim invoice via email</label>
          </div>
          <div className="form-check form-switch">
            <input className="form-check-input" type="checkbox" id="notifWA" />
            <label className="form-check-label" htmlFor="notifWA">Kirim update pesanan via WhatsApp</label>
          </div>
        </div>
      </div>
    </CardWrap>
  );
}

function SecurityCard() {
  return (
    <CardWrap title="Keamanan" subtitle="Kata sandi & 2FA.">
      <div className="row g-3">
        <div className="col-md-6">
          <label className="form-label">Kebijakan Password</label>
          <select className="form-select">
            <option>Standar (8+ karakter)</option>
            <option>Ketat (12+ karakter, simbol)</option>
          </select>
        </div>
        <div className="col-md-6">
          <label className="form-label">Otentikasi 2-Faktor</label>
          <div className="d-flex gap-2">
            <button className="btn btn-outline-secondary">Email OTP</button>
            <button className="btn btn-outline-secondary">Authenticator App</button>
          </div>
        </div>
        <div className="col-12">
          <div className="alert alert-warning d-flex align-items-start" role="alert">
            <i className="bi bi-exclamation-triangle me-2 mt-1"/>
            <div>
              Disarankan mengaktifkan 2FA untuk semua admin guna meningkatkan keamanan akun.
            </div>
          </div>
        </div>
      </div>
    </CardWrap>
  );
}

// NOTE: Add Bootstrap Icons once in your <head> (e.g., in app/(marketing)/layout.tsx or via _document.tsx)
// <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css" rel="stylesheet">
