import Card from "../primitive/card/Card";
import InputFile from "../primitive/input-file/InputFile";
import Input from "../primitive/input/Input";
import TextArea from "../primitive/textarea/TextArea";
import { WizardNavigation } from "../primitive/wizard/Wizard";

export default function OnboardingCompany() {
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
            <Input 
              label="Nama Perusahaan *"
              placeholder="Misal : PT. HealApp Indonesia / HealApp"
              name="companyName"
              onChange={(e) => console.log(e.target.value)}
              rules={ {
                required: { message: "Wajib diisi" },
                min: { value: 3, message: "Minimal 4 karakter" },
              }}
              hasError={false}
              // feedback="Nama perusahaan tidak boleh kosong"
            />
            <Input 
              label="Nomor Telepon Perusahaan *"
              placeholder="Misal : +62 812-3456-7890"
              name="companyPhone"
              onChange={(e) => console.log(e.target.value)}
              rules={ {
                required: { message: "Wajib diisi" },
                min: { value: 3, message: "Minimal 4 karakter" },
                phone: { message: "Harus berupa nomor telepon yang valid, Misal : 6289604038338" },
              }}
              // feedback="Nomor telepon tidak valid"
            />
            <TextArea 
              label="Alamat Perusahaan *"
              placeholder="Misal : Jl. Contoh No. 123, Jakarta"
              name="companyAddress"
              onChange={(e) => console.log(e.target.value)}
              rules={ {
                required: { message: "Wajib diisi" },
                min: { value: 3, message: "Minimal 4 karakter" },
              }}
              hasError={false}
              // feedback="Alamat perusahaan tidak boleh kosong"
            />
            <InputFile 
              hint={"Input file untuk logo perusahaan. Kosongkan jika tidak ada. ini digunakan untuk menampilkan logo perusahaan pada invoice dan dokumen lainnya."}
              label={"Logo Perusahaan"}
            />
          </div>
          <WizardNavigation />
        </Card>
        {/* Form input for company information can be added here */}
      </div>
    </div>
  );
} 