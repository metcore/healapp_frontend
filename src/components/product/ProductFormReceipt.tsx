'use client'
import { useState } from "react";
import ButtonDelete from "../primitive/button-delete/ButtonDelete";
import Card from "../primitive/card/Card";
import { DATA_PRODUCTS } from "./DATA";
import { Icon } from "@iconify/react";
import Button from "../primitive/button/Button";
import { Alert } from "react-bootstrap";
import Switch from "../primitive/switch/Switch";
import Form from "../primitive/form/Form";

export default function ProductFormReceipt() {
  const [turnOnReceipt, setTurnOnReceipt] = useState<boolean>(false);
  const [receipts, setReceipts]  = useState<Array<string>>([{receipt_product_id:null}]);
  const handleAddReceipt = () => {
    setReceipts([...receipts, { name:null }])
  }
  return(
    <Card
      renderHeader={

        <div className="d-flex justify-content-between">
          <div>
          <h6 className="text-md fw-medium mb-0">Resep</h6>
          <p className="mb-0">Ini digunakan untuk mengatur resep disetiap satuan stok</p>
          </div>
          <Switch 
            label={"Hidupkan Resep"}
            hint={"Atur jika kamu punya resep"}
            onChange={(e)=>setTurnOnReceipt(e.target.checked)}
          />
        </div>
      }
    >

      {turnOnReceipt ? (
        <div className="d-flex flex-column gap-2">

          <Alert variant="danger">
            Setiap penjualan akan mengurangi stok dari data yang anda pilih dibawah ini!
          </Alert>
          {receipts.map((receipt, idx) => (
            <div key={idx} className="row">
              <div className="col-md-6">
                <Form.Select 
                  label="Produk / Treatment"
                  name="receipt_product_id[]"
                  placeholder="Pilih item / treatment"
                  options={DATA_PRODUCTS.map(item => ({
                    label: item.name,
                    value: item.id
                  }))}
                  rules={{ required: { message: "Wajib diisi" } }}
                />
              </div>
              <div className="col-md-3">
                <Form.InputNumber
                  format="number"
                  name="receipt_quantity[]"
                  label="Quantiti"
                  rules={{ required: { message: "Wajib diisi" } }}
                />
              </div>
              <div className="col-md-3  d-flex align-items-center justify-content-center">
                <ButtonDelete>
                  <Icon icon="mdi:trash" />
                </ButtonDelete>
              </div>
            </div>
          ))}
          <Button className="mt-9 center text-center content-center" onClick={handleAddReceipt}>
            Tambah Receipt
          </Button>
        </div>
      ) : "" }
    </Card>
  )
}