import React from 'react';

const AdBanner = ({ isLight, t, mode }) => {
  const isSidebar = mode === 'sidebar';
  return (
    <div style={{
      width: '100%',
      height: isSidebar ? '100%' : '60px',
      padding: '15px',
      backgroundColor: isLight ? '#f9f9f9' : '#1a1a1a',
      borderTop: isSidebar ? 'none' : `1px dashed ${isLight ? '#ddd' : '#333'}`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: isLight ? '#aaa' : '#666',
      fontSize: '12px',
      textAlign: 'center',
      letterSpacing: '1px',
      boxSizing: 'border-box',
      writingMode: isSidebar ? 'vertical-rl' : 'horizontal-tb'
    }}>
      - {t.adText} -
    </div>
  );
};

export default AdBanner;
