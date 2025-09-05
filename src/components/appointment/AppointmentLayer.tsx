'use client'
import React, { useMemo, useState } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import { INITIAL_EVENTS, createEventId } from '../../hook/event-utils.js'
import { Icon } from '@iconify/react'
import { Modal } from 'react-bootstrap'
import Card from '../primitive/card/Card'
import PatientHeader from '../patient/PatientHeader'
import Input from '../primitive/input/Input'
import TextArea from '../primitive/textarea/TextArea'
import Button from '../primitive/button/Button'
import Select from '../primitive/select/Select'
import { ToastContainer, toast } from 'react-toastify'
import Avatar from '../primitive/avatar/Avatar'
import AppointmentCard from './ApointmentCard'


export default function AppointmentLayer() {
  const [isOpenModalDetailEvent, setIsOpenModalDetailEvent] = useState(false)
  const [isOpenModalAddEvent, setIsOpenModalAddEvent] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState(null)

  // Form state (controlled inputs) for Add Appointment
  const [form, setForm] = useState({
    patientName: '',
    email: '',
    phone: '',
    date: '', // YYYY-MM-DD
    time: '', // HH:mm
    doctor: '',
    notes: '',
  })

  const doctorOptions = useMemo(
    () => [
      { id: 'dr-slamet', label: 'Dr. Slamet Riyadi, Sp.KK' },
      { id: 'dr-ayu', label: 'Dr. Ayu Lestari, Sp.KK' },
      { id: 'dr-bima', label: 'Dr. Bima Putra, Sp.KK' },
    ],
    []
  )

  const timeOptions = useMemo(
    () =>
      Array.from({ length: 13 }).map((_, i) => {
        const h = 8 + i // 08:00 – 20:00
        const hh = String(h).padStart(2, '0')
        return { id: `${hh}:00`, label: `${hh}:00` }
      }),
    []
  )

  function handleDateSelect(selectInfo) {
    // Prefill date & time from selection start
    const start = new Date(selectInfo.startStr)
    const yyyy = start.getFullYear()
    const mm = String(start.getMonth() + 1).padStart(2, '0')
    const dd = String(start.getDate()).padStart(2, '0')
    const hh = String(start.getHours()).padStart(2, '0')
    const prefill = {
      date: `${yyyy}-${mm}-${dd}`,
      time: `${hh}:00`,
    }

    setForm((f) => ({ ...f, ...prefill }))
    setIsOpenModalAddEvent(true)
  }

  function handleEventClick(clickInfo) {
    setSelectedEvent(clickInfo?.event || null)
    setIsOpenModalDetailEvent(true)
  }

  function resetForm() {
    setForm({ patientName: '', email: '', phone: '', date: '', time: '', doctor: '', notes: '' })
  }

  function validateForm() {
    const errors = []
    if (!form.patientName?.trim()) errors.push('Nama pasien wajib diisi.')
    if (!form.date) errors.push('Tanggal wajib diisi.')
    if (!form.time) errors.push('Jam wajib dipilih.')
    if (!form.doctor) errors.push('Dokter wajib dipilih.')

    if (errors.length) {
      errors.forEach((e) => toast.error(e))
      return false
    }
    return true
  }

  function handleClickSaveAppointment() {
    if (!validateForm()) return

    // Example: create an in-memory event for FullCalendar via API
    const calendarApi = document.querySelector('.fc')?.__fullCalendar // safeguard; not official API
    try {
      // Preferred: use ref to FullCalendar to access getApi(), but we keep this minimal.
      // Here we just show a success toast and close the modal.
      toast.success('Appointment berhasil dibuat.')
    } catch (e) {
      toast.success('Appointment disimpan (preview).')
    }

    setIsOpenModalAddEvent(false)
    resetForm()
  }

  const eventClassNames = (arg) => {
    const type = arg.event.extendedProps?.type
    return [
      'border-0',
      'rounded-3',
      'px-2',
      type === 'important' && 'bg-danger text-white',
      type === 'warning' && 'bg-warning text-dark',
      (!type || type === 'info') && 'bg-info text-dark',
    ]
      .filter(Boolean)
      .join(' ')
  }

  function renderEventContent(eventInfo) {
    const { pasien, doctor, branch, type, tujuan } = eventInfo.event.extendedProps || {}
    return (
      <div className="d-flex flex-column gap-1 py-1">
        <div className="d-flex align-items-center gap-2 pb-1 border-bottom">
          <img
            src="/assets/images/user-grid/user-grid-img14.png"
            alt=""
            className="border br-white border-width-2-px w-20-px h-20-px rounded-circle object-fit-cover"
          />
          <h6 className="text-sm mb-0">{doctor?.name || eventInfo.event.title}</h6>
        </div>
        <div className="d-flex align-items-center justify-content-between">
          <p className="text-sm text-secondary-light mb-0">
            {eventInfo.timeText}
          </p>
          {type && <span className="badge bg-light text-dark text-xxs">{tujuan}</span>}
        </div>
        <h6 className="text-sm text-primary-light fw-semibold mb-0">
          {pasien?.name || 'Pasien'}
        </h6>
        {branch?.name && (
          <div className="d-flex align-items-center gap-1">
            <Icon icon="mdi:location" style={{ fontSize: 15 }} />
            <p className="text-sm text-secondary-light mb-0">{branch.name}</p>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="row gy-4">
      {/* Sidebar */}
      <div className="col-xxl-3 col-lg-4">
        <Card>
            <Button
              type="button"
              onClick={() => setIsOpenModalAddEvent(true)}
              className="btn btn-primary text-sm btn-sm px-12 py-12 w-100 radius-8 d-flex align-items-center gap-2 mb-32"
            >
              <Icon icon="fa6-regular:square-plus" className="icon text-lg line-height-1" />
              Buat Appointment
            </Button>

            <div className="d-flex align-items-center justify-content-between mb-12">
              <h6 className="mb-0">Hari ini</h6>
              <span className="text-xs text-secondary-light">Daftar singkat</span>
            </div>
            <div className="mt-16">
              <AppointmentCard />
            </div>
        </Card>
      </div>

      {/* Calendar */}
      <div className="col-xxl-9 col-lg-8">
        <Card>
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'timeGridDay,timeGridWeek,dayGridMonth',
            }}
            height="auto"
            contentHeight="auto"
            expandRows={true}
            slotMinTime="08:00:00"
            slotMaxTime="20:00:00"
            nowIndicator={true}
            selectable={true}
            selectMirror={true}
            editable={false}
            dayMaxEvents={true}
            weekends={true}
            initialEvents={INITIAL_EVENTS}
            select={handleDateSelect}
            eventContent={renderEventContent}
            eventClick={handleEventClick}
            eventClassNames={eventClassNames}
          />
        </Card>
      </div>

      {/* Details Modal */}
      <Modal show={isOpenModalDetailEvent} onHide={() => setIsOpenModalDetailEvent(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title as="div">
            <div className="d-flex flex-wrap gap-2 align-items-center">
              <Icon icon="mdi:calendar-clock" className="menu-icon" style={{ fontSize: 36 }} />
              <div className="d-flex flex-column">
                <h6 className="text-lg mb-0 d-flex gap-2 align-items-center">
                  <span className="text-secondary-light">Appointment</span>
                  <span className="text-primary-light">{selectedEvent?.id ? `#${selectedEvent.id}` : ''}</span>
                </h6>
                {selectedEvent && (
                  <p className="text-xs text-secondary-light fw-small mb-0">
                    {selectedEvent?.start && formatCountdown(selectedEvent.start)}
                  </p>
                )}
              </div>
            </div>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="d-flex flex-column gap-3">
            <PatientHeader
              name={selectedEvent?.extendedProps?.pasien?.name || '—'}
              email={selectedEvent?.extendedProps?.pasien?.email || '—'}
              mobile={selectedEvent?.extendedProps?.pasien?.phone || '—'}
              note={selectedEvent?.extendedProps?.pasien?.note || '—'}
              totalTransaction={selectedEvent?.extendedProps?.pasien?.totalTransaction || 0}
              lastTransaction={selectedEvent?.extendedProps?.pasien?.lastTransaction || ''}
            />

            <div className="row gy-3">
              <div className="col-sm-12">
                <Card>
                  <div className="d-flex gap-3 align-items-start">
                    <Icon icon="lets-icons:message" fontSize={32} />
                    <div>
                      <h6 className="text-md mb-2 fw-medium">Catatan Appointment</h6>
                      <span className="text-md text-secondary-light fw-small">
                        {selectedEvent?.extendedProps?.tujuan || '—'}
                      </span>
                    </div>
                  </div>
                </Card>
              </div>

              <div className="col-sm-6">
                <Card>
                  <div className="d-flex align-items-center gap-3">
                    <Avatar height={44} src="../../assets/images/avatar/avatar1.png" />
                    <div className="flex-grow-1">
                      <h6 className="text-md mb-0 fw-semibold">Dokter</h6>
                      <span className="text-xs text-secondary-light fw-small">
                        {selectedEvent?.extendedProps?.doctor?.name || '—'}
                      </span>
                    </div>
                  </div>
                </Card>
              </div>

              <div className="col-sm-6">
                <Card>
                  <div className="d-flex gap-3 align-items-start">
                    <Icon icon="lets-icons:calendar" fontSize={32} />
                    <div>
                      <h6 className="text-md mb-2 fw-medium">Tanggal Appointment</h6>
                      <span className="text-md text-secondary-light fw-small">
                        {formatEventDateRange(selectedEvent)}
                      </span>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      {/* Add Modal */}
      <Modal show={isOpenModalAddEvent} onHide={() => setIsOpenModalAddEvent(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title as="div">
            <div className="d-flex flex-wrap gap-2 align-items-center">
              <Icon icon="mdi:calendar-plus" className="menu-icon" style={{ fontSize: 36 }} />
              <div className="d-flex flex-column">
                <h6 className="text-lg mb-0">Buat Appointment</h6>
                <p className="text-xs text-secondary-light fw-small mb-0">Masukkan data lengkap untuk appointment</p>
              </div>
            </div>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Card
            renderHeader={
              <div>
                <h6 className="text-md fw-medium mb-0">Data Pasien</h6>
                <p className="text-xs text-secondary-light fw-small mb-0">Lengkapi data pasien ya</p>
              </div>
            }
          >
            <div className="row gy-3">
              <div className="col-md-8">
                <Input
                  label="Nama Pasien"
                  placeholder="Misal: John Doe"
                  icon="mdi:account-heart"
                  value={form.patientName}
                  onChange={(e) => setForm((f) => ({ ...f, patientName: e.target.value }))}
                />
              </div>
              <div className="col-md-4">
                <Input
                  label="No. Telepon"
                  icon="mdi:phone"
                  placeholder="08xxxxxxxxxx"
                  value={form.phone}
                  onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                />
              </div>

              <div className="col-md-6">
                <Input
                  icon="mdi:email"
                  label="Email"
                  placeholder="email@domain.com"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                />
              </div>
              <div className="col-md-3">
                <Input
                  icon="mdi:calendar"
                  label="Tanggal"
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
                />
              </div>
              <div className="col-md-3">
                <Select
                  label="Jam"
                  options={timeOptions}
                  value={form.time}
                  onChange={(val) => setForm((f) => ({ ...f, time: val }))}
                />
              </div>

              <div className="col-md-6">
                <Select
                  label="Dokter"
                  options={doctorOptions}
                  value={form.doctor}
                  onChange={(val) => setForm((f) => ({ ...f, doctor: val }))}
                />
              </div>
              <div className="col-12">
                <TextArea
                  label="Catatan"
                  placeholder="Keluhan / tujuan kunjungan"
                  value={form.notes}
                  onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                />
              </div>
            </div>
          </Card>
        </Modal.Body>
        <Modal.Footer className="d-flex justify-content-between">
          <Button variant="light" onClick={() => setIsOpenModalAddEvent(false)}>
            <div className="d-flex align-items-center gap-2">
              <Icon icon="mdi:close" />
              Batal
            </div>
          </Button>
          <Button onClick={handleClickSaveAppointment}>
            <div className="d-flex align-items-center gap-2">
              <Icon icon="mdi:content-save" />
              Simpan
            </div>
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Toasts */}
      <ToastContainer position="top-right" closeOnClick newestOnTop pauseOnFocusLoss draggable pauseOnHover />
    </div>
  )
}

// Helpers
function formatEventDateRange(event) {
  if (!event?.start) return '—'
  const start = new Date(event.start)
  const end = event.end ? new Date(event.end) : null
  const optsDate = { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' }
  const optsTime = { hour: '2-digit', minute: '2-digit' }
  const datePart = start.toLocaleDateString('id-ID', optsDate)
  const timeStart = start.toLocaleTimeString('id-ID', optsTime)
  const timeEnd = end ? end.toLocaleTimeString('id-ID', optsTime) : ''
  return `${timeStart}${timeEnd ? ` - ${timeEnd}` : ''} • ${datePart}`
}

function formatCountdown(targetDate) {
  const now = new Date()
  const diff = new Date(targetDate).getTime() - now.getTime()
  if (diff <= 0) return 'Sudah berlangsung'
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24)
  if (days > 0) return `Tersisa ${days} hari ${hours} jam`
  const minutes = Math.floor((diff / (1000 * 60)) % 60)
  return `Tersisa ${hours} jam ${minutes} menit`
}
