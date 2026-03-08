import React from 'react';

// TODO: Replace with the actual LemonSqueezy one-time coin pack product URL
const TOPUP_URL = 'https://reviewlenser.lemonsqueezy.com/checkout/buy/TOPUP_VARIANT_ID';

const BuyCoinsModal = ({ styles, isLight, t, onClose, currentUser }) => {
  const handleBuy = () => {
    // Pass the user's UID as custom checkout data so the webhook can credit the right account
    const uid = currentUser?.uid ?? '';
    const url = `${TOPUP_URL}?checkout[custom][uid]=${encodeURIComponent(uid)}&checkout[email]=${encodeURIComponent(currentUser?.email ?? '')}`;
    window.open(url, '_blank');
    onClose();
  };

  return (
    <div
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(5px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}
    >
      <div className="fade-in-up" style={{ backgroundColor: styles.panel, padding: '40px', borderRadius: '24px', width: '90%', maxWidth: '380px', border: `1px solid ${styles.border}`, textAlign: 'center', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
        <div style={{ fontSize: '40px', marginBottom: '12px' }}>🪙</div>
        <h2 style={{ marginTop: 0, marginBottom: '8px', color: styles.text }}>{t.buyCoinsTitle}</h2>
        <p style={{ color: isLight ? '#666' : '#aaa', marginBottom: '24px', fontSize: '14px', lineHeight: 1.7 }}>{t.buyCoinsDesc}</p>

        {/* Pack card */}
        <div style={{ backgroundColor: isLight ? '#f5f7fa' : '#252525', borderRadius: '16px', padding: '24px', marginBottom: '24px', border: `2px solid ${styles.accent}` }}>
          <div style={{ fontSize: '12px', fontWeight: 'bold', color: styles.accent, letterSpacing: '1px', marginBottom: '8px', textTransform: 'uppercase' }}>{t.buyCoinsPackLabel}</div>
          <div style={{ fontSize: '36px', fontWeight: '900', color: styles.text, marginBottom: '4px' }}>{t.buyCoinsAmount}</div>
          <div style={{ fontSize: '28px', fontWeight: '800', color: styles.accent, marginBottom: '8px' }}>{t.buyCoinsPrice}</div>
          <div style={{ fontSize: '12px', color: isLight ? '#999' : '#666' }}>{t.buyCoinsNote}</div>
        </div>

        <button
          onClick={handleBuy}
          style={{ width: '100%', padding: '15px', backgroundColor: styles.accent, color: '#fff', border: 'none', borderRadius: '12px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', boxShadow: `0 4px 15px ${styles.accent}40` }}
        >
          {t.buyCoinsBtn2}
        </button>
        <button onClick={onClose} style={{ marginTop: '16px', background: 'none', border: 'none', color: '#888', cursor: 'pointer', fontSize: '13px' }}>{t.back}</button>
      </div>
    </div>
  );
};

export default BuyCoinsModal;
