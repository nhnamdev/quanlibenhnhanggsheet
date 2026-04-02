import React from 'react';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Tổng quan', icon: '📊' },
  { id: 'patients', label: 'Quản lý bệnh nhân', icon: '👥', badge: null },
  { id: 'examination', label: 'Tạo phiếu khám', icon: '📋' },
  { id: 'medicines', label: 'Danh mục thuốc', icon: '💊' },
  { id: 'history', label: 'Lịch sử khám', icon: '🗂️' },
];

export default function Sidebar({ activePage, onNavigate }) {
  const today = new Date().toLocaleDateString('vi-VN', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  });

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">⚕️</div>
        <div className="sidebar-logo-text">
          <div className="sidebar-logo-title">MediCare O&amp;G</div>
          <div className="sidebar-logo-sub">Phòng Khám Sản Phụ Khoa</div>
        </div>
      </div>

      <nav className="sidebar-nav">
        <div className="sidebar-section-label">Chính</div>
        {NAV_ITEMS.map(item => (
          <div
            key={item.id}
            className={`nav-item ${activePage === item.id ? 'active' : ''}`}
            onClick={() => onNavigate(item.id)}
          >
            <span className="nav-item-icon">{item.icon}</span>
            <span>{item.label}</span>
            {item.badge && (
              <span className="nav-item-badge">{item.badge}</span>
            )}
          </div>
        ))}

        <div className="sidebar-section-label" style={{ marginTop: 8 }}>Hệ thống</div>
        <div className="nav-item">
          <span className="nav-item-icon">⚙️</span>
          <span>Cài đặt</span>
        </div>
        <div className="nav-item">
          <span className="nav-item-icon">📈</span>
          <span>Báo cáo</span>
        </div>
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div className="sidebar-user-avatar">BS</div>
          <div className="sidebar-user-info">
            <div className="sidebar-user-name">BS. Nguyễn Thị Tâm</div>
            <div className="sidebar-user-role">BS CKII Sản Phụ Khoa</div>
          </div>
          <span style={{ color: 'var(--text-muted)', fontSize: 14 }}>⋮</span>
        </div>
      </div>
    </aside>
  );
}
