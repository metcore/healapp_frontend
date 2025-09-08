import { Icon } from "@iconify/react";
import { Fragment } from "react";

export default function Validaiton ({error}) {

  return (
    <Fragment>
      {error && error.length > 0 && (
        <div className="invalid-feedback d-block">
          {error.map((err, idx) => (
            <div key={idx} className=" small text-danger d-flex align-items-center gap-2">
              
              <Icon icon="ph:warning-circle" />
              <span> {err.error}</span>
            </div>
          ))}
        </div>
      )}
    </Fragment>
  )
}