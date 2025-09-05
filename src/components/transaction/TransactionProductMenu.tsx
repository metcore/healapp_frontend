import { useMemo, useRef, useState } from "react";
import { Modal } from "react-bootstrap";
import { Icon } from "@iconify/react";
import { toast } from "react-toastify";

import Link from "next/link"; // (unused in this file but kept if you need it elsewhere)
import Button from "../primitive/button/Button";
import Card from "../primitive/card/Card";
import Avatar from "../primitive/avatar/Avatar";
import ProductTypeBadge from "../product/ProductTypeBadge";
import ProductAdditionalForm from "../product/ProductAdditionalForm"; // (not used, remove if unnecessary)
import Form from "../primitive/form/Form";
import { formatNumberRupiah } from "@/helper/formatNumber";

export type VariantOption = {
  id: string | number;
  label: string;
  stock?: number;
  priceDelta?: number; // +/− adjustment from base price (optional)
};

export type Promo = {
  discount?: number; // absolute amount discounting base price
  label?: string;    // e.g. "Promo", "Flash Sale"
  endsAt?: string;   // ISO string; optional for display only
};

export type TransactionProductMenuProps = {
  productId: string | number;
  name: string;
  price: number;
  image?: string;
  type?: string;
  description?: string;
  promo?: Promo | null;
  variants?: VariantOption[] | null;
  onAddProduct?: (payload: {
    product_id: string | number;
    name: string;
    variant_id?: string | number;
    quantity: number;
    unit_price: number;     // final single-unit price after promo + variant delta
    subtotal: number;       // unit_price * quantity
  }) => void;
};

export default function TransactionProductMenu({
  productId,
  name,
  price,
  image,
  type,
  description,
  promo,
  variants,
  onAddProduct,
}: TransactionProductMenuProps) {
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- Helpers ---------------------------------------------------------------
  const basePriceAfterPromo = useMemo(() => {
    const disc = promo?.discount ?? 0;
    return Math.max(0, price - disc);
  }, [price, promo?.discount]);

  const displayPrice = (variantId?: string | number) => {
    const vDelta =
      variants?.find((v) => v.id === variantId)?.priceDelta ?? 0;
    const finalUnit = Math.max(0, basePriceAfterPromo + vDelta);
    return finalUnit;
  };

  const hasVariants = Boolean(variants && variants.length > 0);

  const openModal = () => setIsOpenModal(true);
  const closeModal = () => setIsOpenModal(false);

  // --- Rendering bits --------------------------------------------------------
  const renderImage = () => {
    const alt = name || "Produk";
    if (image) {
      return (
        <img
          src={image}
          alt={alt}
          className="img-fluid rounded-top-3 object-fit-cover w-100 h-100"
          loading="lazy"
          decoding="async"
          style={{ objectFit: "cover" }}
        />
      );
    }
    return <Avatar name={name} />;
  };

  const PriceBlock = () => (
    <>
      {promo?.discount ? (
        <div className="d-flex align-items-center gap-2">
          <span className="badge text-bg-danger fw-semibold">
            {promo?.label || "Promo"}
          </span>
          <span className="text-muted text-decoration-line-through">
            {formatNumberRupiah(price)}
          </span>
        </div>
      ) : null}
      <p
        className={`mb-0 ${
          promo?.discount ? "text-danger fw-semibold" : "text-body fw-semibold"
        }`}
      >
        {formatNumberRupiah(basePriceAfterPromo)}
      </p>
      {promo?.endsAt ? (
        <small className="text-muted d-block">
          Berakhir: {new Date(promo.endsAt).toLocaleString("id-ID")}
        </small>
      ) : null}
    </>
  );

  // --- Form rules ------------------------------------------------------------
  const variantRules = hasVariants
    ? { required: { message: "Harap pilih varian terlebih dahulu" } }
    : undefined;

  const quantityRules = {
    required: { message: "Masukkan jumlah" },
    min: { value: 1, message: "Minimal 1 quantity" },
  };

  // --- Handlers --------------------------------------------------------------
  const handleSubmit = async (formState: {
    hasError?: boolean;
    values?: Record<string, any>;
  }) => {
    if (formState?.hasError) {
      toast.error("Gagal menambahkan. Pastikan data sudah lengkap & valid.");
      return;
    }

    try {
      setIsSubmitting(true);
      const values = formState?.values || {};
      const variant_id = values.variant ?? undefined;
      const qty = Number(values.quantity ?? 0);

      // Prevent adding if variant is required but not chosen
      if (hasVariants && (variant_id === undefined || variant_id === "")) {
        toast.error("Harap pilih varian terlebih dahulu.");
        setIsSubmitting(false);
        return;
      }
      if (!qty || qty < 1) {
        toast.error("Jumlah minimal 1.");
        setIsSubmitting(false);
        return;
      }

      const unitPrice = displayPrice(variant_id);
      const subtotal = unitPrice * qty;

      onAddProduct?.({
        product_id: productId,
        name,
        variant_id,
        quantity: qty,
        unit_price: unitPrice,
        subtotal,
      });

      toast.success("Item berhasil ditambahkan ke keranjang.");
      closeModal();
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- Component -------------------------------------------------------------
  return (
    <>
      {/* Card item (clickable) */}
      <div
        className="mb-8 cursor-pointer"
        onClick={openModal}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") openModal();
        }}
        aria-label={`Buka detail ${name}`}
      >
        <Card className="h-100 border-0 shadow-sm hover-shadow">
          <div className="ratio ratio-1x1 h-100 rounded-top-3 overflow-hidden">
            {renderImage()}
          </div>

          <div className="pt-3 d-grid gap-1">
            <h6 className="fw-semibold text-md mb-0 line-clamp-2 text-capitalize">
              {name}
            </h6>

            {type ? <ProductTypeBadge type={type} /> : null}

            <div className="d-flex flex-column">
              <PriceBlock />
            </div>
          </div>
        </Card>
      </div>

      {/* Modal add-to-cart */}
      <Modal
        show={isOpenModal}
        onHide={closeModal}
        centered
        aria-labelledby="add-menu-title"
      >
        <Form
          onSubmit={handleSubmit}
          onHasError={(hasError) => {
            // Keep for debugging if needed
            // console.log("Form has error?", hasError);
          }}
        >
          <Modal.Header closeButton>
            <Modal.Title id="add-menu-title">
              <h6 className="fw-semibold text-lg mb-0">Tambahkan menu</h6>
            </Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <div className="d-flex flex-column gap-3">
              <Card className="border-0 bg-light-subtle">
                <div className="row g-3 align-items-center p-2">
                  <div className="col-4 col-sm-3">
                    <div className="ratio ratio-1x1 rounded overflow-hidden">
                      {renderImage()}
                    </div>
                  </div>

                  <div className="col-8 col-sm-9">
                    <div className="d-flex flex-column gap-1">
                      <p className="fw-semibold text-md mb-0 line-clamp-2">
                        {name}
                      </p>
                      <div className="d-flex align-items-center gap-2">
                        <span className="text-muted">@</span>
                        <span className="text-md">
                          {formatNumberRupiah(basePriceAfterPromo)}
                        </span>
                        {type ? <ProductTypeBadge type={type} /> : null}
                      </div>
                      {description ? (
                        <small className="text-muted line-clamp-2">
                          {description}
                        </small>
                      ) : null}
                    </div>
                  </div>
                </div>
              </Card>

              {/* Variants */}
              {hasVariants ? (
                <div>
                  <h6 className="text-md mb-2">Varian</h6>
                  <Form.RadioButton
                    name="variant"
                    rules={variantRules}
                   
                  // onChange={(e)=>console.log("aa", e.target.value)}
                  options={[
                    {value:2, label: "500 ml - Stock 200"},
                    {value:3, label: "600 ml"},
                    {value:4, label: "600 ml"}
                  ]}
                  />
                  <small className="text-muted d-block mt-1">
                    Harga akan menyesuaikan pilihan varian.
                  </small>
                </div>
              ) : null}
            </div>
          </Modal.Body>

          <Modal.Footer>
            <div className="d-flex gap-2 w-100 align-items-start">
              <div className="flex-grow-1">
                <Form.CounterButton
                  min={1}
                  name="quantity"
                  size="sm"
                  max={99}
                  rules={quantityRules}
                  aria-label="Jumlah"
                />
                <small className="text-muted d-block mt-1">
                  Gunakan tombol +/− untuk mengatur jumlah.
                </small>
              </div>

              <div className="w-50">
                <Form.ButtonSubmit
                  className="btn btn-primary w-100 gap-2 fw-bold d-flex align-items-center justify-content-center"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span className="spinner-border spinner-border-sm" aria-hidden="true" />
                  ) : (
                    <Icon icon="mdi:plus" />
                  )}
                  {isSubmitting ? "Memproses..." : "Tambah"}
                </Form.ButtonSubmit>
              </div>
            </div>
          </Modal.Footer>

          {/* Live price preview when user changes variant/quantity */}
          {/* <Form.Subscribe
            to={["variant", "quantity"]}
            render={(values: { variant?: string | number; quantity?: number }) => {
              const unit = displayPrice(values?.variant);
              const qty = Number(values?.quantity || 0);
              const subtotal = unit * (qty > 0 ? qty : 0);
              return (
                <div className="px-3 pb-3 w-100">
                  <div className="d-flex justify-content-between align-items-center small text-muted">
                    <span>Harga satuan</span>
                    <span className="fw-semibold">
                      {formatNumberRupiah(unit)}
                    </span>
                  </div>
                  <div className="d-flex justify-content-between align-items-center small text-muted">
                    <span>Subtotal</span>
                    <span className="fw-semibold">
                      {formatNumberRupiah(subtotal)}
                    </span>
                  </div>
                </div>
              );
            }}
          /> */}
        </Form>
      </Modal>
    </>
  );
}
