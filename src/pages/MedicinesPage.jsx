import React, { useState } from 'react';
import { DISEASE_MEDICINES, DISEASE_LIST } from '../data/mockData';

export default function MedicinesPage() {
  const [search, setSearch] = useState('');
  const [selectedDisease, setSelectedDisease] = useState('Tất cả');

  const allMedicines = [];
  Object.entries(DISEASE_MEDICINES).forEach(([disease, meds]) => {
    meds.forEach(m => allMedicines.push({ ...m, disease }));
  });

  const filtered = allMedicines.filter(m => {
    const q = search.toLowerCase();
    const matchSearch = !search || m.name.toLowerCase().includes(q) || m.usage.toLowerCase().includes(q) || m.disease.toLowerCase().includes(q);
    const matchDisease = selectedDisease === 'Tất cả' || m.disease === selectedDisease;
    return matchSearch && matchDisease;
  });

  return (
    <div>
      <div className="section-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 18, fontWeight: 700 }}>💊 Danh mục thuốc</span>
          <span className="badge badge-green">{allMedicines.length} loại</span>
        </div>
        <div className="section-controls">
          <div className="search-bar" style={{ width: 260 }}>
            <span className="search-icon">🔍</span>
            <input
              id="search-medicine"
              placeholder="Tìm tên thuốc, công dụng..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <select
            id="filter-disease"
            className="form-select"
            style={{ width: 200 }}
            value={selectedDisease}
            onChange={e => setSelectedDisease(e.target.value)}
          >
            <option>Tất cả</option>
            {DISEASE_LIST.map(d => <option key={d}>{d}</option>)}
          </select>
        </div>
      </div>

      {/* Disease tabs */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
        {['Tất cả', ...DISEASE_LIST].map(d => (
          <button
            key={d}
            className={`badge ${selectedDisease === d ? 'badge-blue' : 'badge-gray'}`}
            style={{ cursor: 'pointer', padding: '6px 14px', fontSize: 12, border: 'none', fontWeight: 600, transition: 'all 0.2s' }}
            onClick={() => setSelectedDisease(d)}
          >
            {d === 'Tất cả' ? '📋 Tất cả' : d}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <div className="empty-state-icon">💊</div>
            <div className="empty-state-text">Không tìm thấy thuốc nào</div>
            <div className="empty-state-sub">Thử tìm với từ khóa khác</div>
          </div>
        </div>
      ) : (
        <div className="medicine-grid">
          {filtered.map((m, i) => (
            <div key={`${m.name}-${i}`} className="medicine-card">
              <div className="medicine-card-header">
                <div className="medicine-card-icon">💊</div>
                <div>
                  <div className="medicine-card-name">{m.name}</div>
                  <div className="medicine-card-disease">{m.disease}</div>
                </div>
              </div>
              <div className="medicine-card-usage">
                <div style={{ marginBottom: 6 }}>{m.usage}</div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  <span className="badge badge-green" style={{ fontSize: 10 }}>🕐 {m.dose}</span>
                  <span className="badge badge-blue" style={{ fontSize: 10 }}>📅 {m.days} ngày</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Summary by disease */}
      <div style={{ marginTop: 24 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 14 }}>
          📊 Tổng quan theo bệnh
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 10 }}>
          {DISEASE_LIST.map((disease, i) => (
            <div
              key={disease}
              className="card"
              style={{ padding: '12px 16px', cursor: 'pointer', transition: 'all 0.2s' }}
              onClick={() => setSelectedDisease(disease)}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{disease}</div>
                <span className="badge badge-green" style={{ fontSize: 10 }}>{DISEASE_MEDICINES[disease].length} thuốc</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
