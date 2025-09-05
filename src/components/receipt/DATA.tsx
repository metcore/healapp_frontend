export const DATA_RECEIPTS = [
  { 
    id: "1312341",
    name: "Skin serum",
    description: "Product ini menggunakan item yang harus dibuat",
    used: 2000000,
    is_active: true,
    promo :{
        id:1,
        quota:140,
        quota_availlable:12,
        quota_used:128,
        discount:200000,
        discount_type:"persen",
    },
  },
  { 
    id: "1312342",
    name: "Skin serum suntik",
    description: "Product ini menggunakan item",
    used: 2000000,
    is_active: true,
    variants: [
        {
            id:2,
            name:"500 ml",
            price: 3000000,
            stock:200,
        },
        {
            id:2,
            name:"500 ml",
            price: 2500000,
            stock:300
        }
    ]
  },
  { 
    id: "1312343",
    name: "SALMON DNA",
    description: "Product ini menggunakan item",
    used: 2000000,
    is_active: true,
  },  { 
    id: "1312331",
    description: "Product ini menggunakan item",
    name: "Skin serum",
    used: 2000000,
    is_active: true,
    promo :{
        id:1
    },
  },  { 
    id: "1312141",
    description: "Product ini menggunakan item",
    name: "Skin serum",
    used: 2000000,
    is_active: true,
    promo :{
        id:1
    },
  },
]