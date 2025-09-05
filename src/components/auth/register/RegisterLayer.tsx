'use client';
import Wizard from "@/components/primitive/wizard/Wizard";
import StepEmail, { StepEmailRef } from "@/components/auth/register/StepEmail";
import StepName from "@/components/auth/register/StepName";
import StepPassword from "@/components/auth/register/StepPassword";
import StepAggrement from "@/components/auth/register/StepAggrement";
import StepOtp from "@/components/auth/register/StepOtp";
import { useRef, useState } from "react";
import { InputRef } from "@/components/primitive/input/Input";
import { inputPasswordRef } from "@/components/primitive/input-password/InputPassword";
import { CheckboxRef } from "@/components/primitive/checkbox/Checkbox";
import { InputOtpRef } from "@/components/primitive/input-otp/InputOtp";
import Modal from 'react-bootstrap/Modal';
import Button from "react-bootstrap/Button";
import { useRouter } from "next/navigation";
import Link from "next/link";
export default function RegisterLayer() {

  const emailStepRef = useRef<StepEmailRef>(null);
  const inputFirstNameRef = useRef<InputRef>(null);
  const inputLastNameRef = useRef<InputRef>(null);
  const inputPasswordRef = useRef<inputPasswordRef>(null);
  const inputConfirmPasswordRef = useRef<inputPasswordRef>(null);
  const checkboxAggrementRef = useRef<CheckboxRef>(null);
  const inputOtpRef = useRef<InputOtpRef>(null);
  const router = useRouter();
  const [modalSuccess, setModalSuccess] = useState<boolean>(false)
  const validateStepName = () => {
    const isValidFirstName = inputFirstNameRef.current?.validate() ?? false;
    const isValidLastName = inputLastNameRef.current?.validate() ?? false;
    return isValidFirstName && isValidLastName;
  };

  const validateStepPassword = () => {
    const isValidPassword = inputPasswordRef.current?.validate() ?? false;
    const isValidConfirmPassword = inputConfirmPasswordRef.current?.validate() ?? false;
    return isValidPassword && isValidConfirmPassword;
  };
  
  const validateStepAggrement = () => {
    const isValidAggrement = checkboxAggrementRef.current?.validate() ?? false;
    console.log(isValidAggrement, "isValidAggrement");
    return isValidAggrement;
  };


  const handleClickModal = () => [
      router.push('/sign-in', { scroll: false })
  ]
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
              <Wizard>
                <Wizard.Item
                  header="Email"
                  onNext={ () => {
                    return emailStepRef.current?.validate() ?? false;
                  }}
                >
                  <StepEmail ref={emailStepRef} />
                </Wizard.Item>
                <Wizard.Item
                  header="Nama"
                  onNext={ () => {
                    return validateStepName();
                  }}
                >
                  <StepName 
                    refInputFirstName={inputFirstNameRef}
                    refInputLastnName={inputLastNameRef}
                  />
                </Wizard.Item>
                <Wizard.Item
                  header="Password"
                  onNext={ () => {
                    return validateStepPassword();
                  }}
                >
                  <StepPassword 
                    refInputPassword={inputPasswordRef}
                    refInputConfirmPassword={inputConfirmPasswordRef}
                  />
                </Wizard.Item>
                <Wizard.Item
                  header="Persetujuan"
                  onNext={ () => {
                    console.log("tes")
                    return validateStepAggrement();
                  }}
                >
                  <StepAggrement 
                    refCheckboxAggrement={checkboxAggrementRef}
                  />
                </Wizard.Item>
                <Wizard.Item
                  header="Konfirmasi"
                  onNext={ () => {
                    if( inputOtpRef.current?.validate()) {
                      setModalSuccess(true);
                      return true;
                    }
                    // return false;
                  }}
                >
                  <StepOtp 
                    refInputOtp={inputOtpRef}
                  />
                </Wizard.Item>
              </Wizard>
              <p>
                sudah punya akun? <Link href={"/sign-in"} className="text-primary-600">Masuk disni</Link>
              </p>
            </div>
          </div>
        </div>

      
      <Modal show={modalSuccess}  >
        <Modal.Header closeButton>
          <Modal.Title><h6 className="text-lg align-items-center justify-content-center mb-0">Sukses</h6></Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <div className="d-flex flex-column gap-3">
            <p className="mb-0">Selamat anda berhasil membuat akun, silahkan login dan selesaikan onboarding anda</p>

          </div>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="primary" onClick={handleClickModal}>
            Login
          </Button>
        </Modal.Footer>
      </Modal>
      </div>
  )
}