import AdBanner from './AdBanner';

const MapPanel = ({
  styles, isLight, t, lang, isMobile, mobileFullHeight, mapPosition, leftWidth,
  isDragging, setIsDragging,
  isPro, mapInputValue, setMapInputValue, setMapQuery, mapQuery,
  onAnalyzePlace,
  location, showRoute, useCurrentLoc, customLoc,
}) => {
  const getRouteStartPoint = () => {
    if (useCurrentLoc && location?.lat) return `${location.lat},${location.lng}`;
    if (!useCurrentLoc && customLoc?.trim()) return customLoc.trim();
    return '';
  };

  const getIframeUrl = () => {
    const langCode = lang === 'zh-TW' ? 'zh-TW' : 'en';
    const mapBase = `https://maps.google.com/maps?hl=${langCode}&`;
    const safeQuery = mapQuery || '台灣';
    if (safeQuery === '台灣') return `${mapBase}q=${encodeURIComponent('台灣')}&z=7&output=embed`;
    if (showRoute) {
      const startPoint = getRouteStartPoint();
      if (startPoint && safeQuery !== startPoint) {
        return `${mapBase}saddr=${encodeURIComponent(startPoint)}&daddr=${encodeURIComponent(safeQuery)}&output=embed`;
      }
    }
    return `${mapBase}q=${encodeURIComponent(safeQuery)}&z=16&output=embed`;
  };

  const getRouteInfo = () => {
    if (!showRoute || !mapQuery || mapQuery === '台灣') return null;
    const startPoint = getRouteStartPoint();
    if (!startPoint) return { url: null };
    const url = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(startPoint)}&destination=${encodeURIComponent(mapQuery)}`;
    return { url };
  };

  const isValidStoreName = mapQuery && mapQuery !== '台灣' && !/^-?\d+(\.\d+)?,-?\d+(\.\d+)?$/.test(mapQuery);

  return (
    <div style={{ width: isMobile ? '100%' : `${leftWidth}px`, height: isMobile ? (mobileFullHeight ? '100%' : '45vh') : '100%', padding: isMobile ? '10px' : '15px', display: 'flex', flexDirection: 'column', borderRight: isMobile || mapPosition === 'right' ? 'none' : `1px solid ${styles.border}`, borderLeft: isMobile || mapPosition === 'left' ? 'none' : `1px solid ${styles.border}`, borderBottom: isMobile ? `1px solid ${styles.border}` : 'none', boxSizing: 'border-box', flexShrink: 0, position: 'relative' }}>
      {isDragging && <div style={{ position: 'absolute', inset: 0, zIndex: 9999, cursor: 'col-resize' }} onClick={() => setIsDragging(false)} />}
      <div style={{ flex: 1, borderRadius: '12px', overflow: 'hidden', border: `1px solid ${styles.border}`, backgroundColor: styles.panel, position: 'relative', display: 'flex', flexDirection: 'column' }}>

        {/* Map iframe */}
        <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
          <iframe
            src={getIframeUrl()}
            style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, width: '100%', height: '100%', border: 'none', filter: isLight ? 'none' : 'invert(90%) hue-rotate(180deg)' }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
          {(() => {
            const route = getRouteInfo();
            if (!route || !route.url) return null;
            return (
              <a href={route.url} target="_blank" rel="noopener noreferrer" title={lang === 'zh-TW' ? '在 Google Maps 開啟路線' : 'Open in Google Maps'} style={{ position: 'absolute', top: '10px', right: '10px', zIndex: 20, backgroundColor: styles.accent, color: '#fff', width: '36px', height: '36px', borderRadius: '50%', boxShadow: '0 2px 8px rgba(0,0,0,0.3)', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12h18M13 6l6 6-6 6"/></svg>
              </a>
            );
          })()}
        </div>

        {!isPro && <AdBanner isLight={isLight} t={t} mode="bottom" />}

        {/* Floating search input + analyze button */}
        <div style={{ position: 'absolute', bottom: isPro ? '20px' : '85px', left: '50%', transform: 'translateX(-50%)', zIndex: 10, width: '85%', maxWidth: '400px', display: 'flex', gap: '8px' }}>
          <input
            placeholder={t.mapPh}
            value={mapInputValue}
            onChange={(e) => setMapInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && mapInputValue.trim()) {
                e.preventDefault();
                setMapQuery(mapInputValue.trim());
              }
            }}
            style={{ flex: 1, padding: '12px 20px', borderRadius: '30px', border: `1px solid ${styles.border}`, boxShadow: '0 4px 15px rgba(0,0,0,0.15)', backgroundColor: styles.panel, color: styles.text, fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
          />
          {isValidStoreName && onAnalyzePlace && (
            <button
              onClick={onAnalyzePlace}
              title={lang === 'zh-TW' ? '透視此地點' : 'Analyze'}
              style={{ padding: '12px 16px', borderRadius: '30px', border: 'none', backgroundColor: styles.accent, color: '#fff', fontWeight: 'bold', fontSize: '13px', cursor: 'pointer', whiteSpace: 'nowrap', boxShadow: '0 4px 15px rgba(0,0,0,0.15)' }}
            >
              {lang === 'zh-TW' ? '🔍 透視' : '🔍'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MapPanel;
