import React from 'react';

const PayModal = ({ styles, isLight, t, billingCycle, setBillingCycle, onClose }) => (
  <div
    onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(5px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}
  >
    <div className="fade-in-up" style={{ backgroundColor: styles.panel, padding: '40px', borderRadius: '24px', width: '90%', maxWidth: '420px', border: `1px solid ${styles.border}`, textAlign: 'center', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
      <h2 style={{ marginTop: 0, marginBottom: '10px', color: styles.text }}>{t.payTitle}</h2>
      <p style={{ color: isLight ? '#666' : '#aaa', marginBottom: '25px', fontSize: '14px', lineHeight: 1.6 }}>{t.payDesc}</p>
      <div style={{ display: 'flex', gap: '12px', marginBottom: '25px' }}>
        <div
          onClick={() => setBillingCycle('monthly')}
          style={{ flex: 1, border: billingCycle === 'monthly' ? `2px solid ${styles.accent}` : `1px solid ${styles.border}`, borderRadius: '16px', padding: '16px', cursor: 'pointer', textAlign: 'center', opacity: billingCycle === 'monthly' ? 1 : 0.5 }}
        >
          <div style={{ fontWeight: 'bold', fontSize: '15px', marginBottom: '8px', color: styles.text }}>{t.planMonthly}</div>
          <div style={{ fontSize: '24px', fontWeight: '900', color: styles.text }}>159<span style={{ fontSize: '12px' }}>NTD</span></div>
          <div style={{ fontSize: '12px', color: isLight ? '#888' : '#aaa', marginTop: '4px' }}>/ {t.mo}</div>
        </div>
        <div
          onClick={() => setBillingCycle('yearly')}
          style={{ flex: 1, border: billingCycle === 'yearly' ? `2px solid ${styles.accent}` : `1px solid ${styles.border}`, borderRadius: '16px', padding: '16px', cursor: 'pointer', textAlign: 'center', position: 'relative', opacity: billingCycle === 'yearly' ? 1 : 0.5, backgroundColor: billingCycle === 'yearly' ? `${styles.accent}10` : 'transparent' }}
        >
          <div style={{ position: 'absolute', top: '-10px', left: '50%', transform: 'translateX(-50%)', backgroundColor: styles.accent, color: '#fff', fontSize: '11px', padding: '3px 10px', borderRadius: '12px', fontWeight: 'bold', whiteSpace: 'nowrap' }}>{t.save16}</div>
          <div style={{ fontWeight: 'bold', fontSize: '15px', marginBottom: '8px', color: styles.text }}>{t.planYearly}</div>
          <div style={{ fontSize: '24px', fontWeight: '900', color: styles.text }}>1590<span style={{ fontSize: '12px' }}>NTD</span></div>
          <div style={{ fontSize: '12px', color: isLight ? '#888' : '#aaa', marginTop: '4px' }}>/ {t.yr}</div>
        </div>
      </div>
      <button
        onClick={() => {
          window.open(
            billingCycle === 'yearly'
              ? 'https://reviewlenser.lemonsqueezy.com/checkout/buy/392784e6-f54c-4af5-9628-427c0d8a0352' 
              : 'https://reviewlenser.lemonsqueezy.com/checkout/buy/c0b189da-9da3-4956-807d-360397e63394'
          );
          onClose();
        }}
        style={{ width: '100%', padding: '15px', backgroundColor: styles.accent, color: '#fff', border: 'none', borderRadius: '12px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', boxShadow: `0 4px 15px ${styles.accent}40` }}
      >
        {t.btnPay}
      </button>
      <button onClick={onClose} style={{ marginTop: '20px', background: 'none', border: 'none', color: '#888', cursor: 'pointer', fontSize: '13px' }}>{t.back}</button>
    </div>
  </div>
);

export default PayModal;
