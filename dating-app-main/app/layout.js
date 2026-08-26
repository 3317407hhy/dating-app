import './globals.css';
import { ToastProvider } from '@/components/Toast';

// ============================================================
// 根布局：全局样式 + 全局 Toast Provider
// ============================================================

export const metadata = {
  title: 'EchoZshsamber · 二次元社恐友好匹配',
  description: 'EchoZshsamber - 二次元 · 低压力 · 精准匹配',
};

export default function RootLayout({ children }) {
  return (
    <html lang="zh-CN">
      <body>
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
