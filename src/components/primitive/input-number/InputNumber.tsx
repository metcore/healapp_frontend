import {
  useState,
  useEffect,
  forwardRef,
  ChangeEvent,
  KeyboardEvent,
  useImperativeHandle,
  useRef,
} from "react";
import Input, { InputSizeType, InputRef } from "../input/Input";
import { RuleConfigMap, ValidateOutput } from "@/helper/Validation/Validate";

export type InputNumberTypeProps = "currency" | "number" | "percent";

export type InputNumberProps = {
  name: string;
  label?: string;
  hint?: string;
  value?: number;
  onChange?: (value: number) => void;
  placeholder?: string;
  disabled?: boolean;
  icon?: string;
  size?: InputSizeType;
  format?: InputNumberTypeProps;
  rules?: RuleConfigMap;
  onValidate?: (e: ValidateOutput) => void;
  feedback?: string;
  tooltip?: string;
};

export type InputNumberRef = {
  validate: () => boolean;
  getValue: () => number;
  focus: () => void;
};

const formatValue = (value: number, format: InputNumberTypeProps): string => {
  if (format === "currency") {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);
  }

  if (format === "percent") {
    return (
      new Intl.NumberFormat("id-ID", {
        minimumFractionDigits: 0,
      }).format(value) + " %"
    );
  }

  return new Intl.NumberFormat("id-ID", {
    minimumFractionDigits: 0,
  }).format(value);
};

const InputNumber = forwardRef<InputNumberRef, InputNumberProps>(
  (
    {
      name,
      label,
      hint,
      value = 0,
      onChange,
      placeholder,
      disabled,
      size,
      icon,
      format = "currency",
      rules,
      onValidate,
      feedback,
      tooltip,
    },
    ref
  ) => {
    const [displayValue, setDisplayValue] = useState(
      value ? formatValue(value, format) : ""
    );

    const innerRef = useRef<InputRef>(null);
    const rawValueRef = useRef<number>(value || 0);

    // ✅ Sync ke state kalau props.value berubah (misalnya dari tombol + / -)
    useEffect(() => {
      rawValueRef.current = value || 0;
      setDisplayValue(value ? formatValue(value, format) : "");
    }, [value, format]);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      const rawValue = e.target.value.replace(/[^0-9]/g, "");
      let numericValue = rawValue ? parseInt(rawValue, 10) : 0;

      if (format === "percent" && numericValue > 100) {
        numericValue = 100;
      }

      rawValueRef.current = numericValue;
      const clonedEvent = {
        ...e,
        target: { ...e.target, value: "0" },
        currentTarget: { ...e.currentTarget, value: "0" },
      } as ChangeEvent<HTMLInputElement>;

      if (rawValue === "") {
        setDisplayValue("");
        onChange?.(clonedEvent);
      } else {
        setDisplayValue(formatValue(numericValue, format));
        onChange?.(clonedEvent);
      }
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
      if (
        !/[0-9]/.test(e.key) &&
        !["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab"].includes(
          e.key
        )
      ) {
        e.preventDefault();
      }
    };

    useImperativeHandle(ref, () => ({
      validate: () => innerRef.current?.validate() ?? true,
      getValue: () => rawValueRef.current,
      focus: () => innerRef.current?.focus(),
    }));

    return (
      <Input
        label={label}
        hint={hint}
        icon={icon}
        ref={innerRef}
        name={name}
        className="form-control text-end"
        value={displayValue}
        placeholder={placeholder || (format === "currency" ? "Rp 0" : "0")}
        size={size}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        rules={rules}
        onValidate={onValidate}
        feedback={feedback}
        tooltip={tooltip}
      />
    );
  }
);

InputNumber.displayName = "InputNumber";

export default InputNumber;
