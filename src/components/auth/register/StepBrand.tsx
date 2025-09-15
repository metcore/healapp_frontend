"use client";

import { useRef, useState } from "react";
import Card from "@/components/primitive/card/Card";
import Input, { InputRef } from "@/components/primitive/input/Input";
import { useRouter } from "next/navigation";
import { validate } from "@/helper/Validation/Validate";
import {  WizardNavigation } from "@/components/primitive/wizard/Wizard";
import Button from "react-bootstrap/esm/Button";
import Form from "@/components/primitive/form/Form";

const rules = {
  required: { message: "Wajib diisi" },
  min: { value: 5, message: "Minimal 5 karakter" },
}
type StepBrandProps = {
  refInputBrand: React.RefObject<InputRef>;
};
export default function StepBrand({ refInputBrand }: StepBrandProps) {
  const [email, setEmail] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [hasError, setHasError] = useState<boolean>(false)
  const [feedback, setFeedback] = useState<string>("")

  const testRef = useRef<InputRef>(null);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setHasError(false)
    setFeedback("")
  };

  const handleOnError = (e) => {
    setError(e)
  }


  return (

    <Card>
      <div className="d-flex flex-column gap-16 p-64">
        <h6 className="text-semibold mb-0">Siapa Nama Anda</h6>
        <p className="mb-0">Masukan Nama Lengkap Anda</p>
        <Form.Input
          name="name"
          placeholder="Masukan nama lengkap anda"
          onChange={handleChange}
          label="Nama lengkap"
          rules={ {
            required: { message: "Wajib diisi" },
            min: { value: 3, message: "Minimal 3 karakter" },
          }}
          hasError={hasError}
          feedback={feedback}
          onValidate={handleOnError}
          ref={refInputBrand}
        />
        <WizardNavigation />
      </div>
    </Card>
  )
}