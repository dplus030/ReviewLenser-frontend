import { Icons } from '../components/Icons';

const Privacy = ({ isLight, isMobile, setView }) => {
  const bg = isLight ? '#f5f7fa' : '#0f0f11';
  const text = isLight ? '#333333' : '#f0f0f0';
  const muted = isLight ? '#666666' : '#999999';
  const border = isLight ? '#e0e0e0' : '#2a2a2a';
  const cardBg = isLight ? '#ffffff' : '#1a1a1a';
  const accent = isLight ? '#f59e0b' : '#007BFF';
  const highlight = isLight ? '#fffbeb' : '#0a1929';
  const highlightBorder = isLight ? '#f59e0b' : '#007BFF';

  const Section = ({ title, children }) => (
    <div style={{ marginBottom: '40px' }}>
      <h2 style={{ fontSize: '1.3rem', fontWeight: '700', color: text, marginBottom: '12px', paddingBottom: '10px', borderBottom: `1px solid ${border}` }}>
        {title}
      </h2>
      <div style={{ color: muted, lineHeight: '1.8', fontSize: '1rem' }}>
        {children}
      </div>
    </div>
  );

  return (
    <div style={{ height: '100dvh', overflowY: 'auto', backgroundColor: bg, color: text, fontFamily: "'Noto Sans TC', sans-serif" }}>
      {/* Header */}
      <div style={{ position: 'sticky', top: 0, backgroundColor: bg, borderBottom: `1px solid ${border}`, zIndex: 100, padding: '16px 24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button
          onClick={() => setView('landing')}
          style={{ background: 'transparent', border: `1px solid ${border}`, color: text, borderRadius: '8px', padding: '8px 16px', cursor: 'pointer', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          ← Back
        </button>
        <div style={{ width: '32px', height: '32px', color: text }}>
          <Icons.Logo isLight={isLight} />
        </div>
        <span style={{ fontWeight: '700', fontSize: '1rem', color: text }}>ReviewLenser</span>
      </div>

      {/* Content */}
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: isMobile ? '40px 20px 80px' : '60px 40px 100px' }}>
        <div style={{ marginBottom: '48px' }}>
          <div style={{ display: 'inline-block', backgroundColor: `${accent}20`, color: accent, padding: '4px 14px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: '700', marginBottom: '16px', letterSpacing: '0.05em' }}>
            LEGAL
          </div>
          <h1 style={{ fontSize: isMobile ? '2rem' : '2.8rem', fontWeight: '900', color: text, margin: '0 0 12px' }}>
            Privacy Policy
          </h1>
          <p style={{ color: muted, fontSize: '0.95rem' }}>Last updated: March 2026</p>
        </div>

        <div style={{ backgroundColor: cardBg, borderRadius: '16px', padding: isMobile ? '24px' : '40px', border: `1px solid ${border}` }}>

          <Section title="1. Introduction">
            <p>ReviewLenser ("we", "us", or "our") operates this Service. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our Service. Please read this policy carefully. If you disagree with its terms, please discontinue use of the Service.</p>
          </Section>

          <Section title="2. Information We Collect">
            <p style={{ marginBottom: '16px' }}><strong style={{ color: text }}>2.1 Account Information</strong></p>
            <p style={{ marginBottom: '12px' }}>We use <strong>Firebase Authentication</strong> to manage user identity. Depending on your sign-in method, we may collect:</p>
            <ul style={{ paddingLeft: '20px', marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li><strong>Email/Password sign-in:</strong> Your email address and a securely hashed password (managed by Firebase).</li>
              <li><strong>Google sign-in:</strong> Your name, email address, and Google profile photo, as provided by your Google account.</li>
            </ul>

            <p style={{ marginBottom: '16px' }}><strong style={{ color: text }}>2.2 Usage Data</strong></p>
            <p style={{ marginBottom: '12px' }}>To provide the Service, we record the following data associated with your account:</p>
            <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li><strong>Search history:</strong> The locations and queries you submit to our AI analysis engine.</li>
              <li><strong>Token consumption records:</strong> Logs of your token usage to accurately reflect your balance and subscription status.</li>
              <li><strong>Subscription status:</strong> Whether you hold an active Pro subscription.</li>
            </ul>
          </Section>

          <Section title="3. Payment Information — We Do Not Store Your Card">
            <div style={{ backgroundColor: highlight, border: `1px solid ${highlightBorder}`, borderRadius: '12px', padding: '16px 20px', marginBottom: '16px' }}>
              <p style={{ color: text, fontWeight: '600', margin: 0 }}>
                🔒 ReviewLenser does <u>not</u> collect, process, or store any credit card or banking information whatsoever.
              </p>
            </div>
            <p>All payment transactions are handled exclusively by <strong>Lemon Squeezy</strong>, our third-party payment processor. When you make a purchase, you are submitting your payment details directly to Lemon Squeezy's secure checkout environment. Their handling of your payment data is governed by <strong>Lemon Squeezy's own Privacy Policy</strong>. We only receive a transaction confirmation and your subscription/order status from Lemon Squeezy — never your raw payment details.</p>
          </Section>

          <Section title="4. How We Use Your Information">
            <p style={{ marginBottom: '12px' }}>We use the information we collect for the following purposes:</p>
            <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li>To create and manage your account.</li>
              <li>To provide AI-powered analysis features and deliver search results.</li>
              <li>To track and display your token balance and usage history.</li>
              <li>To manage your subscription status and process access control.</li>
              <li>To communicate service updates, security notices, or support responses.</li>
              <li>To analyze aggregate usage patterns to improve the Service.</li>
            </ul>
          </Section>

          <Section title="5. Data Sharing & Disclosure">
            <p style={{ marginBottom: '12px' }}>We do not sell your personal data. We may share information with:</p>
            <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li><strong>Firebase (Google):</strong> For authentication and database services.</li>
              <li><strong>Lemon Squeezy:</strong> For payment processing and subscription management.</li>
              <li><strong>Google Maps Platform:</strong> Location queries are sent to Google's APIs to retrieve place data.</li>
              <li><strong>Law enforcement:</strong> If required by applicable law or a valid legal process.</li>
            </ul>
          </Section>

          <Section title="6. Data Retention">
            <p>We retain your account data and usage history for as long as your account remains active. If you delete your account, we will delete your personal data within 30 days, except where we are required to retain it by law.</p>
          </Section>

          <Section title="7. Cookies & Local Storage">
            <p>ReviewLenser uses browser <strong>localStorage</strong> to store your preferences (e.g., language, theme) and session state. We do not use third-party advertising cookies. Your data stored in localStorage remains on your device and is not transmitted to our servers.</p>
          </Section>

          <Section title="8. Children's Privacy">
            <p>The Service is not directed at children under the age of 13. We do not knowingly collect personal information from children under 13. If we become aware that we have collected such information, we will take steps to delete it promptly.</p>
          </Section>

          <Section title="9. Your Rights">
            <p style={{ marginBottom: '12px' }}>Depending on your jurisdiction, you may have the right to:</p>
            <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li>Access the personal data we hold about you.</li>
              <li>Request correction of inaccurate data.</li>
              <li>Request deletion of your account and associated data.</li>
              <li>Object to certain types of processing.</li>
            </ul>
            <p style={{ marginTop: '12px' }}>To exercise these rights, please contact us at <strong>support@lenser.ai</strong>.</p>
          </Section>

          <Section title="10. Security">
            <p>We implement industry-standard security measures to protect your data, including Firebase's built-in security rules, encrypted data transmission (HTTPS), and access control. However, no method of transmission over the Internet is 100% secure.</p>
          </Section>

          <Section title="11. Changes to This Policy">
            <p>We may update this Privacy Policy periodically. We will notify you of significant changes by posting the new policy on this page with an updated date. Your continued use of the Service after changes are posted constitutes your acceptance.</p>
          </Section>

        </div>
      </div>
    </div>
  );
};

export default Privacy;
