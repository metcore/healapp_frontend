"use client";

import { useRef, useState } from "react";
import Card from "@/components/primitive/card/Card";
import Input, { InputRef } from "@/components/primitive/input/Input";
import { useRouter } from "next/navigation";
import { validate } from "@/helper/Validation/Validate";
import {  WizardNavigation } from "@/components/primitive/wizard/Wizard";
import Button from "react-bootstrap/esm/Button";

const rules = {
  required: { message: "Wajib diisi" },
  min: { value: 5, message: "Minimal 5 karakter" },
}
type StepNameProps = {
  refInputFirstName: React.RefObject<InputRef>;
  refInputLastnName: React.RefObject<InputRef>;
};
export default function StepName({ refInputFirstName, refInputLastnName }: StepNameProps) {
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

  const handleClick = () => {
    const isValidFirstName = refInputFirstName.current?.validate() ?? false;
    const firstNameValue = refInputFirstName.current?.getValue() ?? "";
    console.log(isValidFirstName, "isValidFirstName");
    console.log(refInputFirstName.current?.getValue(), "refInputFirstNam2e");
  }

  return (

    <Card>
      <div className="d-flex flex-column gap-16 p-64">
        <h6 className="text-semibold mb-0">Siapa Nama Anda</h6>
        <p className="mb-0">Masukan Nama Lengkap Anda</p>
        <Input
          name="first_name"
          placeholder="Masukan nama depan"
          onChange={handleChange}
          label="Nama depan"
          rules={ {
            required: { message: "Wajib diisi" },
            min: { value: 3, message: "Minimal 3 karakter" },
          }}
          hasError={hasError}
          feedback={feedback}
          onValidate={handleOnError}
          ref={refInputFirstName}
        />
        <Input
          label="Nama belakang"
          name="last_name"
          placeholder="Masukan nama belakang"
          hasError={hasError}
          feedback={feedback}
          onChange={handleChange}
          ref={refInputLastnName}
          rules={ {
            min: { value: 3, message: "Minimal 3 karakter" },
          }}
        />
        <WizardNavigation />
      </div>
    </Card>
  )
}