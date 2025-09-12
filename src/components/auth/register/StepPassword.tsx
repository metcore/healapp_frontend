"use client";

import { useState } from "react";
import Card from "@/components/primitive/card/Card";
import InputPassword from "@/components/primitive/input-password/InputPassword";
import { useRouter } from "next/navigation";
import { WizardNavigation, useWizard } from "@/components/primitive/wizard/Wizard";
import Form from "@/components/primitive/form/Form";

type StepPasswordProps = {
  refInputPassword: React.RefObject<InputRef>;
  refInputConfirmPassword: React.RefObject<InputRef>;
};
export default function StepPassword({refInputPassword, refInputConfirmPassword }:StepPasswordProps) {
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [errorPassword, setErrorPassword] = useState<string>("");
  const [errorConfirm, setErrorConfirm] = useState<string>("");

  const router = useRouter();

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleConfirmChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);
  };

  const handlePasswordError = (err: string) => {
    setErrorPassword(err);
  };

  const handleConfirmError = (err: string) => {
    // setErrorConfirm(err);
  };

  const handleClick = () => {
    let hasError = false;

    // reset error
    setErrorConfirm("");

    if (!hasError) {
      // Simpan password ke state global / backend / localStorage sesuai kebutuhan
      // Lanjut ke step berikutnya
      // nextStep();
    }
  };

  return (
    <Card>
      <div className="d-flex flex-column gap-16 p-64">
        <h6 className="text-semibold mb-0">Buat Kata Sandi</h6>
        <p className="mb-0">Kata sandi Anda harus minimal 8 karakter. Kami menyarankan penggunaan huruf, angka, dan simbol.</p>

        <Form.InputPassword
          name="password"
          icon="solar:lock-password-outline"
          placeholder="Masukan password"
          onChange={handlePasswordChange}
          rules={{
            required: { message: "Wajib diisi" },
            min: { value: 8, message: "Minimal 8 karakter" },
          }}
          ref={refInputPassword}
          onValidate={handlePasswordError}
        />

        <Form.InputPassword
          name="password_confirmation"
          icon="solar:lock-password-outline"
          placeholder="Masukan konfirmasi password"
          onChange={handleConfirmChange}
          rules={{
            required: { message: "Wajib diisi" },
            min: { value: 8, message: "Minimal 8 karakter" },
            match: { value: password, message: "Konfirmasi password tidak cocok" },

          }}
          ref={refInputConfirmPassword}
          onValidate={handleConfirmError}
        />


        <WizardNavigation />
      </div>
    </Card>
  );
}
