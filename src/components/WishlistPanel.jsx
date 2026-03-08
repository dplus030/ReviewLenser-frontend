import React, { useState } from 'react';

const DEFAULT_FOLDER = lang => lang === 'zh-TW' ? '未分類' : 'Uncategorized';

const TW_CITIES = ['台北市','新北市','基隆市','桃園市','新竹市','新竹縣','苗栗縣','台中市','彰化縣','南投縣','雲林縣','嘉義市','嘉義縣','台南市','高雄市','屏東縣','宜蘭縣','花蓮縣','台東縣','澎湖縣','金門縣','連江縣'];

const extractRegion = (address) => {
  if (!address) return null;
  for (const city of TW_CITIES) {
    if (address.includes(city)) return city;
  }
  // fallback: try short form like 台中, 台南, etc.
  const shortCities = ['台北','新北','基隆','桃園','新竹','苗栗','台中','彰化','南投','雲林','嘉義','台南','高雄','屏東','宜蘭','花蓮','台東','澎湖','金門','連江'];
  for (const city of shortCities) {
    if (address.includes(city)) return city;
  }
  return null;
};

const WishlistPanel = ({
  styles, isLight, t, lang,
  isOpen, onClose,
  isPro, onUpgrade,
  wishlist, onRemove, onAnalyze, onUpdateNote, onMoveFolder,
}) => {
  const [editingId, setEditingId] = useState(null);
  const [noteInput, setNoteInput] = useState('');
  const [collapsedFolders, setCollapsedFolders] = useState({});
  const [newFolderInput, setNewFolderInput] = useState('');
  const [showNewFolder, setShowNewFolder] = useState(false);
  const [movingId, setMovingId] = useState(null);
  const [regionFilter, setRegionFilter] = useState('all');
  const [viewMode, setViewMode] = useState('folder'); // 'folder' | 'region'

  if (!isOpen) return null;

  const handleNoteEdit = (item) => {
    setEditingId(item.id);
    setNoteInput(item.note || '');
  };

  const handleNoteSave = (id) => {
    onUpdateNote(id, noteInput);
    setEditingId(null);
  };

  const toggleFolder = (folder) => {
    setCollapsedFolders(prev => ({ ...prev, [folder]: !prev[folder] }));
  };

  // Collect all regions from wishlist items
  const allRegions = [...new Set(wishlist.map(item => extractRegion(item.address)).filter(Boolean))];

  // Filter by region
  const filteredWishlist = regionFilter === 'all' ? wishlist : wishlist.filter(item => extractRegion(item.address) === regionFilter);

  // Group items by folder or region depending on viewMode
  const defFolder = DEFAULT_FOLDER(lang);

  const folderMap = {};
  filteredWishlist.forEach(item => {
    const key = viewMode === 'region'
      ? (extractRegion(item.address) || (lang === 'zh-TW' ? '其他地區' : 'Other'))
      : (item.folder || defFolder);
    if (!folderMap[key]) folderMap[key] = [];
    folderMap[key].push(item);
  });

  const folders = Object.keys(folderMap).sort((a, b) => {
    if (a === defFolder || a === (lang === 'zh-TW' ? '其他地區' : 'Other')) return 1;
    if (b === defFolder || b === (lang === 'zh-TW' ? '其他地區' : 'Other')) return -1;
    return a.localeCompare(b);
  });

  // Collect all folder names for move dropdown (always use folder names regardless of viewMode)
  const allFolderNames = [...new Set([defFolder, ...wishlist.map(item => item.folder || defFolder)])];

  const renderItem = (item) => {
    const region = extractRegion(item.address);
    return (
      <div
        key={item.id}
        style={{ padding: '12px', borderRadius: '12px', marginBottom: '8px', backgroundColor: isLight ? '#f8f8f8' : '#252525', border: `1px solid ${styles.border}` }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '14px', fontWeight: 700, color: styles.text, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.name}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '3px', flexWrap: 'wrap' }}>
              {item.rating && <span style={{ fontSize: '12px', color: styles.accent }}>{'★'.repeat(Math.round(item.rating))} {item.rating}</span>}
              {region && (
                <span style={{ fontSize: '10px', padding: '1px 7px', borderRadius: '20px', backgroundColor: `${styles.accent}20`, color: styles.accent, fontWeight: 600, border: `1px solid ${styles.accent}40` }}>
                  {region}
                </span>
              )}
              {item.folder && item.folder !== defFolder && (
                <span style={{ fontSize: '10px', padding: '1px 7px', borderRadius: '20px', backgroundColor: isLight ? '#f0f0f0' : '#333', color: isLight ? '#666' : '#aaa', border: `1px solid ${styles.border}` }}>
                  📁 {item.folder}
                </span>
              )}
            </div>
            {item.address && <div style={{ fontSize: '11px', color: isLight ? '#999' : '#666', marginTop: '3px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.address}</div>}
          </div>
          <button onClick={() => onRemove(item.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: isLight ? '#ccc' : '#555', fontSize: '16px', flexShrink: 0, lineHeight: 1, padding: '0 2px' }} onMouseEnter={e => e.currentTarget.style.color = '#ff4d4d'} onMouseLeave={e => e.currentTarget.style.color = isLight ? '#ccc' : '#555'} title={t.wishlistRemove}>×</button>
        </div>

        {/* Note */}
        {editingId === item.id ? (
          <div style={{ marginTop: '8px', display: 'flex', gap: '6px' }}>
            <input autoFocus value={noteInput} onChange={e => setNoteInput(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') handleNoteSave(item.id); if (e.key === 'Escape') setEditingId(null); }} placeholder={t.wishlistNote} style={{ flex: 1, padding: '5px 8px', borderRadius: '7px', border: `1px solid ${styles.border}`, backgroundColor: styles.bg, color: styles.text, fontSize: '12px', outline: 'none' }} />
            <button onClick={() => handleNoteSave(item.id)} style={{ padding: '5px 10px', borderRadius: '7px', border: 'none', backgroundColor: styles.accent, color: '#fff', fontSize: '11px', cursor: 'pointer', fontWeight: 700 }}>{t.profileSave}</button>
          </div>
        ) : (
          <div onClick={() => handleNoteEdit(item)} style={{ marginTop: '6px', fontSize: '11px', color: item.note ? (isLight ? '#666' : '#aaa') : (isLight ? '#bbb' : '#444'), cursor: 'pointer', fontStyle: item.note ? 'normal' : 'italic' }}>{item.note || t.wishlistNote}</div>
        )}

        {/* Move to folder */}
        {movingId === item.id ? (
          <div style={{ marginTop: '8px' }}>
            <div style={{ fontSize: '11px', color: isLight ? '#888' : '#666', marginBottom: '5px', fontWeight: 600 }}>
              {lang === 'zh-TW' ? '指派到資料夾：' : 'Assign to folder:'}
            </div>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {allFolderNames.map(f => (
                <button key={f} onClick={() => { onMoveFolder && onMoveFolder(item.id, f); setMovingId(null); }} style={{ padding: '3px 10px', borderRadius: '20px', border: `1px solid ${styles.border}`, backgroundColor: (item.folder || defFolder) === f ? styles.accent : 'transparent', color: (item.folder || defFolder) === f ? '#fff' : styles.text, fontSize: '11px', cursor: 'pointer', fontWeight: 600 }}>{f}</button>
              ))}
              {newFolderInput.trim() && !allFolderNames.includes(newFolderInput.trim()) && (
                <button onClick={() => { onMoveFolder && onMoveFolder(item.id, newFolderInput.trim()); setMovingId(null); setNewFolderInput(''); }} style={{ padding: '3px 10px', borderRadius: '20px', border: `1px solid ${styles.accent}`, backgroundColor: styles.accent, color: '#fff', fontSize: '11px', cursor: 'pointer', fontWeight: 600 }}>+ {newFolderInput.trim()}</button>
              )}
              <button onClick={() => setMovingId(null)} style={{ padding: '3px 8px', borderRadius: '20px', border: `1px solid ${styles.border}`, background: 'none', color: styles.text, fontSize: '11px', cursor: 'pointer' }}>✕</button>
            </div>
          </div>
        ) : null}

        {/* Actions */}
        <div style={{ display: 'flex', gap: '6px', marginTop: '10px' }}>
          <button onClick={() => { onAnalyze(item.name); onClose(); }} style={{ flex: 1, padding: '6px 0', borderRadius: '8px', border: 'none', backgroundColor: styles.accent, color: '#fff', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}>
            {lang === 'zh-TW' ? '透視評價' : t.wishlistAnalyze}
          </button>
          <button onClick={() => setMovingId(movingId === item.id ? null : item.id)} title={lang === 'zh-TW' ? '指派資料夾' : 'Assign folder'} style={{ padding: '6px 10px', borderRadius: '8px', border: `1px solid ${styles.border}`, background: movingId === item.id ? `${styles.accent}20` : 'none', color: styles.text, fontSize: '12px', cursor: 'pointer' }}>
            📁
          </button>
        </div>
      </div>
    );
  };

  return (
    <>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.4)', zIndex: 200 }} />
      <div className="fade-in-up" style={{ position: 'fixed', top: 0, right: 0, bottom: 0, width: 'min(400px, 100vw)', backgroundColor: styles.panel, borderLeft: `1px solid ${styles.border}`, zIndex: 201, display: 'flex', flexDirection: 'column', boxShadow: '-4px 0 20px rgba(0,0,0,0.2)' }}>
        {/* Header */}
        <div style={{ padding: '16px 16px 12px', borderBottom: `1px solid ${styles.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '18px' }}>★</span>
            <span style={{ fontWeight: 700, fontSize: '15px', color: styles.text }}>{t.wishlistTitle}</span>
            {wishlist.length > 0 && <span style={{ backgroundColor: styles.accent, color: '#fff', borderRadius: '12px', padding: '1px 7px', fontSize: '11px', fontWeight: 700 }}>{wishlist.length}</span>}
          </div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <button onClick={() => setShowNewFolder(v => !v)} title={lang === 'zh-TW' ? '新增資料夾' : 'New Folder'} style={{ padding: '4px 10px', borderRadius: '8px', border: `1px solid ${styles.border}`, background: 'none', color: styles.text, fontSize: '12px', cursor: 'pointer', fontWeight: 600 }}>
              {lang === 'zh-TW' ? '+ 資料夾' : '+ Folder'}
            </button>
            <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: isLight ? '#888' : '#aaa', fontSize: '18px', lineHeight: 1 }}>×</button>
          </div>
        </div>

        {/* Pro lock screen */}
        {!isPro ? (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 24px', textAlign: 'center' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔒</div>
            <div style={{ fontSize: '16px', fontWeight: 700, color: styles.text, marginBottom: '10px' }}>
              {lang === 'zh-TW' ? '口袋名單為 Pro 專屬功能' : 'Pocket List is a Pro Feature'}
            </div>
            <div style={{ fontSize: '13px', color: isLight ? '#888' : '#666', lineHeight: 1.7, marginBottom: '24px' }}>
              {lang === 'zh-TW'
                ? '升級 Pro 後即可儲存愛店、建立資料夾，並依地區分類管理你的口袋名單。'
                : 'Upgrade to Pro to save your favorite places, organize them in folders, and filter by region.'}
            </div>
            <button onClick={onUpgrade} style={{ padding: '12px 32px', borderRadius: '30px', border: 'none', backgroundColor: styles.accent, color: '#fff', fontWeight: 700, fontSize: '14px', cursor: 'pointer', boxShadow: `0 6px 20px ${styles.accent}50` }}>
              {lang === 'zh-TW' ? '升級 Pro 方案' : 'Upgrade to Pro'}
            </button>
          </div>
        ) : (
          <>
            {/* New folder input */}
            {showNewFolder && (
              <div style={{ padding: '8px 16px', borderBottom: `1px solid ${styles.border}`, display: 'flex', gap: '8px', flexShrink: 0 }}>
                <input
                  autoFocus
                  value={newFolderInput}
                  onChange={e => setNewFolderInput(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter' && newFolderInput.trim()) { setShowNewFolder(false); } if (e.key === 'Escape') { setShowNewFolder(false); setNewFolderInput(''); } }}
                  placeholder={lang === 'zh-TW' ? '資料夾名稱...' : 'Folder name...'}
                  style={{ flex: 1, padding: '6px 10px', borderRadius: '8px', border: `1px solid ${styles.border}`, backgroundColor: styles.bg, color: styles.text, fontSize: '13px', outline: 'none' }}
                />
                <button onClick={() => { if (newFolderInput.trim()) setShowNewFolder(false); }} style={{ padding: '6px 12px', borderRadius: '8px', border: 'none', backgroundColor: styles.accent, color: '#fff', fontSize: '12px', cursor: 'pointer', fontWeight: 700 }}>{lang === 'zh-TW' ? '建立' : 'Create'}</button>
              </div>
            )}

            {/* View mode & region filter toolbar */}
            {wishlist.length > 0 && (
              <div style={{ padding: '8px 12px', borderBottom: `1px solid ${styles.border}`, display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center', flexShrink: 0 }}>
                {/* View mode toggle */}
                <button onClick={() => setViewMode('folder')} style={{ padding: '3px 10px', borderRadius: '20px', border: `1px solid ${styles.border}`, backgroundColor: viewMode === 'folder' ? styles.accent : 'transparent', color: viewMode === 'folder' ? '#fff' : styles.text, fontSize: '11px', cursor: 'pointer', fontWeight: 600 }}>
                  📁 {lang === 'zh-TW' ? '資料夾' : 'Folder'}
                </button>
                <button onClick={() => setViewMode('region')} style={{ padding: '3px 10px', borderRadius: '20px', border: `1px solid ${styles.border}`, backgroundColor: viewMode === 'region' ? styles.accent : 'transparent', color: viewMode === 'region' ? '#fff' : styles.text, fontSize: '11px', cursor: 'pointer', fontWeight: 600 }}>
                  📍 {lang === 'zh-TW' ? '地區' : 'Region'}
                </button>
                {/* Region filter chips (only in folder view) */}
                {viewMode === 'folder' && allRegions.length > 0 && (
                  <>
                    <div style={{ width: '1px', height: '18px', backgroundColor: styles.border, flexShrink: 0 }} />
                    <button onClick={() => setRegionFilter('all')} style={{ padding: '3px 10px', borderRadius: '20px', border: `1px solid ${styles.border}`, backgroundColor: regionFilter === 'all' ? `${styles.accent}30` : 'transparent', color: regionFilter === 'all' ? styles.accent : (isLight ? '#888' : '#666'), fontSize: '11px', cursor: 'pointer', fontWeight: regionFilter === 'all' ? 700 : 400 }}>
                      {lang === 'zh-TW' ? '全部' : 'All'}
                    </button>
                    {allRegions.map(r => (
                      <button key={r} onClick={() => setRegionFilter(regionFilter === r ? 'all' : r)} style={{ padding: '3px 10px', borderRadius: '20px', border: `1px solid ${styles.border}`, backgroundColor: regionFilter === r ? `${styles.accent}30` : 'transparent', color: regionFilter === r ? styles.accent : (isLight ? '#888' : '#666'), fontSize: '11px', cursor: 'pointer', fontWeight: regionFilter === r ? 700 : 400 }}>
                        {r}
                      </button>
                    ))}
                  </>
                )}
              </div>
            )}

            {/* List */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '8px 8px 16px' }}>
              {wishlist.length === 0 ? (
                <div style={{ textAlign: 'center', color: isLight ? '#aaa' : '#555', fontSize: '13px', marginTop: '60px', padding: '0 20px', lineHeight: 1.8 }}>
                  <div style={{ fontSize: '36px', marginBottom: '12px' }}>★</div>
                  <div>{t.wishlistEmpty}</div>
                  <div style={{ fontSize: '11px', marginTop: '8px', color: isLight ? '#bbb' : '#444' }}>
                    {lang === 'zh-TW' ? '在地圖上搜尋店家後，點擊 ☆ 加入口袋名單' : 'Search a place on the map and tap ☆ to save'}
                  </div>
                </div>
              ) : filteredWishlist.length === 0 ? (
                <div style={{ textAlign: 'center', color: isLight ? '#aaa' : '#555', fontSize: '13px', marginTop: '40px', padding: '0 20px' }}>
                  {lang === 'zh-TW' ? `「${regionFilter}」尚無收藏` : `No places saved in "${regionFilter}"`}
                </div>
              ) : (
                folders.map(folder => (
                  <div key={folder}>
                    <div
                      onClick={() => toggleFolder(folder)}
                      style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 4px', cursor: 'pointer', userSelect: 'none', marginBottom: '4px' }}
                    >
                      <span style={{ fontSize: '12px', color: isLight ? '#999' : '#666', transition: 'transform 0.2s', display: 'inline-block', transform: collapsedFolders[folder] ? 'rotate(-90deg)' : 'rotate(0deg)' }}>▼</span>
                      <span style={{ fontSize: '13px', fontWeight: 700, color: isLight ? '#555' : '#aaa' }}>
                        {viewMode === 'region' ? '📍' : '📁'} {folder}
                      </span>
                      <span style={{ fontSize: '11px', color: isLight ? '#aaa' : '#555', marginLeft: '2px' }}>({folderMap[folder].length})</span>
                    </div>
                    {!collapsedFolders[folder] && folderMap[folder].map(item => renderItem(item))}
                  </div>
                ))
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default WishlistPanel;
