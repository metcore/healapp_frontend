'use client'
import React, { useState } from "react";
import OnboardingPackage from "./OnboardingPackage";
import Card from "../primitive/card/Card";
import OnboardingCompany from "./OnboardingCompany";
import OnboardingTax from "./OnboardingTax";
import OnboardingBilling from "./OnboardingBilling";
import OnboardingCompleted from "./OnboardingCompleted";
import Wizard, { WizardNavigation } from "../primitive/wizard/Wizard";

export default function OnboardingLayer() {
  const [currentStep, setCurrentStep] = useState(3);

  const nextStep = () => {
    console.log(e)
    return false;
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };
  return (
    <>
      <Card>

          <h6 className='mb-4 text-xl'>Anda hampir siap menggunakan HealApp!</h6>
          <p className='text-neutral-500'>
            Selesaikan langkah-langkah berikut untuk menyelesaikan proses
            onboarding Anda.
          </p>
          <Wizard>
            <Wizard.Item header="Data Perusahaan"
              // onNext={async () => {
              //   console.log("OnboardingPackage onNext called");
              //     alert("Lengkapi data perusahaan terlebih dahulu!");
              //   return false;
              // }}
            >
              <OnboardingCompany />
            </Wizard.Item>
            <Wizard.Item header="Pilih Paket" 
              //  onNext={async () => {
              //   console.log("OnboardingPackage onNext called");
              //     alert("Lengkapi data perusahaan terlebih dahulu!");
              //   return false;
              // }}
              >
              <OnboardingPackage 
              />
            </Wizard.Item>
            <Wizard.Item header="Tax">
              <OnboardingTax />
              <WizardNavigation />
            </Wizard.Item>
            <Wizard.Item header="Informasi Penagihan">
              <OnboardingBilling />
              <WizardNavigation />
            </Wizard.Item>
            <Wizard.Item header="Selesai">
              <OnboardingCompleted />
              <WizardNavigation />
            </Wizard.Item>
          </Wizard>
          {/* Form Wizard Start */}
          {/* <div className='form-wizard'>
            <form action='#' method='post'>
              <div className='form-wizard-header overflow-x-auto scroll-sm pb-8 my-32'>
                <ul className='list-unstyled form-wizard-list'>
                  <li
                    className={`form-wizard-list__item
                      ${[2, 3, 4, 5].includes(currentStep) && "activated"}
                    ${currentStep === 1 && "active"} `}
                  >
                    <div className='form-wizard-list__line'>
                      <span className='count'>1</span>
                    </div>
                    <span className='text text-xs fw-semibold'>
                      Pilih Paket{" "}
                    </span>
                  </li>
                  <li
                    className={`form-wizard-list__item
                      ${[3, 4, 5].includes(currentStep) && "activated"}
                    ${currentStep === 2 && "active"} `}
                  >
                    <div className='form-wizard-list__line'>
                      <span className='count'>2</span>
                    </div>
                    <span className='text text-xs fw-semibold'>
                      Data Perusahaan
                    </span>
                  </li>
                  <li
                    className={`form-wizard-list__item
                      ${[4, 5].includes(currentStep) && "activated"}
                    ${currentStep === 3 && "active"} `}
                  >
                    <div className='form-wizard-list__line'>
                      <span className='count'>3</span>
                    </div>
                    <span className='text text-xs fw-semibold'>
                      Tax
                    </span>
                  </li>
                  <li
                    className={`form-wizard-list__item
                      ${[5].includes(currentStep) && "activated"}
                    ${currentStep === 4 && "active"} `}
                  >
                    <div className='form-wizard-list__line'>
                      <span className='count'>4</span>
                    </div>
                    <span className='text text-xs fw-semibold'>
                      Add Location
                    </span>
                  </li>
                  <li
                    className={`form-wizard-list__item

                    ${currentStep === 5 && "active"} `}
                  >
                    <div className='form-wizard-list__line'>
                      <span className='count'>5</span>
                    </div>
                    <span className='text text-xs fw-semibold'>Completed</span>
                  </li>
                </ul>
              </div>
              <fieldset
                className={`wizard-fieldset ${currentStep === 1 && "show"} `}
              >
                <OnboardingCompleted />
              </fieldset>
              <fieldset
                className={`wizard-fieldset ${currentStep === 2 && "show"} `}
              >
                <OnboardingPackage />
              </fieldset>
              <fieldset
                className={`wizard-fieldset ${currentStep === 3 && "show"} `}
              >
                <OnboardingCompany />
              </fieldset>
              <fieldset
                className={`wizard-fieldset ${currentStep === 4 && "show"} `}
              >
                <OnboardingTax />
              </fieldset>
              <fieldset
                className={`wizard-fieldset ${currentStep === 5 && "show"} `}
              >
                <OnboardingBilling />
              </fieldset>
            </form>
          </div> */}
          {/* Form Wizard End */}
          </Card>
    </>
  );
}