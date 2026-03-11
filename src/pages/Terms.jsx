import { Icons } from '../components/Icons';

const Terms = ({ isLight, isMobile, setView }) => {
  const bg = isLight ? '#f5f7fa' : '#0f0f11';
  const text = isLight ? '#333333' : '#f0f0f0';
  const muted = isLight ? '#666666' : '#999999';
  const border = isLight ? '#e0e0e0' : '#2a2a2a';
  const cardBg = isLight ? '#ffffff' : '#1a1a1a';
  const accent = isLight ? '#f59e0b' : '#007BFF';

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
            Terms & Conditions
          </h1>
          <p style={{ color: muted, fontSize: '0.95rem' }}>Last updated: March 2026</p>
        </div>

        <div style={{ backgroundColor: cardBg, borderRadius: '16px', padding: isMobile ? '24px' : '40px', border: `1px solid ${border}` }}>

          <Section title="1. Acceptance of Terms">
            <p>By accessing or using ReviewLenser ("the Service"), you agree to be bound by these Terms & Conditions. If you do not agree with any part of these terms, you may not use the Service.</p>
          </Section>

          <Section title="2. Description of Service">
            <p>ReviewLenser is an AI-powered SaaS platform that aggregates and analyzes publicly available reviews from third-party mapping and review services (such as Google Maps) to provide location-based insights for restaurants and attractions. The Service is intended to help users make informed decisions based on synthesized public data.</p>
          </Section>

          <Section title="3. Nature of AI Analysis — No Accuracy Guarantee">
            <p style={{ marginBottom: '12px' }}>Our AI-generated analyses are based on publicly available review data sourced from third-party platforms. By using ReviewLenser, you acknowledge and agree that:</p>
            <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <li>All AI-generated content is provided <strong>for entertainment and reference purposes only</strong> and does not constitute professional advice of any kind.</li>
              <li>ReviewLenser makes <strong>no warranty or representation</strong> regarding the accuracy, completeness, timeliness, or reliability of any AI-generated analysis.</li>
              <li>AI outputs may contain errors, reflect outdated information, or fail to capture the full context of any reviewed location.</li>
              <li>ReviewLenser shall not be held liable for any decisions made based on AI-generated content.</li>
            </ul>
          </Section>

          <Section title="4. Intellectual Property">
            <p>All content, features, and functionality on ReviewLenser — including but not limited to the software, UI design, branding, and original text — are the exclusive property of Lenser AI and are protected by applicable intellectual property laws.</p>
          </Section>

          <Section title="5. User Accounts & Eligibility">
            <p>You must be at least 13 years of age to use the Service. By creating an account, you represent that the information you provide is accurate and that you will maintain its accuracy. You are responsible for maintaining the confidentiality of your login credentials.</p>
          </Section>

          <Section title="6. Prohibited Use of API & Service">
            <p style={{ marginBottom: '12px' }}>You agree not to misuse the Service. Prohibited activities include, but are not limited to:</p>
            <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <li><strong>API Abuse:</strong> Sending automated, bulk, or scripted requests that exceed normal usage patterns or circumvent any rate-limiting measures.</li>
              <li><strong>Reverse Engineering:</strong> Attempting to decompile, disassemble, or otherwise extract the source code of the Service.</li>
              <li><strong>Data Scraping:</strong> Using automated tools to extract data from the Service at scale.</li>
              <li><strong>Reselling:</strong> Reselling, redistributing, or sublicensing access to the Service without written permission.</li>
              <li>Any activity that violates applicable local, national, or international laws or regulations.</li>
            </ul>
            <p style={{ marginTop: '12px' }}>Violation of these terms may result in immediate suspension or termination of your account without refund.</p>
          </Section>

          <Section title="7. Tokens & Subscription">
            <p>ReviewLenser operates on a token-based system. Tokens are virtual credits used to access AI analysis features. Token purchases and subscription fees are governed by our <button onClick={() => setView('refund')} style={{ background: 'none', border: 'none', color: accent, cursor: 'pointer', padding: 0, fontSize: 'inherit', textDecoration: 'underline' }}>Refund Policy</button>.</p>
          </Section>

          <Section title="8. Third-Party Services">
            <p>ReviewLenser integrates with third-party services including Google Maps Platform and Lemon Squeezy for payment processing. Your use of these third-party services is subject to their respective terms of service and privacy policies. ReviewLenser is not responsible for the practices of these third parties.</p>
          </Section>

          <Section title="9. Disclaimer of Warranties">
            <p>The Service is provided on an "AS IS" and "AS AVAILABLE" basis without warranties of any kind, either express or implied. We do not warrant that the Service will be uninterrupted, error-free, or free from viruses or other harmful components.</p>
          </Section>

          <Section title="10. Limitation of Liability">
            <p>To the fullest extent permitted by applicable law, Lenser AI shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of, or inability to use, the Service.</p>
          </Section>

          <Section title="11. Modifications to Terms">
            <p>We reserve the right to modify these Terms at any time. Continued use of the Service after changes are posted constitutes your acceptance of the updated Terms.</p>
          </Section>

          <Section title="12. Governing Law">
            <p>These Terms shall be governed by and construed in accordance with the laws of Taiwan (R.O.C.), without regard to its conflict of law provisions.</p>
          </Section>

        </div>
      </div>
    </div>
  );
};

export default Terms;
