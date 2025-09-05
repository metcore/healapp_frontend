export default function Avatar({ src, name = "", height = 40 }) {
  const initials = name
    .split(" ")
    .map((n) => n[0]?.toUpperCase())
    .join("")
    .slice(0, 2); // max 2 huruf

  return src ? (
    <img
      src={src}
      alt={name}
      className={`w-[${height}px] h-[${height}px] rounded-circle flex-shrink-0 me-12 overflow-hidden object-cover`}
    />
  ) : (
    <div
      className={`w-[${height}px] h-[${height}px] rounded-circle flex-shrink-0 me-12 overflow-hidden d-flex align-items-center justify-content-center bg-secondary text-white fw-bold`}
    >
      {initials}
    </div>
  );
}
