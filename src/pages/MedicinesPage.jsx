import React, { useState, useEffect } from 'react';
import { useMedicines } from '../hooks/useMedicines';
import { medicinesAPI } from '../services/supabase';

export default function MedicinesPage() {
  const { diseaseMedicines, diseaseList, loading, reload } = useMedicines();
  const [search, setSearch] = useState('');
  const [selectedDisease, setSelectedDisease] = useState('Tất cả');
  const [showModal, setShowModal] = useState(false);
  const [editingMedicine, setEditingMedicine] = useState(null);
  const [form, setForm] = useState({ name: '', disease: '', usage: '', dose: '', days: '' });

  const allMedicines = [];
  Object.entries(diseaseMedicines).forEach(([disease, meds]) => {
    meds.forEach(m => allMedicines.push({ ...m, disease }));
  });

  // Load full medicines with ID
  const [fullMedicines, setFullMedicines] = useState([]);
  
  useEffect(() => {
    loadFullMedicines();
  }, []);

  const loadFullMedicines = async () => {
    try {
      const data = await medicinesAPI.getAll();
      setFullMedicines(data);
    } catch (error) {
      console.error('Error loading medicines:', error);
    }
  };

  const filtered = fullMedicines.filter(m => {
    const q = search.toLowerCase();
    const matchSearch = !search || m.name.toLowerCase().includes(q) || m.usage.toLowerCase().includes(q) || m.disease.toLowerCase().includes(q);
    const matchDisease = selectedDisease === 'Tất cả' || m.disease === selectedDisease;
    return matchSearch && matchDisease;
  });

  const handleAdd = () => {
    setEditingMedicine(null);
    setForm({ name: '', disease: diseaseList[0] || '', usage: '', dose: '', days: '' });
    setShowModal(true);
  };

  const handleEdit = (medicine) => {
    setEditingMedicine(medicine);
    setForm({ 
      name: medicine.name, 
      disease: medicine.disease, 
      usage: medicine.usage, 
      dose: medicine.dose, 
      days: medicine.days 
    });
    setShowModal(true);
  };

  const handleDelete = async (medicine) => {
    if (!confirm(`Xóa thuốc "${medicine.name}"?`)) return;
    
    try {
      await medicinesAPI.delete(medicine.id);
      await loadFullMedicines();
      await reload();
      alert('Đã xóa thuốc!');
    } catch (error) {
      console.error('Error deleting medicine:', error);
      alert('Lỗi khi xóa: ' + error.message);
    }
  };

  const handleSave = async () => {
    if (!form.name.trim()) return alert('Vui lòng nhập tên thuốc!');
    if (!form.disease.trim()) return alert('Vui lòng chọn bệnh!');
    if (!form.dose.trim()) return alert('Vui lòng nhập liều dùng!');
    if (!form.days) return alert('Vui lòng nhập số ngày!');

    try {
      const medicineData = {
        name: form.name,
        disease: form.disease,
        usage: form.usage,
        dose: form.dose,
        days: parseInt(form.days)
      };

      if (editingMedicine) {
        await medicinesAPI.update(editingMedicine.id, medicineData);
        alert('Đã cập nhật thuốc!');
      } else {
        await medicinesAPI.create(medicineData);
        alert('Đã thêm thuốc mới!');
      }

      await loadFullMedicines();
      await reload();
      setShowModal(false);
    } catch (error) {
      console.error('Error saving medicine:', error);
      alert('Lỗi khi lưu: ' + error.message);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-secondary)' }}>
        ⏳ Đang tải danh mục thuốc...
      </div>
    );
  }

  return (
    <div>
      <div className="section-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 18, fontWeight: 700 }}>💊 Danh mục thuốc</span>
          <span className="badge badge-green">{fullMedicines.length} loại</span>
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
            {diseaseList.map(d => <option key={d}>{d}</option>)}
          </select>
          <button className="btn btn-primary" onClick={handleAdd}>
            ➕ Thêm thuốc
          </button>
        </div>
      </div>

      {/* Disease tabs */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
        {['Tất cả', ...diseaseList].map(d => (
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
            <div key={m.id || i} className="medicine-card">
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
              <div style={{ marginTop: 8, display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                <button 
                  className="btn btn-ghost btn-sm" 
                  onClick={() => handleEdit(m)}
                  style={{ fontSize: 11, padding: '4px 8px' }}
                >
                  ✏️ Sửa
                </button>
                <button 
                  className="btn btn-ghost btn-sm" 
                  onClick={() => handleDelete(m)}
                  style={{ fontSize: 11, padding: '4px 8px', color: 'var(--error)' }}
                >
                  🗑️ Xóa
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal them sua thuoc */}
      {showModal && (
        <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) setShowModal(false); }}>
          <div className="modal">
            <div className="modal-header">
              <div className="modal-title">{editingMedicine ? '✏️ Sửa thuốc' : '➕ Thêm thuốc mới'}</div>
              <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
            </div>

            <div className="modal-body">
              <div className="form-grid">
                <div className="form-group full-width">
                  <label className="form-label">Tên thuốc *</label>
                  <input
                    className="form-input"
                    placeholder="VD: Paracetamol 500mg"
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                  />
                </div>

                <div className="form-group full-width">
                  <label className="form-label">Bệnh / Chỉ định *</label>
                  <input
                    className="form-input"
                    placeholder="VD: Viêm âm đạo"
                    value={form.disease}
                    onChange={e => setForm({ ...form, disease: e.target.value })}
                    list="disease-list"
                  />
                  <datalist id="disease-list">
                    {diseaseList.map(d => <option key={d} value={d} />)}
                  </datalist>
                </div>

                <div className="form-group full-width">
                  <label className="form-label">Công dụng</label>
                  <textarea
                    className="form-textarea"
                    placeholder="VD: Kháng sinh trị nhiễm khuẩn âm đạo"
                    value={form.usage}
                    onChange={e => setForm({ ...form, usage: e.target.value })}
                    rows={2}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Liều dùng *</label>
                  <input
                    className="form-input"
                    placeholder="VD: 2 viên/ngày"
                    value={form.dose}
                    onChange={e => setForm({ ...form, dose: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Số ngày *</label>
                  <input
                    type="number"
                    className="form-input"
                    placeholder="VD: 7"
                    value={form.days}
                    onChange={e => setForm({ ...form, days: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={() => setShowModal(false)}>Hủy</button>
              <button className="btn btn-primary" onClick={handleSave}>
                💾 {editingMedicine ? 'Cập nhật' : 'Thêm mới'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
