"use client";

import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import { WizardNavigation } from "../primitive/wizard/Wizard";
import { formatNumberRupiah } from "@/helper/formatNumber";
import api from "@/api/api";
import { toast } from "react-toastify";

export default function OnboardingPackage({onChange}) {
  const [billingType, setBillingType] = useState("monthly"); // monthly / yearly
  const [selectedPlan, setSelectedPlan] = useState(null); // Basic / Pro / Enterprise
  const [dataPlan, setDataPlan] = useState(null)
  const handleChangePacakge = (plan) => {
    console.log("plan", plan)
    setSelectedPlan(plan)
    onChange?.(plan)
  }

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await api.get("/plans");
        setDataPlan(response.data.data);
      } catch (error: any) {
        if (error.response && error.response.status === 400) {
          toast.error("Data tidak valid, silahkan periksa kembali inputan anda");
        } else {
          toast.error("Terjadi kesalahan saat mengirim");
        }
      }
    };

    fetchPlans();
  }, []);
  return (
    <div className="row justify-content-center">
      <div className="col-xxl-10">
        <div className="text-center">
          <h4 className="mb-16">Pilihan Paket</h4>
        </div>
        <ul className="nav nav-pills button-tab mt-32 pricing-tab justify-content-center">
          <li className="nav-item">
            <button
              className={`nav-link px-24 py-10 text-md rounded-pill fw-medium ${
                billingType === "monthly"
                  ? "active text-white bg-primary-600"
                  : "text-secondary-light"
              }`}
              onClick={() => setBillingType("monthly")}
            >
              Bulan
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link px-24 py-10 text-md rounded-pill fw-medium ${
                billingType === "yearly"
                  ? "active text-white bg-primary-600"
                  : "text-secondary-light"
              }`}
              onClick={() => setBillingType("yearly")}
            >
              Yearly
            </button>
          </li>
        </ul>

        {/* List Paket */}
        <div className="row gy-4 mt-4">
          {dataPlan?.map((plan) => (
            <div key={plan.Id} className="col-xxl-4 col-sm-4 pricing-plan-wrapper">
              <div
                className={`pricing-plan position-relative radius-24 overflow-hidden border cursor-pointer ${
                  selectedPlan === plan.Id ? "border-4 border-primary-600" : ""
                } bg-primary-100`}
                onClick={() => handleChangePacakge(plan.Id)}
              >
                {plan.popular && (
                  <span className="bg-primary-600 text-white radius-24 py-8 px-24 text-sm position-absolute end-0 top-0 z-1 rounded-start-top-0 rounded-end-bottom-0">
                    Popular
                  </span>
                )}
                <div className="d-flex align-items-center gap-16">
                  <span className="w-72-px h-72-px d-flex justify-content-center align-items-center radius-16 bg-base">
                    <Icon icon="mdi:package-variant" className="text-2xl" />
                  </span>
                  <div>
                    <span className="fw-medium text-md text-secondary-light">
                      {/* {plan.Description} */}
                    </span>
                    <h6 className="mb-0">{plan.Name}</h6>
                  </div>
                </div>

                <h3 className="mt-16 mb-24">
                  {formatNumberRupiah(plan.Price)}{" "}
                  <span className="fw-medium text-md text-secondary-light">
                    /{billingType}
                  </span>
                </h3>

                <ul>
                  {plan?.features?.map(
                    (item) => (
                      <li
                        key={item}
                        className="d-flex align-items-center gap-16 mb-16"
                      >
                        <span
                          className={`w-24-px h-24-px d-flex justify-content-center align-items-center bg-primary-600 rounded-circle`}
                        >
                          <Icon
                            icon="iconamoon:check-light"
                            className="text-white text-lg"
                          />
                        </span>
                        <span className="text-secondary-light text-lg">{item}</span>
                      </li>
                    )
                  )}
                </ul>

                <button
                  className={`mt-28 w-100 radius-8 px-12 py-10 text-sm border bg-primary-600 text-white`}
                  onClick={() => setSelectedPlan(plan.Name)}
                >
                  {selectedPlan === plan.Name ? "Selected" : "Get started"}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Navigasi Wizard */}
      </div>
        <div className="mt-5 ">
          <WizardNavigation />
        </div>
    </div>
  );
}
