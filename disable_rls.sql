-- ===================================
-- TẮT RLS (Row Level Security)
-- ===================================
-- Để đơn giản hóa, tắt RLS cho tất cả các bảng
-- Trong production nên bật RLS và tạo policies phù hợp

ALTER TABLE patients DISABLE ROW LEVEL SECURITY;
ALTER TABLE examinations DISABLE ROW LEVEL SECURITY;
ALTER TABLE examination_medicines DISABLE ROW LEVEL SECURITY;
ALTER TABLE medicines DISABLE ROW LEVEL SECURITY;
ALTER TABLE doctors DISABLE ROW LEVEL SECURITY;

-- Hoặc nếu muốn bật RLS nhưng cho phép tất cả:
-- ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Allow all" ON patients FOR ALL USING (true);

-- ALTER TABLE examinations ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Allow all" ON examinations FOR ALL USING (true);

-- ALTER TABLE examination_medicines ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Allow all" ON examination_medicines FOR ALL USING (true);

-- ALTER TABLE medicines ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Allow all" ON medicines FOR ALL USING (true);

-- ALTER TABLE doctors ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Allow all" ON doctors FOR ALL USING (true);
