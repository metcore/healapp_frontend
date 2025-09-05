'use client'
import { useState } from "react";
import Card from "../primitive/card/Card";
import Switch from "../primitive/switch/Switch";
import Input from "../primitive/input/Input";
import DatePicker from "../primitive/date-picker/DatePicker";
import { ListGroup, ListGroupItem } from "react-bootstrap";
import { DATA_BRANCHS } from "../branch/DATA";

export default function ProductBranchForm() {
  const [turnBranch, setTurnBranch] = useState<boolean>(false);
  const handleTurnBranch = (e) => {
    setTurnBranch(e.target.checked)
  }
  return(
    <Card
      renderHeader={
        <div className="d-flex justify-content-between">
          <div>
          <h6 className="text-md fw-medium mb-0">Pengaturan Cabang</h6>
          <p className="mb-0">Pilih cabang mana yang anda tentukan.</p>
          </div>
          <Switch 
            label={"Hidupkan pengaturan cabang"}
            hint={"Atur jika kamu punya item dengan pengaturan cabang"}
            onChange={handleTurnBranch}
          />
        </div>
      }
    >
      {turnBranch && (
        <ListGroup>
          {DATA_BRANCHS.map((additional, idx) => (
            <ListGroupItem key={idx}>
              <div className="d-flex justify-content-between">
                <p className="mb-0">{additional.name}</p>
                <Switch label={"Aktifkan"}/>
              </div>
            </ListGroupItem>
          ))}
        </ListGroup>
      )}
    </Card>
  )
}