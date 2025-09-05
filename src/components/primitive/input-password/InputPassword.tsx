import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import LabelInput from "../label-input/LabelInput";
import { RuleConfigMap, validate, ValidateOutput } from "@/helper/Validation/Validate";
import { Icon } from "@iconify/react";

export type inputPasswordRef = {
  validate: () => boolean;
  getValue: () => string;
};
type InputPasswordProps = {
  label?: string;
  placeholder?: string;
  name: string;
  value?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  rules?: RuleConfigMap;
  onError?: (e) => void;
  onValidate?: (e) => void;
  hasError?: boolean;
  feedback?: string;
  icon?: string; // made optional
  hint?: string
};


const InputPassword = forwardRef<inputPasswordRef, InputPasswordProps>(function Input(
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
  },
  ref
) {
  const [error, setError] = useState<ValidateOutput>([]);
  const [showPassword, setShowPassword] = useState(false);
  const [inputValue, setInputValue] = useState(value || "");

  // 🔄 Expose validate() and getValue()
  useImperativeHandle(ref, () => ({
    validate: () => {
      const result = validate(inputValue, rules || {});
      setError(result);
      return result.length === 0;
    },
    getValue: () => inputValue,
  }), [inputValue, rules]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);

    if (rules) {
      const result = validate(newValue, rules);
      setError(result);
    }

    onChange(e);
  };
  useEffect(() => {
    onValidate?.(error);
  }, [error]);

  const togglePassword = () => setShowPassword(!showPassword);

  const inputElement = (
    <>
      <input
        type={showPassword ? "text" : "password"}
        name={name}
        className={`form-control ${hasError || (error && error.length > 0) ? "is-invalid" : ""}`}
        placeholder={placeholder}
        value={value}
        autoComplete="off"
        id="your-password"
        onChange={handleChange}
      />
      <span
        onClick={togglePassword}
        style={{right:18}}
        className={`toggle-password  cursor-pointer position-absolute  top-50 translate-middle-y me-16 text-secondary-light ${
          showPassword ? "ri-eye-close-line" : "ri-eye-line"
        }`}
        data-toggle="#your-password"
      />
    </>
  );

  return (
    <div>
      {label && <LabelInput label={label} hint={hint}  rules={rules} />}
      {hint && <p className="text-sm  text-secondary-light">{hint}</p>  }
     
      <div className="position-relative">
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
      </div>

      {error && error.length > 0 && (
        <div className="invalid-feedback d-block">
          {error.map((err, idx) => (
            <div key={idx}>{err.error}</div>
          ))}
        </div>
      )}

      {feedback && (
        <div
          className="invalid-feedback d-block"
          dangerouslySetInnerHTML={{ __html: feedback }}
        />
      )}
    </div>
  );
});

export default InputPassword;
