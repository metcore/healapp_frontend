'use client';
import api from "@/api/api";
import Button from "@/components/primitive/button/Button";
import Card from "@/components/primitive/card/Card";
import MasterLayout from "@/masterLayout/MasterLayout";
import { RootState } from "@/redux/store";
import { redirect, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

export default function InvitationJoinPage() {
  const authUser = useSelector((state: RootState) => state.auth);
  const router = useRouter();
  const params = useSearchParams();

  const user_id = params.get("user_id");
  const vendor_id = params.get("vendor_id");

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState<null | "accept" | "reject">(null);
  const [vendor, setVendor] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [showRejectModal, setShowRejectModal] = useState(false);

  const hasAllParams = useMemo(() => Boolean(user_id && vendor_id), [user_id, vendor_id]);

  const fetchVendor = useCallback(async () => {
    setError(null);
    setLoading(true);
    try {
      if (!hasAllParams) throw new Error("Link undangan tidak lengkap atau tidak valid.");
      const response = await api.get("/user/invitation/vendor-information", { params: { vendor_id } });
      const data = response?.data?.data ?? null;
      setVendor(data);
      if (!data) throw new Error("Data vendor tidak ditemukan.");
    } catch (e: any) {
      console.error(e);
      setError(e?.message || "Terjadi kesalahan saat memuat data vendor.");
    } finally {
      setLoading(false);
    }
  }, [hasAllParams, vendor_id]);

  useEffect(() => {
    if(authUser?.user?.ID  != user_id){
      redirect("/404")
    }
    fetchVendor();
  }, [user_id, vendor_id]);

  const handleAccept = async () => {
    if (!hasAllParams) return;
    setSubmitting("accept");
    setError(null);
    try {
      const res = await api.post("/user/invitation/accept", {
        vendor_id:vendor_id
      });
      if (res?.status != 200) {
        toast.error("Terjadi kesalahan silahkan coba kembali")
      }
      toast.success("Berhasil konfirmasi, anda telah bergabung")
      router.push(`/`);
    } catch (e: any) {
      console.error(e);
      setError(e?.message || "Gagal menerima undangan.");
    } finally {
      setSubmitting(null);
    }
  };

  const confirmReject = () => setShowRejectModal(true);
  const cancelReject = () => setShowRejectModal(false);

  const handleReject = async () => {
    if (!hasAllParams) return;
    setSubmitting("reject");
    setError(null);
    try {
      const res = await fetch("/api/invitations/reject", {
        method: "POST",
        body: JSON.stringify({ user_id, vendor_id }),
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) {
        const { message } = await res.json().catch(() => ({ message: "Gagal menolak undangan." }));
        throw new Error(message);
      }
      router.push("/home");
    } catch (e: any) {
      console.error(e);
      setError(e?.message || "Gagal menolak undangan.");
    } finally {
      setSubmitting(null);
      setShowRejectModal(false);
    }
  };

  return (
    <MasterLayout>
      <div className="container py-5 d-flex align-items-center justify-content-center" style={{ minHeight: "80vh" }}>
        <div className="w-100" style={{ maxWidth: 560 }}>
          <Card
            renderHeader={
                <div>
                  <h6 className="mb-0 fw-semibold">Undangan Bergabung</h6>
                  <small className="text-muted">Konfirmasi untuk melanjutkan akses Anda.</small>
                </div>}
          >
            <div className="card-body p-4">

              {/* Error Banner */}
              {error && (
                <div className="alert alert-danger rounded-3 d-flex align-items-start gap-2" role="alert">
                  <AlertIcon />
                  <div>
                    <div className="fw-semibold">Terjadi kesalahan</div>
                    <div className="small">{error}</div>
                  </div>
                </div>
              )}

              {/* Loading Skeleton */}
              {loading ? (
                <div aria-busy="true" className="placeholder-glow">
                  <div className="d-flex justify-content-center mb-4">
                    <div className="rounded-circle bg-light me-2" style={{ width: 48, height: 48 }} />
                  </div>
                  <span className="placeholder col-8 mb-2"></span>
                  <span className="placeholder col-6 mb-4"></span>
                  <div className="d-grid gap-2">
                    <span className="placeholder col-12 py-3 rounded-3"></span>
                    <span className="placeholder col-12 py-3 rounded-3"></span>
                  </div>
                </div>
              ) : hasAllParams && vendor ? (
                <div className="text-center">
                  {/* Avatar */}
                  <div className="d-flex justify-content-center mb-3">
                    <AvatarCircle label={vendor?.name?.[0] || "V"} />
                  </div>

                  <h5 className="fw-semibold mb-1">{vendor?.name || "Vendor"}</h5>
                  <p className="text-muted small mb-1">
                    Anda diundang untuk bergabung sebagai <strong>Dokter</strong> di <strong>{vendor?.name}</strong>.
                  </p>
                  {vendor?.ownerName && (
                    <p className="text-muted small mb-0">
                      Undangan dari: <span className="fw-medium">{vendor.ownerName}</span>
                    </p>
                  )}

                  {/* Actions */}
                  <div className="row g-2 mt-4">
                    <div className="col-12 col-sm-6">
                      <Button
                        className=" w-100 "
                        variant="outline-primary"
                        onClick={confirmReject}
                        disabled={Boolean(submitting)}
                      >
                        {submitting === "reject" ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" aria-hidden="true"></span>
                            Memproses…
                          </>
                        ) : "Tolak"}
                      </Button>
                    </div>
                    <div className="col-12 col-sm-6">
                      <Button
                        className="w-100 "
                        onClick={handleAccept}
                        disabled={Boolean(submitting)}
                      >
                        {submitting === "accept" ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" aria-hidden="true"></span>
                            Memproses…
                          </>
                        ) : "Terima"}
                      </Button>
                    </div>
                  </div>

                  <p className="text-muted small mt-3 mb-0">
                    Dengan menerima, Anda menyetujui untuk mematuhi kebijakan dan ketentuan yang berlaku di organisasi {vendor?.name}.
                  </p>

                  <div className="mt-4">
                    <div className="small fw-semibold">Tautan bermasalah?</div>
                    <div className="small text-muted">Jika link ini kedaluwarsa, minta pengirim untuk mengirim ulang undangan.</div>
                    <button
                      type="button"
                      className="btn btn-link btn-sm mt-2 p-0"
                      onClick={fetchVendor}
                      aria-label="Muat ulang data undangan"
                    >
                      Coba muat ulang data
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <h5 className="fw-semibold">Link Undangan Tidak Valid</h5>
                  <p className="text-muted small">
                    Pastikan Anda membuka tautan undangan yang benar. Jika perlu, minta pengirim untuk mengirim ulang.
                  </p>
                  <button type="button" className="btn btn-primary rounded-3" onClick={() => router.push("/home")}>
                    Kembali ke Beranda
                  </button>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* Reject Modal */}
      <div className={`modal fade ${showRejectModal ? "show" : ""}`} style={{ display: showRejectModal ? "block" : "none" }} role="dialog" aria-modal={showRejectModal} aria-hidden={!showRejectModal}>
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content rounded-4">
            <div className="modal-header">
              <h6 className="modal-title">Tolak Undangan?</h6>
              <button type="button" className="btn-close" aria-label="Close" onClick={cancelReject}></button>
            </div>
            <div className="modal-body">
              <p className="mb-0 small text-muted">
                Yakin menolak undangan ini? Anda masih bisa meminta pengirim untuk mengirim ulang nanti.
              </p>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-outline-secondary rounded-3" onClick={cancelReject}>Batal</button>
              <button type="button" className="btn btn-danger rounded-3" onClick={handleReject} disabled={submitting === "reject"}>
                {submitting === "reject" ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" aria-hidden="true"></span>
                    Memproses…
                  </>
                ) : "Tolak"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Backdrop for manual modal control */}
      {showRejectModal && <div className="modal-backdrop fade show" />}

    </MasterLayout>
  );
}

function HeaderIcon() {
  return (
    <svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" className="text-primary me-2">
      <path fill="currentColor" d="M12 2a7 7 0 0 1 7 7v1h1a2 2 0 0 1 2 2v6a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4v-6a2 2 0 0 1 2-2h1V9a7 7 0 0 1 7-7zm0 2a5 5 0 0 0-5 5v1h10V9a5 5 0 0 0-5-5z" />
    </svg>
  );
}

function AlertIcon() {
  return (
    <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" className="mt-1 me-1 flex-shrink-0">
      <path fill="currentColor" d="M1 21h22L12 2 1 21zm12-3h-2v2h2v-2zm0-8h-2v6h2V10z" />
    </svg>
  );
}

function AvatarCircle({ label = "V" }: { label?: string }) {
  return (
    <div
      className="d-inline-flex align-items-center justify-content-center rounded-circle bg-light fw-semibold"
      style={{ width: 56, height: 56 }}
      aria-label={`Avatar ${label}`}
    >
      {label}
    </div>
  );
}
