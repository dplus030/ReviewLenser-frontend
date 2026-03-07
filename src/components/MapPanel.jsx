import { useState, useEffect } from 'react';
import { APIProvider, Map, AdvancedMarker, Pin, useMap, useMapsLibrary } from '@vis.gl/react-google-maps';
import AdBanner from './AdBanner';

const MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

// Inner component — needs useMap/useMapsLibrary hooks (must be child of Map)
function MapInner({ mapQuery, places, location, useCurrentLoc, styles, onPinClick, clickedLocation }) {
  const map = useMap();
  const placesLib = useMapsLibrary('places');

  // Handle POI (store/place) clicks on the map — get details and trigger selection
  useEffect(() => {
    if (!map || !placesLib) return;
    const listener = map.addListener('click', (event) => {
      if (!event.placeId) return;
      event.stop(); // prevent default Google info window
      const svc = new placesLib.PlacesService(map);
      svc.getDetails(
        { placeId: event.placeId, fields: ['name', 'geometry', 'rating', 'place_id'] },
        (result, status) => {
          if (status === placesLib.PlacesServiceStatus.OK && result) {
            onPinClick({
              place_id: result.place_id,
              name: result.name,
              lat: result.geometry.location.lat(),
              lng: result.geometry.location.lng(),
              rating: result.rating,
            });
          }
        }
      );
    });
    return () => listener.remove();
  }, [map, placesLib, onPinClick]);

  // Fit/center on recommended places
  useEffect(() => {
    if (!map || !places || places.length === 0) return;
    if (places.length === 1) {
      map.setCenter({ lat: places[0].lat, lng: places[0].lng });
      map.setZoom(16);
    } else {
      const bounds = new window.google.maps.LatLngBounds();
      places.forEach(p => { if (p.lat && p.lng) bounds.extend({ lat: p.lat, lng: p.lng }); });
      map.fitBounds(bounds, 80);
    }
  }, [map, places]);

  // Center on mapQuery text when no places
  useEffect(() => {
    if (!map || (places && places.length > 0)) return;
    const q = mapQuery || '';
    if (!q || q === '台灣') return;
    const isCoord = /^-?\d+(\.\d+)?,-?\d+(\.\d+)?$/.test(q);
    if (isCoord) {
      const [lat, lng] = q.split(',').map(Number);
      map.setCenter({ lat, lng });
      map.setZoom(15);
      return;
    }
    if (!placesLib) return;
    const svc = new placesLib.PlacesService(map);
    svc.findPlaceFromQuery(
      { query: q, fields: ['geometry'] },
      (results, status) => {
        if (status === placesLib.PlacesServiceStatus.OK && results?.[0]?.geometry?.location) {
          map.setCenter(results[0].geometry.location);
          map.setZoom(16);
        }
      }
    );
  }, [map, mapQuery, places, placesLib]);

  return (
    <>
      {/* User/custom location dot */}
      {useCurrentLoc && location?.lat && (
        <AdvancedMarker position={{ lat: location.lat, lng: location.lng }}>
          <div style={{ width: 14, height: 14, borderRadius: '50%', backgroundColor: '#4285F4', border: '3px solid white', boxShadow: '0 2px 6px rgba(0,0,0,0.4)' }} />
        </AdvancedMarker>
      )}

      {/* Clicked location marker */}
      {clickedLocation && (
        <AdvancedMarker position={clickedLocation}>
          <div style={{ width: 20, height: 20, borderRadius: '50%', backgroundColor: '#EA4335', border: '3px solid white', boxShadow: '0 2px 8px rgba(0,0,0,0.5)' }} />
        </AdvancedMarker>
      )}

      {/* Recommended place pins */}
      {places && places.map((place, i) => (
        <AdvancedMarker
          key={place.place_id || `place-${i}`}
          position={{ lat: place.lat, lng: place.lng }}
          onClick={() => onPinClick && onPinClick(place)}
          title={place.name}
        >
          <Pin
            background={styles.accent}
            borderColor={styles.accent}
            glyphColor={'#fff'}
            glyph={String(i + 1)}
            scale={1.1}
          />
        </AdvancedMarker>
      ))}
    </>
  );
}

// Fallback iframe when no VITE_GOOGLE_MAPS_API_KEY
function FallbackIframe({ mapQuery, lang, isLight, showRoute, location, useCurrentLoc, customLoc }) {
  const getRouteStartPoint = () => {
    if (useCurrentLoc && location?.lat) return `${location.lat},${location.lng}`;
    if (!useCurrentLoc && customLoc?.trim()) return customLoc.trim();
    return '';
  };
  const langCode = lang === 'zh-TW' ? 'zh-TW' : 'en';
  const mapBase = `https://maps.google.com/maps?hl=${langCode}&`;
  const safeQuery = mapQuery || '台灣';
  let src;
  if (safeQuery === '台灣') {
    src = `${mapBase}q=${encodeURIComponent('台灣')}&z=7&output=embed`;
  } else if (showRoute) {
    const start = getRouteStartPoint();
    if (start && safeQuery !== start) {
      src = `${mapBase}saddr=${encodeURIComponent(start)}&daddr=${encodeURIComponent(safeQuery)}&output=embed`;
    } else {
      src = `${mapBase}q=${encodeURIComponent(safeQuery)}&z=16&output=embed`;
    }
  } else {
    src = `${mapBase}q=${encodeURIComponent(safeQuery)}&z=16&output=embed`;
  }
  return (
    <iframe
      src={src}
      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none', filter: isLight ? 'none' : 'invert(90%) hue-rotate(180deg)' }}
      allowFullScreen
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
    />
  );
}

const MapPanel = ({
  styles, isLight, t, lang, isMobile, mobileFullHeight, mapPosition, leftWidth,
  isDragging, setIsDragging,
  isPro, mapInputValue, setMapInputValue, setMapQuery, mapQuery,
  onAnalyzePlace, onAddToWishlist, isInWishlist, places,
  location, showRoute, useCurrentLoc, customLoc,
}) => {
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [clickedLocation, setClickedLocation] = useState(null);

  const handleMapClick = (event) => {
    if (event.detail?.placeId) return; // POI clicks handled in MapInner
    const { lat, lng } = event.detail.latLng;
    setClickedLocation({ lat, lng });
  };

  const getRouteStartPoint = () => {
    if (useCurrentLoc && location?.lat) return `${location.lat},${location.lng}`;
    if (!useCurrentLoc && customLoc?.trim()) return customLoc.trim();
    return '';
  };

  const isValidStoreName = mapQuery && mapQuery !== '台灣' && !/^-?\d+(\.\d+)?,-?\d+(\.\d+)?$/.test(mapQuery);

  const routeUrl = (() => {
    if (!showRoute || !isValidStoreName) return null;
    const start = getRouteStartPoint();
    if (start) {
      return `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(start)}&destination=${encodeURIComponent(mapQuery)}`;
    }
    return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(mapQuery)}`;
  })();

  const defaultCenter = location?.lat
    ? { lat: location.lat, lng: location.lng }
    : { lat: 23.5, lng: 121.0 };
  const defaultZoom = location?.lat ? 15 : 7;

  const handlePinClick = (place) => {
    setSelectedPlace(place);
    setMapQuery(place.name);
    setMapInputValue(place.name);
  };

  return (
    <div style={{ width: isMobile ? '100%' : `${leftWidth}px`, height: isMobile ? (mobileFullHeight ? '100%' : '45vh') : '100%', padding: isMobile ? '10px' : '15px', display: 'flex', flexDirection: 'column', borderRight: isMobile || mapPosition === 'right' ? 'none' : `1px solid ${styles.border}`, borderLeft: isMobile || mapPosition === 'left' ? 'none' : `1px solid ${styles.border}`, borderBottom: isMobile ? `1px solid ${styles.border}` : 'none', boxSizing: 'border-box', flexShrink: 0, position: 'relative' }}>
      {isDragging && <div style={{ position: 'absolute', inset: 0, zIndex: 9999, cursor: 'col-resize' }} onClick={() => setIsDragging(false)} />}

      <div style={{ flex: 1, borderRadius: '12px', overflow: 'hidden', border: `1px solid ${styles.border}`, backgroundColor: styles.panel, position: 'relative', display: 'flex', flexDirection: 'column' }}>
        {/* Map area */}
        <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
          {MAPS_API_KEY ? (
            <APIProvider apiKey={MAPS_API_KEY} language="zh-TW">
              <Map
                defaultCenter={defaultCenter}
                defaultZoom={defaultZoom}
                mapId="DEMO_MAP_ID"
                colorScheme={isLight ? 'LIGHT' : 'DARK'}
                style={{ width: '100%', height: '100%' }}
                gestureHandling="greedy"
                onClick={handleMapClick}
                disableDefaultUI={false}
                mapTypeControl={false}
                streetViewControl={false}
              >
                <MapInner
                  mapQuery={mapQuery}
                  places={places}
                  location={location}
                  useCurrentLoc={useCurrentLoc}
                  styles={styles}
                  onPinClick={handlePinClick}
                  clickedLocation={clickedLocation}
                />
              </Map>
            </APIProvider>
          ) : (
            <FallbackIframe
              mapQuery={mapQuery}
              lang={lang}
              isLight={isLight}
              showRoute={showRoute}
              location={location}
              useCurrentLoc={useCurrentLoc}
              customLoc={customLoc}
            />
          )}

          {/* Route link overlay */}
          {routeUrl && (
            <a
              href={routeUrl}
              target="_blank"
              rel="noopener noreferrer"
              title={lang === 'zh-TW' ? '在 Google Maps 開啟路線' : 'Open in Google Maps'}
              style={{ position: 'absolute', top: '10px', right: '10px', zIndex: 20, backgroundColor: styles.accent, color: '#fff', width: '36px', height: '36px', borderRadius: '50%', boxShadow: '0 2px 8px rgba(0,0,0,0.3)', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12h18M13 6l6 6-6 6"/></svg>
            </a>
          )}

          {/* Selected place tooltip */}
          {selectedPlace && MAPS_API_KEY && (
            <div style={{ position: 'absolute', top: '10px', left: '10px', zIndex: 20, backgroundColor: styles.panel, border: `1px solid ${styles.border}`, borderRadius: '10px', padding: '8px 12px', maxWidth: '200px', boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }}>
              <div style={{ fontSize: '13px', fontWeight: 'bold', color: styles.text, marginBottom: '2px', paddingRight: '20px' }}>{selectedPlace.name}</div>
              {selectedPlace.rating && <div style={{ fontSize: '12px', color: styles.accent }}>{'★'.repeat(Math.min(5, Math.round(selectedPlace.rating)))} {selectedPlace.rating}</div>}
              <div style={{ display: 'flex', gap: '6px', marginTop: '6px' }}>
                <button onClick={() => { onAnalyzePlace && onAnalyzePlace(); setSelectedPlace(null); }} style={{ flex: 1, padding: '4px 0', borderRadius: '6px', border: 'none', backgroundColor: styles.accent, color: '#fff', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}>
                  {lang === 'zh-TW' ? '透視評價' : 'Analyze'}
                </button>
                {onAddToWishlist && (
                  <button
                    onClick={() => { onAddToWishlist(selectedPlace); }}
                    title={isInWishlist && isInWishlist(selectedPlace.place_id) ? (lang === 'zh-TW' ? '已收藏' : 'Saved') : (lang === 'zh-TW' ? '加入口袋名單' : 'Save')}
                    style={{ padding: '4px 8px', borderRadius: '6px', border: `1px solid ${styles.border}`, backgroundColor: isInWishlist && isInWishlist(selectedPlace.place_id) ? styles.accent : 'transparent', color: isInWishlist && isInWishlist(selectedPlace.place_id) ? '#fff' : styles.text, fontSize: '14px', cursor: 'pointer', lineHeight: 1 }}
                  >
                    {isInWishlist && isInWishlist(selectedPlace.place_id) ? '★' : '☆'}
                  </button>
                )}
              </div>
              <button onClick={() => setSelectedPlace(null)} style={{ position: 'absolute', top: '6px', right: '6px', background: 'none', border: 'none', cursor: 'pointer', color: isLight ? '#888' : '#aaa', fontSize: '14px', lineHeight: 1 }}>✕</button>
            </div>
          )}
        </div>

        {!isPro && <AdBanner isLight={isLight} t={t} mode="bottom" />}

        {/* Floating search input */}
        <div style={{ position: 'absolute', bottom: isPro ? '20px' : '85px', left: '50%', transform: 'translateX(-50%)', zIndex: 10, width: '85%', maxWidth: '400px', display: 'flex', gap: '8px' }}>
          <input
            placeholder={t.mapPh}
            value={mapInputValue}
            onChange={(e) => setMapInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && mapInputValue.trim()) {
                e.preventDefault();
                setMapQuery(mapInputValue.trim());
                setSelectedPlace(null);
              }
            }}
            style={{ flex: 1, padding: '12px 20px', borderRadius: '30px', border: `1px solid ${styles.border}`, boxShadow: '0 4px 15px rgba(0,0,0,0.15)', backgroundColor: styles.panel, color: styles.text, fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
          />
          {isValidStoreName && onAddToWishlist && (
            <button
              onClick={() => onAddToWishlist(selectedPlace || { name: mapQuery, place_id: mapQuery })}
              title={isInWishlist && isInWishlist(selectedPlace?.place_id || mapQuery) ? (lang === 'zh-TW' ? '已收藏' : 'Saved') : (lang === 'zh-TW' ? '加入口袋名單' : 'Save')}
              style={{ width: '48px', height: '48px', borderRadius: '50%', border: `1px solid ${styles.border}`, backgroundColor: isInWishlist && isInWishlist(selectedPlace?.place_id || mapQuery) ? styles.accent : styles.panel, color: isInWishlist && isInWishlist(selectedPlace?.place_id || mapQuery) ? '#fff' : styles.text, fontSize: '20px', cursor: 'pointer', boxShadow: '0 4px 15px rgba(0,0,0,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
            >
              {isInWishlist && isInWishlist(selectedPlace?.place_id || mapQuery) ? '★' : '☆'}
            </button>
          )}
          {isValidStoreName && onAnalyzePlace && (
            <button
              onClick={() => { onAnalyzePlace(); setSelectedPlace(null); }}
              title={lang === 'zh-TW' ? '透視此地點' : 'Analyze'}
              style={{ padding: '12px 16px', borderRadius: '30px', border: 'none', backgroundColor: styles.accent, color: '#fff', fontWeight: 'bold', fontSize: '13px', cursor: 'pointer', whiteSpace: 'nowrap', boxShadow: '0 4px 15px rgba(0,0,0,0.15)' }}
            >
              {lang === 'zh-TW' ? '搜索' : 'Search'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MapPanel;
