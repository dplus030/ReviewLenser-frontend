import { Icons } from '../components/Icons';

const Refund = ({ isLight, isMobile, setView }) => {
  const bg = isLight ? '#f5f7fa' : '#0f0f11';
  const text = isLight ? '#333333' : '#f0f0f0';
  const muted = isLight ? '#666666' : '#999999';
  const border = isLight ? '#e0e0e0' : '#2a2a2a';
  const cardBg = isLight ? '#ffffff' : '#1a1a1a';
  const accent = isLight ? '#f59e0b' : '#007BFF';
  const warnBg = isLight ? '#fff7ed' : '#1a0e00';
  const warnBorder = isLight ? '#f59e0b' : '#b45309';

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
            Refund Policy
          </h1>
          <p style={{ color: muted, fontSize: '0.95rem' }}>Last updated: March 2026</p>
        </div>

        {/* Key summary callout */}
        <div style={{ backgroundColor: warnBg, border: `1px solid ${warnBorder}`, borderRadius: '16px', padding: '20px 24px', marginBottom: '32px' }}>
          <p style={{ color: text, fontWeight: '700', fontSize: '1rem', margin: '0 0 8px' }}>Policy Summary</p>
          <p style={{ color: muted, margin: 0, lineHeight: '1.7' }}>
            ReviewLenser provides <strong style={{ color: text }}>instantly consumed virtual tokens and AI compute</strong>. Because the service is rendered at the moment of purchase, <strong style={{ color: text }}>all payments are final and non-refundable</strong> once tokens have been credited to your account.
          </p>
        </div>

        <div style={{ backgroundColor: cardBg, borderRadius: '16px', padding: isMobile ? '24px' : '40px', border: `1px solid ${border}` }}>

          <Section title="1. Nature of the Service">
            <p>ReviewLenser is an AI-powered analysis platform that operates on a <strong style={{ color: text }}>virtual token system</strong>. Tokens represent prepaid AI compute credits that are consumed in real-time each time you run an analysis. The underlying AI computation is executed and the resources are irrevocably consumed at the moment you submit a query.</p>
            <p style={{ marginTop: '12px' }}>Because our service delivers immediate, real-time digital value that cannot be "returned" or "unused" after consumption, a different standard applies to refunds compared to tangible goods.</p>
          </Section>

          <Section title="2. Subscriptions (Pro Plan — NT$299/month)">
            <p style={{ marginBottom: '16px' }}>The ReviewLenser Pro Plan is billed on a monthly recurring basis at <strong style={{ color: text }}>NT$299 per month</strong>, which includes a monthly allotment of tokens credited to your account upon payment.</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ backgroundColor: isLight ? '#fef9f0' : '#111a0a', border: `1px solid ${isLight ? '#fbbf24' : '#166534'}`, borderRadius: '10px', padding: '16px' }}>
                <p style={{ color: text, fontWeight: '700', margin: '0 0 6px' }}>Non-Refundable Once Tokens Are Credited</p>
                <p style={{ margin: 0 }}>Once your monthly payment is processed and tokens are credited to your account, that payment is <strong style={{ color: text }}>non-refundable</strong>. This applies regardless of whether you have used the tokens.</p>
              </div>

              <div style={{ backgroundColor: isLight ? '#f0fdf4' : '#0a1a10', border: `1px solid ${isLight ? '#86efac' : '#166534'}`, borderRadius: '10px', padding: '16px' }}>
                <p style={{ color: text, fontWeight: '700', margin: '0 0 6px' }}>Cancel Anytime</p>
                <p style={{ margin: 0 }}>You may cancel your Pro subscription at any time from your account settings. Cancellation takes effect at the <strong style={{ color: text }}>end of your current billing period</strong>. You will retain full Pro access and your remaining tokens through the end of the period you have already paid for.</p>
              </div>

              <div style={{ backgroundColor: isLight ? '#fff1f2' : '#1a0a0a', border: `1px solid ${isLight ? '#fca5a5' : '#7f1d1d'}`, borderRadius: '10px', padding: '16px' }}>
                <p style={{ color: text, fontWeight: '700', margin: '0 0 6px' }}>No Pro-Rated Refunds</p>
                <p style={{ margin: 0 }}>We do not issue partial or pro-rated refunds for any unused portion of a billing period. If you cancel on Day 5 of a 30-day billing cycle, you will not receive a refund for the remaining 25 days.</p>
              </div>
            </div>
          </Section>

          <Section title="3. Token Top-Ups (One-Time Purchases)">
            <p style={{ marginBottom: '12px' }}>One-time token top-up purchases are <strong style={{ color: text }}>strictly non-refundable</strong> once the transaction is confirmed and tokens are credited to your account, for the following reasons:</p>
            <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <li>Tokens are virtual digital goods delivered instantly upon purchase.</li>
              <li>There is no mechanism to "return" digital credits once they have been issued.</li>
              <li>AI compute resources are pre-allocated the moment tokens are credited.</li>
            </ul>
            <p style={{ marginTop: '12px' }}>Token balances do not expire and can be used at any time while your account remains active.</p>
          </Section>

          <Section title="4. Exceptions — When We May Issue a Refund">
            <p style={{ marginBottom: '12px' }}>While our general policy is non-refundable, we may consider refund requests on a case-by-case basis in the following exceptional circumstances:</p>
            <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <li><strong style={{ color: text }}>Duplicate charge:</strong> You were charged more than once for the same transaction due to a technical error on our platform.</li>
              <li><strong style={{ color: text }}>Tokens not credited:</strong> Your payment was successfully processed but tokens were not credited to your account within 24 hours, and the issue persists after contacting support.</li>
            </ul>
            <p style={{ marginTop: '12px' }}>To request a review under these exceptions, please contact us at <strong style={{ color: text }}>support@lenser.ai</strong> within <strong style={{ color: text }}>7 days</strong> of the transaction with your order ID and a description of the issue.</p>
          </Section>

          <Section title="5. Chargebacks">
            <p>Filing a fraudulent chargeback with your bank or card issuer for a valid charge (i.e., one covered by this non-refundable policy) constitutes a breach of these Terms. ReviewLenser reserves the right to immediately suspend or permanently ban accounts associated with fraudulent chargeback activity.</p>
          </Section>

          <Section title="6. Payment Processing">
            <p>All payments are processed securely by <strong style={{ color: text }}>Lemon Squeezy</strong>. ReviewLenser does not store your payment information. For payment-related issues specific to Lemon Squeezy's platform, you may also refer to Lemon Squeezy's own support resources.</p>
          </Section>

        </div>
      </div>
    </div>
  );
};

export default Refund;
