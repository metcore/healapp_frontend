export default function PatientHeaderName({email,mobile,name}) {
  return (

    <div className="flex-grow-1">
      <h6 className="text-md mb-0 fw-semibold">{name}</h6>
      <span className="text-xs text-secondary-light fw-small">{email} • {mobile} </span>
    </div>
  )
}