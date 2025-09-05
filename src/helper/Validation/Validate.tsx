// Define the result of a single rule validation
export type ValidationResult = {
  rule: string;
  valid: boolean;
  error?: string;
};

// Define the function signature for a validation rule
export type RuleHandler = (value: string, config: any) => ValidationResult;

// Optional: Rule config types for stronger typing (can be expanded later)
export interface RuleConfigMap {
  required?: { message?: string };
  requiredIf?: {condition: string | boolean; message?: string };
  email?: { message?: string };
  min?: { value: number; message?: string };
  max?: { value: number; message?: string };
  booleanTrue?: { value?: boolean; message?: string };
  phone?: { message?: string };
  match?: { value: string; message?: string };
}

// Final return type of validation function
export type ValidateOutput =  ValidationResult[];

// Rule handler implementations
const ruleHandlers: Record<string, RuleHandler> = {
  required: (value, config) => {
    const message = config?.message || "Field wajib diisi";
    const valid = !(value === undefined || value === null || value?.trim?.() === "");
    return { rule: "required", valid, error: valid ? undefined : message };
  },
  requiredIf: (value, config) => {
    const { condition, message } = config || {};
    const isRequired = typeof condition === "function" ? condition() : !!condition;

    const valid =
      !isRequired || (value !== undefined && value !== null && value?.trim?.() !== "");

    return {
      rule: "requiredIf",
      valid,
      error: valid ? undefined : (message || "Field wajib diisi"),
    };
  },
  email: (value, config) => {
    const message = config?.message || "Format email tidak valid";
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const valid = regex.test(value);
    return { rule: "email", valid, error: valid ? undefined : message };
  },
  min: (value, config) => {

    const minValue = config?.value;
    let valid = true;

    if (!isNaN(Number(value))) {
      valid = Number(value) >= minValue;
    } else {
      valid = value?.length >= minValue;
    }
    const message = config?.message || `Minimal ${minValue}${isNaN(Number(value)) ? " karakter" : ""}`;
    return { rule: "min", valid, error: valid ? undefined : message };
  },
  max: (value, config) => {
    const message = config?.message || `Maksimal ${config.value} karakter`;
    const valid = value.length <= config?.value;
    return { rule: "max", valid, error: valid ? undefined : message };
  },
  booleanTrue: (value, config) => {
    const message = config?.message || "Wajib disetujui";
    const valid = value === true || value === "true" || value === "1" || value === 1;
    return { rule: "booleanTrue", valid, error: valid ? undefined : message };
  },
  phone: (value, config) => {
    const message = config?.message || "Nomor telepon tidak valid";
    const regex = /^(\+62|62|0)8[1-9][0-9]{6,10}$/; // Format Indonesia: +628xxxxxxxxx, 08xxxxxxxxxx, dst
    const valid = regex.test(value);
    return { rule: "phone", valid, error: valid ? undefined : message };
  },
  match: (value, config) => {
    const message = config?.message || "Nilai tidak cocok";
    const valid = value === config?.value;
    return { rule: "match", valid, error: valid ? undefined : message };
  },
};

// Main validation function
export function validate(
  value: string | number | Date | null | boolean,
  rules: RuleConfigMap
): ValidateOutput {
  const results: ValidationResult[] = [];

  for (const rule in rules) {
    const config = rules[rule as keyof RuleConfigMap];
    const handler = ruleHandlers[rule];
    if (handler && config) {
      const result = handler(value, config);
      if (!result.valid) {
        results.push(result);
      }
    }
  }

  return results.length > 0 ? results : [];
}
