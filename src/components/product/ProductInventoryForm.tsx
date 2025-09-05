import { Modal } from "react-bootstrap";
import Card from "../primitive/card/Card";
import { useMemo, useState } from "react";
import Button from "../primitive/button/Button";
import Input from "../primitive/input/Input";
import InputFile from "../primitive/input-file/InputFile";
import ButtonDelete from "../primitive/button-delete/ButtonDelete";
import InputNumber from "../primitive/input-number/InputNumber";
import Form from "../primitive/form/Form";

// ---- Types ----
type Variant = {
  name: string;
  sku: string;
  price: number | string; // keep string when typing to avoid flicker
  stock: number | string;
  image: File | null;
};

export default function ProductInventoryForm() {
  // master toggle: single inventory vs per-variant inventory
  const [enableInventoryVariant, setEnableInventoryVariant] = useState<boolean>(false);

  // base inventory (used when enableInventoryVariant === false)
  const [basePrice, setBasePrice] = useState<number | string>("");
  const [baseStock, setBaseStock] = useState<number | string>("");

  // variants state (used when enableInventoryVariant === true)
  const [variants, setVariants] = useState<Variant[]>([
    { name: "", sku: "", price: "", stock: "", image: null },
  ]);

  // modal state for adding a new variant
  const [modalAddVariant, setModalAddVariant] = useState<boolean>(false);
  const [draftVariant, setDraftVariant] = useState<Variant>({
    name: "",
    sku: "",
    price: "",
    stock: "",
    image: null,
  });

  // ----- helpers -----
  const handleRemoveVariant = (idx: number) =>
    setVariants(prev => prev.filter((_, i) => i !== idx));

  const handleVariantChange = (idx: number, field: keyof Variant, value: any) => {
    setVariants(prev => {
      const next = [...prev];
      (next[idx] as any)[field] = value;
      return next;
    });
  };

  const resetDraft = () =>
    setDraftVariant({ name: "", sku: "", price: "", stock: "", image: null });

  const closeModal = () => {
    setModalAddVariant(false);
    resetDraft();
  };

  const addVariantFromModal = () => {
    setVariants(prev => [...prev, draftVariant]);
    closeModal();
  };

  const canAddVariant = useMemo(() => {
    return (
      String(draftVariant.name).trim().length > 0 &&
      String(draftVariant.sku).trim().length > 0 &&
      String(draftVariant.price).toString().length > 0
    );
  }, [draftVariant]);

  // ----- renderers -----
  const renderInventory = () => (
    <div className="row gy-3">
      <div className="col-12 col-md-6">
        <Form.InputNumber
          label="Harga"
          format="currency"
          placeholder="Masukan harga"
          name="price"
          value={basePrice}
          onChange={(e: any) => setBasePrice(e.target?.value ?? e)}
          rules={{ required: { message: "Wajib diisi" } }}
        />
      </div>
      <div className="col-12 col-md-6">
        <Form.InputNumber
          format="number"
          label="Stok Awal"
          placeholder="Masukan stok awal"
          name="stock"
          value={baseStock}
          onChange={(e: any) => setBaseStock(e.target?.value ?? e)}
          rules={{ required: { message: "Wajib diisi" } }}
        />
      </div>
    </div>
  );

  const renderInventoryVariant = () => (
    <div className="row gy-3">
      {variants.map((variant, idx) => (
        <div key={`variant-${idx}`} className="col-12">
          <Card
            renderHeader={
              <div className="d-flex flex-wrap justify-content-between align-items-center gap-3">
                <h6 className="fw-semibold text-md mb-0">Variant {idx + 1}</h6>
                <ButtonDelete
                  variant="outline-danger"
                  size="sm"
                  onSuccess={() => handleRemoveVariant(idx)}
                  disabled={variants.length === 1}
                >
                  Hapus
                </ButtonDelete>
              </div>
            }
          >
            <div className="row gy-3">
              <div className="col-md-6 col-lg-3">
                <Form.Input
                  label="Nama Variant"
                  name={`variant_name[${idx}]`}
                  placeholder="Mis: warna kuning, size XL"
                  value={variant.name}
                  onChange={(e: any) => handleVariantChange(idx, "name", e.target.value)}
                  rules={{ required: { message: "Wajib diisi" } }}
                />
              </div>
              <div className="col-md-6 col-lg-3">
                <Form.Input
                  name={`variant_sku[${idx}]`}
                  label="SKU"
                  placeholder="Masukan SKU variant"
                  value={variant.sku}
                  onChange={(e: any) => handleVariantChange(idx, "sku", e.target.value)}
                  rules={{ required: { message: "Wajib diisi" } }}
                />
              </div>
              <div className="col-md-6 col-lg-3">
                <Form.InputNumber
                  name={`variant_price[${idx}]`}
                  label="Harga"
                  placeholder="Masukan harga"
                  value={variant.price}
                  onChange={(e: any) => handleVariantChange(idx, "price", e.target?.value ?? e)}
                  rules={{ required: { message: "Wajib diisi" } }}
                />
              </div>
              <div className="col-md-6 col-lg-3">
                <Form.InputNumber
                  format="number"
                  label="Stok"
                  placeholder="Masukan stok awal"
                  value={variant.stock}
                  onChange={(e: any) => handleVariantChange(idx, "stock", e.target?.value ?? e)}
                />
              </div>
              <div className="col-12">
                <InputFile
                  label="Gambar Variant"
                  multiple={false}
                  accept={{ "image/*": [] }}
                  // InputFile onChange returns File[]; take the first
                  onChange={(files: File[]) => handleVariantChange(idx, "image", files?.[0] ?? null)}
                />
              </div>
            </div>
          </Card>
        </div>
      ))}

      <div className="col-12 d-flex justify-content-end">
        <Button variant="primary" onClick={() => setModalAddVariant(true)}>
          Tambah Variant
        </Button>
      </div>
    </div>
  );

  return (
    <>
      <Card
        renderHeader={
          <div className="d-flex justify-content-between align-items-center">
            <h6 className="text-md fw-medium mb-0">Inventory, Harga & Stok</h6>
          </div>
        }
      >
        <div className="row gy-3">
          <div className="col-12">
            <Form.Switch
              name="is_enabled_variant"
              label={"Hidupkan variant"}
              hint="Atur jika kamu mempunyai variant pada produk ini"
              checked={enableInventoryVariant}
              onChange={(e: any) => setEnableInventoryVariant(!!e.target?.checked)}
            />
          </div>

          {enableInventoryVariant ? renderInventoryVariant() : renderInventory()}
        </div>
      </Card>

      {/* Add Variant Modal */}
      <Modal show={modalAddVariant} size="lg" onHide={closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>
            <h6 className="mb-0">Tambah Variant</h6>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="row gy-3">
            <div className="col-md-6">
              <Input
                label="Nama Variant"
                placeholder="Mis: warna kuning, size XL"
                value={draftVariant.name}
                onChange={(e: any) => setDraftVariant(d => ({ ...d, name: e.target.value }))}
              />
            </div>
            <div className="col-md-6">
              <Input
                label="SKU"
                placeholder="Masukan SKU variant"
                value={draftVariant.sku}
                onChange={(e: any) => setDraftVariant(d => ({ ...d, sku: e.target.value }))}
              />
            </div>
            <div className="col-md-6">
              <InputNumber
                label="Harga"
                placeholder="Masukan harga"
                value={draftVariant.price}
                onChange={(e: any) => setDraftVariant(d => ({ ...d, price: e.target?.value ?? e }))}
              />
            </div>
            <div className="col-md-6">
              <Input
                label="Stok"
                placeholder="Masukan stok awal"
                type="number"
                value={draftVariant.stock}
                onChange={(e: any) => setDraftVariant(d => ({ ...d, stock: e.target.value }))}
              />
            </div>
            <div className="col-12">
              <InputFile
                label="Gambar Variant"
                multiple={false}
                onChange={(files: File[]) => setDraftVariant(d => ({ ...d, image: files?.[0] ?? null }))}
              />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>
            Tutup
          </Button>
          <Button variant="primary" onClick={addVariantFromModal} disabled={!canAddVariant}>
            Tambah Variant
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
