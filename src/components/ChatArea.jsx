import React from 'react';
import MessageContent from './MessageContent';
import UserBubble from './UserBubble';
import { Icons } from './Icons';

const ChatArea = ({ messages, styles, isLight, showMap, loading, mode, t, isMobile, isSpeaking, handleSpeak, handleRegenerate, setMapQuery, setMapInputValue, chatEndRef }) => (
  <div style={{ flex: 1, width: showMap ? '100%' : '800px', maxWidth: '100%', alignSelf: showMap ? 'stretch' : 'center', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px', paddingRight: '5px', paddingBottom: isMobile ? '8px' : '80px' }}>
    {messages.map((msg, index) => {
      const isLastAI = index === messages.length - 1 && msg.role === 'ai';
      return (
        <div key={index} className={msg.isNew ? 'animate-ai-reply' : ''} style={{ display: 'flex', width: showMap ? '100%' : '800px', maxWidth: '100%', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
          <div style={{ maxWidth: '88%', padding: '12px 16px', borderRadius: '15px', backgroundColor: msg.role === 'user' ? styles.userBubble : styles.aiBubble, color: msg.role === 'user' ? '#fff' : styles.text, fontSize: '14px', lineHeight: '1.6', border: msg.role === 'ai' ? `1px solid ${styles.border}` : 'none', borderBottomRightRadius: msg.role === 'user' ? '4px' : '15px', borderBottomLeftRadius: msg.role === 'ai' ? '4px' : '15px' }}>
            {msg.role === 'ai' ? (
              <div>
                <MessageContent
                  content={msg.content}
                  onPlaceClick={(name) => { setMapQuery(name); setMapInputValue(name); }}
                  isLight={isLight}
                />
                <div style={{ display: 'flex', gap: '10px', marginTop: '10px', paddingTop: '10px', borderTop: `1px solid ${isLight ? '#ddd' : '#444'}` }}>
                  <button onClick={() => handleSpeak(msg.content)} title="語音朗讀" style={{ background: 'none', border: 'none', cursor: 'pointer', color: isSpeaking ? styles.accent : (isLight ? '#888' : '#aaa'), display: 'flex', alignItems: 'center', padding: '4px' }}>
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
          <span style={{ fontSize: '12px', fontWeight: 'bold', color: styles.accent }}>{mode === 'recommend' ? t.loadingRec : t.loadingEval}</span>
        </div>
      </div>
    )}
    <div ref={chatEndRef} />
  </div>
);

export default ChatArea;
