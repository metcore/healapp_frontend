export const DATA_VOUCHERS = [
  { 
    id: "1312341",
    image:"/assets/images/product/example1.png",
    name: "KEMERDEKAAN",
    code: "KECHOTIRP",
    description: "Product ini menggunakan item yang harus dibuat",
    price: 2000000,
    quota_used:1,
    quota:2000,
    type: "product",
    start_date: "2025-07-12",
    end_ate: "2025-08-11",
    type_cut: "nominal",
    items: 'all',
  },  { 
    id: "131341",
    image:"/assets/images/product/example1.png",
    name: "17 Agustus kemerdekaan",
    code: "NKRI17",
    description: "Product ini menggunakan item yang harus dibuat",
    price: 2000000,
    type: "product",
    quota_used:1,
    quota: 2000,
    start_date: "2025-07-12",
    end_ate: "2025-08-11",
    type_cut: "percent",
    items: [
      { 
        id: "1312341",
        sku:"1233314",
        image:"/assets/images/product/example1.png",
        name: "Skin serum",
        description: "Product ini menggunakan item yang harus dibuat",
        price: 2000000,
        stock:10,
        type: "product",
        sold:20000,
        is_active:true,
      }
    ]
  },
]