-- ===================================
-- PHÒNG KHÁM SẢN PHỤ KHOA - DATABASE SCHEMA
-- ===================================

-- Xóa các bảng cũ nếu có (theo thứ tự ngược lại để tránh lỗi foreign key)
DROP TABLE IF EXISTS examination_medicines CASCADE;
DROP TABLE IF EXISTS examinations CASCADE;
DROP TABLE IF EXISTS patients CASCADE;
DROP TABLE IF EXISTS medicines CASCADE;
DROP TABLE IF EXISTS doctors CASCADE;

-- ===================================
-- 1. BẢNG PATIENTS (Bệnh nhân)
-- ===================================
CREATE TABLE patients (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  dob DATE NOT NULL,
  gender TEXT NOT NULL CHECK (gender IN ('Nam', 'Nữ', 'Khác')),
  phone TEXT NOT NULL,
  address TEXT,
  "bloodType" TEXT CHECK ("bloodType" IN ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', '')),
  insurance TEXT,
  "createdAt" TIMESTAMP DEFAULT NOW()
);

-- Index cho tìm kiếm nhanh
CREATE INDEX idx_patients_name ON patients(name);
CREATE INDEX idx_patients_phone ON patients(phone);
CREATE INDEX idx_patients_created_at ON patients("createdAt" DESC);

-- ===================================
-- 2. BẢNG EXAMINATIONS (Lần khám)
-- ===================================
CREATE TABLE examinations (
  id TEXT PRIMARY KEY,
  "patientId" TEXT NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  "examDate" DATE NOT NULL DEFAULT CURRENT_DATE,
  disease TEXT NOT NULL,
  symptoms TEXT NOT NULL,
  doctor TEXT NOT NULL,
  notes TEXT,
  fee INTEGER DEFAULT 0 CHECK (fee >= 0),
  "createdAt" TIMESTAMP DEFAULT NOW()
);

-- Index cho query nhanh
CREATE INDEX idx_examinations_patient_id ON examinations("patientId");
CREATE INDEX idx_examinations_date ON examinations("examDate" DESC);
CREATE INDEX idx_examinations_disease ON examinations(disease);
CREATE INDEX idx_examinations_created_at ON examinations("createdAt" DESC);

-- ===================================
-- 3. BẢNG EXAMINATION_MEDICINES (Thuốc trong đơn khám)
-- ===================================
CREATE TABLE examination_medicines (
  id SERIAL PRIMARY KEY,
  "examinationId" TEXT NOT NULL REFERENCES examinations(id) ON DELETE CASCADE,
  "medicineName" TEXT NOT NULL,
  usage TEXT NOT NULL,
  dose TEXT NOT NULL,
  days INTEGER NOT NULL CHECK (days > 0)
);

-- Index cho query nhanh
CREATE INDEX idx_examination_medicines_exam_id ON examination_medicines("examinationId");

-- ===================================
-- 4. BẢNG MEDICINES (Danh mục thuốc tham khảo)
-- ===================================
CREATE TABLE medicines (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  disease TEXT NOT NULL,
  usage TEXT NOT NULL,
  dose TEXT NOT NULL,
  days INTEGER NOT NULL CHECK (days > 0),
  "createdAt" TIMESTAMP DEFAULT NOW()
);

-- Index cho tìm kiếm và group by disease
CREATE INDEX idx_medicines_disease ON medicines(disease);
CREATE INDEX idx_medicines_name ON medicines(name);

-- ===================================
-- 5. BẢNG DOCTORS (Danh sách bác sĩ)
-- ===================================
CREATE TABLE doctors (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  specialty TEXT,
  "isActive" BOOLEAN DEFAULT TRUE,
  "createdAt" TIMESTAMP DEFAULT NOW()
);

-- Index cho tìm kiếm
CREATE INDEX idx_doctors_name ON doctors(name);
CREATE INDEX idx_doctors_active ON doctors("isActive");

-- ===================================
-- COMMENTS (Mô tả bảng)
-- ===================================
COMMENT ON TABLE patients IS 'Thông tin bệnh nhân';
COMMENT ON TABLE examinations IS 'Lịch sử khám bệnh';
COMMENT ON TABLE examination_medicines IS 'Thuốc được kê trong mỗi lần khám';
COMMENT ON TABLE medicines IS 'Danh mục thuốc tham khảo theo bệnh';
COMMENT ON TABLE doctors IS 'Danh sách bác sĩ';

-- ===================================
-- HOÀN TẤT
-- ===================================
-- Database schema đã được tạo thành công!
-- Tiếp theo: Chạy file insert_sample_data.sql để thêm dữ liệu mẫu
