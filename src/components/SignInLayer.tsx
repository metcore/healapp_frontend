"use client";

import { useEffect, useState } from "react";
import Input from "@/components/primitive/input/Input";
import InputPassword from "./primitive/input-password/InputPassword";
import Checkbox from "./primitive/checkbox/Checkbox";
import { useRouter } from "next/navigation";
import { validate } from "@/helper/Validation/Validate";
import Link from "next/link";
import { Icon } from "@iconify/react";
import Form from "./primitive/form/Form";
import api from "@/api/api";
import { toast } from "react-toastify";
import { AppDispatch, RootState } from "@/redux/store";
import { useDispatch } from "react-redux";
import { login } from "@/redux/slice/auth/authSlice";
import { useSelector } from "react-redux";
import { setVendor } from "@/redux/slice/auth/vendorSlice";

// Aturan validasi
const emailRules = {
  required: { message: "Wajib diisi" },
  email: { message: "Harus format email" },
};

const passwordRules = {
  required: { message: "Wajib diisi" },
  min: { value: 6, message: "Minimal 6 karakter" },
};

export default function SignInLayer() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>()
  const [loadingSubmit, setLoadingSubmit] = useState<boolean>(false);  
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const token = useSelector((state: RootState) => state.auth.token);

  const handleSubmit = async (e) => {
    if(e?.hasError){
      toast.error("Terdapat error pada form, silakan periksa kembali.");
      return false;
    }

    setLoadingSubmit(true)
    try {
      const response = await api.post('/auth/login', e?.values);
      if (response.status === 200) {
        dispatch(login({ user: response?.data?.user}));
        if(!response?.data?.user?.IsFinishOnboarding){
          router.replace("/onboarding");
        }else{
          console.log("vendor", response?.data?.user?.UserVendors?.[0]?.VendorId)
          if(response?.data?.user?.UserVendors.length === 1){
           dispatch(setVendor({vendor_id:response?.data?.user?.UserVendors?.[0]?.VendorId}))
          }
          router.push("/");
        }
      } else {
        setLoadingSubmit(false)
      } 
    } catch (error) {
      setLoadingSubmit(false)
      setEmailError([{error: error?.response?.data?.message}]);
      toast.error("Gagal login, silahkan coba lagi");
    }
    
  };

  useEffect(() => { 
        console.log(token)
  }, []);
  return (
    <section className="auth bg-base d-flex flex-wrap">
      <div className="auth-left d-lg-block d-none">
        <div className="d-flex align-items-center flex-column h-100 justify-content-center">
          <img src="/assets/images/auth/login-img.png" alt="" />
        </div>
      </div>
      <div className="auth-right py-32 px-24 d-flex flex-column justify-content-center">
        <div className="max-w-464-px mx-auto w-100">
          <div>
            <Link href="/" className="mb-40 max-w-100-px">
              <img src="/assets/images/logo.png" alt="Logo" />
            </Link>
            <h4 className="mb-12">Masuk ke akun Anda</h4>
            <p className="mb-32 text-secondary-light text-lg">
              Hallo, semangat! Yuk masukkan email dan password kamu.
            </p>
          </div>

          <Form onSubmit={handleSubmit}>
            <div className="d-flex flex-column gap-3">
              <Form.Input
                name="email"
                placeholder="Masukan email anda"
                icon="mage:email"
                rules={emailRules}
                errors={emailError}
              />

              <Form.InputPassword
                name="password"
                placeholder="Masukan password anda"
                icon="solar:lock-password-outline"
                hasError={!!passwordError}
                feedback={passwordError}
                rules={passwordRules}
              />

              <div className="d-flex justify-content-between gap-2">
                <Checkbox
                  name="remember"
                  value="true"
                  label="Remember me"
                  rules={{
                    booleanTrue: {
                      message: "Kamu harus menyetujui pengguna",
                    },
                  }}
                />
                <Link href="/forgot-password" className="text-primary-600 fw-medium">
                  Lupa Password?
                </Link>
              </div>
              
              <Form.ButtonSubmit loading={loadingSubmit} disabled={loadingSubmit}>
                Sign In
              </Form.ButtonSubmit>

              {/* <div className="center-border-horizontal text-center">
                <span className="bg-base z-1 px-4">Or sign in with</span>
              </div>

              <div className="d-flex align-items-center gap-3">
                <button
                  type="button"
                  className="fw-semibold text-primary-light py-16 px-24 w-50 border radius-12 text-md d-flex align-items-center justify-content-center gap-12 line-height-1 bg-hover-primary-50"
                >
                  <Icon
                    icon="ic:baseline-facebook"
                    className="text-primary-600 text-xl line-height-1"
                  />
                  Facebook
                </button>
                <button
                  type="button"
                  className="fw-semibold text-primary-light py-16 px-24 w-50 border radius-12 text-md d-flex align-items-center justify-content-center gap-12 line-height-1 bg-hover-primary-50"
                >
                  <Icon
                    icon="logos:google-icon"
                    className="text-primary-600 text-xl line-height-1"
                  />
                  Google
                </button>
              </div> */}
            </div>
          </Form>
        </div>
      </div>
    </section>
  );
}
