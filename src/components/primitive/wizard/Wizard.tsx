'use client'
import React, { createContext, useContext, useState, ReactNode, ReactElement, useRef } from "react";
import { InputRef } from "@/components/primitive/input/Input";

interface WizardContextType {
  currentStep: number;
  nextStep: () => void;
  prevStep: () => void;
}

const WizardContext = createContext<WizardContextType | undefined>(undefined);

function useWizard() {
  const context = useContext(WizardContext);
  if (!context) {
    throw new Error("useWizard must be used within Wizard");
  }
  return context;
}

interface WizardProps {
  children: ReactElement<WizardItemProps>[] | ReactElement<WizardItemProps>;
  onNext?: () => boolean | Promise<boolean>;
}

export default function Wizard({ children }: WizardProps) {
  const steps = React.Children.toArray(children) as ReactElement<WizardItemProps>[];
  const onNextFns = steps.map((step) => step.props.onNext);
  const [currentStep, setCurrentStep] = useState(0);

  const nextStep = async () => {
    const onNext = onNextFns[currentStep];
    let canProceed = true;
    if (onNext) {
      const result = await onNext();
      canProceed = result === true;
    }

    if (canProceed && currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };


  const prevStep = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  return (
    <WizardContext.Provider value={{ currentStep, nextStep, prevStep }}>

      <div className='form-wizard'>
        <form action='#' method='post'>
          <div className='form-wizard-header overflow-x-auto scroll-sm pb-8 my-32'>
            <ul className='list-unstyled form-wizard-list'>
              {steps.map((step, index) => (
                <li
                  key={index}
                  className={`form-wizard-list__item
                    ${index < currentStep && "activated"}
                    ${index === currentStep && "active"}`}
                >
                  <div className='form-wizard-list__line'>
                    <span className='count'>{index + 1}</span>
                  </div>
                  <span className='text text-xs fw-semibold'>
                    {step.props.header}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {steps.map((step, index) => (
            <fieldset key={index} className={`wizard-fieldset ${index === currentStep ? "show" : ""}`}>
              {step.props.children}
            </fieldset>
          ))}
        </form>
      </div>
    </WizardContext.Provider>
  );
}
export function WizardNavigation() {
  const { currentStep, nextStep, prevStep } = useWizard();

  return (
    <div className="d-flex justify-content-between mt-4">
      <div style={{ flex: 1 }}>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={prevStep}
          style={{ display: currentStep === 0 ? "none" : "inline-block" }}
        >
          Sebelumnya
        </button>
      </div>

      <div>
        <button
          type="button"
          className="btn btn-primary"
          onClick={nextStep}
        >
          Selanjutnya
        </button>
      </div>
    </div>
  );
}

interface WizardItemProps {
  header: string;
  children: ReactNode;
}

Wizard.Item = function WizardItem({ children }: WizardItemProps) {
  return <>{children}</>;
};


