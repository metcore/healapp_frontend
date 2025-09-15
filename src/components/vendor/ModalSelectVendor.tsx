import React, { useEffect, useMemo, useRef, useState } from "react";
import { Modal,  Form, InputGroup, ListGroup, Badge, Spinner, Alert } from "react-bootstrap";
import Input from "../primitive/input/Input";
import Button from "../primitive/button/Button";
import { useDispatch } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { setVendor } from "@/redux/slice/auth/vendorSlice";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

export type VendorData = {
  UserId: string;
  VendorId: string;
  Name: string;
  Role?: string;
  CompanyCode?: string;
};

export type ModalSelectVendorProps = {
  /** Controls modal visibility */
  show: boolean;
  /** The list of vendors to choose from */
  dataVendors?: VendorData[];
  /** Called when user confirms a vendor */
  onSelect: (vendor: VendorData) => void;
  /** Called when the modal is dismissed */
  onClose: () => void;
  /** Preselect a vendor by id (e.g., from last session) */
  defaultSelectedVendorId?: string;
  /** Loading state while fetching vendors */
  loading?: boolean;
  /** Optional error to display */
  error?: string | null;
  /** Optional localStorage key to remember last choice */
  rememberKey?: string;
};

export default function ModalSelectVendor({
  show,
  dataVendors = [],
  onSelect,
  onClose,
  defaultSelectedVendorId,
  loading = false,
  error = null,
  rememberKey,
}: ModalSelectVendorProps) {
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | undefined>(undefined);
  const vendor = useSelector((state: RootState) => state.vendor);

  const [rememberChoice, setRememberChoice] = useState<boolean>(true);
  const searchRef = useRef<HTMLInputElement>(null);

  const dispatch = useDispatch<AppDispatch>()
  useEffect(() => {
    let preselect = defaultSelectedVendorId;
    if (!preselect && rememberKey) {
      const saved = localStorage.getItem(rememberKey);
      if (saved) preselect = saved;
    }
    if (preselect) setSelectedId(preselect);
  }, [defaultSelectedVendorId, rememberKey]);

  useEffect(() => {
    if (show) {
      const t = setTimeout(() => searchRef.current?.focus(), 150);
      return () => clearTimeout(t);
    }
  }, [show]);

  const normalized = (s: string) => s.toLowerCase().normalize("NFKD");

  const vendors = useMemo(() => {
    return [...(dataVendors || [])].sort((a, b) =>
      a.Name?.localeCompare(b.Name, undefined, { sensitivity: "base" }) ||
      a.VendorId?.localeCompare(b.VendorId)
    );
  }, [dataVendors]);

  const filtered = useMemo(() => {
    if (!query.trim()) return vendors;
    const q = normalized(query);
    return vendors.filter(v =>
      normalized(v.Name).includes(q) ||
      normalized(v.VendorId).includes(q) ||
      normalized(v.UserId).includes(q) ||
      (v.CompanyCode && normalized(v.CompanyCode).includes(q)) ||
      (v.Role && normalized(v.Role).includes(q))
    );
  }, [vendors, query]);

  const selectedVendor = useMemo(() => filtered.find(v => v.VendorId === selectedId) || vendors.find(v => v.VendorId === selectedId), [filtered, vendors, selectedId]);

  const handleConfirm = () => {
    dispatch(setVendor({vendor_id : selectedId}))
    toast.success("Vendor telah dipilih anda bisa melajutkannya")
  };

  const handleKeyDown: React.KeyboardEventHandler<HTMLDivElement> = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (selectedVendor) handleConfirm();
    }
  };

  return (
    <Modal
      show={show}
      centered
      size="lg"
      backdrop="static"
      onHide={onClose}
      onKeyDown={handleKeyDown}
    >
      <Modal.Header closeButton>
        <Modal.Title className="d-flex align-items-center gap-2">
         <h6 className="gap-2"> Pilih Vendor</h6>
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <div className="mb-3 text-muted">
          Anda terafiliasi ke beberapa perusahaan. Silakan pilih perusahaan terlebih dahulu untuk melanjutkan.
        </div>
        <div className="d-flex flex-column gap-4">
          {/* Search */}
          <Input
            name="search"
            icon="mdi:search"
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari nama, Vendor ID, User ID, atau kode perusahaan…"
          />

          {loading && (
            <div className="d-flex align-items-center gap-2 py-5 justify-content-center">
              <Spinner animation="border" role="status" />
              <span>Memuat daftar vendor…</span>
            </div>
          )}
          {!loading && error && (
            <Alert variant="danger" className="mb-3">
              Gagal memuat data vendor. {error}
            </Alert>
          )}

          {!loading && !error && (
            <div className="border rounded-4 overflow-hidden">
              {filtered.length === 0 ? (
                <div className="text-center text-muted py-5">
                  <div style={{ fontSize: 40, lineHeight: 1 }}>🗂️</div>
                  <div className="mt-2">Tidak ada hasil untuk "{query}"</div>
                  <div className="small">Coba kata kunci lain.</div>
                </div>
              ) : (
                <ListGroup variant="flush" role="listbox" aria-label="Daftar vendor">
                  {filtered.map((v) => (
                    <ListGroup.Item
                      key={v.VendorId}
                      action
                      active={selectedId === v.VendorId}
                      onClick={() => setSelectedId(v.VendorId)}
                      onDoubleClick={handleConfirm}
                      className="py-3 d-flex align-items-center gap-3"
                    >
                      {/* Avatar */}
                      <div
                        className="rounded-circle bg-light border d-flex align-items-center justify-content-center"
                        style={{ width: 40, height: 40, flex: "0 0 40px" }}
                        aria-hidden
                      >
                        <span className="fw-semibold">{getInitials(v.Name)}</span>
                      </div>

                      {/* Radio + Info */}
                      <div className="d-flex align-items-start w-100 gap-3">
                        <Form.Check
                          type="radio"
                          name="vendor"
                          id={`vendor-${v.VendorId}`}
                          checked={selectedId === v.VendorId}
                          onChange={() => setSelectedId(v.VendorId)}
                          className="mt-1"
                          aria-label={`Pilih vendor ${v.Name}`}
                        />

                        <div className="flex-grow-1">
                          <div className="d-flex flex-wrap align-items-center gap-2">
                            <span className="fw-semibold text-truncate" style={{ maxWidth: 360 }}>
                              {v.Vendor.Name}
                            </span>
                            {v.CompanyCode && (
                              <Badge bg="light" text="dark" title="Kode Perusahaan">
                                {v.CompanyCode}
                              </Badge>
                            )}
                            {v.Role && (
                              <>
                              <Badge bg="info" title="Peran Anda">{v.Role}</Badge>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </div>
          )}
        </div>
      </Modal.Body>

      <Modal.Footer className="d-flex align-items-center justify-content-between">
        <div className="small text-muted">
          {selectedVendor ? "Tekan Enter untuk lanjut" : "Pilih salah satu vendor untuk melanjutkan"}
        </div>
        <div className="d-flex gap-2">
          <Button
            onClick={handleConfirm}
            disabled={!selectedVendor}
          >
            Lanjut
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
}

function getInitials(name: string) {
  const parts = name?.split(/\s+/).filter(Boolean);
  const [a, b] = [parts?.[0], parts?.[1]];
  return ((a?.[0] || "").toUpperCase() + (b?.[0] || "").toUpperCase()).trim() || "?";
}