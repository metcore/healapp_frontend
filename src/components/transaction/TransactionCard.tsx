import Link from 'next/link'
import Card from '../primitive/card/Card'
import { Icon } from '@iconify/react'
import Badge from '../primitive/badge/Badge'
import TransactionActionButton from './TransactionActionButton'
import PatientAvatar from '../patient/PatientAvatar'
import { useMemo, useState } from 'react'

type ViewMode = 'grid' | 'list'

export default function TransactionList({
  data,
  viewMode,
}: {
  data: any
  viewMode: ViewMode
}) {
  const [hover, setHover] = useState(false)

  const formatIDR = (n: number) => `Rp ${Number(n ?? 0).toLocaleString('id-ID')}`
  const totalQty = useMemo(
    () => data?.items?.reduce((a: number, it: any) => a + (it?.quantity ?? 0), 0) ?? 0,
    [data]
  )
  const totalAmount = useMemo(() => data?.total ?? 200000.12, [data])

  const statusVariant: Record<string, any> = {
    PAID: 'success',
    UNPAID: 'warning',
    DUE: 'danger',
    REFUNDED: 'neutral',
    PROCESSING: 'info',
  }
  const variant = statusVariant[data?.status] ?? 'warning'

  // ---------- GRID (Card) ----------
  const renderGridCard = () => (
    <div
      key={data?.id}
      className="col-md-4 mb-3"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <Card
        renderHeader={
          <div className="d-flex justify-content-between gap-2">
            <div className="d-flex flex-column gap-1">
              <div className="d-flex align-items-center gap-2">
                <span className="text-muted">#</span>
                <Link
                  href={`/transaction/${data?.id}`}
                  className="fw-semibold text-primary text-decoration-none"
                >
                  {data?.id}
                </Link>
                <Badge variant={variant} className="ms-1 text-uppercase">
                  {data?.status}
                </Badge>
              </div>
              <div className="small text-muted">{data?.date}</div>
            </div>

            <div className="text-end d-flex flex-column gap-2">
              <div className="d-flex align-items-center justify-content-end gap-2 text-muted">
                <Icon icon="mdi:map-marker-outline" />
                <span className="small">{data?.branch?.name}</span>
              </div>
              <div className="d-flex align-items-center justify-content-end gap-2 text-muted">
                <Icon icon="mdi:door" />
                <span className="small">{data?.room}</span>
              </div>
            </div>
          </div>
        }
        renderFooter={
          <div className="d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center gap-2 text-muted small">
              <Icon icon="mdi:shopping-outline" />
              <span>{totalQty} items</span>
            </div>
            <div className="text-end">
              <div className="text-muted small">Total</div>
              <div className="fw-semibold text-lg text-truncate" title={formatIDR(totalAmount)}>
                {formatIDR(totalAmount)}
              </div>
            </div>
          </div>
        }
      >
        {/* Patient & Doctor Row */}
        <div className="d-flex align-items-center justify-content-between flex-wrap gap-3 mb-3">
          <PatientAvatar
            name={data?.pasien?.name}
            id={data?.pasien?.id}
            src={data?.pasien?.avatar || '/assets/images/avatar/avatar1.png'}
          />
          <div className="d-flex align-items-center gap-2 text-muted">
            <Icon icon="mdi:stethoscope" />
            <span className="small">{data?.doctor?.name}</span>
          </div>
        </div>

        {/* Items compact table */}
        <div className="border rounded-3 overflow-hidden mb-3">
          <div
            className="d-none d-md-grid px-3 py-2 bg-light text-muted"
            style={{ gridTemplateColumns: '1fr 80px' }}
          >
            <div>Item</div>
            <div className="text-end">Qty</div>
          </div>

          {data?.items?.map((p: any) => (
            <div
              key={p?.id}
              className="px-3 py-2 border-top d-grid gap-1 align-items-center"
              style={{ gridTemplateColumns: '1fr 80px' }}
            >
              <div>
                <div className="d-flex align-items-center gap-2">
                  <span className="fw-semibold">{p?.name}</span>
                  {p?.type && (
                    <span className="badge bg-soft-neutral text-uppercase small">{p?.type}</span>
                  )}
                </div>
                {p?.note && <div className="small text-muted mt-1">{p?.note}</div>}
                <div className="d-md-none small text-muted mt-1">Qty x{p?.quantity}</div>
              </div>
              <div className="d-none d-md-flex align-items-center justify-content-end">
                x{p?.quantity}
              </div>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
          <Link href={`/transaction/${data?.id}`} className="btn btn-outline-neutral-900 btn-sm">
            <Icon icon="mdi:eye-outline" className="me-1" /> Lihat detail
          </Link>
          <TransactionActionButton />
        </div>
      </Card>
    </div>
  )

  // ---------- LIST (Row) ----------
  const renderListRow = () => (
    <div key={data?.id} className="col-12 mb-2">
      <div className="border rounded-3 p-3 bg-white d-flex align-items-center justify-content-between gap-3">
        {/* Left cluster: ID + status + patient + meta */}
        <div className="d-flex align-items-center gap-3 flex-wrap">
          {/* ID + status */}
          <div className="d-flex align-items-center gap-2">
            <span className="text-muted">#</span>
            <Link
              href={`/transaction/${data?.id}`}
              className="fw-semibold text-primary text-decoration-none"
            >
              {data?.id}
            </Link>
            <Badge variant={variant} className="text-uppercase">
              {data?.status}
            </Badge>
          </div>

          <div className="vr d-none d-md-block" />

          {/* Patient */}
          <PatientAvatar
            name={data?.pasien?.name}
            id={data?.pasien?.id}
            src={data?.pasien?.avatar || '/assets/images/avatar/avatar1.png'}
          />

          {/* Meta: doctor, date, branch, room */}
          {data?.doctor?.name && (
            <div className="d-flex align-items-center gap-1 text-muted small">
              <Icon icon="mdi:stethoscope" /> {data?.doctor?.name}
            </div>
          )}
          {data?.date && (
            <div className="d-flex align-items-center gap-1 text-muted small">
              <Icon icon="mdi:calendar" /> {data?.date}
            </div>
          )}
          {data?.branch?.name && (
            <div className="d-flex align-items-center gap-1 text-muted small">
              <Icon icon="mdi:map-marker-outline" /> {data?.branch?.name}
            </div>
          )}
          {data?.room && (
            <div className="d-flex align-items-center gap-1 text-muted small">
              <Icon icon="mdi:door" /> {data?.room}
            </div>
          )}
        </div>

        {/* Middle: items summary (truncate on small) */}
        <div className="text-muted small flex-grow-1 d-none d-lg-block text-truncate" title={data?.items?.map((p: any) => `${p?.name} (x${p?.quantity})`).join(' • ')}>
          {data?.items?.map((p: any) => `${p?.name} (x${p?.quantity})`).join(' • ')}
        </div>

        {/* Right: totals + actions */}
        <div className="d-flex align-items-center gap-3">
          <div className="text-end">
            <div className="text-muted small">Total</div>
            <div className="fw-semibold">{formatIDR(totalAmount)}</div>
            <div className="text-muted small">{totalQty} items</div>
          </div>

          {/* Actions */}
          <div className="d-none d-md-block">
            <TransactionActionButton />
          </div>

          <Link href={`/transaction/${data?.id}`} className="btn btn-outline-neutral-900 btn-sm">
            <Icon icon="mdi:eye-outline" />
          </Link>
        </div>
      </div>
    </div>
  )

  return viewMode === 'list' ? renderListRow() : renderGridCard()
}
