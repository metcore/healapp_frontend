import { Icon } from "@iconify/react";
import Link from "next/link";

export default function TransactionActionButton() {
  return(

    <div className="dropdown">
      <button
        className=""
        type="button"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        <Icon icon="entypo:dots-three-vertical" className="menu-icon" />
      </button>
      <ul className="dropdown-menu shadow-sm border-0 radius-8 p-2">
        <li>
          <Link
            className="dropdown-item px-16 py-8 rounded text-secondary-light bg-hover-neutral-200 text-hover-neutral-900 d-flex align-items-center gap-2"
            href="#"
          >
            <Icon icon="iconamoon:eye-light" />
            Lihat Detail
          </Link>
        </li>
        <li>
          <Link
            className="dropdown-item px-16 py-8 rounded text-secondary-light bg-hover-neutral-200 text-hover-neutral-900 d-flex align-items-center gap-2"
            href="#"
          >
            <Icon icon="lucide:edit" />
            Update
          </Link>
        </li>
        <li>
          <Link
            className="dropdown-item px-16 py-8 rounded text-secondary-light bg-hover-neutral-200 text-hover-neutral-900 d-flex align-items-center gap-2"
            href="#"
          >
            <Icon icon="mingcute:delete-2-line" />
            Hapus
          </Link>
        </li>
      </ul>
    </div>
  )
}