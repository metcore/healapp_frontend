"use client";

import { useState } from "react";
import Input from "@/components/primitive/input/Input";
import InputPassword from "./primitive/input-password/InputPassword";
import Checkbox from "./primitive/checkbox/Checkbox";
import { useRouter } from "next/navigation";
import { validate } from "@/helper/Validation/Validate";
import Link from "next/link";
import { Icon } from "@iconify/react";

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

  // State input dan error
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Hindari reload

    // Validasi email
    const emailValidation = validate(email, emailRules);
    const passwordValidation = validate(password, passwordRules);

    if (emailValidation.length > 0) {
      setEmailError(
        emailValidation.map((err) => `<div>${err.error}</div>`).join("")
      );
    } else {
      setEmailError("");
    }

    if (passwordValidation.length > 0) {
      setPasswordError(
        passwordValidation.map((err) => `<div>${err.error}</div>`).join("")
      );
    } else {
      setPasswordError("");
    }

    // Jika semua valid, redirect
    if (emailValidation.length === 0 && passwordValidation.length === 0) {
      router.push("/", { scroll: false });
    }
  };

  return (
    <section className="auth bg-base d-flex flex-wrap">
      <div className="auth-left d-lg-block d-none">
        <div className="d-flex align-items-center flex-column h-100 justify-content-center">
          <img src="assets/images/auth/login-img.png" alt="" />
        </div>
      </div>
      <div className="auth-right py-32 px-24 d-flex flex-column justify-content-center">
        <div className="max-w-464-px mx-auto w-100">
          <div>
            <Link href="/" className="mb-40 max-w-290-px">
              <img src="assets/images/logo.png" alt="Logo" />
            </Link>
            <h4 className="mb-12">Masuk ke akun Anda</h4>
            <p className="mb-32 text-secondary-light text-lg">
              Hallo, semangat! Yuk masukkan email dan password kamu.
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="d-flex flex-column gap-3">
              <Input
                name="email"
                placeholder="Masukan email anda"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                icon="mage:email"
                hasError={!!emailError}
                feedback={emailError}
              />

              <InputPassword
                name="password"
                placeholder="Masukan password anda"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                icon="solar:lock-password-outline"
                hasError={!!passwordError}
                feedback={passwordError}
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
                <Link href="#" className="text-primary-600 fw-medium">
                  Forgot Password?
                </Link>
              </div>

              <button
                type="submit"
                className="btn btn-primary text-sm btn-sm px-12 py-16 w-100 radius-12"
              >
                Sign In
              </button>

              <div className="center-border-horizontal text-center">
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
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
