// Danh sách bệnh và thuốc tương ứng sản phụ khoa
export const DISEASE_MEDICINES = {
  "Viêm âm đạo": [
    { name: "Metronidazole 500mg", usage: "Kháng sinh trị nhiễm khuẩn âm đạo", dose: "2 viên/ngày", days: 7 },
    { name: "Clotrimazole 100mg", usage: "Viên đặt âm đạo trị nấm", dose: "1 viên đặt tối", days: 6 },
    { name: "Dung dịch vệ sinh trầu không", usage: "Vệ sinh vùng kín hàng ngày", dose: "Dùng 1-2 lần/ngày", days: 30 },
  ],
  "Nấm Candida âm đạo": [
    { name: "Fluconazole 150mg", usage: "Kháng nấm đường uống", dose: "1 viên/liều duy nhất", days: 1 },
    { name: "Miconazole 200mg", usage: "Viên đặt âm đạo", dose: "1 viên đặt tối", days: 3 },
    { name: "Kem bôi Clotrimazole 1%", usage: "Giảm ngứa rát ngoài âm hộ", dose: "Bôi 2 lần/ngày", days: 7 },
  ],
  "Rối loạn kinh nguyệt": [
    { name: "Duphaston 10mg", usage: "Bổ sung Progesterone, điều hòa kinh nguyệt", dose: "1 viên/ngày (từ ngày 16-25 CKK)", days: 10 },
    { name: "Acid Folic 5mg", usage: "Bổ sung máu", dose: "1 viên/ngày", days: 30 },
    { name: "Vitamin E 400IU", usage: "Cân bằng nội tiết, chống oxy hóa", dose: "1 viên/ngày", days: 30 },
  ],
  "Theo dõi thai kỳ": [
    { name: "Procare Diamond", usage: "Vitamin tổng hợp cho bà bầu", dose: "1 viên/ngày sau ăn sáng", days: 30 },
    { name: "Sắt Ferrovit", usage: "Bổ sung sắt, phòng thiếu máu", dose: "1 viên/ngày", days: 30 },
    { name: "Canxi Corbiere", usage: "Bổ sung canxi cho xương thai nhi", dose: "1 ống/ngày buổi sáng", days: 30 },
  ],
  "Viêm lộ tuyến cổ tử cung": [
    { name: "Azithromycin 500mg", usage: "Kháng sinh phổ rộng", dose: "1 viên/ngày", days: 3 },
    { name: "Neo-Tergynan", usage: "Viên đặt âm đạo phối hợp", dose: "1 viên đặt tối", days: 10 },
    { name: "Doxycycline 100mg", usage: "Kháng sinh trị nhiễm khuẩn", dose: "2 viên/ngày sau ăn", days: 7 },
  ],
  "Đa nang buồng trứng (PCOS)": [
    { name: "Metformin 500mg", usage: "Cải thiện nhạy cảm insulin, điều hòa trứng", dose: "1 viên/ngày trong bữa ăn", days: 30 },
    { name: "Inositol (Ovasitol)", usage: "Tăng cường chất lượng buồng trứng", dose: "2 gói/ngày uống với nước", days: 30 },
    { name: "Diane 35", usage: "Thuốc tránh thai giúp giảm mụn, điều kinh", dose: "1 viên/ngày (theo vỉ)", days: 21 },
  ],
  "U xơ tử cung": [
    { name: "Tranexamic Acid 500mg", usage: "Cầm máu, giảm rong kinh", dose: "2-3 viên/ngày khi ra máu nhiều", days: 5 },
    { name: "Ibuprofen 400mg", usage: "Giảm đau bụng do u xơ", dose: "1 viên khi đau, tối đa 3v/ngày", days: 5 },
    { name: "Sắt Tardyferon B9", usage: "Bù máu do rong kinh", dose: "1 viên/ngày", days: 30 },
  ],
  "Tiền mãn kinh": [
    { name: "Soy Isoflavones", usage: "Cải thiện bốc hỏa, duy trì sinh lý", dose: "1 viên/ngày", days: 30 },
    { name: "Vitamin D3 + K2", usage: "Hỗ trợ hấp thu canxi, phòng loãng xương", dose: "1 viên/ngày", days: 30 },
    { name: "Ovestin 1mg", usage: "Kem bôi estrogen tại chỗ giảm khô rát", dose: "Bôi 1 lần/tối (2 lần/tuần)", days: 30 },
  ],
};

export const DISEASE_LIST = Object.keys(DISEASE_MEDICINES);

// Dữ liệu bệnh nhân mẫu
export const INITIAL_PATIENTS = [
  {
    id: "BN001",
    name: "Nguyễn Thị Hoa",
    dob: "1988-03-15",
    gender: "Nữ",
    phone: "0912 345 678",
    address: "12 Lê Lợi, Q.1, TP.HCM",
    bloodType: "A+",
    insurance: "3700123456789",
    createdAt: "2024-01-10",
    examHistory: [
      {
        id: "KB001-1",
        date: "2024-01-10",
        disease: "Theo dõi thai kỳ",
        symptoms: "Thai 12 tuần, siêu âm độ mờ da gáy bình thường. Mẹ hơi nghén, mệt mỏi.",
        doctor: "BS. Nguyễn Thị Tâm",
        medicines: DISEASE_MEDICINES["Theo dõi thai kỳ"],
        notes: "Ăn uống đủ chất, chia nhỏ bữa. Hẹn siêu âm hình thái 4D mốc 22 tuần.",
        fee: 500000,
      },
      {
        id: "KB001-2",
        date: "2024-03-15",
        disease: "Theo dõi thai kỳ",
        symptoms: "Thai 22 tuần. Siêu âm 4D các cấu trúc thai nhi phát triển bình thường.",
        doctor: "BS. Nguyễn Thị Tâm",
        medicines: [
          ...DISEASE_MEDICINES["Theo dõi thai kỳ"],
          { name: "Magie B6", usage: "Giảm co thắt cơ, chống chuột rút", dose: "2 ống/ngày", days: 30 }
        ],
        notes: "Uống bổ sung sắt và canxi cách nhau 2 tiếng. Lần sau test tiểu đường thai kỳ.",
        fee: 650000,
      },
    ],
  },
  {
    id: "BN002",
    name: "Trần Mai Lan",
    dob: "1995-07-22",
    gender: "Nữ",
    phone: "0987 654 321",
    address: "45 Nguyễn Huệ, Q.3, TP.HCM",
    bloodType: "O+",
    insurance: "3700987654321",
    createdAt: "2024-02-20",
    examHistory: [
      {
        id: "KB002-1",
        date: "2024-02-20",
        disease: "Nấm Candida âm đạo",
        symptoms: "Ngứa rát nhiều vùng kín, huyết trắng lợn cợn như bã đậu.",
        doctor: "BS. Lê Hữu Phước",
        medicines: DISEASE_MEDICINES["Nấm Candida âm đạo"],
        notes: "Vệ sinh vùng kín khô ráo, mặc đồ lót cotton thoáng khí. Tái khám sau 1 tuần.",
        fee: 350000,
      },
    ],
  },
  {
    id: "BN003",
    name: "Phạm Hà Giang",
    dob: "1998-11-05",
    gender: "Nữ",
    phone: "0909 111 222",
    address: "78 Đinh Tiên Hoàng, Q.Bình Thạnh, TP.HCM",
    bloodType: "B+",
    insurance: "",
    createdAt: "2024-03-05",
    examHistory: [
      {
        id: "KB003-1",
        date: "2024-03-05",
        disease: "Rối loạn kinh nguyệt",
        symptoms: "Trễ kinh 2 tháng, thử thai âm tính, hay đau tức ngực nhẹ.",
        doctor: "BS. Trần Mai Anh",
        medicines: DISEASE_MEDICINES["Rối loạn kinh nguyệt"],
        notes: "Tránh căng thẳng, thức khuya. Ăn uống điều độ.",
        fee: 250000,
      },
    ],
  },
  {
    id: "BN004",
    name: "Lý Thanh Hằng",
    dob: "1980-04-18",
    gender: "Nữ",
    phone: "0976 333 444",
    address: "99 Pasteur, Q.1, TP.HCM",
    bloodType: "AB+",
    insurance: "3700555555555",
    createdAt: "2024-03-25",
    examHistory: [
      {
        id: "KB004-1",
        date: "2024-03-25",
        disease: "Tiền mãn kinh",
        symptoms: "Bốc hỏa về đêm, mất ngủ, chu kỳ kinh thưa (45-60 ngày có 1 lần).",
        doctor: "BS. Lê Hữu Phước",
        medicines: DISEASE_MEDICINES["Tiền mãn kinh"],
        notes: "Tập yoga nhẹ nhàng, bổ sung thực phẩm giàu canxi và phytoestrogen.",
        fee: 400000,
      },
    ],
  },
];

export const DOCTORS = [
  "BS. Nguyễn Thị Tâm (CKII Sản Phụ Khoa)",
  "BS. Lê Hữu Phước (Thạc sĩ Tế bào phôi)",
  "BS. Trần Mai Anh (CKI Sản Phụ Khoa)",
  "BS. Huỳnh Lan Hương (Siêu âm Sản khoa)",
  "BS. Vũ Đức Minh (Nội tiết sinh sản)",
];

export const STATS_OVERVIEW = {
  totalPatients: 4,
  todayExams: 3,
  monthlyRevenue: 2150000,
  pendingAppointments: 5,
};
