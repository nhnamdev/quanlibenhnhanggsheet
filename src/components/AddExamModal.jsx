import React, { useState } from 'react';
import { DISEASE_LIST, DISEASE_MEDICINES, DOCTORS } from '../data/mockData';

export default function AddExamModal({ patient, onClose, onSave }) {
  const [form, setForm] = useState({
    disease: '', symptoms: '', doctor: DOCTORS[0], notes: '', fee: '',
  });
  const [medicines, setMedicines] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const filteredDiseases = DISEASE_LIST.filter(d =>
    d.toLowerCase().includes(form.disease.toLowerCase()) && form.disease
  );

  const handleDiseaseSelect = (disease) => {
    setForm(f => ({ ...f, disease }));
    setMedicines(DISEASE_MEDICINES[disease] || []);
    setShowSuggestions(false);
  };

  const handleChange = (field, value) => {
    setForm(f => ({ ...f, [field]: value }));
    if (field === 'disease') {
      setShowSuggestions(true);
      setMedicines(DISEASE_MEDICINES[value] || []);
    }
  };

  const handleSubmit = () => {
    if (!form.disease.trim()) return alert('Vui lòng nhập bệnh / chẩn đoán!');
    if (!form.symptoms.trim()) return alert('Vui lòng nhập triệu chứng!');

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
                {DOCTORS.map(d => <option key={d}>{d}</option>)}
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
          {medicines.length > 0 && (
            <div style={{ marginTop: 12 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--accent)', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
                💊 Đơn thuốc gợi ý cho <em style={{ fontStyle: 'normal', color: 'var(--text-primary)' }}>{form.disease}</em>
                <span className="badge badge-green">{medicines.length} loại</span>
              </div>
              <div className="medicine-list">
                {medicines.map((m, i) => (
                  <div key={i} className="medicine-item">
                    <div className="medicine-icon">💊</div>
                    <div className="medicine-info">
                      <div className="medicine-name">{m.name}</div>
                      <div className="medicine-usage">{m.usage}</div>
                      <div className="medicine-dose">🕐 {m.dose} · 📅 {m.days} ngày</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {form.disease && medicines.length === 0 && (
            <div style={{ marginTop: 10, padding: 14, background: 'rgba(255,209,102,0.1)', border: '1px solid rgba(255,209,102,0.25)', borderRadius: 8, fontSize: 13, color: 'var(--warning-dark)' }}>
              ⚠️ Không tìm thấy danh sách thuốc gợi ý cho bệnh này. Bác sĩ sẽ tự kê đơn.
            </div>
          )}
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
