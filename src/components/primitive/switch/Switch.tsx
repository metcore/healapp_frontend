'use client'
import { validate } from "@/helper/Validation/Validate";
import { forwardRef, useImperativeHandle, useRef, useState } from "react";

type SwitchProps = {
  label?: string;
  hint?: string;
  onChange?: (e) => void;
  name: string;
  checked?: boolean;
}

export type SwitchRef = {
  /** Run validation using provided `rules`. Returns true when valid */
  validate: () => boolean;
  /** Returns the ISO-like string (YYYY-MM-DD) in local time */
  getValue: () => string;
  /** Focus the date input */
  focus: () => void;
};
const Switch = forwardRef<SwitchRef, SwitchProps>(
  (
    {
      label, hint, onChange, name, checked,rules
    },
    ref
  ) => {

    const [inputValue, setInputValue] = useState(checked || "");
    const inputRef = useRef<HTMLInputElement>(null);
    useImperativeHandle(
      ref,
      () => ({
        validate: () => {
          const result = validate(inputValue, rules || {});

          return result.length === 0;
        },
        getValue: () => inputValue,
        focus: () => inputRef.current?.focus(),
        target: inputRef.current,

      }),
      [inputValue, rules]
    );
    // Handle switch change
    const handleSwitchChange = (e) => {
      setInputValue(e.target.checked)
      if (onChange) {
        onChange(e);
      }
    };

    // Render the switch component
    return(
      <div>
        <div className="form-switch switch-primary d-flex align-items-center gap-3">
          <input
            name={name}
            checked={checked}
            className="form-check-input"
            type="checkbox"
            ref={inputRef}
            role="switch"
            id="switch1"
            onChange={(e) => handleSwitchChange(e)}
          />
          {label && (

            <label
                className="form-check-label line-height-1 fw-medium text-secondary-light"
                htmlFor="switch1"
            >
              {label}
            </label>
          )}
        </div>
        
        {hint && <p className="text-sm mb-0 text-secondary-light">{hint}</p>}
      </div>
    );
  }
);

export default Switch;