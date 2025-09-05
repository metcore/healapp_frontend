"use client";
import React from "react";
import { Icon } from "@iconify/react";
import Link from "next/link";

type BreadcrumbItem = {
  label: string;
  href?: string;
  active?: boolean;
};

type BreadcrumbProps = {
  breadcrumb: BreadcrumbItem[];
  icon?: string;
  title?: string;
};

const Breadcrumb: React.FC<BreadcrumbProps> = ({ breadcrumb, icon, title, hint }) => {
  return (
    <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-24">
      <div>
        <div className="d-flex gap-2 align-items-center">
          {icon && <Icon icon={icon} className="menu-icon" style={{ fontSize: 26 }} />}
          {title && <h6 className="fw-semibold mb-0">{title}</h6>}
        </div>
         {title &&  <p className="text-secondary mb-0">{hint}</p>}
      </div>
      

      <ul className="d-flex align-items-center gap-2">
        {breadcrumb?.map((bc, index) => (
          <React.Fragment key={index}>
            <li className={`fw-medium ${bc.active ? "text-primary" : ""}`}>
              {bc.href && !bc.active ? (
                <Link
                  href={bc.href}
                  className="d-flex align-items-center gap-1 hover-text-primary"
                >
                  {bc.label}
                </Link>
              ) : (
                <span>{bc.label}</span>
              )}
            </li>
            {index < breadcrumb.length - 1 && <li>-</li>}
          </React.Fragment>
        ))}
      </ul>
    </div>
  );
};

export default Breadcrumb;
