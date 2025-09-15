'use client';
import OtpEmailForm from "@/components/otp-email/OtpEmailForm";
import Header from "@/masterLayout/Header";
import { Fragment } from "react";
import { ToastContainer } from "react-toastify";

export default function page() {
  return (
    <Fragment>
      <ToastContainer />
      <Header />
      <OtpEmailForm />
    </Fragment>
  );
}