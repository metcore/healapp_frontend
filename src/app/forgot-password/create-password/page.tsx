import ForgotPasswordCreatePasswordForm from "@/components/forgot-password/ForgotPasswordCreatePasswordForm";
import { Fragment } from "react";
import { ToastContainer } from "react-toastify";

export default function page () {
  return (
    <Fragment>
      <ToastContainer />
      <ForgotPasswordCreatePasswordForm />
    </Fragment>
  )
}