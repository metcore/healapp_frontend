// validators.ts
export type ValidationResult = {
  valid: boolean;
  error?: string;
};

export type Validator = (value: string) => ValidationResult;

export function required(message = "Harus diisi"): Validator {
  return (value: string) => {
    const isValid = value?.trim() !== "";
    return {
      valid: isValid,
      error: isValid ? undefined : message,
    };
  };
}

export function email(message = "Email tidak valid"): Validator {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return (value: string) => {
    const isValid = regex.test(value);
    return {
      valid: isValid,
      error: isValid ? undefined : message,
    };
  };
}

export function min(length: number, message?: string): Validator {
  return (value: string) => {
    const isValid = value.length >= length;
    return {
      valid: isValid,
      error: isValid ? undefined : message || `Minimal ${length} karakter`,
    };
  };
}

export function max(length: number, message?: string): Validator {
  return (value: string) => {
    const isValid = value.length <= length;
    return {
      valid: isValid,
      error: isValid ? undefined : message || `Maksimal ${length} karakter`,
    };
  };
}
