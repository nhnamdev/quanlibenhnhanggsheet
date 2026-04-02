import React, { useState } from 'react';
import { useMedicines } from '../hooks/useMedicines';

export default function AddExamModal({ patient, onClose, onSave }) {
  const { diseaseList, diseaseMedicines, doctors } = useMedicines();
  const [form, setForm] = useState({
    disease: '', symptoms: '', doctor: doctors[0] || '', notes: '', fee: '',
  });
  const [medicines, setMedicines] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [customMedicine, setCustomMedicine] = useState({ name: '', usage: '', dose: '', days: '' });
  const [showMedicineSelector, setShowMedicineSelector] = useState(false);
  const [medicineSearch, setMedicineSearch] = useState('');

  // Lấy tất cả thuốc từ diseaseMedicines
  const allMedicines = [];
  Object.entries(diseaseMedicines).forEach(([disease, meds]) => {
    meds.forEach(m => allMedicines.push({ ...m, disease }));
  });

  // Filter thuốc theo search
  const filteredMedicines = allMedicines.filter(m =>
    m.name.toLowerCase().includes(medicineSearch.toLowerCase()) ||
    m.disease.toLowerCase().includes(medicineSearch.toLowerCase())
  );

  const filteredDiseases = diseaseList.filter(d =>
    d.toLowerCase().includes(form.disease.toLowerCase()) && form.disease
  );

  const handleDiseaseSelect = (disease) => {
    setForm(f => ({ ...f, disease }));
    setMedicines(diseaseMedicines[disease] || []);
    setShowSuggestions(false);
  };

  const handleChange = (field, value) => {
    setForm(f => ({ ...f, [field]: value }));
    if (field === 'disease') {
      setShowSuggestions(true);
      // Không tự động set medicines nữa, để user tự chọn
    }
  };

  const handleAddMedicineFromList = (medicine) => {
    // Kiểm tra xem thuốc đã có trong đơn chưa
    const exists = medicines.some(m => m.name === medicine.name);
    if (exists) {
      alert('Thuốc này đã có trong đơn!');
      return;
    }
    
    setMedicines([...medicines, medicine]);
    setMedicineSearch('');
  };

  const handleAddCustomMedicine = () => {
    if (!customMedicine.name.trim()) return alert('Vui lòng nhập tên thuốc!');
    if (!customMedicine.dose.trim()) return alert('Vui lòng nhập liều dùng!');
    if (!customMedicine.days) return alert('Vui lòng nhập số ngày!');

    setMedicines([...medicines, { ...customMedicine, days: parseInt(customMedicine.days) }]);
    setCustomMedicine({ name: '', usage: '', dose: '', days: '' });
  };

  const handleRemoveMedicine = (index) => {
    setMedicines(medicines.filter((_, i) => i !== index));
  };

  const handleLoadSuggestedMedicines = () => {
    if (!form.disease) {
      alert('Vui lòng chọn bệnh trước!');
      return;
    }
    const suggested = diseaseMedicines[form.disease] || [];
    if (suggested.length === 0) {
      alert('Không có thuốc gợi ý cho bệnh này!');
      return;
    }
    setMedicines(suggested);
  };

  const handleSubmit = () => {
    if (!form.disease.trim()) return alert('Vui lòng nhập bệnh / chẩn đoán!');
    if (!form.symptoms.trim()) return alert('Vui lòng nhập triệu chứng!');
    if (medicines.length === 0) {
      const confirm = window.confirm('Đơn thuốc đang trống. Bạn có chắc muốn lưu không?');
      if (!confirm) return;
    }

    const newExam = {
      id: 'KB' + Date.now(),
      date: new Date().toISOString().split('T')[0],
      disease: form.disease,
      symptoms: form.symptoms,
      doctor: form.doctor,
      medicines: medicines,
      notes: form.notes,
      fee: parseInt(form.fee) || 0,
    };
    onSave(patient.id, newExam);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal modal-lg">
        <div className="modal-header">
          <div className="modal-title">🩺 Thêm lần khám mới</div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          {/* Patient info summary */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', background: 'rgba(67,97,238,0.1)', borderRadius: 10, border: '1px solid rgba(67,97,238,0.2)', marginBottom: 20 }}>
            <span style={{ fontSize: 28 }}>👤</span>
            <div>
              <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--text-primary)' }}>{patient.name}</div>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{patient.id} · {patient.phone}</div>
            </div>
            <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
              <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>Đã khám</div>
              <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--primary-light)' }}>{patient.examHistory.length} lần</div>
            </div>
          </div>

          <div className="form-grid">
            <div className="form-group full-width form-group-relative">
              <label className="form-label">Bệnh / Chẩn đoán *</label>
              <input
                id="exam-disease"
                className="form-input"
                placeholder="Nhập tên bệnh để tự động gợi ý thuốc..."
                value={form.disease}
                onChange={e => handleChange('disease', e.target.value)}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                autoComplete="off"
              />
              {showSuggestions && filteredDiseases.length > 0 && (
                <div className="disease-suggestion">
                  {filteredDiseases.map(d => (
                    <div key={d} className="disease-suggestion-item" onMouseDown={() => handleDiseaseSelect(d)}>
                      🏷️ {d}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="form-group full-width">
              <label className="form-label">Triệu chứng / Tình trạng *</label>
              <textarea
                id="exam-symptoms"
                className="form-textarea"
                placeholder="Mô tả chi tiết triệu chứng, kết quả đo lường..."
                value={form.symptoms}
                onChange={e => handleChange('symptoms', e.target.value)}
                style={{ minHeight: 90 }}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Bác sĩ khám</label>
              <select id="exam-doctor" className="form-select" value={form.doctor} onChange={e => handleChange('doctor', e.target.value)}>
                {doctors.map(d => <option key={d}>{d}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Phí khám (VNĐ)</label>
              <input
                id="exam-fee"
                type="number"
                className="form-input"
                placeholder="200000"
                value={form.fee}
                onChange={e => handleChange('fee', e.target.value)}
              />
            </div>

            <div className="form-group full-width">
              <label className="form-label">Ghi chú / Lời dặn bệnh nhân</label>
              <textarea
                id="exam-notes"
                className="form-textarea"
                placeholder="Lời dặn, chỉ định điều trị thêm..."
                value={form.notes}
                onChange={e => handleChange('notes', e.target.value)}
              />
            </div>
          </div>

          {/* Medicines */}
          <div style={{ marginTop: 16, padding: '16px', background: 'var(--bg-secondary)', borderRadius: 10, border: '1px solid var(--border)' }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                💊 Đơn thuốc
                <span className="badge badge-blue">{medicines.length} loại</span>
              </div>
              <div style={{ display: 'flex', gap: 6 }}>
                {form.disease && (
                  <button
                    className="btn btn-ghost btn-sm"
                    onClick={handleLoadSuggestedMedicines}
                    style={{ fontSize: 11 }}
                  >
                    ✨ Load thuốc gợi ý
                  </button>
                )}
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => setShowMedicineSelector(!showMedicineSelector)}
                  style={{ fontSize: 11 }}
                >
                  {showMedicineSelector ? '✕ Đóng' : '➕ Chọn từ danh mục'}
                </button>
              </div>
            </div>

            {/* Medicine Selector */}
            {showMedicineSelector && (
              <div style={{ marginBottom: 12, padding: 12, background: 'var(--bg-primary)', borderRadius: 8, border: '1px solid var(--border)' }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8 }}>
                  🔍 Tìm và chọn thuốc từ danh mục
                </div>
                <input
                  className="form-input"
                  placeholder="Tìm tên thuốc hoặc bệnh..."
                  value={medicineSearch}
                  onChange={e => setMedicineSearch(e.target.value)}
                  style={{ fontSize: 12, marginBottom: 8 }}
                />
                <div style={{ maxHeight: 200, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {medicineSearch && filteredMedicines.length > 0 ? (
                    filteredMedicines.slice(0, 10).map((m, i) => (
                      <div
                        key={i}
                        style={{
                          padding: '8px 10px',
                          background: 'var(--bg-secondary)',
                          borderRadius: 6,
                          cursor: 'pointer',
                          border: '1px solid var(--border)',
                          transition: 'all 0.2s',
                          fontSize: 12
                        }}
                        onClick={() => handleAddMedicineFromList(m)}
                        onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'var(--bg-secondary)'}
                      >
                        <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: 2 }}>
                          💊 {m.name}
                        </div>
                        <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>
                          {m.disease} · {m.dose} · {m.days} ngày
                        </div>
                      </div>
                    ))
                  ) : medicineSearch ? (
                    <div style={{ padding: 12, textAlign: 'center', color: 'var(--text-muted)', fontSize: 11 }}>
                      Không tìm thấy thuốc
                    </div>
                  ) : (
                    <div style={{ padding: 12, textAlign: 'center', color: 'var(--text-muted)', fontSize: 11 }}>
                      Nhập tên thuốc để tìm kiếm
                    </div>
                  )}
                </div>
              </div>
            )}

            {medicines.length > 0 ? (
              <div className="medicine-list" style={{ marginBottom: 12 }}>
                {medicines.map((m, i) => (
                  <div key={i} className="medicine-item" style={{ position: 'relative' }}>
                    <div className="medicine-icon">💊</div>
                    <div className="medicine-info">
                      <div className="medicine-name">{m.name}</div>
                      <div className="medicine-usage">{m.usage}</div>
                      <div className="medicine-dose">🕐 {m.dose} · 📅 {m.days} ngày</div>
                    </div>
                    <button
                      className="btn btn-ghost btn-sm"
                      style={{ position: 'absolute', top: 8, right: 8, padding: '4px 8px', fontSize: 12 }}
                      onClick={() => handleRemoveMedicine(i)}
                      title="Xóa thuốc"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ padding: 20, textAlign: 'center', color: 'var(--text-muted)', fontSize: 13 }}>
                Chưa có thuốc trong đơn. Chọn từ danh mục hoặc thêm thủ công.
              </div>
            )}

            {/* Add custom medicine */}
            <details style={{ marginTop: 12 }}>
              <summary style={{ cursor: 'pointer', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', padding: '8px 0' }}>
                ➕ Hoặc thêm thuốc thủ công
              </summary>
              <div style={{ marginTop: 8, padding: 12, background: 'var(--bg-primary)', borderRadius: 8, border: '1px dashed var(--border)' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 2fr 1.5fr 0.8fr auto', gap: 8, alignItems: 'end' }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label" style={{ fontSize: 11 }}>Tên thuốc *</label>
                    <input
                      className="form-input"
                      placeholder="VD: Paracetamol 500mg"
                      value={customMedicine.name}
                      onChange={e => setCustomMedicine({ ...customMedicine, name: e.target.value })}
                      style={{ fontSize: 12 }}
                    />
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label" style={{ fontSize: 11 }}>Công dụng</label>
                    <input
                      className="form-input"
                      placeholder="VD: Giảm đau, hạ sốt"
                      value={customMedicine.usage}
                      onChange={e => setCustomMedicine({ ...customMedicine, usage: e.target.value })}
                      style={{ fontSize: 12 }}
                    />
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label" style={{ fontSize: 11 }}>Liều dùng *</label>
                    <input
                      className="form-input"
                      placeholder="VD: 2 viên/ngày"
                      value={customMedicine.dose}
                      onChange={e => setCustomMedicine({ ...customMedicine, dose: e.target.value })}
                      style={{ fontSize: 12 }}
                    />
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label" style={{ fontSize: 11 }}>Số ngày *</label>
                    <input
                      type="number"
                      className="form-input"
                      placeholder="7"
                      value={customMedicine.days}
                      onChange={e => setCustomMedicine({ ...customMedicine, days: e.target.value })}
                      style={{ fontSize: 12 }}
                    />
                  </div>
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={handleAddCustomMedicine}
                    style={{ padding: '8px 12px', fontSize: 12 }}
                  >
                    ➕
                  </button>
                </div>
              </div>
            </details>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={onClose}>Hủy</button>
          <button className="btn btn-success" id="btn-save-exam" onClick={handleSubmit}>
            ✅ Lưu phiếu khám
          </button>
        </div>
      </div>
    </div>
  );
}
