'use client'

import { Modal } from 'react-bootstrap';
import { useMemo, useRef, useState, useEffect } from 'react';
import Button from '../primitive/button/Button';
import Card from '../primitive/card/Card';
import Input, { InputRef } from '../primitive/input/Input';
import ProductList from '../product/ProductList';
import ButtonDelete from '../primitive/button-delete/ButtonDelete';
import { Icon } from '@iconify/react';
import InputFile from '../primitive/input-file/InputFile';
import RadioButton, { RadioButtonRef } from '../primitive/radio-button/RadioButton';
import DatePicker, { DatePickerRef } from '../primitive/date-picker/DatePicker';
import InputNumber, { InputNumberRef } from '../primitive/input-number/InputNumber';
import Table from '../primitive/table/Table';
import { formatNumberRupiah } from '@/helper/formatNumber';
import { toast } from 'react-toastify';

interface PromoFormType {
  name: string;
  start_date: string; // YYYY-MM-DD
  end_date: string;   // YYYY-MM-DD
  code: string;
  type_cut: 'nominal' | 'percent';
  amount_nominal?: number;
  amount_percent?: number;
  amount_percent_max?: number;
  min_transaction?: number;
  max_quota?: number;
}

type ItemData = {
  id: string;
  name: string;
  price: number;
};

export default function VoucherForm() {
  const [isOpenModalAddProduct, setIsOpenModalAddProduct] = useState<boolean>(false);
  const [isOpenModalImportProduct, setIsOpenModalImportProduct] = useState(false);
  const [specificProductMode, setSpecificProductMode] = useState<'all' | 'specific'>('all');
  const [selectedProductData, setSelectedProductData] = useState<ItemData[]>([]);

  const [formData, setFormData] = useState<PromoFormType>({
    name: '',
    start_date: '',
    end_date: '',
    code: '',
    type_cut: 'nominal',
  });

  // Refs
  const inputNameRef = useRef<InputRef>(null);
  const inputCodeRef = useRef<InputRef>(null);
  const inputStartDateRef = useRef<DatePickerRef>(null);
  const inputEndDateRef = useRef<DatePickerRef>(null);
  const inputTypeRef = useRef<RadioButtonRef>(null);
  const inputAmountNominalRef = useRef<InputNumberRef>(null);
  const inputAmountDiscountPercentRef = useRef<InputNumberRef>(null);
  const inputAmountDiscountPercentMaxRef = useRef<InputNumberRef>(null);
  const inputMinTransactionRef = useRef<InputNumberRef>(null);
  const inputMaxQuotaRef = useRef<InputNumberRef>(null);

  // Helpers
  const isPercent = formData.type_cut === 'percent';

  const parsedStartDate = useMemo(() => (formData.start_date ? new Date(formData.start_date) : undefined), [formData.start_date]);
  const parsedEndDate = useMemo(() => (formData.end_date ? new Date(formData.end_date) : undefined), [formData.end_date]);

  // Keep end_date >= start_date
  useEffect(() => {
    if (parsedStartDate && parsedEndDate && parsedEndDate < parsedStartDate) {
      setFormData((prev) => ({ ...prev, end_date: prev.start_date }));
    }
  }, [formData.start_date]);

  const handleSubmit = () => {
    const isValidInputNameRef = inputNameRef.current?.validate();
    const isValidInputCodeRef = inputCodeRef.current?.validate();
    const isValidInputStartDateRef = inputStartDateRef.current?.validate();
    const isValidInputEndDateRef = inputEndDateRef.current?.validate();
    const isValidInputTypeRef = inputTypeRef.current?.validate();
    const isValidInputAmountNominalRef = inputAmountNominalRef?.current?.validate() ?? true;
    const isValidInputAmountDiscountPercentRef = inputAmountDiscountPercentRef?.current?.validate() ?? true;
    const isValidInputAmountDiscountPercentMaxRef = inputAmountDiscountPercentMaxRef?.current?.validate() ?? true;
    const isValidInputMinTransactionRef = inputMinTransactionRef?.current?.validate() ?? true;
    const isValidInputMaxQuotaRef = inputMaxQuotaRef?.current?.validate();

    const allValid = [
      isValidInputNameRef,
      isValidInputCodeRef,
      isValidInputStartDateRef,
      isValidInputEndDateRef,
      isValidInputTypeRef,
      isPercent ? isValidInputAmountDiscountPercentRef : isValidInputAmountNominalRef,
      isPercent ? isValidInputAmountDiscountPercentMaxRef : true,
      isValidInputMinTransactionRef,
      isValidInputMaxQuotaRef,
    ].every(Boolean);

    if (!allValid) {
      toast.error('Gagal membuat voucher, harap periksa kembali data');
      return;
    }

    // TODO: submit to API
    toast.success('Voucher berhasil disimpan');
  };

  const handleChange = (e: { target: { name?: string; value: any } }) => {
    const { name, value } = e.target;
    if (!name) return;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Radio product scope (fix bug: previously returned array)
  const handleOnChangeProductSpecific = (e: { target: { value: 'all' | 'specific' } }) => {
    setSpecificProductMode(e.target.value);
  };

  // Derive table data with simulated discounted price demo (if available)
  const tableRows = useMemo(() => {
    return selectedProductData.map((item) => {
      const before = item.price ?? 0;
      let after = before;
      if (isPercent && formData.amount_percent) {
        const raw = before - before * (formData.amount_percent / 100);
        after = Math.max(0, raw);
        if (formData.amount_percent_max) {
          const cap = before - formData.amount_percent_max;
          after = Math.max(after, cap);
        }
      } else if (!isPercent && formData.amount_nominal) {
        after = Math.max(0, before - formData.amount_nominal);
      }
      return {
        ...item,
        price_before: before,
        price_after: after,
      };
    });
  }, [selectedProductData, formData.amount_percent, formData.amount_percent_max, formData.amount_nominal, isPercent]);

  return (
    <div className="d-flex flex-column gap-3">
      {/* Header / Breadcrumb-ish */}
      <div className="d-flex align-items-center justify-content-between rounded-3 p-3 bg-light">
        <div className="d-flex align-items-center gap-2">
          <Icon icon="mdi:ticket-percent-outline" fontSize={28} />
          <div>
            <h5 className="mb-0">Buat Voucher Promo</h5>
            <small className="text-secondary">Atur detail voucher, periode, dan cakupan produk.</small>
          </div>
        </div>
        <div className="d-flex gap-2">
          <Button variant="secondary" onClick={() => window.history.back()}>
            <Icon icon="mdi:arrow-left" /> Kembali
          </Button>
          <Button onClick={handleSubmit}>
            <Icon icon="mdi:content-save" /> Simpan
          </Button>
        </div>
      </div>

      {/* Section: Informasi Umum */}
      <Card
        renderHeader={<h6 className="text-md mb-0 d-flex align-items-center gap-2"><Icon icon="mdi:information-outline" /> Informasi Umum</h6>}
      >
        <div className="row g-3">
          <div className="col-12 col-lg-6">
            <div className="d-flex flex-column gap-3">
              <Input
                name="name"
                label="Nama Promo"
                placeholder="Mis: Voucher Promo 17 Agustus"
                hint="Nama promo hanya untuk penamaan agar mudah diidentifikasi"
                ref={inputNameRef}
                onChange={handleChange}
                rules={{ required: { message: 'Wajib diisi' } }}
              />

              <Input
                name="code"
                label="Kode Voucher"
                placeholder="Mis: MURAH17"
                hint="Kode yang akan dimasukkan saat transaksi"
                ref={inputCodeRef}
                onChange={handleChange}
                rules={{
                  required: { message: 'Wajib diisi' },
                  max: { value: 8, message: 'Maksimal 8 karakter' },
                  min: { value: 4, message: 'Minimal 4 karakter' },
                }}
              />

              <div className="row g-3">
                <div className="col-12 col-md-6">
                  <DatePicker
                    name="start_date"
                    label="Tanggal Mulai"
                    ref={inputStartDateRef}
                    minDate={new Date()}
                    rules={{ required: { message: 'Wajib diisi' } }}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-12 col-md-6">
                  <DatePicker
                    name="end_date"
                    label="Tanggal Selesai"
                    ref={inputEndDateRef}
                    rules={{ required: { message: 'Wajib diisi' } }}
                    onChange={handleChange}
                    minDate={parsedStartDate ?? new Date()}
                  />
                </div>
              </div>

              <RadioButton
                name="type_cut"
                ref={inputTypeRef}
                value={formData.type_cut}
                onChange={handleChange}
                label="Jenis Potongan"
                orientation="vertical"
                rules={{ required: { message: 'Wajib diisi' } }}
                options={[
                  { label: 'Nominal', value: 'nominal' },
                  { label: 'Persen', value: 'percent' },
                ]}
              />

              {/* Percent Fields */}
              <div className={`row g-3 ${!isPercent ? 'd-none' : ''}`}>
                <div className="col-12 col-md-6">
                  <InputNumber
                    format="percent"
                    name="amount_percent"
                    icon="mdi:percent"
                    label="Besaran Diskon (%)"
                    ref={inputAmountDiscountPercentRef}
                    onChange={handleChange}
                    rules={{
                      requiredIf: {
                        condition: isPercent,
                        message: 'Nominal potongan harus diisi',
                      },
                    }}
                  />
                </div>
                <div className="col-12 col-md-6">
                  <InputNumber
                    name="amount_percent_max"
                    label="Maksimum Potongan (Rp)"
                    ref={inputAmountDiscountPercentMaxRef}
                    onChange={handleChange}
                    rules={{
                      requiredIf: {
                        condition: isPercent,
                        message: 'Maksimum potongan harus diisi',
                      },
                    }}
                  />
                </div>
              </div>

              {/* Nominal Field */}
              <div className={`${isPercent ? 'd-none' : ''}`}>
                <InputNumber
                  label="Nominal Potongan (Rp)"
                  name="amount_nominal"
                  ref={inputAmountNominalRef}
                  onChange={handleChange}
                  rules={{
                    requiredIf: {
                      condition: !isPercent,
                      message: 'Nominal potongan harus diisi',
                    },
                  }}
                />
              </div>

              <div className="row g-3">
                <div className="col-12 col-md-6">
                  <InputNumber
                    name="min_transaction"
                    ref={inputMinTransactionRef}
                    onChange={handleChange}
                    hint="Minimum pembelian per transaksi untuk mendapatkan potongan"
                    label="Minimum Pembelian (Rp)"
                    rules={{ required: { message: 'Minimum transaksi harus diisi' } }}
                  />
                </div>
                <div className="col-12 col-md-6">
                  <InputNumber
                    name="max_quota"
                    ref={inputMaxQuotaRef}
                    format="number"
                    placeholder="Mis: 100"
                    onChange={handleChange}
                    label="Maksimal Kuota Voucher"
                    hint="Total kuota voucher yang dapat digunakan"
                    rules={{ required: { message: 'Maksimal kuota voucher harus diisi' } }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right column: Scope & Actions */}
          <div className="col-12 col-lg-6">
            <div className="rounded border p-3 h-100">
              <div className="d-flex align-items-start justify-content-between">
                <div>
                  <h6 className="mb-1">Cakupan Produk</h6>
                  <small className="text-secondary">Terapkan voucher ke semua produk atau produk tertentu.</small>
                </div>
              </div>

              <div className="mt-3">
                <RadioButton
                  hint="Pilih implementasi voucher pada produk tertentu atau semuanya"
                  name="implement_product"
                  orientation="vertical"
                  onChange={handleOnChangeProductSpecific}
                  value={specificProductMode}
                  options={[
                    { label: 'Terapkan Semua', value: 'all' },
                    { label: 'Spesifik Produk', value: 'specific' },
                  ]}
                />
              </div>

              {specificProductMode === 'specific' && (
                <div className="d-flex gap-2 mt-3 flex-wrap">
                  <Button size="sm" variant="outline" onClick={() => setIsOpenModalImportProduct(true)}>
                    <Icon icon="lucide:download" /> Import Excel
                  </Button>
                  <Button size="sm" onClick={() => setIsOpenModalAddProduct(true)}>
                    <Icon icon="mdi:playlist-plus" /> Tambah Produk
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* Section: Produk dipilih */}
      <Card
        renderHeader={<h6 className="text-md mb-0 d-flex align-items-center gap-2"><Icon icon="mdi:clipboard-list-outline" /> Item yang dipilih</h6>}
      >
        {specificProductMode === 'specific' ? (
          <Table
            data={tableRows}
            columns={[
              { attribute: 'id', label: 'Nama Produk', value: (data: any) => data.name },
              { attribute: 'price', label: 'Harga sebelum voucher', value: (data: any) => formatNumberRupiah(data.price_before) },
              { attribute: 'price_after', label: 'Perkiraan harga setelah voucher', value: (data: any) => formatNumberRupiah(data.price_after) },
              {
                attribute: 'action',
                label: 'Action',
                value: () => (
                  <ButtonDelete>
                    <Icon icon="mdi:trash" />
                  </ButtonDelete>
                ),
              },
            ]}
          />
        ) : (
          <div className="text-secondary">Voucher akan diterapkan ke semua produk.</div>
        )}

        <div className="d-flex justify-content-end mt-3">
          <Button onClick={handleSubmit}>
            <Icon icon="mdi:content-save" /> Simpan
          </Button>
        </div>
      </Card>

      {/* Modal: Add Product */}
      <Modal show={isOpenModalAddProduct} size="lg" onHide={() => setIsOpenModalAddProduct(false)}>
        <Modal.Header>
          <div className="d-flex justify-content-between w-100 align-items-center">
            <div className="d-flex flex-wrap gap-2 align-items-center">
              <Icon icon="mdi:calendar-plus" className="menu-icon" style={{ fontSize: 32 }} />
              <div className="d-flex flex-column">
                <h6 className="text-lg mb-0 d-flex gap-2 align-items-center">
                  <span className="text-secondary-light">Tambah Produk</span>
                </h6>
                <p className="text-xs text-secondary-light mb-0">Pilih produk yang ingin diterapkan voucher ini</p>
              </div>
            </div>
            <Button onClick={() => setIsOpenModalAddProduct(false)} variant="outline">
              <Icon icon="mdi:close" />
            </Button>
          </div>
        </Modal.Header>
        <Modal.Body>
          <ProductList
            exportImport={false}
            addProduct={false}
            onChecked={(rows: ItemData[]) => setSelectedProductData(rows)}
            showRow={{ checkbox: true, id: false, name: true, price: true, stock: false, type: true, is_active: false, action: false }}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => setIsOpenModalAddProduct(false)}>Selesai</Button>
        </Modal.Footer>
      </Modal>

      {/* Modal: Import */}
      <Modal show={isOpenModalImportProduct} onHide={() => setIsOpenModalImportProduct(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            <h6>Petunjuk Import Data</h6>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="d-flex flex-column gap-2">
            <h6 className="mb-1 fw-semibold mb-0">Langkah-langkah:</h6>
            <ol className="ps-3 mb-0">
              <li>Unduh template data terlebih dahulu</li>
              <li>Edit atau sesuaikan data sesuai kebutuhan</li>
              <li>Simpan file hasil edit</li>
              <li>Import kembali file tersebut ke sistem</li>
            </ol>
            <div>
              <Button variant="success" size="sm">
                <div className="d-flex gap-2 align-items-center">
                  <Icon icon="lucide:download" /> Unduh Template
                </div>
              </Button>
            </div>
            <InputFile title="Unggah data" description="Unggah file .xls yang sudah disesuaikan." />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setIsOpenModalImportProduct(false)}>
            Tutup
          </Button>
          <Button variant="primary" onClick={() => setIsOpenModalImportProduct(false)}>
            Import
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
