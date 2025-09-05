'use client';
import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
  useEffect,
  useCallback,
} from 'react';
import LabelInput from '../label-input/LabelInput';
import { RuleConfigMap, validate, ValidateOutput } from '@/helper/Validation/Validate';
import Validaiton from '../validation/Validation';

type Option = {
  label: string;
  value: string | number;
  disabled?: boolean;
};

export type RadioButtonRef = {
  validate: () => boolean;
  getValue: () => string | number | '';
  focus: () => void;
  current: HTMLInputElement | null;
  /** Opsional kalau kamu ingin Form.setValue bekerja */
  setValue?: (v: string | number) => void;
};

export type RadioButtonProps = {
  name: string;
  value?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>, parsedValue: string | number) => void;
  label?: string;
  disabled?: boolean;
  rules?: RuleConfigMap;
  options: Option[];
  hint?: string;
  orientation?: 'horizontal' | 'vertical';
  feedback?: string;
  /** Jika true, kembalikan number bila option.value aslinya number */
  coerceNumber?: boolean;
  /** Basis id (opsional) utk aria */
  id?: string;
};

const RadioButton = forwardRef<RadioButtonRef, RadioButtonProps>(function RadioButton(
  {
    name,
    value,
    onChange,
    rules = {},
    label,
    disabled = false,
    options = [],
    hint,
    orientation = 'vertical',
    feedback,
    coerceNumber = true,
    id,
  },
  ref
) {
  const toInternal = useCallback(
    (v: string | number | undefined): string => (v === undefined ? '' : String(v)),
    []
  );

  const toExternal = useCallback(
    (v: string): string | number => {
      // Jika option aslinya number dan coerceNumber true, parse ke number
      if (
        coerceNumber &&
        v !== '' &&
        options.some(o => String(o.value) === v && typeof o.value === 'number')
      ) {
        const n = Number(v);
        if (!Number.isNaN(n)) return n;
      }
      return v;
    },
    [coerceNumber, options]
  );

  const [error, setError] = useState<ValidateOutput>([]);
  const [inputValue, setInputValue] = useState<string>(toInternal(value));

  useEffect(() => {
    setInputValue(toInternal(value));
  }, [value, toInternal]);

  const radioRefs = useRef<(HTMLInputElement | null)[]>([]);
  useEffect(() => {
    radioRefs.current = radioRefs.current.slice(0, options.length);
  }, [options.length]);

  const groupId = id ?? `${name}-group`;
  const hintId = hint ? `${groupId}-hint` : undefined;
  const errorId = error.length > 0 ? `${groupId}-error` : undefined;
  const feedbackId = feedback ? `${groupId}-feedback` : undefined;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newInternal = e.target.value; // selalu string
    setInputValue(newInternal);

    const parsed = toExternal(newInternal);
    const result = validate(parsed, rules || {});
    setError(result);

    onChange?.(e, parsed);
  };

  const focusSelectedOrFirst = () => {
    const idx =
      options.findIndex(o => String(o.value) === inputValue) >= 0
        ? options.findIndex(o => String(o.value) === inputValue)
        : 0;
    radioRefs.current[idx]?.focus();
  };

  useImperativeHandle(
    ref,
    () => ({
      validate: () => {
        const result = validate(toExternal(inputValue), rules || {});
        setError(result);
        if (result.length > 0) {
          radioRefs.current[0]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
          focusSelectedOrFirst();
        }
        return result.length === 0;
      },
      getValue: () => (inputValue === '' ? '' : toExternal(inputValue)),
      focus: focusSelectedOrFirst,
      current: radioRefs.current[0],
      setValue: (v: string | number) => {
        const internal = String(v);
        setInputValue(internal);
        setError(validate(toExternal(internal), rules || {}));
      },
    }),
    [inputValue, rules, toExternal, options]
  );

  return (
    <div>
      {label && <LabelInput label={label} hint={hint} rules={rules} />}

      <fieldset
        id={groupId}
        className="border-0 p-0 m-0"
        role="radiogroup"
        aria-orientation={orientation === 'vertical' ? 'vertical' : 'horizontal'}
        aria-describedby={[hintId, errorId, feedbackId].filter(Boolean).join(' ') || undefined}
        aria-invalid={error.length > 0 ? true : undefined}
        disabled={disabled}
      >
        {label && <legend className="visually-hidden">{label}</legend>}

        <div
          className={`d-flex flex-wrap gap-2 ${
            orientation === 'vertical'
              ? 'flex-column align-items-start'
              : 'flex-row align-items-center'
          }`}
        >
          {options.map((opt, index) => {
            const optId = `${groupId}-${index}`;
            const checked = inputValue === String(opt.value);
            return (
              <div className="form-check checked-primary d-flex align-items-center gap-2" key={optId}>
                <input
                  ref={el => (radioRefs.current[index] = el)}
                  id={optId}
                  type="radio"
                  className="form-check-input"
                  name={name}
                  value={String(opt.value)}
                  checked={checked}
                  onChange={handleChange}
                  disabled={disabled || !!opt.disabled}
                />
                {opt.label && (
                  <label htmlFor={optId} className="form-check-label">
                    {opt.label}
                  </label>
                )}
              </div>
            );
          })}
        </div>
      </fieldset>

      {hint && (
        <div id={hintId} className="form-text">
          {hint}
        </div>
      )}
      <Validaiton error={error} />
      {feedback && (
        <div
          id={feedbackId}
          className="invalid-feedback d-block"
          dangerouslySetInnerHTML={{ __html: feedback }}
        />
      )}
    </div>
  );
});

export default RadioButton;
