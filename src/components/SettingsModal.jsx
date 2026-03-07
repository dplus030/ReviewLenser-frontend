import React, { useState } from 'react';

const SettingsModal = ({ styles, isLight, t, lang, setLang, theme, setTheme, mapPosition, setMapPosition, isPro, userProfile, setUserProfile, onClose }) => {
  const [profileDraft, setProfileDraft] = useState(userProfile || '');
  const [saved, setSaved] = useState(false);

  const handleSaveProfile = () => {
    setUserProfile(profileDraft);
    localStorage.setItem('userProfile', profileDraft);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const miniInput = {
    colorScheme: isLight ? 'light' : 'dark',
    padding: '6px 10px',
    borderRadius: '6px',
    border: `1px solid ${styles.border}`,
    backgroundColor: styles.panel,
    color: styles.text,
    fontSize: '13px',
    outline: 'none',
    textAlign: 'center',
    textAlignLast: 'center'
  };

  return (
    <div
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(5px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000 }}
    >
      <div className="fade-in-up" style={{ backgroundColor: styles.panel, padding: '30px', borderRadius: '24px', width: '90%', maxWidth: '360px', maxHeight: '85vh', overflowY: 'auto', border: `1px solid ${styles.border}`, color: styles.text, display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <h3 style={{ marginTop: 0, marginBottom: '10px', textAlign: 'center' }}>{t.settings}</h3>
        <div style={{ padding: '15px', backgroundColor: styles.bg, borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: 'bold' }}>{t.langLabel}</span>
            <select value={lang} onChange={(e) => { setLang(e.target.value); localStorage.setItem('lang', e.target.value); }} style={miniInput}>
              <option value="zh-TW">繁體中文</option>
              <option value="en">English</option>
            </select>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: 'bold' }}>{t.theme}</span>
            <button
              onClick={() => { const newTheme = isLight ? 'dark' : 'light'; setTheme(newTheme); localStorage.setItem('theme', newTheme); }}
              style={{ padding: '6px 12px', borderRadius: '20px', border: `1px solid ${styles.border}`, backgroundColor: styles.panel, color: styles.text, cursor: 'pointer', fontSize: '13px' }}
            >
              {isLight ? t.dark : t.light}
            </button>
          </div>
        </div>
        <div style={{ padding: '15px', backgroundColor: styles.bg, borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: 'bold' }}>{t.mapPosTitle}</span>
            <select value={mapPosition} onChange={(e) => { setMapPosition(e.target.value); localStorage.setItem('mapPosition', e.target.value); }} style={miniInput}>
              <option value="left">{t.mapPosLeft}</option>
              <option value="right">{t.mapPosRight}</option>
            </select>
          </div>
        </div>
        <div style={{ padding: '15px', backgroundColor: styles.bg, borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: 'bold' }}>{t.profileTitle}</span>
            {!isPro && <span style={{ fontSize: '11px', color: styles.accent, fontWeight: 'bold' }}>{t.profileProOnly}</span>}
          </div>
          <p style={{ margin: 0, fontSize: '12px', color: isLight ? '#888' : '#aaa' }}>{t.profileDesc}</p>
          <textarea
            value={profileDraft}
            onChange={(e) => setProfileDraft(e.target.value)}
            disabled={!isPro}
            placeholder={isPro ? t.profilePh : t.profileProOnly}
            rows={4}
            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: `1px solid ${styles.border}`, backgroundColor: isPro ? styles.panel : (isLight ? '#f0f0f0' : '#222'), color: isPro ? styles.text : (isLight ? '#aaa' : '#555'), fontSize: '13px', resize: 'vertical', outline: 'none', boxSizing: 'border-box', colorScheme: isLight ? 'light' : 'dark', cursor: isPro ? 'text' : 'not-allowed' }}
          />
          {isPro && (
            <button
              onClick={handleSaveProfile}
              style={{ alignSelf: 'flex-end', padding: '6px 18px', borderRadius: '8px', border: 'none', backgroundColor: saved ? '#22c55e' : styles.accent, color: '#fff', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px', transition: 'background-color 0.3s' }}
            >
              {saved ? t.profileSaved : t.profileSave}
            </button>
          )}
        </div>
        <button
          onClick={onClose}
          style={{ width: '100%', padding: '14px', backgroundColor: styles.accent, color: '#fff', border: 'none', borderRadius: '12px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' }}
        >
          {t.back}
        </button>
      </div>
    </div>
  );
};

export default SettingsModal;
