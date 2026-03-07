import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  signInWithPopup, signOut, onAuthStateChanged,
  createUserWithEmailAndPassword, signInWithEmailAndPassword
} from "firebase/auth";
import { auth, googleProvider, db } from './firebase';
import {
  collection, addDoc, updateDoc, deleteDoc, getDocs,
  doc, serverTimestamp, query, orderBy,
} from 'firebase/firestore';
import { translations } from './constants/translations';
import { GLOBAL_STYLES } from './constants/globalStyles';
import { getSaved } from './utils/storage';

import Toast from './components/Toast';
import AdBanner from './components/AdBanner';
import AppHeader from './components/AppHeader';
import MapPanel from './components/MapPanel';
import ControlBar from './components/ControlBar';
import ChatArea from './components/ChatArea';
import ChatInput from './components/ChatInput';
import AuthModal from './components/AuthModal';
import PayModal from './components/PayModal';
import SettingsModal from './components/SettingsModal';
import { Icons } from './components/Icons';
import LandingPage from './pages/LandingPage';
import ConversationPanel from './components/ConversationPanel';
import WishlistPanel from './components/WishlistPanel';

const API_BASE = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

function App() {
  const savedLang = getSaved('lang', 'zh-TW');
  const [lang, setLang] = useState(() => translations[savedLang] ? savedLang : 'zh-TW');
  const t = translations[lang] || translations['zh-TW'];

  const [view, setView] = useState(() => {
    const saved = localStorage.getItem('lastView');
    // 只有已登入的情況才能直接回到 chat（auth 狀態在 useEffect 確認）
    return saved === 'chat' ? 'chat' : 'landing';
  });
  const [showAuth, setShowAuth] = useState(false);
  const [showPay, setShowPay] = useState(false);
  const [billingCycle, setBillingCycle] = useState('yearly');

  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [isSignUpMode, setIsSignUpMode] = useState(false);

  const [isPro, setIsPro] = useState(false);
  const isProRef = useRef(false);
  const [isTrial, setIsTrial] = useState(false);
  const [usageCount, setUsageCount] = useState(0);
  const maxFreeUses = 10;

  const [theme, setTheme] = useState(() => getSaved('theme', 'dark'));
  const [fontSize, setFontSize] = useState(() => getSaved('fontSize', 'medium'));
  const [mapPosition, setMapPosition] = useState(() => getSaved('mapPosition', 'left'));
  const [userProfile, setUserProfile] = useState(() => getSaved('userProfile', ''));
  const isLight = theme === 'light';

  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth < 768 : false);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const savedCat = getSaved('defaultCategory', '找餐廳');
  const [defaultCategory] = useState(() => (savedCat === '無' || savedCat === 'None' || savedCat === '餐廳') ? '找餐廳' : savedCat);
  const [defaultTone] = useState(() => getSaved('defaultTone', '毒舌評論家'));

  const [mode, setMode] = useState('recommend');
  const [category, setCategory] = useState(defaultCategory);
  const [toneMode, setToneMode] = useState(defaultTone);
  const [customTone, setCustomTone] = useState('');
  const [distanceKm, setDistanceKm] = useState(() => {
    const saved = parseFloat(getSaved('distanceKm', '1'));
    return isNaN(saved) ? 1 : saved;
  });

  const [customCategory, setCustomCategory] = useState('');
  const [userReq, setUserReq] = useState('');
  const [question, setQuestion] = useState('');

  const [useCurrentLoc, setUseCurrentLoc] = useState(() => getSaved('useCurrentLoc', 'true') === 'true');
  const [customLoc, setCustomLoc] = useState(() => getSaved('customLoc', ''));
  const recommendCount = 3;

  const [location, setLocation] = useState(() => {
    try { const c = localStorage.getItem('lastGPS'); return c ? JSON.parse(c) : { lat: null, lng: null }; } catch { return { lat: null, lng: null }; }
  });
  const [messages, setMessages] = useState([]);
  const [mapPlaces, setMapPlaces] = useState([]);
  const [loading, setLoading] = useState(false);

  const [mapQuery, setMapQuery] = useState(() => {
    if (getSaved('useCurrentLoc', 'true') === 'true') {
      try { const c = localStorage.getItem('lastGPS'); if (c) { const { lat, lng } = JSON.parse(c); return `${lat},${lng}`; } } catch {}
    }
    return '台灣';
  });
  const [mapInputValue, setMapInputValue] = useState('');
  const [pendingAnalyze, setPendingAnalyze] = useState(false);

  const [showMap, setShowMap] = useState(() => getSaved('showMap', 'true') === 'true');
  const [showRoute, setShowRoute] = useState(() => getSaved('showRoute', 'true') === 'true');
  const [mobileTab, setMobileTab] = useState('chat'); // 'chat' | 'map'

  // Conversation history
  const [isTempMode, setIsTempMode] = useState(true);
  const [activeConvId, setActiveConvId] = useState(null);
  const activeConvIdRef = useRef(null);
  useEffect(() => { activeConvIdRef.current = activeConvId; }, [activeConvId]);

  // Ref to always read the latest mapQuery inside stale closures (e.g. watchPosition)
  const mapQueryRef = useRef(mapQuery);
  useEffect(() => { mapQueryRef.current = mapQuery; }, [mapQuery]);
  const [conversations, setConversations] = useState([]);
  const [showConvPanel, setShowConvPanel] = useState(false);
  const [showWishlist, setShowWishlist] = useState(false);
  const [wishlist, setWishlist] = useState(() => {
    try { return JSON.parse(localStorage.getItem('wishlist') || '[]'); } catch { return []; }
  });

  const [leftWidth, setLeftWidth] = useState(550);
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef({ startX: 0, startWidth: 0 });
  const chatEndRef = useRef(null);

  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const recognitionRef = useRef(null);
  const voiceTimeoutRef = useRef(null);

  const [toast, setToast] = useState(null);
  const toastTimerRef = useRef(null);
  const showToast = useCallback((msg, type = 'error') => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToast({ msg, type, exiting: false });
    toastTimerRef.current = setTimeout(() => {
      setToast(prev => prev ? { ...prev, exiting: true } : null);
      setTimeout(() => setToast(null), 300);
    }, 3200);
  }, []);

  const styles = {
    bg: isLight ? '#f5f7fa' : '#0f0f11',
    panel: isLight ? '#ffffff' : '#1a1a1a',
    text: isLight ? '#333333' : '#f0f0f0',
    border: isLight ? '#e0e0e0' : '#333',
    aiBubble: isLight ? '#f0f2f5' : '#252525',
    userBubble: isLight ? '#f59e0b' : '#007BFF',
    accent: isLight ? '#f59e0b' : '#007BFF'
  };

  const fetchUserProfile = useCallback(async (firebaseUser) => {
    if (!firebaseUser) {
      isProRef.current = false;
      setIsPro(false);
      setUsageCount(0);
      return;
    }
    try {
      const token = await firebaseUser.getIdToken(true);
      const res = await fetch(`${API_BASE}/api/me`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        const wasNotPro = !isProRef.current;
        isProRef.current = data.is_pro || false;
        setIsPro(data.is_pro || false);
        setIsTrial(data.is_trial || false);
        setUsageCount(data.usage_count || 0);
        if (wasNotPro && data.is_pro && !localStorage.getItem('proWelcomeShown')) {
          showToast(t.proUpgradeToast, 'success');
          localStorage.setItem('proWelcomeShown', '1');
        }
      }
    } catch (e) {
      console.warn("無法取得用戶狀態，使用預設值：", e);
    }
  }, [showToast, t.proUpgradeToast]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      fetchUserProfile(user);
    });
    return () => unsubscribe();
  }, [fetchUserProfile]);

  // Persist view & guard: if no user after auth resolves, kick back to landing
  useEffect(() => {
    localStorage.setItem('lastView', view);
  }, [view]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user && view === 'chat') setView('landing');
    });
    return () => unsubscribe();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleEnterApp = () => {
    if (!currentUser) setShowAuth(true);
    else setView('chat');
  };

  const handleGoogleLogin = async () => {
    if (isLoggingIn) return;
    setIsLoggingIn(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      await fetchUserProfile(result.user);
      setShowAuth(false);
      setView('chat');
    } catch (error) {
      if (error.code !== 'auth/cancelled-popup-request' && error.code !== 'auth/popup-closed-by-user') {
        showToast(t.errLoginFailed + error.message, 'error');
      }
    } finally { setIsLoggingIn(false); }
  };

  const handleEmailAuth = async () => {
    if (!authEmail || !authPassword) {
      showToast(t.errEmailPassword, 'warning');
      return;
    }
    if (isLoggingIn) return;
    setIsLoggingIn(true);
    try {
      let result;
      if (isSignUpMode) {
        result = await createUserWithEmailAndPassword(auth, authEmail, authPassword);
      } else {
        result = await signInWithEmailAndPassword(auth, authEmail, authPassword);
      }
      await fetchUserProfile(result.user);
      setShowAuth(false);
      setAuthPassword('');
      setView('chat');
    } catch (error) {
      showToast((isSignUpMode ? t.errSignupFailed : t.errLoginFailed) + error.message, 'error');
    } finally { setIsLoggingIn(false); }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setCurrentUser(null);
      setIsPro(false);
      setUsageCount(0);
      setView('landing');
    } catch (error) { console.error("Logout failed"); }
  };

  const handleUpgradeClick = (e) => {
    if (e) e.preventDefault();
    if (!currentUser) {
      showToast(t.errLoginRequired, 'warning');
      setShowAuth(true);
    } else {
      setShowPay(true);
    }
  };

  // Load conversations from Firestore
  const loadConversations = useCallback(async (user) => {
    if (!user) { setConversations([]); return; }
    try {
      const q = query(collection(db, 'users', user.uid, 'conversations'), orderBy('updatedAt', 'desc'));
      const snap = await getDocs(q);
      setConversations(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (e) { console.warn('Failed to load conversations', e); }
  }, []);

  useEffect(() => {
    if (!isTempMode && currentUser) loadConversations(currentUser);
  }, [isTempMode, currentUser, loadConversations]);

  const lastSavedLengthRef = useRef(0);

  const saveConversation = useCallback(async (msgs, convId, settings) => {
    if (isTempMode || !currentUser || msgs.length === 0) return convId;
    const title = msgs.find(m => m.role === 'user')?.content?.slice(0, 30) || t.convUntitled;
    const data = { title, messages: msgs, updatedAt: serverTimestamp(), settings };
    try {
      if (convId) {
        await updateDoc(doc(db, 'users', currentUser.uid, 'conversations', convId), data);
        setConversations(prev => prev.map(c => c.id === convId ? { ...c, ...data, updatedAt: { toDate: () => new Date() } } : c));
        return convId;
      } else {
        const ref = await addDoc(collection(db, 'users', currentUser.uid, 'conversations'), { ...data, createdAt: serverTimestamp() });
        const newConv = { id: ref.id, ...data, updatedAt: { toDate: () => new Date() } };
        setConversations(prev => [newConv, ...prev]);
        setActiveConvId(ref.id);
        return ref.id;
      }
    } catch (e) { console.warn('Failed to save conversation', e); return convId; }
  }, [isTempMode, currentUser, t.convUntitled]);

  // Auto-save after each AI reply
  useEffect(() => {
    const lastMsg = messages[messages.length - 1];
    if (
      !isTempMode && currentUser &&
      messages.length > 0 &&
      lastMsg?.role === 'ai' &&
      messages.length !== lastSavedLengthRef.current
    ) {
      lastSavedLengthRef.current = messages.length;
      const convSettings = { mode, category, mapQuery, distanceKm, toneMode };
      saveConversation(messages, activeConvIdRef.current, convSettings).then(id => {
        if (id && id !== activeConvIdRef.current) setActiveConvId(id);
      });
    }
  }, [messages, isTempMode, currentUser, saveConversation]); // eslint-disable-line react-hooks/exhaustive-deps

  const deleteConversation = useCallback(async (convId) => {
    if (!currentUser) return;
    try {
      await deleteDoc(doc(db, 'users', currentUser.uid, 'conversations', convId));
      setConversations(prev => prev.filter(c => c.id !== convId));
      if (activeConvId === convId) {
        setActiveConvId(null);
        setMessages([]);
      }
    } catch (e) { console.warn('Failed to delete conversation', e); }
  }, [currentUser, activeConvId]);

  const loadConversation = useCallback((conv) => {
    setMessages(conv.messages || []);
    setActiveConvId(conv.id);
    if (conv.settings) {
      if (conv.settings.mode) setMode(conv.settings.mode);
      if (conv.settings.category) setCategory(conv.settings.category);
      if (conv.settings.mapQuery) { setMapQuery(conv.settings.mapQuery); setMapInputValue(conv.settings.mapQuery); }
      if (conv.settings.distanceKm) setDistanceKm(conv.settings.distanceKm);
      if (conv.settings.toneMode) setToneMode(conv.settings.toneMode);
    }
  }, []);

  const startNewChat = useCallback(() => {
    setMessages([]);
    setActiveConvId(null);
    setUserReq('');
    setQuestion('');
  }, []);

  const addToWishlist = useCallback((place) => {
    const id = place.place_id || place.name;
    setWishlist(prev => {
      const exists = prev.find(p => p.id === id);
      let next;
      if (exists) {
        next = prev.filter(p => p.id !== id);
        showToast(t.wishlistToastRemoved, 'info');
      } else {
        next = [{ id, name: place.name, rating: place.rating || null, address: place.address || '', lat: place.lat, lng: place.lng, note: '', addedAt: new Date().toISOString() }, ...prev];
        showToast(t.wishlistToastAdded, 'success');
      }
      localStorage.setItem('wishlist', JSON.stringify(next));
      return next;
    });
  }, [showToast, t.wishlistToastRemoved, t.wishlistToastAdded]);

  const removeFromWishlist = useCallback((id) => {
    setWishlist(prev => {
      const next = prev.filter(p => p.id !== id);
      localStorage.setItem('wishlist', JSON.stringify(next));
      return next;
    });
    showToast(t.wishlistToastRemoved, 'info');
  }, [showToast, t.wishlistToastRemoved]);

  const isInWishlist = useCallback((placeId) => {
    return wishlist.some(p => p.id === placeId);
  }, [wishlist]);

  const updateWishlistNote = useCallback((id, note) => {
    setWishlist(prev => {
      const next = prev.map(p => p.id === id ? { ...p, note } : p);
      localStorage.setItem('wishlist', JSON.stringify(next));
      return next;
    });
  }, []);

  const handleWishlistAnalyze = useCallback((name) => {
    setMode('evaluate');
    setMapQuery(name);
    setMapInputValue(name);
    setPendingAnalyze(true);
  }, []);

  const handleToneChange = (e) => {
    const val = e.target.value;
    if (val === '自訂...' && !isPro) { handleUpgradeClick(); setToneMode('毒舌評論家'); return; }
    setToneMode(val);
  };


  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  useEffect(() => {
    if (typeof navigator === 'undefined' || !("geolocation" in navigator)) return;
    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude: lat, longitude: lng, accuracy } = pos.coords;
        setLocation({ lat, lng, accuracy });
        localStorage.setItem('lastGPS', JSON.stringify({ lat, lng }));
        if (useCurrentLoc) {
          // Only overwrite mapQuery if no store is currently selected
          const q = mapQueryRef.current;
          const isCoordOrEmpty = !q || q === '台灣' || /^-?\d+(\.\d+)?,-?\d+(\.\d+)?$/.test(q);
          if (isCoordOrEmpty) setMapQuery(`${lat},${lng}`);
        }
      },
      () => console.warn("Location access denied."),
      { enableHighAccuracy: true, maximumAge: 5000 }
    );
    return () => navigator.geolocation.clearWatch(watchId);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging || isMobile) return;
      const delta = mapPosition === 'left' ? (e.clientX - dragRef.current.startX) : (dragRef.current.startX - e.clientX);
      setLeftWidth(Math.max(300, Math.min(dragRef.current.startWidth + delta, window.innerWidth - 350)));
    };
    const handleMouseUp = () => { setIsDragging(false); document.body.style.userSelect = 'auto'; };
    if (isDragging) {
      document.body.style.userSelect = 'none';
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.userSelect = 'auto';
    };
  }, [isDragging, isMobile, mapPosition]);

  useEffect(() => {
    if (pendingAnalyze && mode === 'evaluate') {
      setPendingAnalyze(false);
      handleSend();
    }
  }, [pendingAnalyze, mode]); // eslint-disable-line react-hooks/exhaustive-deps

  const stopVoiceRecognition = useCallback(() => {
    if (voiceTimeoutRef.current) clearTimeout(voiceTimeoutRef.current);
    if (recognitionRef.current) {
      recognitionRef.current.onend = null;
      try { recognitionRef.current.stop(); } catch (e) { /* 已停止，忽略 */ }
      recognitionRef.current = null;
    }
    setIsListening(false);
  }, []);

  const handleVoiceInput = () => {
    if (!currentUser) return setShowAuth(true);
    if (isListening) { stopVoiceRecognition(); return; }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      showToast(t.errVoiceNotSupported, 'warning');
      return;
    }

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    recognition.lang = lang === 'zh-TW' ? 'zh-TW' : 'en-US';
    recognition.interimResults = false;
    recognition.continuous = false;

    recognition.onstart = () => {
      setIsListening(true);
      voiceTimeoutRef.current = setTimeout(() => stopVoiceRecognition(), 8000);
    };
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      if (mode === 'recommend') setUserReq(prev => prev + (prev ? " " : "") + transcript);
      else setQuestion(prev => prev + (prev ? " " : "") + transcript);
    };
    recognition.onerror = () => stopVoiceRecognition();
    recognition.onend = () => stopVoiceRecognition();

    try { recognition.start(); } catch (e) { stopVoiceRecognition(); }
  };

  const handleSpeak = (text) => {
    if (isSpeaking) { window.speechSynthesis.cancel(); setIsSpeaking(false); return; }
    const utterance = new SpeechSynthesisUtterance(text.replace(/[*#【】\[\]]/g, ''));
    const targetLang = lang === 'zh-TW' ? 'zh-TW' : 'en-US';
    utterance.lang = targetLang;
    utterance.rate = 0.92;
    utterance.pitch = 1.05;

    const pickVoice = () => {
      const voices = window.speechSynthesis.getVoices();
      if (!voices.length) return;
      const preferred = lang === 'zh-TW'
        ? ['Mei-Jia', 'Meijia', 'Ting-Ting', 'Tingting']
        : ['Samantha', 'Karen', 'Moira', 'Serena', 'Daniel', 'Alex'];
      let best = null;
      for (const name of preferred) {
        best = voices.find(v => v.name.includes(name));
        if (best) break;
      }
      if (!best) best = voices.find(v => v.lang === targetLang && v.localService) || voices.find(v => v.lang.startsWith(lang === 'zh-TW' ? 'zh' : 'en'));
      if (best) utterance.voice = best;
    };

    pickVoice();
    // Chrome loads voices async — retry once if empty
    if (!utterance.voice) {
      window.speechSynthesis.onvoiceschanged = () => { pickVoice(); window.speechSynthesis.onvoiceschanged = null; };
    }

    utterance.onend = () => setIsSpeaking(false);
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const getToneText = (val) => {
    const safeVal = val || "";
    if (safeVal.includes('毒舌')) return t.toneBrutal;
    if (safeVal.includes('極簡')) return t.toneBrief;
    if (safeVal.includes('專業')) return t.tonePro;
    if (safeVal.includes('自訂')) return customTone || t.toneCustom;
    return t.toneWarm;
  };

  const getCatText = (val) => {
    if (val === '不限種類' || val === 'Any Type') return t.catNone;
    if (val === '找餐廳' || val === 'Find Restaurants') return t.catRest;
    if (val === '找飯店' || val === 'Find Hotels') return t.catHotel;
    if (val === '找景點' || val === 'Find Attractions') return t.catAttr;
    if (val === '找商店' || val === 'Find Shops') return t.catShop;
    if (val === '自訂分類...' || val === 'Custom...') return customCategory || t.catCustom;
    return val || '';
  };

  const getToneIcon = () => {
    const safeTone = toneMode || "";
    if (safeTone.includes('毒舌') || safeTone.includes('Brutal')) return <Icons.Flame />;
    if (safeTone.includes('極簡') || safeTone.includes('Brief')) return <Icons.Zap />;
    if (safeTone.includes('專業') || safeTone.includes('Expert')) return <Icons.Briefcase />;
    if (safeTone.includes('自訂') || safeTone.includes('Custom')) return <Icons.Palette />;
    return <Icons.Heart />;
  };

  const handleSend = async (overrideContent = null) => {
    if (!currentUser) return setShowAuth(true);
    if (!isPro && usageCount >= maxFreeUses) return handleUpgradeClick();

    const safeQuery = mapQuery || '台灣';
    const isCoordinate = /^-?\d+(\.\d+)?,-?\d+(\.\d+)?$/.test(safeQuery);
    const isValidStore = safeQuery !== '台灣' && !isCoordinate;

    let targetReq = overrideContent || userReq;
    let targetQuestion = overrideContent || question;

    if (!overrideContent) {
      if (mode === 'recommend') {
        if (!userReq) { showToast(t.errEmpty, 'warning'); return; }
        if (useCurrentLoc && !location.lat) { showToast(t.errNoLocation, 'warning'); return; }
      }
      if (mode === 'evaluate' && !isValidStore) { showToast(t.errNoStore, 'warning'); return; }
      targetReq = userReq;
      targetQuestion = question;
    } else {
      if (mode === 'recommend') { targetReq = overrideContent; targetQuestion = ''; }
      else { targetQuestion = overrideContent; targetReq = ''; }
    }

    setLoading(true);
    let blocked = false;

    let finalQuestion = targetQuestion.trim();
    if (mode === 'evaluate' && !finalQuestion) {
      finalQuestion = lang === 'zh-TW' ? "請給予這家店的評價總結" : "Please provide a summary of reviews for this store.";
    }

    const currentSettingsTags = mode === 'recommend'
      ? [t.tabRec, useCurrentLoc ? t.locCurr : (customLoc || t.locCust), getCatText(category), `${distanceKm}km`, getToneText(toneMode)]
      : [t.tabEval, getToneText(toneMode)];

    const displayContent = mode === 'recommend'
      ? targetReq
      : `搜索: ${safeQuery} ${targetQuestion ? `(${targetQuestion})` : '(評價總結)'}`;

    if (!overrideContent) {
      setMessages(prev => [...prev, { role: 'user', content: displayContent, settings: currentSettingsTags }]);
      setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
    }

    let enhancedReq = targetReq;
    if (mode === 'recommend' && useCurrentLoc) {
      enhancedReq += ` (系統強制限制：必須是${distanceKm}公里半徑內的店，嚴禁推薦外縣市)`;
    }

    try {
      const token = await currentUser.getIdToken();
      const res = await fetch(`${API_BASE}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({
          mode,
          category: category === '自訂分類...' ? customCategory : category,
          user_requirement: enhancedReq,
          store_name: mode === 'evaluate' ? safeQuery : "",
          question: finalQuestion,
          lat: location.lat,
          lng: location.lng,
          history: messages.slice(-4),
          recommend_count: Number(recommendCount),
          use_current_location: useCurrentLoc,
          custom_location: customLoc,
          tone_mode: toneMode === '自訂...' ? customTone : toneMode,
          ui_lang: lang,
          radius_km: distanceKm,
          user_profile: isPro && userProfile ? userProfile : ''
        }),
      });

      if (res.status === 403) { blocked = true; handleUpgradeClick(); return; }

      const data = await res.json();
      if (data.reply) {
        setMessages(prev => [...prev, { role: 'ai', content: data.reply, isNew: true }]);
        if (data.map_keyword && mode === 'recommend') {
          setMapQuery(data.map_keyword);
          setMapInputValue(data.map_keyword);
        }
        if (data.places && data.places.length > 0) setMapPlaces(data.places);
        if (!isPro && !isTrial) setUsageCount(prev => prev + 1);
      } else {
        setMessages(prev => [...prev, { role: 'ai', content: data.error || "Unknown Error", isNew: true }]);
      }
    } catch {
      setMessages(prev => [...prev, { role: 'ai', content: lang === 'zh-TW' ? '伺服器連線失敗，請確認網路或稍後再試。' : 'Server connection failed. Please check your network or try again later.', isNew: true }]);
    } finally {
      setLoading(false);
      if (!blocked) {
        setUserReq('');
        setQuestion('');
      }
      setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
    }
  };

  const handleRegenerate = () => {
    if (!currentUser) return setShowAuth(true);
    if (messages.length < 2 || loading) return;
    let lastUserMsg = '';
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].role === 'user') {
        lastUserMsg = mode === 'evaluate' ? (messages[i].content.match(/\(([^)]*)\)[^(]*$/)?.[1] || "") : messages[i].content;
        break;
      }
    }
    setMessages(prev => prev.filter((_, idx) => idx !== prev.length - 1));
    handleSend(lastUserMsg || ' ');
  };

  const handleKeyDown = (e) => {
    if (e.nativeEvent.isComposing || e.keyCode === 229) return;
    if (e.key === 'Enter') { e.preventDefault(); handleSend(); }
  };

  const getSafePlaceholder = () => {
    if (mode === 'recommend') return t.reqPh;
    try {
      const safeQuery = mapQuery || '台灣';
      const isCoord = /^-?\d+(\.\d+)?,-?\d+(\.\d+)?$/.test(safeQuery);
      return (t.evalPh || '').replace('{store}', (safeQuery && safeQuery !== '台灣' && !isCoord) ? safeQuery : (t.noStore || '未選擇店面'));
    } catch (e) { return '向此店面提問...'; }
  };


  if (view === 'landing') {
    return (
      <>
        <style dangerouslySetInnerHTML={{ __html: GLOBAL_STYLES }} />
        <LandingPage
          styles={styles}
          isLight={isLight}
          isMobile={isMobile}
          t={t}
          lang={lang}
          setLang={setLang}
          theme={theme}
          setTheme={setTheme}
          currentUser={currentUser}
          toast={toast}
          showAuth={showAuth}
          setShowAuth={setShowAuth}
          showPay={showPay}
          setShowPay={setShowPay}
          billingCycle={billingCycle}
          setBillingCycle={setBillingCycle}
          authEmail={authEmail}
          setAuthEmail={setAuthEmail}
          authPassword={authPassword}
          setAuthPassword={setAuthPassword}
          isSignUpMode={isSignUpMode}
          setIsSignUpMode={setIsSignUpMode}
          isLoggingIn={isLoggingIn}
          handleEmailAuth={handleEmailAuth}
          handleGoogleLogin={handleGoogleLogin}
          handleEnterApp={handleEnterApp}
          handleUpgradeClick={handleUpgradeClick}
        />
      </>
    );
  }

  const fontSizePx = fontSize === 'small' ? '13px' : fontSize === 'large' ? '17px' : '15px';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100dvh', backgroundColor: styles.bg, color: styles.text, fontFamily: 'sans-serif', overflow: 'hidden', position: 'relative', fontSize: fontSizePx }}>
      <style dangerouslySetInnerHTML={{ __html: GLOBAL_STYLES }} />
      {!isLight && !isMobile && (
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden', opacity: 0.35 }}>
          <div className="stars-sm" style={{ position: 'absolute', top: 0, left: 0 }} />
          <div className="stars-md" style={{ position: 'absolute', top: 0, left: 0 }} />
          <div className="stars-lg" style={{ position: 'absolute', top: 0, left: 0 }} />
        </div>
      )}
      {isLight && !isMobile && (
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
          <div className="sunray" />
        </div>
      )}
      <Toast toast={toast} />

      <AppHeader
        styles={styles}
        isLight={isLight}
        theme={theme}
        setTheme={setTheme}
        t={t}
        isMobile={isMobile}
        isPro={isPro}
        currentUser={currentUser}
        usageCount={usageCount}
        maxFreeUses={maxFreeUses}
        handleUpgradeClick={handleUpgradeClick}
        handleLogout={handleLogout}
        setShowAuth={setShowAuth}
        setIsSignUpMode={setIsSignUpMode}
        setView={setView}
        onShowHistory={() => setShowConvPanel(true)}
        onNewChat={startNewChat}
        onShowWishlist={() => setShowWishlist(true)}
        wishlistCount={wishlist.length}
      />
      <ConversationPanel
        styles={styles}
        isLight={isLight}
        t={t}
        isOpen={showConvPanel}
        onClose={() => setShowConvPanel(false)}
        conversations={conversations}
        activeConvId={activeConvId}
        onLoad={loadConversation}
        onDelete={deleteConversation}
        onNewChat={startNewChat}
        isTempMode={isTempMode}
        setIsTempMode={setIsTempMode}
        currentUser={currentUser}
        showToast={showToast}
      />
      <WishlistPanel
        styles={styles}
        isLight={isLight}
        t={t}
        lang={lang}
        isOpen={showWishlist}
        onClose={() => setShowWishlist(false)}
        wishlist={wishlist}
        onRemove={removeFromWishlist}
        onAnalyze={handleWishlistAnalyze}
        onUpdateNote={updateWishlistNote}
      />

      {isMobile ? (
        <>
          <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            {mobileTab === 'chat' && (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '10px', boxSizing: 'border-box', overflow: 'hidden' }}>
                <ControlBar
                  styles={styles}
                  isLight={isLight}
                  t={t}
                  showMap={false}
                  mode={mode}
                  setMode={setMode}
                  toneMode={toneMode}
                  handleToneChange={handleToneChange}
                  customTone={customTone}
                  setCustomTone={setCustomTone}
                  isPro={isPro}
                  useCurrentLoc={useCurrentLoc}
                  setUseCurrentLoc={setUseCurrentLoc}
                  customLoc={customLoc}
                  setCustomLoc={setCustomLoc}
                  setMapQuery={setMapQuery}
                  setMapInputValue={setMapInputValue}
                  category={category}
                  setCategory={setCategory}
                  customCategory={customCategory}
                  setCustomCategory={setCustomCategory}
                  distanceKm={distanceKm}
                  setDistanceKm={setDistanceKm}
                  showRoute={showRoute}
                  setShowRoute={setShowRoute}
                  getToneIcon={getToneIcon}
                  handleUpgradeClick={handleUpgradeClick}
                  isMobile={true}
                  onToggleMap={() => setMobileTab('map')}
                />
                <ChatArea
                  messages={messages}
                  styles={styles}
                  isLight={isLight}
                  showMap={false}
                  loading={loading}
                  mode={mode}
                  t={t}
                  isMobile={true}
                  isSpeaking={isSpeaking}
                  handleSpeak={handleSpeak}
                  handleRegenerate={handleRegenerate}
                  setMapQuery={setMapQuery}
                  setMapInputValue={setMapInputValue}
                  chatEndRef={chatEndRef}
                />
                <ChatInput
                  styles={styles}
                  isLight={isLight}
                  isMobile={true}
                  showMap={false}
                  mode={mode}
                  userReq={userReq}
                  setUserReq={setUserReq}
                  question={question}
                  setQuestion={setQuestion}
                  loading={loading}
                  isListening={isListening}
                  handleVoiceInput={handleVoiceInput}
                  handleSend={handleSend}
                  handleKeyDown={handleKeyDown}
                  placeholder={getSafePlaceholder()}
                />
              </div>
            )}
            {mobileTab === 'map' && (
              <MapPanel
                styles={styles}
                isLight={isLight}
                t={t}
                lang={lang}
                isMobile={true}
                mobileFullHeight={true}
                mapPosition={mapPosition}
                leftWidth={leftWidth}
                isDragging={isDragging}
                setIsDragging={setIsDragging}
                isPro={isPro}
                mapInputValue={mapInputValue}
                setMapInputValue={setMapInputValue}
                setMapQuery={setMapQuery}
                mapQuery={mapQuery}
                onAnalyzePlace={() => {
                  setMode('evaluate');
                  setMapQuery(mapInputValue.trim() || mapQuery);
                  setMobileTab('chat');
                  setPendingAnalyze(true);
                }}
                onAddToWishlist={addToWishlist}
                isInWishlist={isInWishlist}
                places={mapPlaces}
                location={location}
                showRoute={showRoute}
                useCurrentLoc={useCurrentLoc}
                customLoc={customLoc}
              />
            )}
          </div>
          {/* Mobile bottom tab bar */}
          <div style={{ flexShrink: 0, display: 'flex', borderTop: `1px solid ${styles.border}`, backgroundColor: styles.panel, paddingBottom: 'env(safe-area-inset-bottom)' }}>
            <button
              onClick={() => setMobileTab('chat')}
              style={{ flex: 1, padding: '10px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'none', border: 'none', color: mobileTab === 'chat' ? styles.accent : (isLight ? '#888' : '#aaa'), cursor: 'pointer', gap: '3px', fontSize: '10px', fontWeight: mobileTab === 'chat' ? 'bold' : 'normal' }}
            >
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
              <span>{lang === 'zh-TW' ? '對話' : 'Chat'}</span>
            </button>
            <button
              onClick={() => setMobileTab('map')}
              style={{ flex: 1, padding: '10px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'none', border: 'none', color: mobileTab === 'map' ? styles.accent : (isLight ? '#888' : '#aaa'), cursor: 'pointer', gap: '3px', fontSize: '10px', fontWeight: mobileTab === 'map' ? 'bold' : 'normal' }}
            >
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"></polygon><line x1="8" y1="2" x2="8" y2="18"></line><line x1="16" y1="6" x2="16" y2="22"></line></svg>
              <span>{lang === 'zh-TW' ? '地圖' : 'Map'}</span>
            </button>
          </div>
        </>
      ) : (
        <div style={{ flex: 1, display: 'flex', flexDirection: mapPosition === 'left' ? 'row' : 'row-reverse', overflow: 'hidden' }}>

          {!showMap && !isPro && (
            <div style={{ width: '60px', borderRight: mapPosition === 'left' ? `1px solid ${styles.border}` : 'none', borderLeft: mapPosition === 'right' ? `1px solid ${styles.border}` : 'none', backgroundColor: styles.panel, display: 'flex', flexDirection: 'column' }}>
              <AdBanner isLight={isLight} t={t} mode="sidebar" />
            </div>
          )}

          {showMap && (
            <MapPanel
              styles={styles}
              isLight={isLight}
              t={t}
              lang={lang}
              isMobile={false}
              mapPosition={mapPosition}
              leftWidth={leftWidth}
              isDragging={isDragging}
              setIsDragging={setIsDragging}
              isPro={isPro}
              mapInputValue={mapInputValue}
              setMapInputValue={setMapInputValue}
              setMapQuery={setMapQuery}
              mapQuery={mapQuery}
              onAnalyzePlace={() => {
                setMode('evaluate');
                setMapQuery(mapInputValue.trim() || mapQuery);
                setPendingAnalyze(true);
              }}
              onAddToWishlist={addToWishlist}
              isInWishlist={isInWishlist}
              places={mapPlaces}
              location={location}
              showRoute={showRoute}
              useCurrentLoc={useCurrentLoc}
              customLoc={customLoc}
            />
          )}

          {showMap && (
            <div
              onMouseDown={(e) => { e.preventDefault(); setIsDragging(true); dragRef.current = { startX: e.clientX, startWidth: leftWidth }; }}
              style={{ width: '5px', cursor: 'col-resize', backgroundColor: isDragging ? styles.accent : 'transparent', transition: 'background-color 0.2s', zIndex: 50 }}
            />
          )}

          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '15px', boxSizing: 'border-box', position: 'relative', overflow: 'hidden', alignItems: showMap ? 'stretch' : 'center' }}>

            <ControlBar
              styles={styles}
              isLight={isLight}
              t={t}
              showMap={showMap}
              mode={mode}
              setMode={setMode}
              toneMode={toneMode}
              handleToneChange={handleToneChange}
              customTone={customTone}
              setCustomTone={setCustomTone}
              isPro={isPro}
              useCurrentLoc={useCurrentLoc}
              setUseCurrentLoc={setUseCurrentLoc}
              customLoc={customLoc}
              setCustomLoc={setCustomLoc}
              setMapQuery={setMapQuery}
              setMapInputValue={setMapInputValue}
              category={category}
              setCategory={setCategory}
              customCategory={customCategory}
              setCustomCategory={setCustomCategory}
              distanceKm={distanceKm}
              setDistanceKm={setDistanceKm}
              showRoute={showRoute}
              setShowRoute={setShowRoute}
              getToneIcon={getToneIcon}
              handleUpgradeClick={handleUpgradeClick}
              isMobile={false}
              onToggleMap={() => { const newVal = !showMap; setShowMap(newVal); localStorage.setItem('showMap', newVal); }}
            />

            <ChatArea
              messages={messages}
              styles={styles}
              isLight={isLight}
              showMap={showMap}
              loading={loading}
              mode={mode}
              t={t}
              isMobile={false}
              isSpeaking={isSpeaking}
              handleSpeak={handleSpeak}
              handleRegenerate={handleRegenerate}
              setMapQuery={setMapQuery}
              setMapInputValue={setMapInputValue}
              chatEndRef={chatEndRef}
            />

            <ChatInput
              styles={styles}
              isLight={isLight}
              isMobile={false}
              showMap={showMap}
              mode={mode}
              userReq={userReq}
              setUserReq={setUserReq}
              question={question}
              setQuestion={setQuestion}
              loading={loading}
              isListening={isListening}
              handleVoiceInput={handleVoiceInput}
              handleSend={handleSend}
              handleKeyDown={handleKeyDown}
              placeholder={getSafePlaceholder()}
            />
          </div>
        </div>
      )}

      {view === 'settings' && (
        <SettingsModal
          styles={styles}
          isLight={isLight}
          t={t}
          lang={lang}
          setLang={setLang}
          theme={theme}
          setTheme={setTheme}
          fontSize={fontSize}
          setFontSize={setFontSize}
          mapPosition={mapPosition}
          setMapPosition={setMapPosition}
          isPro={isPro}
          userProfile={userProfile}
          setUserProfile={setUserProfile}
          onClose={() => setView('chat')}
          isMobile={isMobile}
          currentUser={currentUser}
          handleLogout={handleLogout}
          setShowAuth={setShowAuth}
          setIsSignUpMode={setIsSignUpMode}
          handleUpgradeClick={handleUpgradeClick}
        />
      )}
      {showAuth && (
        <AuthModal
          styles={styles}
          isLight={isLight}
          t={t}
          authEmail={authEmail}
          setAuthEmail={setAuthEmail}
          authPassword={authPassword}
          setAuthPassword={setAuthPassword}
          isSignUpMode={isSignUpMode}
          setIsSignUpMode={setIsSignUpMode}
          isLoggingIn={isLoggingIn}
          handleEmailAuth={handleEmailAuth}
          handleGoogleLogin={handleGoogleLogin}
          onClose={() => setShowAuth(false)}
        />
      )}
      {showPay && (
        <PayModal
          styles={styles}
          isLight={isLight}
          t={t}
          billingCycle={billingCycle}
          setBillingCycle={setBillingCycle}
          onClose={() => setShowPay(false)}
        />
      )}
    </div>
  );
}

export default App;
