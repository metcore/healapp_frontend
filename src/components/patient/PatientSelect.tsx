'use client'
import  {components} from 'react-select';
import PatientHeaderName from './PatientHeaderName';
import Select from '../primitive/select/Select';
import { DATA_PATIENTS } from './DATA';
import PatientModalForm from './PatientModalForm';
import { useState } from 'react';

export default function PatientSelect({label= "Pilih pasien", appendButton=false, placeholder}) {
  
  const [isOpenModalNewPatient, setIsOpenModalNewPatient]  = useState(false);
  const renderOption = (props) => {
    const { name, email, mobile } = props.data;
    return(
      <components.Option{...props}>
        <PatientHeaderName 
          name={name}
          email={email}
          mobile={mobile}
        />
      </components.Option>
    )
  }

  return (
    <div>
      <Select
        label={label}
        options={DATA_PATIENTS}
        components={{Option: renderOption}}
        placeholder={placeholder}
        appendButton={appendButton? {
          label: "Tambah Pasien Baru",
          size: "sm",
          onClick: () => setIsOpenModalNewPatient(true)
        } : false}
      />
      <PatientModalForm  isOpen={isOpenModalNewPatient} onHide={() => setIsOpenModalNewPatient(false)} />
    </div>

  )

}