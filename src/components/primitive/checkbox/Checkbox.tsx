'use client'
import React, {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from 'react';

import { RuleConfigMap, validate, ValidateOutput } from '@/helper/Validation/Validate';

export type CheckboxRef = {
  validate: () => boolean;
  getValue: () => boolean;
};

interface CheckBoxProps {
  checked?: boolean;
  name: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label?: string | React.ReactNode;
  disabled?: boolean;
  renderLabel?: () => React.ReactNode;
  value?: string | number;
  rules?: RuleConfigMap;
  feedback?: string;
}

const Checkbox = forwardRef<CheckboxRef, CheckBoxProps>(({
  checked = false,
  name,
  onChange,
  label,
  disabled,
  renderLabel,
  value,
  rules,
  feedback,
}, ref) => {
  const [isChecked, setIsChecked] = useState(checked);
  const [error, setError] = useState<ValidateOutput>([]);

  const validateInput = () => {
    const result = validate(isChecked, rules || {});
    setError(result);
    return result.length === 0;
  };

  const getValue = () => isChecked;

  useImperativeHandle(ref, () => ({
    validate: validateInput,
    getValue,
  }), [isChecked, rules]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsChecked(e.target.checked);
    onChange?.(e);

    if (rules) {
      const result = validate(e.target.checked, rules);
      setError(result);
    }
  };

  useEffect(() => {
    // Sync if parent updates `checked` prop
    setIsChecked(checked);
  }, [checked]);

  return (
    <div className="form-check style-check">
      <div className="d-flex align-items-center form-check style-check">
        <input
          className={`form-check-input border border-neutral-300 ${error.length > 0 ? 'is-invalid' : ''}`}
          type="checkbox"
          name={name}
          disabled={disabled}
          value={value}
          checked={isChecked}
          onChange={handleChange}
          id={name}
        />
        <label className="form-check-label text-secondary-light" htmlFor={name}>
          {label && <span className="mb-0 text-secondary-light">{label}</span>}
          {renderLabel?.()}
        </label>
      </div>

      {error && error.length > 0 && (
        <div className="invalid-feedback d-block">
          {error.map((err, idx) => (
            <div key={idx}>{err.error}</div>
          ))}
        </div>
      )}

      {feedback && <div className="invalid-feedback d-block">{feedback}</div>}
    </div>
  );
});

export default Checkbox;
