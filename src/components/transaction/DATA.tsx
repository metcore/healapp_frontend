export const DATA_TRANSACTIONS = [
  { 
    id: "1312341",
    pasien: {
      name: "Slamet Riyadi",
      id: "3123333",
    },
    doctor: {
      name: "Dr Slamet Riyadi Spkk",
    },
    branch: {
      name: "Kedoya",
    },
    room : "305",
    status : "Sedang berlangsung",
    date: '2025-12-12',
    items: [
      {
        id:123,
        name: "Lase Sco2",
        type: "treatment",
        quantity: 2,
        price: 20000000,
        discount: 300000,
        amount: 300000,
      },
      {
        id:221,
        name: "Mesohyal",
        type: "Product",
        quantity: 2,
        price: 20000000,
        discount: 300000,
        amount: 300000,
      },
      {
        id:251,
        name: "Mesohyal",
        type: "Product",
        quantity: 2,
        price: 20000000,
        discount: 300000,
        amount: 300000,
      },
      {
        id:321,
        name: "Mesohyal",
        type: "Product",
        quantity: 2,
        price: 20000000,
        discount: 300000,
        amount: 300000,
      }
    ],
    grand_total: 30000000
  },
  { 
    id: "13123421",
    pasien: {
      name: "Slamet Riyadi",
      id: "3123333",
    },
    doctor: {
      name: "Dr Slamet Riyadi Spkk",
    },
    branch: {
      name: "Kedoya",
    },
    room : "305",
    status : "Sedang berlangsung",
    date: '2025-12-12',
    items: [
      {
        id:123,
        name: "Lase Sco2",
        type: "treatment",
        quantity: 2,
        price: 20000000,
        discount: 300000
      },
      {
        id:321,
        name: "Mesohyal",
        type: "Product",
        quantity: 2,
        price: 20000000,
        discount: 300000
      }
    ],
    grand_total: 30000000
  },
  { 
    id: "133421",
    pasien: {
      name: "Slamet Riyadi",
      id: "3123333",
    },
    doctor: {
      name: "Dr Slamet Riyadi Spkk",
    },
    branch: {
      name: "Kedoya",
    },
    room : "305",
    status : "Sedang berlangsung",
    date: '2025-12-12',
    items: [
    ],
    grand_total: 30000000
  },
  { 
    id: "1312342",
    pasien: {
      name: "Slamet Riyadi",
      id: "3123333",
    },
    doctor: {
      name: "Dr Slamet Riyadi Spkk",
    },
    branch: {
      name: "Kedoya",
    },
    room : "305",
    status : "Sedang berlangsung",
    date: '2025-12-12',
    items: [
      { 
        id: "1312141",
        image:"/assets/images/product/example5.jpeg",
        description: "Product ini menggunakan item",
        name: "Skin serum",
        price: 98000,
        type: "product",
        sold:20003,
        stock:10,
        is_active:true,
        promo :{
            id:1,
            quota:140,
            quota_availlable:12,
            quota_used:128,
            discount:20000,
            discount_type:"persen",
        },
      },
      { 
        id: "1312342",
        sku:"Skin Serum",
        name: "Skin serum suntik",
        description: "Product ini menggunakan item",
        price: 2000000,
        stock:20,
        type:"product",
        sold:2100,
        is_active:false,
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
        id:321,
        name: "Mesohyal",
        type: "Product",
        quantity: 2,
        type:"treatment",
        price: 20000000,
        discount: 300000
      },
      { 
        id: "1312341",
        sku:"1233314",
        image:"/assets/images/product/example1.png",
        name: "Skin serum variant b 2 yang  ",
        description: "Product ini menggunakan item yang harus dibuat",
        price: 2000000,
        stock:10,
        type: "product",
        sold:20000,
        is_active:true,
        promo :{
            id:1,
            quota:140,
            quota_availlable:12,
            quota_used:128,
            discount:200000,
            discount_type:"persen",
        },
      },
    ],
    grand_total: 30000000
  },
  { 
    id: "13123721",
    pasien: {
      name: "Slamet Riyadi",
      id: "3123333",
    },
    doctor: {
      name: "Dr Slamet Riyadi Spkk",
    },
    branch: {
      name: "Kedoya",
    },
    room : "305",
    status : "Selesai",
    date: '2025-12-12',
    items: [
      {
        id:123,
        name: "Lase Sco2",
        type: "treatment",
        quantity: 2,
        price: 20000000,
        discount: 300000
      },
      {
        id:321,
        name: "Mesohyal",
        type: "Product",
        quantity: 2,
        price: 20000000,
        discount: 300000
      }
    ],
    grand_total: 30000000
  },
];