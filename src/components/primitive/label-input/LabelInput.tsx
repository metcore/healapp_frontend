'use client'
import { RuleConfigMap } from "@/helper/Validation/Validate";
import { useEffect, useState } from "react";

type LabelInputProps = {
  label: string;
  hint?: string;
  rules?: RuleConfigMap;
}
export default function LabelInput({label, hint, rules}:LabelInputProps) {
  const [isRequired, setIsRequired] = useState<boolean>(false);
  useEffect(()=>{
    if(rules?.required){
      setIsRequired(true)
    }
  },[])
  return (
    <>
      <label className={`form-label text-primary-light fw-medium ${hint && "mb-0"}`}>
        {label}
        {isRequired ? (
          <span className="text-danger">*</span>
        ): ""}
      </label>
    </>
  )
}