"use client";

import { useRef, useState } from "react";
import Card from "@/components/primitive/card/Card";
import { useRouter, useSearchParams } from "next/navigation";
import Form from "@/components/primitive/form/Form";
import api from "@/api/api";
import { toast } from "react-toastify";

export default function OtpEmailForm() {
  const inputOtpRef = useRef<InputOtpRef>(null);
  const [loadingSubmit, setLoadingSubmit] = useState<boolean>(false);
  const [value, setValue] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [hasError, setHasError] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string>("")
  const router = useRouter();

  const searchParams = useSearchParams();
  const id = searchParams.get('id');

  const handleChange = (e:string) => {
    setValue(e)
    setHasError(false)
    setErrorMessage("")
  };
  
  const handleOnError = (e) => {
    setError(e)
  }

  const resendOtp = () => {
    setLoadingSubmit(true)
    api.post('/auth/register/resend-otp', {
      user_id: id
    }).then((response) => {
      setLoadingSubmit(false)
      toast.success("Berhasil mengirim ulang OTP, silahkan cek email anda")
    }).catch((error) => {
      setLoadingSubmit(false)
      toast.error("Gagal mengirim ulang OTP, " +error?.response?.data?.message )
    })
  }

  const handleOnSubmit = (e) => {
    if(e.hasError) {
      return 
    }
    setLoadingSubmit(true)
    api.post('/auth/register/activation', {
      user_id: id,
      otp: e?.values?.otp
    }).then((response) => {
      toast.success("Akun berhasil diaktivasi, silahkan login")
      router.replace('/sign-in', undefined, { scroll: false })
      // router.push('/sign-in', { scroll: false })
    }).catch((error) => {
      toast.error("Gagal aktivasi akun, silahkan coba lagi")
      if (error.response && error.response.status === 400) {
        setHasError(true)
        setErrorMessage(error?.response?.data?.message)
        setLoadingSubmit(false)
        inputOtpRef.current?.setError([{ error: error?.response?.data?.message  }])
      } else {
        setHasError(true)
        setLoadingSubmit(false)
        setErrorMessage("Terjadi kesalahan server")
        inputOtpRef.current?.setError([{ error: "Terjadi kesalahan server" }])
      }
    })
    // e.preventDefault();
  }
  return(

    <div
      className="container d-flex align-items-center justify-content-center"
      style={{ minHeight: "80vh" }}
    >
      <div className="row w-100 justify-content-center">
        <div className="col-12 col-lg-6">
          <div className="d-flex flex-column gap-16 ">
          <img
            src='../../../../assets/images/logo.png'
            alt='site logo'
            className='logo-icon'
            width={100}
            height={20}
          />
          <Form onSubmit={handleOnSubmit}>
            <Card>
              <div className="d-flex flex-column gap-8 p-64">
                <h6 className="text-semibold">Verifikasi Email Anda</h6>
                <p className="mb-0 text-secondary-light">
                    Kami telah mengirim <b>OTP</b> ke email anda, silahkan periksa email anda dan masukan kode <b>OTP</b> di bawah ini
                </p>
                <Form.InputOtp
                  name="otp"
                  hasError={hasError}
                  feedback={errorMessage}
                  ref={inputOtpRef}
                  onChange={handleChange}
                  rules={ {
                    min: { value: 6, message: "Minimal 6 karakter" },
                  }}
                />
                <p>Tidak menerima email ? <span className="text-primary cursor-pointer" onClick={resendOtp}>kirim ulang</span></p>
                <Form.ButtonSubmit loading={loadingSubmit} disabled={loadingSubmit}>
                  <p className="mb-0 text-center align-center">
                    Simpan
                  </p>
                </Form.ButtonSubmit>
              </div>
            </Card>
          </Form>
        </div>
        </div>
      </div>
    </div> 
  )
}