import { useState } from "react";
import { ButtonGroup as ButtonGroupBootstrap } from "react-bootstrap";
import Button from "./Button";
import LabelInput from "../label-input/LabelInput";
import { SelectOptionProps } from "../select/Select";

export type ButtonGroupType = {
  options : SelectOptionProps[];
  onClick?: () => void;
  label?: string;
  hint?: string;
}
export default function ButtonGroup({ options = [], onClick , label, hint}:ButtonGroupType) {
  const [selected, setSelected] = useState(null);

  const handleSelect = (value) => {
    setSelected(value);
    if (onClick) {
      onClick(value); // lempar ke parent
    }
  };

  return (
    <div className="d-flex flex-column ">
      <LabelInput label={label} hint={hint} />
      {hint && <p className="text-sm mb-0 text-secondary-light">{hint}</p>}
      <ButtonGroupBootstrap size="sm">
        {options.map((opt, idx) => (
          <Button
            key={idx}
            variant={selected === opt.value ? "primary" : "outline-secondary"}
            onClick={() => handleSelect(opt.value)}
          >
            {opt.label}
          </Button>
        ))}
      </ButtonGroupBootstrap>
    </div>
  );
}
