"use client";

import { useState } from "react";
import { Modal } from "react-bootstrap";
import ButtonBootstrap from "react-bootstrap/Button";
import { ButtonVariant } from "react-bootstrap/esm/types";
import axios from "axios";
import Button from "../button/Button";

type ButtonDeleteProps = {
  children: React.ReactNode;
  className?: string;
  type?: "button" | "submit" | "reset";
  onSuccess?: () => void; // Callback setelah delete sukses
  disabled?: boolean;
  size?: "sm"  | "lg";
  variant?: ButtonVariant;
  url: string; // Endpoint delete
  title: string;
  remark: string;
  onClick: (e) => void;
};

export default function ButtonDelete({
  children,
  className = "",
  type = "button",
  onSuccess,
  disabled = false,
  size = "md",
  variant = "danger",
  url,
  title = "Konfirmasi Hapus",
  remark = "Apakah Anda yakin ingin menghapus item ini?",
  onClick
}: ButtonDeleteProps) {
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(url);
      setShow(false);
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Delete failed", error);
      alert("Gagal menghapus data");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ButtonBootstrap
        type={type}
        className={`${className}`}
        onClick={() => setShow(true)}
        variant={variant}
        size={size}
        disabled={loading || disabled}
        aria-label="Delete"
      >
        {children}
      </ButtonBootstrap>

      <Modal show={show} onHide={() => setShow(false)} >
        <Modal.Header closeButton>
          <Modal.Title>
            <h6 className="fw-semibold">{title}</h6>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>{remark}</Modal.Body>
        <Modal.Footer>
          <ButtonBootstrap
            variant="secondary"
            onClick={() => setShow(false)}
            disabled={loading}
          >
            Batal
          </ButtonBootstrap>
          <ButtonBootstrap
            variant="danger"
            onClick={handleDelete}
            disabled={loading}
          >
            {loading ? "Menghapus..." : "Hapus"}
          </ButtonBootstrap>
        </Modal.Footer>
      </Modal>
    </>
  );
}
