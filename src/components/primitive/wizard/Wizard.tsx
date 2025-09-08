'use client'
import React, { createContext, useContext, useState, ReactNode, ReactElement, useRef, useEffect } from "react";
import Button from "../button/Button";
import Form from "../form/Form";

interface WizardContextType {
  currentStep: number;
  nextStep: () => void;
  prevStep: () => void;
  loading: (boolean | undefined);
  children: ReactElement<WizardItemProps>[] | ReactElement<WizardItemProps>;
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
  loading?: boolean;
  onSubmit: () => void;
}

export default function Wizard({ children, loading, onSubmit }: WizardProps) {
  const steps = React.Children.toArray(children) as ReactElement<WizardItemProps>[];
  const onNextFns = steps.map((step) => step.props.onNext);
  const [currentStep, setCurrentStep] = useState(0);

  const nextStep = async (e) => {
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

  const handleOnSubmitForm = (e) => {
    onSubmit?.(e)
    return false;  
  }
  return (
    <WizardContext.Provider value={{ currentStep, nextStep, prevStep, loading,  children }}>
      <div className='form-wizard'>
        <Form onSubmit={handleOnSubmitForm}>
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
        </Form>
      </div>
    </WizardContext.Provider>
  );
}
export function WizardNavigation() {
  const { currentStep, nextStep, prevStep, loading, children } = useWizard();


  return (
    <div className="d-flex justify-content-between mt-4">
      <div style={{ flex: 1 }}>
        {currentStep !== 0 ?(

          <Button
            onClick={prevStep}
            size="sm"
          >
            Sebelumnya
          </Button>
        ): ""}
      </div>

      <div>
        {currentStep == children.length -1  ? (
          <Form.ButtonSubmit
            size="sm"
            disabled={loading}
            loading={loading}
          >
            Simpan
          </Form.ButtonSubmit>
        ):(
          <Button
            onClick={nextStep}
            size="sm"
            disabled={loading}
            loading={loading}
          >
            Selanjutnya
          </Button>
        )}
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


