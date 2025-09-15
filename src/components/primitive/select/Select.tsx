// components/primitive/select/Select.tsx
"use client";

import {
  forwardRef,
  useImperativeHandle,
  useEffect,
  useRef,
  useState,
} from "react";
import SelectPlugin from "react-select";
import Button from "../button/Button";
import LabelInput from "../label-input/LabelInput";
import {
  RuleConfigMap,
  validate,
  ValidateOutput,
} from "@/helper/Validation/Validate";
import Validaiton from "../validation/Validation";

export type SelectOptionProps = {
  label: string;
  value: string | number;
};

export type SelectAppendButtonProps = {
  label?: string;
  size?: "sm" | "lg";
  className?: string;
  onClick?: () => void;
};

export type SelectRef = {
  validate: () => boolean;
  getValue: () => string | number | null;
  focus: () => void;
};

type SelectProps = {
  label?: string;
  placeholder?: string;
  name?: string;
  options: SelectOptionProps[];
  value?: string | number | null;
  rules?: RuleConfigMap;
  hasError?: boolean;
  feedback?: string;
  hint?: string;
  disabled?: boolean;
  size?: "sm" | "lg";
  appendButton?: SelectAppendButtonProps;
  isClearable?: boolean;
  isSearchable?: boolean;
  onChange?: (value: SelectOptionProps) => void;
  onValidate?: (error: ValidateOutput) => void;
};

const Select = forwardRef<SelectRef, SelectProps>(function Select(
  {
    label,
    placeholder,
    name,
    options,
    value = null,
    rules = {},
    hasError,
    feedback,
    hint,
    disabled,
    size = "sm",
    appendButton,
    isClearable = true,
    isSearchable=true,
    onChange,
    onValidate,
  },
  ref
) {
  const [error, setError] = useState<ValidateOutput>([]);
  const [selected, setSelected] = useState<SelectOptionProps | null>(
    options?.find((o) => o.value === value) || null
  );
  const selectRef = useRef<any>(null);

  useImperativeHandle(
    ref,
    () => ({
      validate: () => {
        const val = selected ? selected.value : "";
        const result = validate(val, rules || {});
        setError(result);

        if (result.length > 0) {
          // Scroll ke elemen
          // selectRef.current?.focus();
        }
        return result.length === 0;
      },
      getValue: () => (selected ? selected.value : null),
      // focus: () => selectRef.current?.focus(),
    }),
    [selected, rules]
  );

  const handleChange = (option: SelectOptionProps | null) => {
    setSelected(option);

    if (rules) {
      const result = validate(option ? option.value : "", rules);
      setError(result);
    }

    onChange?.(option ? option : null);
  };

  useEffect(() => {
    onValidate?.(error);
  }, [error]);

  useEffect(() => {
    console.log("otpions", options)
    const newVal = options?.find((o) => o.value === value) || null;
    setSelected(newVal);
  }, [value, options]);


  return (
    <div>
      {label && <LabelInput label={label} hint={hint}  rules={rules}/>}
      {hint && <p className="text-sm mb-0 text-secondary-light">{hint}</p>}

      <div className="input-group">
        <div className="flex-grow-1">
          <SelectPlugin
            ref={selectRef}
            isClearable={isClearable}
            options={options}
            // value={selected.value}
            onChange={handleChange}
            placeholder={placeholder}
            isSearchable={isSearchable}
            className={` ${
              hasError || (error && error.length > 0) ? "is-invalid" : ""
            }`}

            styles={{
              control: (base, state) => ({
                ...base,
                borderColor:
                  hasError || (error && error.length > 0)
                    ? "red"
                    : state.isFocused
                    ? "#86b7fe"
                    : base.borderColor,
                boxShadow:
                  hasError || (error && error.length > 0)
                    ? "var(--danger-main)"
                    : state.isFocused
                    ? "0 0 0 0.2rem rgba(13, 110, 253, 0.25)"
                    : base.boxShadow,
                "&:hover": {
                  borderColor:
                    hasError || (error && error.length > 0) ? "red" : "#86b7fe",
                },
              }),
            }}
          />
          
        </div>

        {appendButton && (
          <Button
            size={appendButton.size || "sm"}
            className={appendButton.className || "btn btn-primary"}
            onClick={appendButton.onClick}
          >
            {appendButton.label}
          </Button>
        )}
      </div>

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

export default Select;
