'use client'
import { useState } from "react";
import Card from "../primitive/card/Card";
import Switch from "../primitive/switch/Switch";
import InputNumber from "../primitive/input-number/InputNumber";
import Button from "../primitive/button/Button";
import Input from "../primitive/input/Input";

export type DataTargetType = {
  id: string;
  omset: number | null;
  commission: number | null;
};

export default function CommissionTargetForm() {
  const [turnOnTarget, setTurnOnTarget] = useState<boolean>(false);
  const [dataTarget, setDataTarget] = useState<DataTargetType[]>([]);

  const handleChange = (id: string, field: keyof DataTargetType, value: number | null) => {
    setDataTarget(prev =>
      prev.map(item =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const handleAddTarget = () => {
    setDataTarget(prev => [
      ...prev,
      { id: crypto.randomUUID(), omset: null, commission: null }
    ]);
  };

  const handleRemove = (id: string) => {
    setDataTarget(prev => prev.filter(item => item.id !== id));
  };

  return (
    <Card
      renderHeader={
        <div className="d-flex justify-content-between">
          <div>
            <h6 className="text-md fw-medium mb-0">Target Komisi</h6>
            <p className="mb-0">
              Jika kamu mempunyai target komisi kamu bisa mengaturnya pada bagian ini
            </p>
          </div>
          <Switch
            label={"Hidupkan Target Komisi"}
            hint={"Atur jika kamu mempunyai target komisi"}
            onChange={(e) => setTurnOnTarget(e.target.checked)}
          />
        </div>
      }
    >
      {turnOnTarget && (
        <div className="d-flex flex-column gap-3">
          {dataTarget.map((item, idx) => (
            <div key={item.id} className="row align-items-end g-2">
              <div className="col">
                <InputNumber
                  label="Omset"
                  placeholder="Mis : 20.000.000"
                  value={item.omset ?? ""}
                  onChange={(val) => handleChange(item.id, "omset", val)}
                />
              </div>
              <div className="col">
                <InputNumber
                  icon="mdi:percent"
                  format="percent"
                  label="Komisi yang didapat"
                  placeholder="Mis : 2%"
                  value={item.commission ?? ""}
                  onChange={(val) => handleChange(item.id, "commission", val)}
                />
              </div>
              <div className="col">
                <Input
                  label="Catatan"
                  placeholder="Mis : 2%"
                  value={item.commission ?? ""}
                  onChange={(val) => handleChange(item.id, "commission", val)}
                />
              </div>
              <div className="col-auto">
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleRemove(item.id)}
                >
                  Hapus
                </Button>
              </div>
            </div>
          ))}

          {/* Tombol Tambah di kanan bawah */}
          <div className="d-flex justify-content-end">
            <Button onClick={handleAddTarget}>Tambah Target</Button>
          </div>
        </div>
      )}
    </Card>
  );
}
