'use client';
import Wizard from "@/components/primitive/wizard/Wizard";
import StepEmail, { StepEmailRef } from "@/components/auth/register/StepEmail";
import StepName from "@/components/auth/register/StepName";
import StepPassword from "@/components/auth/register/StepPassword";
import StepAggrement from "@/components/auth/register/StepAggrement";
import StepOtp from "@/components/otp-email/StepOtp";
import { useRef, useState } from "react";
import { InputRef } from "@/components/primitive/input/Input";
import { inputPasswordRef } from "@/components/primitive/input-password/InputPassword";
import { CheckboxRef } from "@/components/primitive/checkbox/Checkbox";
import { InputOtpRef } from "@/components/primitive/input-otp/InputOtp";
import Modal from 'react-bootstrap/Modal';
import Button from "react-bootstrap/Button";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/api/api";
import { toast } from "react-toastify";
import { set } from "react-datepicker/dist/date_utils";
import StepBrand from "./StepBrand";
export default function RegisterLayer() {

  const emailStepRef = useRef<StepEmailRef>(null);
  const [loadingNextStep, setLoadingNextStep] = useState<boolean>(false); 
  const [loadingSubmit, setLoadingSubmit] = useState<boolean>(false)
  const refInputName = useRef<InputRef>(null);
  const refInputBrand = useRef<InputRef>(null);
  const inputPasswordRef = useRef<inputPasswordRef>(null);
  const inputConfirmPasswordRef = useRef<inputPasswordRef>(null);
  const checkboxAggrementRef = useRef<CheckboxRef>(null);
  const router = useRouter();
  const [modalSuccess, setModalSuccess] = useState<boolean>(false)
  const [dataResponse, setDataResponse ] = useState()
  const validateStepName = () => {
    const isValidName = refInputName.current?.validate() ?? false;
    return isValidName;
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


  const handleClickModal = () => {
    console.log(dataResponse)
    router.push(`/auth/otp-email?user_id=${dataResponse.user.ID}&vendor_id=${dataResponse?.vendor?.ID}`, undefined, { scroll: false });
  }
  
  const handleOnNextStepEmail = async () => {
    const isValid = emailStepRef.current?.validate() ?? false;
    if (!isValid) return false;

    try {
      const response = await api.post('/auth/register/validation', {
        email: emailStepRef.current?.getValue() ?? ''
      });
      return true;
    } catch (error: any) {
      setLoadingNextStep(false);
      if (error.response && error.response.status === 409) {
        emailStepRef.current?.setError([{ error: "Email sudah terdaftar, harap gunakan email lain" }]);
      } else {
        emailStepRef.current?.setError([{ error: "Terjadi kesalahan server" }]);
      }
      return false;
    }
  };

  const handleOnSubmitWizard = async (e) => { 
    setLoadingNextStep(true)
    try {
      const response = await api.post('/auth/register', {
        email: emailStepRef.current?.getValue() ?? '',
        name: refInputName.current?.getValue() ?? '',
        password: inputPasswordRef.current?.getValue() ?? '',
        password_confirmation: inputConfirmPasswordRef.current?.getValue() ?? '',
        agree_terms: checkboxAggrementRef.current?.getValue() ?? false,
      });
      setDataResponse(response?.data?.data)
      toast.success("Berhasil daftar, silahkan lanjut ke step berikutnya")
      setModalSuccess(true);
      return true;
    } catch (error: any) {
      if (error.response && error.response.status === 400) {
        toast.error("Data tidak valid, silahkan periksa kembali inputan anda");
      } else {
        toast.error("Terjadi kesalahan saat mengirim");
      }
      setLoadingNextStep(false)
      return false;
    }
  }

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
            <Wizard
              loading={loadingNextStep}
              onSubmit={handleOnSubmitWizard}
            >
              <Wizard.Item
                header="Email"
                onNext={handleOnNextStepEmail}
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
                  refInputName={refInputName}
                />
              </Wizard.Item>
              {/* <Wizard.Item
                header="Brand"
                onNext={ () => {
                  return validateStepName();
                }}
              >
                <StepBrand 
                  refInputBrand={refInputBrand}
                />
              </Wizard.Item> */}
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
          <p className="mb-0">Selamat anda berhasil membuat akun, harap periksa email anda untuk mendapatgkan code otp</p>

        </div>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="primary" onClick={handleClickModal}>
          Verifikasi Email
        </Button>
      </Modal.Footer>
    </Modal>
    </div>
  )
}