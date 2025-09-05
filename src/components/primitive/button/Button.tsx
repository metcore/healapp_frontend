'use client'
import { useState } from "react";
import { Modal } from "react-bootstrap";
import ButtonBootstrap from "react-bootstrap/Button";
import { ButtonVariant } from "react-bootstrap/esm/types";
type ButtonProps = {
  children: React.ReactNode;
  className?: string;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
  disabled?: boolean;
  size?: "sm" | "md" | "lg"; 
  variant?: ButtonVariant;
  loading?:boolean;
  confirmation?: boolean;
  confirmationTitle?: string;
  confirmationRemark?: string;
};
export default function Button({
  children,
  className = "",
  type = "button",
  onClick,
  disabled = false,
  size = "sm",
  variant,
  onKeyDown,
  loading,
  confirmation =false,
  confirmationTitle = "Konfirmasi!",
  confirmationRemark = "Pastikan data sudah sesuai sebelum anda mensubmit",
} : ButtonProps) {
  const [showModalConfirmation, setShowModalConfirmation] = useState<boolean>(false)
  const handleSubmit = (e) => {
    setShowModalConfirmation(false)
    onClick?.(e)
  }
  const handleOnClickButton = (e) => {
    if(confirmation) {
      setShowModalConfirmation(true);
    }
    else{
      onClick?.(e)
    }
  }
  return (
    <>
      <ButtonBootstrap 
        type={type}
        className={` ${className}`}
        onClick={handleOnClickButton}
        onKeyDown={onKeyDown}
        disabled={disabled}
        size={size}
        variant={variant}
      >
        <div className="d-flex gap-2 flex-wrap align-items-center">
          {loading ? (
            <div className={`spinner-border spinner-border-${size}`} role="status">
            </div>
          ) : null}
          {children}
        </div>
        
      </ButtonBootstrap >

      <Modal show={showModalConfirmation} onHide={() => setShowModalConfirmation(false)} >
        <Modal.Header closeButton>
          <Modal.Title>
            <h6 className="fw-semibold">{confirmationTitle}</h6>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>{confirmationRemark}</Modal.Body>
        <Modal.Footer>
          <ButtonBootstrap
            variant="secondary"
            onClick={() => setShowModalConfirmation(false)}
            disabled={loading}
          >
            Batal
          </ButtonBootstrap>
          <ButtonBootstrap
            variant={variant}
            onClick={handleSubmit}
            disabled={loading}
          >
            {children}
          </ButtonBootstrap>
        </Modal.Footer>
      </Modal>
      
    </>
  );
}
