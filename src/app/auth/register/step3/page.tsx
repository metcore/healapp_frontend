"use client";

import { useState } from "react";
import Card from "@/components/primitive/card/Card";
import Input from "@/components/primitive/input/Input";
import Header from "@/masterLayout/Header";
import Button from "react-bootstrap/Button";
import { useRouter } from "next/navigation";
import InputPassword from "@/components/primitive/input-password/InputPassword";

export default function Page() {
  const [email, setEmail] = useState<string>("");
  const [error, setError] = useState<string>("");
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleClick = () => {
    if(error.length == 0){
      router.push('/auth/register/step4', { scroll: false })
    }
  };

  const handleOnError = (e) => {
    setError(e)
  }

  return (
    <>
      <Header />
      <div
        className="container d-flex align-items-center justify-content-center"
        style={{ minHeight: "80vh" }}
      >
        <div className="row w-100 justify-content-center">
          <div className="col-12 col-md-6">
            <h4 className="text-semibold">Daftar</h4>
            <Card>
              <div className="d-flex flex-column gap-8 p-64">
                <h6 className="text-semibold">Buat Kata Sandi</h6>
                <p className="mb-0">Agar aman nih</p>
                <ol>
                  <li>
                    Kata sandi harus minimal 8 karakter
                  </li>
                  <li>
                    Terdapat huruf dan angka
                  </li>
                  <li>
                    Terdapat huruf besar
                  </li>
                  <li>
                    Terdapat simbol
                  </li>
                </ol>
                <InputPassword
                  name="email"
                  icon="solar:lock-password-outline"
                  placeholder="Masukan password"
                  onChange={handleChange}
                  rules={ {
                    required: { message: "Wajib diisi" },
                    min: { value: 3, message: "Minimal 3 karakter" },
                  }}
                  onValidate={handleOnError}
                />
                <InputPassword
                  name="email"
                  icon="solar:lock-password-outline"
                  placeholder="Masukan konfirmasi password"
                  onChange={handleChange}
                  rules={ {
                    min: { value: 3, message: "Minimal 3 karakter" },
                  }}
                />
                <Button onClick={handleClick}>Lanjutkan</Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
