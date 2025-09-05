'use client'
import { useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Icon } from '@iconify/react'
import { ListGroup, ListGroupItem } from 'react-bootstrap'
import { toast } from 'react-toastify'

import Card from '../primitive/card/Card'
import Input, { InputRef } from '../primitive/input/Input'
import Button from '../primitive/button/Button'
import InputNumLock from '../primitive/input-num-lock/InputNumLock'
import LabelInput from '../primitive/label-input/LabelInput'

// Types

type PaymentMethod = '' | 'cash' | 'qris' | 'debit' | 'credit'

type OrderItem = {
  id: string
  name: string
  qty: number
  kind: 'Product' | 'Treatment'
  price: number // unit price actually paid
  priceStrikethrough?: number // optional original price
}

export default function TransactionPayment() {
  const router = useRouter()

  // ----- State
  const [loadingSubmit, setLoadingSubmit] = useState(false)
  const [loadingSubmitVoucher, setLoadingSubmitVoucher] = useState(false)
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod>('')
  const [codeVoucher, setCodeVoucher] = useState('')
  const inputCodeVoucherRef = useRef<InputRef>(null)

  const [formData, setFormData] = useState({
    code_voucher: '',
    description: '',
    sku: '',
  })

  // ----- Mock order data (replace with real data/props)
  const orderItems: OrderItem[] = [
    { id: 'p1', name: 'Acne peel', qty: 2, kind: 'Product', price: 250_000, priceStrikethrough: 320_000 },
    { id: 'p2', name: 'Acne peel', qty: 2, kind: 'Product', price: 250_000, priceStrikethrough: 320_000 },
    { id: 'p3', name: 'Acne peel', qty: 2, kind: 'Product', price: 250_000, priceStrikethrough: 320_000 },
    { id: 't1', name: 'Acne peel', qty: 2, kind: 'Treatment', price: 250_000 },
  ]

  const voucherValue = 200_000

  const subtotal = useMemo(() => {
    return orderItems.reduce((sum, it) => sum + it.price * it.qty, 0)
  }, [orderItems])

  const tax = 200_000 // mock PPN
  const isVoucherApplied = Boolean(formData.code_voucher)
  const voucher = isVoucherApplied ? voucherValue : 0
  const grandTotal = subtotal + tax - voucher

  // ----- Handlers
  const handleOnClickSubmitPayment = () => {
    if (!selectedPaymentMethod) {
      toast.error('Pilih metode pembayaran dulu ya')
      return
    }

    setLoadingSubmit(true)
    // Simulate pay flow
    const t = setTimeout(() => {
      setLoadingSubmit(false)
      router.push('/transaction/success')
    }, 800)

    // Optional: cleanup if component unmounts before timeout fires
    return () => clearTimeout(t)
  }

  const handleClickPaymentMethod = (pm: PaymentMethod) => {
    setSelectedPaymentMethod(pm)
  }

  const handleSubmitVoucher = () => {
    if (loadingSubmitVoucher) return

    setLoadingSubmitVoucher(true)
    if(isVoucherApplied){
      setFormData(prev => ({ ...prev, code_voucher:false}))
      toast.info('Kode voucher berhasil di batalkan')
      setLoadingSubmitVoucher(false)
      return
    }
    if (!codeVoucher.trim()) {
      toast.error('Harap masukkan kode voucher terlebih dahulu')
      setLoadingSubmitVoucher(false)
      inputCodeVoucherRef.current?.focus()
      return
    }

    // TODO: validate voucher via API
    setTimeout(() => {
      toast.success('Kode voucher berhasil diterapkan')
      setFormData(prev => ({ ...prev, code_voucher: codeVoucher.trim() }))
      setLoadingSubmitVoucher(false)
    }, 500)
  }

  // ----- Render helpers
  const PaymentMethodButton = ({
    active,
    icon,
    label,
    onClick,
  }: {
    active: boolean
    icon: string
    label: string
    onClick: () => void
  }) => (
    <Button
      size="sm"
      className={`radius-10 px-20 py-11 w-100 d-flex align-items-center justify-content-center gap-2 ${
        active ? 'btn btn-primary' : 'btn btn-outline-neutral-900'
      }`}
      onClick={onClick}
    >
      <Icon icon={icon} />
      <span className="fw-semibold">{label}</span>
      {active && <Icon icon="mdi:check-circle" />}
    </Button>
  )

  const renderPaymentArea = () => {
    switch (selectedPaymentMethod) {
      case 'cash':
        return (
          <div className="d-flex flex-column gap-2">
            <LabelInput label="Nominal Pembayaran (Tunai)" />
            <InputNumLock name="payment" />
            <p className="text-sm text-secondary-light mb-0">
              Masukkan jumlah uang yang diterima dari pasien.
            </p>
          </div>
        )
      case 'qris':
        return (
          <div className="d-flex flex-column gap-2">
            <p className="mb-0">Scan QRIS pelanggan lalu klik Bayar sekarang.</p>
            <div className="border rounded-3 d-flex align-items-center justify-content-center p-4">
              <Icon icon="mdi:qrcode-scan" className="text-2xl" />
              <span className="ms-2">Tampilkan/scan QR</span>
            </div>
          </div>
        )
      case 'debit':
      case 'credit':
        return (
          <div className="d-flex flex-column gap-3">
            <p className="mb-0">Gesek/kirim transaksi di mesin EDC sebelum klik Bayar sekarang.</p>
            <Input label="Nomor Kartu" icon="mdi:card" placeholder="#### #### #### ####" />
            <div className="d-flex gap-2">
              <Input label="Nama di Kartu" icon="mdi:account" placeholder="Nama sesuai kartu" />
              <Input label="MM/YY" icon="mdi:calendar" placeholder="MM/YY" />
              <Input label="CVV" icon="mdi:shield-key" placeholder="***" />
            </div>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="container-fluid">
      <div className="row g-4">
        {/* Left: Order */}
        <div className="col-lg-8">
          <Card
            renderHeader={
              <div className="d-flex flex-column gap-3">
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <h6 className="text-lg mb-0">Informasi Pasien</h6>
                    <p className="mb-0">Slamet Riyadi</p>
                  </div>
                  <div className="text-end">
                    <p className="mb-0">Minggu, 27 Agustus 2025</p>
                    <p className="mb-0">Klinik HERCA</p>
                  </div>
                </div>

                {/* Voucher */}
                <div>
                  <LabelInput label="Kode Voucher" hint={true} />
                  <p className="text-sm mb-2 text-secondary-light">
                    Jika pasien memberikan kode voucher, masukkan di sini ya.
                  </p>
                  <div className="input-group">
                    <Input
                      name="code_voucher"
                      ref={inputCodeVoucherRef}
                      onChange={e => setCodeVoucher(e.target.value)}
                      icon="mdi:coupon"
                      placeholder="Mis: VOUCHER16"
                      defaultValue={formData.code_voucher}
                    />
                    <Button
                      onClick={handleSubmitVoucher}
                      loading={loadingSubmitVoucher}
                      disabled={loadingSubmitVoucher}
                      variant={isVoucherApplied ? 'danger' : 'primary'}
                    >
                      {isVoucherApplied ? 'Batalkan' : 'Gunakan'}
                    </Button>
                  </div>
                  <div className="mt-2">
                    <span className="badge bg-soft-primary text-primary">
                      Manfaatkan potongan sebesar Rp {voucherValue.toLocaleString('id-ID')}
                    </span>
                    {isVoucherApplied && (
                      <span className="badge bg-success ms-2">Voucher diterapkan</span>
                    )}
                  </div>
                </div>
              </div>
            }
            renderFooter={
              <div className="d-flex flex-column gap-2">
                <div className="d-flex justify-content-between">
                  <p className="mb-0">Sub Total</p>
                  <h6 className="text-lg mb-0">Rp{subtotal.toLocaleString('id-ID')}</h6>
                </div>
                <div className="d-flex justify-content-between">
                  <p className="mb-0">PPN</p>
                  <h6 className="text-lg mb-0">Rp{tax.toLocaleString('id-ID')}</h6>
                </div>
                <div className="d-flex justify-content-between">
                  <p className="mb-0">Voucher</p>
                  <h6 className={`text-lg mb-0 ${isVoucherApplied ? 'text-success' : ''}`}>
                    {isVoucherApplied ? '-' : ''}Rp{voucherValue.toLocaleString('id-ID')}
                  </h6>
                </div>
                <hr className="my-1" />
                <div className="d-flex justify-content-between align-items-center">
                  <p className="mb-0 fw-semibold">Grand Total</p>
                  <h5 className="mb-0">Rp{grandTotal.toLocaleString('id-ID')}</h5>
                </div>
              </div>
            }
          >
           {/* Header + badge jumlah item */}
            <div className="d-flex align-items-center justify-content-between mb-3">
              <h6 className="text-lg mb-0">Detail Order</h6>
              <span className="badge bg-soft-neutral">{orderItems.length} items</span>
            </div>

            {/* Tabel responsif ala invoice */}
            <div className="table-responsive border rounded-3">
              <table className="table align-middle mb-0">
                <thead className="bg-light text-muted">
                  <tr>
                    <th>Item</th>
                    <th className="text-center">Qty</th>
                    <th className="text-end">Harga</th>
                    <th className="text-end">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {orderItems.map((it) => (
                    <tr key={it.id}>
                      <td>
                        <div className="fw-semibold">{it.name}</div>
                        <div className="small text-muted">{it.kind}</div>
                        {it.priceStrikethrough && (
                          <div className="text-muted text-decoration-line-through small">
                            @Rp{it.priceStrikethrough.toLocaleString('id-ID')}
                          </div>
                        )}
                        <div className="text-danger fw-semibold small">
                          @Rp{it.price.toLocaleString('id-ID')}
                        </div>
                      </td>
                      <td className="text-center">x{it.qty}</td>
                      <td className="text-end">Rp{it.price.toLocaleString('id-ID')}</td>
                      <td className="text-end fw-semibold">
                        Rp{(it.price * it.qty).toLocaleString('id-ID')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </Card>
        </div>

        {/* Right: Payment */}
        <div className="col-lg-4">
          <Card
            renderHeader={
              <div>
                <h6 className="mb-0 text-lg">Masukkan jumlah pembayaran</h6>
                <p className="text-muted mb-0">Pilih metode & isi detail pembayaran</p>
              </div>
            }
          >
            <div className="d-flex flex-column gap-4">
              {/* Payment method grid */}
              {!selectedPaymentMethod && (
                <div className="row g-2">
                  <div className="col-6">
                    <PaymentMethodButton
                      active={false}
                      icon="mdi:cash"
                      label="Cash"
                      onClick={() => handleClickPaymentMethod('cash')}
                    />
                  </div>
                  <div className="col-6">
                    <PaymentMethodButton
                      active={false}
                      icon="mdi:qrcode-scan"
                      label="QRIS"
                      onClick={() => handleClickPaymentMethod('qris')}
                    />
                  </div>
                  <div className="col-6">
                    <PaymentMethodButton
                      active={false}
                      icon="mdi:credit-card-outline"
                      label="Kartu Debit"
                      onClick={() => handleClickPaymentMethod('debit')}
                    />
                  </div>
                  <div className="col-6">
                    <PaymentMethodButton
                      active={false}
                      icon="mdi:credit-card"
                      label="Kartu Kredit"
                      onClick={() => handleClickPaymentMethod('credit')}
                    />
                  </div>
                </div>
              )}

              {selectedPaymentMethod && (
                <div className="d-flex align-items-center justify-content-between">
                  <div className="d-flex align-items-center gap-2">
                    <Icon icon="mdi:information-outline" />
                    <span className="text-sm">Metode dipilih:</span>
                    <span className="badge bg-primary text-uppercase">
                      {selectedPaymentMethod.replace('_', ' ')}
                    </span>
                  </div>
                  <Button variant="outline" className="text-primary" onClick={() => setSelectedPaymentMethod('')}>
                    <Icon icon="mdi:arrow-left" /> Ganti
                  </Button>
                </div>
              )}

              {renderPaymentArea()}

              <div className="d-flex justify-content-between gap-2">
                <Button size="sm" onClick={() => router.back()}>
                  <div className="d-flex gap-2 align-items-center">
                    <Icon icon="mdi:arrow-left" />
                    Kembali ke transaksi
                  </div>
                </Button>

                {selectedPaymentMethod ? (
                  <Button
                    onClick={handleOnClickSubmitPayment}
                    size="sm"
                    confirmation={true}
                    className="btn btn-primary"
                    loading={loadingSubmit}
                    disabled={loadingSubmit}
                  >
                    <div className="d-flex gap-2 align-items-center">
                      <Icon icon="mdi:money" />
                      Bayar sekarang
                    </div>
                  </Button>
                ) : null}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
