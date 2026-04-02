import React, { useState } from 'react';
import { DISEASE_LIST, DISEASE_MEDICINES, DOCTORS } from '../data/mockData';

export default function AddPatientModal({ onClose, onSave }) {
  const [form, setForm] = useState({
    name: '', dob: '', gender: 'Nữ', phone: '', address: '',
    bloodType: '', insurance: '',
    // First exam
    disease: '', symptoms: '', doctor: DOCTORS[0], notes: '', fee: '',
  });
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [medicines, setMedicines] = useState([]);

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
    if (!form.name.trim()) return alert('Vui lòng nhập tên bệnh nhân!');
    if (!form.dob) return alert('Vui lòng nhập ngày sinh!');
    if (!form.phone.trim()) return alert('Vui lòng nhập số điện thoại!');

    const newPatient = {
      id: 'BN' + String(Date.now()).slice(-4).padStart(4, '0'),
      name: form.name,
      dob: form.dob,
      gender: form.gender,
      phone: form.phone,
      address: form.address,
      bloodType: form.bloodType,
      insurance: form.insurance,
      createdAt: new Date().toISOString().split('T')[0],
      examHistory: form.disease ? [{
        id: 'KB' + Date.now(),
        date: new Date().toISOString().split('T')[0],
        disease: form.disease,
        symptoms: form.symptoms,
        doctor: form.doctor,
        medicines: medicines,
        notes: form.notes,
        fee: parseInt(form.fee) || 0,
      }] : [],
    };
    onSave(newPatient);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal modal-lg">
        <div className="modal-header">
          <div className="modal-title">➕ Thêm bệnh nhân mới</div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          {/* Patient Info */}
          <div style={{ marginBottom: 12, fontSize: 13, fontWeight: 700, color: 'var(--primary-light)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            👤 Thông tin bệnh nhân
          </div>
          <div className="form-grid">
            <div className="form-group full-width">
              <label className="form-label">Họ và tên *</label>
              <input
                id="pat-name"
                className="form-input"
                placeholder="Ví dụ: Nguyễn Thị Hoa"
                value={form.name}
                onChange={e => handleChange('name', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Ngày sinh *</label>
              <input
                id="pat-dob"
                type="date"
                className="form-input"
                value={form.dob}
                onChange={e => handleChange('dob', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Giới tính</label>
              <select id="pat-gender" className="form-select" value={form.gender} onChange={e => handleChange('gender', e.target.value)}>
                <option>Nữ</option>
                <option>Nam</option>
                <option>Khác</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Số điện thoại *</label>
              <input
                id="pat-phone"
                className="form-input"
                placeholder="0912 345 678"
                value={form.phone}
                onChange={e => handleChange('phone', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Nhóm máu</label>
              <select id="pat-blood" className="form-select" value={form.bloodType} onChange={e => handleChange('bloodType', e.target.value)}>
                <option value="">-- Chọn --</option>
                {['A+','A-','B+','B-','AB+','AB-','O+','O-'].map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div className="form-group full-width">
              <label className="form-label">Địa chỉ</label>
              <input
                id="pat-address"
                className="form-input"
                placeholder="Số nhà, đường, quận, thành phố"
                value={form.address}
                onChange={e => handleChange('address', e.target.value)}
              />
            </div>
            <div className="form-group full-width">
              <label className="form-label">Số thẻ BHYT</label>
              <input
                id="pat-insurance"
                className="form-input"
                placeholder="Ví dụ: 3700123456789 (bỏ trống nếu không có)"
                value={form.insurance}
                onChange={e => handleChange('insurance', e.target.value)}
              />
            </div>
          </div>

          <hr className="form-divider" style={{ margin: '16px 0' }} />

          {/* First Exam */}
          <div style={{ marginBottom: 12, fontSize: 13, fontWeight: 700, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            🩺 Lần khám đầu tiên (tùy chọn)
          </div>
          <div className="form-grid">
            <div className="form-group full-width form-group-relative">
              <label className="form-label">Bệnh / Chẩn đoán</label>
              <input
                id="pat-disease"
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
              <label className="form-label">Triệu chứng</label>
              <textarea
                id="pat-symptoms"
                className="form-textarea"
                placeholder="Mô tả triệu chứng của bệnh nhân..."
                value={form.symptoms}
                onChange={e => handleChange('symptoms', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Bác sĩ khám</label>
              <select id="pat-doctor" className="form-select" value={form.doctor} onChange={e => handleChange('doctor', e.target.value)}>
                {DOCTORS.map(d => <option key={d}>{d}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Phí khám (VNĐ)</label>
              <input
                id="pat-fee"
                type="number"
                className="form-input"
                placeholder="200000"
                value={form.fee}
                onChange={e => handleChange('fee', e.target.value)}
              />
            </div>
            <div className="form-group full-width">
              <label className="form-label">Ghi chú / Lời dặn</label>
              <textarea
                id="pat-notes"
                className="form-textarea"
                placeholder="Lời dặn cho bệnh nhân..."
                value={form.notes}
                onChange={e => handleChange('notes', e.target.value)}
              />
            </div>
          </div>

          {/* Medicine Suggestions */}
          {medicines.length > 0 && (
            <div style={{ marginTop: 8 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--accent)', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                💊 Thuốc gợi ý cho <em>{form.disease}</em>
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
        </div>

        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={onClose}>Hủy</button>
          <button className="btn btn-primary" id="btn-save-patient" onClick={handleSubmit}>
            💾 Lưu bệnh nhân
          </button>
        </div>
      </div>
    </div>
  );
}
