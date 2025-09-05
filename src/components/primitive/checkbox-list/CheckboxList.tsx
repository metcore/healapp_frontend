import React from 'react';
import Checkbox from '../checkbox/Checkbox';

interface CheckBoxListItem {
  label: string;
  value: string;
}

interface CheckBoxListProps {
  items: CheckBoxListItem[];
  onChange: (selected: string[]) => void;
  direction?: 'vertical' | 'horizontal';
  name:string;
}

const CheckBoxList: React.FC<CheckBoxListProps> = ({
  selectedValues,
  name,
  onChange,
  direction = 'vertical',
  options,
}) => {
  return (
    <div
    >
      {options?.map((item, index) => (
        <Checkbox
          key={index}
          name={name}
          value={item.value}
          label={item.label}
        />
      ))}

    </div>
  );
};

export default CheckBoxList;