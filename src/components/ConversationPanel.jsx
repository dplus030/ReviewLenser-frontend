import React, { useState } from 'react';

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

const DEFAULT_FOLDER = lang => lang === 'zh-TW' ? '未分類' : 'Uncategorized';

const ConversationPanel = ({
  styles, isLight, t, lang,
  isOpen, onClose,
  conversations, activeConvId,
  onLoad, onDelete, onNewChat,
  onMoveConvFolder,
  isTempMode, setIsTempMode,
  currentUser,
  showToast,
}) => {
  const [collapsedFolders, setCollapsedFolders] = useState({});
  const [showNewFolder, setShowNewFolder] = useState(false);
  const [newFolderInput, setNewFolderInput] = useState('');
  const [movingConvId, setMovingConvId] = useState(null);

  if (!isOpen) return null;

  const toggleFolder = (folder) => {
    setCollapsedFolders(prev => ({ ...prev, [folder]: !prev[folder] }));
  };

  const defFolder = DEFAULT_FOLDER(lang || 'zh-TW');

  // Group conversations by folder
  const folderMap = {};
  conversations.forEach(conv => {
    const f = conv.folder || defFolder;
    if (!folderMap[f]) folderMap[f] = [];
    folderMap[f].push(conv);
  });
  const folders = Object.keys(folderMap).sort((a, b) => {
    if (a === defFolder) return 1;
    if (b === defFolder) return -1;
    return a.localeCompare(b);
  });
  const allFolders = [...new Set([defFolder, ...folders])];

  return (
    <>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.4)', zIndex: 200 }} />

      <div className="fade-in-up" style={{ position: 'fixed', top: 0, left: 0, bottom: 0, width: 'min(380px, 100vw)', backgroundColor: styles.panel, borderRight: `1px solid ${styles.border}`, zIndex: 201, display: 'flex', flexDirection: 'column', boxShadow: '4px 0 20px rgba(0,0,0,0.2)' }}>
        {/* Header */}
        <div style={{ padding: '16px 16px 12px', borderBottom: `1px solid ${styles.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
          <span style={{ fontWeight: 700, fontSize: '15px', color: styles.text }}>{t.convHistory}</span>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <button onClick={() => setShowNewFolder(v => !v)} title={lang === 'zh-TW' ? '新增資料夾' : 'New Folder'} style={{ padding: '4px 10px', borderRadius: '8px', border: `1px solid ${styles.border}`, background: 'none', color: styles.text, fontSize: '12px', cursor: 'pointer', fontWeight: 600 }}>
              {lang === 'zh-TW' ? '+ 資料夾' : '+ Folder'}
            </button>
            <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: isLight ? '#888' : '#aaa', fontSize: '18px', lineHeight: 1 }}>×</button>
          </div>
        </div>

        {/* New folder input */}
        {showNewFolder && (
          <div style={{ padding: '8px 16px', borderBottom: `1px solid ${styles.border}`, display: 'flex', gap: '8px', flexShrink: 0 }}>
            <input autoFocus value={newFolderInput} onChange={e => setNewFolderInput(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' && newFolderInput.trim()) setShowNewFolder(false); if (e.key === 'Escape') { setShowNewFolder(false); setNewFolderInput(''); } }} placeholder={lang === 'zh-TW' ? '資料夾名稱...' : 'Folder name...'} style={{ flex: 1, padding: '6px 10px', borderRadius: '8px', border: `1px solid ${styles.border}`, backgroundColor: styles.bg, color: styles.text, fontSize: '13px', outline: 'none' }} />
            <button onClick={() => { if (newFolderInput.trim()) setShowNewFolder(false); }} style={{ padding: '6px 12px', borderRadius: '8px', border: 'none', backgroundColor: styles.accent, color: '#fff', fontSize: '12px', cursor: 'pointer', fontWeight: 700 }}>{lang === 'zh-TW' ? '建立' : 'Create'}</button>
          </div>
        )}

        {/* Mode toggle */}
        <div style={{ padding: '12px 16px', borderBottom: `1px solid ${styles.border}`, flexShrink: 0 }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            <div onClick={() => setIsTempMode(true)} style={{ flex: 1, padding: '8px', borderRadius: '10px', cursor: 'pointer', border: isTempMode ? `2px solid ${styles.accent}` : `1px solid ${styles.border}`, backgroundColor: isTempMode ? `${styles.accent}18` : 'transparent', textAlign: 'center' }}>
              <div style={{ fontSize: '12px', fontWeight: 700, color: isTempMode ? styles.accent : styles.text }}>{t.convTemp}</div>
              <div style={{ fontSize: '10px', color: isLight ? '#999' : '#666', marginTop: '2px' }}>{t.convTempDesc}</div>
            </div>
            <div onClick={() => { if (!currentUser) { showToast(t.convLoginRequired, 'warning'); return; } setIsTempMode(false); }} style={{ flex: 1, padding: '8px', borderRadius: '10px', cursor: 'pointer', border: !isTempMode ? `2px solid ${styles.accent}` : `1px solid ${styles.border}`, backgroundColor: !isTempMode ? `${styles.accent}18` : 'transparent', textAlign: 'center' }}>
              <div style={{ fontSize: '12px', fontWeight: 700, color: !isTempMode ? styles.accent : styles.text }}>{t.convPersist}</div>
              <div style={{ fontSize: '10px', color: isLight ? '#999' : '#666', marginTop: '2px' }}>{t.convPersistDesc}</div>
            </div>
          </div>
        </div>

        {/* New chat button */}
        <div style={{ padding: '10px 16px', flexShrink: 0 }}>
          <button onClick={() => { onNewChat(); onClose(); }} style={{ width: '100%', padding: '9px', borderRadius: '10px', backgroundColor: styles.accent, color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: '13px' }}>
            + {t.convNewChat}
          </button>
        </div>

        {/* Conversation list */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '0 8px 16px' }}>
          {conversations.length === 0 ? (
            <div style={{ textAlign: 'center', color: isLight ? '#aaa' : '#555', fontSize: '13px', marginTop: '40px', padding: '0 16px' }}>{t.convEmpty}</div>
          ) : (
            folders.map(folder => (
              <div key={folder}>
                {/* Folder header */}
                <div onClick={() => toggleFolder(folder)} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 4px', cursor: 'pointer', userSelect: 'none', marginBottom: '2px' }}>
                  <span style={{ fontSize: '12px', color: isLight ? '#999' : '#666', display: 'inline-block', transform: collapsedFolders[folder] ? 'rotate(-90deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>▼</span>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: isLight ? '#555' : '#aaa' }}>📁 {folder}</span>
                  <span style={{ fontSize: '11px', color: isLight ? '#aaa' : '#555', marginLeft: '2px' }}>({folderMap[folder].length})</span>
                </div>
                {!collapsedFolders[folder] && folderMap[folder].map(conv => (
                  <div key={conv.id}>
                    <div
                      onClick={() => { onLoad(conv); onClose(); }}
                      style={{ padding: '10px 12px', borderRadius: '10px', cursor: 'pointer', marginBottom: '2px', backgroundColor: conv.id === activeConvId ? `${styles.accent}20` : 'transparent', border: conv.id === activeConvId ? `1px solid ${styles.accent}50` : '1px solid transparent', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px', transition: 'background-color 0.15s' }}
                      onMouseEnter={e => { if (conv.id !== activeConvId) e.currentTarget.style.backgroundColor = isLight ? '#f0f0f0' : '#252525'; }}
                      onMouseLeave={e => { if (conv.id !== activeConvId) e.currentTarget.style.backgroundColor = 'transparent'; }}
                    >
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: '13px', fontWeight: 600, color: styles.text, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{conv.title || t.convUntitled}</div>
                        <div style={{ fontSize: '11px', color: isLight ? '#aaa' : '#666', marginTop: '3px' }}>{formatDate(conv.updatedAt)}</div>
                      </div>
                      <div style={{ display: 'flex', gap: '2px', flexShrink: 0 }}>
                        <button onClick={e => { e.stopPropagation(); setMovingConvId(movingConvId === conv.id ? null : conv.id); }} title={lang === 'zh-TW' ? '移至資料夾' : 'Move'} style={{ background: 'none', border: 'none', cursor: 'pointer', color: isLight ? '#ccc' : '#555', fontSize: '13px', padding: '0 3px', lineHeight: 1 }} onMouseEnter={e => e.currentTarget.style.color = styles.accent} onMouseLeave={e => e.currentTarget.style.color = isLight ? '#ccc' : '#555'}>📁</button>
                        <button onClick={e => { e.stopPropagation(); onDelete(conv.id); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: isLight ? '#ccc' : '#555', fontSize: '14px', padding: '0 2px', lineHeight: 1 }} onMouseEnter={e => e.currentTarget.style.color = '#ff4d4d'} onMouseLeave={e => e.currentTarget.style.color = isLight ? '#ccc' : '#555'}>×</button>
                      </div>
                    </div>
                    {/* Folder move picker */}
                    {movingConvId === conv.id && (
                      <div style={{ padding: '6px 12px 8px', display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                        {allFolders.map(f => (
                          <button key={f} onClick={() => { onMoveConvFolder && onMoveConvFolder(conv.id, f); setMovingConvId(null); }} style={{ padding: '3px 10px', borderRadius: '20px', border: `1px solid ${styles.border}`, backgroundColor: (conv.folder || defFolder) === f ? styles.accent : 'transparent', color: (conv.folder || defFolder) === f ? '#fff' : styles.text, fontSize: '11px', cursor: 'pointer', fontWeight: 600 }}>{f}</button>
                        ))}
                        {newFolderInput.trim() && !allFolders.includes(newFolderInput.trim()) && (
                          <button onClick={() => { onMoveConvFolder && onMoveConvFolder(conv.id, newFolderInput.trim()); setMovingConvId(null); setNewFolderInput(''); }} style={{ padding: '3px 10px', borderRadius: '20px', border: `1px solid ${styles.accent}`, backgroundColor: styles.accent, color: '#fff', fontSize: '11px', cursor: 'pointer', fontWeight: 600 }}>+ {newFolderInput.trim()}</button>
                        )}
                        <button onClick={() => setMovingConvId(null)} style={{ padding: '3px 8px', borderRadius: '20px', border: `1px solid ${styles.border}`, background: 'none', color: styles.text, fontSize: '11px', cursor: 'pointer' }}>✕</button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default ConversationPanel;
