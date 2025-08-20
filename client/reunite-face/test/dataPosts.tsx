import { PostAdmin } from "./interface";

export const postAdminList: PostAdmin[] = [
  {
    id: "post_001",
    status: "pending",
    name: "Nguyen Van A",
    account: {
      _id: "account_001",
      name: "Nguyen Van A",
      role: "user",
      status: "active",
      created_at: "2025-08-15T14:00:00Z",
      updated_at: "2025-08-15T14:00:00Z"
    },
    description: "Missing person last seen near Hoan Kiem Lake. Wearing a blue jacket and black pants.",
    missing_since: "2025-08-15T14:30:00Z",
    gender: "male",
    dob: "1995-03-10",
    relationship: "brother",
    address: "123 Hoan Kiem, Hanoi, Vietnam",
    contact_info: "phone: +84 912 345 678, email: familyA@gmail.com",
    images: [
      {
        _id: "image_001",
        created_at: "2025-08-15T15:00:00Z",
        is_avatar: true,
        s3_key: "images/post_001/avatar_001.jpg",
        url: "https://s3.example.com/images/post_001/avatar_001.jpg"
      },
      {
        _id: "image_002",
        created_at: "2025-08-15T15:05:00Z",
        is_avatar: false,
        s3_key: "images/post_001/photo_002.jpg",
        url: "https://s3.example.com/images/post_001/photo_002.jpg"
      }
    ],
    created_at: "",
    updated_at: ""
  },
  {
    id: "post_002",
    status: "finding",
    name: "Tran Thi B",
    account: {
      _id: "account_002",
      name: "Tran Van C",
      role: "user",
      status: "active",
      created_at: "2025-08-15T14:00:00Z",
      updated_at: "2025-08-15T14:00:00Z"
    },
    description: "Missing since leaving school. Last seen wearing school uniform and carrying a red backpack.",
    missing_since: "2025-08-10T08:00:00Z",
    gender: "female",
    dob: "2005-07-22",
    relationship: "daughter",
    address: "456 Ba Dinh, Hanoi, Vietnam",
    contact_info: "phone: +84 987 654 321, email: familyB@gmail.com",
    images: [
      {
        _id: "image_003",
        created_at: "2025-08-10T09:00:00Z",
        is_avatar: true,
        s3_key: "images/post_002/avatar_003.jpg",
        url: "https://s3.example.com/images/post_002/avatar_003.jpg"
      }
    ],
    created_at: "",
    updated_at: ""
  },
  {
    id: "post_003",
    status: "found",
    name: "Le Van C",
    account: {
      _id: "account_003",
      name: "Le Thi D",
      role: "admin",
      status: "active",
      created_at: "",
      updated_at: ""
    },
    description: "Found safe at a local shelter. Previously reported missing near a bus station.",
    missing_since: "2025-07-20T10:00:00Z",
    gender: "other",
    dob: "1980-11-05",
    relationship: "friend",
    address: "789 Dong Da, Hanoi, Vietnam",
    contact_info: "phone: +84 923 456 789, email: friendC@gmail.com",
    images: [
      {
        _id: "image_004",
        created_at: "2025-07-21T12:00:00Z",
        is_avatar: true,
        s3_key: "images/post_003/avatar_004.jpg",
        url: "https://s3.example.com/images/post_003/avatar_004.jpg"
      },
      {
        _id: "image_005",
        created_at: "2025-07-21T12:05:00Z",
        is_avatar: false,
        s3_key: "images/post_003/photo_005.jpg",
        url: "https://s3.example.com/images/post_003/photo_005.jpg"
      }
    ],
    created_at: "",
    updated_at: ""
  }
];

export const chart1 = [
    {"year": 2024, "month": 1, "price": 4},
    {"year": 2024, "month": 3, "price": 6},
    {"year": 2024, "month": 6, "price": 10},
    {"year": 2024, "month": 9, "price": 12},
    {"year": 2024, "month": 12, "price": 3},
    {"year": 2025, "month": 4, "price": 3},
    {"year": 2025, "month": 7, "price": 7},
    {"year": 2025, "month": 8, "price": 0}
  ]

export const dataChart = [
  {
    "year": 2025,
    "month": 1,
    "totalAmount": 7,
    "totalAppointments": 2,
    "appointments": [
      {
        "date": "2025-01-05",
        "facultyName": "Tai-mũi-họng",
        "id": "a1f1e2b3-45c6-789d-0123-456789abcdef",
        "price": 3,
        "serviceName": "Khám tai mũi họng tổng quát"
      },
      {
        "date": "2025-01-20",
        "facultyName": "Nội tổng quát",
        "id": "b2f2e3c4-56d7-890e-1234-567890abcdef",
        "price": 4,
        "serviceName": "Khám nội tổng quát"
      }
    ]
  },
  {
    "year": 2025,
    "month": 2,
    "totalAmount": 15,
    "totalAppointments": 3,
    "appointments": [
      {
        "date": "2025-02-03",
        "facultyName": "Răng-hàm-mặt",
        "id": "c3f3e4d5-67e8-901f-2345-678901abcdef",
        "price": 5,
        "serviceName": "Khám và tư vấn nha khoa"
      },
      {
        "date": "2025-02-10",
        "facultyName": "Mắt",
        "id": "d4f4e5d6-78f9-012a-3456-789012abcdef",
        "price": 2,
        "serviceName": "Khám mắt tổng quát"
      },
      {
        "date": "2025-02-21",
        "facultyName": "Tim mạch",
        "id": "e5f5e6d7-89fa-123b-4567-890123abcdef",
        "price": 8,
        "serviceName": "Siêu âm tim mạch"
      }
    ]
  },
  {
    "year": 2025,
    "month": 3,
    "totalAmount": 9,
    "totalAppointments": 2,
    "appointments": [
      {
        "date": "2025-03-08",
        "facultyName": "Da liễu",
        "id": "f6f6e7d8-90ab-234c-5678-901234abcdef",
        "price": 1,
        "serviceName": "Điều trị mụn"
      },
      {
        "date": "2025-03-25",
        "facultyName": "Nội tổng quát",
        "id": "g7f7e8d9-01bc-345d-6789-012345abcdef",
        "price": 8,
        "serviceName": "Khám sức khỏe định kỳ"
      }
    ]
  },
  {
    "year": 2025,
    "month": 4,
    "totalAmount": 19,
    "totalAppointments": 3,
    "appointments": [
      {
        "date": "2025-04-02",
        "facultyName": "Tai-mũi-họng",
        "id": "h8f8e9d0-12cd-456e-7890-123456abcdef",
        "price": 7,
        "serviceName": "Chẩn đoán và điều trị bệnh viêm mũi"
      },
      {
        "date": "2025-04-12",
        "facultyName": "Tim mạch",
        "id": "i9f9e0d1-23de-567f-8901-234567abcdef",
        "price": 6,
        "serviceName": "Điện tâm đồ"
      },
      {
        "date": "2025-04-28",
        "facultyName": "Mắt",
        "id": "j0f0e1d2-34ef-678a-9012-345678abcdef",
        "price": 6,
        "serviceName": "Khám mắt chuyên sâu"
      }
    ]
  }
]
