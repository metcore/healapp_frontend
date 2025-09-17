// components/VendorProvider.tsx
"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import ModalSelecVendor from "@/components/vendor/ModalSelectVendor";

export default function VendorProvider({ children }: { children: React.ReactNode }) {
  const user = useSelector((state: RootState) => state.auth.user);

  const vendor = useSelector((state: RootState) => state.vendor);
  const [showModal, setShowModal] = useState<boolean>(false);
  useEffect(() => {
    if(!vendor?.vendor && user?.UserVendors?.length > 1 ){
      setShowModal(true)
    }else{
      setShowModal(false)
    }
    
  }, [vendor,user]);

  return (
    <>
      {children}
      <ModalSelecVendor
        show={showModal}
        dataVendors={user?.UserVendors}
      />
    </>
  );
}
