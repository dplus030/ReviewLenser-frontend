import React from 'react';

const Toast = ({ toast }) => {
  if (!toast) return null;
  const colors = {
    error: { bg: '#ff4d4d', icon: '✕' },
    success: { bg: '#22c55e', icon: '✓' },
    warning: { bg: '#f59e0b', icon: '⚠' },
    info: { bg: '#007BFF', icon: 'ℹ' },
  };
  const c = colors[toast.type] || colors.info;
  return (
    <div className={toast.exiting ? 'toast-out' : 'toast-in'} style={{
      position: 'fixed', bottom: '30px', right: '30px',
      backgroundColor: c.bg, color: '#fff', padding: '14px 22px', borderRadius: '14px',
      boxShadow: '0 8px 30px rgba(0,0,0,0.25)', zIndex: 99999, display: 'flex',
      alignItems: 'center', gap: '10px', fontSize: '14px', fontWeight: '600',
      maxWidth: '90vw', minWidth: '260px', backdropFilter: 'blur(10px)',
    }}>
      <span style={{ fontSize: '16px', flexShrink: 0 }}>{c.icon}</span>
      <span>{toast.msg}</span>
    </div>
  );
};

export default Toast;
