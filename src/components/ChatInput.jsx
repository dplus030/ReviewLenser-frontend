import React from 'react';
import { Icons } from './Icons';

const ChatInput = ({ styles, isLight, isMobile, showMap, mode, userReq, setUserReq, question, setQuestion, loading, isListening, handleVoiceInput, handleSend, handleKeyDown, placeholder }) => (
  <div style={isMobile ? { flexShrink: 0, padding: '8px 0 4px' } : { position: 'absolute', bottom: '20px', left: 0, right: 0, padding: '0 20px', display: 'flex', justifyContent: 'center', zIndex: 10 }}>
    <div style={{ display: 'flex', gap: '8px', width: '100%', maxWidth: showMap ? '100%' : '1000px', backgroundColor: isLight ? 'rgba(255,255,255,0.92)' : 'rgba(34,34,34,0.92)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', padding: '6px 8px 6px 16px', borderRadius: '24px', boxShadow: '0 8px 30px rgba(0,0,0,0.15)', border: `1px solid ${styles.border}`, boxSizing: 'border-box' }}>
      <input
        placeholder={placeholder}
        value={mode === 'recommend' ? userReq : question}
        onChange={(e) => mode === 'recommend' ? setUserReq(e.target.value) : setQuestion(e.target.value)}
        style={{ flex: 1, minWidth: 0, backgroundColor: 'transparent', border: 'none', outline: 'none', color: styles.text, fontSize: '15px' }}
        onKeyDown={handleKeyDown}
        disabled={loading}
      />
      <button
        onClick={handleVoiceInput}
        disabled={loading}
        style={{ flexShrink: 0, width: '40px', height: '40px', padding: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: isListening ? '#FF3B30' : 'transparent', color: isListening ? '#fff' : (isLight ? '#888' : '#aaa'), border: 'none', borderRadius: '50%', cursor: 'pointer', opacity: loading ? 0.3 : 1 }}
      >
        <Icons.Mic />
      </button>
      <button
        onClick={() => handleSend()}
        disabled={loading}
        style={{ flexShrink: 0, width: '40px', height: '40px', padding: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: loading ? '#555' : styles.accent, color: 'white', border: 'none', borderRadius: '50%', cursor: loading ? 'not-allowed' : 'pointer', boxShadow: loading ? 'none' : `0 4px 10px ${styles.accent}60` }}
      >
        {loading ? <span style={{ fontSize: '12px', fontWeight: 'bold' }}>...</span> : <span style={{ display: 'flex', marginLeft: '-2px' }}><Icons.Send /></span>}
      </button>
    </div>
  </div>
);

export default ChatInput;
