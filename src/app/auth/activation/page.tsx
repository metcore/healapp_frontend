import ActivationForm from "@/components/auth/activation/ActtivationForm";
import Header from "@/masterLayout/Header";
import { Fragment } from "react";
import { ToastContainer } from "react-toastify";

export default function page(){
  return(
    <Fragment>
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <Header />
      <ActivationForm />
    </Fragment>
  )
}