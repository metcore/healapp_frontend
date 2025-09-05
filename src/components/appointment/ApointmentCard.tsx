import { Icon } from "@iconify/react";

export default function AppointmentCard() {
  return(
    <div className='event-item d-flex align-items-center justify-content-between gap-4 pb-16 mb-16 border border-start-0 border-end-0 border-top-0'>
      <div className=''>
        <div className='d-flex align-items-center gap-10'>
          <span className='w-12-px h-12-px bg-warning-600 rounded-circle fw-medium' />
          <span className='text-secondary-light'>
            Today, 10:30 PM - 02:30 AM
          </span>
        </div>
        <span className='text-primary-light fw-semibold text-md mt-4'>
          Design Conference
        </span>
      </div>
      <div className='dropdown'>
        <button
          type='button'
          data-bs-toggle='dropdown'
          aria-expanded='false'
        >
          <Icon
            icon='entypo:dots-three-vertical'
            className='icon text-secondary-light'
          />
        </button>
        <ul className='dropdown-menu p-12 border bg-base shadow'>
          <li>
            <button
              type='button'
              className='dropdown-item px-16 py-8 rounded text-secondary-light bg-hover-neutral-200 text-hover-neutral-900 d-flex align-items-center gap-10'
              data-bs-toggle='modal'
              data-bs-target='#exampleModalView'
            >
              <Icon
                icon='hugeicons:view'
                className='icon text-lg line-height-1'
              />
              View
            </button>
          </li>
          <li>
            <button
              type='button'
              className='dropdown-item px-16 py-8 rounded text-secondary-light bg-hover-neutral-200 text-hover-neutral-900 d-flex align-items-center gap-10'
              data-bs-toggle='modal'
              data-bs-target='#exampleModalEdit'
            >
              <Icon
                icon='lucide:edit'
                className='icon text-lg line-height-1'
              />
              Edit
            </button>
          </li>
          <li>
            <button
              type='button'
              className='delete-item dropdown-item px-16 py-8 rounded text-secondary-light bg-hover-danger-100 text-hover-danger-600 d-flex align-items-center gap-10'
              data-bs-toggle='modal'
              data-bs-target='#exampleModalDelete'
            >
              <Icon
                icon='fluent:delete-24-regular'
                className='icon text-lg line-height-1'
              />
              Delete
            </button>
          </li>
        </ul>
      </div>
    </div>
  )
}