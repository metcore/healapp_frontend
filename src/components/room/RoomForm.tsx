import { useState } from "react";
import Input from "../primitive/input/Input";
import TextArea from "../primitive/textarea/TextArea";
import { Room } from "./RoomList";
import InputNumber from "../primitive/input-number/InputNumber";
import Card from "../primitive/card/Card";
import Switch from "../primitive/switch/Switch";
import RadioButton from "../primitive/radio-button/RadioButton";
import ButtonDelete from "../primitive/button-delete/ButtonDelete";
import Button from "../primitive/button/Button";
import Form from "../primitive/form/Form";
import { required } from "@/helper/Validation/Validator";
import CreatableSelect from "../primitive/select/CreatableSelect";

export default function RoomForm(){

  const [dataBeds, setdDataBeds] = useState<Array<string>>([{name: "", price: ""}]);
  const [form, setForm] = useState<Partial<Room>>({
    status: "available",
    sanitation: "Bersih",
    equipment: [],
    beds: [],
    floor:"",
    is_mulitple_bed:false
  });
  const handleTurnOnMultiBed = () => {

  }

  const handleAddBed = () => {
    setdDataBeds([...dataBeds, { name: "hii" }])
  }
  const handleRemoveBed = (idx) => {
    setdDataBeds(dataBeds.filter((_, i) => i !== idx));
  }

  const handleOnSubmit = (e) => {
    setForm(e.values)
    console.log(form)
  }

  const renderMultipleBed = () => { 
    return(
      <>
        {dataBeds.map((dataBed, idx) => (
          <div className="row gy-2" key={idx}>
            <div className="col-md-5 col-lg-5">
              <Input
                label="Nama / Nomor ranjang"
                placeholder="Mis: 201, 202"
                value={dataBed.name}
                // onChange={e => handleVariantChange(idx, "name", e.target.value)}
              />
            </div>
            <div className="col-md-5 col-lg-5">
              <InputNumber
                label="Harga"
                placeholder="Masukan harga"
                value={dataBed.price}
                // onChange={e => handleVariantChange(idx, "price", e.target.value)}
              />
            </div>
            <div className="col-md-2 col-lg-2">
                <ButtonDelete
                  variant="outline-danger"
                  size="sm"
                  onSuccess={() => handleRemoveBed(idx)}
                  disabled={dataBed.length === 1}
                >
                  Hapus
                </ButtonDelete>
            </div>
          </div>
        ))}

        <div className="col-12 d-flex justify-content-end">
          <Button
            variant="primary"
            className=" btn-block"
            onClick={()=>handleAddBed()}
          >
            Tambah Ranjang
          </Button>
        </div>
      </>
    )
  }

  const handleValidateOnChange = () => {

  }

  const handleOnChange = (e) => {
    console.log(e.values)
    setForm(e.values)
  }

  return (
    <Form validateOnChange={true} onSubmit={handleOnSubmit}  onChange={handleOnChange}>
      <div className="d-flex flex-column gap-2">
        <Card
          renderHeader={
            <h6 className="text-md fw-semibold mb-0">Informasi Umum</h6>
          }
        >
          <div className="row g-3">
            <div className="col-md-6">
              <Form.Input
                label="Nama"
                value={form.name || ""}
                rules={
                  {required:{message:"Nama ruangan harus diisi"}}
                }
                name="name"
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div className="col-md-6">
              <Form.Select
                name={"is_isolation"}
                label="Isolasi (Negative Pressure)"
                options={[
                  {label:"ya", value:true},
                  {label:"Tidak", value:false}
                ]}
                rules={
                  {required:{message:"Pilih isolasi atau tidak"}}
                }
              />
            </div>
            <div className="col-12">
              <Form.TextArea
                label="Catatan"
                name="note"
                rules={
                  {required:{message:"Pilih isolasi atau tidak"}}
                }
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">Lantai</label>
              <Form.InputNumber
                format="number"
                // value={form.floor || 0}
                onChange={(e) => setForm({ ...form, floor: e?.target?.value })}
                rules={{
                  required: {message:"Pilih lantai atau tidak"},
                  min:{value:1, message:"Mimal lantai 1"}
                }}
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Tipe</label>
              <select className="form-select" value={(form.type as any) || "Poliklinik"} onChange={(e) => setForm({ ...form, type: e.target.value as RoomType })}>
                {(["Poliklinik","UGD","Rawat Inap","ICU","OK","Radiologi","Laboratorium","Vaksinasi","Perawatan Luka"] as RoomType[]).map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div className="col-12">
              <label className="form-label">Peralatan</label>
              <CreatableSelect
                label="Peralalatan"
              />
              <div className="d-flex flex-wrap gap-2">
                {(["Ventilator","USG","EKG","X-Ray","Infusion Pump","Defibrillator","Monitor Pasien","Negative Pressure","Incubator"] as Equipment[]).map((a) => {
                  const active = (form.equipment as Equipment[] | undefined)?.includes(a);
                  return (
                    <button
                      type="button"
                      key={a}
                      className={`btn btn-sm ${active ? "btn-primary" : "btn-outline-secondary"}`}
                      onClick={() => toggleEquip(a)}
                    >
                      {a}
                    </button>
                  );
                })}
              </div>
            </div>

          </div>
        </Card>
        
        <Card
          renderHeader={
            <div className="d-flex justify-content-between">
              <div>
              <h6 className="text-md fw-medium mb-0">Pengaturan jumlah & harga kasur</h6>
              </div>
            </div>
          }
        >
          <div className="row g-3">
            <Form.RadioButton
              label="Banyaknya kasur"
              orientation="horizontal"
              name="is_mulitple_bed"
              value={form.is_mulitple_bed}
              options={[
                {label:"1 kasur", value:1},
                {label:"Multiple Kasur", value:2}
              ]}
            />
              
            {form.is_mulitple_bed == 2 ? renderMultipleBed() : (
              <>
                <Form.InputNumber
                  name="price"
                  label="Harga" format="number"
                  rules={{
                    required:{message: "Masukan harga kamar"}
                  }}
                />
              </>
            )}
          </div>
        </Card>
      </div>
      <Form.ButtonSubmit >Tes</Form.ButtonSubmit>
    </Form>
  )
}