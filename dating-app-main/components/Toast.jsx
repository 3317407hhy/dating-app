'use client';

import { createContext, useCallback, useContext, useRef, useState } from 'react';

// ============================================================
// Toast - 全局消息提示
// 用法：在页面组件里调用 const { showToast } = useToast()
//       showToast('保存成功') 或 showToast('出错了', 'error')
// ============================================================

const ToastContext = createContext({ showToast: () => {} });

export function useToast() {
  return useContext(ToastContext);
}

export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null);
  const timer = useRef(null);

  const showToast = useCallback((msg, type) => {
    setToast({ msg, type });
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setToast(null), 2800);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div
        className={`toast${toast ? ' show' : ''}${toast && toast.type === 'error' ? ' error' : ''}`}
        role="status"
      >
        {toast ? toast.msg : ''}
      </div>
    </ToastContext.Provider>
  );
}
