import React, { useState } from 'react';
import { formatDate, calcAge } from '../utils/helpers';

const AVATAR_COLORS = ['#4361ee', '#3a86ff', '#06d6a0', '#ef476f', '#a855f7', '#f97316', '#118ab2', '#ffd166'];

function getInitials(name) {
  if (!name) return '?';
  const p = name.trim().split(' ');
  return p.length === 1 ? p[0][0].toUpperCase() : (p[0][0] + p[p.length - 1][0]).toUpperCase();
}
function getColor(name) {
  if (!name) return AVATAR_COLORS[0];
  let h = 0;
  for (let c of name) h = c.charCodeAt(0) + ((h << 5) - h);
  return AVATAR_COLORS[Math.abs(h) % AVATAR_COLORS.length];
}

export default function PatientsPage({ patients, onViewPatient, onAddPatient, onAddExam }) {
  const [search, setSearch] = useState('');
  const [genderFilter, setGenderFilter] = useState('Tất cả');

  const filtered = patients.filter(p => {
    const q = search.toLowerCase();
    const matchSearch = p.name.toLowerCase().includes(q) || p.id.toLowerCase().includes(q) || p.phone.includes(q);
    const matchGender = genderFilter === 'Tất cả' || p.gender === genderFilter;
    return matchSearch && matchGender;
  });

  return (
    <div>
      {/* Header */}
      <div className="section-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 18, fontWeight: 700 }}>👥 Danh sách bệnh nhân</span>
          <span className="badge badge-blue">{patients.length} người</span>
        </div>
        <div className="section-controls">
          <div className="search-bar" style={{ width: 280 }}>
            <span className="search-icon">🔍</span>
            <input
              id="search-patient"
              placeholder="Tìm tên, mã BN, SĐT..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <select
            id="filter-gender"
            className="form-select"
            style={{ width: 130 }}
            value={genderFilter}
            onChange={e => setGenderFilter(e.target.value)}
          >
            <option>Tất cả</option>
            <option>Nam</option>
            <option>Nữ</option>
          </select>
          <button id="btn-add-patient" className="btn btn-primary" onClick={onAddPatient}>
            ➕ Thêm bệnh nhân
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="card" style={{ padding: 0 }}>
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Bệnh nhân</th>
                <th>Tuổi / Giới</th>
                <th>Số điện thoại</th>
                <th>Nhóm máu</th>
                <th>BHYT</th>
                <th>Lần khám</th>
                <th>Bệnh gần nhất</th>
                <th>Ngày đăng ký</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={9}>
                    <div className="empty-state">
                      <div className="empty-state-icon">🔍</div>
                      <div className="empty-state-text">Không tìm thấy bệnh nhân</div>
                      <div className="empty-state-sub">Thử tìm với từ khóa khác</div>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((p, idx) => {
                  const lastExam = p.examHistory[p.examHistory.length - 1];
                  const color = getColor(p.name);
                  return (
                    <tr key={p.id} onClick={() => onViewPatient(p)}>
                      <td>
                        <div className="patient-info">
                          <div className="patient-avatar" style={{ background: color }}>
                            {getInitials(p.name)}
                          </div>
                          <div>
                            <div className="patient-name-cell">{p.name}</div>
                            <div className="patient-id-cell">{p.id}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span style={{ fontWeight: 600 }}>{calcAge(p.dob)}</span>
                        <span className="badge badge-gray" style={{ marginLeft: 6 }}>
                          {p.gender === 'Nam' ? '♂' : '♀'} {p.gender}
                        </span>
                      </td>
                      <td style={{ fontFamily: 'monospace', letterSpacing: '0.02em' }}>{p.phone}</td>
                      <td>
                        {p.bloodType
                          ? <span className="badge badge-red">{p.bloodType}</span>
                          : <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>—</span>
                        }
                      </td>
                      <td>
                        {p.insurance
                          ? <span className="badge badge-green">✓ Có</span>
                          : <span className="badge badge-gray">Không</span>
                        }
                      </td>
                      <td>
                        <span style={{ fontSize: 16, fontWeight: 800, color: 'var(--primary-light)' }}>
                          {p.examHistory.length}
                        </span>
                        <span style={{ fontSize: 11, color: 'var(--text-muted)', marginLeft: 4 }}>lần</span>
                      </td>
                      <td>
                        {lastExam
                          ? <span className="badge badge-blue">{lastExam.disease}</span>
                          : <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>Chưa khám</span>
                        }
                      </td>
                      <td style={{ color: 'var(--text-secondary)', fontSize: 12 }}>
                        {formatDate(p.createdAt)}
                      </td>
                      <td onClick={e => e.stopPropagation()}>
                        <div style={{ display: 'flex', gap: 6 }}>
                          <button
                            className="btn btn-ghost btn-sm"
                            title="Xem hồ sơ"
                            onClick={() => onViewPatient(p)}
                          >📂</button>
                          <button
                            className="btn btn-primary btn-sm"
                            title="Thêm lần khám"
                            onClick={() => onAddExam(p)}
                          >🩺</button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
