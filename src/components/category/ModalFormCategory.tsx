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

export default function ModalFormCategory({isOpen, onClose}){
  const inputNameRef = useRef<RadioButtonRef>(null);
  const [name, setName] = useState<string>()
  const handleOnClose = (open) => {
    onClose?.(open)
  }

  const handleSubmit = (e) => {
    if(e.hasError){
      toast.error("Gagal membuat cost, harap periksa kembali data");
    }else{
      toast.success("Biaya tambahan berhasil di simpan")
      onClose?.(true)
    }
  }
  return (

    <Modal show={isOpen} onHide={()=>handleOnClose(false)} >
      <Form
        onSubmit={handleSubmit}
      >
        <Modal.Header closeButton>
          <Modal.Title><h6 className="mb-0" >Buat Kategori</h6></Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <div className="d-flex flex-column gap-2">
            <Form.Input
              name="name"
              ref={inputNameRef}
              label="Nama Kategori"
              onChange={(e)=>setName(e.target.value)}
              rules={ {
                required: { message: "Wajib diisi" },
              }}
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