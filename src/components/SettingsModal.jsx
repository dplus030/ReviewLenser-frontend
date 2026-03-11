import React, { useState } from 'react';

const SettingsModal = ({ styles, isLight, t, lang, setLang, theme, setTheme, fontSize, setFontSize, mapPosition, setMapPosition, isPro, userProfile, setUserProfile, toneMode, handleToneChange, customTone, setCustomTone, onClose, isMobile, currentUser, handleLogout, setShowAuth, setIsSignUpMode, handleUpgradeClick, coins }) => {
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
      style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(5px)', display: 'flex', alignItems: isMobile ? 'flex-end' : 'center', justifyContent: 'center', zIndex: 10000 }}
    >
      <div className="fade-in-up" style={{ backgroundColor: styles.panel, padding: isMobile ? '20px 16px' : '30px', borderRadius: isMobile ? '20px 20px 0 0' : '24px', width: isMobile ? '100%' : '90%', maxWidth: isMobile ? '100%' : '560px', maxHeight: '90dvh', overflowY: 'auto', scrollbarWidth: 'none', msOverflowStyle: 'none', border: `1px solid ${styles.border}`, color: styles.text, display: 'flex', flexDirection: 'column', gap: '15px', paddingBottom: isMobile ? 'max(20px, env(safe-area-inset-bottom))' : '30px', boxSizing: 'border-box' }}>
        <h3 style={{ marginTop: 0, marginBottom: '10px', textAlign: 'center' }}>{t.settings}</h3>
        {currentUser && (
          <div style={{ padding: '15px', backgroundColor: styles.bg, borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: 'bold' }}>🪙 {t.coinsLabel}</span>
            <span
              onClick={() => { handleUpgradeClick(); onClose(); }}
              style={{ fontSize: '20px', fontWeight: '900', color: coins <= 5 ? '#ff4d4d' : styles.accent, cursor: 'pointer' }}
            >
              {coins}
            </span>
          </div>
        )}
        {isMobile && (
          <div style={{ padding: '15px', backgroundColor: styles.bg, borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: 'bold' }}>{t.theme}</span>
              <button
                onClick={() => { const newTheme = isLight ? 'dark' : 'light'; setTheme(newTheme); localStorage.setItem('theme', newTheme); }}
                style={{ padding: '6px 14px', borderRadius: '20px', border: `1px solid ${styles.border}`, backgroundColor: styles.panel, color: styles.text, cursor: 'pointer', fontSize: '13px' }}
              >
                {isLight ? '🌙 ' + t.dark : '☀️ ' + t.light}
              </button>
            </div>
            {!isPro && currentUser && (
              <button
                onClick={() => { handleUpgradeClick(); onClose(); }}
                style={{ width: '100%', padding: '10px', borderRadius: '10px', border: `1px solid ${styles.accent}`, backgroundColor: 'transparent', color: styles.accent, fontWeight: 'bold', cursor: 'pointer', fontSize: '14px' }}
              >
                {t.upgrade}
              </button>
            )}
            {currentUser
              ? <button onClick={() => { handleLogout(); onClose(); }} style={{ width: '100%', padding: '10px', borderRadius: '10px', border: `1px solid ${styles.border}`, backgroundColor: 'transparent', color: styles.text, fontWeight: 'bold', cursor: 'pointer', fontSize: '14px' }}>{t.logout}</button>
              : <button onClick={() => { setIsSignUpMode(false); setShowAuth(true); onClose(); }} style={{ width: '100%', padding: '10px', borderRadius: '10px', border: 'none', backgroundColor: styles.accent, color: '#fff', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px' }}>{t.login}</button>
            }
          </div>
        )}
        <div style={{ padding: '15px', backgroundColor: styles.bg, borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: 'bold' }}>{t.langLabel}</span>
            <select value={lang} onChange={(e) => { setLang(e.target.value); localStorage.setItem('lang', e.target.value); }} style={miniInput}>
              <option value="zh-TW">繁體中文</option>
              <option value="en">English</option>
              <option value="ja">日本語</option>
              <option value="ko">한국어</option>
            </select>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: 'bold' }}>{t.fontSizeLabel}</span>
            <div style={{ display: 'flex', gap: '6px' }}>
              {['small', 'medium', 'large'].map((size) => (
                <button
                  key={size}
                  onClick={() => { setFontSize(size); localStorage.setItem('fontSize', size); }}
                  style={{ padding: '4px 10px', borderRadius: '8px', border: `1px solid ${fontSize === size ? styles.accent : styles.border}`, backgroundColor: fontSize === size ? styles.accent : 'transparent', color: fontSize === size ? '#fff' : styles.text, cursor: 'pointer', fontSize: size === 'small' ? '11px' : size === 'large' ? '15px' : '13px', fontWeight: fontSize === size ? 700 : 400 }}
                >
                  {t[`fontSize${size.charAt(0).toUpperCase() + size.slice(1)}`]}
                </button>
              ))}
            </div>
          </div>
          {!isMobile && (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: 'bold' }}>{t.theme}</span>
              <button
                onClick={() => { const newTheme = isLight ? 'dark' : 'light'; setTheme(newTheme); localStorage.setItem('theme', newTheme); }}
                style={{ padding: '6px 12px', borderRadius: '20px', border: `1px solid ${styles.border}`, backgroundColor: styles.panel, color: styles.text, cursor: 'pointer', fontSize: '13px' }}
              >
                {isLight ? t.dark : t.light}
              </button>
            </div>
          )}
        </div>
        <div style={{ padding: '15px', backgroundColor: styles.bg, borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: 'bold' }}>{t.mapPosTitle}</span>
            <select value={mapPosition} onChange={(e) => { setMapPosition(e.target.value); localStorage.setItem('mapPosition', e.target.value); }} style={miniInput}>
              <option value="left">{t.mapPosLeft}</option>
              <option value="right">{t.mapPosRight}</option>
            </select>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontWeight: 'bold', flexShrink: 0 }}>{t.aiToneLabel}</span>
            <select value={toneMode} onChange={handleToneChange} style={{ ...miniInput, width: '160px' }}>
              <option value="毒舌評論家">{t.toneBrutal}</option>
              <option value="極簡重點">{t.toneBrief}</option>
              <option value="嚴謹專業">{t.tonePro}</option>
              <option value="溫柔推坑">{t.toneWarm}</option>
              <option value="自訂...">{!isPro && '🔒 '}{t.toneCustom}</option>
            </select>
          </div>
          {toneMode === '自訂...' && (
            <input
              placeholder={t.toneCustomPh}
              value={customTone}
              onChange={e => setCustomTone(e.target.value)}
              style={{ ...miniInput, width: '100%', textAlign: 'left', boxSizing: 'border-box' }}
            />
          )}
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
