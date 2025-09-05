'use client'
import { useMemo, useState } from 'react'
import Card from '../primitive/card/Card'
import Form from '../primitive/form/Form'
import { Icon } from '@iconify/react'


export default function ProductPeriodeForm() {
  const [turnOnPeriode, setTurnOnPeriode] = useState<boolean>(false)
  const [startDate, setStartDate] = useState<Date | null>(null)
  const [endDate, setEndDate] = useState<Date | null>(null)

  const handleTurnOnPeriode = (e: { target: { checked: boolean } }) => {
    setTurnOnPeriode(e.target.checked)
  }

  // Helpers -------------------------------------------------
  const daysBetween = (a: Date, b: Date) => {
    const ms = b.setHours(0, 0, 0, 0) - a.setHours(0, 0, 0, 0)
    return Math.round(ms / (1000 * 60 * 60 * 24))
  }

  const startHint = useMemo(() => {
    if (!startDate) return null
    const today = new Date()
    const d = daysBetween(today, new Date(startDate))
    if (d > 0) return `Item akan aktif dalam ${d} hari lagi`
    if (d === 0) return 'Item aktif mulai hari ini'
    return `Item sudah aktif sejak ${Math.abs(d)} hari yang lalu`
  }, [startDate])

  const periodeHint = useMemo(() => {
    if (!startDate || !endDate) return null
    const total = daysBetween(new Date(startDate), new Date(endDate))
    if (total < 0) return null
    // format sederhana: hari & bulan approx
    const monthsApprox = Math.floor(total / 30)
    if (monthsApprox >= 1) return `Masa aktif selama ~${monthsApprox} bulan (${total} hari)`
    return `Masa aktif selama ${total} hari`
  }, [startDate, endDate])

  const hasErrorRange = useMemo(() => {
    if (!startDate || !endDate) return false
    return endDate < startDate
  }, [startDate, endDate])

  return (
    <Card
      renderHeader={
        <div className="d-flex flex-column gap-1 gap-md-0 flex-md-row justify-content-between align-items-md-center">
          <div>
            <h6 className="text-md fw-semibold mb-1">Periode masa aktif item</h6>
            <p className="mb-0 text-muted">Tentukan kapan item mulai & berhenti dijual.</p>
          </div>
          <Form.Switch
            label="Hidupkan masa aktif"
            hint="Atur jika kamu punya item dengan masa aktif"
            checked={turnOnPeriode}
            onChange={handleTurnOnPeriode}
          />
        </div>
      }
    >
      {!turnOnPeriode ? (
        <div className="text-center py-4">
          <div className="d-inline-flex align-items-center gap-2 px-3 py-2 rounded-3 bg-light">
            <Icon icon="ph:info" width={18} />
            <span className="text-muted">Masa aktif nonaktif. Aktifkan untuk mengatur periode penjualan.</span>
          </div>
        </div>
      ) : (
        <div className="row g-3">
          <div className="col-md-6">
            <Form.DatePicker
              name="start_date"
              label="Tanggal Mulai"
              value={startDate as any}
              maxDate={endDate as any}
              onChange={(d) => setStartDate(d.target.value)}
              rules={{ required: { message: "Wajib diisi" } }}
            />
            {startHint && (
              <p className="small text-muted mb-0 mt-1">{startHint}</p>
            )}
          </div>

          <div className="col-md-6">
            <Form.DatePicker
              name="end_date"
              label="Tanggal Selesai"
              value={endDate as any}
              minDate={startDate as any}
              onChange={(d) => setEndDate(d.target.value)}
              rules={{ required: { message: "Wajib diisi" } }}
            />
            {hasErrorRange ? (
              <p className="small text-danger mb-0 mt-1 d-flex align-items-center gap-1">
                <Icon icon="ph:warning-circle" /> Tanggal selesai tidak boleh lebih awal dari tanggal mulai.
              </p>
            ) : (
              periodeHint && (
                <p className="small text-muted mb-0 mt-1">{periodeHint}</p>
              )
            )}
          </div>

          <div className="col-12">
            <hr className="my-2" />
            <div className="d-flex justify-content-between small text-muted">
              <span>
                {!startDate || !endDate ? 'Lengkapi tanggal mulai & selesai untuk menghitung masa aktif.' : 'Periode sudah valid. Siap disimpan.'}
              </span>
              {startDate && endDate && !hasErrorRange && (
                <span className="text-success d-inline-flex align-items-center gap-1">
                  <Icon icon="ph:check-circle" /> OK
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </Card>
  )
}
