import React, { useState } from 'react';
import { Icons } from './Icons';

const DISTANCE_STEPS = [0.3, 0.5, 1, 2, 3, 5, 8, 10];

const ControlBar = ({
  styles, isLight, t, showMap, mode, setMode,
  isPro,
  useCurrentLoc, setUseCurrentLoc, customLoc, setCustomLoc, setMapQuery, setMapInputValue,
  category, setCategory, customCategory, setCustomCategory,
  distanceKm, setDistanceKm,
  showRoute, setShowRoute,
  handleUpgradeClick, isMobile, onToggleMap,
  currentUser, onShowHistory, onNewChat, onShowWishlist, wishlistCount
}) => {
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

  const selectWrapperStyle = {
    colorScheme: isLight ? 'light' : 'dark',
    borderRadius: '6px',
    border: `1px solid ${styles.border}`,
    backgroundColor: styles.panel,
    color: styles.text,
    fontSize: '13px',
    display: 'flex',
    alignItems: 'center',
    position: 'relative',
    boxSizing: 'border-box',
    overflow: 'hidden'
  };

  const pureSelectStyle = {
    width: '100%',
    padding: '6px 25px 6px 30px',
    border: 'none',
    backgroundColor: 'transparent',
    color: 'inherit',
    outline: 'none',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: 'bold',
    textAlign: 'center',
    textAlignLast: 'center',
    appearance: 'none',
    WebkitAppearance: 'none'
  };

  const getTabStyle = (active) => ({
    flex: 1,
    padding: '8px',
    backgroundColor: active ? styles.accent : (isLight ? '#eee' : '#333'),
    color: active ? '#fff' : (isLight ? '#555' : '#ccc'),
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: 'bold',
    transition: '0.2s'
  });

  const stepIdx = DISTANCE_STEPS.indexOf(distanceKm) < 0 ? 2 : DISTANCE_STEPS.indexOf(distanceKm);

  const handleLocToggle = () => {
    if (useCurrentLoc) {
      if (!isPro) { handleUpgradeClick(); return; }
      setUseCurrentLoc(false);
      localStorage.setItem('useCurrentLoc', 'false');
    } else {
      setUseCurrentLoc(true);
      localStorage.setItem('useCurrentLoc', 'true');
    }
  };

  const [mobileExpanded, setMobileExpanded] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const settingsPanel = (
    <>
      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: mode === 'recommend' ? '8px' : '0' }}>
        <button onClick={() => setShowRoute(!showRoute)} title={showRoute ? t.routeOff : t.routeOn} style={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '6px', border: `1px solid ${styles.border}`, backgroundColor: showRoute ? styles.accent : 'transparent', color: showRoute ? '#fff' : styles.text, cursor: 'pointer', flexShrink: 0 }}>
          {showRoute ? <Icons.Route /> : <Icons.RouteOff />}
        </button>
        <button onClick={onToggleMap} title={showMap ? t.mapOff : t.mapOn} style={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '6px', border: `1px solid ${styles.border}`, backgroundColor: showMap ? styles.accent : 'transparent', color: showMap ? '#fff' : styles.text, cursor: 'pointer', flexShrink: 0 }}>
          {showMap ? <Icons.Map /> : <Icons.MapOff />}
        </button>
      </div>

      {mode === 'recommend' && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center', width: '100%' }}>
          {/* Location toggle button */}
          <button
            onClick={handleLocToggle}
            style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '6px 12px', borderRadius: '6px', border: `1px solid ${styles.border}`, backgroundColor: useCurrentLoc ? styles.accent : 'transparent', color: useCurrentLoc ? '#fff' : styles.text, cursor: 'pointer', fontSize: '13px', fontWeight: 'bold', flexShrink: 0, whiteSpace: 'nowrap' }}
          >
            <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              {useCurrentLoc
                ? <><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/></>
                : <><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></>
              }
            </svg>
            {useCurrentLoc ? t.locCurr : t.locCust}
            {!isPro && !useCurrentLoc && <Icons.Lock />}
          </button>

          {!useCurrentLoc && (
            <input placeholder={t.locCustPh} value={customLoc} onChange={(e) => { setCustomLoc(e.target.value); localStorage.setItem('customLoc', e.target.value); }} onBlur={(e) => { if (e.target.value) { setMapQuery(e.target.value); setMapInputValue(e.target.value); } }} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); if (e.target.value) { setMapQuery(e.target.value); setMapInputValue(e.target.value); } } }} style={{ ...miniInput, flex: '1 1 100px' }} />
          )}

          {/* Category */}
          <div style={{ ...selectWrapperStyle, flex: '1 1 auto', minWidth: '100px' }}>
            <div style={{ position: 'absolute', left: '10px', color: isLight ? '#555' : '#aaa', pointerEvents: 'none', display: 'flex' }}><Icons.Tag /></div>
            <select value={category} onChange={(e) => setCategory(e.target.value)} style={{ ...pureSelectStyle, paddingLeft: '32px' }}>
              <option value="不限種類">{t.catNone}</option>
              <option value="找餐廳">{t.catRest}</option>
              <option value="找飯店">{t.catHotel}</option>
              <option value="找景點">{t.catAttr}</option>
              <option value="找商店">{t.catShop}</option>
              <option value="自訂分類...">{t.catCustom}</option>
            </select>
            <div style={{ position: 'absolute', right: '8px', pointerEvents: 'none', fontSize: '10px', opacity: 0.5 }}>▼</div>
          </div>
          {category === '自訂分類...' && (
            <input placeholder={t.catCustom} value={customCategory} onChange={(e) => setCustomCategory(e.target.value)} style={{ ...miniInput, flex: '1 1 auto', minWidth: '70px', textAlign: 'center' }} />
          )}

          {/* Distance slider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: '2 1 130px', padding: '4px 10px', borderRadius: '6px', border: `1px solid ${styles.border}`, backgroundColor: isLight ? '#f5f5f5' : '#333', boxSizing: 'border-box' }}>
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke={isLight ? '#555' : '#aaa'} strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            <input
              type="range"
              min="0"
              max={DISTANCE_STEPS.length - 1}
              step="1"
              value={stepIdx}
              onChange={(e) => {
                const km = DISTANCE_STEPS[parseInt(e.target.value)];
                setDistanceKm(km);
                localStorage.setItem('distanceKm', String(km));
              }}
              style={{ flex: 1, accentColor: styles.accent, cursor: 'pointer', margin: 0 }}
            />
            <span style={{ fontSize: '12px', color: styles.text, whiteSpace: 'nowrap', minWidth: '36px', textAlign: 'right', fontWeight: 'bold' }}>{distanceKm}km</span>
          </div>
        </div>
      )}
    </>
  );

  const iconBtn = (onClick, active, children, badge, title) => (
    <button onClick={onClick} title={title} style={{ position: 'relative', flexShrink: 0, width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px', border: `1px solid ${active ? styles.accent : styles.border}`, backgroundColor: active ? `${styles.accent}18` : 'transparent', color: active ? styles.accent : styles.text, cursor: 'pointer' }}>
      {children}
      {badge > 0 && <span style={{ position: 'absolute', top: '-4px', right: '-4px', backgroundColor: styles.accent, color: '#fff', borderRadius: '50%', width: '13px', height: '13px', fontSize: '8px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{badge > 9 ? '9+' : badge}</span>}
    </button>
  );

  if (isMobile) {
    return (
      <div style={{ flexShrink: 0, backgroundColor: styles.panel, padding: '8px 12px 10px', borderRadius: '12px', marginBottom: '8px', border: `1px solid ${styles.border}`, width: '100%', boxSizing: 'border-box' }}>
        {/* Row 1: Mode tabs + action shortcuts + expand toggle */}
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '4px', flex: 1 }}>
            <button onClick={() => setMode('recommend')} style={getTabStyle(mode === 'recommend')}>{t.tabRec}</button>
            <button onClick={() => setMode('evaluate')} style={getTabStyle(mode === 'evaluate')}>{t.tabEval}</button>
          </div>
          {/* History */}
          {currentUser && iconBtn(onShowHistory, false, <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3h6l1 1h8a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="8" y1="16" x2="13" y2="16"/></svg>, 0, t.convHistory)}
          {/* New chat */}
          {currentUser && iconBtn(onNewChat, false, <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14"/></svg>, 0, t.convNewChat)}
          {/* Wishlist (Pro only) */}
          {currentUser && isPro && iconBtn(onShowWishlist, false, <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>, wishlistCount, t.wishlistTitle)}
          {/* Expand/collapse with chevron (not gear) */}
          <button
            onClick={() => setMobileExpanded(v => !v)}
            style={{ flexShrink: 0, width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px', border: `1px solid ${mobileExpanded ? styles.accent : styles.border}`, backgroundColor: mobileExpanded ? `${styles.accent}18` : 'transparent', color: mobileExpanded ? styles.accent : styles.text, cursor: 'pointer' }}
          >
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transform: mobileExpanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>
              <path d="M6 9l6 6 6-6"/>
            </svg>
          </button>
        </div>

        {/* Expandable settings panel */}
        {mobileExpanded && (
          <div style={{ marginTop: '8px', paddingTop: '8px', borderTop: `1px solid ${styles.border}` }}>
            {mode === 'recommend' && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', alignItems: 'center' }}>
                <button
                  onClick={handleLocToggle}
                  style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '6px 10px', borderRadius: '6px', border: `1px solid ${styles.border}`, backgroundColor: useCurrentLoc ? styles.accent : 'transparent', color: useCurrentLoc ? '#fff' : styles.text, cursor: 'pointer', fontSize: '12px', fontWeight: 'bold', flexShrink: 0, whiteSpace: 'nowrap' }}
                >
                  <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    {useCurrentLoc ? <><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/></> : <><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></>}
                  </svg>
                  {useCurrentLoc ? t.locCurr : t.locCust}
                  {!isPro && !useCurrentLoc && <Icons.Lock />}
                </button>
                {!useCurrentLoc && (
                  <input placeholder={t.locCustPh} value={customLoc}
                    onChange={(e) => { setCustomLoc(e.target.value); localStorage.setItem('customLoc', e.target.value); }}
                    onBlur={(e) => { if (e.target.value) { setMapQuery(e.target.value); setMapInputValue(e.target.value); } }}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); if (e.target.value) { setMapQuery(e.target.value); setMapInputValue(e.target.value); } } }}
                    style={{ ...miniInput, flex: '1 1 80px', fontSize: '12px', padding: '6px 8px' }} />
                )}
                <div style={{ ...selectWrapperStyle, flex: '1 1 90px', minWidth: '90px', fontSize: '12px' }}>
                  <div style={{ position: 'absolute', left: '8px', color: isLight ? '#555' : '#aaa', pointerEvents: 'none', display: 'flex' }}><Icons.Tag /></div>
                  <select value={category} onChange={(e) => setCategory(e.target.value)} style={{ ...pureSelectStyle, paddingLeft: '26px', fontSize: '12px' }}>
                    <option value="不限種類">{t.catNone}</option>
                    <option value="找餐廳">{t.catRest}</option>
                    <option value="找飯店">{t.catHotel}</option>
                    <option value="找景點">{t.catAttr}</option>
                    <option value="找商店">{t.catShop}</option>
                    <option value="自訂分類...">{t.catCustom}</option>
                  </select>
                  <div style={{ position: 'absolute', right: '6px', pointerEvents: 'none', fontSize: '9px', opacity: 0.5 }}>▼</div>
                </div>
                {category === '自訂分類...' && (
                  <input placeholder={t.catCustom} value={customCategory} onChange={(e) => setCustomCategory(e.target.value)} style={{ ...miniInput, flex: '1 1 70px', fontSize: '12px', padding: '6px 8px' }} />
                )}
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flex: '2 1 110px', padding: '5px 8px', borderRadius: '6px', border: `1px solid ${styles.border}`, backgroundColor: isLight ? '#f5f5f5' : '#2a2a2a', boxSizing: 'border-box' }}>
                  <input type="range" min="0" max={DISTANCE_STEPS.length - 1} step="1" value={stepIdx}
                    onChange={(e) => { const km = DISTANCE_STEPS[parseInt(e.target.value)]; setDistanceKm(km); localStorage.setItem('distanceKm', String(km)); }}
                    style={{ flex: 1, accentColor: styles.accent, cursor: 'pointer', margin: 0 }} />
                  <span style={{ fontSize: '11px', color: styles.text, whiteSpace: 'nowrap', minWidth: '30px', textAlign: 'right', fontWeight: 'bold' }}>{distanceKm}km</span>
                </div>
                <button onClick={() => setShowRoute(!showRoute)} title={showRoute ? t.routeOff : t.routeOn} style={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '6px', border: `1px solid ${styles.border}`, backgroundColor: showRoute ? styles.accent : 'transparent', color: showRoute ? '#fff' : styles.text, cursor: 'pointer', flexShrink: 0 }}>
                  {showRoute ? <Icons.Route /> : <Icons.RouteOff />}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div style={{ flexShrink: 0, backgroundColor: styles.panel, padding: '12px', borderRadius: '12px', marginBottom: mode === 'recommend' ? '12px' : '0', border: `1px solid ${styles.border}`, maxWidth: showMap ? '100%' : '1000px', alignSelf: showMap ? 'auto' : 'center', width: '100%', boxSizing: 'border-box' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: collapsed ? '0' : (mode === 'recommend' ? '10px' : '0') }}>
        <div style={{ display: 'flex', gap: '4px', flex: '1 1 auto', minWidth: '160px', alignItems: 'center' }}>
          {currentUser && (
            <button onClick={onShowHistory} title={t.convHistory} style={{ background: 'none', border: `1px solid ${styles.border}`, borderRadius: '8px', cursor: 'pointer', color: styles.text, padding: '4px 10px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0 }}>
              <span style={{ fontSize: '14px' }}>☰</span>
            </button>
          )}
          <button onClick={() => setMode('recommend')} style={getTabStyle(mode === 'recommend')}>{t.tabRec}</button>
          <button onClick={() => setMode('evaluate')} style={getTabStyle(mode === 'evaluate')}>{t.tabEval}</button>
        </div>
        {currentUser && (
          <div style={{ display: 'flex', gap: '4px', flexShrink: 0 }}>
            <button onClick={onNewChat} title={t.convNewChat} style={{ background: 'none', border: `1px solid ${styles.border}`, borderRadius: '8px', cursor: 'pointer', color: styles.text, padding: '4px 10px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ fontSize: '14px' }}>✎</span>
            </button>
            <button onClick={onShowWishlist} title={t.wishlistTitle} style={{ background: 'none', border: `1px solid ${styles.border}`, borderRadius: '8px', cursor: 'pointer', color: styles.text, padding: '4px 10px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px', position: 'relative' }}>
              <span style={{ fontSize: '14px' }}>★</span>
              {wishlistCount > 0 && (
                <span style={{ position: 'absolute', top: '-5px', right: '-5px', backgroundColor: styles.accent, color: '#fff', borderRadius: '50%', width: '16px', height: '16px', fontSize: '10px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{wishlistCount}</span>
              )}
            </button>
          </div>
        )}
        <div style={{ display: 'flex', gap: '6px', flexShrink: 0, marginLeft: 'auto' }}>
          <button onClick={onToggleMap} title={showMap ? t.mapOff : t.mapOn} style={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '6px', border: `1px solid ${styles.border}`, backgroundColor: showMap ? styles.accent : 'transparent', color: showMap ? '#fff' : styles.text, cursor: 'pointer' }}>
            {showMap ? <Icons.Map /> : <Icons.MapOff />}
          </button>
          <button onClick={() => setCollapsed(v => !v)} title={collapsed ? '展開設定' : '收起設定'} style={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '6px', border: `1px solid ${styles.border}`, backgroundColor: 'transparent', color: styles.text, cursor: 'pointer', fontSize: '12px' }}>
            {collapsed ? '▼' : '▲'}
          </button>
        </div>
      </div>

      {!collapsed && mode === 'recommend' && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center', width: '100%' }}>
          {/* Location toggle */}
          <button
            onClick={handleLocToggle}
            style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '6px 12px', borderRadius: '6px', border: `1px solid ${styles.border}`, backgroundColor: useCurrentLoc ? styles.accent : 'transparent', color: useCurrentLoc ? '#fff' : styles.text, cursor: 'pointer', fontSize: '13px', fontWeight: 'bold', flexShrink: 0, whiteSpace: 'nowrap' }}
          >
            <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              {useCurrentLoc
                ? <><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/></>
                : <><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></>
              }
            </svg>
            {useCurrentLoc ? t.locCurr : t.locCust}
            {!isPro && !useCurrentLoc && <Icons.Lock />}
          </button>

          {!useCurrentLoc && (
            <input placeholder={t.locCustPh} value={customLoc} onChange={(e) => { setCustomLoc(e.target.value); localStorage.setItem('customLoc', e.target.value); }} onBlur={(e) => { if (e.target.value) { setMapQuery(e.target.value); setMapInputValue(e.target.value); } }} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); if (e.target.value) { setMapQuery(e.target.value); setMapInputValue(e.target.value); } } }} style={{ ...miniInput, flex: '1 1 100px' }} />
          )}

          {/* Category */}
          <div style={{ ...selectWrapperStyle, flex: '1 1 auto', minWidth: '100px' }}>
            <div style={{ position: 'absolute', left: '10px', color: isLight ? '#555' : '#aaa', pointerEvents: 'none', display: 'flex' }}><Icons.Tag /></div>
            <select value={category} onChange={(e) => setCategory(e.target.value)} style={{ ...pureSelectStyle, paddingLeft: '32px' }}>
              <option value="不限種類">{t.catNone}</option>
              <option value="找餐廳">{t.catRest}</option>
              <option value="找飯店">{t.catHotel}</option>
              <option value="找景點">{t.catAttr}</option>
              <option value="找商店">{t.catShop}</option>
              <option value="自訂分類...">{t.catCustom}</option>
            </select>
            <div style={{ position: 'absolute', right: '8px', pointerEvents: 'none', fontSize: '10px', opacity: 0.5 }}>▼</div>
          </div>
          {category === '自訂分類...' && (
            <input placeholder={t.catCustom} value={customCategory} onChange={(e) => setCustomCategory(e.target.value)} style={{ ...miniInput, flex: '1 1 auto', minWidth: '70px', textAlign: 'center' }} />
          )}

          {/* Distance slider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: '2 1 130px', padding: '4px 10px', borderRadius: '6px', border: `1px solid ${styles.border}`, backgroundColor: isLight ? '#f5f5f5' : '#333', boxSizing: 'border-box' }}>
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke={isLight ? '#555' : '#aaa'} strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            <input
              type="range"
              min="0"
              max={DISTANCE_STEPS.length - 1}
              step="1"
              value={stepIdx}
              onChange={(e) => {
                const km = DISTANCE_STEPS[parseInt(e.target.value)];
                setDistanceKm(km);
                localStorage.setItem('distanceKm', String(km));
              }}
              style={{ flex: 1, accentColor: styles.accent, cursor: 'pointer', margin: 0 }}
            />
            <span style={{ fontSize: '12px', color: styles.text, whiteSpace: 'nowrap', minWidth: '36px', textAlign: 'right', fontWeight: 'bold' }}>{distanceKm}km</span>
          </div>
          {/* Route toggle */}
          <button onClick={() => setShowRoute(!showRoute)} title={showRoute ? t.routeOff : t.routeOn} style={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '6px', border: `1px solid ${styles.border}`, backgroundColor: showRoute ? styles.accent : 'transparent', color: showRoute ? '#fff' : styles.text, cursor: 'pointer', flexShrink: 0, marginLeft: 'auto' }}>
            {showRoute ? <Icons.Route /> : <Icons.RouteOff />}
          </button>
        </div>
      )}
    </div>
  );
};

export default ControlBar;
