'use client'
import { useRef, useState } from "react";
import { Modal } from "react-bootstrap";
import Button from "../primitive/button/Button";
import { Icon } from "@iconify/react";
import Input from "../primitive/input/Input";
import RadioButton, { RadioButtonRef } from "../primitive/radio-button/RadioButton";
import InputNumber, { InputNumberRef, InputNumberTypeProps } from "../primitive/input-number/InputNumber";
import { toast } from "react-toastify";
import Form from "../primitive/form/Form";

export type AdditionalCostFormType = {
  type: string  | null;
  amount: number | null;
}
export default function ModalFormAdditionalCost({isOpen, onClose}){InputNumberTypeProps
  const [typeAmount, setTypeAmount] = useState<InputNumberTypeProps>()
  const [formData, setFormData ] =useState<AdditionalCostFormType>({
    type: null,
    amount: null
  })

  const handleSubmit = (fields) => {
    console.log(fields)
    if(fields?.hasError){
      toast.error("Gagal membuat cost, harap periksa kembali data");
    }else{
      toast.success("Biaya tambahan berhasil di simpan")
      onClose?.(true)
    }

    fields?.current?.forEach(element => {
      const { name, value } = element.target;
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    });
  }

  const handleOnHaserror = (hasError:boolean) => {
    // if(hasError){
    //   toast.error("Gagal membuat cost, harap periksa kembali data");
    // }
  }
  return (
    <Modal show={isOpen} onHide={()=>onClose(false)} >
      <Modal.Header closeButton>
        <Modal.Title><h6 className="mb-0" >Buat additional cost</h6></Modal.Title>
      </Modal.Header>

      <Form
        onSubmit={handleSubmit}
        onHasError={handleOnHaserror}
      >
        <Modal.Body>
          <div className="d-flex flex-column gap-2">
            <Form.Input
              name="name"
              rules={ {
                required: { message: "Wajib diisi" },
              }}
              label="Namanya"
            />
            <Form.RadioButton
              name="type"
              hint="Tentukan mana jenis amountnnya"
              label="Jenis Amount"
              onChange={(e)=>setTypeAmount(e.target.value)}
              rules={ {
                required: { message: "Wajib diisi" },
              }}
              options={[
                {label:"Persen", value:"percent"},
                {label:"Nominal", value:"currency"}
              ]}
            />
            <Form.InputNumber
              name="amount"
              disabled={typeAmount ? false : true}
              rules={ {
                required: { message: "Wajib diisi" },
                min: {value:0, message:"Minimal 0"},
              }}
              format={typeAmount}
              tooltip={!typeAmount ? "Pilih jenis amount terlebih dahulu" : ""}
              label="Nilainya"
            />
            <Form.DatePicker
              name="effective_date"
              rules={ {
                required: { message: "Wajib diisi" },
                min: {value:0, message:"Minimal 0"},
              }}
              label="Tanggal Berlaku"
            />
            <Form.TextArea
              name="remark"
              label="Catatan tambahan"
            />
          </div>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={()=>handleOnClose(false)}>
            Tutup
          </Button>
          <Form.ButtonSubmit />
        </Modal.Footer>
      </Form>
    </Modal>
  )
}