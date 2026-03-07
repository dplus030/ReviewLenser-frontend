import { useState } from 'react';

const UserBubble = ({ msg }) => {
  const [expanded, setExpanded] = useState(false);
  const hasSettings = msg.settings && msg.settings.length > 0;

  return (
    <div>
      <p style={{ margin: 0 }}>{msg.content}</p>
      {hasSettings && (
        <>
          <button
            onClick={() => setExpanded(v => !v)}
            style={{
              marginTop: '6px',
              background: 'none',
              border: 'none',
              color: 'rgba(255,255,255,0.7)',
              fontSize: '11px',
              cursor: 'pointer',
              padding: '0',
              display: 'flex',
              alignItems: 'center',
              gap: '3px',
            }}
          >
            <span style={{ fontSize: '9px' }}>{expanded ? '▾' : '▸'}</span>
            {msg.settings.length} 個設定
          </button>
          {expanded && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '6px' }}>
              {msg.settings.map((s, i) => (
                <span key={i} style={{ backgroundColor: 'rgba(255,255,255,0.2)', padding: '2px 8px', borderRadius: '12px', fontSize: '11px', whiteSpace: 'nowrap' }}>{s}</span>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default UserBubble;
