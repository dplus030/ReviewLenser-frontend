import React, { useState } from 'react';

const WishlistPanel = ({
  styles, isLight, t, lang,
  isOpen, onClose,
  wishlist, onRemove, onAnalyze, onUpdateNote,
}) => {
  const [editingId, setEditingId] = useState(null);
  const [noteInput, setNoteInput] = useState('');

  if (!isOpen) return null;

  const handleNoteEdit = (item) => {
    setEditingId(item.id);
    setNoteInput(item.note || '');
  };

  const handleNoteSave = (id) => {
    onUpdateNote(id, noteInput);
    setEditingId(null);
  };

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0,
          backgroundColor: 'rgba(0,0,0,0.4)',
          zIndex: 200,
        }}
      />

      {/* Drawer */}
      <div
        className="fade-in-up"
        style={{
          position: 'fixed', top: 0, right: 0, bottom: 0,
          width: '320px',
          backgroundColor: styles.panel,
          borderLeft: `1px solid ${styles.border}`,
          zIndex: 201,
          display: 'flex', flexDirection: 'column',
          boxShadow: '-4px 0 20px rgba(0,0,0,0.2)',
        }}
      >
        {/* Header */}
        <div style={{
          padding: '16px 16px 12px',
          borderBottom: `1px solid ${styles.border}`,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexShrink: 0,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '18px' }}>★</span>
            <span style={{ fontWeight: 700, fontSize: '15px', color: styles.text }}>{t.wishlistTitle}</span>
            {wishlist.length > 0 && (
              <span style={{ backgroundColor: styles.accent, color: '#fff', borderRadius: '12px', padding: '1px 7px', fontSize: '11px', fontWeight: 700 }}>
                {wishlist.length}
              </span>
            )}
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: isLight ? '#888' : '#aaa', fontSize: '18px', lineHeight: 1 }}>×</button>
        </div>

        {/* List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '8px 8px 16px' }}>
          {wishlist.length === 0 ? (
            <div style={{ textAlign: 'center', color: isLight ? '#aaa' : '#555', fontSize: '13px', marginTop: '60px', padding: '0 20px', lineHeight: 1.8 }}>
              <div style={{ fontSize: '36px', marginBottom: '12px' }}>★</div>
              <div>{t.wishlistEmpty}</div>
              <div style={{ fontSize: '11px', marginTop: '8px', color: isLight ? '#bbb' : '#444' }}>
                {lang === 'zh-TW' ? '在地圖上選擇地點後，點擊「加入口袋名單」' : 'Select a place on the map and tap "Save to Pocket List"'}
              </div>
            </div>
          ) : (
            wishlist.map((item) => (
              <div
                key={item.id}
                style={{
                  padding: '12px', borderRadius: '12px',
                  marginBottom: '8px',
                  backgroundColor: isLight ? '#f8f8f8' : '#252525',
                  border: `1px solid ${styles.border}`,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: styles.text, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {item.name}
                    </div>
                    {item.rating && (
                      <div style={{ fontSize: '12px', color: styles.accent, marginTop: '2px' }}>
                        {'★'.repeat(Math.round(item.rating))} {item.rating}
                      </div>
                    )}
                    {item.address && (
                      <div style={{ fontSize: '11px', color: isLight ? '#999' : '#666', marginTop: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {item.address}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => onRemove(item.id)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: isLight ? '#ccc' : '#555', fontSize: '16px', flexShrink: 0, lineHeight: 1, padding: '0 2px' }}
                    onMouseEnter={e => e.currentTarget.style.color = '#ff4d4d'}
                    onMouseLeave={e => e.currentTarget.style.color = isLight ? '#ccc' : '#555'}
                    title={t.wishlistRemove}
                  >
                    ×
                  </button>
                </div>

                {/* Note */}
                {editingId === item.id ? (
                  <div style={{ marginTop: '8px', display: 'flex', gap: '6px' }}>
                    <input
                      autoFocus
                      value={noteInput}
                      onChange={e => setNoteInput(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter') handleNoteSave(item.id); if (e.key === 'Escape') setEditingId(null); }}
                      placeholder={t.wishlistNote}
                      style={{ flex: 1, padding: '5px 8px', borderRadius: '7px', border: `1px solid ${styles.border}`, backgroundColor: styles.bg, color: styles.text, fontSize: '12px', outline: 'none' }}
                    />
                    <button onClick={() => handleNoteSave(item.id)} style={{ padding: '5px 10px', borderRadius: '7px', border: 'none', backgroundColor: styles.accent, color: '#fff', fontSize: '11px', cursor: 'pointer', fontWeight: 700 }}>
                      {t.profileSave}
                    </button>
                  </div>
                ) : (
                  <div
                    onClick={() => handleNoteEdit(item)}
                    style={{ marginTop: '6px', fontSize: '11px', color: item.note ? (isLight ? '#666' : '#aaa') : (isLight ? '#bbb' : '#444'), cursor: 'pointer', fontStyle: item.note ? 'normal' : 'italic' }}
                  >
                    {item.note || t.wishlistNote}
                  </div>
                )}

                {/* Actions */}
                <div style={{ display: 'flex', gap: '6px', marginTop: '10px' }}>
                  <button
                    onClick={() => { onAnalyze(item.name); onClose(); }}
                    style={{ flex: 1, padding: '6px 0', borderRadius: '8px', border: 'none', backgroundColor: styles.accent, color: '#fff', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}
                  >
                    {lang === 'zh-TW' ? '透視評價' : t.wishlistAnalyze}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default WishlistPanel;
