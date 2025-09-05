import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDropzone, type Accept, FileRejection } from "react-dropzone";
import Button from "react-bootstrap/Button";
import Card from "../card/Card";
import { Icon } from "@iconify/react";
import LabelInput from "../label-input/LabelInput";

// ---- Types ----
export interface InputFileProps {
  label?: string;
  hint?: string;
  title?: string;
  description?: string;
  labelButton?: string;
  /** react-dropzone accept; default: images only */
  accept?: Accept | { [key: string]: string[] };
  /** allow selecting multiple files */
  multiple?: boolean;
  /** maximum files allowed (only enforced when multiple=true) */
  maxFiles?: number;
  /** maximum file size in megabytes */
  maxSizeMB?: number;
  /** Controlled value: provide your own list of files */
  value?: File[];
  /** Callback when file list changes */
  onChange?: (files: File[]) => void;
  /** Custom className for outer wrapper */
  className?: string;
}

// Augment File with a preview URL for local display
type PreviewFile = File & { preview?: string };

const bytesToSize = (bytes: number): string => {
  if (bytes === 0) return "0 B";
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  const val = bytes / Math.pow(1024, i);
  return `${val.toFixed(val < 10 && i > 0 ? 2 : 0)} ${sizes[i]}`;
};

const InputFile: React.FC<InputFileProps> = ({
  label,
  hint,
  title = "Unggah Gambar",
  description = "Tarik dan jatuhkan file di sini, atau klik untuk memilih file",
  labelButton = "Cari file",
  accept = { "image/*": [] },
  multiple = true,
  maxFiles = 10,
  maxSizeMB = 10,
  value,
  onChange,
  className,
}) => {
  const [files, setFiles] = useState<PreviewFile[]>([]);
  const [errors, setErrors] = useState<string[]>([]);

  // Controlled vs uncontrolled
  const fileList = value ?? files;

  const maxSizeBytes = useMemo(() => maxSizeMB * 1024 * 1024, [maxSizeMB]);

  const updateFiles = useCallback(
    (updater: (prev: PreviewFile[]) => PreviewFile[]) => {
      if (value && onChange) {
        // if controlled, compute from current value
        const next = updater(value as PreviewFile[]);
        onChange(next);
      } else {
        setFiles(updater);
      }
    },
    [value, onChange]
  );

  const onDrop = useCallback((acceptedFiles: File[], rejected: FileRejection[]) => {
    const newErrors: string[] = [];
    if (rejected.length) {
      rejected.forEach(r => {
        r.errors.forEach(e => {
          if (e.code === "file-too-large") newErrors.push(`Ukuran file terlalu besar (>${maxSizeMB} MB): ${r.file.name}`);
          if (e.code === "file-invalid-type") newErrors.push(`Tipe file tidak didukung: ${r.file.name}`);
          if (e.code === "too-many-files") newErrors.push(`Terlalu banyak file. Maksimal ${maxFiles}.`);
        });
      });
    }

    // Map accepted with preview URLs
    const mapped = acceptedFiles.map(f => Object.assign(f, { preview: URL.createObjectURL(f) })) as PreviewFile[];

    updateFiles(prev => {
      const next = multiple ? [...prev, ...mapped] : mapped.slice(0, 1);
      // Enforce maxFiles
      const limited = multiple ? next.slice(0, maxFiles) : next;
      return limited;
    });

    setErrors(newErrors);
  }, [multiple, maxFiles, maxSizeMB, updateFiles]);

  const { getRootProps, getInputProps, isDragActive, isDragReject, open } = useDropzone({
    onDrop,
    accept,
    maxFiles: multiple ? maxFiles : 1,
    multiple,
    noClick: true, // we will trigger via button to improve a11y
    maxSize: maxSizeBytes,
  });

  // Revoke object URLs on unmount
  useEffect(() => {
    return () => {
      fileList.forEach(f => f.preview && URL.revokeObjectURL(f.preview));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDelete = (idx: number) => {
    const file = fileList[idx];
    if (file?.preview) URL.revokeObjectURL(file.preview);
    updateFiles(prev => {
      const dup = [...prev];
      dup.splice(idx, 1);
      return dup;
    });
  };

  const handleClearAll = () => {
    fileList.forEach(f => f.preview && URL.revokeObjectURL(f.preview));
    updateFiles(() => []);
  };

  const hasFiles = fileList.length > 0;

  return (
    <div className={className}>
      {label && <LabelInput label={label} />}
      {hint && <p className="text-sm mb-2 text-secondary-light">{hint}</p>}

      {/* Dropzone */}
      <div
        {...getRootProps({
          role: "button",
          tabIndex: 0,
          "aria-label": title,
          onKeyDown: (e: React.KeyboardEvent) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              open();
            }
          },
        })}
        className={`mb-3 p-4 text-center rounded-3 border border-dashed ${
          isDragActive ? "bg-light" : "bg-body"
        } ${isDragReject ? "border-danger" : "border-secondary-subtle"}`}
        style={{ borderStyle: "dashed" as const }}
      >
        <input {...getInputProps()} aria-label="file-input" />
        <div className="d-flex flex-column align-items-center gap-2">
          <Icon icon="ph:cloud-arrow-up" width={40} height={40} />
          <div>
            <h6 className="fw-semibold mb-1">{title}</h6>
            <p className="mb-0 text-secondary">{description}</p>
          </div>
          <div className="d-flex gap-2">
            <Button size="sm" variant="primary" onClick={open}>
              {labelButton}
            </Button>
            {hasFiles && (
              <Button size="sm" variant="outline-secondary" onClick={handleClearAll}>
                <Icon icon="mdi:trash-can-outline" className="me-1" /> Hapus semua
              </Button>
            )}
          </div>
          <small className="text-secondary">
            Maks ukuran {maxSizeMB} MB • {multiple ? `Maks ${maxFiles} file` : "1 file"}
          </small>
        </div>
      </div>

      {/* Errors */}
      {errors.length > 0 && (
        <div className="alert alert-warning py-2" role="alert">
          <ul className="mb-0 ps-3">
            {errors.map((e, i) => (
              <li key={i}>{e}</li>
            ))}
          </ul>
        </div>
      )}

      {/* File list */}
      {hasFiles && (
        <div className="d-grid gap-2" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))" }}>
          {fileList.map((file, index) => (
            <Card key={`${file.name}-${index}`} className="p-3 shadow-sm">
              <div className="d-flex align-items-center gap-3">
                <div style={{ width: 72 }}>
                  {file.type.startsWith("image/") && file.preview ? (
                    <img
                      src={file.preview}
                      alt={file.name}
                      className="rounded"
                      style={{ width: 72, height: 72, objectFit: "cover" }}
                      onLoad={() => {
                        // Keep preview until removal for better UX; comment out revoke here
                        // URL.revokeObjectURL(file.preview as string);
                      }}
                    />
                  ) : (
                    <div className="bg-light rounded d-flex align-items-center justify-content-center" style={{ width: 72, height: 72 }}>
                      <Icon icon="mdi:file-outline" width={28} height={28} />
                    </div>
                  )}
                </div>
                <div className="flex-grow-1">
                  <p className="mb-1 fw-medium text-truncate" title={file.name}>{file.name}</p>
                  <div className="d-flex flex-wrap gap-2 small text-secondary">
                    <span>{bytesToSize(file.size)}</span>
                    <span className="text-muted">•</span>
                    <span className="text-truncate" title={file.type || "unknown"}>{file.type || "unknown"}</span>
                  </div>
                </div>
                <div className="ms-auto">
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => handleDelete(index)}
                    title="Hapus gambar"
                  >
                    <Icon icon="ion:trash" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default InputFile;
