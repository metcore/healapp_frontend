'use client'
import { useMemo, useState } from 'react'
import Card from '../primitive/card/Card'
import Button from '../primitive/button/Button'
import Input from '../primitive/input/Input'
import InputNumber from '../primitive/input-number/InputNumber'
import Switch from '../primitive/switch/Switch'
import RadioButton from '../primitive/radio-button/RadioButton'
import LabelInput from '../primitive/label-input/LabelInput'
import CustomDatePicker from '../primitive/date-picker/DatePicker'
import { Icon } from '@iconify/react'

// -------------------------------
// Types
// -------------------------------
type Basis = 'gross' | 'nett'
type ItemKind = 'product' | 'treatment' | 'both'
type CommissionCalc = 'percent' | 'fixed'

type Tier = {
  id: string
  threshold: number | null // Omset minimal (>=)
  percent: number | null // % komisi untuk tier ini
  note?: string
}

// -------------------------------
// CommissionInformationForm
// -------------------------------
export function CommissionInformationForm({
  value,
  onChange,
}: {
  value: any
  onChange: (patch: Partial<any>) => void
}) {
  return (
    <Card
      renderHeader={
        <div className="d-flex justify-content-between align-items-start">
          <div>
            <h6 className="text-md fw-medium mb-0">Informasi Umum</h6>
            <p className="mb-0">Setelan dasar komisi</p>
          </div>
        </div>
      }
    >
      <div className="d-flex flex-column gap-3">
        <div className="row g-3">
          <div className="col-md-6">
            <Input
              label="Nama Skema Komisi"
              icon="mdi:label"
              placeholder="Mis: Komisi Dokter 2%"
              value={value.label ?? ''}
              onChange={(e: any) => onChange({ label: e.target.value })}
            />
          </div>
          <div className="col-md-3">
            <Input
              label="Kode"
              icon="mdi:barcode"
              placeholder="Mis: KDOK2"
              value={value.code ?? ''}
              onChange={(e: any) => onChange({ code: e.target.value })}
            />
          </div>
          <div className="col-md-3">
            <RadioButton
              label="Jenis Komisi"
              options={[
                { value: 'percent', label: 'Persentase' },
                { value: 'fixed', label: 'Nominal' },
              ]}
              value={value.calc ?? 'percent'}
              onChange={(v: CommissionCalc) => onChange({ calc: v })}
            />
          </div>
        </div>

        <div className="row g-3">
          <div className="col-md-4">
            <RadioButton
              label="Basis Perhitungan"
              options={[
                { value: 'gross', label: 'Gross (sebelum potongan)' },
                { value: 'nett', label: 'Nett (setelah potongan)' },
              ]}
              value={value.basis ?? 'nett'}
              onChange={(v: Basis) => onChange({ basis: v })}
            />
          </div>
          <div className="col-md-4">
            <RadioButton
              label="Jenis Item"
              options={[
                { value: 'product', label: 'Product' },
                { value: 'treatment', label: 'Treatment' },
                { value: 'both', label: 'Keduanya' },
              ]}
              value={value.itemKind ?? 'both'}
              onChange={(v: ItemKind) => onChange({ itemKind: v })}
            />
          </div>
          <div className="col-md-4">
            {value.calc === 'percent' ? (
              <InputNumber
                icon="mdi:percent"
                format="percent"
                label="Nilai Komisi Default"
                placeholder="Mis: 2%"
                value={value.defaultPercent ?? ''}
                onChange={(n: number) => onChange({ defaultPercent: n })}
              />
            ) : (
              <InputNumber
                icon="mdi:cash"
                label="Nominal Komisi"
                placeholder="Mis: 25.000"
                value={value.fixedAmount ?? ''}
                onChange={(n: number) => onChange({ fixedAmount: n })}
              />
            )}
          </div>
        </div>

        <div className="row g-3">
          <div className="col-md-3">
            <Switch
              label="Hitung dari harga setelah diskon?"
              hint="Jika mati, komisi dihitung dari harga sebelum diskon"
              checked={value.countAfterDiscount ?? true}
              onChange={(e: any) => onChange({ countAfterDiscount: e.target.checked })}
            />
          </div>
          <div className="col-md-3">
            <Switch
              label="PPN termasuk basis?"
              hint="Jika mati, PPN dikeluarkan dari basis komisi"
              checked={value.includeTaxInBase ?? false}
              onChange={(e: any) => onChange({ includeTaxInBase: e.target.checked })}
            />
          </div>
          <div className="col-md-3">
            <InputNumber
              icon="mdi:cash-multiple"
              label="Batas Komisi/Transaksi (opsional)"
              placeholder="Mis: 200.000"
              value={value.capPerTxn ?? ''}
              onChange={(n: number) => onChange({ capPerTxn: n })}
            />
          </div>
          <div className="col-md-3">
            <InputNumber
              icon="mdi:chart-line"
              label="Omset Minimal (eligibilitas)"
              placeholder="Mis: 500.000"
              value={value.minEligible ?? ''}
              onChange={(n: number) => onChange({ minEligible: n })}
            />
          </div>
        </div>

        <div>
          <LabelInput label="Periode Efektif" hint={true} />
          <p className="text-sm mb-2 text-secondary-light">Kosongkan jika tidak membatasi tanggal</p>
          <div className="row g-2">
            <div className="col-md-3">
              <CustomDatePicker placeholder="Tanggal Mulai" value={value.startDate} onChange={(d: any) => onChange({ startDate: d })} />
            </div>
            <div className="col-md-3">
              <CustomDatePicker placeholder="Tanggal Selesai" value={value.endDate} onChange={(d: any) => onChange({ endDate: d })} />
            </div>
            <div className="col-md-6">
              <Input label="Catatan" placeholder="Opsional" value={value.notes ?? ''} onChange={(e: any) => onChange({ notes: e.target.value })} />
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}

// -------------------------------
// CommissionTargetForm (Tiers)
// -------------------------------
export function CommissionTargetForm({
  enabled,
  onToggle,
  tiers,
  onChangeTiers,
}: {
  enabled: boolean
  onToggle: (v: boolean) => void
  tiers: Tier[]
  onChangeTiers: (next: Tier[]) => void
}) {
  const handleChange = (id: string, patch: Partial<Tier>) => {
    onChangeTiers(
      tiers.map(t => (t.id === id ? { ...t, ...patch } : t))
    )
  }
  const handleAdd = () => {
    onChangeTiers([
      ...tiers,
      { id: crypto.randomUUID(), threshold: null, percent: null, note: '' },
    ])
  }
  const handleRemove = (id: string) => {
    onChangeTiers(tiers.filter(t => t.id !== id))
  }

  return (
    <Card
      renderHeader={
        <div className="d-flex justify-content-between align-items-start">
          <div>
            <h6 className="text-md fw-medium mb-0">Target/Tier Komisi</h6>
            <p className="mb-0">Buat tingkatan komisi berdasarkan omset</p>
          </div>
          <Switch
            label="Aktifkan Tier Komisi"
            hint="Jika aktif, nilai komisi default ditimpa oleh tier yang berlaku"
            checked={enabled}
            onChange={(e: any) => onToggle(e.target.checked)}
          />
        </div>
      }
    >
      {enabled ? (
        <div className="d-flex flex-column gap-3">
          <div className="row g-2 fw-semibold text-muted d-none d-md-flex">
            <div className="col">Omset ≥</div>
            <div className="col">% Komisi</div>
            <div className="col">Catatan</div>
            <div className="col-auto">Aksi</div>
          </div>
          {tiers.map(t => (
            <div key={t.id} className="row g-2 align-items-end">
              <div className="col">
                <InputNumber
                  label="Omset"
                  placeholder="Mis: 20.000.000"
                  value={t.threshold ?? ''}
                  onChange={(n: number) => handleChange(t.id, { threshold: n })}
                />
              </div>
              <div className="col">
                <InputNumber
                  icon="mdi:percent"
                  format="percent"
                  label="% Komisi"
                  placeholder="Mis: 3%"
                  value={t.percent ?? ''}
                  onChange={(n: number) => handleChange(t.id, { percent: n })}
                />
              </div>
              <div className="col">
                <Input
                  label="Catatan"
                  placeholder="Mis: Peak season"
                  value={t.note ?? ''}
                  onChange={(e: any) => handleChange(t.id, { note: e.target.value })}
                />
              </div>
              <div className="col-auto">
                <Button variant="danger" size="sm" onClick={() => handleRemove(t.id)}>
                  Hapus
                </Button>
              </div>
            </div>
          ))}

          <div className="d-flex justify-content-end">
            <Button onClick={handleAdd}>
              <Icon icon="mdi:plus" className="me-1" /> Tambah Tier
            </Button>
          </div>
        </div>
      ) : (
        <div className="text-muted">Tier tidak aktif. Aktifkan untuk menambahkan tingkatan komisi.</div>
      )}
    </Card>
  )
}

// -------------------------------
// CommissionPayoutForm (aturan payout)
// -------------------------------
export function CommissionPayoutForm({ value, onChange }: { value: any; onChange: (p: Partial<any>) => void }) {
  return (
    <Card
      renderHeader={
        <div className="d-flex justify-content-between align-items-start">
          <div>
            <h6 className="text-md fw-medium mb-0">Aturan Pembayaran Komisi</h6>
            <p className="mb-0">Kontrol kapan komisi dibayarkan</p>
          </div>
        </div>
      }
    >
      <div className="row g-3">
        <div className="col-md-4">
          <RadioButton
            label="Jadwal Pembayaran"
            options={[
              { value: 'onpaid', label: 'Saat transaksi lunas' },
              { value: 'weekly', label: 'Mingguan' },
              { value: 'monthly', label: 'Bulanan' },
            ]}
            value={value.schedule ?? 'onpaid'}
            onChange={(v: string) => onChange({ schedule: v })}
          />
        </div>
        <div className="col-md-4">
          <InputNumber
            label="Masa Tahan/Clawback (hari)"
            placeholder="Mis: 7"
            value={value.clawbackDays ?? ''}
            onChange={(n: number) => onChange({ clawbackDays: n })}
          />
        </div>
        <div className="col-md-4">
          <Switch
            label="Hanya trans. dengan status PAID"
            hint="Jika aktif, komisi hanya keluar saat status bayar = PAID"
            checked={value.onlyPaid ?? true}
            onChange={(e: any) => onChange({ onlyPaid: e.target.checked })}
          />
        </div>
      </div>
    </Card>
  )
}

// -------------------------------
// CommissionPreview (ringkasan & simulasi)
// -------------------------------
function calcCommission(example: any, info: any, tiers: Tier[], tiersOn: boolean) {
  const base = Number(example.subtotal ?? 0)
  const discount = Number(example.discount ?? 0)
  const tax = Number(example.tax ?? 0)

  const afterDiscount = base - (info.countAfterDiscount ? discount : 0)
  const baseForCalc = info.includeTaxInBase ? afterDiscount + tax : afterDiscount

  let percent = Number(info.defaultPercent ?? 0)
  if (info.calc === 'fixed') {
    return Math.min(Number(info.fixedAmount ?? 0), Number(info.capPerTxn ?? Infinity))
  }

  if (tiersOn && tiers.length) {
    const sorted = [...tiers].sort((a, b) => Number(b.threshold ?? 0) - Number(a.threshold ?? 0))
    const chosen = sorted.find(t => baseForCalc >= Number(t.threshold ?? 0))
    if (chosen?.percent != null) percent = Number(chosen.percent)
  }

  const raw = (percent / 100) * baseForCalc
  const capped = Math.min(raw, Number(info.capPerTxn ?? Infinity))
  return Math.max(0, Math.round(capped))
}

export function CommissionPreview({ info, tiers, tiersOn }: { info: any; tiers: Tier[]; tiersOn: boolean }) {
  const [example, setExample] = useState({ subtotal: 1_000_000, discount: 50_000, tax: 100_000 })
  const result = useMemo(() => calcCommission(example, info, tiers, tiersOn), [example, info, tiers, tiersOn])

  const formatIDR = (n: number) => `Rp${Number(n ?? 0).toLocaleString('id-ID')}`

  return (
    <Card
      renderHeader={<h6 className="text-md fw-medium mb-0">Preview & Simulasi</h6>}
      renderFooter={
        <div className="d-flex justify-content-between align-items-center">
          <div className="text-muted small">Perhitungan berdasarkan setelan saat ini</div>
          <div className="fw-semibold">Perkiraan Komisi: {formatIDR(result)}</div>
        </div>
      }
    >
      <div className="row g-3">
        <div className="col-md-4">
          <InputNumber label="Subtotal" value={example.subtotal} onChange={(n: number) => setExample({ ...example, subtotal: n })} />
        </div>
        <div className="col-md-4">
          <InputNumber label="Diskon" value={example.discount} onChange={(n: number) => setExample({ ...example, discount: n })} />
        </div>
        <div className="col-md-4">
          <InputNumber label="PPN" value={example.tax} onChange={(n: number) => setExample({ ...example, tax: n })} />
        </div>
      </div>

      <div className="mt-3 d-flex flex-wrap gap-2">
        {info.label && <span className="badge bg-soft-primary">{info.label}</span>}
        <span className="badge bg-soft-neutral">{info.calc === 'percent' ? `${info.defaultPercent ?? 0}%` : `Nominal ${info.fixedAmount ?? 0}`}</span>
        <span className="badge bg-soft-neutral">Basis: {info.basis ?? 'nett'}</span>
        <span className="badge bg-soft-neutral">Item: {info.itemKind ?? 'both'}</span>
        {info.capPerTxn && <span className="badge bg-soft-warning">Cap: Rp{Number(info.capPerTxn).toLocaleString('id-ID')}</span>}
        {info.minEligible && <span className="badge bg-soft-warning">Min: Rp{Number(info.minEligible).toLocaleString('id-ID')}</span>}
        {tiersOn && tiers.length > 0 && <span className="badge bg-soft-success">Tier aktif</span>}
      </div>
    </Card>
  )
}

// -------------------------------
// Root Form: ComissionForm (typo kept to match import)
// -------------------------------
export default function ComissionForm() {
  // master state
  const [info, setInfo] = useState<any>({ calc: 'percent', basis: 'nett', itemKind: 'both', countAfterDiscount: true })
  const [tiersOn, setTiersOn] = useState<boolean>(false)
  const [tiers, setTiers] = useState<Tier[]>([])
  const [payout, setPayout] = useState<any>({ schedule: 'onpaid', onlyPaid: true, clawbackDays: 7 })

  const handleSave = () => {
    // TODO: replace with API call
    console.log({ info, tiersOn, tiers, payout })
    alert('Komisi disimpan (simulasi). Cek console untuk payload.')
  }

  // simple validation: require label + either defaultPercent or fixedAmount depending on calc
  const canSave = useMemo(() => {
    if (!info?.label) return false
    if (info.calc === 'percent') return Number(info.defaultPercent ?? 0) > 0
    return Number(info.fixedAmount ?? 0) > 0
  }, [info])

  return (
    <div className="d-flex flex-column gap-2">
      <div className="d-flex justify-content-end gap-2">
        <Button size="sm" variant="outline">
          <Icon icon="mdi:content-save-outline" className="me-1" /> Simpan Draft
        </Button>
        <Button size="sm" disabled={!canSave} onClick={handleSave}>
          <Icon icon="mdi:content-save" className="me-1" /> Simpan
        </Button>
      </div>

      <CommissionInformationForm value={info} onChange={(p) => setInfo({ ...info, ...p })} />

      <CommissionTargetForm enabled={tiersOn} onToggle={setTiersOn} tiers={tiers} onChangeTiers={setTiers} />

      <CommissionPayoutForm value={payout} onChange={(p) => setPayout({ ...payout, ...p })} />

      <CommissionPreview info={info} tiers={tiers} tiersOn={tiersOn} />
    </div>
  )
}
