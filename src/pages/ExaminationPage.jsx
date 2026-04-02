import React, { useState } from 'react';
import { DISEASE_LIST, DISEASE_MEDICINES, DOCTORS } from '../data/mockData';
import { formatCurrency } from '../utils/helpers';

export default function ExaminationPage({ patients, onSaveExam, onAddPatient }) {
  const [search, setSearch] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [form, setForm] = useState({
    disease: '', symptoms: '', doctor: DOCTORS[0], notes: '', fee: '',
  });
  const [medicines, setMedicines] = useState([]);
  const [showDiseaseSuggestions, setShowDiseaseSuggestions] = useState(false);
  const [saved, setSaved] = useState(false);

  const filteredPatients = search
    ? patients.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.id.toLowerCase().includes(search.toLowerCase()) ||
        p.phone.includes(search)
      )
    : [];

  const filteredDiseases = DISEASE_LIST.filter(d =>
    d.toLowerCase().includes(form.disease.toLowerCase()) && form.disease
  );

  const handleSelectPatient = (p) => {
    setSelectedPatient(p);
    setSearch(p.name);
    setSaved(false);
    setForm({ disease: '', symptoms: '', doctor: DOCTORS[0], notes: '', fee: '' });
    setMedicines([]);
  };

  const handleDiseaseChange = (val) => {
    setForm(f => ({ ...f, disease: val }));
    setMedicines(DISEASE_MEDICINES[val] || []);
    setShowDiseaseSuggestions(true);
  };

  const handleDiseaseSelect = (disease) => {
    setForm(f => ({ ...f, disease }));
    setMedicines(DISEASE_MEDICINES[disease] || []);
    setShowDiseaseSuggestions(false);
  };

  const handleSave = () => {
    if (!selectedPatient) return alert('Vui lòng chọn bệnh nhân!');
    if (!form.disease.trim()) return alert('Vui lòng nhập bệnh / chẩn đoán!');
    if (!form.symptoms.trim()) return alert('Vui lòng nhập triệu chứng!');

    const exam = {
      id: 'KB' + Date.now(),
      date: new Date().toISOString().split('T')[0],
      disease: form.disease,
      symptoms: form.symptoms,
      doctor: form.doctor,
      medicines: medicines,
      notes: form.notes,
      fee: parseInt(form.fee) || 0,
    };
    onSaveExam(selectedPatient.id, exam);
    setSaved(true);
  };

  const handleReset = () => {
    setSelectedPatient(null);
    setSearch('');
    setForm({ disease: '', symptoms: '', doctor: DOCTORS[0], notes: '', fee: '' });
    setMedicines([]);
    setSaved(false);
  };

  const lastExam = selectedPatient?.examHistory?.[selectedPatient.examHistory.length - 1];

  return (
    <div className="two-col" style={{ alignItems: 'flex-start' }}>
      {/* Left: Patient Selection + Form */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* Select patient */}
        <div className="card">
          <div className="card-title" style={{ marginBottom: 12 }}>🔍 Chọn bệnh nhân</div>
          <div style={{ position: 'relative' }}>
            <div className="search-bar">
              <span className="search-icon">🔍</span>
              <input
                id="exam-search-patient"
                placeholder="Nhập tên hoặc mã bệnh nhân..."
                value={search}
                onChange={e => { setSearch(e.target.value); setSelectedPatient(null); setSaved(false); }}
              />
            </div>
            {filteredPatients.length > 0 && !selectedPatient && (
              <div className="disease-suggestion" style={{ top: '100%', zIndex: 50 }}>
                {filteredPatients.map(p => (
                  <div key={p.id} className="disease-suggestion-item" onClick={() => handleSelectPatient(p)}>
                    <span>👤</span>
                    <div>
                      <div style={{ fontWeight: 600 }}>{p.name}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{p.id} · {p.phone}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          {!selectedPatient && search && filteredPatients.length === 0 && (
            <div style={{ marginTop: 10, textAlign: 'center', fontSize: 13, color: 'var(--text-secondary)' }}>
              Không tìm thấy. <span
                style={{ color: 'var(--primary-light)', cursor: 'pointer', fontWeight: 600 }}
                onClick={onAddPatient}
              >+ Thêm bệnh nhân mới</span>
            </div>
          )}
          {selectedPatient && (
            <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', background: 'rgba(6,214,160,0.1)', border: '1px solid rgba(6,214,160,0.25)', borderRadius: 8 }}>
              <span style={{ fontSize: 24 }}>✅</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{selectedPatient.name}</div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{selectedPatient.id} · Đã khám {selectedPatient.examHistory.length} lần</div>
              </div>
              <button className="btn btn-ghost btn-sm" onClick={handleReset}>✕</button>
            </div>
          )}
        </div>

        {/* Exam Form */}
        {selectedPatient && !saved && (
          <div className="card">
            <div className="card-title" style={{ marginBottom: 14 }}>📋 Thông tin lần khám</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div className="form-group form-group-relative">
                <label className="form-label">Bệnh / Chẩn đoán *</label>
                <input
                  id="ex-disease"
                  className="form-input"
                  placeholder="Nhập tên bệnh..."
                  value={form.disease}
                  onChange={e => handleDiseaseChange(e.target.value)}
                  onFocus={() => setShowDiseaseSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowDiseaseSuggestions(false), 200)}
                  autoComplete="off"
                />
                {showDiseaseSuggestions && filteredDiseases.length > 0 && (
                  <div className="disease-suggestion">
                    {filteredDiseases.map(d => (
                      <div key={d} className="disease-suggestion-item" onMouseDown={() => handleDiseaseSelect(d)}>
                        🏷️ {d}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="form-group">
                <label className="form-label">Triệu chứng *</label>
                <textarea id="ex-symptoms" className="form-textarea" placeholder="Mô tả triệu chứng..." value={form.symptoms} onChange={e => setForm(f => ({ ...f, symptoms: e.target.value }))} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div className="form-group">
                  <label className="form-label">Bác sĩ</label>
                  <select id="ex-doctor" className="form-select" value={form.doctor} onChange={e => setForm(f => ({ ...f, doctor: e.target.value }))}>
                    {DOCTORS.map(d => <option key={d}>{d}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Phí khám (VNĐ)</label>
                  <input id="ex-fee" type="number" className="form-input" placeholder="200000" value={form.fee} onChange={e => setForm(f => ({ ...f, fee: e.target.value }))} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Ghi chú / Lời dặn</label>
                <textarea id="ex-notes" className="form-textarea" placeholder="Lời dặn cho bệnh nhân..." value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} />
              </div>
              <button id="btn-save-exam-page" className="btn btn-success" style={{ width: '100%', justifyContent: 'center' }} onClick={handleSave}>
                ✅ Lưu phiếu khám
              </button>
            </div>
          </div>
        )}

        {saved && (
          <div className="card" style={{ textAlign: 'center', padding: 32 }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>✅</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--accent)', marginBottom: 6 }}>Đã lưu phiếu khám!</div>
            <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 16 }}>
              Phiếu khám cho <strong>{selectedPatient.name}</strong> đã được lưu thành công.
            </div>
            <button className="btn btn-primary" style={{ margin: '0 auto' }} onClick={handleReset}>
              ➕ Tạo phiếu khám mới
            </button>
          </div>
        )}
      </div>

      {/* Right: Medicine Suggestions + History */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* Medicines */}
        <div className="card">
          <div className="card-title" style={{ marginBottom: 12 }}>💊 Thuốc gợi ý</div>
          {medicines.length === 0 ? (
            <div className="empty-state" style={{ padding: '30px 20px' }}>
              <div className="empty-state-icon" style={{ fontSize: 36 }}>💊</div>
              <div className="empty-state-text">Chọn bệnh để xem thuốc</div>
              <div className="empty-state-sub">Nhập tên bệnh vào ô chẩn đoán</div>
            </div>
          ) : (
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
          )}
        </div>

        {/* Previous exam */}
        {selectedPatient && lastExam && (
          <div className="card">
            <div className="card-title" style={{ marginBottom: 12 }}>🕐 Lần khám trước</div>
            <div style={{ padding: 12, background: 'var(--bg-hover)', borderRadius: 8, border: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span className="badge badge-blue">{lastExam.disease}</span>
                <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{new Date(lastExam.date).toLocaleDateString('vi-VN')}</span>
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 6 }}>{lastExam.symptoms}</div>
              <div style={{ fontSize: 12, color: 'var(--primary-light)' }}>👨‍⚕️ {lastExam.doctor}</div>
              {lastExam.notes && <div style={{ fontSize: 11, color: 'var(--text-muted)', fontStyle: 'italic', marginTop: 4 }}>💡 {lastExam.notes}</div>}
            </div>
          </div>
        )}

        {/* All diseases quick ref */}
        <div className="card">
          <div className="card-title" style={{ marginBottom: 10 }}>📖 Tra cứu nhanh</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {DISEASE_LIST.map(d => (
              <span
                key={d}
                className="badge badge-gray"
                style={{ cursor: 'pointer', transition: 'all 0.2s' }}
                onClick={() => {
                  if (selectedPatient) {
                    handleDiseaseSelect(d);
                    setForm(f => ({ ...f, disease: d }));
                  }
                }}
              >
                {d}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
