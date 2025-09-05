import { ReactNode } from "react";

type CardProps = {
  children: ReactNode;
  renderHeader?: ReactNode;
  renderFooter?: ReactNode;
};
export default function Card({ children, renderHeader, renderFooter }: CardProps) {
  return (
    <div className='card shadow-none radius-12 border'>
      {/* HEADER */}
      {renderHeader ? (
        <div className='card-header  px-12 py-16   border border-end-0 border-start-0 border-top-0'>
          {renderHeader}
        </div>
      ) : ""}

      {/* BODY */}
      {children ? (
        <div className='card-body px-12 py-16 '>{children}</div>
      ) : ""}

      {/* FOOTER */}
      {renderFooter ? (
      <div className='card-footer px-12 py-16  bg-transparent border border-end-0 border-start-0 border-bottom-0 '>
          {renderFooter}
        </div>
      ) : ""}
    </div>
  );
}
