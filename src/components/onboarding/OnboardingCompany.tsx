import Card from "../primitive/card/Card";
import Form from "../primitive/form/Form";
import InputFile from "../primitive/input-file/InputFile";
import Input from "../primitive/input/Input";
import TextArea from "../primitive/textarea/TextArea";
import { WizardNavigation } from "../primitive/wizard/Wizard";

export default function OnboardingCompany({
  data,
  inputCompanyBrandNameRef,
  inputCompanyLegalNameRef,
  inputCompanyPhoneRef,
  inputCompanyAddressRef,
  inputCompanyEmailRef
}) {
  return (
    <div className="row justify-content-center">
      <div className="col-xxl-10">
        <div className="text-center">
          <h4 className="mb-16">Informasi Perusahaan</h4>
          <p className="mb-0 text-lg text-secondary-light">
            Berikan informasi perusahaan Anda untuk melanjutkan proses onboarding.
          </p>
        </div>
        <Card>
          <div className="d-flex flex-column gap-24">
            <Form.Input 
              label="Nama Brand"
              value={data?.company?.Name}
              placeholder="Misal : RS Heal App"
              name="companyBrandName"
              ref={inputCompanyBrandNameRef}
              rules={ {
                required: { message: "Wajib diisi" },
                min: { value: 3, message: "Minimal 4 karakter" },
              }}
            />
            <Form.Input 
              label="Nama Perusahaan"
              value={data?.company?.LegalName}
              placeholder="Misal : PT. HealApp Indonesia / HealApp"
              name="companyLegalName"
              ref={inputCompanyLegalNameRef}
              // rules={ {
              //   required: { message: "Wajib diisi" },
              //   min: { value: 3, message: "Minimal 4 karakter" },
              // }}
            />
            <Form.Input 
              label="Email"
              placeholder="Misal : RS Heal App"
              value={data?.company?.Email}
              icon="mdi:email"
              name="companyEmail"
              ref={inputCompanyEmailRef}
              rules={ {
                required: { message: "Wajib diisi" },
                min: { value: 3, message: "Minimal 4 karakter" },
                email: { message: "Format harus email" },
              }}
            />
            <Form.Input 
              label="Nomor Telepon Perusahaan "
              icon="mdi:phone"
              placeholder="Misal : +62 812-3456-7890"
              name="companyPhone"
              ref={inputCompanyPhoneRef}
              value={data?.company?.Phone}
              rules={ {
                required: { message: "Wajib diisi" },
                min: { value: 3, message: "Minimal 4 karakter" },
                phone: { message: "Harus berupa nomor telepon yang valid, Misal : 6289604038338" },
              }}
            />
            <TextArea 
              label="Alamat Perusahaan "
              placeholder="Misal : Jl. Contoh No. 123, Jakarta"
              name="companyAddress"
              onChange={(e) => console.log(e.target.value)}
              value={data?.company?.Address}
              rules={ {
                required: { message: "Wajib diisi" },
                min: { value: 3, message: "Minimal 4 karakter" },
              }}
              ref={inputCompanyAddressRef}
              hasError={false}
              // feedback="Alamat perusahaan tidak boleh kosong"
            />
            <InputFile 
              hint={"Input file untuk logo perusahaan. Kosongkan jika tidak ada. ini digunakan untuk menampilkan logo perusahaan pada invoice dan dokumen lainnya."}
              label={"Logo "}
            />
          </div>
          <WizardNavigation />
        </Card>
        {/* Form input for company information can be added here */}
      </div>
    </div>
  );
} 