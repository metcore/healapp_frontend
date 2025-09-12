'use client';
import ForgotPasswordOtpForm from "@/components/forgot-password/ForgotPasswordOtpForm";
import Header from "@/masterLayout/Header";
import { Fragment } from "react";
import { ToastContainer } from "react-toastify";

export default function page() {
  return (
    <Fragment>
      <ToastContainer />
      <Header />
      <ForgotPasswordOtpForm />
    </Fragment>
  );
}