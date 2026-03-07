import React from 'react';

const AuthModal = ({ styles, isLight, t, authEmail, setAuthEmail, authPassword, setAuthPassword, isSignUpMode, setIsSignUpMode, isLoggingIn, handleEmailAuth, handleGoogleLogin, onClose }) => {
  const inputStyle = {
    colorScheme: isLight ? 'light' : 'dark',
    padding: '12px',
    borderRadius: '8px',
    border: `1px solid ${styles.border}`,
    backgroundColor: styles.panel,
    color: styles.text,
    fontSize: '14px',
    outline: 'none'
  };

  return (
    <div
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(5px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}
    >
      <div className="fade-in-up" style={{ backgroundColor: styles.panel, padding: '40px', borderRadius: '24px', width: '90%', maxWidth: '380px', border: `1px solid ${styles.border}`, textAlign: 'center', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
        <h2 style={{ marginTop: 0, marginBottom: '10px' }}>{isSignUpMode ? t.authTitleSignup : t.authTitleLogin}</h2>
        <p style={{ color: isLight ? '#666' : '#aaa', marginBottom: '30px', fontSize: '14px' }}>{t.authDesc}</p>
        <input
          placeholder={t.emailPh}
          value={authEmail}
          onChange={(e) => setAuthEmail(e.target.value)}
          style={{ ...inputStyle, width: '100%', marginBottom: '15px', boxSizing: 'border-box' }}
        />
        <input
          type="password"
          placeholder={t.passPh}
          value={authPassword}
          onChange={(e) => setAuthPassword(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') handleEmailAuth(); }}
          style={{ ...inputStyle, width: '100%', marginBottom: '25px', boxSizing: 'border-box' }}
        />
        <button
          onClick={handleEmailAuth}
          disabled={isLoggingIn}
          style={{ width: '100%', padding: '14px', backgroundColor: styles.text, color: styles.bg, border: 'none', borderRadius: '12px', fontSize: '15px', fontWeight: 'bold', cursor: isLoggingIn ? 'not-allowed' : 'pointer', marginBottom: '15px', opacity: isLoggingIn ? 0.7 : 1 }}
        >
          {isLoggingIn ? '...' : (isSignUpMode ? t.btnSignup : t.btnLogin)}
        </button>
        <div
          onClick={() => setIsSignUpMode(!isSignUpMode)}
          style={{ fontSize: '12px', color: styles.accent, cursor: 'pointer', marginBottom: '15px', fontWeight: 'bold' }}
        >
          {isSignUpMode ? t.toggleLogin : t.toggleSignup}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', margin: '15px 0' }}>
          <div style={{ flex: 1, height: '1px', backgroundColor: styles.border }}></div>
          <span style={{ padding: '0 10px', fontSize: '12px', color: '#888' }}>OR</span>
          <div style={{ flex: 1, height: '1px', backgroundColor: styles.border }}></div>
        </div>
        <button
          onClick={handleGoogleLogin}
          disabled={isLoggingIn}
          style={{ width: '100%', padding: '12px', backgroundColor: 'transparent', color: styles.text, border: `1px solid ${styles.border}`, borderRadius: '12px', fontSize: '14px', fontWeight: 'bold', cursor: isLoggingIn ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', opacity: isLoggingIn ? 0.5 : 1 }}
        >
          {isLoggingIn ? <span>...</span> : (
            <>
              <svg viewBox="0 0 24 24" width="18" height="18">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              {t.btnGoogle}
            </>
          )}
        </button>
        <button onClick={onClose} style={{ marginTop: '20px', background: 'none', border: 'none', color: '#888', cursor: 'pointer', fontSize: '13px' }}>{t.back}</button>
      </div>
    </div>
  );
};

export default AuthModal;
