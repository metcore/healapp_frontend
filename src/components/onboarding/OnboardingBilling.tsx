import Card from "../primitive/card/Card";
import Input from "../primitive/input/Input";
import TextArea from "../primitive/textarea/TextArea";

export default function OnboardingBilling(){
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
              <Input 
                label="Nama Penagihan *"
                placeholder="Masukkan nama penagihan"
                name="companyName"
                onChange={(e) => console.log(e.target.value)}
                rules={{ required: true }}
                hasError={false}
                // feedback="Nama perusahaan tidak boleh kosong"
              />
              <Input 
                label="Email Penagihan *"
                placeholder="Masukkan email penagihan"
                name="companyPhone"
                onChange={(e) => console.log(e.target.value)}
                rules={{ required: true, pattern: /^\d+$/ }}
                hasError={false}
                // feedback="Nomor telepon tidak valid"
              />

              <Input 
                label="Nomor Telepon Penagihan *"
                placeholder="Misal : +62 812-3456-7890"
                name="companyPhone"
                onChange={(e) => console.log(e.target.value)}
                rules={{ required: true, pattern: /^\d+$/ }}
                hasError={false}
                // feedback="Nomor telepon tidak valid"
              />
              <TextArea 
                label="Alamat Penagihan *"
                placeholder="Misal : Jl. Contoh No. 123, Jakarta"
                name="companyAddress"
                onChange={(e) => console.log(e.target.value)}
                rules={{ required: true }}
                hasError={false}
                // feedback="Alamat perusahaan tidak boleh kosong"
              />
              <button type="submit" className="btn btn-primary w-100">Lanjutkan</button>

            </div>
          </Card>
          {/* Form input for company information can be added here */}
        </div>
      </div>
    )
}