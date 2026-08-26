'use client';

import { useRouter } from 'next/navigation';

// ============================================================
// LoginGate - 未登录时的登录引导区域（可复用组件）
// ============================================================

export default function LoginGate({ title = '欢迎来到 EchoZshsamber', desc = '' }) {
  const router = useRouter();

  return (
    <div className="login-gate">
      <h2>{title}</h2>
      <p>{desc}</p>
      <button className="lg-btn" onClick={() => router.push('/auth')}>
        登录
      </button>
      <button className="lg-btn outline" onClick={() => router.push('/auth?tab=register')}>
        创建账号
      </button>
    </div>
  );
}
