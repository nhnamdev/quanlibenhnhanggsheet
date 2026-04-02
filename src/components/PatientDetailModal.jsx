import React from 'react';
import { formatCurrency, formatDate, calcAge } from '../utils/helpers';
import { DISEASE_MEDICINES } from '../data/mockData';

export default function PatientDetailModal({ patient, onClose, onAddExam }) {
  if (!patient) return null;

  const color = getColorForPatient(patient.name);
  const initials = getInitials(patient.name);
  const age = calcAge(patient.dob);

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal modal-lg">
        <div className="modal-header">
          <div className="modal-title">
            🗂️ Hồ sơ bệnh nhân
          </div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          {/* Profile Header */}
          <div className="patient-profile-header">
            <div className="patient-profile-avatar" style={{ background: `linear-gradient(135deg, ${color}, ${color}99)` }}>
              {initials}
            </div>
            <div>
              <div className="patient-profile-name">{patient.name}</div>
              <div className="patient-profile-meta">
                <span>🪪 {patient.id}</span>
                <span>🎂 {age} tuổi</span>
                <span>{patient.gender === 'Nam' ? '👨' : '👩'} {patient.gender}</span>
                <span>📞 {patient.phone}</span>
              </div>
            </div>
          </div>

          {/* Info Grid */}
          <div className="info-grid">
            <div className="info-item">
              <div className="info-item-label">Ngày sinh</div>
              <div className="info-item-value">{formatDate(patient.dob)}</div>
            </div>
            <div className="info-item">
              <div className="info-item-label">Nhóm máu</div>
              <div className="info-item-value">{patient.bloodType || 'Chưa rõ'}</div>
            </div>
            <div className="info-item">
              <div className="info-item-label">BHYT</div>
              <div className="info-item-value" style={{ fontSize: 11 }}>{patient.insurance || 'Không có'}</div>
            </div>
            <div className="info-item" style={{ gridColumn: '1/-1' }}>
              <div className="info-item-label">Địa chỉ</div>
              <div className="info-item-value">{patient.address}</div>
            </div>
          </div>

          {/* Exam Stats */}
          <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
            <div style={{ flex: 1, background: 'rgba(67,97,238,0.12)', border: '1px solid rgba(67,97,238,0.25)', borderRadius: 8, padding: '10px 14px' }}>
              <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginBottom: 4 }}>TỔNG LẦN KHÁM</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--primary-light)' }}>{patient.examHistory.length}</div>
            </div>
            <div style={{ flex: 1, background: 'rgba(6,214,160,0.12)', border: '1px solid rgba(6,214,160,0.25)', borderRadius: 8, padding: '10px 14px' }}>
              <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginBottom: 4 }}>TỔNG CHI PHÍ</div>
              <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--accent)' }}>
                {formatCurrency(patient.examHistory.reduce((s, e) => s + (e.fee || 0), 0))}
              </div>
            </div>
            <div style={{ flex: 1, background: 'rgba(255,209,102,0.12)', border: '1px solid rgba(255,209,102,0.25)', borderRadius: 8, padding: '10px 14px' }}>
              <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginBottom: 4 }}>LẦN KHÁM GẦN NHẤT</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--warning-dark)' }}>
                {patient.examHistory.length > 0
                  ? formatDate(patient.examHistory[patient.examHistory.length - 1].date)
                  : 'Chưa có'}
              </div>
            </div>
          </div>

          {/* Exam History */}
          <div style={{ marginBottom: 8, fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 6 }}>
            📜 Lịch sử khám bệnh
            <span className="badge badge-blue" style={{ marginLeft: 8 }}>{patient.examHistory.length} lần</span>
          </div>

          {patient.examHistory.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">📋</div>
              <div className="empty-state-text">Chưa có lịch sử khám</div>
            </div>
          ) : (
            <div className="history-timeline">
              {[...patient.examHistory].reverse().map((exam, idx) => (
                <div key={exam.id} className="history-item">
                  <div className="history-dot">🩺</div>
                  <div className="history-content">
                    <div className="history-content-header">
                      <div className="history-disease">{exam.disease}</div>
                      <div className="history-date">{formatDate(exam.date)}</div>
                    </div>
                    <div className="history-symptoms">📝 {exam.symptoms}</div>
                    <div className="history-doctor">👨‍⚕️ {exam.doctor}</div>
                    {exam.notes && <div className="history-notes">💡 {exam.notes}</div>}
                    <div className="history-fee">💰 {formatCurrency(exam.fee || 0)}</div>

                    {exam.medicines && exam.medicines.length > 0 && (
                      <div style={{ marginTop: 10 }}>
                        <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 6 }}>
                          Đơn thuốc ({exam.medicines.length} loại):
                        </div>
                        <div className="medicine-list">
                          {exam.medicines.map((m, i) => (
                            <div key={i} className="medicine-item" style={{ padding: 8 }}>
                              <div className="medicine-icon" style={{ width: 26, height: 26, fontSize: 12 }}>💊</div>
                              <div className="medicine-info">
                                <div className="medicine-name" style={{ fontSize: 12 }}>{m.name}</div>
                                <div className="medicine-dose" style={{ fontSize: 11 }}>{m.dose} · {m.days} ngày</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={onClose}>Đóng</button>
          <button className="btn btn-primary" onClick={() => { onClose(); onAddExam(patient); }}>
            ➕ Thêm lần khám mới
          </button>
        </div>
      </div>
    </div>
  );
}

function getColorForPatient(name) {
  const colors = ['#4361ee', '#3a86ff', '#06d6a0', '#ef476f', '#a855f7', '#f97316'];
  if (!name) return colors[0];
  let h = 0;
  for (let c of name) h = c.charCodeAt(0) + ((h << 5) - h);
  return colors[Math.abs(h) % colors.length];
}

function getInitials(name) {
  if (!name) return '?';
  const p = name.trim().split(' ');
  if (p.length === 1) return p[0][0].toUpperCase();
  return (p[0][0] + p[p.length - 1][0]).toUpperCase();
}
