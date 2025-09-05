import Card from "../primitive/card/Card";
import CustomDatePicker from "../primitive/date-picker/DatePicker";
import Input from "../primitive/input/Input";
import LabelInput from "../primitive/label-input/LabelInput";
import RadioButton from "../primitive/radio-button/RadioButton";

export default function CommissionInformationForm(){
  return(
  
    <Card
      renderHeader={
        <div className="d-flex justify-content-between">
          <div>
          <h6 className="text-md fw-medium mb-0">Informasi Umum</h6>
          <p className="mb-0">
            Informasi umum terkait dengan komisi
          </p>
          </div>
        </div>
      }
    >
      <div className="d-flex flex-column gap-2">
        <Input
          label="Label"
          icon="mdi:label"
          placeholder="Mis : Komisi dokkter 2%"
        />
        <div className="row">
          <div className="col">
            <RadioButton 
              label="Perhitungan omset"
              options={[
                {value:"gross", label:"Gross"},
                {value:"nett", label:"Nett"},
              ]}
            />
          </div>
          <div className="col">
            <RadioButton 
              label="Jenis Item"
              options={[
                {value:"gross", label:"Product"},
                {value:"nett", label:"Treatment"},
              ]}
            />
            </div>
        </div>
        <div>
          <LabelInput label="Periode efektif" hint={true} />
          <p className="text-sm mb-0 text-secondary-light">Kosongkan jika tidak menerapkan tanggal mulai dan akhir</p>
          <div className="row">
            <div className="col">
              <CustomDatePicker placeholder="Tanggal Mulai" />
              <CustomDatePicker placeholder="Tanggal Selesai" />
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}