'use client'

import Link from "next/link";
import Form from "../primitive/form/Form";
import { useState } from "react";
import api from "@/api/api";
import { useRouter } from "next/navigation";

const rules = {
  required: { message: "Wajib diisi" },
  email: { message: "Harus format email" },
  min: { value: 5, message: "Minimal 5 karakter" },
};

export default function ForgotPasswordForm() {
  const [loadingSubmit, setLoadingSubmit] = useState<boolean>(false);  
  const router = useRouter()
  const handleSubmit =  async (data) => { 
    if(data.hasError){
      return
    }
    setLoadingSubmit(true)
    try {
      const response = await api.post('/auth/forgot-password', data.values)
      if(response.status === 200) {
        router.push(`/forgot-password/otp?user_id=${response?.data?.data.ID}`, undefined, { scroll: false });
      } else {
        setLoadingSubmit(false);
      }
    } catch (error) {
      setLoadingSubmit(false)
      // Handle error (e.g., show an error message)
      console.error('Error:', error);
    } 
    setLoadingSubmit(false) 
  }
  return (
    <>
      <section className='auth forgot-password-page bg-base d-flex flex-wrap'>
        <div className='auth-left d-lg-block d-none'>
          <div className='d-flex align-items-center flex-column h-100 justify-content-center'>
            <img src='assets/images/auth/forgot-pass-img.png' alt='' />
          </div>
        </div>
        <div className='auth-right py-32 px-24 d-flex flex-column justify-content-center'>
          <div className='max-w-464-px mx-auto w-100'>
            <div>
              <Link href="/" className="mb-40 max-w-100-px">
                <img src="/assets/images/logo.png" alt="Logo" />
              </Link>
              <h4 className='mb-12'>Lupa Password</h4>
              <p className='mb-32 text-secondary-light text-lg'>
                Masukan email yang terhubung dengan akun anda dan kami akan
                mengirimkan KODE OTP untuk mengatur ulang password anda.
              </p>
            </div>
              <Form onSubmit={handleSubmit}>
                <div className="d-flex flex-column gap-2">
                  <Form.Input
                    name="email"
                    label="Email"
                    placeholder="Masukan email anda"
                    icon="mage:email"
                    rules={rules}
                  />
                  <Form.ButtonSubmit loading={loadingSubmit} disabled={loadingSubmit}>
                    Lanjutkan
                  </Form.ButtonSubmit>
                  <div className='text-center'>
                    <Link
                      href='/sign-in'
                      className='text-primary-600 fw-bold mt-24'
                    >
                      Back to Sign In
                    </Link>
                  </div>
                  <div className='mt-120 text-center text-sm'>
                    <p className='mb-0'>
                      Already have an account?{" "}
                      <Link
                        href='/sign-in'
                        className='text-primary-600 fw-semibold'
                      >
                        Sign In
                      </Link>
                    </p>
                  </div>
                </div>
              </Form>
          </div>
        </div>
      </section>
      {/* Modal */}
      <div
        className='modal fade'
        id='exampleModal'
        tabIndex={-1}
        aria-hidden='true'
      >
        <div className='modal-dialog modal-dialog modal-dialog-centered'>
          <div className='modal-content radius-16 bg-base'>
            <div className='modal-body p-40 text-center'>
              <div className='mb-32'>
                <img src='assets/images/auth/envelop-icon.png' alt='' />
              </div>
              <h6 className='mb-12'>Verify your Email</h6>
              <p className='text-secondary-light text-sm mb-0'>
                Thank you, check your email for instructions to reset your
                password
              </p>
              <button
                type='button'
                className='btn btn-primary text-sm btn-sm px-12 py-16 w-100 radius-12 mt-32'
              >
                Skip
              </button>
              <div className='mt-32 text-sm'>
                <p className='mb-0'>
                  Don’t receive an email?{" "}
                  <Link href='/resend' className='text-primary-600 fw-semibold'>
                    Resend
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
