import React from 'react';
import { formatCurrency, formatDate } from '../utils/helpers';

export default function DashboardPage({ patients, onNavigate, onAddPatient }) {
  const totalPatients = patients.length;
  const today = new Date().toISOString().split('T')[0];
  const totalExams = patients.reduce((s, p) => s + p.examHistory.length, 0);
  const monthRevenue = patients.reduce((s, p) =>
    s + p.examHistory.reduce((x, e) => x + (e.fee || 0), 0), 0
  );

  // Recent patients (last 5)
  const recentPatients = [...patients]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  // Recent exams
  const allExams = [];
  patients.forEach(p => {
    p.examHistory.forEach(e => allExams.push({ ...e, patientName: p.name, patientId: p.id }));
  });
  const recentExams = allExams
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  const diseaseCount = {};
  patients.forEach(p => p.examHistory.forEach(e => {
    diseaseCount[e.disease] = (diseaseCount[e.disease] || 0) + 1;
  }));
  const topDiseases = Object.entries(diseaseCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4);

  return (
    <div>
      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card blue">
          <div className="stat-card-top">
            <div className="stat-icon">👥</div>
            <div className="stat-trend up">+12%</div>
          </div>
          <div className="stat-value">{totalPatients}</div>
          <div className="stat-label">Tổng bệnh nhân</div>
        </div>
        <div className="stat-card green">
          <div className="stat-card-top">
            <div className="stat-icon">🩺</div>
            <div className="stat-trend up">+8%</div>
          </div>
          <div className="stat-value">{totalExams}</div>
          <div className="stat-label">Tổng lần khám</div>
        </div>
        <div className="stat-card yellow">
          <div className="stat-card-top">
            <div className="stat-icon">💰</div>
            <div className="stat-trend up">+15%</div>
          </div>
          <div className="stat-value" style={{ fontSize: 20 }}>
            {monthRevenue >= 1000000
              ? (monthRevenue / 1000000).toFixed(1) + 'M'
              : (monthRevenue / 1000).toFixed(0) + 'K'} ₫
          </div>
          <div className="stat-label">Tổng doanh thu</div>
        </div>
        <div className="stat-card red">
          <div className="stat-card-top">
            <div className="stat-icon">💊</div>
            <div className="stat-trend up">10 loại</div>
          </div>
          <div className="stat-value">{Object.keys(diseaseCount).length}</div>
          <div className="stat-label">Bệnh đã chẩn đoán</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions" style={{ gridTemplateColumns: 'repeat(4,1fr)' }}>
        <button id="qa-add-patient" className="quick-action-btn" onClick={onAddPatient}>
          <span className="quick-action-icon">➕</span>
          <span className="quick-action-label">Thêm bệnh nhân</span>
        </button>
        <button id="qa-go-exam" className="quick-action-btn" onClick={() => onNavigate('examination')}>
          <span className="quick-action-icon">📋</span>
          <span className="quick-action-label">Tạo phiếu khám</span>
        </button>
        <button id="qa-go-medicine" className="quick-action-btn" onClick={() => onNavigate('medicines')}>
          <span className="quick-action-icon">💊</span>
          <span className="quick-action-label">Danh mục thuốc</span>
        </button>
        <button id="qa-go-history" className="quick-action-btn" onClick={() => onNavigate('history')}>
          <span className="quick-action-icon">🗂️</span>
          <span className="quick-action-label">Tra lịch sử khám</span>
        </button>
      </div>

      {/* Bottom Row */}
      <div className="two-col">
        {/* Recent Patients */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">📋 Bệnh nhân mới</div>
            <button className="btn btn-ghost btn-sm" onClick={() => onNavigate('patients')}>Xem tất cả →</button>
          </div>
          <div className="today-list">
            {recentPatients.map((p, i) => (
              <div key={p.id} className="today-item">
                <div className="patient-avatar" style={{ background: AVATAR_COLORS[i % AVATAR_COLORS.length], width: 36, height: 36, fontSize: 13 }}>
                  {getInitials(p.name)}
                </div>
                <div className="today-item-info">
                  <div className="today-item-name">{p.name}</div>
                  <div className="today-item-disease">{p.examHistory.length > 0 ? p.examHistory[p.examHistory.length - 1].disease : 'Chưa khám'}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span className="badge badge-blue">{p.examHistory.length} lần</span>
                  <div className="today-item-time">{formatDate(p.createdAt)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Diseases + Recent Exams */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="card">
            <div className="card-header">
              <div className="card-title">🏥 Bệnh phổ biến</div>
            </div>
            {topDiseases.map(([disease, count], i) => (
              <div key={disease} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                <div style={{ width: 24, height: 24, borderRadius: 6, background: TOP_COLORS[i], display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, color: 'white', fontWeight: 700, flexShrink: 0 }}>
                  {i + 1}
                </div>
                <div style={{ flex: 1, fontSize: 13, color: 'var(--text-primary)' }}>{disease}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ width: 80, height: 6, background: 'var(--bg-hover)', borderRadius: 3, overflow: 'hidden' }}>
                    <div style={{ width: `${(count / totalExams) * 100}%`, height: '100%', background: TOP_COLORS[i], borderRadius: 3 }} />
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', minWidth: 20 }}>{count}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="card" style={{ flex: 1 }}>
            <div className="card-header">
              <div className="card-title">🕐 Lần khám gần nhất</div>
            </div>
            {recentExams.slice(0, 3).map(e => (
              <div key={e.id} style={{ display: 'flex', gap: 10, padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
                <span style={{ fontSize: 20 }}>🩺</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{e.patientName}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{e.disease}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{formatDate(e.date)}</div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--warning-dark)' }}>{formatCurrency(e.fee || 0)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const AVATAR_COLORS = ['#4361ee', '#06d6a0', '#ef476f', '#a855f7', '#f97316'];
const TOP_COLORS = ['#4361ee', '#06d6a0', '#ef476f', '#ffd166'];

function getInitials(name) {
  if (!name) return '?';
  const p = name.trim().split(' ');
  return p.length === 1 ? p[0][0].toUpperCase() : (p[0][0] + p[p.length - 1][0]).toUpperCase();
}
