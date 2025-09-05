"use client";

import {
  forwardRef,
  useImperativeHandle,
  useEffect,
  useState,
  useRef,
  useMemo,
  FocusEvent,
} from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import LabelInput from "../label-input/LabelInput";
import { Icon } from "@iconify/react";
import {
  RuleConfigMap,
  validate,
  ValidateOutput,
} from "@/helper/Validation/Validate";
import Input, { InputRef } from "../input/Input";

export type DatePickerRef = {
  /** Run validation using provided `rules`. Returns true when valid */
  validate: () => boolean;
  /** Returns the ISO-like string (YYYY-MM-DD) in local time */
  getValue: () => string;
  /** Focus the date input */
  focus: () => void;
};

export type InputSizeType = "sm" | "lg" | undefined;

export interface DatePickerProps {
  name?: string;
  label?: string;
  placeholder?: string;
  value?: Date | null;
  onChange?: (e: { target: { name?: string; value: string } }) => void;
  rules?: RuleConfigMap;
  onError?: (e: ValidateOutput) => void;
  onValidate?: (e: ValidateOutput) => void;
  hasError?: boolean;
  feedback?: string;
  icon?: string;
  hint?: string;
  disabled?: boolean;
  size?: InputSizeType;
  className?: string;
  tooltip?: string;
  minDate?: Date;
  maxDate?: Date;
  /**
   * Validate when the input loses focus. Default: true
   */
  validateOnBlur?: boolean;
}

/**
 * Format `Date` to YYYY-MM-DD using LOCAL calendar values (avoids timezone shifts).
 */
// function formatLocalISO(date: Date): string {
//   const y = date.getFullYear();
//   const m = `${date.getMonth() + 1}`.padStart(2, "0");
//   const d = `${date.getDate()}`.padStart(2, "0");
//   return `${y}-${m}-${d}`;
// }

const CustomDatePicker = forwardRef<DatePickerRef, DatePickerProps>(
  (
    {
      name,
      label,
      placeholder = "Pilih tanggal",
      value = null,
      onChange,
      rules = {},
      hasError,
      onValidate,
      onError,
      feedback,
      icon = "mdi:calendar",
      hint,
      disabled,
      className,
      size = "sm",
      tooltip,
      minDate,
      maxDate,
      validateOnBlur = true,
    },
    ref
  ) => {
    const customInputRef = useRef<InputRef>(null)
    const [selectedDate, setSelectedDate] = useState<Date | null>(value);
    const [inputValue, setInputValue] = useState<Date>(
      value ? value : null
    );
    const [errors, setErrors] = useState<ValidateOutput>([]);

    // react-datepicker instance (not the HTMLInputElement)
    const datePickerRef = useRef<any>(null);

    // sync state ketika prop `value` berubah
    useEffect(() => {
      setSelectedDate(value);
      setInputValue(value ? value : "");
    }, [value]);

    const runValidation = (val: string): ValidateOutput => {
      const result = validate(val, rules || {});
      setErrors(result);
      return result;
    };

    const emitChange = (val: Date) => {
      onChange?.({ target: { name, value: val } });
    };

    const handleOnChange = (date: Date | null) => {
      setSelectedDate(date);
      setInputValue(date);

      // Validate on change to keep UI state in sync
      if (rules) {
        runValidation(date);
      }

      emitChange(date);
      // customInputRef.current.blur()
    };

    const handleBlur = (_e: FocusEvent<HTMLInputElement>) => {
      if (!validateOnBlur) return;
      runValidation(inputValue);
    };

    // Expose imperative API
    useImperativeHandle(
      ref,
      () => ({
        validate: () => runValidation(inputValue).length === 0,
        getValue: () => inputValue,
        focus: () => {
          // react-datepicker exposes setFocus()
          if (datePickerRef.current?.setFocus) {
            datePickerRef.current.setFocus();
          }
        },
      }),
      [inputValue, rules]
    );

    const handleFocus = () => {
       datePickerRef.current?.setOpen(true);
    }

    // Notify parent about validation lifecycle
    useEffect(() => {
      onValidate?.(errors);
      if (errors?.length) onError?.(errors);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [JSON.stringify(errors)]);

    const sizeClass = useMemo(() => {
      return size === "sm" ? "form-control-sm" : size === "lg" ? "form-control-lg" : "";
    }, [size]);

    const inputClasses = useMemo(() => {
      const invalid = hasError || (errors && errors.length > 0);
      return [
        "form-control",
        sizeClass,
        invalid ? "is-invalid" : "",
        className ?? "",
      ]
        .filter(Boolean)
        .join(" ");
    }, [sizeClass, hasError, errors, className]);

    const datePickerElement = (
      <DatePicker
        ref={datePickerRef}
        name={name}
        selected={selectedDate}
        onChange={handleOnChange}
        onCalendarClose={() => validateOnBlur && runValidation(inputValue)}
        customInput={
          // Pass our own Input so className/size/validation styles are applied to the visible input
          <Input icon="mdi:calendar" ref={customInputRef} rules={rules} onBlur={handleBlur} onFocus={handleFocus} />
        }
        minDate={minDate}
        maxDate={maxDate}
        dateFormat="dd MMMM yyyy"
        placeholderText={placeholder}
        disabled={!!disabled}
        className={inputClasses}
        autoComplete="off"
        data-toggle="tooltip"
        data-placement="top"
        title={tooltip}
      />
    );

    return (
      <div className="flex flex-col gap-1 w-100">
        {label && <LabelInput label={label} hint={hint} rules={rules} />}
        {icon ? (
          <div className="icon-field position-relative">
            <span className="icon top-50 translate-middle-y">
              <Icon icon={icon} />
            </span>
            {datePickerElement}
          </div>
        ) : (
          datePickerElement
        )}

        {/* Validation messages */}
        {errors && errors.length > 0 && (
          <div className="invalid-feedback d-block">
            {errors.map((err, idx) => (
              <div key={idx}>{err.error}</div>
            ))}
          </div>
        )}

        {/* Optional server-side / external feedback */}
        {feedback && (
          <div
            className="invalid-feedback d-block"
            dangerouslySetInnerHTML={{ __html: feedback }}
          />
        )}
      </div>
    );
  }
);

CustomDatePicker.displayName = "CustomDatePicker";

export default CustomDatePicker;
