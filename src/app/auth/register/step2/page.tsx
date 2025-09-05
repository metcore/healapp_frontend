"use client";

import { useState } from "react";
import Card from "@/components/primitive/card/Card";
import Input from "@/components/primitive/input/Input";
import Header from "@/masterLayout/Header";
import Button from "react-bootstrap/Button";
import { useRouter } from "next/navigation";
import { validate } from "@/helper/Validation/Validate";

const rules = {
  required: { message: "Wajib diisi" },
  min: { value: 5, message: "Minimal 5 karakter" },
}
export default function Page() {
  const [email, setEmail] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [hasError, setHasError] = useState<boolean>(false)
  const [feedback, setFeedback] = useState<string>("")
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setHasError(false)
    setFeedback("")
  };

  const handleClick = () => {
    setHasError(false)
    setFeedback("")
    const validation = validate(email, rules)
    if(validation.length > 0){
      setHasError(true)
      let fedback_message = "";
      validation.forEach((err, idx) => {
        fedback_message += `<div>${err.error}</div>`;
      });
      setFeedback(fedback_message)
      return false;
    }
    if(error.length == 0 && validation.length == 0){
      router.push('/auth/register/step3', { scroll: false })
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
                <h6 className="text-semibold">Siapa Nama Anda</h6>
                <p>Masukan Nama Lengkap Anda</p>
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
                />
                <Input
                  name="last_name"
                  placeholder="Masukan nama belakang"

                  hasError={hasError}
                  feedback={feedback}
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
