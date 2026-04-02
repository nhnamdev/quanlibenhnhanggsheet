-- Xóa dữ liệu cũ (nếu có)
TRUNCATE TABLE examination_medicines, examinations, patients, medicines, doctors CASCADE;

-- ===================================
-- THÊM DANH SÁCH BÁC SĨ
-- ===================================
INSERT INTO doctors (name, specialty, "isActive") VALUES
('BS. Nguyễn Thị Tâm (CKII Sản Phụ Khoa)', 'Sản Phụ Khoa', true),
('BS. Lê Hữu Phước (Thạc sĩ Tế bào phôi)', 'Tế bào phôi', true),
('BS. Trần Mai Anh (CKI Sản Phụ Khoa)', 'Sản Phụ Khoa', true),
('BS. Huỳnh Lan Hương (Siêu âm Sản khoa)', 'Siêu âm', true),
('BS. Vũ Đức Minh (Nội tiết sinh sản)', 'Nội tiết', true);

-- ===================================
-- THÊM BỆNH NHÂN MẪU
-- ===================================

-- Thêm bệnh nhân mẫu
INSERT INTO patients (id, name, dob, gender, phone, address, "bloodType", insurance, "createdAt") VALUES
('BN001', 'Nguyễn Thị Hoa', '1988-03-15', 'Nữ', '0912 345 678', '12 Lê Lợi, Q.1, TP.HCM', 'A+', '3700123456789', '2024-01-10'),
('BN002', 'Trần Mai Lan', '1995-07-22', 'Nữ', '0987 654 321', '45 Nguyễn Huệ, Q.3, TP.HCM', 'O+', '3700987654321', '2024-02-20'),
('BN003', 'Phạm Hà Giang', '1998-11-05', 'Nữ', '0909 111 222', '78 Đinh Tiên Hoàng, Q.Bình Thạnh, TP.HCM', 'B+', '', '2024-03-05'),
('BN004', 'Lý Thanh Hằng', '1980-04-18', 'Nữ', '0976 333 444', '99 Pasteur, Q.1, TP.HCM', 'AB+', '3700555555555', '2024-03-25');

-- Thêm lần khám cho BN001
INSERT INTO examinations (id, "patientId", "examDate", disease, symptoms, doctor, notes, fee, "createdAt") VALUES
('KB001-1', 'BN001', '2024-01-10', 'Theo dõi thai kỳ', 'Thai 12 tuần, siêu âm độ mờ da gáy bình thường. Mẹ hơi nghén, mệt mỏi.', 'BS. Nguyễn Thị Tâm (CKII Sản Phụ Khoa)', 'Ăn uống đủ chất, chia nhỏ bữa. Hẹn siêu âm hình thái 4D mốc 22 tuần.', 500000, '2024-01-10'),
('KB001-2', 'BN001', '2024-03-15', 'Theo dõi thai kỳ', 'Thai 22 tuần. Siêu âm 4D các cấu trúc thai nhi phát triển bình thường.', 'BS. Nguyễn Thị Tâm (CKII Sản Phụ Khoa)', 'Uống bổ sung sắt và canxi cách nhau 2 tiếng. Lần sau test tiểu đường thai kỳ.', 650000, '2024-03-15');

-- Thuốc cho KB001-1
INSERT INTO examination_medicines ("examinationId", "medicineName", usage, dose, days) VALUES
('KB001-1', 'Procare Diamond', 'Vitamin tổng hợp cho bà bầu', '1 viên/ngày sau ăn sáng', 30),
('KB001-1', 'Sắt Ferrovit', 'Bổ sung sắt, phòng thiếu máu', '1 viên/ngày', 30),
('KB001-1', 'Canxi Corbiere', 'Bổ sung canxi cho xương thai nhi', '1 ống/ngày buổi sáng', 30);

-- Thuốc cho KB001-2
INSERT INTO examination_medicines ("examinationId", "medicineName", usage, dose, days) VALUES
('KB001-2', 'Procare Diamond', 'Vitamin tổng hợp cho bà bầu', '1 viên/ngày sau ăn sáng', 30),
('KB001-2', 'Sắt Ferrovit', 'Bổ sung sắt, phòng thiếu máu', '1 viên/ngày', 30),
('KB001-2', 'Canxi Corbiere', 'Bổ sung canxi cho xương thai nhi', '1 ống/ngày buổi sáng', 30),
('KB001-2', 'Magie B6', 'Giảm co thắt cơ, chống chuột rút', '2 ống/ngày', 30);

-- Thêm lần khám cho BN002
INSERT INTO examinations (id, "patientId", "examDate", disease, symptoms, doctor, notes, fee) VALUES
('KB002-1', 'BN002', '2024-02-20', 'Nấm Candida âm đạo', 'Ngứa rát nhiều vùng kín, huyết trắng lợn cợn như bã đậu.', 'BS. Lê Hữu Phước (Thạc sĩ Tế bào phôi)', 'Vệ sinh vùng kín khô ráo, mặc đồ lót cotton thoáng khí. Tái khám sau 1 tuần.', 350000);

INSERT INTO examination_medicines ("examinationId", "medicineName", usage, dose, days) VALUES
('KB002-1', 'Fluconazole 150mg', 'Kháng nấm đường uống', '1 viên/liều duy nhất', 1),
('KB002-1', 'Miconazole 200mg', 'Viên đặt âm đạo', '1 viên đặt tối', 3),
('KB002-1', 'Kem bôi Clotrimazole 1%', 'Giảm ngứa rát ngoài âm hộ', 'Bôi 2 lần/ngày', 7);

-- Thêm lần khám cho BN003
INSERT INTO examinations (id, "patientId", "examDate", disease, symptoms, doctor, notes, fee) VALUES
('KB003-1', 'BN003', '2024-03-05', 'Rối loạn kinh nguyệt', 'Trễ kinh 2 tháng, thử thai âm tính, hay đau tức ngực nhẹ.', 'BS. Trần Mai Anh (CKI Sản Phụ Khoa)', 'Tránh căng thẳng, thức khuya. Ăn uống điều độ.', 250000);

INSERT INTO examination_medicines ("examinationId", "medicineName", usage, dose, days) VALUES
('KB003-1', 'Duphaston 10mg', 'Bổ sung Progesterone, điều hòa kinh nguyệt', '1 viên/ngày (từ ngày 16-25 CKK)', 10),
('KB003-1', 'Acid Folic 5mg', 'Bổ sung máu', '1 viên/ngày', 30),
('KB003-1', 'Vitamin E 400IU', 'Cân bằng nội tiết, chống oxy hóa', '1 viên/ngày', 30);

-- Thêm lần khám cho BN004
INSERT INTO examinations (id, "patientId", "examDate", disease, symptoms, doctor, notes, fee) VALUES
('KB004-1', 'BN004', '2024-03-25', 'Tiền mãn kinh', 'Bốc hỏa về đêm, mất ngủ, chu kỳ kinh thưa (45-60 ngày có 1 lần).', 'BS. Lê Hữu Phước (Thạc sĩ Tế bào phôi)', 'Tập yoga nhẹ nhàng, bổ sung thực phẩm giàu canxi và phytoestrogen.', 400000);

INSERT INTO examination_medicines ("examinationId", "medicineName", usage, dose, days) VALUES
('KB004-1', 'Soy Isoflavones', 'Cải thiện bốc hỏa, duy trì sinh lý', '1 viên/ngày', 30),
('KB004-1', 'Vitamin D3 + K2', 'Hỗ trợ hấp thu canxi, phòng loãng xương', '1 viên/ngày', 30),
('KB004-1', 'Ovestin 1mg', 'Kem bôi estrogen tại chỗ giảm khô rát', 'Bôi 1 lần/tối (2 lần/tuần)', 30);

-- Thêm danh mục thuốc tham khảo
INSERT INTO medicines (name, disease, usage, dose, days) VALUES
-- Viêm âm đạo
('Metronidazole 500mg', 'Viêm âm đạo', 'Kháng sinh trị nhiễm khuẩn âm đạo', '2 viên/ngày', 7),
('Clotrimazole 100mg', 'Viêm âm đạo', 'Viên đặt âm đạo trị nấm', '1 viên đặt tối', 6),
('Dung dịch vệ sinh trầu không', 'Viêm âm đạo', 'Vệ sinh vùng kín hàng ngày', 'Dùng 1-2 lần/ngày', 30),

-- Nấm Candida
('Fluconazole 150mg', 'Nấm Candida âm đạo', 'Kháng nấm đường uống', '1 viên/liều duy nhất', 1),
('Miconazole 200mg', 'Nấm Candida âm đạo', 'Viên đặt âm đạo', '1 viên đặt tối', 3),
('Kem bôi Clotrimazole 1%', 'Nấm Candida âm đạo', 'Giảm ngứa rát ngoài âm hộ', 'Bôi 2 lần/ngày', 7),

-- Rối loạn kinh nguyệt
('Duphaston 10mg', 'Rối loạn kinh nguyệt', 'Bổ sung Progesterone, điều hòa kinh nguyệt', '1 viên/ngày (từ ngày 16-25 CKK)', 10),
('Acid Folic 5mg', 'Rối loạn kinh nguyệt', 'Bổ sung máu', '1 viên/ngày', 30),
('Vitamin E 400IU', 'Rối loạn kinh nguyệt', 'Cân bằng nội tiết, chống oxy hóa', '1 viên/ngày', 30),

-- Theo dõi thai kỳ
('Procare Diamond', 'Theo dõi thai kỳ', 'Vitamin tổng hợp cho bà bầu', '1 viên/ngày sau ăn sáng', 30),
('Sắt Ferrovit', 'Theo dõi thai kỳ', 'Bổ sung sắt, phòng thiếu máu', '1 viên/ngày', 30),
('Canxi Corbiere', 'Theo dõi thai kỳ', 'Bổ sung canxi cho xương thai nhi', '1 ống/ngày buổi sáng', 30),

-- Viêm lộ tuyến cổ tử cung
('Azithromycin 500mg', 'Viêm lộ tuyến cổ tử cung', 'Kháng sinh phổ rộng', '1 viên/ngày', 3),
('Neo-Tergynan', 'Viêm lộ tuyến cổ tử cung', 'Viên đặt âm đạo phối hợp', '1 viên đặt tối', 10),
('Doxycycline 100mg', 'Viêm lộ tuyến cổ tử cung', 'Kháng sinh trị nhiễm khuẩn', '2 viên/ngày sau ăn', 7),

-- PCOS
('Metformin 500mg', 'Đa nang buồng trứng (PCOS)', 'Cải thiện nhạy cảm insulin, điều hòa trứng', '1 viên/ngày trong bữa ăn', 30),
('Inositol (Ovasitol)', 'Đa nang buồng trứng (PCOS)', 'Tăng cường chất lượng buồng trứng', '2 gói/ngày uống với nước', 30),
('Diane 35', 'Đa nang buồng trứng (PCOS)', 'Thuốc tránh thai giúp giảm mụn, điều kinh', '1 viên/ngày (theo vỉ)', 21),

-- U xơ tử cung
('Tranexamic Acid 500mg', 'U xơ tử cung', 'Cầm máu, giảm rong kinh', '2-3 viên/ngày khi ra máu nhiều', 5),
('Ibuprofen 400mg', 'U xơ tử cung', 'Giảm đau bụng do u xơ', '1 viên khi đau, tối đa 3v/ngày', 5),
('Sắt Tardyferon B9', 'U xơ tử cung', 'Bù máu do rong kinh', '1 viên/ngày', 30),

-- Tiền mãn kinh
('Soy Isoflavones', 'Tiền mãn kinh', 'Cải thiện bốc hỏa, duy trì sinh lý', '1 viên/ngày', 30),
('Vitamin D3 + K2', 'Tiền mãn kinh', 'Hỗ trợ hấp thu canxi, phòng loãng xương', '1 viên/ngày', 30),
('Ovestin 1mg', 'Tiền mãn kinh', 'Kem bôi estrogen tại chỗ giảm khô rát', 'Bôi 1 lần/tối (2 lần/tuần)', 30);


-- ===================================
-- THÊM DANH MỤC THUỐC THAM KHẢO
-- ===================================
INSERT INTO medicines (name, disease, usage, dose, days) VALUES
-- Viêm âm đạo
('Metronidazole 500mg', 'Viêm âm đạo', 'Kháng sinh trị nhiễm khuẩn âm đạo', '2 viên/ngày', 7),
('Clotrimazole 100mg', 'Viêm âm đạo', 'Viên đặt âm đạo trị nấm', '1 viên đặt tối', 6),
('Dung dịch vệ sinh trầu không', 'Viêm âm đạo', 'Vệ sinh vùng kín hàng ngày', 'Dùng 1-2 lần/ngày', 30),

-- Nấm Candida
('Fluconazole 150mg', 'Nấm Candida âm đạo', 'Kháng nấm đường uống', '1 viên/liều duy nhất', 1),
('Miconazole 200mg', 'Nấm Candida âm đạo', 'Viên đặt âm đạo', '1 viên đặt tối', 3),
('Kem bôi Clotrimazole 1%', 'Nấm Candida âm đạo', 'Giảm ngứa rát ngoài âm hộ', 'Bôi 2 lần/ngày', 7),

-- Rối loạn kinh nguyệt
('Duphaston 10mg', 'Rối loạn kinh nguyệt', 'Bổ sung Progesterone, điều hòa kinh nguyệt', '1 viên/ngày (từ ngày 16-25 CKK)', 10),
('Acid Folic 5mg', 'Rối loạn kinh nguyệt', 'Bổ sung máu', '1 viên/ngày', 30),
('Vitamin E 400IU', 'Rối loạn kinh nguyệt', 'Cân bằng nội tiết, chống oxy hóa', '1 viên/ngày', 30),

-- Theo dõi thai kỳ
('Procare Diamond', 'Theo dõi thai kỳ', 'Vitamin tổng hợp cho bà bầu', '1 viên/ngày sau ăn sáng', 30),
('Sắt Ferrovit', 'Theo dõi thai kỳ', 'Bổ sung sắt, phòng thiếu máu', '1 viên/ngày', 30),
('Canxi Corbiere', 'Theo dõi thai kỳ', 'Bổ sung canxi cho xương thai nhi', '1 ống/ngày buổi sáng', 30),

-- Viêm lộ tuyến cổ tử cung
('Azithromycin 500mg', 'Viêm lộ tuyến cổ tử cung', 'Kháng sinh phổ rộng', '1 viên/ngày', 3),
('Neo-Tergynan', 'Viêm lộ tuyến cổ tử cung', 'Viên đặt âm đạo phối hợp', '1 viên đặt tối', 10),
('Doxycycline 100mg', 'Viêm lộ tuyến cổ tử cung', 'Kháng sinh trị nhiễm khuẩn', '2 viên/ngày sau ăn', 7),

-- PCOS
('Metformin 500mg', 'Đa nang buồng trứng (PCOS)', 'Cải thiện nhạy cảm insulin, điều hòa trứng', '1 viên/ngày trong bữa ăn', 30),
('Inositol (Ovasitol)', 'Đa nang buồng trứng (PCOS)', 'Tăng cường chất lượng buồng trứng', '2 gói/ngày uống với nước', 30),
('Diane 35', 'Đa nang buồng trứng (PCOS)', 'Thuốc tránh thai giúp giảm mụn, điều kinh', '1 viên/ngày (theo vỉ)', 21),

-- U xơ tử cung
('Tranexamic Acid 500mg', 'U xơ tử cung', 'Cầm máu, giảm rong kinh', '2-3 viên/ngày khi ra máu nhiều', 5),
('Ibuprofen 400mg', 'U xơ tử cung', 'Giảm đau bụng do u xơ', '1 viên khi đau, tối đa 3v/ngày', 5),
('Sắt Tardyferon B9', 'U xơ tử cung', 'Bù máu do rong kinh', '1 viên/ngày', 30),

-- Tiền mãn kinh
('Soy Isoflavones', 'Tiền mãn kinh', 'Cải thiện bốc hỏa, duy trì sinh lý', '1 viên/ngày', 30),
('Vitamin D3 + K2', 'Tiền mãn kinh', 'Hỗ trợ hấp thu canxi, phòng loãng xương', '1 viên/ngày', 30),
('Ovestin 1mg', 'Tiền mãn kinh', 'Kem bôi estrogen tại chỗ giảm khô rát', 'Bôi 1 lần/tối (2 lần/tuần)', 30);
