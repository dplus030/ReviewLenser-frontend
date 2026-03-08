import React from 'react';
import { Icons } from './Icons';

const AppHeader = ({ styles, isLight, t, isMobile, isPro, currentUser, usageCount, maxFreeUses, handleUpgradeClick, handleLogout, setShowAuth, setIsSignUpMode, setView, onShowHistory, onNewChat, onShowWishlist, wishlistCount }) => (
  <div style={{ flexShrink: 0, height: '60px', borderBottom: `1px solid ${styles.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px', zIndex: 20, background: isLight ? styles.panel : `radial-gradient(1.5px 1.5px at 4% 30%, rgba(255,255,255,0.55) 0%, transparent 100%), radial-gradient(1px 1px at 9% 70%, rgba(255,255,255,0.3) 0%, transparent 100%), radial-gradient(1.5px 1.5px at 14% 20%, rgba(255,255,255,0.45) 0%, transparent 100%), radial-gradient(1px 1px at 19% 60%, rgba(255,255,255,0.28) 0%, transparent 100%), radial-gradient(1.5px 1.5px at 24% 40%, rgba(255,255,255,0.5) 0%, transparent 100%), radial-gradient(1px 1px at 30% 75%, rgba(255,255,255,0.32) 0%, transparent 100%), radial-gradient(1.5px 1.5px at 36% 25%, rgba(255,255,255,0.42) 0%, transparent 100%), radial-gradient(1px 1px at 42% 65%, rgba(255,255,255,0.27) 0%, transparent 100%), radial-gradient(1.5px 1.5px at 48% 35%, rgba(255,255,255,0.48) 0%, transparent 100%), radial-gradient(1px 1px at 54% 70%, rgba(255,255,255,0.3) 0%, transparent 100%), radial-gradient(1.5px 1.5px at 60% 20%, rgba(255,255,255,0.52) 0%, transparent 100%), radial-gradient(1px 1px at 66% 55%, rgba(255,255,255,0.28) 0%, transparent 100%), radial-gradient(1.5px 1.5px at 72% 40%, rgba(255,255,255,0.44) 0%, transparent 100%), radial-gradient(1px 1px at 78% 72%, rgba(255,255,255,0.3) 0%, transparent 100%), radial-gradient(1.5px 1.5px at 84% 28%, rgba(255,255,255,0.5) 0%, transparent 100%), radial-gradient(1px 1px at 89% 62%, rgba(255,255,255,0.27) 0%, transparent 100%), radial-gradient(1.5px 1.5px at 94% 38%, rgba(255,255,255,0.46) 0%, transparent 100%), radial-gradient(1px 1px at 98% 68%, rgba(255,255,255,0.28) 0%, transparent 100%), ${styles.panel}` }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      {!isMobile && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }} onClick={() => setView('landing')}>
          <div style={{ width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icons.Logo isLight={isLight} /></div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="brand-font" style={{ fontSize: '1.6rem' }}>Lenser AI</span>
            {isPro && <span style={{ backgroundColor: styles.accent, color: 'white', padding: '2px 6px', borderRadius: '6px', fontSize: '12px', fontWeight: 900, letterSpacing: '1px' }}>PRO</span>}
          </div>
        </div>
      )}
      {isMobile && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }} onClick={() => setView('landing')}>
          <div style={{ width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icons.Logo isLight={isLight} /></div>
          {isPro && <span style={{ backgroundColor: styles.accent, color: 'white', padding: '1px 5px', borderRadius: '5px', fontSize: '11px', fontWeight: 900, letterSpacing: '1px' }}>PRO</span>}
        </div>
      )}
      {currentUser && (
        <div style={{ display: 'flex', gap: '6px', marginLeft: '4px' }}>
          <button
            onClick={onShowHistory}
            title={t.convHistory}
            style={{ background: 'none', border: `1px solid ${styles.border}`, borderRadius: '8px', cursor: 'pointer', color: styles.text, padding: '4px 10px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}
          >
            <span style={{ fontSize: '14px' }}>☰</span>
            {!isMobile && <span>{t.convHistory}</span>}
          </button>
          <button
            onClick={onNewChat}
            title={t.convNewChat}
            style={{ background: 'none', border: `1px solid ${styles.border}`, borderRadius: '8px', cursor: 'pointer', color: styles.text, padding: '4px 10px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}
          >
            <span style={{ fontSize: '14px' }}>✎</span>
            {!isMobile && <span>{t.convNewChat}</span>}
          </button>
          <button
            onClick={onShowWishlist}
            title={t.wishlistTitle}
            style={{ background: 'none', border: `1px solid ${styles.border}`, borderRadius: '8px', cursor: 'pointer', color: styles.text, padding: '4px 10px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px', position: 'relative' }}
          >
            <span style={{ fontSize: '14px' }}>★</span>
            {!isMobile && <span>{t.wishlistTitle}</span>}
            {wishlistCount > 0 && (
              <span style={{ position: 'absolute', top: '-5px', right: '-5px', backgroundColor: styles.accent, color: '#fff', borderRadius: '50%', width: '16px', height: '16px', fontSize: '10px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {wishlistCount}
              </span>
            )}
          </button>
        </div>
      )}
    </div>
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
      {!isPro && currentUser && (
        <span style={{ fontSize: '12px', color: usageCount >= maxFreeUses ? '#ff4d4d' : (isLight ? '#888' : '#aaa') }}>
          {usageCount}/{maxFreeUses} {t.times}
        </span>
      )}
      {!isPro && !isMobile && (
        <button
          onClick={handleUpgradeClick}
          style={{ padding: '6px 16px', borderRadius: '20px', border: `1px solid ${styles.accent}`, backgroundColor: 'transparent', color: styles.accent, fontWeight: 'bold', cursor: 'pointer', fontSize: '13px' }}
        >
          {t.upgrade}
        </button>
      )}
      {!isMobile && (
        currentUser
          ? <button onClick={handleLogout} style={{ padding: '6px 16px', borderRadius: '20px', border: `1px solid ${styles.border}`, backgroundColor: 'transparent', color: styles.text, fontWeight: 'bold', cursor: 'pointer', fontSize: '13px' }}>{t.logout}</button>
          : <button onClick={() => { setIsSignUpMode(false); setShowAuth(true); }} style={{ padding: '6px 16px', borderRadius: '20px', border: 'none', backgroundColor: styles.accent, color: '#fff', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px' }}>{t.login}</button>
      )}
<button onClick={() => setView('settings')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: styles.text, display: 'flex', alignItems: 'center' }}>
        <Icons.Settings />
      </button>
    </div>
  </div>
);

export default AppHeader;
