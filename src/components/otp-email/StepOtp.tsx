"use client";

import { useState } from "react";
import Card from "@/components/primitive/card/Card";
import { useRouter } from "next/navigation";
import InputOtp, { InputOtpRef } from "@/components/primitive/input-otp/InputOtp";
import { WizardNavigation } from "@/components/primitive/wizard/Wizard";
import Form from "@/components/primitive/form/Form";

const valid_otp = 123456;
type StepOtpProps = {
  refInputOtp: React.RefObject<InputOtpRef>;
};
export default function StepOtp({refInputOtp}: StepOtpProps) {
  const [value, setValue] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [hasError, setHasError] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string>("")
  const router = useRouter();

  const handleChange = (e:string) => {
    console.log(e)
    setValue(e)
    setHasError(false)
    setErrorMessage("")
  };
  
  const handleOnError = (e) => {
    setError(e)
  }

  return (
    <>
      <Card>
        <div className="d-flex flex-column gap-8 p-64">
        <h6 className="text-semibold">Otp</h6>
        <p className="mb-0 text-secondary-light">
            Kami telah mengirim OTP ke email anda, silahkan periksa email anda dan masukan kode OTP di bawah ini
        </p>
        <Form.InputOtp 
          hasError={hasError}
          feedback={errorMessage}
          ref={refInputOtp}
          onChange={handleChange}
          rules={ {
            min: { value: 6, message: "Minimal 6 karakter" },
          }}
        />
        <WizardNavigation />
        </div>
      </Card>
    </>
  )
}