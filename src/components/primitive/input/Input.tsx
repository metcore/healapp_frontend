// components/primitive/input/Input.tsx
"use client";

import {
  forwardRef,
  useImperativeHandle,
  useEffect,
  useState,
  useRef,
  FocusEventHandler,
} from "react";
import LabelInput from "../label-input/LabelInput";
import {
  RuleConfigMap,
  validate,
  ValidateOutput,
} from "@/helper/Validation/Validate";
import { Icon } from "@iconify/react";
import Validaiton from "../validation/Validation";

export type InputRef = {
  validate: () => boolean;
  getValue: () => string;
  focus: () => void;
  blur:() => void;
  target: HTMLInputElement | null;
  setError: (err: string[]) => void;
};

export type InputSizeType = "sm" | "lg" | undefined;

type InputProps = {
  label?: string;
  placeholder?: string;
  name: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  rules?: RuleConfigMap;
  onError?: (e) => void;
  onValidate?: (e) => void;
  hasError?: boolean;
  feedback?: string;
  icon?: string;
  hint?: string;
  number?: string | number | undefined;
  disabled?: boolean;
  onFocus?: FocusEventHandler | undefined;
  onBlur?: FocusEventHandler | undefined;
  size?: InputSizeType;
  className?: string;
  autofocus?: boolean;
  onKeyDown?: (e)=>void;
  tooltip?: string;
  loading?: boolean;
  inputMode?: "text" | "search" | "email" | "tel" | "url" | "none" | "numeric" | "decimal";
  type?: string;
  pattern?: string;
  errors?: ValidateOutput;
};

const Input = forwardRef<InputRef, InputProps>(function Input(
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
    hint,
    disabled,
    onFocus,
    onBlur,
    className,
    autofocus,
    size='sm',
    onKeyDown,
    tooltip,
    loading=false,
    inputMode,
    type="text",
    pattern,
    errors,
  },
  ref
) {
  const [error, setError] = useState<ValidateOutput>([]);
  const [inputValue, setInputValue] = useState(value || "");
  const inputRef = useRef<HTMLInputElement>(null);

  useImperativeHandle(
    ref,
    () => ({
      validate: () => {
        const result = validate(inputValue, rules || {});
        setError(result);
        if (result.length > 0) {
          inputRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
          inputRef.current?.focus();
        }

        return result.length === 0;
      },
      getValue: () => inputValue,
      focus: () => inputRef.current?.focus(),
      setError: (err) => setError(err),
      target: inputRef.current,
      blur: () => inputRef.current.blur()

    }),
    [inputValue, rules]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);

    if (rules) {
      const result = validate(newValue, rules);
      setError(result);
    }

    onChange?.(e);
  };

  useEffect(() => {
    if (onValidate) {
      onValidate(error);
    }
  }, [error, onValidate]);


  useEffect(() => {
    setInputValue(value ?? "");
  }, [value]);

  const sizeClass =
    size === "sm" ? "form-control-sm" : size === "lg" ? "form-control-lg" : "";

  const inputElement = (
    <>
      <input
        data-toggle="tooltip"
        data-placement="top"
        title={tooltip}
        ref={inputRef}
        type={type}
        name={name}
        className={`form-control ${sizeClass} ${
          hasError || (error.length > 0) ? "is-invalid" : ""
        } ${className ?? ""}`}
        placeholder={placeholder}
        value={inputValue}
        autoComplete="off"
        onChange={handleChange}
        onFocus={onFocus}
        autoFocus={autofocus}
        disabled={disabled}
        onBlur={onBlur}
        onKeyDown={onKeyDown}
        inputMode={inputMode}
        pattern={pattern}
      />
      {loading ? (
        <Icon icon="eos-icons:loading" 
          style={{right:0}}
          className={`toggle-password  cursor-pointer position-absolute  top-50 translate-middle-y me-16 text-secondary-light `}
        />
      ): ""}
    </>
  );

  return (
    <div className="flex">
      {label  && <LabelInput label={label } hint={hint} rules={rules} />}
      {hint && <p className="text-sm mb-0 text-secondary-light">{hint}</p>}
      {icon ? (
        <div className="icon-field">
          <span className="icon top-50 translate-middle-y">
            <Icon icon={icon} />
          </span>
          {inputElement}
        </div>
      ) : (
        inputElement
      )}
      <Validaiton error={error} />
      {feedback && (
        <div
          className="invalid-feedback d-block"
          dangerouslySetInnerHTML={{ __html: feedback }}
        />
      )}
    </div>
  );
});

export default Input;
