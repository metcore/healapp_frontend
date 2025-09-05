
import PatientListLayer from "@/components/patient/PatientListLayer";
import PatientVitalHistory from "@/components/patient/PatientVitalHistory";
import Card from "@/components/primitive/card/Card";
import EmergencyContactList from "@/components/patient/EmergencyContactList";

import { Icon } from "@iconify/react";
import PatientHeader from "./PatientHeader";
export default function PatientDetailLayer() {
  
  const renderHeader = () => (
    <>
      <h6 className='text-lg mb-0'>Hi, Will Mart</h6>
      <button type='button' className='text-xl line-height-1'>
        <Icon icon='mdi:times' className='text-xl' />
      </button>
    </>
  );

  return(
    <div>
      <Card>
        <>
          <PatientHeader 
            name="Slamet Riyadi"
            email="metcore2@gmail.com"
            note="Memiliki alergi kuning"
            totalTransaction={200}
            lastTransaction="2024-12-12"
          />
          <ul
              className="nav bordered-tab border border-top-0 border-start-0 border-end-0 d-inline-flex nav-pills mb-16"
              id="pills-tab"
              role="tablist"
          >
            <li className="nav-item" role="presentation">
              <button
                className="nav-link px-16 py-10 active"
                id="pills-general-information-tab"
                data-bs-toggle="pill"
                data-bs-target="#pills-general-information"
                type="button"
                role="tab"
                aria-controls="pills-general-information"
                aria-selected="true"
              >
                Informasi Umum
              </button>
            </li>
            <li className="nav-item" role="presentation">
              <button
                className="nav-link px-16 py-10 "
                id="pills-alergies"
                data-bs-toggle="pill"
                data-bs-target="#pills-alergies"
                type="button"
                role="tab"
                aria-controls="pills-alergies"
                aria-selected="true"
              >
                Alergi
              </button>
            </li>
            <li className="nav-item" role="presentation">
              <button
                className="nav-link px-16 py-10"
                id="pills-vital-tab"
                data-bs-toggle="pill"
                data-bs-target="#pills-vital"
                type="button"
                role="tab"
                aria-controls="pills-vital"
                aria-selected="false"
              >
                Vital
              </button>
            </li>
            <li className="nav-item" role="presentation">
              <button
                className="nav-link px-16 py-10"
                id="pills-emergency-contact-tab"
                data-bs-toggle="pill"
                data-bs-target="#pills-emergency-contact"
                type="button"
                role="tab"
                aria-controls="pills-emergency-contact"
                aria-selected="false"
              >
                Kontak Darurat
              </button>
            </li>
            <li className="nav-item" role="presentation">
              <button
                className="nav-link px-16 py-10"
                id="pills-transaction-tab"
                data-bs-toggle="pill"
                data-bs-target="#pills-transaction"
                type="button"
                role="tab"
                aria-controls="pills-transaction"
                aria-selected="false"
              >
                Transaksi
              </button>
            </li>
          </ul>
          <div className="tab-content" id="pills-tabContent">
            <div
              className="tab-pane fade show active"
              id="pills-general-information"
              role="tabpanel"
              aria-labelledby="pills-home-tab"
              tabIndex={0}
            >
              <div>
                <Card>  
                  <div className="">
                    <div className="row gy-3">
                      <div className="col-sm-6">
                        <div className="d-flex align-items-center gap-2">
                          <div>
                            <h6 className="text-md mb-2 fw-semibold">Nama Lengkap</h6>
                            <span className="text-md text-secondary-light fw-small">Slamet Riyadi</span>
                          </div>
                        </div>
                      </div>
                      <div className="col-sm-6">
                        <div className="d-flex align-items-center gap-2">
                          <div>
                            <h6 className="text-md mb-2 fw-semibold">Phone Number</h6>
                            <span className="text-md text-secondary-light fw-small">6289604038338</span>
                          </div>
                        </div>
                      </div>
                      <div className="col-sm-6">
                        <div className="d-flex align-items-center gap-2">
                          <div>
                            <h6 className="text-md mb-2 fw-semibold">Tanggal Lahir</h6>
                            <span className="text-md text-secondary-light fw-small">14 Agustus 2025 (30 Tahun)</span>
                          </div>
                        </div>
                      </div>
                      <div className="col-sm-6">
                        <div className="d-flex align-items-center gap-2">
                          <div>
                            <h6 className="text-md mb-2 fw-semibold">Email</h6>
                            <span className="text-md text-secondary-light fw-small">Metcore2@gmail.com</span>
                          </div>
                        </div>
                      </div>
                      <div className="col-sm-6">
                        <div className="d-flex align-items-center gap-2">
                          <div>
                            <h6 className="text-md mb-2 fw-semibold">Agama</h6>
                            <span className="text-md text-secondary-light fw-small">Islam</span>
                          </div>
                        </div>
                      </div>
                      <div className="col-sm-6">
                        <div className="d-flex align-items-center gap-2">
                          <div>
                            <h6 className="text-md mb-2 fw-semibold">Address</h6>
                            <span className="text-md text-secondary-light fw-small">Jl Guru Saliin RT 004 / 05 No 59, Kelurahan Ulujami</span>
                          </div>
                        </div>
                      </div>
                      <div className="col-sm-6">
                        <div className="d-flex align-items-center gap-2">
                          <div>
                            <h6 className="text-md mb-2 fw-semibold">Golongan Darah</h6>
                            <span className="text-md text-secondary-light fw-small">B</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>

              </div>
            </div>
            <div
              className="tab-pane fade"
              id="pills-alergies"
              role="tabpanel"
              aria-labelledby="pills-alergies-tab"
            >
              <div className="d-flex flex-column gap-4">
                <Card>   
                  <h6 className="text-md fw-medium">Data Terakhir</h6>
                  <div className="">
                    <div className="row gy-3">
                      <div className="col-sm-3">
                        <Card>
                          <div className="d-flex gap-4">
                            <Icon icon='lets-icons:blood-light' fontSize={44}/>
                            <div>
                              <h6 className="text-md mb-2 fw-medium">Tekanan Darah</h6>
                              <span className="text-md text-secondary-light fw-small">165</span>
                            </div>
                          </div>
                        </Card>
                      </div>
                      <div className="col-sm-3">
                        <Card>
                          <div className="d-flex gap-4">
                            <Icon icon='material-symbols:ecg-heart-outline' fontSize={44}/>
                            <div>
                              <h6 className="text-md mb-2 fw-medium">Detak Jantung</h6>
                              <span className="text-md text-secondary-light fw-small">144</span>
                            </div>
                          </div>
                        </Card>
                      </div>
                      <div className="col-sm-3">
                        <Card>
                          <div className="d-flex gap-4">
                            <Icon icon='lets-icons:weight' fontSize={44}/>
                            <div>
                              <h6 className="text-md mb-2 fw-medium">Berat</h6>
                              <span className="text-md text-secondary-light fw-small">55 Kg</span>
                            </div>
                          </div>
                        </Card>
                      </div>
                      <div className="col-sm-3">
                      </div>
                      <div className="col-sm-3">
                        <Card>
                          <div className="d-flex gap-4">
                            <Icon icon='raphael:temp' fontSize={44}/>
                            <div>
                              <h6 className="text-md mb-2 fw-medium">Suhu</h6>
                              <span className="text-md text-secondary-light fw-small">Slamet Riyadi</span>
                            </div>
                          </div>
                        </Card>
                      </div>
                      <div className="col-sm-3">
                        <Card>
                          <div className="d-flex gap-4">
                            <Icon icon='material-symbols:height-rounded' fontSize={44}/>
                            <div>
                              <h6 className="text-md mb-2 fw-medium">Tinggi</h6>
                              <span className="text-md text-secondary-light fw-small">177 CM</span>
                            </div>
                          </div>
                        </Card>
                      </div>
                      <div className="col-sm-3">
                      </div>
                    </div>
                  </div>
                </Card>
                <Card>
                  <h6 className="text-md fw-medium"> Catatan Lainnya</h6>
                  <PatientVitalHistory />
                </Card>
              </div>
            </div>
            <div
              className="tab-pane fade"
              id="pills-vital"
              role="tabpanel"
              aria-labelledby="pills-vital-tab"
              tabIndex={0}
            >
              <div className="d-flex flex-column gap-4">
                <Card>   
                  <h6 className="text-md fw-medium">Data Terakhir</h6>
                  <div className="">
                    <div className="row gy-3">
                      <div className="col-sm-3">
                        <Card>
                          <div className="d-flex gap-4">
                            <Icon icon='lets-icons:blood-light' fontSize={44}/>
                            <div>
                              <h6 className="text-md mb-2 fw-medium">Tekanan Darah</h6>
                              <span className="text-md text-secondary-light fw-small">165</span>
                            </div>
                          </div>
                        </Card>
                      </div>
                      <div className="col-sm-3">
                        <Card>
                          <div className="d-flex gap-4">
                            <Icon icon='material-symbols:ecg-heart-outline' fontSize={44}/>
                            <div>
                              <h6 className="text-md mb-2 fw-medium">Detak Jantung</h6>
                              <span className="text-md text-secondary-light fw-small">144</span>
                            </div>
                          </div>
                        </Card>
                      </div>
                      <div className="col-sm-3">
                        <Card>
                          <div className="d-flex gap-4">
                            <Icon icon='lets-icons:weight' fontSize={44}/>
                            <div>
                              <h6 className="text-md mb-2 fw-medium">Berat</h6>
                              <span className="text-md text-secondary-light fw-small">55 Kg</span>
                            </div>
                          </div>
                        </Card>
                      </div>
                      <div className="col-sm-3">
                      </div>
                      <div className="col-sm-3">
                        <Card>
                          <div className="d-flex gap-4">
                            <Icon icon='raphael:temp' fontSize={44}/>
                            <div>
                              <h6 className="text-md mb-2 fw-medium">Suhu</h6>
                              <span className="text-md text-secondary-light fw-small">Slamet Riyadi</span>
                            </div>
                          </div>
                        </Card>
                      </div>
                      <div className="col-sm-3">
                        <Card>
                          <div className="d-flex gap-4">
                            <Icon icon='material-symbols:height-rounded' fontSize={44}/>
                            <div>
                              <h6 className="text-md mb-2 fw-medium">Tinggi</h6>
                              <span className="text-md text-secondary-light fw-small">177 CM</span>
                            </div>
                          </div>
                        </Card>
                      </div>
                      <div className="col-sm-3">
                      </div>
                    </div>
                  </div>
                </Card>
                <Card>
                  <h6 className="text-md fw-medium"> Catatan Lainnya</h6>
                  <PatientVitalHistory />
                </Card>
              </div>
            </div>
            <div
              className="tab-pane fade"
              id="pills-emergency-contact"
              role="tabpanel"
              aria-labelledby="pills-emergency-contact-tab"
              tabIndex={0}
            >
              <div>
                <EmergencyContactList />
              </div>
            </div>
            <div
              className="tab-pane fade"
              id="pills-transaction"
              role="tabpanel"
              aria-labelledby="pills-transaction-tab"
              tabIndex={0}
            >
              <div>
                  <h6 className="text-lg mb-8">Title</h6>
                  <p className="text-secondary-light mb-16">
                      Lorem Ipsum&nbsp;is simply dummy text of the printing and
                      typesetting industry. Lorem Ipsum has been the industry's
                      standard dummy text ever since the 1500s, when an unknown
                      printer took a galley of type and scrambled it to make a type
                      specimen book. It has survived not{" "}
                  </p>
                  <p className="text-secondary-light mb-0">
                      It was popularised in the 1960s with the release of Letraset
                      sheets containing Lorem Ipsum passages, and more recently with
                      desktop
                  </p>
              </div>
            </div>
              
          </div>
        </>
      </Card>
    </div>
  )
}