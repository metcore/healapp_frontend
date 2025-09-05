"use client";

import { useState } from "react";
import Card from "@/components/primitive/card/Card";
import Input from "@/components/primitive/input/Input";
import Header from "@/masterLayout/Header";
import Button from "react-bootstrap/Button";
import { useRouter } from "next/navigation";
import InputPassword from "@/components/primitive/input-password/InputPassword";
import Checkbox from "@/components/primitive/checkbox/Checkbox";

export default function Page() {
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
                <h6 className="text-semibold">Ketentuan Pengguna</h6>
                <p className="mb-0 text-secondary-light">Terakhir nih kamu perlu mempersetujui ketentuan penggunaan Heal App, kamu bisa baca terlebih dahulu dengan click tautan di bawah ini</p>
                <Checkbox
                  name="ketentuan"
                  onChange={handleChange}
                  value="boot"
                  rules={ {
                    booleanTrue: { message: "Kamu harus menyetujui pengguna" },
                  }}
                  label={
                    <p className="mb-0"> Saya telah membaca  <a href="#" className="text-primary-600"> ketentuan pengguna</a> dan  <a href="#" className="mb-0 text-primary-600">Kebijakan pengguna </a></p>
                  }
                />
                <Button onClick={handleClick}><p className="mb-0">Lanjutkan</p></Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}