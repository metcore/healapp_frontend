"use client";
import { Fragment, useMemo, useState } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import Card from "../primitive/card/Card";
import Form from "../primitive/form/Form";
import Select from "../primitive/select/Select";
import Button from "../primitive/button/Button";
import UserAccessBranchForm from "./UserAccessBranchForm";
import { toast } from "react-toastify";
import api from "@/api/api";
import { useRouter } from "next/navigation";

/**
 * Modernized User Form with RBAC (Role-Based Access Control)
 * ---------------------------------------------------------
 * - Clean, two-column responsive layout
 * - Avatar upload with live preview
 * - Stronger field validation (fixed typos in original code)
 * - Access section: role preset + granular permission matrix
 * - Quick actions: Select All / Clear, and per-row toggles
 * - Optional scope (All Clinics or Specific Locations)
 * - Sticky form actions (Save / Cancel)
 *
 * NOTE: This uses the existing primitives (Form, Card, Select, Button).
 * If your Select supports multi-select, set `isMulti` where indicated.
 */

const PERMISSION_ACTIONS = ["view", "create", "edit", "delete", "approve", "export"];

const PERMISSION_MODULES = [
  { key: "patients", label: "Patients" },
  { key: "appointments", label: "Appointments" },
  { key: "billing", label: "Billing" },
  { key: "inventory", label: "Inventory" },
  { key: "reports", label: "Reports" },
  { key: "settings", label: "Settings" },
];

const ROLE_PRESETS = {
  account_manager: {
    label: "Account Manager",
    permissions: {
      patients: ["view", "edit"],
      appointments: ["view", "create", "edit"],
      billing: ["view", "export"],
      inventory: ["view"],
      reports: ["view", "export"],
      settings: [],
    },
  },
  receptionist: {
    label: "Receptionist",
    permissions: {
      patients: ["view", "create", "edit"],
      appointments: ["view", "create", "edit", "delete"],
      billing: ["view"],
      inventory: [],
      reports: [],
      settings: [],
    },
  },
  dokter: {
    label: "Dokter",
    permissions: {
      patients: ["view", "edit"],
      appointments: ["view", "edit"],
      billing: ["view"],
      inventory: [],
      reports: ["view"],
      settings: [],
    },
  },
  nurse: {
    label: "Suster",
    permissions: {
      patients: ["view", "edit"],
      appointments: ["view", "create", "edit"],
      billing: [],
      inventory: ["view"],
      reports: [],
      settings: [],
    },
  },
  admin: {
    label: "Administrator",
    permissions: PERMISSION_MODULES.reduce((acc, m) => {
      acc[m.key] = [...PERMISSION_ACTIONS];
      return acc;
    }, {}),
  },
};

const DEFAULT_PERMISSIONS = PERMISSION_MODULES.reduce((acc, m) => {
  acc[m.key] = [];
  return acc;
}, {});

export default function UserForm() {
  const router = useRouter();
  const [loadingSubmit, setLoadingSubmit] = useState<boolean>(false)
  const [imagePreviewUrl, setImagePreviewUrl] = useState("");
  const [role, setRole] = useState("receptionist");
  const [permissions, setPermissions] = useState(
    ROLE_PRESETS["receptionist"].permissions
  );
  const [scopeAllClinics, setScopeAllClinics] = useState(true);
  const [scopedLocations, setScopedLocations] = useState([]); // strings of location ids

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setImagePreviewUrl(reader.result);
    reader.readAsDataURL(file);
  };

  const locationOptions = useMemo(
    () => [
      { label: "Klinik Pusat", value: "central" },
      { label: "Klinik Barat", value: "west" },
      { label: "Klinik Timur", value: "east" },
    ],
    []
  );

  const roleOptions = useMemo(
    () => [
      { label: ROLE_PRESETS.account_manager.label, value: "SUPERADMIN" },
      { label: ROLE_PRESETS.receptionist.label, value: "CASHIER" },
      { label: ROLE_PRESETS.dokter.label, value: "DOCTOR" },
      { label: ROLE_PRESETS.nurse.label, value: "FINANCE" },
      { label: ROLE_PRESETS.admin.label, value: "THERAPIST" },
    ],
    []
  );

  const workingHourOptions = useMemo(
    () => [
      { label: "In Office (09.00–18.00)", value: "in_office" },
      { label: "Shift Pagi (07.00–15.00)", value: "shift_morning" },
      { label: "Shift Sore (13.00–21.00)", value: "shift_evening" },
      { label: "Remote / Fleksibel", value: "flex" },
    ],
    []
  );

  const applyRolePreset = (nextRole) => {
    setRole(nextRole);
    const preset = ROLE_PRESETS[nextRole]?.permissions || DEFAULT_PERMISSIONS;
    // Clone to avoid mutating constants
    const cloned = JSON.parse(JSON.stringify(preset));
    setPermissions(cloned);
  };

  const togglePermission = (moduleKey, action) => {
    setPermissions((prev) => {
      const current = new Set(prev[moduleKey] || []);
      if (current.has(action)) current.delete(action);
      else current.add(action);
      return { ...prev, [moduleKey]: Array.from(current) };
    });
  };

  const setRowAll = (moduleKey, checked) => {
    setPermissions((prev) => ({
      ...prev,
      [moduleKey]: checked ? [...PERMISSION_ACTIONS] : [],
    }));
  };

  const setAll = (checked) => {
    setPermissions(
      PERMISSION_MODULES.reduce((acc, m) => {
        acc[m.key] = checked ? [...PERMISSION_ACTIONS] : [];
        return acc;
      }, {})
    );
  };

  const isAllSelected = useMemo(() => {
    return PERMISSION_MODULES.every((m) =>
      (permissions[m.key] || []).length === PERMISSION_ACTIONS.length
    );
  }, [permissions]);
  
  const handleSubmit = async (e) => {
    console.log(e)
    if(e.hasError) {
      toast.error("Gagal simpan periksa kembali data")
      return
    }
    setLoadingSubmit(true)
    try {
      const response = await api.post("user", e.values)
      if(response.status == 201){
    toast.success("Data berhasil disimpan")
        router.push("/user")
      }
    } catch (error) {
      toast.error("terjadi kesalahan silahkan coba kembali")
    }
    setLoadingSubmit(false)
  }
  return (
    <Form onSubmit={handleSubmit}>

      <div className="row g-3">
        <div className="col-xxl-7 col-xl-7 col-lg-8">
          <div className="d-flex flex-column gap-3">
            <Card
              renderHeader={
                <div className="d-flex align-items-center justify-content-between w-100">
                  <h6 className="text-md fw-semibold mb-0">Informasi Pengguna</h6>
                </div>
              }
            >
              <div className="d-flex gap-3 align-items-start flex-wrap">
                <div className="flex-grow-1 min-w-0" style={{ minWidth: 260 }}>
                  <div className="d-flex flex-column gap-2">
                    <Form.Input
                      name="name"
                      label="Nama lengkap"
                      placeholder="Misal: Jon Doe"
                      rules={{
                        required: { message: "Wajib diisi" },
                        min: { value: 3, message: "Minimal 3 karakter" },
                      }}
                    />

                    <Form.Input
                      name="email"
                      placeholder="Contoh admin@healapp.com"
                      icon="mdi:email"
                      label="Email"
                      rules={{
                        required: { message: "Wajib diisi" },
                        email: { message: "Format harus email" },
                      }}
                    />

                    <Form.Input
                      name="phone_number"
                      icon="mdi:phone"
                      placeholder="Misal: 6289648***"
                      label="Nomor Telepon"
                      rules={{
                        required: { message: "Wajib diisi" },
                        phone: { message: "Format harus nomor telepon" },
                        min: { value: 8, message: "Minimal 8 digit" },
                      }}
                    />
                  <Form.Select
                    label="Role Akses"
                    name="role"
                    value={role}
                    // onChange={(val) => applyRolePreset(val)}
                    options={roleOptions}
                    rules={{
                      required: { message: "Wajib diisi" }
                    }}
                  />

                    {/* <div className="row g-2">
                      <div className="col-md-6">
                        <Select
                          name="working_hour"
                          label="Jam Kerja"
                          placeholder="Pilih jam kerja user"
                          options={workingHourOptions}
                        />
                      </div>
                      <div className="col-md-6">
                        <Select
                          name="status"
                          label="Status Akun"
                          placeholder="Pilih status"
                          options={[
                            { label: "Aktif", value: "active" },
                            { label: "Nonaktif", value: "inactive" },
                          ]}
                        />
                      </div>
                    </div> */}
                    {/* <Form.TextArea
                      name="Note"
                      label="Note"
                      hint="Catatan tambahan saja untuk user ini"
                    /> */}
                  </div>
                </div>
              </div>
            </Card>

            <UserAccessBranchForm />
          </div>
        </div>

        <div className="col-xxl-5 col-xl-5 col-lg-4">
          <Card
            renderHeader={<h6 className="text-md fw-semibold mb-0">Akses & RBAC</h6>}
          >
            <div className="d-flex flex-column gap-2">
              <Select
                label="Role Akses"
                name="role"
                value={role}
                onChange={(val) => applyRolePreset(val)}
                options={roleOptions}
              />

              <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
                <div className="d-flex align-items-center gap-2">
                  <span className="text-muted small">Preset:</span>
                  <span className="badge text-bg-light">{ROLE_PRESETS[role]?.label}</span>
                </div>
                <div className="d-flex gap-2">
                  <Button size="sm" type="button" onClick={() => setAll(true)}>
                    <Icon icon="mdi:check-all" className="me-1" /> Pilih Semua
                  </Button>
                  <Button size="sm" type="button" variant="light" onClick={() => setAll(false)}>
                    <Icon icon="mdi:close-circle-outline" className="me-1" /> Bersihkan
                  </Button>
                </div>
              </div>

              <div className="table-responsive border rounded">
                <table className="table align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th style={{ minWidth: 160 }}>Modul</th>
                      {PERMISSION_ACTIONS.map((a) => (
                        <th key={a} className="text-center text-capitalize" style={{ whiteSpace: "nowrap" }}>{a}</th>
                      ))}
                      <th className="text-center" style={{ width: 120 }}>Semua</th>
                    </tr>
                  </thead>
                  <tbody>
                    {PERMISSION_MODULES.map((m) => {
                      const row = new Set(permissions[m.key] || []);
                      const rowAll = row.size === PERMISSION_ACTIONS.length;
                      return (
                        <tr key={m.key}>
                          <td className="fw-medium">{m.label}</td>
                          {PERMISSION_ACTIONS.map((a) => (
                            <td key={a} className="text-center">
                              <input
                                type="checkbox"
                                className="form-check-input"
                                checked={row.has(a)}
                                aria-label={`${m.label} ${a}`}
                                onChange={() => togglePermission(m.key, a)}
                              />
                            </td>
                          ))}
                          <td className="text-center">
                            <input
                              type="checkbox"
                              className="form-check-input"
                              checked={rowAll}
                              aria-label={`${m.label} pilih semua`}
                              onChange={(e) => setRowAll(m.key, e.target.checked)}
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Legend */}
              <div className="d-flex flex-wrap gap-3 small text-muted mt-2">
                <div><strong>RBAC</strong> = Role menetapkan izin dasar; izin bisa diubah per modul.</div>
                <div className="d-flex align-items-center gap-1"><Icon icon="mdi:check-all"/> = pilih semua aksi di modul.</div>
              </div>
            </div>
          </Card>

        </div>
      </div>

      <div className="bg-white position-sticky bottom-0 py-3 mt-3" style={{ zIndex: 2 }}>
        <div className="d-flex justify-content-end gap-2">
          <Button variant="light" type="button">
            <Icon icon="mdi:arrow-left" className="me-1" />Batal
          </Button>
          <Form.ButtonSubmit
            loading={loadingSubmit}
          >
            <Icon icon="mdi:content-save" className="me-1" /> Simpan
          </Form.ButtonSubmit>
        </div>
      </div>
    </Form>
  );
}