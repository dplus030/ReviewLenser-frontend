/**
 * tokenService.js — Lenser AI 前端代幣管理工具
 * =================================================
 *
 * 提供：
 *  1. generateRequestId()   — 每次操作生成唯一 UUID（冪等鍵）
 *  2. useTokenGuard(hook)   — React hook，包裝 API 呼叫：防連點 + 自動處理 402
 *
 * 使用範例（在 App.jsx 的送出按鈕 handler 裡）：
 *
 *   import { useTokenGuard } from './utils/tokenService';
 *
 *   const { isProcessing, callWithGuard } = useTokenGuard({
 *     onInsufficientTokens: () => setShowPay(true),
 *   });
 *
 *   // 在按鈕 onClick 裡：
 *   await callWithGuard(async (requestId) => {
 *     return fetch(`${API_BASE}/api/chat`, {
 *       method: 'POST',
 *       headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
 *       body: JSON.stringify({ ...payload, request_id: requestId }),
 *     });
 *   });
 */

import { useState, useCallback, useRef } from 'react';

// ─────────────────────────────────────────────────────────────────────────────
// 工具：生成 UUID v4（不依賴第三方套件）
// ─────────────────────────────────────────────────────────────────────────────

export function generateRequestId() {
  // 優先使用 crypto.randomUUID（現代瀏覽器）
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // 備用：手動拼接
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// Hook：useTokenGuard
// ─────────────────────────────────────────────────────────────────────────────

/**
 * @param {Object} options
 * @param {Function} [options.onInsufficientTokens]  — 代幣不足時的 callback（例如開啟付款 Modal）
 * @param {Function} [options.onError]               — 其他錯誤 callback
 *
 * @returns {{
 *   isProcessing: boolean,
 *   callWithGuard: (apiFn: (requestId: string) => Promise<Response>) => Promise<any>
 * }}
 */
export function useTokenGuard({ onInsufficientTokens, onError } = {}) {
  const [isProcessing, setIsProcessing] = useState(false);
  // 用 ref 追蹤「當前進行中」的請求，避免 state 閉包問題
  const processingRef = useRef(false);

  /**
   * callWithGuard
   * -------------
   * 包裝任何需要扣款的 API 呼叫。
   *
   * @param {(requestId: string) => Promise<Response>} apiFn
   *   - 接收自動生成的 requestId
   *   - 回傳 fetch Response（或任何含 .ok / .status 的物件）
   *
   * @returns {Promise<any>}  — API 回傳的 JSON，或 null（代幣不足 / 失敗）
   */
  const callWithGuard = useCallback(async (apiFn) => {
    // ── 防止連點：同一時間只允許一個請求 ────────────────────────────────
    if (processingRef.current) return null;
    processingRef.current = true;
    setIsProcessing(true);

    const requestId = generateRequestId();

    try {
      const response = await apiFn(requestId);

      // ── 代幣不足（後端回傳 402）──────────────────────────────────────
      if (response.status === 402) {
        onInsufficientTokens?.();
        return null;
      }

      // ── 其他 HTTP 錯誤 ────────────────────────────────────────────────
      if (!response.ok) {
        const errBody = await response.json().catch(() => ({}));
        onError?.(errBody);
        return null;
      }

      return await response.json();
    } catch (err) {
      onError?.(err);
      return null;
    } finally {
      processingRef.current = false;
      setIsProcessing(false);
    }
  }, [onInsufficientTokens, onError]);

  return { isProcessing, callWithGuard };
}

// ─────────────────────────────────────────────────────────────────────────────
// 代幣消耗規則常數（與後端保持一致，方便前端 UI 顯示提示）
// ─────────────────────────────────────────────────────────────────────────────

export const TOKEN_COST = {
  /** 動作 A：全新地點深度鑑定（SerpApi + AI） */
  NEW_SEARCH: 1,
  /** 動作 B：對已查詢店追問 AI */
  FOLLOWUP_QUESTION: 1,
  /** 動作 C：加入口袋名單 */
  ADD_TO_WISHLIST: 0,
  /** 動作 D：查看歷史查詢（快取） */
  VIEW_HISTORY: 0,
};
