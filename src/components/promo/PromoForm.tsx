"use client";
import { Modal, Table } from "react-bootstrap";
import Button from "../primitive/button/Button";
import Card from "../primitive/card/Card";
import Input, { InputRef } from "../primitive/input/Input";
import CheckBoxList from "../primitive/checkbox-list/CheckboxList";
import Select from "../primitive/select/Select";
import { DATA_PROMOS } from "./DATA";
import ProductList from "../product/ProductList";
import { useRef, useState } from "react";
import ButtonDelete from "../primitive/button-delete/ButtonDelete";
import { Icon } from "@iconify/react";
import Checkbox from "../primitive/checkbox/Checkbox";
import InputFile from "../primitive/input-file/InputFile";
import InputNumber from "../primitive/input-number/InputNumber";
import DatePicker from "../primitive/date-picker/DatePicker";
import {  toast } from "react-toastify";

interface PromoFormType {
  name: string;
  start_date: string;
  end_date: string;
}
export default function PromoForm() {
  const inputNameRef = useRef<InputRef>(null);
  const [isOpenModalAddProduct, setIsOpenModalAddProduct] = useState(false);
  const [formData, setFormData] = useState<PromoFormType>({
    name: "",
    start_date: "",
    end_date: "",
  });
  const [isOpenModalImportProduct, setIsOpenModalImportProduct] =
    useState(false);
  const handleOnClickAddProduct = () => {
    setIsOpenModalAddProduct(true);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    console.log(formData)
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    const isValidInputNameRef = inputNameRef.current.validate();
    
    if(!isValidInputNameRef) {
      toast.error("Gagal simpan, pastikan data telah sesuai");
    }else{
      toast.success("berhasil membuat data")
    }
  }

  return (
    <div className="d-flex flex-column gap-2">
      <Card renderHeader={<h6 className="text-md mb-0">Informasi Umum</h6>}>
        <div className="row">
          <div className="col-md-6">
            <div className="d-flex flex-column gap-2">
              <Input
                name="name"
                autofocus={true}
                placeholder="Misal: Promo Kemerdekaan"
                onChange={handleInputChange}
                label="Nama Promo"
                hint="Nama promo hanya untuk penamaan saja agar mudah identifikasi"
                ref={inputNameRef}
                rules={ {
                  required: { message: "Wajib diisi" },
                  min: { value: 3, message: "Minimal 3 karakter" },
                }}
              />
              <div className="row">
                <div className="col-md-6">
                  <DatePicker
                    onChange={handleInputChange}
                    label="Tanggal Mulai"
                    name="start_date"
                    minDate={ new Date()}
                  />
                </div>
                <div className="col-md-6">
                  <DatePicker
                    onChange={handleInputChange}
                    name="end_date"
                    label="Tanggal Selesai"
                    minDate={ formData?.start_date ? new Date(formData?.start_date) :  new Date()}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
      <Card
        renderHeader={
          <div className="d-flex justify-content-between align-items-center">
            <h6 className="text-md mb-0">Productnya</h6>
            <div className="d-flex gap-2">
              <Button
                size="sm"
                onClick={() => setIsOpenModalImportProduct(true)}
              >
                Import Excel
              </Button>
              <Button size="sm" onClick={handleOnClickAddProduct}>
                Tambah Produk
              </Button>
            </div>
          </div>
        }
        renderFooter={
          <div className="d-flex justify-content-end">
            <Button className="text-end" onClick={handleSubmit}>
              <Icon icon="mdi:disk" />
              Simpan
            </Button>
          </div>
        }
      >
        <Table>
          <thead>
            <tr>
              <th>Nama produknya</th>
              <th>Cabang & Variant</th>
              <th>Diskonnya</th>
              <th>Min pembelian</th>
              <th>Quota</th>
            </tr>
          </thead>
          <tbody>
            {DATA_PROMOS.map((p) => (
              <tr key={p.id}>
                <td>
                  <h6 className="text-md text-mute mb-0">Serum acne</h6>
                  <p className="mb-0 text-sm">Sku : 2012</p>
                </td>
                <td>
                  <div className="variant-group">
                    <h6 className="text-md mb-0">
                      <Checkbox name="variant" label="500ml" />
                    </h6>
                    <div className="branch-options ps-10">
                      <CheckBoxList
                        name="branch"
                        options={[
                          { label: "Lipo", value: "Lipo" },
                          { label: "Cipulir", value: "2" },
                          { label: "Bekasi", value: "Bekasi" },
                        ]}
                      />
                    </div>
                  </div>
                  <div className="variant-group">
                    <h6 className="text-md mb-0">
                      <Checkbox name="variant" label="500ml" />
                    </h6>
                    <div className="branch-options ps-10">
                      <CheckBoxList
                        name="branch"
                        options={[
                          { label: "Lipo", value: "Lipo" },
                          { label: "Cipulir", value: "2" },
                          { label: "Bekasi", value: "Bekasi" },
                        ]}
                      />
                    </div>
                  </div>
                  <div className="variant-group">
                    <h6 className="text-md mb-0">
                      <Checkbox name="variant" label="500ml" />
                    </h6>
                    <div className="branch-options ps-10">
                      <CheckBoxList
                        name="branch"
                        options={[
                          { label: "Lipo", value: "Lipo" },
                          { label: "Cipulir", value: "2" },
                          { label: "Bekasi", value: "Bekasi" },
                        ]}
                      />
                    </div>
                  </div>
                </td>
                <td>
                  <div className="input-group">
                    <InputNumber />
                    <Select
                      options={[
                        { label: "Persen", value: "persen" },
                        { label: "Nominal", value: "Nominal" },
                      ]}
                    />
                  </div>
                </td>
                <td>
                  <InputNumber name="tes" size="sm" />
                </td>
                <td>
                  <InputNumber format="number" size="sm" />
                </td>
                <td>
                  <ButtonDelete>
                    <Icon icon="mdi:trash" />
                  </ButtonDelete>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card>
      <Modal
        show={isOpenModalAddProduct}
        size="lg"
        onHide={() => setIsOpenModalAddProduct(false)}
      >
        <Modal.Header>
          <div className="d-flex justify-content-between w-100">
            <div className="d-flex flex-wrap gap-2">
              <Icon
                icon="mdi:calendar-plus"
                className="menu-icon"
                style={{ fontSize: 43 }}
              />
              <div className="d-flex flex-column">
                <h6 className="text-lg align-items-center  mb-0 d-flex gap-2">
                  <p className="text-secondary-light mb-0">Buat Promo Baru </p>
                </h6>
                <p className="text-xs text-secondary-light fw-small mb-0">
                  Pilih produk anda yang ingin diterapkan promo ini
                </p>
              </div>
            </div>
            <Button
              onClick={() => setIsOpenModalAddProduct(false)}
              variant="outline"
            >
              <Icon icon="mdi:times" />
            </Button>
          </div>
        </Modal.Header>
        <Modal.Body>
          <ProductList
            exportImport={false}
            addProduct={false}
            showRow={{
              checkbox: true,
              id: false,
              name: true,
              price: true,
              stock: true,
              active: false,
              action: false,
            }}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => setIsOpenModalAddProduct(false)}>
            Tambah Produk
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={isOpenModalImportProduct}
        onHide={() => setIsOpenModalImportProduct(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <h6>Petunjuk Import Data</h6>
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <div className="d-flex flex-column gap-1">
            <h6 className="mb-1 fw-semibold mb-0">Langkah-langkah:</h6>

            <ol className="ps-3">
              <li>Unduh template data terlebih dahulu</li>
              <li>Edit atau sesuaikan data sesuai kebutuhan</li>
              <li>Simpan file hasil edit</li>
              <li>Import kembali file tersebut ke sistem</li>
            </ol>

            <div>
              <Button variant="success" size="sm">
                <div className="d-flex gap-2 align-items-center">
                  <Icon icon="lucide:download" />
                  Unduh Template
                </div>
              </Button>
            </div>
            <InputFile
              title="Unggah data"
              description="Masukan data file xls kamu yang sudah kamu sesuaikan ya, jangan sampai salah yah."
            />
          </div>
        </Modal.Body>

        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setIsOpenModalImportProduct(false)}
          >
            Tutup
          </Button>
          <Button
            variant="primary"
            onClick={() => setIsOpenModalImportProduct(false)}
          >
            Import
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
