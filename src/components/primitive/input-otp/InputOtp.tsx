'use client';
import { RuleConfigMap, validate, ValidateOutput } from '@/helper/Validation/Validate';
import React, {
  useRef,
  useState,
  forwardRef,
  useImperativeHandle,
} from 'react';

export type InputOtpRef = {
  validate: () => boolean;
  getValue: () => string;
  setError: (err: string[]) => void;
};

type InputOtpProps = {
  length?: number;
  onChange?: (otp: string) => void;
  label?: string;
  feedback?: string;
  hasError?: boolean;
  rules?: RuleConfigMap;
  inputCenter?: boolean;
};

const InputOtp = forwardRef<InputOtpRef, InputOtpProps>(function InputOtp(
  {
    length = 6,
    onChange,
    label,
    feedback,
    hasError,
    inputCenter = false,
    rules
  },
  ref
) {
  const inputs = useRef<(HTMLInputElement | null)[]>([]);
  const values = useRef<string[]>(Array(length).fill(''));
  const [useFlexGrow, setUseFlexGrow] = useState(false);
  const [error, setError] = useState<ValidateOutput>([]);

  const itemWidth = 48;
  const itemGap = 10;

  const getValue = () => values.current.join('');
  const validateOtp = () => {
    const result = validate(getValue(), rules || {});
    setError(result);
    return result.length === 0;
  };

  useImperativeHandle(ref, () => ({
    validate: validateOtp,
    getValue,
    setError: (e) => setError(e),
  }), [rules]);

  const handleChange = (value: string, index: number) => {
    values.current[index] = value;
    onChange?.(getValue());

    if (value && index < length - 1) {
      inputs.current[index + 1]?.focus();
    }

    const result = validate(getValue(), rules);
    setError(result);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !values.current[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  return (
    <div className="flex flex-col gap-1 w-full">
      {label && <label className="font-semibold text-sm">{label}</label>}
      <div
        className={`flex ${inputCenter ? 'justify-center' : 'justify-start'} gap-[${itemGap}px] w-full`}
        ref={(ref) => {
          if (ref) {
            const totalWidth = length * itemWidth + (length - 1) * itemGap;
            setUseFlexGrow(totalWidth > ref.offsetWidth);
          }
        }}
      >
        <div className='inputs d-flex flex-row justify-content-center gap-2'>
          {Array.from({ length }).map((_, i) => (
            <input
              key={i}
              type="text"
              inputMode="numeric"
              maxLength={1}
              ref={(el) => (inputs.current[i] = el)}
              onChange={(e) => handleChange(e.target.value, i)}
              onKeyDown={(e) => handleKeyDown(e, i)}
              className={`m-2 p-2 text-center form-control rounded ${
                hasError || (error && error.length > 0) ? 'border-danger' : 'border-gray-300'
              } ${useFlexGrow ? 'flex-1' : ''}`}
              style={{ width: useFlexGrow ? undefined : `${itemWidth}px` }}
            />
          ))}
        </div>
      </div>

      {error && error.length > 0 && (
        <div className="invalid-feedback d-block">
          {error.map((err, idx) => (
            <div key={idx}>{err.error}</div>
          ))}
        </div>
      )}

      {feedback && (
        <p className={`invalid-feedback d-block`}>
          {feedback}
        </p>
      )}
    </div>
  );
});

export default InputOtp;
