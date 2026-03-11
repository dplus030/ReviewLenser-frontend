import { useState, useEffect } from 'react';

const MONTHLY_URL            = import.meta.env.VITE_MONTHLY_URL;
const YEARLY_URL             = import.meta.env.VITE_YEARLY_URL;
const EARLY_BIRD_MONTHLY_URL = import.meta.env.VITE_EARLY_BIRD_MONTHLY_URL;
const EARLY_BIRD_YEARLY_URL  = import.meta.env.VITE_EARLY_BIRD_YEARLY_URL;
const API_URL                = import.meta.env.VITE_API_URL;

const PayModal = ({ styles, isLight, t, onClose }) => {
  const [plan, setPlan] = useState('monthly');
  const [earlyBird, setEarlyBird] = useState({ active: true, remaining: 100 });
  const isYearly = plan === 'yearly';

  useEffect(() => {
    fetch(`${API_URL}/api/early-bird-status`)
      .then((r) => r.json())
      .then((d) => setEarlyBird({ active: d.active, remaining: d.remaining }))
      .catch(() => {}); // 若 API 失敗，保持顯示早鳥（不影響購買流程）
  }, []);

  const monthlyOrigPrice = 299;
  const monthlyPrice     = earlyBird.active ? 199  : 299;
  const yearlyOrigTotal  = 2988;
  const yearlyTotal      = earlyBird.active ? 1990 : 2988;

  return (
    <div
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(5px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}
    >
      <div className="fade-in-up" style={{ backgroundColor: styles.panel, padding: '40px', borderRadius: '24px', width: '90%', maxWidth: '420px', border: `1px solid ${styles.border}`, textAlign: 'center', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
        <h2 style={{ marginTop: 0, marginBottom: '10px', color: styles.text }}>{t.payTitle}</h2>
        <p style={{ color: isLight ? '#666' : '#aaa', marginBottom: '20px', fontSize: '14px', lineHeight: 1.7 }}>{t.payDesc}</p>

        {/* Plan toggle */}
        <div style={{ display: 'flex', backgroundColor: isLight ? '#f0f0f0' : '#1e1e1e', borderRadius: '12px', padding: '4px', marginBottom: '20px', position: 'relative' }}>
          {['monthly', 'yearly'].map((p) => (
            <button
              key={p}
              onClick={() => setPlan(p)}
              style={{
                flex: 1, padding: '9px 0', border: 'none', borderRadius: '9px', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold', transition: 'all 0.2s',
                backgroundColor: plan === p ? styles.accent : 'transparent',
                color: plan === p ? '#fff' : (isLight ? '#555' : '#aaa'),
                position: 'relative',
              }}
            >
              {p === 'monthly' ? t.planMonthly : t.planYearly}
              {p === 'yearly' && (
                <span style={{ marginLeft: '6px', fontSize: '11px', backgroundColor: '#22c55e', color: '#fff', padding: '1px 6px', borderRadius: '99px' }}>
                  {t.save16}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Coin breakdown */}
        <div style={{ backgroundColor: isLight ? '#f5f7fa' : '#252525', borderRadius: '16px', padding: '20px', marginBottom: '25px', textAlign: 'left' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ color: styles.text, fontSize: '15px', fontWeight: 'bold', display: 'flex', alignItems: 'baseline', gap: '4px' }}>🪙 <span style={{ fontSize: '26px', fontWeight: '900' }}>1500</span> {t.coinsLabel}</span>
            <div style={{ textAlign: 'right' }}>
              {earlyBird.active && (
                <div style={{ fontSize: '13px', color: '#aaa', textDecoration: 'line-through', marginBottom: '2px' }}>
                  {isYearly ? `${yearlyOrigTotal} NTD` : `${monthlyOrigPrice} NTD`}
                </div>
              )}
              <span style={{ fontSize: '24px', fontWeight: '900', color: earlyBird.active ? '#f97316' : styles.text }}>
                {isYearly ? yearlyTotal : monthlyPrice}{' '}
                <span style={{ fontSize: '12px' }}>NTD</span>
              </span>
              <div style={{ fontSize: '11px', color: isLight ? '#999' : '#777' }}>
                {isYearly ? (earlyBird.active ? `166 NTD / ${t.mo}` : `249 NTD / ${t.mo}`) : `/ ${t.mo}`}
              </div>
            </div>
          </div>
          <div style={{ borderTop: `1px solid ${styles.border}`, paddingTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px', color: isLight ? '#555' : '#bbb' }}>
              <span>{t.paySearch}</span>
              <span style={{ fontWeight: 'bold', color: styles.accent, flexShrink: 0, marginLeft: '8px' }}>{t.payCost1}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px', color: isLight ? '#555' : '#bbb' }}>
              <span>{t.payDeep}</span>
              <span style={{ fontWeight: 'bold', color: styles.accent, flexShrink: 0, marginLeft: '8px' }}>{t.payCost3}</span>
            </div>
          </div>
        </div>

        {earlyBird.active && (
          <div style={{ marginBottom: '12px', display: 'flex', justifyContent: 'center', gap: '8px', alignItems: 'center' }}>
            <span style={{ background: 'linear-gradient(90deg,#f97316,#ef4444)', color: '#fff', padding: '5px 14px', borderRadius: '99px', fontSize: '13px', fontWeight: 'bold', letterSpacing: '0.5px' }}>
              {t.earlyBirdBadge}
            </span>
            <span style={{ fontSize: '12px', color: isLight ? '#888' : '#aaa' }}>
              剩 {earlyBird.remaining} 名
            </span>
          </div>
        )}
        <button
          onClick={() => {
            const url = earlyBird.active
              ? (isYearly ? EARLY_BIRD_YEARLY_URL : EARLY_BIRD_MONTHLY_URL)
              : (isYearly ? YEARLY_URL : MONTHLY_URL);
            window.open(url);
            onClose();
          }}
          style={{ width: '100%', padding: '15px', backgroundColor: earlyBird.active ? '#f97316' : styles.accent, color: '#fff', border: 'none', borderRadius: '12px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', boxShadow: earlyBird.active ? '0 4px 15px rgba(249,115,22,0.4)' : `0 4px 15px ${styles.accent}40` }}
        >
          {earlyBird.active
            ? (isYearly ? `${t.btnPayEarlyBird} — ${yearlyTotal} NTD / ${t.yr}` : `${t.btnPayEarlyBird} — ${monthlyPrice} NTD / ${t.mo}`)
            : (isYearly ? `${t.btnPay} — ${yearlyTotal} NTD / ${t.yr}` : `${t.btnPay} — ${monthlyPrice} NTD / ${t.mo}`)
          }
        </button>
        <button onClick={onClose} style={{ marginTop: '20px', background: 'none', border: 'none', color: '#888', cursor: 'pointer', fontSize: '13px' }}>{t.back}</button>
      </div>
    </div>
  );
};

export default PayModal;
