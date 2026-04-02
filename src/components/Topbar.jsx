import React from 'react';

const PAGE_TITLES = {
  dashboard: { title: 'Tổng quan', subtitle: 'Xem thống kê và hoạt động hôm nay' },
  patients: { title: 'Quản lý bệnh nhân', subtitle: 'Danh sách và thông tin bệnh nhân' },
  examination: { title: 'Tạo phiếu khám', subtitle: 'Lập phiếu khám và kê đơn thuốc' },
  medicines: { title: 'Danh mục thuốc', subtitle: 'Danh sách thuốc theo bệnh' },
  history: { title: 'Lịch sử khám', subtitle: 'Tra cứu lịch sử khám bệnh' },
};

export default function Topbar({ activePage }) {
  const { title, subtitle } = PAGE_TITLES[activePage] || PAGE_TITLES.dashboard;
  const now = new Date();
  const dateStr = now.toLocaleDateString('vi-VN', {
    weekday: 'short', day: 'numeric', month: 'numeric', year: 'numeric'
  });
  const timeStr = now.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="topbar">
      <div className="topbar-left">
        <div className="topbar-title">{title}</div>
        <div className="topbar-subtitle">{subtitle}</div>
      </div>
      <div className="topbar-right">
        <div className="topbar-badge">
          <span>🟢</span>
          <span>Đang trực</span>
        </div>
        <div className="topbar-date">
          📅 {dateStr} · {timeStr}
        </div>
      </div>
    </div>
  );
}
