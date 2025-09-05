import Card from "../primitive/card/Card";
import Input from "../primitive/input/Input";
import TextArea from "../primitive/textarea/TextArea";

export default function OnboardingCompany() {
  return (
    <div className="row justify-content-center">
      <div className="col-xxl-10">
        <div className="text-center">
          <h4 className="mb-16">Pengaturan Pajak</h4>
          <p className="mb-0 text-lg text-secondary-light">
            Sesuaikan pengaturan pajak Anda dengan bisnis Anda.
          </p>
        </div>
        <Card>
          <div className="d-flex flex-column gap-24">
            <Input 
              label="Nomor NPWP "
              placeholder="Masukkan Nomor Pokok Wajib Pajak"
              hint="Kosongkan jika tidak ada NPWP"
              name="npwp"
              onChange={(e) => console.log(e.target.value)}
              rules={{ required: true, pattern: /^\d{15}$/ }}
              hasError={false}
              // feedback="Nomor NPWP tidak valid"
            />
            <Input 
              label="Pajak Pertambahan Nilai (PPN)"
              placeholder="Msal: 12%"
              name="ppn"
              onChange={(e) => console.log(e.target.value)}
              rules={{ required: true, pattern: /^\d+(\.\d{1,2})?$/ }}
              hasError={false}
              // feedback="Persentase PPN tidak valid"
            />
            <TextArea 
              label="Keterangan Pajak"
              placeholder="Masukkan keterangan tambahan mengenai pajak"
              name="taxDescription"
              onChange={(e) => console.log(e.target.value)}
              rules={{ required: false }}
              hasError={false}                 
              onChange={(e) => console.log(e.target.value)}
              rules={{ required: true, pattern: /^\d+$/ }}
              hasError={false}
              // feedback="Nomor telepon tidak valid"
            />
            <button type="submit" className="btn btn-primary w-100">Lanjutkan</button>

          </div>
        </Card>
        {/* Form input for company information can be added here */}
      </div>
    </div>
  );
} 