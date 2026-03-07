import React, { useState } from 'react';
import { Icons } from './Icons';

const ControlBar = ({
  styles, isLight, t, showMap, mode, setMode,
  toneMode, handleToneChange, customTone, setCustomTone, isPro,
  useCurrentLoc, setUseCurrentLoc, customLoc, setCustomLoc, setMapQuery, setMapInputValue,
  category, setCategory, customCategory, setCustomCategory,
  travelMode, setTravelMode, travelTime, handleTravelTimeChange,
  showRoute, setShowRoute,
  getToneIcon, handleUpgradeClick, isMobile, onToggleMap
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

  const getTravelIcon = () => {
    if (travelMode === 'walk') return <Icons.Walk />;
    if (travelMode === 'scooter') return <Icons.Scooter />;
    return <Icons.Car />;
  };

  const [mobileExpanded, setMobileExpanded] = useState(false);

  const settingsPanel = (
    <>
      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '8px' }}>
        <div style={{ ...selectWrapperStyle, flex: toneMode === '自訂...' ? '0 0 110px' : '1 1 auto', minWidth: '100px' }}>
          <div style={{ position: 'absolute', left: '10px', color: isLight ? '#555' : '#aaa', pointerEvents: 'none', display: 'flex' }}>{getToneIcon()}</div>
          <select value={toneMode} onChange={handleToneChange} style={{ ...pureSelectStyle, paddingLeft: '35px' }}>
            <option value="毒舌評論家">{t.toneBrutal}</option>
            <option value="極簡重點">{t.toneBrief}</option>
            <option value="嚴謹專業">{t.tonePro}</option>
            <option value="溫柔推坑">{t.toneWarm}</option>
            <option value="自訂...">{!isPro && '🔒 '}{t.toneCustom}</option>
          </select>
          <div style={{ position: 'absolute', right: '8px', pointerEvents: 'none', fontSize: '10px', opacity: 0.5 }}>▼</div>
        </div>
        {toneMode === '自訂...' && (
          <input placeholder={t.toneCustomPh} value={customTone} onChange={(e) => setCustomTone(e.target.value)} style={{ ...miniInput, flex: '1 1 auto', minWidth: '60px', padding: '6px' }} />
        )}
        <button onClick={() => setShowRoute(!showRoute)} title={showRoute ? t.routeOff : t.routeOn} style={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '6px', border: `1px solid ${styles.border}`, backgroundColor: showRoute ? styles.accent : 'transparent', color: showRoute ? '#fff' : styles.text, cursor: 'pointer', flexShrink: 0 }}>
          {showRoute ? <Icons.Route /> : <Icons.RouteOff />}
        </button>
        <button onClick={onToggleMap} title={showMap ? t.mapOff : t.mapOn} style={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '6px', border: `1px solid ${styles.border}`, backgroundColor: showMap ? styles.accent : 'transparent', color: showMap ? '#fff' : styles.text, cursor: 'pointer', flexShrink: 0 }}>
          {showMap ? <Icons.Map /> : <Icons.MapOff />}
        </button>
      </div>

      {mode === 'recommend' && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center', width: '100%' }}>
          <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexShrink: 0 }}>
            <label style={{ fontSize: '13px', display: 'flex', alignItems: 'center', cursor: 'pointer', whiteSpace: 'nowrap' }}>
              <input type="radio" checked={useCurrentLoc} onChange={() => { setUseCurrentLoc(true); localStorage.setItem('useCurrentLoc', 'true'); }} style={{ marginRight: '4px' }} /> {t.locCurr}
            </label>
            <label style={{ fontSize: '13px', display: 'flex', alignItems: 'center', cursor: 'pointer', whiteSpace: 'nowrap', opacity: isPro ? 1 : 0.6 }} onClick={(e) => { if (!isPro) handleUpgradeClick(e); }}>
              <input type="radio" checked={!useCurrentLoc} onChange={() => { if (isPro) { setUseCurrentLoc(false); localStorage.setItem('useCurrentLoc', 'false'); } }} style={{ marginRight: '4px' }} disabled={!isPro} />
              {!isPro && <span style={{ marginRight: '2px', display: 'flex', alignItems: 'center' }}><Icons.Lock /></span>} {t.locCust}
            </label>
          </div>
          {!useCurrentLoc && (
            <input placeholder={t.locCustPh} value={customLoc} onChange={(e) => { setCustomLoc(e.target.value); localStorage.setItem('customLoc', e.target.value); }} onBlur={(e) => { if (e.target.value) { setMapQuery(e.target.value); setMapInputValue(e.target.value); } }} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); if (e.target.value) { setMapQuery(e.target.value); setMapInputValue(e.target.value); } } }} style={{ ...miniInput, flex: '1 1 100px' }} />
          )}
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
          <div style={{ ...selectWrapperStyle, flex: '2 1 130px', padding: '4px 6px', gap: '2px', backgroundColor: isLight ? '#f5f5f5' : '#333' }}>
            <div style={{ display: 'flex', alignItems: 'center', color: isLight ? '#555' : '#aaa', flexShrink: 0 }}>{getTravelIcon()}</div>
            <select value={travelMode} onChange={(e) => { setTravelMode(e.target.value); localStorage.setItem('travelMode', e.target.value); }} style={{ ...pureSelectStyle, padding: '0 4px', flex: 1, minWidth: '40px' }}>
              <option value="walk">{t.walk}</option>
              <option value="scooter">{t.scooter}</option>
              <option value="drive">{t.drive}</option>
            </select>
            <input type="number" value={travelTime} min="1" max="40" onChange={handleTravelTimeChange} style={{ width: '30px', padding: '2px 0', textAlign: 'center', border: 'none', borderRadius: '4px', backgroundColor: isLight ? '#fff' : '#222', color: 'inherit', outline: 'none', fontSize: '13px', flexShrink: 0 }} />
            <span style={{ fontSize: '12px', color: styles.text, whiteSpace: 'nowrap', flexShrink: 0, paddingLeft: '4px' }}>{t.mins}</span>
          </div>
        </div>
      )}
    </>
  );

  if (isMobile) {
    return (
      <div style={{ flexShrink: 0, backgroundColor: styles.panel, padding: '10px 12px', borderRadius: '12px', marginBottom: '10px', border: `1px solid ${styles.border}`, width: '100%', boxSizing: 'border-box' }}>
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '4px', flex: 1 }}>
            <button onClick={() => setMode('recommend')} style={getTabStyle(mode === 'recommend')}>{t.tabRec}</button>
            <button onClick={() => setMode('evaluate')} style={getTabStyle(mode === 'evaluate')}>{t.tabEval}</button>
          </div>
          <button
            onClick={() => setMobileExpanded(v => !v)}
            style={{ flexShrink: 0, padding: '7px 12px', borderRadius: '8px', border: `1px solid ${styles.border}`, backgroundColor: mobileExpanded ? styles.accent : 'transparent', color: mobileExpanded ? '#fff' : styles.text, cursor: 'pointer', fontSize: '13px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px' }}
          >
            <Icons.Settings />
            <span style={{ fontSize: '10px' }}>{mobileExpanded ? '▲' : '▼'}</span>
          </button>
        </div>
        {mobileExpanded && (
          <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: `1px solid ${styles.border}` }}>
            {settingsPanel}
          </div>
        )}
      </div>
    );
  }

  return (
    <div style={{ flexShrink: 0, backgroundColor: styles.panel, padding: '12px', borderRadius: '12px', marginBottom: mode === 'recommend' ? '12px' : '0', border: `1px solid ${styles.border}`, maxWidth: showMap ? '100%' : '800px', alignSelf: showMap ? 'auto' : 'center', width: '100%', boxSizing: 'border-box' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: mode === 'recommend' ? '10px' : '0' }}>
        <div style={{ display: 'flex', gap: '4px', flex: '1 1 auto', minWidth: '160px' }}>
          <button onClick={() => setMode('recommend')} style={getTabStyle(mode === 'recommend')}>{t.tabRec}</button>
          <button onClick={() => setMode('evaluate')} style={getTabStyle(mode === 'evaluate')}>{t.tabEval}</button>
        </div>
        <div style={{ display: 'flex', gap: '6px', flex: '0 1 auto', justifyContent: 'flex-end', minWidth: '220px' }}>
          <div style={{ display: 'flex', gap: '6px', flex: '1 1 auto', minWidth: 0, justifyContent: 'flex-end' }}>
            <div style={{ ...selectWrapperStyle, flex: toneMode === '自訂...' ? '0 0 110px' : '0 1 140px', minWidth: '100px' }}>
              <div style={{ position: 'absolute', left: '10px', color: isLight ? '#555' : '#aaa', pointerEvents: 'none', display: 'flex' }}>{getToneIcon()}</div>
              <select value={toneMode} onChange={handleToneChange} style={{ ...pureSelectStyle, paddingLeft: '35px' }}>
                <option value="毒舌評論家">{t.toneBrutal}</option>
                <option value="極簡重點">{t.toneBrief}</option>
                <option value="嚴謹專業">{t.tonePro}</option>
                <option value="溫柔推坑">{t.toneWarm}</option>
                <option value="自訂...">{!isPro && '🔒 '}{t.toneCustom}</option>
              </select>
              <div style={{ position: 'absolute', right: '8px', pointerEvents: 'none', fontSize: '10px', opacity: 0.5 }}>▼</div>
            </div>
            {toneMode === '自訂...' && (
              <input placeholder={t.toneCustomPh} value={customTone} onChange={(e) => setCustomTone(e.target.value)} style={{ ...miniInput, flex: '1 1 auto', minWidth: '60px', padding: '6px' }} />
            )}
          </div>
          <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
            <button onClick={() => setShowRoute(!showRoute)} title={showRoute ? t.routeOff : t.routeOn} style={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '6px', border: `1px solid ${styles.border}`, backgroundColor: showRoute ? styles.accent : 'transparent', color: showRoute ? '#fff' : styles.text, cursor: 'pointer' }}>
              {showRoute ? <Icons.Route /> : <Icons.RouteOff />}
            </button>
            <button onClick={onToggleMap} title={showMap ? t.mapOff : t.mapOn} style={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '6px', border: `1px solid ${styles.border}`, backgroundColor: showMap ? styles.accent : 'transparent', color: showMap ? '#fff' : styles.text, cursor: 'pointer' }}>
              {showMap ? <Icons.Map /> : <Icons.MapOff />}
            </button>
          </div>
        </div>
      </div>

      {mode === 'recommend' && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center', width: '100%' }}>
          <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexShrink: 0 }}>
            <label style={{ fontSize: '13px', display: 'flex', alignItems: 'center', cursor: 'pointer', whiteSpace: 'nowrap' }}>
              <input type="radio" checked={useCurrentLoc} onChange={() => { setUseCurrentLoc(true); localStorage.setItem('useCurrentLoc', 'true'); }} style={{ marginRight: '4px' }} /> {t.locCurr}
            </label>
            <label style={{ fontSize: '13px', display: 'flex', alignItems: 'center', cursor: 'pointer', whiteSpace: 'nowrap', opacity: isPro ? 1 : 0.6 }} onClick={(e) => { if (!isPro) handleUpgradeClick(e); }}>
              <input type="radio" checked={!useCurrentLoc} onChange={() => { if (isPro) { setUseCurrentLoc(false); localStorage.setItem('useCurrentLoc', 'false'); } }} style={{ marginRight: '4px' }} disabled={!isPro} />
              {!isPro && <span style={{ marginRight: '2px', display: 'flex', alignItems: 'center' }}><Icons.Lock /></span>} {t.locCust}
            </label>
          </div>
          {!useCurrentLoc && (
            <input placeholder={t.locCustPh} value={customLoc} onChange={(e) => { setCustomLoc(e.target.value); localStorage.setItem('customLoc', e.target.value); }} onBlur={(e) => { if (e.target.value) { setMapQuery(e.target.value); setMapInputValue(e.target.value); } }} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); if (e.target.value) { setMapQuery(e.target.value); setMapInputValue(e.target.value); } } }} style={{ ...miniInput, flex: '1 1 100px' }} />
          )}
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
          <div style={{ ...selectWrapperStyle, flex: '2 1 130px', padding: '4px 6px', gap: '2px', backgroundColor: isLight ? '#f5f5f5' : '#333' }}>
            <div style={{ display: 'flex', alignItems: 'center', color: isLight ? '#555' : '#aaa', flexShrink: 0 }}>{getTravelIcon()}</div>
            <select value={travelMode} onChange={(e) => { setTravelMode(e.target.value); localStorage.setItem('travelMode', e.target.value); }} style={{ ...pureSelectStyle, padding: '0 4px', flex: 1, minWidth: '40px' }}>
              <option value="walk">{t.walk}</option>
              <option value="scooter">{t.scooter}</option>
              <option value="drive">{t.drive}</option>
            </select>
            <input type="number" value={travelTime} min="1" max="40" onChange={handleTravelTimeChange} style={{ width: '30px', padding: '2px 0', textAlign: 'center', border: 'none', borderRadius: '4px', backgroundColor: isLight ? '#fff' : '#222', color: 'inherit', outline: 'none', fontSize: '13px', flexShrink: 0 }} />
            <span style={{ fontSize: '12px', color: styles.text, whiteSpace: 'nowrap', flexShrink: 0, paddingLeft: '4px' }}>{t.mins}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ControlBar;
