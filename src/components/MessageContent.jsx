import React from 'react';

const MessageContent = ({ content, onPlaceClick, isLight }) => {
  const linkColor = isLight ? '#d97706' : '#007BFF';
  if (!content || typeof content !== 'string') return null;
  const seenPlaces = new Set();
  const ignoreWords = ['網頁', '論壇', '風向', 'Google', '數據', '評論', '洞察', 'PTT', 'Dcard', '結論', '分析', '情報'];

  const processBrackets = (textStr) => {
    if (!textStr || typeof textStr !== 'string') return textStr;
    const parts = textStr.split(/(【[^】]+】)/g);
    return parts.map((part, idx) => {
      if (!part) return null;
      if (part.startsWith('【') && part.endsWith('】')) {
        const pureName = part.slice(1, -1).replace(/\*\*/g, '').trim();
        const shouldIgnore = pureName.length > 25 || ignoreWords.some(word => pureName.includes(word));
        if (!seenPlaces.has(pureName) && pureName.length > 0 && !shouldIgnore) {
          seenPlaces.add(pureName);
          return <b key={`b-${idx}`} onClick={() => onPlaceClick(pureName)} style={{ color: linkColor, cursor: 'pointer', textDecoration: 'underline', margin: '0 2px' }}>【{pureName}】</b>;
        } else {
          return <b key={`b-norm-${idx}`} style={{ fontWeight: 'bold', color: 'inherit' }}>【{pureName}】</b>;
        }
      }
      return <React.Fragment key={`frag-${idx}`}>{part}</React.Fragment>;
    });
  };

  const renderLine = (line, lineIdx) => {
    const parts = [];
    let lastIndex = 0;
    const combinedRegex = /(\[([^\]]+)\]\((https?:\/\/[^\)]+)\))|(\*\*([^*]+)\*\*)/g;
    let match;
    while ((match = combinedRegex.exec(line)) !== null) {
      if (match.index > lastIndex) {
        const textBefore = line.slice(lastIndex, match.index);
        parts.push(<React.Fragment key={`txt-${lineIdx}-${lastIndex}`}>{processBrackets(textBefore)}</React.Fragment>);
      }
      if (match[1]) {
        parts.push(<a key={`link-${lineIdx}-${match.index}`} href={match[3]} target="_blank" rel="noopener noreferrer" style={{ color: linkColor, wordBreak: 'break-all' }}>{match[2]}</a>);
      } else if (match[4]) {
        parts.push(<b key={`bold-${lineIdx}-${match.index}`}>{processBrackets(match[5])}</b>);
      }
      lastIndex = match.index + match[0].length;
    }
    if (lastIndex < line.length) {
      parts.push(<React.Fragment key={`txt-end-${lineIdx}`}>{processBrackets(line.slice(lastIndex))}</React.Fragment>);
    }
    return parts;
  };

  const lines = content.split('\n');
  return (
    <div style={{ lineHeight: '1.7' }}>
      {lines.map((line, i) => {
        if (!line.trim()) return <br key={i} />;
        const trimmed = line.trim();
        if (trimmed.startsWith('### ')) return <h4 key={i} style={{ margin: '12px 0 4px', fontSize: '15px' }}>{renderLine(trimmed.slice(4), i)}</h4>;
        if (trimmed.startsWith('## ')) return <h3 key={i} style={{ margin: '14px 0 6px', fontSize: '16px' }}>{renderLine(trimmed.slice(3), i)}</h3>;
        if (trimmed.startsWith('# ')) return <h2 key={i} style={{ margin: '16px 0 8px', fontSize: '18px' }}>{renderLine(trimmed.slice(2), i)}</h2>;
        if (trimmed.startsWith('- ') || trimmed.startsWith('• ')) return <div key={i} style={{ display: 'flex', gap: '8px', margin: '3px 0' }}><span style={{ flexShrink: 0, marginTop: '2px' }}>•</span><span>{renderLine(trimmed.slice(2), i)}</span></div>;
        const numMatch = trimmed.match(/^(\d+)\.\s(.+)/);
        if (numMatch) return <div key={i} style={{ display: 'flex', gap: '8px', margin: '3px 0' }}><span style={{ flexShrink: 0, minWidth: '18px', fontWeight: 'bold' }}>{numMatch[1]}.</span><span>{renderLine(numMatch[2], i)}</span></div>;
        return <p key={i} style={{ margin: '4px 0' }}>{renderLine(line, i)}</p>;
      })}
    </div>
  );
};

export default MessageContent;
