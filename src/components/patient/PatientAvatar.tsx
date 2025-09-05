import Avatar from "../primitive/avatar/Avatar";

export default function PatientAvatar({src = '../../assets/images/avatar/avatar1.png', name, id}) {
  return (
    <div className="d-flex align-items-center ">
      <Avatar height={44} src={src} />
      <div className="min-w-0">
        <h6 className="text-md mb-0 fw-semibold text-truncate">{name}</h6>
        <span className="text-xs text-secondary-light">
          {id}
        </span>
      </div>
    </div>
  )
}