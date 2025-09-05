"use client";

import { useState } from "react";
import Card from "@/components/primitive/card/Card";
import Header from "@/masterLayout/Header";
import Button from "react-bootstrap/Button";
import { useRouter } from "next/navigation";
import InputOtp from "@/components/primitive/input-otp/InputOtp";
import Modal from 'react-bootstrap/Modal';
import { Icon } from "@iconify/react";

const valid_otp = 123456;
export default function Page() {
  const [value, setValue] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [hasError, setHasError] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string>("")
  const [modalSuccess, setModalSuccess] = useState<boolean>(false)
  const router = useRouter();

  const handleChange = (e:string) => {
    console.log(e)
    setValue(e)
    setHasError(false)
    setErrorMessage("")
  };
  
  const handleClick = () => {
    if(value != valid_otp){
      setHasError(true)
      setErrorMessage("Kode Otp salah")
      return false;
    }
    if(error.length == 0){
      setModalSuccess(true)
      // router.push('/auth/register/step5', { scroll: false })
    }
  };

  const handleClickModal = () => [
      router.push('/sign-in', { scroll: false })
  ]
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
                <h6 className="text-semibold">Otp</h6>
                <p className="mb-0 text-secondary-light">
                  Kami telah mengirim OTP ke email anda, silahkan periksa email anda dan masukan kode OTP di bawah ini
                </p>
                <InputOtp 
                  hasError={hasError}
                  feedback={errorMessage}
                  onChange={handleChange}
                  rules={ {
                    min: { value: 6, message: "Minimal 6 karakter" },
                  }}
                />
                <Button onClick={handleClick}><p className="mb-0">Lanjutkan</p></Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
      
      <Modal show={modalSuccess}  >
        <Modal.Header closeButton>
          <Modal.Title><p className="text-lg align-items-center justify-content-center">Petunjuk Import Data</p></Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <div className="d-flex flex-column gap-3">
            <h6 className="mb-1 fw-semibold">Berhasil buat akun:</h6>
            
            <p>Selamat anda berhasil membuat akun, silahkan login</p>

          </div>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary">
            Tutup
          </Button>
          <Button variant="primary" onClick={handleClickModal}>
            Login
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}