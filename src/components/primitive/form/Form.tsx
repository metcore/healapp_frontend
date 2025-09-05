'use client';
import React, {
  ReactNode,
  createContext,
  useContext,
  useRef,
  useImperativeHandle,
  forwardRef,
  useEffect,
  useCallback,
  MutableRefObject,
} from 'react';

import Input, { InputRef } from '../input/Input';
import Select, { SelectRef } from '../select/Select';
import CustomDatePicker, { DatePickerRef } from '../date-picker/DatePicker';
import RadioButton, { RadioButtonRef } from '../radio-button/RadioButton';
import Button from '../button/Button';
import InputNumber, { InputNumberRef } from '../input-number/InputNumber';
import CounterButton, { CounterButtonRef } from '../counter-button/CounterButton';
import TextArea, { TextAreaRef } from '../textarea/TextArea';
import Switch, { SwitchRef } from '../switch/Switch';

/** Bentuk minimum semua field ref */
type BaseFieldRef = {
  validate: () => boolean;
  getValue: () => any;
  focus: () => void;
  current: any;
  setValue?: (v: any) => void;
};

type AnyFieldRef =
  | (BaseFieldRef & InputRef)
  | (BaseFieldRef & RadioButtonRef)
  | (BaseFieldRef & InputNumberRef)
  | (BaseFieldRef & SelectRef)
  | (BaseFieldRef & DatePickerRef)
  | (BaseFieldRef & CounterButtonRef)
  | null;

export type FieldRef = {
  name: string;
  /** accessor yang SELALU membaca ref terbaru */
  getRef: () => AnyFieldRef;
  rules?: any;
};

type FormContextType = {
  register: (f: FieldRef) => void;
  unregister: (name: string) => void;
};

const FormContext = createContext<FormContextType>({
  register: () => {},
  unregister: () => {},
});

export interface FormProps {
  children: ReactNode;
  onSubmit?: (payload: {
    hasError: boolean;
    values: Record<string, any>;
    fields: FieldRef[];
  }) => void;
  onChange?:  (payload: {
    hasError: boolean;
    values: Record<string, any>;
    fields: FieldRef[];
  }) => void;
  onHasError?: (hasError: boolean) => void;
  /** Validasi realtime saat field berubah */
  validateOnChange?: boolean;
}

export type FormRef = {
  validate: () => { valid: boolean; values: Record<string, any> };
  getValues: () => Record<string, any>;
  setValue: (name: string, value: any) => boolean;
};

const Form = forwardRef<FormRef, FormProps>(function Form(
  { children, onSubmit, onChange, onHasError, validateOnChange = true },
  ref
) {
  const fields = useRef<Map<string, FieldRef>>(new Map());

  const register = useCallback((f: FieldRef) => {
    fields.current.set(f.name, f);
  }, []);

  const unregister = useCallback((name: string) => {
    fields.current.delete(name);
  }, []);

  const runValidation = useCallback(() => {
    let valid = true;
    const values: Record<string, any> = {};

    for (const [name, f] of fields.current.entries()) {
      const r = f.getRef();
      if (r?.validate && !r.validate()) valid = false;
      if (r?.getValue) values[name] = r.getValue();
    }

    return { valid, values };
  }, []);

  const getValues = useCallback(() => {
    const values: Record<string, any> = {};
    for (const [name, f] of fields.current.entries()) {
      const r = f.getRef();
      if (r?.getValue) values[name] = r.getValue();
    }
    return values;
  }, []);

  const setValue = useCallback((name: string, value: any) => {
    const f = fields.current.get(name);
    if (!f) return false;
    const r = f.getRef();
    if (r?.setValue) {
      r.setValue(value);
      return true;
    }
    return false;
  }, []);

  useImperativeHandle(ref, () => ({
    validate: runValidation,
    getValues,
    setValue,
  }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { valid, values } = runValidation();
    onHasError?.(!valid);
    onSubmit?.({
      fields: Array.from(fields.current.values()),
      hasError: !valid,
      values,
    });
  };

  return (
    <FormContext.Provider value={{ register, unregister }}>
      <form
        onChange={
          () => {
            const  values  = getValues();
            console.log('d',values)
            const fieldsArray = Array.from(fields.current.values());
            onChange?.({
              fields: fieldsArray,
              values,
            });
          }
        }
        onSubmit={handleSubmit}
      >
        {children}
      </form>
    </FormContext.Provider>
  );
});

/* ========= Helper registrasi untuk wrapper ========= */

function useFieldRegistration<TRef extends AnyFieldRef>(
  name: string | undefined
): MutableRefObject<TRef> {
  const { register, unregister } = useContext(FormContext);
  const prevName = useRef<string | undefined>(undefined);
  const innerRef = useRef<TRef>(null as unknown as TRef);

  useEffect(() => {
    if (!name) return;

    if (prevName.current && prevName.current !== name) {
      unregister(prevName.current);
    }

    // daftar accessor yang selalu membaca ref terbaru
    register({
      name,
      getRef: () => innerRef.current,
    });

    prevName.current = name;

    return () => {
      if (prevName.current) unregister(prevName.current);
    };
  }, [name, register, unregister]);

  return innerRef;
}

/* ========= Wrapper tiap komponen ========= */

Form.Input = forwardRef<InputRef, any>((props, forwardedRef) => {
  const innerRef = useFieldRegistration<InputRef | null>(props.name);

  // forward proxy ke parent luar (optional)
  useImperativeHandle(forwardedRef, () => ({
    validate: () => innerRef.current?.validate?.() ?? true,
    getValue: () => innerRef.current?.getValue?.(),
    focus: () => innerRef.current?.focus?.(),
    current: innerRef.current?.current ?? null,
    setValue: (v: any) => innerRef.current?.setValue?.(v),
  }));

  return <Input ref={innerRef} {...props} />;
});

Form.RadioButton = forwardRef<RadioButtonRef, any>((props, forwardedRef) => {
  const innerRef = useFieldRegistration<RadioButtonRef | null>(props.name);

  useImperativeHandle(forwardedRef, () => ({
    validate: () => innerRef.current?.validate?.() ?? true,
    getValue: () => innerRef.current?.getValue?.(),
    focus: () => innerRef.current?.focus?.(),
    current: innerRef.current?.current ?? null,
    setValue: (v: any) => innerRef.current?.setValue?.(v),
  }));

  // tidak override onChange; tetap teruskan props.onChange ke komponen
  return <RadioButton ref={innerRef} {...props} />;
});

Form.Select = forwardRef<SelectRef, any>((props, forwardedRef) => {
  const innerRef = useFieldRegistration<SelectRef | null>(props.name);

  useImperativeHandle(forwardedRef, () => ({
    validate: () => innerRef.current?.validate?.() ?? true,
    getValue: () => innerRef.current?.getValue?.(),
    // focus: () => innerRef.current?.focus?.(),
    current: innerRef.current?.current ?? null,
    setValue: (v: any) => innerRef.current?.setValue?.(v),
  }));

  return <Select ref={innerRef} {...props} />;
});

Form.InputNumber = forwardRef<InputNumberRef, any>((props, forwardedRef) => {
  const innerRef = useFieldRegistration<InputNumberRef | null>(props.name);

  useImperativeHandle(forwardedRef, () => ({
    validate: () => innerRef.current?.validate?.() ?? true,
    getValue: () => innerRef.current?.getValue?.(),
    focus: () => innerRef.current?.focus?.(),
    current: innerRef.current?.current ?? null,
    setValue: (v: any) => innerRef.current?.setValue?.(v),
  }));

  return <InputNumber ref={innerRef} {...props} />;
});

Form.CounterButton = forwardRef<CounterButtonRef, any>((props, forwardedRef) => {
  const innerRef = useFieldRegistration<CounterButtonRef | null>(props.name);

  useImperativeHandle(forwardedRef, () => ({
    validate: () => innerRef.current?.validate?.() ?? true,
    getValue: () => innerRef.current?.getValue?.(),
    focus: () => innerRef.current?.focus?.(),
    current: innerRef.current?.current ?? null,
    setValue: (v: any) => innerRef.current?.setValue?.(v),
  }));

  return <CounterButton ref={innerRef} {...props} />;
});

Form.TextArea = forwardRef<TextAreaRef, any>((props, forwardedRef) => {
  const innerRef = useFieldRegistration<TextAreaRef | null>(props.name);

  useImperativeHandle(forwardedRef, () => ({
    validate: () => innerRef.current?.validate?.() ?? true,
    getValue: () => innerRef.current?.getValue?.(),
    focus: () => innerRef.current?.focus?.(),
    current: innerRef.current?.current ?? null,
    setValue: (v: any) => innerRef.current?.setValue?.(v),
  }));

  return <TextArea ref={innerRef} {...props} />;
});

Form.DatePicker = forwardRef<DatePickerRef, any>((props, forwardedRef) => {
  const innerRef = useFieldRegistration<DatePickerRef | null>(props.name);

  useImperativeHandle(forwardedRef, () => ({
    validate: () => innerRef.current?.validate?.() ?? true,
    getValue: () => innerRef.current?.getValue?.(),
    focus: () => innerRef.current?.focus?.(),
    current: innerRef.current?.current ?? null,
    setValue: (v: any) => innerRef.current?.setValue?.(v),
  }));

  return <CustomDatePicker ref={innerRef} {...props} />;
});

Form.Switch = forwardRef<SwitchRef, any>((props, forwardedRef) => {
  const innerRef = useFieldRegistration<SwitchRef | null>(props.name);

  useImperativeHandle(forwardedRef, () => ({
    validate: () => innerRef.current?.validate?.() ?? true,
    getValue: () => innerRef.current?.getValue?.(),
    focus: () => innerRef.current?.focus?.(),
    current: innerRef.current?.current ?? null,
    setValue: (v: any) => innerRef.current?.setValue?.(v),
  }));

  return <Switch ref={innerRef} {...props} />;
});

Form.ButtonSubmit = function ButtonSubmit({
  children,
  className,
}: {
  children?: ReactNode;
  className?: string;
}) {
  return (
    <Button type="submit" className={className}>
      {children || 'Simpan'}
    </Button>
  );
};

export default Form as unknown as typeof Form & {
  Input: typeof Form.Input;
  RadioButton: typeof Form.RadioButton;
  Select: typeof Form.Select;
  InputNumber: typeof Form.InputNumber;
  CounterButton: typeof Form.CounterButton;
  DatePicker: typeof Form.DatePicker;
  Switch: typeof Form.Switch;
  ButtonSubmit: typeof Form.ButtonSubmit;
};
