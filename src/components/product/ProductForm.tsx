'use client'
import Card from "../primitive/card/Card"
import InputFile from "../primitive/input-file/InputFile"
import Input, { InputRef } from "../primitive/input/Input"
import Select from "../primitive/select/Select"
import CreatableSelect from "../primitive/select/CreatableSelect"
import TextArea from "../primitive/textarea/TextArea"
import Switch from "../primitive/switch/Switch"
import { useRef, useState } from "react"
import Modal from 'react-bootstrap/Modal';
import { Icon } from "@iconify/react"
import ButtonDelete from "../primitive/button-delete/ButtonDelete"
import { DATA_PRODUCTS } from "./DATA"
import ProductFormReceipt from "./ProductFormReceipt"
import Button from "../primitive/button/Button"
import { Alert } from "react-bootstrap"
import ProductPackageForm from "./ProductPacakgeForm"
import ProductPeriodeForm from "./ProductPeriodeForm"
import ProductBranchForm from "./ProductBranchFrom"
import ProductAdditionalForm from "./ProductAdditionalForm"
import ProductInventoryForm from "./ProductInventoryForm"
import { optionCategories } from "../category/helpers"
import { toast } from "react-toastify"
import Form from "../primitive/form/Form"

export default function ProductForm(){
  const [selectedTypeItem, setSelectedTypeItem] = useState<string>("")
  const [modalSelectTypeItem, setModalSelectTypeItem] = useState<boolean>(false);
  const [turnOnStock, setTurnOnStock] = useState<boolean>();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    sku:"",
  });
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => { 
    if (e.hasError) {
      toast.error("Terjadi kesalahan, periksa kembali data");
      return;
    }
    toast.success("Data berhasil di simpan");
  };

  
  const handleSelectTypeItem =(e) => {
    setSelectedTypeItem(e)
    setModalSelectTypeItem(false)
  }
  
  return (
    <>
  
      <Form
        onSubmit={handleSubmit}
      >
      <div className='d-flex flex-wrap align-items-center justify-content-between gap-3 mb-24'>
        <h6 className='fw-semibold mb-0'>Buat Produk</h6>
        
        <Form.ButtonSubmit variant="primary" size="sm">
          <div className="d-flex gap-2 align-items-center">
            <Icon icon='lucide:save' />
            Simpan
          </div>
        </Form.ButtonSubmit>
      </div>
      <Card>
        <div className="row gy-3">
          <div className="col-sm-8">
            <div className="row gy-3">
              <div className="col-12">
                <Card
                  renderHeader={
                    <h6 className="text-md fw-semibold mb-0">Deskripsi</h6>
                  }
                >
                  <div className="row gy-3">
                    <div className="col-12">
                      <Form.Input
                        label="Nama produk" 
                        name="name"
                        rules={ {
                          required: { message: "Wajib diisi" },
                          min: { value: 3, message: "Minimal 3 karakter" },
                        }}
                        onChange={(e) => handleChange(e)}
                        placeholder="Misal: Air Mineral"
                      />
                    </div>
                    <div className="col-12">
                      <Form.Input
                        label="SKU" 
                        name="sku"
                        onChange={(e) => handleChange(e)}
                        placeholder="Misal: 32132 EB ..."
                      />
                    </div>
                    <div className='col-12'>
                      <Form.TextArea
                        name="description"
                        onChange={(e) => handleChange(e)}
                        label="Deskripsi produk" 
                        placeholder="Misal: Minuman air mineral dengan kemasan ..."
                      />
                    </div>
                  </div>
                </Card>
              </div>
              <div className="col-12">
                <ProductInventoryForm/>
              </div>
              <div className="col-12">
                <ProductAdditionalForm />
              </div>
              <div className="col-12">
                <ProductFormReceipt />
              </div>
              <div className="col-12">
                <ProductPackageForm />
              </div>
              <div className="col-12">
                <ProductPeriodeForm />
              </div>
              <div className="col-12">
                <ProductBranchForm />
              </div>
            </div>
          </div>
          <div className="col-sm-4">

            <div className="row gy-3">
              <div className="col-12">
                <Card
                  renderHeader={
                    <h6 className="text-md fw-medium mb-0">Kategori</h6>
                  }
                >
                  <div className="row gy-3">
                    <div className="col-12">
                      <CreatableSelect 
                        options={optionCategories} 
                        label={"Kategori"}
                        isMulti
                      />
                    </div>
                    <div className='col-12'>
                      <Select options={optionCategories} label={"Tag"} />
                    </div>
                  </div>
                </Card>
              </div>
              <div className="col-12">
                <Card
                  renderHeader={
                    <div>
                      <h6 className="text-md fw-medium mb-0">Gambar Utama Produk</h6>

                    </div>
                  }
                >
                  <InputFile />
                  <ul className="list-group">
                    <li className="list-group-item disabled" aria-disabled="true">
                        <p className="text-sm mb-0 text-secondary-light">
                          Gambar produk akan ditampilkan pada halaman produk. 
                        </p>
                    </li>
                    <li className="list-group-item">
                        <p className="text-sm mb-0 text-secondary-light">
                          Kamu bisa mengunggah gambar utama produk disini.
                        </p>
                    </li>
                    <li className="list-group-item">
                      <p className="text-sm mb-0 text-secondary-light">
                        Jika kamu menghidupkan variant, kamu bisa mengunggah gambar variant pada masing-masing variant.
                      </p>
                    </li>
                  </ul>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </Card>
      </Form>
      <Modal show={modalSelectTypeItem} onHide={() => setModalSelectTypeItem(false)}> 
        <Modal.Header closeButton>
          <Modal.Title><h6>Pilih Jenis Item</h6></Modal.Title>
        </Modal.Header>

        <Modal.Body>

          <p className="text-muted">
            Silakan pilih jenis item yang ingin Anda buat.  
            <br /> 
            - <b>Produk</b>: Barang yang dijual (contoh: krim, vitamin, alat kesehatan).  
            <br /> 
            - <b>Treatment</b>: Layanan/jasa medis atau perawatan pasien.  
            <br /> 
            - <b>Paket</b>: Gabungan produk/treatment yang bisa digunakan beberapa kali.
          </p>
          <div className="d-flex flex-column gap-2">
            <Button
              variant="outline-primary"
              onClick={() => handleSelectTypeItem("produk")}
            >
              Produk
            </Button>
            <Button
              variant="outline-success"
              onClick={() => handleSelectTypeItem("treatment")}
            >
              Treatment / Service
            </Button>
            <Button
              variant="outline-warning"
              onClick={() => handleSelectTypeItem("paket")}
            >
              Paket Treatment
            </Button>
          </div>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => setModalSelectTypeItem(false)}>
            Batal
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}