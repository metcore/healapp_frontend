'use client'
import { useState } from "react";
import { Modal } from "react-bootstrap";
import Button from "../primitive/button/Button";
import { toast } from "react-toastify";
import Form from "../primitive/form/Form";
import Card from "../primitive/card/Card";
import ColorPicker from "../primitive/color-picker/ColorPicker";
import Switch from "../primitive/switch/Switch";
import Input from "../primitive/input/Input";

export default function ShiftForm({ isOpen, onClose }) {
  const [name, setName] = useState<string>("")
  const [start, setStart] = useState<string>("")
  const [end, setEnd] = useState<string>("")
  const [breaks, setBreaks] = useState<{ start: string; end: string }[]>([])

  const handleOnClose = (open: boolean) => {
    onClose?.(open)
  }

  const handleSubmit = (e: any) => {
    if (e.hasError) {
      toast.error("Gagal membuat shift, harap periksa kembali data");
    } else {
      toast.success("Shift berhasil disimpan");
      onClose?.(true);
    }
  }

  const handleAddBreak = () => {
    setBreaks([...breaks, { start: "", end: "" }])
  }

  const handleRemoveBreak = (index: number) => {
    const updated = breaks.filter((_, i) => i !== index)
    setBreaks(updated)
  }

  const handleChangeBreak = (index: number, field: "start" | "end", value: string) => {
    const updated = [...breaks]
    updated[index][field] = value
    setBreaks(updated)
  }

  return (
    <Modal show={isOpen} onHide={() => handleOnClose(false)}>
      <Form onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>
            <h6 className="mb-0">Buat Data Shift</h6>
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <div className="d-flex flex-column gap-2">
            <Card
              renderHeader={
                <h6 className="text-md fw-semibold mb-0">Informasi Shift</h6>
              }
            >
              <div className="d-flex flex-column gap-2">
                <Form.Input
                  name="name"
                  label="Nama Shift"
                  placeholder="Mis: Shift Pagi"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  rules={{
                    required: { message: "Nama Shift wajib diisi" },
                  }}
                />
                <Form.Input
                  name="start_time"
                  label="Jam Masuk"
                  type="time"
                  value={start}
                  onChange={(e) => setStart(e.target.value)}
                  rules={{
                    required: { message: "Jam Masuk wajib diisi" },
                  }}
                />
                <Form.Input
                  name="end_time"
                  label="Jam Pulang"
                  type="time"
                  value={end}
                  onChange={(e) => setEnd(e.target.value)}
                  rules={{
                    required: { message: "Jam Selesai wajib diisi" },
                  }}
                />
                <ColorPicker label={"Warna Shift"} />
              </div>
            </Card>

            <Card
              renderHeader={
                <div className="d-flex justify-content-between align-items-center">
                  <h6 className="text-md fw-semibold mb-0">Jam Istirahat</h6>
                  <Button size="sm" onClick={handleAddBreak}>
                    + Tambah
                  </Button>
                </div>
              }
            >
              <div className="d-flex flex-column gap-2">
                {breaks.length === 0 && (
                  <p className="text-muted mb-0">Belum ada jam istirahat</p>
                )}
                {breaks.map((b, i) => (
                  <div
                    key={i}
                    className="row"
                  >
                    <div className="col-md-4">
                      <Form.Input
                        name={`break_start_${i}`}
                        type="time"
                        label={`Mulai Istirahat ${i + 1}`}
                        value={b.start}
                        onChange={(e) =>
                          handleChangeBreak(i, "start", e.target.value)
                        }
                        rules={{
                          required: { message: "Jam mulai istirahat wajib diisi" },
                        }}
                      />
                    </div>
                    <div className="col-md-4">
                      <Form.Input
                        name={`break_end_${i}`}
                        type="time"
                        label={`Selesai Istirahat ${i + 1}`}
                        value={b.end}
                        onChange={(e) =>
                          handleChangeBreak(i, "end", e.target.value)
                        }
                        rules={{
                          required: { message: "Jam selesai istirahat wajib diisi" },
                        }}
                      />
                    </div>
                    <div className="col-md-2 d-flex align-items-end position-relative">
                      <Button
                        size="sm"
                        variant="danger"
                        className="position-absolute top-25 start-90"
                        onClick={() => handleRemoveBreak(i)}
                      >
                        Hapus
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
            
            <Card
              renderHeader={
                <div className="d-flex justify-content-between align-items-center">
                  <h6 className="text-md fw-semibold mb-0">Additional</h6>
                </div>
              }
            >
              <div className="d-flex flex-column gap-2">
                <div
                  className="row"
                >
                  <div className="col-md-12">
                    <Switch label="Toleransi kehadiran" hint="Hidupkan jika anda mempunyai toleransi kehadiran"/>
                  </div>
                  <div className="col-md-6">
                    <Input label="Toleransai waktu masuk" icon="mdi:clock-in"/>
                  </div>
                  <div className="col-md-6">
                    <Input label="Toleransai waktu pulang" icon="mdi:clock-out"/>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => handleOnClose(false)}>
            Tutup
          </Button>
          <Form.ButtonSubmit />
        </Modal.Footer>
      </Form>
    </Modal>
  )
}
