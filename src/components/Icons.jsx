const iconProps = { fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" };

export const Icons = {
  Map: () => <svg viewBox="0 0 24 24" width="18" height="18" {...iconProps}><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"></polygon><line x1="8" y1="2" x2="8" y2="18"></line><line x1="16" y1="6" x2="16" y2="22"></line></svg>,
  MapOff: () => <svg viewBox="0 0 24 24" width="18" height="18" {...iconProps}><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"></polygon><line x1="8" y1="2" x2="8" y2="18"></line><line x1="16" y1="6" x2="16" y2="22"></line><line x1="2" y1="2" x2="22" y2="22"></line></svg>,
  Route: () => <svg viewBox="0 0 24 24" width="18" height="18" {...iconProps}><circle cx="6" cy="19" r="3"></circle><path d="M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15"></path><circle cx="18" cy="5" r="3"></circle></svg>,
  RouteOff: () => <svg viewBox="0 0 24 24" width="18" height="18" {...iconProps}><line x1="2" y1="2" x2="22" y2="22"></line><circle cx="6" cy="19" r="3"></circle><path d="M9 19h8.5a3.5 3.5 0 0 0 2.5-1"></path><path d="M15 5h-1.5"></path><circle cx="18" cy="5" r="3"></circle></svg>,
  Settings: () => <svg viewBox="0 0 24 24" width="20" height="20" {...iconProps}><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>,
  Flame: () => <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l3 5 6-1-4 4 2 6-6-3-6 3 2-6-4-4 6 1z" /></svg>,
  Zap: () => <svg viewBox="0 0 24 24" width="16" height="16" {...iconProps}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>,
  Briefcase: () => <svg viewBox="0 0 24 24" width="16" height="16" {...iconProps}><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>,
  Heart: () => <svg viewBox="0 0 24 24" width="16" height="16" {...iconProps}><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>,
  Palette: () => (<svg viewBox="0 0 24 24" width="16" height="16" {...iconProps}><path d="M12 2.05c-5.52 0-10 4.48-10 10s4.48 10 10 10c1.85 0 3.33-1.5 3.33-3.33 0-.82-.31-1.57-.83-2.14-.5-.54-.83-1.28-.83-2.03 0-1.66 1.34-3 3-3h1.8c1.9 0 3.48-1.57 3.53-3.48A9.975 9.975 0 0 0 12 2.05z" /><circle cx="7.5" cy="10.5" r="1.5" fill="currentColor" stroke="none" /><circle cx="10.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" /><circle cx="14.5" cy="7.5" r="1.5" fill="currentColor" stroke="none" /></svg>),
  Walk: () => (<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="13" cy="4" r="1.5" fill="currentColor" stroke="none"/><path d="M10 21l1.5-5.5-2 2.5"/><path d="M14 21l-1-4 2-2.5"/><path d="M8 12l2-4.5 3 2.5 2-1.5"/><path d="M7 17l1.5-5"/><path d="M16 10l1.5 5"/></svg>),
  Scooter: () => <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="6" cy="17" r="2.5"/><circle cx="18" cy="17" r="2.5"/><path d="M8.5 17h7"/><path d="M18 17V12.5l-3.5-3h-5L8 14.5"/><path d="M9 9.5L8 7H5"/><path d="M21 12h-3"/><path d="M15.5 9.5L14 7"/></svg>,
  Car: () => <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M5 17H3v-5l2.5-5h11l2.5 5v5h-2"/><rect x="7" y="16.5" width="10" height="1" rx="0.5"/><circle cx="7.5" cy="17" r="2"/><circle cx="16.5" cy="17" r="2"/><path d="M5 12h14"/></svg>,
  Send: () => <svg viewBox="0 0 24 24" width="18" height="18" {...iconProps} fill="currentColor" stroke="none"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" /></svg>,
  Tag: () => <svg viewBox="0 0 24 24" width="14" height="14" {...iconProps}><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path><line x1="7" y1="7" x2="7.01" y2="7"></line></svg>,
  List: () => <svg viewBox="0 0 24 24" width="14" height="14" {...iconProps}><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>,
  Check: () => <svg viewBox="0 0 24 24" width="16" height="16" {...iconProps}><polyline points="20 6 9 17 4 12"></polyline></svg>,
  Lock: () => <svg viewBox="0 0 24 24" width="12" height="12" {...iconProps} style={{ opacity: 0.6 }}><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>,
  Shield: () => <svg viewBox="0 0 24 24" width="24" height="24" {...iconProps}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>,
  Compass: () => <svg viewBox="0 0 24 24" width="24" height="24" {...iconProps}><circle cx="12" cy="12" r="10" /><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" /></svg>,
  Brain: () => <svg viewBox="0 0 24 24" width="24" height="24" {...iconProps}><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z" /><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z" /></svg>,
  Mic: () => <svg viewBox="0 0 24 24" width="16" height="16" {...iconProps}><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line></svg>,
  Speaker: () => <svg viewBox="0 0 24 24" width="14" height="14" {...iconProps}><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path><path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path></svg>,
  Refresh: () => <svg viewBox="0 0 24 24" width="14" height="14" {...iconProps}><polyline points="1 4 1 10 7 10"></polyline><polyline points="23 20 23 14 17 14"></polyline><path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"></path></svg>,
  Cross: () => <svg viewBox="0 0 24 24" width="18" height="18" {...iconProps} stroke="#ff4d4d"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>,
  CheckGreen: () => <svg viewBox="0 0 24 24" width="18" height="18" {...iconProps} stroke="#22c55e"><polyline points="20 6 9 17 4 12"></polyline></svg>,
  Logo: ({ isLight = true }) => (
    <svg viewBox="0 0 100 100" width="100%" height="100%" fill="none" overflow="visible">
      {isLight ? (
        <>
          {/* Sun glow (upper-left, matching 120deg background angle) */}
          <circle cx="7" cy="14" r="11" fill="#fbbf24" fillOpacity="0.18"/>
          <circle cx="7" cy="14" r="6"  fill="#fbbf24" fillOpacity="0.9"/>
          {/* Sunbeam entering prism left face (~120deg angle) */}
          <line x1="11" y1="20" x2="28" y2="48" stroke="#fbbf24" strokeWidth="3.5" strokeLinecap="round" opacity="0.85"/>
        </>
      ) : (
        <>
          <style>{`
            @keyframes rl-tw{0%,100%{opacity:.35}50%{opacity:1}}
            .rl-s1{animation:rl-tw 2s ease-in-out infinite}
            .rl-s2{animation:rl-tw 2s ease-in-out infinite .65s}
            .rl-s3{animation:rl-tw 2s ease-in-out infinite 1.3s}
          `}</style>
          {/* Stars (upper-left) */}
          <circle className="rl-s1" cx="8"  cy="10" r="2.8" fill="white"/>
          <circle className="rl-s2" cx="22" cy="4"  r="1.8" fill="white"/>
          <circle className="rl-s3" cx="3"  cy="28" r="1.6" fill="white"/>
          {/* Starburst cross on main star */}
          <line className="rl-s1" x1="8" y1="5"  x2="8"  y2="15" stroke="white" strokeWidth="1.2" strokeLinecap="round"/>
          <line className="rl-s1" x1="3" y1="10" x2="13" y2="10" stroke="white" strokeWidth="1.2" strokeLinecap="round"/>
          {/* Light beam from star through prism */}
          <line x1="8" y1="13" x2="28" y2="48" stroke="white" strokeWidth="2.8" strokeLinecap="round" opacity="0.4"/>
        </>
      )}

      {/* Prism body */}
      <polygon
        points="50,5 4,90 96,90"
        fill={isLight ? '#f59e0b' : '#818cf8'}
        fillOpacity="0.08"
        stroke={isLight ? '#f59e0b' : '#818cf8'}
        strokeWidth="6"
        strokeLinejoin="round"
      />
      {/* Internal light ray through prism */}
      <line x1="28" y1="48" x2="73" y2="48" stroke={isLight ? '#fbbf24' : 'white'} strokeWidth="2.5" strokeLinecap="round" opacity="0.75"/>

      {/* Rainbow rays fanning from right-face exit point (73, 48) */}
      <line x1="73" y1="48" x2="98" y2="26" stroke="#f87171" strokeWidth="3"   strokeLinecap="round"/>
      <line x1="73" y1="48" x2="98" y2="35" stroke="#fb923c" strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="73" y1="48" x2="98" y2="44" stroke="#facc15" strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="73" y1="48" x2="98" y2="53" stroke="#34d399" strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="73" y1="48" x2="98" y2="64" stroke="#60a5fa" strokeWidth="3"   strokeLinecap="round"/>
    </svg>
  )
};
