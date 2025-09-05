export const formatNumberRupiah = (value) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0
  }).format(value);
};


export const formatNumber = (value: number) => {
  return new Intl.NumberFormat("id-ID", {
    minimumFractionDigits: 0,
  }).format(value);
};


export const formatNumberPercent = (value: number) => {
  return new Intl.NumberFormat("id-ID", {
    minimumFractionDigits: 0,
  }).format(value) + " %";
};

// "Rp1.500.000"
