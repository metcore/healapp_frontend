'use client'
import { useCallback, useMemo, useState } from "react";
import Link from "next/link";
import { Modal } from "react-bootstrap";
import { Icon } from "@iconify/react";
import { toast } from "react-toastify";

import Card from "../primitive/card/Card";
import Button from "../primitive/button/Button";
import Select from "../primitive/select/Select";
import Input from "../primitive/input/Input";
import PatientSelect from "../patient/PatientSelect";
import TransactionProductMenu from "./TransactionProductMenu";
import TransactionFormItem from "./TransactionFormItem";
import { DATA_PRODUCTS } from "../product/DATA";
import { DATA_TRANSACTIONS } from "./DATA";
import { formatNumberRupiah } from "@/helper/formatNumber";
import { DATA_ADDITIONAL_COSTS } from "../additional-cost/DATA";

type CartLine = {
  id: string; // unique key: productId__variantId
  productId: string | number;
  name: string;
  basePrice: number;
  unitPrice: number; // after promo + variant delta
  quantity: number;
  type?: string;
  image?: string;
  promo?: {
    discount?: number;
    percent?: number;
    label?: string;
    endsAt?: string;
  } | null;
  variant?: {
    id?: string | number;
    label?: string;
    priceDelta?: number;
  };
};

const TAX_RATE = 0.11; // 11%

export default function TransactionForm() {
  // --- Search & filter state -------------------------------------------------
  const [search, setSearch] = useState("");
  const [activeTags, setActiveTags] = useState<string[]>([]);
  const [modalAddItems, setModalAddItems] = useState(false);
  const [showCartMobile, setShowCartMobile] = useState(false);

  // --- Cart state ------------------------------------------------------------
  const seeded =
    DATA_TRANSACTIONS?.[3]?.items?.map((p: any, idx: number): CartLine => ({
      id: `${p.id ?? idx}__${p.variant?.id ?? "default"}`,
      productId: p.id ?? idx,
      name: p.name,
      basePrice: p.price,
      unitPrice: p.price,
      quantity: p.quantity ?? 1,
      type: p.type,
      image: p.image,
      promo: p.promo ?? null,
      variant: p.variant,
    })) ?? [];

  const [cart, setCart] = useState<CartLine[]>(seeded);

  // --- Tags for filters ------------------------------------------------------
  const allTags = useMemo(() => {
    const set = new Set<string>();
    for (const p of DATA_PRODUCTS) {
      if (p.tags && Array.isArray(p.tags)) p.tags.forEach((t: string) => set.add(t));
      if (p.type) set.add(p.type);
    }
    if (set.size === 0) ["Krim", "SPF", "Treatment"].forEach((t) => set.add(t));
    return Array.from(set).slice(0, 12);
  }, []);

  // --- Product list (search + filter) ---------------------------------------
  const filteredProducts = useMemo(() => {
    const term = search.trim().toLowerCase();
    return DATA_PRODUCTS.filter((p) => {
      const matchesTerm =
        !term ||
        p.name?.toLowerCase().includes(term) ||
        p.type?.toLowerCase().includes(term) ||
        p.description?.toLowerCase().includes(term);
      const matchesTags =
        activeTags.length === 0 || activeTags.some((t) => p.tags?.includes(t) || p.type === t);
      return matchesTerm && matchesTags;
    });
  }, [search, activeTags]);

  const toggleTag = (tag: string) => {
    setActiveTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));
  };

  // --- Cart helpers ----------------------------------------------------------
  const addOrMergeCart = useCallback((payload: {
    product_id: string | number;
    name: string;
    variant_id?: string | number;
    quantity: number;
    unit_price: number;
    subtotal: number;
  }) => {
    const key = `${payload.product_id}__${payload.variant_id ?? "default"}`;
    setCart((prev) => {
      const idx = prev.findIndex((l) => l.id === key);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = {
          ...next[idx],
          quantity: Math.min(999, next[idx].quantity + payload.quantity),
          unitPrice: payload.unit_price,
        };
        return next;
      }
      const prod = DATA_PRODUCTS.find((p) => p.id === payload.product_id);
      const variantMeta = prod?.variants?.find((v: any) => v.id === payload.variant_id);
      return [
        ...prev,
        {
          id: key,
          productId: payload.product_id,
          name: payload.name || prod?.name || "Item",
          basePrice: prod?.price ?? payload.unit_price,
          unitPrice: payload.unit_price,
          quantity: payload.quantity,
          type: prod?.type,
          image: prod?.image,
          promo: prod?.promo ?? null,
          variant: variantMeta
            ? { id: variantMeta.id, label: variantMeta.label, priceDelta: variantMeta.priceDelta }
            : undefined,
        },
      ];
    });
    toast.success("Item ditambahkan ke keranjang.");
  }, []);

  const handleChangeQuantity = useCallback((id: string | number, nextQty: number) => {
    setCart((prev) => prev.map((line) => (line.id === id ? { ...line, quantity: nextQty } : line)));
  }, []);

  const handleRemoveLine = useCallback((id: string | number) => {
    setCart((prev) => prev.filter((line) => line.id !== id));
  }, []);

  const totals = useMemo(() => {
    const subTotal = cart.reduce((sum, l) => sum + l.unitPrice * l.quantity, 0);
    const tax = Math.round(subTotal * TAX_RATE);
    const grand = subTotal + tax;
    return { subTotal, tax, grand };
  }, [cart]);

  // --- Actions ---------------------------------------------------------------
  const handleSaveDraft = () => toast("Data berhasil disimpan dahulu");

  // --- UI -------------------------------------------------------------------
  return (
    <div >
      <div className="row">
        {/* LEFT: Catalog & general info */}
        <div className="col-12 col-lg-8">
          <div className="d-flex flex-column gap-3">

            {/* General Info (compact & mobile-first) */}
            <Card renderHeader={<h6 className="fw-semibold text-lg mb-0">Informasi Umum</h6>}>
              <div className="row g-2 align-items-end compact-form">
                {/* Pasien */}
                <div className="col-12 col-md-5">
                  <div className="d-flex gap-2">
                    <div className="flex-grow-1">
                      <PatientSelect
                        size="sm"
                        clearable
                        label={null}
                        placeholder="Cari/ pilih pasien"
                        showMeta
                        appendButton={true}
                      />
                    </div>
                  </div>
                </div>

                {/* Dokter */}
                <div className="col-6 col-md-4">
                  <Select
                    size="sm"
                    placeholder="Pilih dokter"
                    clearable
                  />
                </div>

                {/* Ruangan */}
                <div className="col-6 col-md-3">
                  <Select
                    size="sm"
                    placeholder="Pilih ruangan"
                    options={[
                      { label: "101", value: "101" },
                      { label: "102", value: "102" },
                      { label: "103", value: "103" },
                    ]}
                    clearable
                  />
                </div>
              </div>
            </Card>

            {/* Catalog */}
            <Card
              renderHeader={
                <div className="d-flex justify-content-between align-items-center gap-2 flex-wrap">
                  {/* Filter chips */}
                  <div className="d-flex gap-2 overflow-auto ">
                    {allTags.map((tag) => {
                      const active = activeTags.includes(tag);
                      return (
                        <Button
                          key={tag}
                          size="sm"
                          variant={active ? "primary" : "outline-secondary"}
                          onClick={() => toggleTag(tag)}
                          aria-pressed={active}
                          className="text-truncate"
                        >
                          {tag}
                        </Button>
                      );
                    })}
                  </div>
                  {/* Search */}
                  <div className="w-sm-auto" style={{ minWidth: 220 }}>
                    <Input
                      name="search-product"
                      placeholder="Cari menu / Treatment"
                      icon="mdi:search"
                      size="sm"
                      value={search}
                      onChange={(e: any) => setSearch(e?.target?.value ?? "")}
                    />
                  </div>
                </div>
              }
            >
              <h6 className="fw-semibold text-lg mb-2">Menu</h6>

              {filteredProducts.length === 0 ? (
                <div className="text-center text-muted py-5">
                  <Icon icon="mdi:folder-search" width={48} height={48} className="mb-2" />
                  <div>Tidak ada produk yang cocok.</div>
                  <small>Coba ubah kata kunci atau filter.</small>
                </div>
              ) : (
                <div
                  className="overflow-auto"
                  style={{ maxHeight: "calc(100vh - 220px)" }}
                  aria-label="Daftar menu produk"
                >
                  <div className="row g-3">
                    {filteredProducts.map((p: any) => (
                      <div
                        key={p.id}
                        className="col-6 col-md-4 col-lg-3" // 2 kolom mobile, 3 tablet, 4 desktop
                      >
                        <TransactionProductMenu
                          productId={p.id}
                          name={p.name}
                          price={p.price}
                          image={p.image}
                          type={p.type}
                          variants={p.variants}
                          description={p.description}
                          promo={p.promo}
                          onAddProduct={addOrMergeCart}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          </div>
        </div>

        {/* RIGHT: Cart / Order details (sticky on desktop) */}
        <div className="d-none d-lg-block col-lg-4">
          <div className="position-sticky" style={{ top: 16 }}>
            <Card renderHeader={<h6 className="fw-semibold text-lg mb-0">Detail Order</h6>}>
              <div className="d-flex flex-column gap-2">
                <div className="flex-grow-1 overflow-auto" style={{ maxHeight: "calc(100vh - 230px)" }}>
                  {cart.length > 0 ? (
                    <div className="d-flex flex-column gap-2 pb-2">
                      {cart.map((line) => (
                        <TransactionFormItem
                          key={line.id}
                          id={line.id}
                          name={line.name}
                          price={line.basePrice}
                          variant={line.variant}
                          quantity={line.quantity}
                          type={line.type}
                          image={line.image}
                          promo={line.promo}
                          maxQty={99}
                          onChangeQuantity={handleChangeQuantity}
                          onRemove={handleRemoveLine}
                        />
                      ))}
                    </div>
                  ) : (
                    <div
                      className="d-flex flex-column align-items-center justify-content-center text-center p-4"
                      style={{ minHeight: 320 }}
                    >
                      <Icon icon="mdi:cart" className="text-secondary mb-3" width={56} height={56} />
                      <h6 className="fs-6 fw-semibold text-dark mb-1">Keranjang masih kosong</h6>
                      <p className="text-muted mb-0" style={{ maxWidth: 260 }}>
                        Pilih item dari katalog untuk memulai pesanan.
                      </p>
                    </div>
                  )}
                </div>

                {/* Totals */}
                <div className="d-grid gap-2">
                  <Card className="bg-light-subtle">
                    <div className="d-flex justify-content-between">
                      <p className="mb-0 text-muted">Sub total</p>
                      <p className="fw-bold mb-0">{formatNumberRupiah(totals.subTotal)}</p>
                    </div>

                    {DATA_ADDITIONAL_COSTS.map((additional_cost: any) => (
                      <div className="d-flex justify-content-between" key={additional_cost.id}>
                        <p className="mb-0 text-muted">{additional_cost.name} {additional_cost.type_amount == 'percent' ? Math.round(TAX_RATE * 100)+"%" :""}</p>
                        <p className="fw-bold mb-0">{formatNumberRupiah(totals.tax)}</p>
                      </div>
                    ))}
                    <hr className="my-2" />
                    <div className="d-flex justify-content-between">
                      <p className="mb-0">Grand total</p>
                      <p className="fw-bold mb-0">{formatNumberRupiah(totals.grand)}</p>
                    </div>
                  </Card>
                </div>

                {/* Actions */}
                <div className="d-flex justify-content-between gap-2">
                  <Button size="sm" onClick={handleSaveDraft}>
                    <div className="d-flex gap-2 align-items-center">
                      <Icon icon="mdi:store" />
                      Simpan Dulu
                    </div>
                  </Button>

                  <Link href="/transaction/create/payment" className="btn btn-primary btn-sm">
                    <div className="d-flex gap-2 align-items-center">
                      <Icon icon="mdi:money" />
                      Pembayaran
                    </div>
                  </Link>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* MOBILE: bottom bar total + cart modal */}
      <div className="d-lg-none">
        {/* Bottom bar */}
        <div className="mobile-bottom-bar shadow-lg border-top bg-white">
          <div className="container-fluid py-2">
            <div className="d-flex align-items-center justify-content-between">
              <div className="d-flex flex-column">
                <small className="text-muted lh-1">Total</small>
                <strong className="fs-6">{formatNumberRupiah(totals.grand)}</strong>
              </div>

              <div className="d-flex gap-2">
                <Button
                  size="sm"
                  variant="outline-secondary"
                  onClick={() => setShowCartMobile(true)}
                >
                  <div className="d-flex align-items-center gap-1">
                    <Icon icon="mdi:cart" />
                    <span>Keranjang ({cart.length})</span>
                  </div>
                </Button>
                <Link href="/transaction/create/payment" className="btn btn-primary btn-sm">
                  <div className="d-flex align-items-center gap-1">
                    <Icon icon="mdi:cash-multiple" />
                    <span>Bayar</span>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Cart modal */}
        <Modal show={showCartMobile} onHide={() => setShowCartMobile(false)} centered scrollable>
          <Modal.Header closeButton>
            <Modal.Title>Keranjang</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {cart.length > 0 ? (
              <div className="d-flex flex-column gap-2">
                {cart.map((line) => (
                  <TransactionFormItem
                    key={line.id}
                    id={line.id}
                    name={line.name}
                    price={line.basePrice}
                    variant={line.variant}
                    quantity={line.quantity}
                    type={line.type}
                    image={line.image}
                    promo={line.promo}
                    maxQty={99}
                    onChangeQuantity={handleChangeQuantity}
                    onRemove={handleRemoveLine}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center text-muted py-5">
                <Icon icon="mdi:cart" width={42} height={42} className="mb-2" />
                <div>Keranjang kosong.</div>
              </div>
            )}
          </Modal.Body>
          <Modal.Footer className="d-block">
            <Card className="bg-light-subtle mb-2">
              <div className="d-flex justify-content-between">
                <p className="mb-0 text-muted">Sub total</p>
                <p className="fw-bold mb-0">{formatNumberRupiah(totals.subTotal)}</p>
              </div>
              <div className="d-flex justify-content-between">
                <p className="mb-0 text-muted">PPN {Math.round(TAX_RATE * 100)}%</p>
                <p className="fw-bold mb-0">{formatNumberRupiah(totals.tax)}</p>
              </div>
              <hr className="my-2" />
              <div className="d-flex justify-content-between">
                <p className="mb-0">Grand total</p>
                <p className="fw-bold mb-0">{formatNumberRupiah(totals.grand)}</p>
              </div>
            </Card>

            <div className="d-flex justify-content-between gap-2">
              <Button size="sm" onClick={handleSaveDraft}>
                <div className="d-flex gap-2 align-items-center">
                  <Icon icon="mdi:content-save-outline" />
                  Simpan Dulu
                </div>
              </Button>
              <Link href="/transaction/create/payment" className="btn btn-primary btn-sm w-50">
                <div className="d-flex gap-2 align-items-center justify-content-center">
                  <Icon icon="mdi:cash-multiple" />
                  Pembayaran
                </div>
              </Link>
            </div>
          </Modal.Footer>
        </Modal>
      </div>

      {/* Optional: modal add items (katalog fullscreen) */}
      <Modal show={modalAddItems} onHide={() => setModalAddItems(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Tambah Item</Modal.Title>
        </Modal.Header>
        <Modal.Body>Coming soon.</Modal.Body>
      </Modal>

      {/* Local styles for modern mobile UI */}
      <style jsx>{`
        .compact-form .form-label-sm {
          font-size: 0.82rem;
        }
        .compact-form .form-control,
        .compact-form .form-select {
          height: 36px;
          padding-top: .375rem;
          padding-bottom: .375rem;
        }
        .mobile-bottom-bar {
          position: fixed;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 1030; /* above content */
          border-top-left-radius: 12px;
          border-top-right-radius: 12px;
        }
        @media (min-width: 992px) {
          .mobile-bottom-bar { display: none; }
        }
      `}</style>
    </div>
  );
}
