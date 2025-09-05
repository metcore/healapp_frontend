'use client'
import Card from '@/components/primitive/card/Card'
import { Icon } from '@iconify/react'
import Link from 'next/link'
import Modal from 'react-bootstrap/Modal'
import { useEffect, useMemo, useRef, useState } from 'react'
import InputFile from '../primitive/input-file/InputFile'
import Button from '../primitive/button/Button'
import TransactionCard from './TransactionCard'
import { DATA_TRANSACTIONS } from './DATA'
import Input from '../primitive/input/Input'
import PatientAvatar from '../patient/PatientAvatar'

// Optional helper types if your project uses TS
// type Transaction = typeof DATA_TRANSACTIONS[number]

export default function TransactionList() {
  // ---- UI state
  const [isOpenModalExport, setIsOpenModalExport] = useState(false)
  const [isOpenModalAdvanceSearch, setIsOpenModalAdvanceSearch] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  // ---- Search state
  const [query, setQuery] = useState('')
  const [loadingSearch, setLoadingSearch] = useState(false)
  const [showPreviewSearch, setShowPreviewSearch] = useState(false)
  const [statusFilter, setStatusFilter] = useState<string>('')

  const inputRef = useRef<HTMLInputElement | null>(null)
  const previewRef = useRef<HTMLDivElement | null>(null)

  // ---- Derived data
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    const base = statusFilter
      ? DATA_TRANSACTIONS.filter(t => (t.status ?? '').toLowerCase() === statusFilter.toLowerCase())
      : DATA_TRANSACTIONS

    if (!q) return base
    return base.filter(t => {
      const hay = [
        String(t.id),
        t?.pasien?.name ?? '',
        t?.doctor?.name ?? '',
        t?.branch?.name ?? '',
        t?.room ?? '',
        t?.date ?? '',
      ]
        .join(' | ')
        .toLowerCase()
      return hay.includes(q)
    })
  }, [query, statusFilter])

  // ---- Debounce search loader
  useEffect(() => {
    if (!showPreviewSearch) return
    setLoadingSearch(true)
    const t = setTimeout(() => setLoadingSearch(false), 350)
    return () => clearTimeout(t)
  }, [query, showPreviewSearch])

  // ---- Click outside to close preview
  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!previewRef.current) return
      if (
        previewRef.current &&
        !previewRef.current.contains(e.target as Node) &&
        !(inputRef.current && inputRef.current.contains(e.target as Node))
      ) {
        setShowPreviewSearch(false)
      }
    }
    document.addEventListener('mousedown', onDocClick)
    return () => document.removeEventListener('mousedown', onDocClick)
  }, [])

  const handleOpenExport = () => setIsOpenModalExport(true)
  const handleCloseExport = () => setIsOpenModalExport(false)

  const handleApplyAdvanced = (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    // You can read form values here and set additional filters
    setIsOpenModalAdvanceSearch(false)
    setShowPreviewSearch(false)
  }

  // ---- Small helpers
  const ToggleButton = ({ id, active, icon, label, onClick }: any) => (
    <>
      <input type="radio" className="btn-check" name="viewtoggle" id={id} checked={active} onChange={onClick} />
      <label className={`btn ${active ? 'btn-primary' : 'btn-outline-primary-600'} radius-8`} htmlFor={id} title={label}>
        <Icon icon={icon} />
      </label>
    </>
  )

  return (
    <>
      <Card
        renderHeader={
          <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
            {/* Left cluster: View toggle + Search */}
            <div className="d-flex flex-wrap align-items-center gap-3">
              {/* View toggle */}
              <div className="btn-group" role="group" aria-label="Toggle view mode">
                <ToggleButton id="viewGrid" active={viewMode === 'grid'} icon="mdi:view-grid-outline" label="Grid" onClick={() => setViewMode('grid')} />
                <ToggleButton id="viewList" active={viewMode === 'list'} icon="mdi:view-list" label="List" onClick={() => setViewMode('list')} />
              </div>

              {/* Search */}
              <div className="position-relative">
                <Input
                  ref={inputRef as any}
                  icon="ion:search-outline"
                  placeholder="Cari transaksi, pasien, dokter, cabang…"
                  onFocus={() => setShowPreviewSearch(true)}
                  onChange={e => setQuery(e.target.value)}
                  value={query}
                />

                {/* Preview dropdown */}
                {showPreviewSearch && (
                  <div ref={previewRef} className="position-absolute mt-2 z-3" style={{ minWidth: 360 }}>
                    <Card
                      renderHeader={
                        <div className="d-flex flex-wrap gap-2 align-items-center">
                          <Button size="sm" variant={statusFilter === '' ? 'primary' : 'outline'} onClick={() => setStatusFilter('')}>
                            Semua
                          </Button>
                          {['PAID', 'UNPAID', 'PROCESSING'].map(s => (
                            <Button key={s} size="sm" variant={statusFilter === s ? 'primary' : 'outline'} onClick={() => setStatusFilter(s)}>
                              {s}
                            </Button>
                          ))}
                          <Button size="sm" variant="ghost" onClick={() => setIsOpenModalAdvanceSearch(true)}>
                            <Icon icon="mdi:tune-variant" /> Filter lanjutan
                          </Button>
                        </div>
                      }
                    >
                      <div className="d-flex flex-column gap-3" style={{ maxHeight: 360, overflowY: 'auto' }}>
                        {loadingSearch ? (
                          <div className="d-flex align-items-center gap-2 text-muted p-2">
                            <span className="spinner-border spinner-border-sm" role="status" />
                            <span>Mencari…</span>
                          </div>
                        ) : filtered.length === 0 ? (
                          <div className="text-center text-muted p-3">Tidak ada hasil</div>
                        ) : (
                          filtered.slice(0, 8).map(t => (
                            <Link key={t.id} href={`/transaction/${t.id}`} className="btn btn-ghost text-start p-2 d-flex align-items-center gap-2">
                              <PatientAvatar name={t?.pasien?.name} id={t?.pasien?.id} src={t?.pasien?.avatar || '/assets/images/avatar/avatar1.png'} />
                              <div className="d-flex flex-column">
                                <span className="fw-semibold">{t?.pasien?.name}</span>
                                <span className="small text-muted">#{t.id} • {t?.doctor?.name} • {t?.branch?.name}</span>
                              </div>
                            </Link>
                          ))
                        )}
                      </div>
                    </Card>
                  </div>
                )}
              </div>

              <Button onClick={() => setIsOpenModalAdvanceSearch(true)}>
                <div className="d-flex align-items-center gap-2">
                  <Icon icon="mdi:tune-variant" />
                  Advance Search
                </div>
              </Button>
            </div>

            {/* Right cluster: Status select + Export + Create */}
            <div className="d-flex flex-wrap align-items-center gap-3">
              <select className="form-select form-select-sm w-auto" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                <option value="">Semua status</option>
                <option value="PAID">Paid</option>
                <option value="UNPAID">Unpaid</option>
                <option value="PROCESSING">Processing</option>
              </select>

              <Button onClick={handleOpenExport}>
                <div className="d-flex align-items-center gap-2">
                  <Icon icon="mdi:export" />
                  Export
                </div>
              </Button>

              <Link href="/transaction/create" className="btn btn-primary btn-sm">
                <Icon icon="ri:add-line" /> Buat Transaksi
              </Link>
            </div>
          </div>
        }
      >
        <div className="row g-3">
          {filtered.map(p => (
            <TransactionCard key={p.id} viewMode={viewMode} data={p} />
          ))}
        </div>
      </Card>

      {/* Export Modal */}
      <Modal show={isOpenModalExport} onHide={handleCloseExport}>
        <Modal.Header closeButton>
          <Modal.Title>
            <h6 className="mb-0">Export Data Transaksi</h6>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="d-flex flex-column gap-3">
            <p className="mb-0 text-muted small">Pilih format file dan unduh template bila diperlukan untuk impor balik.</p>
            <div className="d-flex gap-2 flex-wrap">
              <Button variant="outline">CSV</Button>
              <Button variant="outline">XLSX</Button>
              <Button variant="outline">PDF</Button>
            </div>
            <div>
              <Button variant="success" size="sm">
                <div className="d-flex gap-2 align-items-center">
                  <Icon icon="lucide:download" />
                  Unduh Template
                </div>
              </Button>
            </div>
            <InputFile title="(Opsional) Unggah data" description="Unggah file xls/csv untuk validasi cepat sebelum impor." />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseExport}>
            Tutup
          </Button>
          <Button variant="primary" onClick={handleCloseExport}>
            Export
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Advanced Search Modal */}
      <Modal show={isOpenModalAdvanceSearch} onHide={() => setIsOpenModalAdvanceSearch(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            <h6 className="mb-0">Advanced Search</h6>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleApplyAdvanced}>
            <div className="row g-3">
              <div className="col-md-6">
                <Input label="Nama Pasien" placeholder="contoh: Slamet Riyadi" />
              </div>
              <div className="col-md-6">
                <Input label="Dokter" placeholder="contoh: dr. Andi" />
              </div>
              <div className="col-md-4">
                <Input label="Tanggal Dari" type="date" />
              </div>
              <div className="col-md-4">
                <Input label="Tanggal Sampai" type="date" />
              </div>
              <div className="col-md-4">
                <label className="form-label">Status</label>
                <select className="form-select" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                  <option value="">Semua</option>
                  <option value="PAID">Paid</option>
                  <option value="UNPAID">Unpaid</option>
                  <option value="PROCESSING">Processing</option>
                </select>
              </div>
              <div className="col-md-6">
                <Input label="Cabang" placeholder="contoh: Jakarta Selatan" />
              </div>
              <div className="col-md-6">
                <Input label="Ruangan" placeholder="contoh: A-03" />
              </div>
            </div>
            <div className="d-flex justify-content-end gap-2 mt-4">
              <Button type="button" variant="outline" onClick={() => setIsOpenModalAdvanceSearch(false)}>
                Batal
              </Button>
              <Button type="submit" variant="primary">
                Terapkan
              </Button>
            </div>
          </form>
        </Modal.Body>
      </Modal>
    </>
  )
}
