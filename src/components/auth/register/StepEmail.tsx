'use client';
import Card from "@/components/primitive/card/Card";
import Input, { InputRef } from "@/components/primitive/input/Input";
import { useRef, useState, forwardRef, useImperativeHandle } from "react";
import { validate } from "@/helper/Validation/Validate";
import { WizardNavigation } from "@/components/primitive/wizard/Wizard";
import Form from "@/components/primitive/form/Form";

export type StepEmailRef = {
  validate: () => boolean;
  getValue: () => string;
  setError: (err: string[]) => void;
};

const rules = {
  required: { message: "Wajib diisi" },
  email: { message: "Harus format email" },
  min: { value: 5, message: "Minimal 5 karakter" },
};



const StepEmail = forwardRef<StepEmailRef>((_, ref) => {
  const [email, setEmail] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [hasError, setHasError] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<string>("");

  const emailRef = useRef<InputRef>(null);

  const doValidate = (): boolean => {
    setHasError(false);
    setFeedback("");
    const result = validate(email, rules);
    if (result.length > 0) {
      setHasError(true);
      const feedbackMessage = result.map(err => `<div>${err.error}</div>`).join("");
      setFeedback(feedbackMessage);
      return false;
    }
    return true;
  };

  const handleOnValidate = (e) => {
    setError(e);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setHasError(false);
    setFeedback("");
  };

  useImperativeHandle(ref, () => ({
    validate: doValidate,
    getValue: () => email,
    setError:(e) => emailRef.current?.setError(e),
  }));
  
  return (
    <Card>
      <div className="d-flex flex-column gap-16 p-64">
        <h6 className="text-semibold mb-0">Email Anda</h6>
        <p className="mb-0">Misal example@{process.env.NEXT_PUBLIC_DOMAIN}.com</p>
        <Form.Input
          name="email"
          label="Email"
          placeholder="Masukan email anda"
          value={email}
          onChange={handleChange}
          icon="mage:email"
          hasError={hasError}
          onValidate={handleOnValidate}
          rules={rules}
          feedback={feedback}
          ref={emailRef}
        />
        <WizardNavigation />
      </div>
    </Card>
  );
});

StepEmail.displayName = "StepEmail";
export default StepEmail;
