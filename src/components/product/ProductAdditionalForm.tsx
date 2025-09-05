import { useMemo, useState } from "react";
import Card from "../primitive/card/Card";
import Select from "../primitive/select/Select";
import ButtonDelete from "../primitive/button-delete/ButtonDelete";
import { Icon } from "@iconify/react";
import Button from "../primitive/button/Button";
import { DATA_PRODUCTS } from "./DATA";
import ButtonGroup from "../primitive/button/ButtonGorup";
import Switch from "../primitive/switch/Switch";
import Form from "../primitive/form/Form";

/**
 * Modernized ProductAdditionalForm
 * ---------------------------------------------------------
 * ✅ Fixes state shape bugs (productId vs id, variant fields)
 * ✅ Improves UX (clear hierarchy, per-row card, required toggle, empty state)
 * ✅ Adds basic validation (must pick product, if variants exist → choose one)
 * ✅ Accessible labels, help text, and keyboard-friendly controls
 * ✅ Clean layout with consistent spacing and mobile-friendly stacking
 * ✅ Extensible: add price/qty later without rewriting core structure
 */

type Variant = { id: number; name: string };
type ProductOption = {
  id: number;
  name: string;
  variants?: Variant[];
};

// unified row shape
export type AdditionalRow = {
  key: string; // stable key for list rendering
  productId: number | null;
  variants: Variant[]; // derived from selected product
  variantId: number | null; // chosen variant (if any)
  required: boolean;
};

const toOptions = (items: ProductOption[]) =>
  items.map((p) => ({ label: p.name, value: p.id, variants: p.variants ?? [] }));

export default function ProductAdditionalForm() {
  const [turnOnAdditional, setTurnOnAdditional] = useState<boolean>(false);

  const productOptions = useMemo(() => toOptions(DATA_PRODUCTS as ProductOption[]), []);

  const [additionals, setAdditionals] = useState<AdditionalRow[]>([
    {
      key: crypto.randomUUID(),
      productId: null,
      variants: [],
      variantId: null,
      required: false,
    },
  ]);

  // Add new additional row
  const handleAddAdditional = () => {
    setAdditionals((prev) => [
      ...prev,
      {
        key: crypto.randomUUID(),
        productId: null,
        variants: [],
        variantId: null,
        required: false,
      },
    ]);
  };

  // Product select changed
  const handleOnChangeSelectAdditional = (idx: number, value: any) => {
    setAdditionals((prev) => {
      const next = [...prev];
      const found = productOptions.find((o) => o.value === value?.value);
      next[idx] = {
        ...next[idx],
        productId: value?.value ?? null,
        variants: found?.variants ?? [],
        // reset chosen variant when product changes
        variantId: null,
      };
      return next;
    });
  };

  // Variant change
  const handleOnChangeVariant = (idx: number, variantId: number | string) => {
    setAdditionals((prev) => {
      const next = [...prev];
      next[idx] = { ...next[idx], variantId: Number(variantId) };
      return next;
    });
  };

  // Required toggle per row
  const handleToggleRequired = (idx: number, checked: boolean) => {
    setAdditionals((prev) => {
      const next = [...prev];
      next[idx] = { ...next[idx], required: checked };
      return next;
    });
  };

  // Delete row
  const handleDelete = (idx: number) => {
    setAdditionals((prev) => prev.filter((_, i) => i !== idx));
  };

  // Basic validation helper (can be extended or replaced by RHF/Yup)
  const getRowError = (row: AdditionalRow): string | null => {
    if (!row.productId) return "Silakan pilih produk.";
    if (row.variants.length > 0 && !row.variantId) return "Pilih salah satu varian.";
    return null;
  };

  const isFormValid = additionals.every((r) => !getRowError(r));

  return (
    <Card
      renderHeader={
        <div className="d-flex flex-column gap-1 gap-md-0 flex-md-row align-items-md-center justify-content-between">
          <div>
            <h6 className="text-md fw-semibold mb-1">Additional</h6>
            <p className="mb-0 text-muted">Tambahkan menu add-on seperti topping, extra treatment, atau perlengkapan.</p>
          </div>
          <div className="d-flex align-items-center gap-3">
            <Switch
              label={"Aktifkan Additional"}
              hint={"Tampilkan pengaturan menu tambahan di form"}
              checked={turnOnAdditional}
              onChange={(e: any) => setTurnOnAdditional(!!e.target?.checked)}
            />
          </div>
        </div>
      }
    >
      {!turnOnAdditional ? (
        <div className="text-center py-4">
          <div className="d-inline-flex align-items-center gap-2 px-3 py-2 rounded-3 bg-light">
            <Icon icon="ph:info" width={18} />
            <span className="text-muted">Additional sedang nonaktif. Aktifkan untuk menambahkan add-on.</span>
          </div>
        </div>
      ) : (
        <div className="d-flex flex-column gap-3">
          {additionals.length === 0 && (
            <div className="rounded-3 border p-3 bg-light">
              <div className="d-flex align-items-center gap-2 text-muted">
                <Icon icon="ph:plus-circle" width={18} />
                <span>Belum ada additional. Klik "Tambah Additional" untuk membuat baris baru.</span>
              </div>
            </div>
          )}

          {additionals.map((row, idx) => {
            const variants = row.variants ?? [];
            const error = getRowError(row);

            return (
              <div key={row.key} className="border rounded-3 p-3">
                <div className="d-flex justify-content-between align-items-start flex-wrap gap-2 mb-3">
                  <div className="d-flex align-items-center gap-2">
                    <span className="badge bg-primary-subtle text-primary">#{idx + 1}</span>
                    <strong>Additional Item</strong>
                    <span className={`badge ${row.required ? "bg-danger-subtle text-danger" : "bg-secondary-subtle text-secondary"}`}>
                      {row.required ? "Wajib" : "Opsional"}
                    </span>
                  </div>

                  <div className="d-flex align-items-center gap-3">
                    <Form.Switch
                      label="Tandai wajib"
                      checked={row.required}
                      onChange={(e: any) => handleToggleRequired(idx, !!e.target?.checked)}
                    />
                    <ButtonDelete aria-label={`Hapus baris ${idx + 1}`} onClick={() => handleDelete(idx)}>
                      <Icon icon="mdi:trash" />
                    </ButtonDelete>
                  </div>
                </div>

                <div className="row g-3">
                  <div className="col-md-8">
                    <Form.Select
                      name="additional_product_id[]"
                      label="Produk / Treatment"
                      placeholder="Pilih item / treatment"
                      aria-label={`Produk tambahan ${idx + 1}`}
                      onChange={(val: any) => handleOnChangeSelectAdditional(idx, val)}
                      options={productOptions}
                      rules={{ required: { message: "Wajib diisi" } }}
                    />
                  </div>

                  {variants.length > 0 && (
                    <div className="col-md-12">
                      <Form.RadioButton
                        name="additional_product_variant_id[]"
                        orientation="horizontal"
                        label={"Pilih varian"}
                        options={variants.map((v) => ({ label: v.name, value: v.id }))}
                        value={row.variantId ?? undefined}
                        onChange={(val: any) => handleOnChangeVariant(idx, val)}
                        rules={{ required: { message: "Wajib diisi" } }}
                      />
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          <div className="d-flex justify-content-between align-items-center mt-1">
            <Button className="d-inline-flex align-items-center gap-2" onClick={handleAddAdditional}>
              <Icon icon="ph:plus" /> Tambah Additional
            </Button>

            <div className="small text-muted">
              {isFormValid ? (
                <span className="text-success d-inline-flex align-items-center gap-1">
                  <Icon icon="ph:check-circle" /> Siap disimpan
                </span>
              ) : (
                <span className="d-inline-flex align-items-center gap-1">
                  <Icon icon="ph:info" /> Lengkapi pilihan produk/varian terlebih dahulu
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
