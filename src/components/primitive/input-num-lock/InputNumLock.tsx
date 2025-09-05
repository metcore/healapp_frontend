'use client'
import { useState, useEffect } from "react";
import Button from "../button/Button";
import Input from "../input/Input";
import InputNumber from "../input-number/InputNumber";

export type InputNumLockProps = {
  name: string;
  value?: string;
  onChange?: (value: string) => void;
};

export default function InputNumLock({ onChange, name, value = "" }: InputNumLockProps) {
  const [payment, setPayment] = useState(value);

  // Sync state dengan props.value jika berubah dari parent
  useEffect(() => {
    setPayment(value || "");
  }, [value]);

  const updateValue = (newValue: string) => {
    const cleaned = newValue.replace(/[^0-9]/g, "");
    setPayment(cleaned);
    onChange?.(cleaned);
  };

  const handleNumberClick = (num: number) => {
    updateValue(payment + num);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateValue(e.target.value);
  };

  const handleClear = () => {
    updateValue("");
  };

  const handleBackspace = () => {
    updateValue(payment.slice(0, -1));
  };

  const handlePreset = (amount: number) => {
    updateValue(String(amount));
  };

  return (
    <div>
      <div className="mb-3">
        <InputNumber
          placeholder="0"
          name={name}
          value={payment}
          autoFocus={true}
          onChange={handleChange}
        />
      </div>

      <div className="d-grid gap-2">
        {/* Preset Amounts */}
        <div className="justify-content-center center d-flex gap-2">
          <Button
            size="sm"
            className="btn btn-outline-neutral-900 radius-8 px-20 py-11"
            onClick={() => handlePreset(1000000)}
          >
            Rp1.000.000
          </Button>
          <Button
            size="sm"
            className="btn btn-outline-neutral-900 radius-8 px-20 py-11"
            onClick={() => handlePreset(500000)}
          >
            Rp500.000
          </Button>
          <Button
            size="sm"
            className="btn btn-outline-neutral-900 radius-8 px-20 py-11"
            onClick={() => handlePreset(300000)}
          >
            Rp300.000
          </Button>
        </div>

        {/* Number Pad */}
        <div className="d-flex gap-2">
          {[1, 2, 3].map((n) => (
            <div key={n} className="ratio ratio-16x9 w-10 text-center justify-content-center center align-items-center" >
              <Button
                onClick={() => handleNumberClick(n)}
                className="fw-bold text-lg flex-fill d-flex justify-content-center align-items-center"
                variant="outline"
              >
                {n}
              </Button>
            </div>
          ))}
        </div>

        <div className="d-flex gap-2">
          {[4, 5, 6].map((n) => (
            
            <div key={n} className="ratio ratio-16x9 w-10">
              <Button
                onClick={() => handleNumberClick(n)}
                className="fw-bold text-lg flex-fill d-flex justify-content-center align-items-center"
                variant="outline"
              >
                {n}
              </Button>
            </div>
          ))}
        </div>

        <div className="d-flex gap-2">
          {[7, 8, 9].map((n) => (
            <div key={n} className="ratio ratio-16x9 w-10">
              <Button
                onClick={() => handleNumberClick(n)}
                className="fw-bold text-lg flex-fill d-flex justify-content-center align-items-center"
                variant="outline"
              >
                {n}
              </Button>
            </div>
          ))}
        </div>

        <div className="d-flex gap-2">
          <div className="ratio ratio-16x9 w-10">
            <Button
              className="fw-bold text-lg flex-fill d-flex justify-content-center align-items-center"
              variant="outline"
              onClick={handleClear}
            >
              C
            </Button>
          </div>
          <div className="ratio ratio-16x9 w-10">
            <Button
              className="fw-bold text-lg flex-fill d-flex justify-content-center align-items-center"
              variant="outline"
              onClick={() => handleNumberClick(0)}
            >
              0
            </Button>
          </div>
          <div className="ratio ratio-16x9 w-10">
            <Button
              className="fw-bold text-lg flex-fill d-flex justify-content-center align-items-center"
              variant="outline"
              onClick={handleBackspace}
            >
              ⌫
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
