import React, { useState, useEffect, useRef } from 'react';
import { Icons } from '../components/Icons';
import Toast from '../components/Toast';
import AuthModal from '../components/AuthModal';
import PayModal from '../components/PayModal';

const LandingPage = ({
  styles, isLight, isMobile, t, lang, setLang,
  theme, setTheme,
  currentUser, toast,
  showAuth, setShowAuth, showPay, setShowPay,
  billingCycle, setBillingCycle,
  authEmail, setAuthEmail, authPassword, setAuthPassword,
  isSignUpMode, setIsSignUpMode, isLoggingIn,
  handleEmailAuth, handleGoogleLogin, handleEnterApp, handleUpgradeClick
}) => {
  const taglines = t.taglines || [];
  const [taglineIdx, setTaglineIdx] = useState(0);
  const [taglineKey, setTaglineKey] = useState(0);
  const featScrollRef = useRef(null);

  useEffect(() => {
    if (!taglines.length) return;
    const timer = setInterval(() => {
      setTaglineIdx(i => (i + 1) % taglines.length);
      setTaglineKey(k => k + 1);
    }, 3800);
    return () => clearInterval(timer);
  }, [taglines.length]);

  const scrollFeats = (dir) => {
    featScrollRef.current?.scrollBy({ left: dir * 380, behavior: 'smooth' });
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
    <div style={{ height: '100vh', overflowY: 'auto', overflowX: 'hidden', display: 'flex', flexDirection: 'column', backgroundColor: isLight ? '#fcfcfc' : '#050505', color: styles.text, scrollBehavior: 'smooth', position: 'relative' }}>
      <Toast toast={toast} />

      {/* Background */}
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 0, pointerEvents: 'none', overflow: 'hidden' }}>
        {!isLight && (
          <div style={{ width: '100%', height: '100%', background: 'radial-gradient(ellipse at bottom, #1b2735 0%, #050505 100%)', position: 'relative', overflow: 'hidden' }}>
            <div className="stars-sm"></div>
            <div className="stars-md"></div>
            <div className="stars-lg"></div>
          </div>
        )}
        {isLight && (
          <div style={{ width: '100%', height: '100%', background: 'linear-gradient(160deg, #fffdf5 0%, #f0f4ff 100%)', position: 'relative', overflow: 'hidden' }}>
            <div className="sunray"></div>
          </div>
        )}
      </div>

      {/* Navbar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: isMobile ? '12px 16px' : '15px 40px', backgroundColor: isLight ? 'rgba(255,255,255,0.7)' : 'rgba(10,10,12,0.7)', backdropFilter: 'blur(15px)', position: 'sticky', top: 0, zIndex: 100, borderBottom: `1px solid ${isLight ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05)'}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: isMobile ? '30px' : '40px', height: isMobile ? '30px' : '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icons.Logo isLight={isLight} /></div>
          {!isMobile && <span className="brand-font" style={{ fontSize: '1.6rem' }}>Lenser AI</span>}
        </div>
        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
          <select value={lang} onChange={(e) => { setLang(e.target.value); localStorage.setItem('lang', e.target.value); }} style={{ ...miniInput, backgroundColor: 'transparent', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>
            <option value="zh-TW">繁體中文</option>
            <option value="en">English</option>
          </select>
          <button onClick={() => { const newTheme = isLight ? 'dark' : 'light'; setTheme(newTheme); localStorage.setItem('theme', newTheme); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: styles.text, fontSize: '16px' }}>
            {isLight ? '🌙' : '☀️'}
          </button>
          <div style={{ width: '1px', height: '24px', backgroundColor: styles.border }}></div>
          {currentUser ? (
            <button onClick={handleEnterApp} style={{ padding: '8px 24px', fontSize: '0.95rem', backgroundColor: styles.text, color: styles.bg, border: 'none', borderRadius: '30px', cursor: 'pointer', fontWeight: 'bold' }}>{t.enterSystem}</button>
          ) : (
            <button onClick={() => { setIsSignUpMode(false); setShowAuth(true); }} style={{ padding: '8px 20px', fontSize: '0.95rem', backgroundColor: 'transparent', color: styles.text, border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>{t.login}</button>
          )}
        </div>
      </div>

      {/* Hero */}
      <main style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', paddingTop: isMobile ? '30px' : '80px', paddingBottom: '48px', paddingLeft: '20px', paddingRight: '20px', textAlign: 'center', minHeight: 'calc(100vh - 70px)', zIndex: 2 }}>
        <div className="fade-in-up" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 16px', backgroundColor: isLight ? '#fef3c7' : '#001a33', color: styles.accent, borderRadius: '30px', fontSize: '13px', fontWeight: 'bold', marginBottom: '24px', border: `1px solid ${styles.accent}40` }}>
          <span style={{ width: '8px', height: '8px', backgroundColor: styles.accent, borderRadius: '50%', display: 'inline-block' }}></span>
          {t.badge}
        </div>
        <h1 className={`fade-in-up delay-1 brand-font ${isLight ? 'gradient-text-light' : 'gradient-text-dark'}`} style={{ fontSize: isMobile ? 'clamp(2.2rem, 9vw, 3.5rem)' : '6rem', margin: isMobile ? '0 0 12px 0' : '0 0 20px 0', letterSpacing: '-1.5px', lineHeight: 1.1, maxWidth: '900px' }}>Lenser AI</h1>
        <div className="fade-in-up delay-2" style={{ minHeight: isMobile ? '4rem' : '3.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: isMobile ? '20px' : '36px', maxWidth: '800px' }}>
          <h2 key={taglineKey} className="tagline-anim" style={{ fontSize: isMobile ? '1.1rem' : '1.8rem', fontWeight: '600', color: isLight ? '#444' : '#ccc', margin: 0, lineHeight: '1.5', textAlign: 'center' }}>
            {taglines[taglineIdx] || t.sub}
          </h2>
        </div>
        <div className="fade-in-up delay-3" style={{ display: 'inline-flex', flexDirection: 'column', gap: '10px', backgroundColor: isLight ? 'rgba(255,255,255,0.85)' : 'rgba(20,20,20,0.85)', backdropFilter: 'blur(10px)', padding: isMobile ? '16px 18px' : '24px 30px', borderRadius: '20px', border: `1px solid ${isLight ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05)'}`, borderLeft: `6px solid ${styles.accent}`, boxShadow: '0 15px 35px rgba(0,0,0,0.1)', textAlign: 'left', marginBottom: isMobile ? '20px' : '36px', width: isMobile ? '100%' : 'auto', boxSizing: 'border-box' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}><span style={{ fontSize: '1.2rem', lineHeight: '1.4' }}>😩</span><span style={{ color: isLight ? '#555' : '#aaa', fontSize: isMobile ? '0.95rem' : '1.1rem', lineHeight: '1.4' }}>{t.hero1}</span></div>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}><span style={{ fontSize: '1.2rem', lineHeight: '1.4' }}>🫠</span><span style={{ color: isLight ? '#555' : '#aaa', fontSize: isMobile ? '0.95rem' : '1.1rem', lineHeight: '1.4' }}>{t.hero2}</span></div>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginTop: '4px' }}><span style={{ fontSize: '1.2rem', lineHeight: '1.4' }}>🥴</span><span style={{ color: styles.text, fontWeight: 'bold', fontSize: isMobile ? '1rem' : '1.15rem', lineHeight: '1.4' }}>{t.hero3}</span></div>
        </div>
        <button className="fade-in-up delay-3" onClick={handleEnterApp} style={{ padding: isMobile ? '16px 0' : '20px 60px', width: isMobile ? '100%' : 'auto', fontSize: isMobile ? '1.1rem' : '1.25rem', backgroundColor: styles.accent, color: '#fff', border: 'none', borderRadius: '40px', cursor: 'pointer', fontWeight: '900', boxShadow: `0 10px 30px ${styles.accent}50` }}>{t.enter}</button>
        {!isMobile && <div className="fade-in-up delay-3" style={{ marginTop: '32px', paddingTop: '0', opacity: 0.5, animation: 'bounce 2s infinite' }}>
          <span style={{ display: 'block', fontSize: '12px', marginBottom: '10px', fontWeight: 'bold', letterSpacing: '2px' }}>SCROLL TO EXPLORE</span>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6" /></svg>
        </div>}
      </main>

      {/* Features Section */}
      <section style={{ flexShrink: 0, padding: isMobile ? '80px 0' : '120px 0', position: 'relative', zIndex: 2 }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', paddingLeft: isMobile ? '0' : '40px', paddingRight: isMobile ? '0' : '40px' }}>
          <div style={{ textAlign: 'center', marginBottom: '60px', paddingLeft: '20px', paddingRight: '20px' }}>
            <h2 className="brand-font" style={{ fontSize: isMobile ? '2.5rem' : '3.5rem', marginBottom: '15px' }}>{t.sectionEngineTitle}</h2>
          </div>
          <div style={{ position: 'relative' }}>
            {/* Left arrow */}
            <button onClick={() => scrollFeats(-1)} style={{ position: 'absolute', left: isMobile ? '4px' : '-20px', top: '50%', transform: 'translateY(-50%)', zIndex: 10, width: '44px', height: '44px', borderRadius: '50%', border: `1px solid ${isLight ? 'rgba(0,0,0,0.12)' : 'rgba(255,255,255,0.12)'}`, backgroundColor: isLight ? 'rgba(255,255,255,0.9)' : 'rgba(30,30,30,0.9)', backdropFilter: 'blur(8px)', color: styles.text, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 16px rgba(0,0,0,0.15)' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M15 18l-6-6 6-6"/></svg>
            </button>
            {/* Right arrow */}
            <button onClick={() => scrollFeats(1)} style={{ position: 'absolute', right: isMobile ? '4px' : '-20px', top: '50%', transform: 'translateY(-50%)', zIndex: 10, width: '44px', height: '44px', borderRadius: '50%', border: `1px solid ${isLight ? 'rgba(0,0,0,0.12)' : 'rgba(255,255,255,0.12)'}`, backgroundColor: isLight ? 'rgba(255,255,255,0.9)' : 'rgba(30,30,30,0.9)', backdropFilter: 'blur(8px)', color: styles.text, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 16px rgba(0,0,0,0.15)' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M9 18l6-6-6-6"/></svg>
            </button>
            <div ref={featScrollRef} className="cards-scroll" style={{ display: 'flex', gap: '24px', overflowX: 'auto', scrollSnapType: 'x mandatory', WebkitOverflowScrolling: 'touch', paddingBottom: '16px', paddingLeft: isMobile ? '20px' : '0', paddingRight: isMobile ? '20px' : '0', msOverflowStyle: 'none', scrollbarWidth: 'none' }}>
              {[
                { icon: <Icons.Shield />, title: t.feat1Title, desc: t.feat1Desc },
                { icon: <Icons.Brain />, title: t.feat2Title, desc: t.feat2Desc },
                { icon: <Icons.Compass />, title: t.feat3Title, desc: t.feat3Desc },
                { icon: <Icons.Briefcase />, title: t.feat4Title, desc: t.feat4Desc },
                { icon: <Icons.Zap />, title: t.feat5Title, desc: t.feat5Desc }
              ].map((feat, i) => (
                <div key={i} style={{ flex: '0 0 min(85vw, 340px)', scrollSnapAlign: 'start', padding: '40px 30px', backgroundColor: isLight ? 'rgba(255,255,255,0.85)' : 'rgba(20,20,25,0.75)', borderRadius: '24px', border: `1px solid ${isLight ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.07)'}`, boxShadow: isLight ? '0 10px 40px rgba(0,0,0,0.06)' : '0 10px 40px rgba(0,0,0,0.5)', textAlign: 'left', backdropFilter: 'blur(12px)' }}>
                  <div style={{ width: '60px', height: '60px', backgroundColor: `${styles.accent}18`, color: styles.accent, borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>{feat.icon}</div>
                  <h3 style={{ fontSize: '1.4rem', marginBottom: '15px', fontWeight: '900' }}>{feat.title}</h3>
                  <p style={{ color: isLight ? '#666' : '#aaa', lineHeight: '1.7', fontSize: '1.05rem' }}>{feat.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section style={{ flexShrink: 0, padding: isMobile ? '80px 20px' : '120px 40px', zIndex: 2, position: 'relative' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h2 className="brand-font" style={{ fontSize: isMobile ? '2.5rem' : '3.5rem', marginBottom: '15px' }}>{t.sectionPricingTitle}</h2>
            <p style={{ fontSize: '1.2rem', color: isLight ? '#666' : '#999' }}>{t.sectionPricingSub}</p>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '30px', justifyContent: 'center' }}>
            {/* Basic Plan */}
            <div style={{ flex: '1 1 350px', padding: '40px', backgroundColor: isLight ? 'rgba(255,255,255,0.9)' : 'rgba(26,26,26,0.9)', backdropFilter: 'blur(20px)', borderRadius: '24px', border: `1px solid ${isLight ? '#eee' : '#333'}`, display: 'flex', flexDirection: 'column' }}>
              <h3 style={{ fontSize: '1.5rem', color: isLight ? '#555' : '#aaa', margin: '0 0 10px 0' }}>{t.basicPlan}</h3>
              <div style={{ fontSize: '3rem', fontWeight: '900', marginBottom: '30px' }}>$0</div>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 auto 0', display: 'flex', flexDirection: 'column', gap: '15px', color: isLight ? '#555' : '#bbb', fontSize: '1.1rem' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '12px' }}><span style={{ color: '#ff4d4d' }}>❌</span> <b>{t.basicFeat1}</b></li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '12px' }}><span style={{ color: '#ff4d4d' }}>❌</span> <b>{t.basicFeat2}</b></li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '12px' }}><span style={{ color: '#ff4d4d' }}>❌</span> <b>{t.basicFeat3}</b></li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '12px' }}><span style={{ color: '#ff4d4d' }}>❌</span> {t.basicFeat4}</li>
                <li style={{ borderTop: `1px dashed ${isLight ? '#ddd' : '#444'}`, margin: '10px 0' }}></li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '12px' }}><Icons.CheckGreen /> {t.basicInc1}</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '12px' }}><Icons.CheckGreen /> {t.basicInc2}</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '12px' }}><Icons.CheckGreen /> {t.basicInc3}</li>
              </ul>
              <button onClick={handleEnterApp} style={{ marginTop: '40px', width: '100%', padding: '15px', borderRadius: '12px', border: `2px solid ${styles.border}`, background: 'transparent', color: styles.text, fontWeight: 'bold', cursor: 'pointer' }}>{t.btnBasic}</button>
            </div>
            {/* Pro Plan */}
            <div style={{ flex: '1 1 350px', padding: '40px', backgroundColor: isLight ? '#f4f8ff' : '#0a101d', borderRadius: '24px', border: `2px solid ${styles.accent}`, position: 'relative', boxShadow: `0 20px 50px ${styles.accent}40`, display: 'flex', flexDirection: 'column' }}>
              <div style={{ position: 'absolute', top: '-15px', left: '50%', transform: 'translateX(-50%)', background: styles.accent, color: '#fff', padding: '5px 15px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold', letterSpacing: '1px' }}>PRO VERSION</div>
              <h3 style={{ fontSize: '1.5rem', color: styles.accent, margin: '0 0 10px 0' }}>{t.proPlan}</h3>
              <div style={{ fontSize: '3rem', fontWeight: '900', marginBottom: '30px' }}>$159 <span style={{ fontSize: '1rem', color: '#888' }}>{t.proPriceMo}</span></div>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 auto 0', display: 'flex', flexDirection: 'column', gap: '15px', color: isLight ? '#333' : '#eee', fontSize: '1.1rem' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '12px' }}><Icons.CheckGreen /> <b>{t.proFeat1}</b></li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '12px' }}><Icons.CheckGreen /> <b>{t.proFeat2}</b></li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '12px' }}><Icons.CheckGreen /> <b>{t.proFeat3}</b></li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '12px' }}><Icons.CheckGreen /> <b>{t.proFeat4}</b></li>
                <li style={{ borderTop: `1px dashed ${isLight ? '#cce0ff' : '#1e3a8a'}`, margin: '10px 0' }}></li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '12px' }}><Icons.CheckGreen /> {t.proInc1}</li>
              </ul>
              <button onClick={() => { if (!currentUser) setShowAuth(true); else setShowPay(true); }} style={{ marginTop: '40px', width: '100%', padding: '15px', borderRadius: '12px', border: 'none', background: styles.accent, color: '#fff', fontWeight: 'bold', cursor: 'pointer' }}>{t.btnPro}</button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ flexShrink: 0, padding: '60px 20px', textAlign: 'center', color: isLight ? '#888' : '#555', fontSize: '14px', zIndex: 2 }}>
        <div style={{ color: styles.text, width: '40px', height: '40px', margin: '0 auto 20px' }}><Icons.Logo isLight={isLight} /></div>
        <p className="brand-font">© 2026 Lenser AI. Developed with vision.</p>
      </footer>

      {showAuth && (
        <AuthModal
          styles={styles}
          isLight={isLight}
          t={t}
          authEmail={authEmail}
          setAuthEmail={setAuthEmail}
          authPassword={authPassword}
          setAuthPassword={setAuthPassword}
          isSignUpMode={isSignUpMode}
          setIsSignUpMode={setIsSignUpMode}
          isLoggingIn={isLoggingIn}
          handleEmailAuth={handleEmailAuth}
          handleGoogleLogin={handleGoogleLogin}
          onClose={() => setShowAuth(false)}
        />
      )}
      {showPay && (
        <PayModal
          styles={styles}
          isLight={isLight}
          t={t}
          billingCycle={billingCycle}
          setBillingCycle={setBillingCycle}
          onClose={() => setShowPay(false)}
        />
      )}
    </div>
  );
};

export default LandingPage;
