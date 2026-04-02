import React, { useState } from 'react';
import { formatDate, formatCurrency, calcAge } from '../utils/helpers';

export default function HistoryPage({ patients, onViewPatient }) {
  const [search, setSearch] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [diseaseFilter, setDiseaseFilter] = useState('');

  // All exams
  const allExams = [];
  patients.forEach(p => {
    p.examHistory.forEach(e => {
      allExams.push({ ...e, patient: p });
    });
  });
  
  // Sort by date (newest first) - handle both 'date' and 'examDate'
  allExams.sort((a, b) => {
    const dateA = new Date(a.date || a.examDate);
    const dateB = new Date(b.date || b.examDate);
    return dateB - dateA;
  });
  
  console.log('All exams sorted:', allExams.map(e => ({ 
    disease: e.disease, 
    date: e.date || e.examDate,
    patient: e.patient.name 
  })));

  // Filter
  const filtered = allExams.filter(e => {
    const q = search.toLowerCase();
    const matchSearch = !search ||
      e.patient.name.toLowerCase().includes(q) ||
      e.patient.id.toLowerCase().includes(q) ||
      e.disease.toLowerCase().includes(q);
    const matchPatient = !selectedPatient || e.patient.id === selectedPatient.id;
    const matchDisease = !diseaseFilter || e.disease === diseaseFilter;
    return matchSearch && matchPatient && matchDisease;
  });

  // Unique diseases
  const diseases = [...new Set(allExams.map(e => e.disease))];

  // Quick lookup list
  const matchedPatients = search.length > 1
    ? patients.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.id.toLowerCase().includes(search.toLowerCase())
      )
    : [];

  return (
    <div>
      <div className="section-header">
        <div style={{ fontSize: 18, fontWeight: 700 }}>🗂️ Lịch sử khám bệnh</div>
        <div className="section-controls">
          <div className="search-bar" style={{ width: 300 }}>
            <span className="search-icon">🔍</span>
            <input
              id="search-history"
              placeholder="Nhập tên bệnh nhân, mã BN, tên bệnh..."
              value={search}
              onChange={e => { setSearch(e.target.value); setSelectedPatient(null); }}
            />
          </div>
          <select
            id="filter-disease-history"
            className="form-select"
            style={{ width: 180 }}
            value={diseaseFilter}
            onChange={e => setDiseaseFilter(e.target.value)}
          >
            <option value="">Tất cả bệnh</option>
            {diseases.map(d => <option key={d}>{d}</option>)}
          </select>
          {(selectedPatient || diseaseFilter) && (
            <button className="btn btn-ghost btn-sm" onClick={() => { setSelectedPatient(null); setDiseaseFilter(''); setSearch(''); }}>
              ✕ Xóa filter
            </button>
          )}
        </div>
      </div>

      <div className="two-col" style={{ alignItems: 'flex-start' }}>
        {/* Patient list for quick select */}
        <div>
          {search && matchedPatients.length > 0 && !selectedPatient && (
            <div className="card" style={{ marginBottom: 16 }}>
              <div className="card-title" style={{ marginBottom: 10, fontSize: 13 }}>👤 Chọn bệnh nhân</div>
              {matchedPatients.map(p => (
                <div
                  key={p.id}
                  className="today-item"
                  style={{ marginBottom: 6 }}
                  onClick={() => { setSelectedPatient(p); setSearch(p.name); }}
                >
                  <span style={{ fontSize: 22 }}>👤</span>
                  <div className="today-item-info">
                    <div className="today-item-name">{p.name}</div>
                    <div className="today-item-disease">{p.id} · {p.examHistory.length} lần khám</div>
                  </div>
                  <span className="badge badge-blue">Xem →</span>
                </div>
              ))}
            </div>
          )}

          {/* Selected patient profile */}
          {selectedPatient && (
            <div className="card" style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'linear-gradient(135deg, #4361ee, #3a86ff)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 18, color: 'white' }}>
                  {getInitials(selectedPatient.name)}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 16 }}>{selectedPatient.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{selectedPatient.id} · {calcAge(selectedPatient.dob)} tuổi · {selectedPatient.gender}</div>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                <div className="info-item">
                  <div className="info-item-label">Số điện thoại</div>
                  <div className="info-item-value">{selectedPatient.phone}</div>
                </div>
                <div className="info-item">
                  <div className="info-item-label">Tổng khám</div>
                  <div className="info-item-value" style={{ color: 'var(--primary-light)' }}>{selectedPatient.examHistory.length} lần</div>
                </div>
              </div>
              <button className="btn btn-primary btn-sm" style={{ marginTop: 10, width: '100%', justifyContent: 'center' }} onClick={() => onViewPatient(selectedPatient)}>
                📂 Xem hồ sơ đầy đủ
              </button>
            </div>
          )}

          {/* Summary stats */}
          <div className="card">
            <div className="card-title" style={{ marginBottom: 12, fontSize: 13 }}>📊 Thống kê lịch sử</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                <span style={{ color: 'var(--text-secondary)' }}>Tổng phiếu khám</span>
                <span style={{ fontWeight: 700 }}>{allExams.length}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                <span style={{ color: 'var(--text-secondary)' }}>Bệnh nhân</span>
                <span style={{ fontWeight: 700 }}>{patients.length}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                <span style={{ color: 'var(--text-secondary)' }}>Tổng thu</span>
                <span style={{ fontWeight: 700, color: 'var(--warning-dark)' }}>
                  {formatCurrency(allExams.reduce((s, e) => s + (e.fee || 0), 0))}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                <span style={{ color: 'var(--text-secondary)' }}>Kết quả lọc</span>
                <span style={{ fontWeight: 700, color: 'var(--accent)' }}>{filtered.length} phiếu</span>
              </div>
            </div>
          </div>
        </div>

        {/* History list */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-secondary)' }}>
              Hiển thị {filtered.length} phiếu khám
            </span>
          </div>

          {filtered.length === 0 ? (
            <div className="card">
              <div className="empty-state">
                <div className="empty-state-icon">🗂️</div>
                <div className="empty-state-text">Không tìm thấy lịch sử khám</div>
                <div className="empty-state-sub">Thử thay đổi bộ lọc</div>
              </div>
            </div>
          ) : (
            <div className="history-timeline">
              {filtered.map(e => (
                <div key={e.id} className="history-item">
                  <div className="history-dot">🩺</div>
                  <div className="history-content" style={{ cursor: 'pointer' }} onClick={() => onViewPatient(e.patient)}>
                    <div className="history-content-header">
                      <div>
                        <div className="history-disease">{e.disease}</div>
                        <div style={{ fontSize: 12, color: 'var(--primary-light)', marginTop: 2 }}>
                          👤 {e.patient.name}
                          <span style={{ color: 'var(--text-muted)', marginLeft: 6 }}>· {e.patient.id}</span>
                        </div>
                      </div>
                      <div className="history-date">{formatDate(e.date)}</div>
                    </div>
                    <div className="history-symptoms">{e.symptoms}</div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div className="history-doctor">👨‍⚕️ {e.doctor}</div>
                      <div className="history-fee">💰 {formatCurrency(e.fee || 0)}</div>
                    </div>
                    {e.notes && <div className="history-notes">💡 {e.notes}</div>}
                    {e.medicines && e.medicines.length > 0 && (
                      <div style={{ marginTop: 8, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                        {e.medicines.map((m, i) => (
                          <span key={i} className="badge badge-green" style={{ fontSize: 10 }}>💊 {m.name}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function getInitials(name) {
  if (!name) return '?';
  const p = name.trim().split(' ');
  return p.length === 1 ? p[0][0].toUpperCase() : (p[0][0] + p[p.length - 1][0]).toUpperCase();
}
