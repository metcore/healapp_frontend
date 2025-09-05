import LabelInput from "../label-input/LabelInput";
import CreatableSelectPlugin from "react-select/creatable";
import { SelectOptionProps } from "./Select";
import { RuleConfigMap } from "@/helper/Validation/Validate";

export type CreatableSelectType = {
  label?: string;
  options: SelectOptionProps[];
  isMulti?: boolean;
  rules?: RuleConfigMap;
}
export default function CreatableSelect({ label, options, isMulti, rules } : CreatableSelectType) {
  return (
    <div>
      <LabelInput label={label}  rules={rules}/>
      <CreatableSelectPlugin 
        options={options}
        isClearable
        isSearchable  
        isMulti={isMulti}
      />
    </div>
  );
}