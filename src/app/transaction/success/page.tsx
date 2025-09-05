import Button from "@/components/primitive/button/Button";
import Card from "@/components/primitive/card/Card";
import Input from "@/components/primitive/input/Input";
import MasterLayout from "@/masterLayout/MasterLayout";
import { Icon } from "@iconify/react";
import Link from "next/link";

export default function Page() {
  const rows: Array<[string, string, boolean?]> = [
    ["Sub Total", "Rp2.000.000"],
    ["PPN", "Rp200.000"],
    ["Voucher", "-Rp200.000"],
    ["Grand Total", "Rp2.200.000", true],
    ["Metode Pembayaran", "Cash"],
    // konsisten dengan judul kembalian (Rp 90.000)
    ["Kembalian", "Rp90.000"],
  ];

  return (
    <MasterLayout>
      {/* Background wrapper for subtle depth */}
      <div className="min-vh-100 d-flex align-items-center justify-content-center p-3 p-md-4">
        <Card
          className="shadow-sm rounded-4 border-0 w-100"
          style={{ maxWidth: 560 }}
          renderHeader={
            <div className="px-3 px-md-4 pt-4 pb-2">
              <div className="d-flex justify-content-center">
                <div
                  className="bg-success bg-opacity-10 rounded-circle p-3 mb-3 d-inline-flex"
                  aria-hidden
                >
                  <Icon icon="mdi:check" className="text-success" width={40} height={40} />
                </div>
              </div>
              <h5 className="fw-bold mb-1 text-center">Payment Successful</h5>
              <p className="text-muted text-center mb-0">
                Pembayaran berhasil dibuat — jangan lupa ucapkan terima kasih ke pasien :)
              </p>
            </div>
          }
        >
          <div className="px-3 px-md-4 pb-4 d-flex flex-column gap-4">
            {/* Change / Kembalian highlight */}
            <section aria-labelledby="kembalian-title" className="text-center">
              <h3 id="kembalian-title" className="fw-bold mb-2">Kembalian</h3>
              <div className="d-inline-flex align-items-baseline gap-2">
                <Icon icon="mdi:cash-refund" width={28} height={28} className="text-primary" aria-hidden />
                <span className="display-6 fw-bold text-primary mb-0">Rp 90.000</span>
              </div>
            </section>

            {/* Email receipt */}
            <section aria-labelledby="email-struk" className="d-grid gap-2">
              <label htmlFor="email-struk" className="form-label fw-semibold mb-1">
                Kirim struk via email
              </label>
              <div className="input-group">
                <Input id="email-struk" placeholder="Email struk" icon="mdi:email" />
                <Button aria-label="Kirim struk">Kirim</Button>
              </div>
              <small className="text-muted">
                Opsional — pasien akan menerima salinan detail pembayaran.
              </small>
            </section>

            {/* Divider */}
            <hr className="text-muted opacity-25 my-0" />

            {/* Summary list */}
            <section aria-labelledby="ringkasan-title" className="d-flex flex-column gap-2">
              <h6 id="ringkasan-title" className="fw-bold mb-1">Ringkasan</h6>
              {rows.map(([label, value, highlight], idx) => (
                <div
                  key={idx}
                  className={`d-flex justify-content-between align-items-center ${
                    highlight ? "fw-bold border-top pt-2 mt-1" : ""
                  }`}
                >
                  <span className="text-muted">{label}</span>
                  <span className={highlight ? "text-primary" : "fw-semibold"}>{value}</span>
                </div>
              ))}
            </section>

            {/* Actions */}
            <section className="d-flex flex-column flex-sm-row gap-2">
              <Button
                variant="outline"
                className="w-100 gap-2 fw-bold d-flex align-items-center justify-content-center"
                aria-label="Cetak struk"
              >
                <Icon icon="mdi:printer" className="me-2" width={20} height={20} />
                Print
              </Button>

              <Link
                replace
                href="/transaction"
                className="btn btn-primary w-100 gap-2 fw-bold d-flex align-items-center justify-content-center"
                aria-label="Selesai"
              >
                <Icon icon="mdi:check-circle-outline" className="me-2" width={20} height={20} />
                Selesai
              </Link>
            </section>
          </div>
        </Card>
      </div>
    </MasterLayout>
  );
}
