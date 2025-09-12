'use client';
import OtpEmailForm from "@/components/otp-email/OtpEmailForm";
import Header from "@/masterLayout/Header";
import { useSearchParams } from "next/navigation";
import { Fragment } from "react";
import { ToastContainer } from "react-toastify";

export default function page() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  return (
    <Fragment>
      <ToastContainer />
      <Header />
      <OtpEmailForm />
    </Fragment>
  );
}