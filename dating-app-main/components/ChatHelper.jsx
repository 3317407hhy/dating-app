'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { chatTopics } from '@/lib/data';
import { getConversations, setConversations } from '@/lib/storage';
import { useToast } from './Toast';

// ============================================================
// ChatHelper - 首页右下角「💡 话题辅助」浮动按钮 + 弹窗
// ============================================================

export default function ChatHelper() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { showToast } = useToast();

  const sendTopic = (text) => {
    const convs = getConversations();
    if (!convs.length) {
      convs.push({
        id: 'sakura',
        name: '小樱',
        handle: '@sakura_chan',
        mbti: 'ENFP',
        avatar: 'linear-gradient(135deg,#f472b6,#ec4899)',
        unread: 0,
        messages: [],
      });
    }
    convs[0].messages.push({ from: 'me', text, time: Date.now() });
    setConversations(convs);
    showToast('✅ 话题已发送，去消息页看看吧！');
    setTimeout(() => router.push('/messages'), 800);
  };

  return (
    <div className="chat-helper">
      <button className="ch-float" onClick={() => setOpen(!open)} title="话题辅助">
        💡
      </button>
      <div className={`ch-modal${open ? ' show' : ''}`}>
        <div className="ch-header">
          <span>话题辅助</span>
          <button onClick={() => setOpen(false)}>×</button>
        </div>
        <div className="ch-list">
          {chatTopics.map((t) => (
            <div className="ch-item" key={t.id}>
              <div className="ch-tag">#{t.tag}</div>
              {t.text}
              <button className="ch-send" onClick={() => sendTopic(t.text)}>
                {' '}一键发送
              </button>
            </div>
          ))}
        </div>
        <div className="ch-free">非会员每日免费1次 · 开通VIP无限使用</div>
      </div>
    </div>
  );
}
