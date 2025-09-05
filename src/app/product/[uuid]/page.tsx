import Breadcrumb from "@/components/Breadcrumb";
import Card from "@/components/primitive/card/Card";
import Input from "@/components/primitive/input/Input";
import Select from "@/components/primitive/select/Select";
import MasterLayout from "@/masterLayout/MasterLayout";

const optionCategories = [
  { value: 'chocolate', label: 'Chocolate' },
  { value: 'strawberry', label: 'Strawberry' },
  { value: 'vanilla', label: 'Vanilla' }
]
export default function page() {
  return (
    <MasterLayout>
      <Breadcrumb title='Buat Produk' />
      <Card>
        
        <div className="row gy-3">
          <div className="col-sm-6">
            <div className="row gy-3">
              <div className="col-12">
                <Card
                  renderHeader={
                    <h6 className="text-md fw-medium mb-0">Deskripsi</h6>
                  }
                >
                  <div className="row gy-3">
                    <div className="col-12">
                      <label className="form-label">Nama Produk</label>
                      <input
                          type="text"
                          name="#0"
                          className="form-control"
                          placeholder="info@gmail.com"
                      />
                    </div>
                    <div className='col-12'>
                      <label className='form-label'>Ketertangan produk</label>
                      <textarea
                        name='#0'
                        className='form-control'
                        rows={4}
                        cols={50}
                        placeholder='Enter a description...'
                        defaultValue={""}
                      />
                    </div>
                  </div>
                </Card>
              </div>
              <div className="col-12">
                <Card
                  renderHeader={
                    <h6 className="text-md fw-medium mb-0">Kategori</h6>
                  }
                >
                  <div className="row gy-3">
                    <div className="col-12">
                      <Select options={optionCategories} label={"Kategori"} />
                    </div>
                    <div className='col-12'>
                      <Select options={optionCategories} label={"Tag"} />
                    </div>
                  </div>
                </Card>
              </div>
              <div className="col-12">
                <Card
                  renderHeader={
                    <h6 className="text-md fw-medium mb-0">Harga & Stok</h6>
                  }
                >
                  <div className="row gy-3">
                    <div className="col-6">
                      <Input label="Harga" placeholder="Masukan harga" />
                    </div>
                    <div className='col-6'>
                      <Input label="Stok" placeholder="Masukan stok awal" />
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
          <div className="col-sm-6">
            <Card
              renderHeader={
                <h6 className="text-md fw-medium mb-0">Gambar Produk</h6>
              }
            >
              
            </Card>
          </div>
        </div>
      </Card>
    </MasterLayout>
  )
}