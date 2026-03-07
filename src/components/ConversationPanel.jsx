import React from 'react';

const formatDate = (ts) => {
  if (!ts) return '';
  const d = ts.toDate ? ts.toDate() : new Date(ts);
  const now = new Date();
  const diff = now - d;
  if (diff < 60000) return '剛剛';
  if (diff < 3600000) return `${Math.floor(diff / 60000)} 分鐘前`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)} 小時前`;
  return d.toLocaleDateString('zh-TW', { month: 'numeric', day: 'numeric' });
};

const ConversationPanel = ({
  styles, isLight, t,
  isOpen, onClose,
  conversations, activeConvId,
  onLoad, onDelete, onNewChat,
  isTempMode, setIsTempMode,
  currentUser,
  showToast,
}) => {
  if (!isOpen) return null;

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
          position: 'fixed', top: 0, left: 0, bottom: 0,
          width: '300px',
          backgroundColor: styles.panel,
          borderRight: `1px solid ${styles.border}`,
          zIndex: 201,
          display: 'flex', flexDirection: 'column',
          boxShadow: '4px 0 20px rgba(0,0,0,0.2)',
        }}
      >
        {/* Header */}
        <div style={{
          padding: '16px 16px 12px',
          borderBottom: `1px solid ${styles.border}`,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexShrink: 0,
        }}>
          <span style={{ fontWeight: 700, fontSize: '15px', color: styles.text }}>{t.convHistory}</span>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: isLight ? '#888' : '#aaa', fontSize: '18px', lineHeight: 1 }}>×</button>
        </div>

        {/* Mode toggle */}
        <div style={{ padding: '12px 16px', borderBottom: `1px solid ${styles.border}`, flexShrink: 0 }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            <div
              onClick={() => setIsTempMode(true)}
              style={{
                flex: 1, padding: '8px', borderRadius: '10px', cursor: 'pointer',
                border: isTempMode ? `2px solid ${styles.accent}` : `1px solid ${styles.border}`,
                backgroundColor: isTempMode ? `${styles.accent}18` : 'transparent',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: '12px', fontWeight: 700, color: isTempMode ? styles.accent : styles.text }}>{t.convTemp}</div>
              <div style={{ fontSize: '10px', color: isLight ? '#999' : '#666', marginTop: '2px' }}>{t.convTempDesc}</div>
            </div>
            <div
              onClick={() => {
                if (!currentUser) { showToast(t.convLoginRequired, 'warning'); return; }
                setIsTempMode(false);
              }}
              style={{
                flex: 1, padding: '8px', borderRadius: '10px', cursor: 'pointer',
                border: !isTempMode ? `2px solid ${styles.accent}` : `1px solid ${styles.border}`,
                backgroundColor: !isTempMode ? `${styles.accent}18` : 'transparent',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: '12px', fontWeight: 700, color: !isTempMode ? styles.accent : styles.text }}>{t.convPersist}</div>
              <div style={{ fontSize: '10px', color: isLight ? '#999' : '#666', marginTop: '2px' }}>{t.convPersistDesc}</div>
            </div>
          </div>
        </div>

        {/* New chat button */}
        <div style={{ padding: '10px 16px', flexShrink: 0 }}>
          <button
            onClick={() => { onNewChat(); onClose(); }}
            style={{
              width: '100%', padding: '9px', borderRadius: '10px',
              backgroundColor: styles.accent, color: '#fff',
              border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: '13px',
            }}
          >
            + {t.convNewChat}
          </button>
        </div>

        {/* Conversation list */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '0 8px 16px' }}>
          {conversations.length === 0 ? (
            <div style={{ textAlign: 'center', color: isLight ? '#aaa' : '#555', fontSize: '13px', marginTop: '40px', padding: '0 16px' }}>
              {t.convEmpty}
            </div>
          ) : (
            conversations.map((conv) => (
              <div
                key={conv.id}
                onClick={() => { onLoad(conv); onClose(); }}
                style={{
                  padding: '10px 12px', borderRadius: '10px', cursor: 'pointer',
                  marginBottom: '4px',
                  backgroundColor: conv.id === activeConvId ? `${styles.accent}20` : 'transparent',
                  border: conv.id === activeConvId ? `1px solid ${styles.accent}50` : '1px solid transparent',
                  display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px',
                  transition: 'background-color 0.15s',
                }}
                onMouseEnter={e => { if (conv.id !== activeConvId) e.currentTarget.style.backgroundColor = isLight ? '#f0f0f0' : '#252525'; }}
                onMouseLeave={e => { if (conv.id !== activeConvId) e.currentTarget.style.backgroundColor = 'transparent'; }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontSize: '13px', fontWeight: 600, color: styles.text,
                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                  }}>
                    {conv.title || t.convUntitled}
                  </div>
                  <div style={{ fontSize: '11px', color: isLight ? '#aaa' : '#666', marginTop: '3px' }}>
                    {formatDate(conv.updatedAt)}
                  </div>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); onDelete(conv.id); }}
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: isLight ? '#ccc' : '#555', fontSize: '14px', flexShrink: 0, padding: '0 2px',
                    lineHeight: 1,
                  }}
                  onMouseEnter={e => e.currentTarget.style.color = '#ff4d4d'}
                  onMouseLeave={e => e.currentTarget.style.color = isLight ? '#ccc' : '#555'}
                >
                  ×
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default ConversationPanel;
