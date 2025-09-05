'use client'
import { useState } from "react";
import Card from "../primitive/card/Card";
import Switch from "../primitive/switch/Switch";
import Input from "../primitive/input/Input";
import CounterButton from "../primitive/counter-button/CounterButton";

export default function ProductPackageForm() {
  const [turnOnStock, setTurnOnStock] = useState<boolean>(false);
  const handleTurnOnPackage = (e) => {
    setTurnOnStock(e.target.checked)
  }
  return(
    <Card
      renderHeader={
        <div className="d-flex justify-content-between">
          <div>
          <h6 className="text-md fw-medium mb-0">Paket Item</h6>
          <p>Jika anda ingin menerapkan item paket, anda bisa mengaturnya di bagian ini</p>
          </div>
          <Switch 
            label={"Hidupkan paket"}
            hint={"Atur jika kamu punya item paket"}
            onChange={handleTurnOnPackage}
          />
        </div>
      }
    >
      {turnOnStock ? (
        <>
          <CounterButton
            label="Jumlah"
            hint="Jumlah berapa kali yang didapat pasien setiap ada pembelian item "
          />
        </>
      ) : ""}
      
    </Card>
  )
}