import React from 'react';

const PayModal = ({ styles, isLight, t, onClose }) => (
  <div
    onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(5px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}
  >
    <div className="fade-in-up" style={{ backgroundColor: styles.panel, padding: '40px', borderRadius: '24px', width: '90%', maxWidth: '420px', border: `1px solid ${styles.border}`, textAlign: 'center', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
      <h2 style={{ marginTop: 0, marginBottom: '10px', color: styles.text }}>{t.payTitle}</h2>
      <p style={{ color: isLight ? '#666' : '#aaa', marginBottom: '25px', fontSize: '14px', lineHeight: 1.7 }}>{t.payDesc}</p>

      {/* Coin breakdown */}
      <div style={{ backgroundColor: isLight ? '#f5f7fa' : '#252525', borderRadius: '16px', padding: '20px', marginBottom: '25px', textAlign: 'left' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <span style={{ color: styles.text, fontSize: '15px', fontWeight: 'bold' }}>🪙 150 Lenser 幣</span>
          <span style={{ fontSize: '24px', fontWeight: '900', color: styles.text }}>299 <span style={{ fontSize: '12px' }}>NTD</span></span>
        </div>
        <div style={{ borderTop: `1px solid ${styles.border}`, paddingTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: isLight ? '#555' : '#bbb' }}>
            <span>🔍 普通搜尋 / AI 推薦</span>
            <span style={{ fontWeight: 'bold', color: styles.accent }}>扣 1 幣</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: isLight ? '#555' : '#bbb' }}>
            <span>🔥 深度 AI 評論（搜索模式）</span>
            <span style={{ fontWeight: 'bold', color: styles.accent }}>扣 3 幣</span>
          </div>
        </div>
      </div>

      <button
        onClick={() => {
          window.open('https://reviewlenser.lemonsqueezy.com/checkout/buy/c0b189da-9da3-4956-807d-360397e63394');
          onClose();
        }}
        style={{ width: '100%', padding: '15px', backgroundColor: styles.accent, color: '#fff', border: 'none', borderRadius: '12px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', boxShadow: `0 4px 15px ${styles.accent}40` }}
      >
        {t.btnPay} — 299 NTD
      </button>
      <button onClick={onClose} style={{ marginTop: '20px', background: 'none', border: 'none', color: '#888', cursor: 'pointer', fontSize: '13px' }}>{t.back}</button>
    </div>
  </div>
);

export default PayModal;
