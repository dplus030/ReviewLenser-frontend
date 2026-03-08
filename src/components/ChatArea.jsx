import React, { useState, useEffect } from 'react';
import MessageContent from './MessageContent';
import UserBubble from './UserBubble';
import { Icons } from './Icons';

const LOADING_PHRASES = {
  rec: ['正在觀測...', '正在探索...', '正在分析...', '正在比對...', '正在思考...'],
  eval: ['正在思考...', '正在分析...', '正在深挖評論...', '正在比對資料...', '即將完成...'],
  recEn: ['Observing...', 'Exploring...', 'Analyzing...', 'Comparing...', 'Thinking...'],
  evalEn: ['Thinking...', 'Analyzing...', 'Digging reviews...', 'Comparing data...', 'Almost done...'],
  recJa: ['観測中...', '探索中...', '分析中...', '比較中...', '考え中...'],
  evalJa: ['考え中...', '分析中...', 'レビューを掘り下げ中...', 'データを比較中...', 'もうすぐ完成...'],
};

const LoadingText = ({ mode, lang }) => {
  const key = lang === 'en' ? (mode === 'recommend' ? 'recEn' : 'evalEn') : (mode === 'recommend' ? 'rec' : 'eval');
  const phrases = LOADING_PHRASES[key];
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => setIdx(i => (i + 1) % phrases.length), 1800);
    return () => clearInterval(timer);
  }, [phrases.length]);
  return <span>{phrases[idx]}</span>;
};

const ChatArea = ({ messages, styles, isLight, showMap, loading, mode, t, lang, isMobile, speakingIndex, handleSpeak, handleRegenerate, setMapQuery, setMapInputValue, chatEndRef }) => (
  <div style={{ flex: 1, width: showMap ? '100%' : '1000px', maxWidth: '100%', boxSizing: 'border-box', alignSelf: showMap ? 'stretch' : 'center', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px', paddingLeft: '16px', paddingRight: '16px', paddingBottom: isMobile ? '8px' : '80px' }}>
    {messages.map((msg, index) => {
      const isLastAI = index === messages.length - 1 && msg.role === 'ai';
      return (
        <div key={index} className={msg.isNew ? 'animate-ai-reply' : ''} style={{ display: 'flex', width: '100%', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
          <div style={{ maxWidth: msg.role === 'ai' ? '80%' : '88%', padding: '12px 16px', borderRadius: '15px', backgroundColor: msg.role === 'user' ? styles.userBubble : styles.aiBubble, color: msg.role === 'user' ? '#fff' : styles.text, fontSize: 'inherit', lineHeight: '1.7', border: msg.role === 'ai' ? `1px solid ${styles.border}` : 'none', borderBottomRightRadius: msg.role === 'user' ? '4px' : '15px', borderBottomLeftRadius: msg.role === 'ai' ? '4px' : '15px' }}>
            {msg.role === 'ai' ? (
              <div>
                <MessageContent
                  content={msg.content}
                  onPlaceClick={(name) => { setMapQuery(name); setMapInputValue(name); }}
                  isLight={isLight}
                />
                <div style={{ display: 'flex', gap: '10px', marginTop: '10px', paddingTop: '10px', borderTop: `1px solid ${isLight ? '#ddd' : '#444'}` }}>
                  <button onClick={() => handleSpeak(msg.content, index)} title="語音朗讀" style={{ background: 'none', border: 'none', cursor: 'pointer', color: speakingIndex === index ? styles.accent : (isLight ? '#888' : '#aaa'), display: 'flex', alignItems: 'center', padding: '4px' }}>
                    <Icons.Speaker />
                  </button>
                  {isLastAI && (
                    <button onClick={handleRegenerate} title="重新生成" style={{ background: 'none', border: 'none', cursor: 'pointer', color: isLight ? '#888' : '#aaa', display: 'flex', alignItems: 'center', padding: '4px' }}>
                      <Icons.Refresh />
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <UserBubble msg={msg} />
            )}
          </div>
        </div>
      );
    })}
    {loading && (
      <div style={{ display: 'flex', width: '100%', justifyContent: 'flex-start' }}>
        <div style={{ padding: '12px 16px', borderRadius: '15px', backgroundColor: styles.aiBubble, border: `1px solid ${styles.border}`, borderBottomLeftRadius: '4px' }}>
          <span style={{ fontSize: '12px', fontWeight: 'bold', color: styles.accent }}><LoadingText mode={mode} lang={lang} /></span>
        </div>
      </div>
    )}
    <div ref={chatEndRef} />
  </div>
);

export default ChatArea;
