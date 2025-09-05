import { Icon } from "@iconify/react";
import Avatar from "../primitive/avatar/Avatar";
import Card from "../primitive/card/Card";
import PatientHeaderName from "./PatientHeaderName";

export default function PatientHeader({name, email, mobile, note, totalTransaction, lastTransaction}) {
  return (
    <Card
      renderHeader={
        <div className='w-100 d-flex justify-content-between align-items-center'>
          <div className="d-flex align-items-center">
            <Avatar
              height={44}
              src="../../assets/images/avatar/avatar1.png"
            />
            <PatientHeaderName name={name} email={email} />
          </div>
          <button
              type="button"
              className="btn btn-primary radius-8 px-14 py-6 d-flex align-items-center gap-2"
          >
            <Icon icon='ion:send' />
            <span className="text-xs text-light fw-small"> Kirim Reminder</span>
            
          </button>
        </div>
      }
    >
      <div className='w-100 d-flex justify-content-between align-items-center'>
        <div className="d-flex align-items-center text-center gap-2">
          <Icon icon='mdi:message' /> 
          <p className="text-xs text-secondary-light fw-small mb-0">{note}</p>
        </div>
        <p className="text-xs text-secondary-light fw-small mb-0">{totalTransaction} treatments • {lastTransaction} tanggal terakhir</p>
      </div>
    </Card>
  )
}