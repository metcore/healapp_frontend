import { useState, useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import Input, { InputRef } from "../input/Input";
import LabelInput from "../label-input/LabelInput";
import Select, { SelectRef } from "../select/Select";

export type InputDateRef = {
  validate: () => boolean;
  getValue: () => { year: number | null; month: number | null; day: number | null };
};

type Props = {
  label?: string;
  hint?: string;
  onChange?: (date: { year: number | null; month: number | null; day: number | null }) => void;
  rules?: any;
};

const InputDate = forwardRef<InputDateRef, Props>(({ label, hint, onChange, rules }, ref) => {
  const [year, setYear] = useState<number | null>(null);
  const [month, setMonth] = useState<number | null>(null);
  const [day, setDay] = useState<number | null>(null);
  const [daysInMonth, setDaysInMonth] = useState<number[]>([]);
  const [age, setAge] = useState<number | null>(null);

  const inputYearRef = useRef<SelectRef>(null);
  const inputMonthRef = useRef<SelectRef>(null);
  const inputDateRef = useRef<SelectRef>(null);

  // Expose ke parent
  useImperativeHandle(ref, () => ({
    validate: () => {
      const validYear = inputYearRef.current?.validate?.() ?? false;
      const validMonth = inputMonthRef.current?.validate?.() ?? false;
      const validDay = inputDateRef.current?.validate?.() ?? false;
      return validYear && validMonth && validDay;
    },
    getValue: () => ({ year, month, day }),
  }));

  useEffect(() => {
    if (year && month) {
      const totalDays = new Date(year, month, 0).getDate();
      setDaysInMonth(Array.from({ length: totalDays }, (_, i) => i + 1));

      if (day && day > totalDays) {
        setDay(null);
      }
    } else {
      setDaysInMonth([]);
    }
  }, [year, month]);

  useEffect(() => {
    if (year && month && day) {
      const birth = new Date(year, month - 1, day);
      const today = new Date();
      let ageCalc = today.getFullYear() - birth.getFullYear();
      const m = today.getMonth() - birth.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
        ageCalc--;
      }
      setAge(ageCalc);

      onChange?.({ year, month, day });
    }
  }, [year, month, day]);

  return (
    <div className="row">
      <div className="col-md-12">
        <div className="row">
          <LabelInput label={label ?? "Tanggal Lahir"} hint={hint} />
          <div className="col-md-3">
            <Select
              ref={inputYearRef}
              placeholder="Pilih Tahun"
              options={Array.from({ length: 80 }, (_, i) => {
                const y = 2025 - i;
                return { label: y, value: y };
              })}
              rules={rules}
              onChange={(opt) => setYear(opt?.value ?? null)}
            />
          </div>
          <div className="col-md-4">
            <Select
              isSearchable
              ref={inputMonthRef}
              placeholder="Pilih Bulan"
              options={[
                { label: "Januari", value: 1 },
                { label: "Februari", value: 2 },
                { label: "Maret", value: 3 },
                { label: "April", value: 4 },
                { label: "Mei", value: 5 },
                { label: "Juni", value: 6 },
                { label: "Juli", value: 7 },
                { label: "Agustus", value: 8 },
                { label: "September", value: 9 },
                { label: "Oktober", value: 10 },
                { label: "November", value: 11 },
                { label: "Desember", value: 12 },
              ]}
              rules={rules}
              onChange={(opt) => setMonth(opt?.value ?? null)}
            />
          </div>
          <div className="col-md-3">
            <Select
              placeholder="Pilih Tanggal"
              options={daysInMonth.map((d) => ({ label: String(d), value: d }))}
              ref={inputDateRef}
              value={day ? { label: String(day), value: day } : null}
              onChange={(opt) => setDay(opt?.value ?? null)}
              isDisabled={!year || !month}
              rules={rules}
            />
          </div>
          <div className="col-md-2">
            <Input
              disabled
              size="sm"
              icon="fluent:globe-20-regular"
              value={age ?? ""}
            />
          </div>
        </div>
      </div>
    </div>
  );
});

InputDate.displayName = "InputDate";
export default InputDate;
