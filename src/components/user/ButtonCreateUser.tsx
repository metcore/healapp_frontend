import { Fragment, useState } from "react";
import Link from "next/link";

import Button from "../primitive/button/Button";
import { Modal } from "react-bootstrap";
import { Icon } from "@iconify/react";
import Badge from "../primitive/badge/Badge";


export function getQuotaState(remainingQuota: number) {
  const safe = Number.isFinite(remainingQuota) ? Math.floor(remainingQuota) : 0;
  return {
    remaining: Math.max(0, safe),
    canCreate: safe > 0,
  };
}

export default function CreateUserButton({
  remainingQuota = 1,
  purchaseUrl = "/billing/upgrade",
  createUrl = "/user/create",
}: {
  remainingQuota?: number;
  purchaseUrl?: string;
  createUrl?: string;
}) {
  const [open, setOpen] = useState(false);
  const { canCreate, remaining } = getQuotaState(remainingQuota);

  return (
    <Fragment>
      <Button
        onClick={() => setOpen(true)}
        size="sm"
        className="d-inline-flex align-items-center gap-2 rounded-3 shadow-sm"
      >
        <Icon icon="mdi:plus" inline width={16} height={16} />
        Buat Pengguna
      </Button>

      <Modal
        show={open}
        onHide={() => setOpen(false)}
        centered
        backdrop="static"
        keyboard
      >
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title className="d-flex align-items-center gap-2 fs-5 fw-semibold">
            <Icon icon="mdi:account" width={18} height={18} />
            Tambah Pengguna
          </Modal.Title>
        </Modal.Header>

        <Modal.Body className="pt-2">
          <p className="text-muted mb-4">
            Kelola tim Anda dengan menambahkan akun pengguna baru.
          </p>

          <div className="d-flex align-items-center justify-content-between mb-3">
            <span className="small text-muted">Sisa kuota Anda</span>
            <Badge variant={canCreate ? "default" : "destructive"} className="rounded-pill">
              {remaining}
            </Badge>
          </div>

          {canCreate ? (
            <p className="small text-muted mb-2">
              Anda masih dapat membuat <span className="fw-medium">{remaining}</span> pengguna.
            </p>
          ) : (
            <p className="small text-danger mb-2">
              Kuota Anda habis. Tambahkan kuota untuk melanjutkan.
            </p>
          )}

          <p className="small text-muted mb-0">
            Ingin menambah kapasitas tim? Anda bisa membeli kuota tambahan di halaman penagihan.
          </p>
        </Modal.Body>

        <Modal.Footer className="border-0 pt-0 d-flex flex-column flex-sm-row gap-2">
          {/* Purchase CTA */}
          <Button  variant="secondary" className="d-inline-flex align-items-center gap-2 rounded-3">
            <Link href={purchaseUrl} aria-label="Beli kuota tambahan">
              <Icon icon="mdi:shopping" width={16} height={16} />
              Beli kuota tambahan
            </Link>
          </Button>

          {/* Create CTA */}
          <Button  disabled={!canCreate} className="d-inline-flex align-items-center gap-2 rounded-3">
            <Link href={canCreate ? createUrl : "#"} aria-disabled={!canCreate}>
              Lanjut buat pengguna
              <Icon icon="mdi:arrow-right" width={16} height={16} />
            </Link>
          </Button>
        </Modal.Footer>
      </Modal>
    </Fragment>
  );
}
