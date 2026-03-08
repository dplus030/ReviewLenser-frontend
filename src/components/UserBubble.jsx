import { useState } from 'react';

const UserBubble = ({ msg }) => {
  const [expanded, setExpanded] = useState(false);
  const hasSettings = msg.settings && msg.settings.length > 0;

  return (
    <div>
      {hasSettings ? (
        <button
          onClick={() => setExpanded(v => !v)}
          style={{ background: 'none', border: 'none', color: 'inherit', fontSize: 'inherit', cursor: 'pointer', padding: '0', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '5px', margin: 0, width: '100%' }}
        >
          <span>{msg.content}</span>
          <span style={{ fontSize: '14px', lineHeight: 1 }}>{expanded ? '▾' : '▸'}</span>
        </button>
      ) : (
        <p style={{ margin: 0 }}>{msg.content}</p>
      )}
      {hasSettings && expanded && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '6px' }}>
          {msg.settings.map((s, i) => (
            <span key={i} style={{ backgroundColor: 'rgba(255,255,255,0.2)', padding: '2px 8px', borderRadius: '12px', fontSize: '11px', whiteSpace: 'nowrap' }}>{s}</span>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserBubble;
