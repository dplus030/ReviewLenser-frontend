export const getSaved = (key, defaultVal) => {
  try {
    const val = localStorage.getItem(key);
    return (val === null || val === 'undefined') ? defaultVal : val;
  } catch (e) { return defaultVal; }
};
