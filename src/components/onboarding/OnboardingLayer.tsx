'use client'
import React, { useRef, useState } from "react";
import OnboardingPackage from "./OnboardingPackage";
import Card from "../primitive/card/Card";
import OnboardingCompany from "./OnboardingCompany";
import OnboardingTax from "./OnboardingTax";
import OnboardingBilling from "./OnboardingBilling";
import OnboardingCompleted from "./OnboardingCompleted";
import Wizard, { WizardNavigation } from "../primitive/wizard/Wizard";
import { InputRef } from "../primitive/input/Input";
import { TextAreaRef } from "../primitive/textarea/TextArea";
import { toast } from "react-toastify";
import { Modal } from "react-bootstrap";
import Button from "../primitive/button/Button";
import api from "@/api/api";
import { useRouter } from "next/navigation";

export default function OnboardingLayer() {
  const router = useRouter();
  const [loadingSubmit, setLoadingSubmit] = useState<boolean>(false);
  const [isOpenModalSubmit, setIsOpenModalSubmit] = useState<boolean>(false)

  const inputCompanyBrandNameRef = useRef<InputRef>(null)
  const inputCompanyLegalNameRef = useRef<InputRef>(null)
  const inputCompanyPhoneRef = useRef<InputRef>(null)
  const inputCompanyAddressRef = useRef<TextAreaRef>(null)
  const inputCompanyEmailRef = useRef<InputRef>(null)
  const [inputCompanyPackage, setInputCompanyPackage] = useState<string>(null)

  const inputTaxNpwpRef = useRef<InputRef>(null)
  const inputTaxPpnRef = useRef<InputRef>(null)
  const inputTaxRemarkRef = useRef<InputRef>(null)

  const inputBillingNameRef = useRef<InputRef>(null)
  const inputBillingPhoneRef = useRef<InputRef>(null)
  const inputBillingEmailRef = useRef<InputRef>(null)
  const inputBillingAddressRef = useRef<TextAreaRef>(null)
  const handleOnNextStepCompany = async () => {
    setLoadingSubmit(true)
    const isValidCompanyName = inputCompanyBrandNameRef.current.validate()
    const isValidCompanyEmail = inputCompanyEmailRef.current.validate()
    const isValidCompanyPhone = inputCompanyPhoneRef.current.validate()
    const isValidCompanyAddress = inputCompanyAddressRef.current.validate()
    const isValidCompanyLegalName = inputCompanyLegalNameRef.current.validate()
    
    if(isValidCompanyName && isValidCompanyPhone && isValidCompanyAddress && isValidCompanyLegalName && isValidCompanyEmail){

      console.log(inputCompanyAddressRef.current.getValue())
      try {
        const response = await api.post('onboarding/company',{
          company_brand_name:inputCompanyBrandNameRef?.current?.getValue(),
          company_legal_name:inputCompanyLegalNameRef?.current?.getValue(),
          company_email:inputCompanyEmailRef?.current?.getValue(),
          company_phone:inputCompanyPhoneRef?.current?.getValue(),
          company_address:inputCompanyAddressRef?.current?.getValue(),

        })
        if (response.status === 201) {
          setLoadingSubmit(false)
          return true
        } else {
          setLoadingSubmit(false)
        } 
      } catch (error) {
        setLoadingSubmit(false)
        toast.error("Terjadi kesalahan, silahkan coba lagi");
      }
      return false
    }
    setLoadingSubmit(false)
  }

  const hanldeOnNextStepTax = async () => {
    
    setLoadingSubmit(true)
    try {
      
      const response = await api.post('onboarding/tax',{
        npwp:inputTaxNpwpRef?.current?.getValue(),
        amount: Number(inputTaxPpnRef?.current?.getValue()),
        remark_tax:inputTaxRemarkRef?.current?.getValue(),
      })
      if(response.status === 201){
        setLoadingSubmit(false)
        return true
      }
    } catch {
      setLoadingSubmit(false)
      toast.error("Terjadi kesalahan, silahkan coba lagi");
    }
    setLoadingSubmit(false)
  }

  
  const handleOnNextStepPackage = async () => {
    
    if(!inputCompanyPackage){
      toast.warning("harap pilih paket yang tersedia terlebih dahulu")
      return false
    }
    setLoadingSubmit(true)
    try {
      const response = await api.post("onboarding/plan",{
        plan_id: inputCompanyPackage
      })
      console.log("Res", response)
      if(response.status === 201){
        setLoadingSubmit(false)
        return true;
      }
    } catch (error) {
      
      toast.error("Terjadi kesalahan, silahkan coba lagi");
      setLoadingSubmit(false)
    }
    
    setLoadingSubmit(false)
  }

  const handleNextStepBilling = async () => {
    console.log("daksdas")
    setLoadingSubmit(true)
    const isValidBillingName = inputBillingNameRef.current.validate()
    const isValidBillingPhone = inputBillingPhoneRef.current.validate()
    const isValidBillingAddress = inputBillingAddressRef.current.validate()
    const isValidBillingEmail = inputBillingEmailRef.current.validate()
    if(!isValidBillingAddress || !isValidBillingEmail || !isValidBillingName || !isValidBillingPhone){
      toast.error("Terjadi kesalahan harap periksa kembal idata")
      return false
    }

    try {
      const response = await api.post("onboarding/billing-address",{
        email : inputBillingEmailRef.current.getValue(),
        name : inputBillingNameRef.current.getValue(),
        phone_number : inputBillingPhoneRef.current.getValue(),
        address : inputBillingAddressRef.current.getValue(),
      })

      if(response.status === 201){
        return true;
      }
    } catch (error) {
      toast.error("Terjadi kesalahan, silahkan coba lagi");
    }
    setLoadingSubmit(false)
    return false
  }


  const handleOnChangePackage = (plan) => {
    setInputCompanyPackage(plan)
  }
  const handleOnSubmitForm = (e) => {
    if(e.hasError) {
      toast.error("Terjadi kesalahan, harap periksa kembali")
      return false
    }
    setIsOpenModalSubmit(true)
    return false
  }

  const handleOnClickSubmitButton = async (e) => { 
    setLoadingSubmit(true)
    const isValidBillingName = inputBillingNameRef.current.validate()
    const isValidBillingPhone = inputBillingPhoneRef.current.validate()
    const isValidBillingAddress = inputBillingAddressRef.current.validate()
    const isValidBillingEmail = inputBillingEmailRef.current.validate()
    if(!isValidBillingAddress || !isValidBillingEmail || !isValidBillingName || !isValidBillingPhone){
      toast.error("Terjadi kesalahan harap periksa kembal idata")
      return false
    }

    try {
      const response = await api.post("onboarding/billing-address",{
        email : inputBillingEmailRef.current.getValue(),
        name : inputBillingNameRef.current.getValue(),
        phone_number : inputBillingPhoneRef.current.getValue(),
        address : inputBillingAddressRef.current.getValue(),
      })

      if(response.status === 201){
        router.replace("/")
        return true;
      }
    } catch (error) {
      setLoadingSubmit(false)
      toast.error("Terjadi kesalahan, silahkan coba lagi");
    }
    setLoadingSubmit(false)
    return false
  }
  return (
    <div className="container">
      <Card>
        <h6 className='mb-4 text-xl'>Anda hampir siap menggunakan HealApp!</h6>
        <p className='text-neutral-500'>
          Selesaikan langkah-langkah berikut untuk menyelesaikan proses
          onboarding Anda.
        </p>
        <Wizard
          onSubmit={handleOnSubmitForm}
          loading={loadingSubmit}
        >
          <Wizard.Item header="Data Perusahaan"
            onNext={handleOnNextStepCompany}
          >
            <OnboardingCompany
              inputCompanyLegalNameRef={inputCompanyLegalNameRef}
              inputCompanyBrandNameRef={inputCompanyBrandNameRef}
              inputCompanyPhoneRef={inputCompanyPhoneRef}
              inputCompanyEmailRef={inputCompanyEmailRef}
              inputCompanyAddressRef={inputCompanyAddressRef}
            />
          </Wizard.Item>
          <Wizard.Item header="Tax" 
            onNext={hanldeOnNextStepTax}
          >
            <OnboardingTax
              inputTaxPpnRef={inputTaxPpnRef}
              inputTaxNpwpRef={inputTaxNpwpRef}
              inputTaxRemarkRef={inputTaxRemarkRef}
            />
            <WizardNavigation />
          </Wizard.Item>
          <Wizard.Item header="Pilih Paket" 
            onNext={handleOnNextStepPackage}
          >
            <OnboardingPackage
              onChange={handleOnChangePackage}
            />
          </Wizard.Item>
          <Wizard.Item
            header="Informasi Penagihan"
            onNext={handleNextStepBilling}
          >
            <OnboardingBilling
              inputBillingNameRef={inputBillingNameRef}
              inputBillingPhoneRef={inputBillingPhoneRef}
              inputBillingEmailRef={inputBillingEmailRef}
              inputBillingAddressRef={inputBillingAddressRef}
            />
          </Wizard.Item>
        </Wizard>
      </Card>

      <Modal show={isOpenModalSubmit}>
        <Modal.Header closeButton>
          <Modal.Title><h6 className="mb-0">Konfirmasi</h6></Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Apakah Anda yakin semua data sudah benar ?
        </Modal.Body>
        <Modal.Footer>

          <Button
            variant="secondary"
            onClick={() => setIsOpenModalSubmit(false)}
            disabled={loadingSubmit}
          >
            Batal
          </Button>
          <Button
            onClick={handleOnClickSubmitButton}
            disabled={loadingSubmit}
          >
            {loadingSubmit ? "Menyimpan..." : "Simpan"}
          </Button>
        </Modal.Footer>
      </Modal>  
    </div>
  );
}