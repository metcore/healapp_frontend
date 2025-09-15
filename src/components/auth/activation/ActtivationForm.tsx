"use client";

import { useEffect, useState } from "react";
import Card from "@/components/primitive/card/Card";
import Form from "@/components/primitive/form/Form";
import api from "@/api/api";
import { redirect, useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";

export default function ActivationForm() {
  const router = useRouter()
  const params = useSearchParams();
  const userId = params.get("user_id")
  const vendorId = params.get("vendor_id")
  const [loadingSubmit, setLoadingSubmit] = useState<boolean>(false)
  const [password, setPassword] = useState<string>("");
  const hadleOnSubmit = async (e) => {
    var data = e.values
    data.user_id = userId
    data.vendor_id=vendorId
    if(e.hasError){
      toast.warning("Harap lengkapi data terlebih dahulu")
      return false
    }
    setLoadingSubmit(true)
    try {
      const response = await api.post("user/activation",data)
      if(response.status === 200){
        router.replace('/sign-in')
      }
    } catch (error) {
    setLoadingSubmit(false)
      toast.error("Terjadi kesalahan server")
    }
  }

  useEffect(()=>{
    if(!userId){
      redirect("not-found") 
    }
    toast.info("Untuk memulai heal app, harap buat password terlebih dahulu")
  },[])
  return (
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
            <Card>
              <Form onSubmit={hadleOnSubmit}  >
                <div className="d-flex flex-column gap-16 p-64">
                  <h6 className="text-semibold mb-0">Buat Kata Sandi</h6>
                  <p className="mb-0">Kata sandi Anda harus minimal 8 karakter. Kami menyarankan penggunaan huruf, angka, dan simbol.</p>

                  <Form.InputPassword
                    name="password"
                    label="Password"
                    icon="solar:lock-password-outline"
                    placeholder="Masukan password"
                    onChange={(e)=>setPassword(e.target.value)}
                    rules={{
                        required: { message: "Wajib diisi" },
                        min: { value: 8, message: "Minimal 8 karakter" },
                    }}
                  />

                  <Form.InputPassword
                    label="Konfirmasi Password"
                    name="password_confirmation"
                    icon="solar:lock-password-outline"
                    placeholder="Masukan konfirmasi password"
                    rules={{
                        required: { message: "Wajib diisi" },
                        min: { value: 8, message: "Minimal 8 karakter" },
                        match: { value: password, message: "Konfirmasi password tidak cocok" },

                    }}
                  />
                </div>
                <Form.ButtonSubmit loading={loadingSubmit}>
                  Simpan
                </Form.ButtonSubmit>
              </Form>
            </Card>
          </div>
        </div>
      </div>
    </div>
        
  );
}
