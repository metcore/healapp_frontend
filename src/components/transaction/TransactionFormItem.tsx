import { useMemo } from "react";
import { Icon } from "@iconify/react";
import Card from "../primitive/card/Card";
import CounterButton from "../primitive/counter-button/CounterButton";
import ButtonDelete from "../primitive/button-delete/ButtonDelete";
import ProductTypeBadge from "../product/ProductTypeBadge";
import Avatar from "../primitive/avatar/Avatar";
import { formatNumberRupiah } from "@/helper/formatNumber";

type VariantInfo = {
  id?: string | number;
  label?: string;
  priceDelta?: number; // penyesuaian harga dari base price
};

type PromoInfo = {
  discount?: number;  // diskon absolut (Rp)
  percent?: number;   // atau diskon persen (0–100)
  label?: string;     // "Promo", "Flash Sale", dll.
  endsAt?: string;    // ISO string opsional
};

type Props = {
  id: string | number;
  name: string;
  description?: string;
  price: number;             // base price sebelum promo/varian
  variant?: VariantInfo;     // opsional
  quantity?: number;         // default 1
  type?: string;
  amount?: number;           // tak dipakai—bisa dihapus jika tidak perlu
  promo?: PromoInfo | null;
  image?: string;
  maxQty?: number;           // default 99
  onChangeQuantity?: (id: string | number, nextQty: number) => void;
  onRemove?: (id: string | number) => void;
};

export default function TransactionFormItem({
  id,
  name,
  description,
  price,
  variant,
  quantity = 1,
  type,
  amount, // (tidak dipakai)
  promo,
  image,
  maxQty = 99,
  onChangeQuantity,
  onRemove,
}: Props) {
  // --- Pricing helpers -------------------------------------------------------
  const baseAfterPromo = useMemo(() => {
    const byPercent =
      promo?.percent && promo.percent > 0
        ? Math.round(price * (promo.percent / 100))
        : 0;
    const byAbsolute = promo?.discount ?? 0;
    const totalDisc = Math.max(byPercent, byAbsolute); // ambil yang lebih besar jika keduanya ada
    return Math.max(0, price - totalDisc);
  }, [price, promo?.percent, promo?.discount]);

  const unitPrice = useMemo(() => {
    const delta = variant?.priceDelta ?? 0;
    return Math.max(0, baseAfterPromo + delta);
  }, [baseAfterPromo, variant?.priceDelta]);

  const subtotal = useMemo(() => unitPrice * Math.max(0, quantity), [unitPrice, quantity]);

  // --- Event handlers --------------------------------------------------------
  const handleQtyChange = (next: number) => {
    const clamped = Math.max(1, Math.min(maxQty, Number(next) || 1));
    onChangeQuantity?.(id, clamped);
  };

  const handleRemove = () => {
    onRemove?.(id);
  };

  // --- Render helpers --------------------------------------------------------
  const renderImage = () => {
    const alt = name || "Produk";
    return (
      <div className="ratio ratio-1x1 rounded overflow-hidden bg-light-subtle">
        {image ? (
          <img
            src={image}
            alt={alt}
            className="w-100 h-100 object-fit-cover"
            loading="lazy"
            decoding="async"
          />
        ) : (
          <div className="d-flex align-items-center justify-content-center w-100 h-100">
            <Avatar name={name} size="lg" />
          </div>
        )}
      </div>
    );
  };

  const showStrikethrough = (promo?.discount || promo?.percent) && (variant?.priceDelta ?? 0) === 0;

  return (
    <Card className="border-0 shadow-sm">
      <div className="d-flex flex-column gap-3 p-2">
        {/* Row: info kiri + actions kanan */}
        <div className="row g-3 align-items-start">
          <div className="col-4 col-md-3">{renderImage()}</div>

          <div className="col-8 col-md-7">
            <div className="d-flex flex-column gap-1">
              <h6 className="fw-semibold text-md mb-0 line-clamp-2">{name}</h6>
              {type ? <ProductTypeBadge type={type} /> : null}

              {/* Harga */}
              <div className="d-flex flex-column">
                {showStrikethrough ? (
                  <span className="text-muted text-decoration-line-through">
                    {formatNumberRupiah(price)}
                  </span>
                ) : null}

                <div className="d-flex align-items-center gap-2">
                  {(promo?.discount || promo?.percent) ? (
                    <span className="badge text-bg-danger">{promo?.label || "Promo"}</span>
                  ) : null}
                  <span className={`text-md fw-semibold ${promo ? "text-danger" : "text-body"}`}>
                    {formatNumberRupiah(baseAfterPromo)}
                  </span>
                  {typeof variant?.priceDelta === "number" && variant.priceDelta !== 0 ? (
                    <small className="text-muted">
                      ({variant.priceDelta > 0 ? "+" : ""}
                      {formatNumberRupiah(variant.priceDelta)} varian)
                    </small>
                  ) : null}
                </div>

                {/* Info varian & promo end */}
                <div className="d-flex flex-wrap gap-2">
                  {variant?.label ? (
                    <small className="text-muted">Varian: {variant.label}</small>
                  ) : null}
                  {promo?.endsAt ? (
                    <small className="text-muted">
                      · Berakhir {new Date(promo.endsAt).toLocaleString("id-ID")}
                    </small>
                  ) : null}
                </div>

                {description ? (
                  <small className="text-muted mt-1 line-clamp-2">{description}</small>
                ) : null}
              </div>
            </div>
          </div>

          <div className="col-12 col-md-2 d-flex justify-content-md-end">
            <ButtonDelete
              size="sm"
              variant="outline-danger"
              className="align-items-center"
              aria-label={`Hapus ${name}`}
              onClick={handleRemove}
            >
              <Icon icon="mdi:trash" />
            </ButtonDelete>
          </div>
        </div>

        {/* Row: counter + subtotal */}
        <div className="row g-3 align-items-center">
          <div className="col-12 col-md-7 d-flex align-items-center">
            <label htmlFor={`qty-${id}`} className="visually-hidden">
              Jumlah {name}
            </label>
            <CounterButton
              id={`qty-${id}`}
              min={1}
              max={maxQty}
              value={quantity}
              className="ms-1"
              onChange={handleQtyChange}
              aria-label={`Ubah jumlah untuk ${name}`}
            />
            <small className="text-muted ms-3">
              @ {formatNumberRupiah(unitPrice)} / item
            </small>
          </div>

          <div className="col-12 col-md-5 d-flex align-items-center justify-content-md-end">
            <div className="text-end">
              <div className="small text-muted">Subtotal</div>
              <h5 className="fw-bold mb-0 text-md">{formatNumberRupiah(subtotal)}</h5>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
