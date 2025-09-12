import Card from "../primitive/card/Card";
import Form from "../primitive/form/Form";
import Input from "../primitive/input/Input";
import TextArea from "../primitive/textarea/TextArea";
import { WizardNavigation } from "../primitive/wizard/Wizard";

export default function OnboardingBilling({
  inputBillingNameRef,
  inputBillingPhoneRef,
  inputBillingEmailRef,
  inputBillingAddressRef
}){
    return (
  
      <div className="row justify-content-center">
        <div className="col-xxl-10">
          <div className="text-center">
            <h4 className="mb-16">Informasi Penagihan</h4>
            <p className="mb-0 text-lg text-secondary-light">
              Kami akan mengirim tagihan ke alamat email dan nomor telepon yang Anda berikan. Pastikan informasi ini akurat.
            </p>
          </div>
          <Card>
            <div className="d-flex flex-column gap-24">
              <Form.Input 
                label="Nama Penagihan"
                placeholder="Masukkan nama penagihan"
                name="billing_name"
                onChange={(e) => console.log(e.target.value)}
                rules={ {
                  required: { message: "Wajib diisi" },
                  min: { value: 3, message: "Minimal 4 karakter" },
                }}
                ref={inputBillingNameRef}
              />
              <Form.Input 
                label="Email Penagihan"
                placeholder="Masukkan email penagihan"
                name="billing_email"
                icon="mdi:email"
                onChange={(e) => console.log(e.target.value)}
                ref={inputBillingEmailRef}
                rules={ {
                  required: { message: "Wajib diisi" },
                  min: { value: 3, message: "Minimal 4 karakter" },
                  email: { message: "Harus berupa format email, Misal : metcore@gtmail.com" },
                }}
              />
              <Form.Input 
                label="Nomor Telepon Penagihan"
                placeholder="Misal : +62 812-3456-7890"
                name="billing_phone"
                icon="mdi:phone"
                onChange={(e) => console.log(e.target.value)}
                rules={ {
                  required: { message: "Wajib diisi" },
                  min: { value: 3, message: "Minimal 4 karakter" },
                  phone: { message: "Harus berupa nomor telepon yang valid, Misal : 6289604038338" },
                }}
                ref={inputBillingAddressRef}
                // feedback="Nomor telepon tidak valid"
              />
              <Form.TextArea 
                label="Alamat Penagihan "
                placeholder="Misal : Jl. Contoh No. 123, Jakarta"
                name="billing_address"
                onChange={(e) => console.log(e.target.value)}
                rules={{
                  required: { message: "Wajib diisi" },
                  min: { value: 3, message: "Minimal 4 karakter" },
                }}
                ref={inputBillingPhoneRef}
                // feedback="Alamat perusahaan tidak boleh kosong"
              />
              <WizardNavigation />

            </div>
          </Card>
          {/* Form input for company information can be added here */}
        </div>
      </div>
    )
}