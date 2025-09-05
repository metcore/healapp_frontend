'use client';
import { RuleConfigMap, validate, ValidateOutput } from "@/helper/Validation/Validate";
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import LabelInput from "../label-input/LabelInput";
import { Icon } from "@iconify/react";
import Validaiton from "../validation/Validation";

export type TextAreaRef = {
  validate: () => boolean;
  getValue: () => string;
  focus: () => void;
};

type TextAreaProps = {
  label?: string;
  placeholder?: string;
  name: string;
  value?: string;
  onChange?: (e) => void;
  rules?: RuleConfigMap;
  onError?: (e) => void;
  onValidate?: (e) => void;
  hasError?: boolean;
  feedback?: string;
  icon?: string; // made optional
  hint?: string;
};


const TextArea = forwardRef<TextAreaRef, TextAreaProps>(function TextArea(
  {
    label,
    placeholder,
    name,
    value,
    onChange,
    rules = {},
    hasError,
    onValidate,
    feedback,
    icon,
    hint
  },
  ref
) {
  const [error, setError] = useState<ValidateOutput>([]);
  const textAreaRef = useRef<HTMLInputElement>(null);
  const [inputValue, setInputValue] = useState(value || "");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    if (rules) {
      const result = validate(newValue, rules);
      if (result) {
        setError(result);
      }
    }

    onChange?.(e);
  };

  useImperativeHandle(
    ref,
    () => ({
      validate: () => {
        const result = validate(inputValue, rules || {});
        setError(result);
        if (result.length > 0) {
          textAreaRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
          textAreaRef.current?.focus();
        }

        return result.length === 0;
      },
      getValue: () => inputValue,
      focus: () => textAreaRef.current?.focus(),
    }),
    [inputValue, rules]
  );

  useEffect(() => {
    onValidate?.(error);
  }, [error]);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  return (
    <div>
      <LabelInput label={label} hint={hint} rules={rules} />
      {hint && <p className="text-sm mb-0 text-secondary-light">{hint}</p>  }
      <textarea
        name={name}
        value={value}
        className={`form-control  ${hasError || (error && error.length > 0) ? "is-invalid" : ""}`}
        placeholder={placeholder}
        onChange={handleChange}
      ></textarea>
      
      <Validaiton error={error} />
      {feedback && (
        <div
          className="invalid-feedback d-block"
          dangerouslySetInnerHTML={{ __html: feedback }}
        />
      )}
    </div>
  )
});

export default TextArea;
