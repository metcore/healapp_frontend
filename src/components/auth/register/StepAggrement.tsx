"use client";

import { useState } from "react";
import Card from "@/components/primitive/card/Card";
import Button from "react-bootstrap/Button";
import { useRouter } from "next/navigation";
import Checkbox, { CheckboxRef } from "@/components/primitive/checkbox/Checkbox";
import { WizardNavigation } from "@/components/primitive/wizard/Wizard";

type StepPasswordProps = {
  refCheckboxAggrement: React.RefObject<CheckboxRef>;
};
export default function StepAggrement({refCheckboxAggrement}: StepPasswordProps) {
  const [email, setEmail] = useState<string>("");
  const [error, setError] = useState<string>("");
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };
  
  const handleClick = () => {
    if(error.length == 0){
      router.push('/auth/register/step5', { scroll: false })
    }
  };

  const handleOnError = (e) => {
    setError(e)
  }

  return (
    <Card>
      <div className="d-flex flex-column gap-8 p-64">
        <h6 className="text-semibold">Ketentuan Pengguna</h6>
        <p className="mb-0 text-secondary-light">Terakhir nih kamu perlu mempersetujui ketentuan penggunaan Heal App, kamu bisa baca terlebih dahulu dengan click tautan di bawah ini</p>
        <Checkbox
          name="ketentuan"
          onChange={handleChange}
          value="boot"
          rules={ {
            booleanTrue: { message: "Kamu harus menyetujui pengguna" },
          }}
          ref={refCheckboxAggrement}
          label={
            <p className="mb-0"> Saya telah membaca  <a href="#" className="text-primary-600"> ketentuan pengguna</a> dan  <a href="#" className="mb-0 text-primary-600">Kebijakan pengguna </a></p>
          }
        />
        <WizardNavigation />
      </div>
    </Card>
  )
}