'use client'
import OnboardingLayer from "@/components/onboarding/OnboardingLayer";
import Header from "@/masterLayout/Header";
import MasterLayout from "@/masterLayout/MasterLayout"
import { Suspense, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";

export default function Page(){

  useEffect(()=>{
    toast.success("Mohon lengkapi data berikut ini untuk memulai menggunaan Heal App")
  },[])
  return (
    <>
      <Suspense>
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
      <OnboardingLayer />
      </Suspense>
    </>
  );
}