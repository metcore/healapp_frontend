'use client'
import Card from "../primitive/card/Card";
import Input, { InputRef } from "../primitive/input/Input";
import Modal from 'react-bootstrap/Modal';
import RadioButton from "../primitive/radio-button/RadioButton";
import Select, { SelectRef } from "../primitive/select/Select";
import InputFile from "../primitive/input-file/InputFile";
import TextArea from "../primitive/textarea/TextArea";
import Button from "../primitive/button/Button";
import { Icon } from "@iconify/react";
import { useRef, useState } from "react";
import { toast } from "react-toastify";
import LabelInput from "../primitive/label-input/LabelInput";
import DatePicker from "../primitive/date-picker/DatePicker";
import InputDate, { InputDateRef } from "../primitive/date-picker/InputDate";
import Form from "../primitive/form/Form";

type PatientModalFormProps = {
  isOpen: boolean;
  onHide: () => void;
  onSuccess: ()=>void;
};
export default function PatientModalForm({isOpen, onHide, onSuccess}: PatientModalFormProps) {
  const inputNameRef = useRef<InputRef>(null)
  const inputPhoneNumberRef = useRef<InputRef>(null);
  const inputEmailRef = useRef<InputRef>(null);
  const inputBirthDayRef = useRef<InputDateRef>(null);
  const inputGenderRef = useRef<InputRef>(null);
  const inputReligionRef = useRef<SelectRef>(null)
  const [loadingSubmit, setLoadingSubmit] = useState<boolean>(null)
  
  // Address
  const inputAddressRef = useRef<InputRef>(null);

  const inputIdCardTypeRef = useRef<SelectRef>(null);
  const inputIdCardRef = useRef<InputRef>(null);
  const handleOnSubmit =(e)=>{
    setLoadingSubmit(true);
    if(e.hasError){
      setLoadingSubmit(false);
      toast.error("Terjadi kesalahan, harap periksa kembali.",{
        theme: "colored",

      })
      return false
    }
    toast.success("Data pasien berhasil dibuat, anda bisa mengguankannya",{
      theme: "colored",

    })
    onSuccess?.(true)
  }
  return (
    
    <Modal show={isOpen} size="lg" onHide={onHide} >
      <Form onSubmit={handleOnSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>
            <div className="d-flex flex-wrap align-items-center gap-2">
              <Icon icon="fluent:person-20-regular" style={{fontSize:"50px"}} />
              <div className="d-flex flex-column">
                <h6 className="fw-semibold mb-0">Tambah Pasien</h6>
                <p className="text-sm fw-semibold mb-0">Lengkapi data pasien</p>
              </div>
            </div>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="d-flex flex-column gap-4 ">
            <Card
              renderHeader={<h6 className="fw-semibold text-lg mb-0">Informasi Pasien</h6>}
            >
              <div className="d-flex flex-column gap-4">
                <Form.Input
                  name="name"
                  label="Nama Pasien"
                  rules={{
                    required: { message: "Wajib diisi" },
                    min: { value: 6, message: "Minimal 6 karakter" },
                  }}
                  icon="fluent:person-20-regular"
                  placeholder="Masukan nama pasien "
                  
                  // value={variant.name}
                  // onChange={e => handleVariantChange(idx, "name", e.target.value)}
                />
                <div className="row">
                  <div className="col-md-6">
                    <Form.Input
                      name="phone_number"
                      label="Nomor Telepon"
                      icon="fluent:call-20-regular"
                      placeholder="Contoh 6281234567890"
                      hint="Nomor telepon harus diawali dengan 62"
                      rules={ {
                        required: { message: "Wajib diisi" },
                        phone: { message: "Format telepon 628960000" },
                        min: { value: 3, message: "Minimal 10 karakter" },
                      }}
                      // value={variant.sku}
                      // onChange={e => handleVariantChange(idx, "sku", e.target.value)}
                    />
                  </div>
                  <div className="col-md-6">
                    <Form.Input
                      name="email"
                      label="Email"
                      placeholder={`Misal : exampel@${process.env.NEXT_PUBLIC_DOMAIN}`}
                      icon="fluent:mail-20-regular"
                      hint="Harus format email yang valid"
                      rules={ {
                        required: { message: "Wajib diisi" },
                        email: { message: "Harus email yang benar" },
                        min: { value: 5, message: "Minimal 5 karakter" },
                      }}
                      // value={variant.price}
                      // onChange={e => handleVariantChange(idx, "price", e.target.value)}
                    />
                  </div>
                  
                </div>

                <Form.TextArea
                  name="address"
                  label="Alamat"
                  icon="fluent:location-20-regular"
                  placeholder="Masukan alamat lengkap pasien"
                  rules={ {
                    required:{message:"Masukan alamat lengkap pasien"},
                    min: { value: 3, message: "Minimal 10 karakter" },
                  }}
                />
                
                <div className="row">
                  <InputDate 
                    rules={ {
                      required:{message:"Masukan tanggal"},
                    }}
                    label="Tanggal Lahir"
                  />
                </div>
                  
                <Form.RadioButton 
                  label="Jenis Kelamin"
                  orientation="vertical"
                  name="gender"
                  options={[
                    { label: "Laki-laki", value: "male" },
                    { label: "Perempuan", value: "female" },
                  ]}
                  rules={{
                    required:{message:"Pilih jenis kelamin"}
                  }}
                />
                <Form.Select 
                  label={"Religion"}
                  rules={{
                    required:{message:"Pilih agama pasien"}
                  }}
                  name="religion"
                  options={[{ label: "Islam", value: "islam" }, { label: "Kristen", value: "kristen" }, { label: "Hindu", value: "hindu" }, { label: "Buddha", value: "buddha" }]}
                />
                
                <InputFile
                  label="Dokumen Pendukung"
                  hint={"Misal ktp / sim / passport"}
                  // value={variant.image}
                  // onChange={file => handleVariantChange(idx, "image", file)}
                />
              </div>
            </Card>
            <Card
              renderHeader={<h6 className="fw-semibold text-lg mb-0">Informasi Tambahan</h6>}
            >
              <div className="d-flex flex-column gap-4">
                <div>
                  <LabelInput label="ID card" />
                  <div className="d-flex input-group-sm mb-3">
                    
                      <Select 

                        options={[
                          {label:"Ktp", value:"ktp"},
                          {label:"Sim", value:"sim"},
                          {label:"NPWP", value:"npwp"},
                        ]}
                        placeholder="Pilih id card"
                        rules={{
                          required: {message:"Jenis id card harap dipilih"}
                        }}
                        ref={inputIdCardTypeRef}
                      />

                      <Input 
                        size="sm"
                        placeholder="Mis: 62123451323***"
                        rules={{
                          required: { message: "Wajib diisi" },
                          min: { value: 6, message: "Minimal 6 karakter" },
                        }}
                        ref={inputIdCardRef}
                      />
                  </div>
                </div>
                
                <Input
                  label="Nomor BPJS"
                  icon="fluent:mail-20-regular"
                  placeholder="Masukan nomor BPJS pasien"
                />
              </div>
            </Card>
            <Card
              renderHeader={
                <div>

                  <div className="d-flex flex-wrap align-items-center gap-2">
                    <Icon icon="fluent:call-20-regular" className="text-lg mb-2" />
                    <h6 className="fw-semibold text-lg mb-0">Koktak darurat</h6>
                  </div>
                  <p className="mb-0 text-mute">Ini digunakan ketika ada keadaan darurat pasien, terdapat seseorang yang bisa di hubungi</p>
                </div>
              }
            >
              <div className="d-flex flex-column gap-4">
                <Form.Select
                  label={"Hubungan"} 
                  name="emergency_contact_relation"
                  placeholder={"Pilih hubungan kontak darurat ke pasien"}
                  options={[
                    {label:"Keluarga", value:"keluarga"},
                    {label:"Istri / Suami", value:"istri"},
                    {label:"Orang tua", value:"orang_tua"},
                    {label:"Anak", value:"anak"},
                    {label:"Teman", value:"teman"},
                  ]}
                />
                <Form.Input
                  name="emergency_contact_name"
                  label="Nama Kontak Darurat"
                  icon="fluent:person-20-regular"
                  placeholder="Misal: Slamet riyadi"
                />
                <Input
                  label="Nomor Telepon Kontak Darurat"
                  icon="fluent:call-20-regular"
                  placeholder="Misal: 62896****"
                />
                <Input
                  name="emergency_contact_email"
                  label="Email"
                  icon="fluent:mail-20-regular"
                  placeholder={`Misal: example@${process.env.NEXT_PUBLIC_DOMAIN}`}
                />
              </div>
            </Card>
          </div>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            Tutup
          </Button>
          <Form.ButtonSubmit
            variant="primary"
            loading={loadingSubmit}
          >
            Simpan
          </Form.ButtonSubmit>
        </Modal.Footer>
      </Form>
    </Modal>
  )
}