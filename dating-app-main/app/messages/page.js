'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import FooterLinks from '@/components/FooterLinks';
import LoginGate from '@/components/LoginGate';
import { useToast } from '@/components/Toast';
import { getUser, getConversations, setConversations, getUnreadCount } from '@/lib/storage';
import { inboxPool } from '@/lib/data';

// ============================================================
// 消息页（原 消息.html）
// ============================================================

function formatTime(t) {
  const d = new Date(t);
  const now = new Date();
  const hm = ('0' + d.getHours()).slice(-2) + ':' + ('0' + d.getMinutes()).slice(-2);
  if (d.toDateString() === now.toDateString()) return hm;
  if (d.getFullYear() === now.getFullYear()) return d.getMonth() + 1 + '/' + d.getDate() + ' ' + hm;
  return d.getFullYear() + '/' + (d.getMonth() + 1) + '/' + d.getDate();
}

function seedMessages() {
  const now = Date.now();
  const h = 3600000;
  setConversations([
    {
      id: 'sakura', name: '小樱', handle: '@sakura_chan', mbti: 'ENFP',
      avatar: 'linear-gradient(135deg,#f472b6,#ec4899)', unread: 2,
      messages: [
        { from: 'other', text: '你好呀！看到你也喜欢《孤独摇滚》，我超喜欢喜多！', time: now - 26 * h },
        { from: 'me', text: '哈哈是的！我最喜欢波奇酱，太真实了', time: now - 25 * h },
        { from: 'other', text: '今晚八点有动画回放，要不要一起看？', time: now - 10 * 60000 },
        { from: 'other', text: '顺便说一句，你头像好可爱～', time: now - 5 * 60000 },
      ],
    },
    {
      id: 'jie', name: '阿杰', handle: '@jie_otaku', mbti: 'INTJ',
      avatar: 'linear-gradient(135deg,#818cf8,#6366f1)', unread: 1,
      messages: [
        { from: 'other', text: '你好，看到你在找游戏搭子，我也在玩原神', time: now - 20 * h },
        { from: 'me', text: '好呀！你冒险等级多少了？', time: now - 19 * h },
        { from: 'other', text: '55级了，周末可以一起打周本', time: now - 20 * 60000 },
      ],
    },
    {
      id: 'momo', name: 'Momo', handle: '@momo_paint', mbti: 'INFP',
      avatar: 'linear-gradient(135deg,#fbbf24,#f59e0b)', unread: 1,
      messages: [
        { from: 'other', text: '你好！看到你也喜欢画画，可以互相看看作品吗？', time: now - 8 * h },
        { from: 'other', text: '我最近在画一组星空主题的插画', time: now - 15 * 60000 },
      ],
    },
    {
      id: 'xye', name: '小夜', handle: '@night_yy', mbti: 'INFP',
      avatar: 'linear-gradient(135deg,#34d399,#10b981)', unread: 1,
      messages: [{ from: 'other', text: '我也是INFP！握手🤝 你平时听什么歌？', time: now - 30 * 60000 }],
    },
  ]);
}

export default function MessagesPage() {
  const { showToast } = useToast();

  const [user, setUser] = useState({});
  const [convs, setConvs] = useState([]);
  const [currentConvId, setCurrentConvId] = useState(null);
  const [chatInput, setChatInput] = useState('');
  const [msgCount, setMsgCount] = useState(0);
  const chatBodyRef = useRef(null);

  useEffect(() => {
    const u = getUser();
    setUser(u);

    if (u.name && u.email) {
      const loaded = getConversations();
      if (loaded.length === 0) {
        seedMessages();
        setConvs(getConversations());
      } else {
        setConvs(loaded);
      }
      setMsgCount(getUnreadCount());

      // 首次访问模拟一条新消息
      let autoTimer = null;
      if (typeof window !== 'undefined' && !localStorage.getItem('zx_msg_auto')) {
        localStorage.setItem('zx_msg_auto', '1');
        autoTimer = setTimeout(() => simulateIncoming(), 4000);
      }
      return () => {
        if (autoTimer) clearTimeout(autoTimer);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isLoggedIn = !!(user.name && user.email);

  const saveConvs = useCallback((next) => {
    setConvs(next);
    setConversations(next);
    setMsgCount(next.reduce((n, c) => n + (c.unread || 0), 0));
  }, []);

  const currentConv = currentConvId ? convs.find((c) => c.id === currentConvId) || null : null;

  const openChat = (id) => {
    const next = convs.map((c) => (c.id === id ? { ...c, unread: 0 } : c));
    saveConvs(next);
    setCurrentConvId(id);
    setTimeout(() => {
      if (chatBodyRef.current) chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }, 0);
  };

  const closeChat = () => setCurrentConvId(null);

  const sendMsg = () => {
    const v = chatInput.trim();
    if (!v) {
      showToast('请输入消息内容', 'error');
      return;
    }
    const next = convs.map((c) =>
      c.id === currentConvId
        ? { ...c, messages: [...c.messages, { from: 'me', text: v, time: Date.now() }] }
        : c
    );
    saveConvs(next);
    setChatInput('');
    setTimeout(() => {
      if (chatBodyRef.current) chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }, 0);
  };

  const simulateIncoming = () => {
    const pick = inboxPool[Math.floor(Math.random() * inboxPool.length)];
    const text = pick.msgs[Math.floor(Math.random() * pick.msgs.length)];
    const next = [...convs];
    let conv = next.find((c) => c.id === pick.id);
    if (!conv) {
      conv = {
        id: pick.id,
        name: pick.name || pick.id,
        handle: pick.handle || '@user',
        mbti: pick.mbti || '',
        avatar: pick.avatar || 'linear-gradient(135deg,#6366f1,#8b5cf6)',
        unread: 0,
        messages: [],
      };
      next.push(conv);
    }
    conv.messages.push({ from: 'other', text, time: Date.now() });
    if (currentConvId === conv.id) {
      saveConvs(next);
    } else {
      conv.unread = (conv.unread || 0) + 1;
      saveConvs(next);
    }
    showToast(`📨 ${conv.name} 给你发了一条新消息`);
  };

  const sortedConvs = [...convs].sort((a, b) => {
    const am = a.messages && a.messages.length ? a.messages[a.messages.length - 1].time : 0;
    const bm = b.messages && b.messages.length ? b.messages[b.messages.length - 1].time : 0;
    return bm - am;
  });

  return (
    <div className="app">
      <Sidebar active="messages" user={user} msgCount={msgCount} />

      <div className="main" style={{ display: 'flex', flexDirection: 'column' }}>
        <div className="main-header">
          <span>💌 消息</span>
          {isLoggedIn && (
            <button className="msg-sim-btn" onClick={simulateIncoming}>
              📨 模拟接收
            </button>
          )}
        </div>

        {!isLoggedIn && (
          <LoginGate title="欢迎来到 EchoZshsamber" desc="登录即可接收别人发给你的消息" />
        )}

        {/* 会话列表 */}
        {isLoggedIn && !currentConv && (
          <div className="conv-list">
            {sortedConvs.length === 0 ? (
              <div className="conv-empty">
                <div className="ce-icon">💌</div>
                <div>还没有收到消息</div>
                <div style={{ fontSize: 13, marginTop: 8 }}>
                  点击右上角「📨 模拟接收」体验收到新消息
                </div>
              </div>
            ) : (
              sortedConvs.map((c) => {
                const msgs = c.messages || [];
                const last = msgs.length ? msgs[msgs.length - 1] : null;
                const preview = last ? (last.from === 'me' ? '我：' + last.text : last.text) : '暂无消息';
                const timeText = last ? formatTime(last.time) : '';
                return (
                  <div className="conv-item" key={c.id} onClick={() => openChat(c.id)}>
                    <div className="conv-avatar" style={{ background: c.avatar }}>
                      {c.name.charAt(0)}
                    </div>
                    <div className="conv-info">
                      <div className="conv-top">
                        <span className="conv-name">{c.name}</span>
                        <span className="conv-time">{timeText}</span>
                      </div>
                      <div className="conv-preview">{preview}</div>
                    </div>
                    {c.unread > 0 && (
                      <span className="conv-badge">{c.unread > 9 ? '9+' : c.unread}</span>
                    )}
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* 聊天视图 */}
        {isLoggedIn && currentConv && (
          <div className="chat-view">
            <div className="chat-header">
              <button className="back-btn" onClick={closeChat}>
                ←
              </button>
              <div className="ch-avatar" style={{ background: currentConv.avatar }}>
                {currentConv.name.charAt(0)}
              </div>
              <div className="ch-info">
                <div className="ch-name">{currentConv.name}</div>
                <div className="ch-handle">
                  {(currentConv.handle || '@user') + ' · ' + (currentConv.mbti || '')}
                </div>
              </div>
            </div>
            <div className="chat-body" ref={chatBodyRef}>
              {(currentConv.messages || []).length === 0 ? (
                <div className="conv-empty" style={{ margin: 'auto' }}>
                  <div className="ce-icon">👋</div>
                  <div>你们还没聊过天，先打个招呼吧</div>
                </div>
              ) : (
                currentConv.messages.map((m, i) => {
                  const me = m.from === 'me';
                  return (
                    <div className={`bubble-row${me ? ' me' : ' other'}`} key={i}>
                      {!me && (
                        <div className="b-avatar" style={{ background: currentConv.avatar }}>
                          {currentConv.name.charAt(0)}
                        </div>
                      )}
                      <div className="bubble">
                        {m.text}
                        <div className="b-time">{formatTime(m.time)}</div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
            <div className="chat-input">
              <input
                type="text"
                placeholder="输入消息...（按 Enter 发送）"
                maxLength={500}
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') sendMsg();
                }}
              />
              <button className="send-btn" onClick={sendMsg}>
                发送
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="right-side">
        <div className="panel-card">
          <div className="panel-title">💌 消息说明</div>
          <div className="panel-body">
            · 这里显示别人给你发的消息<br />
            · 点击任意会话即可查看并回复<br />
            · 点击右上角「📨 模拟接收」可模拟收到新消息<br />
            · 消息会保存在本机浏览器中
          </div>
        </div>
        <div className="panel-card">
          <div className="panel-title">✨ 聊天小贴士</div>
          <div className="panel-body">
            打招呼、聊共同爱好更容易开启话题哦<br />
            遇到感兴趣的人，主动出击准没错！
          </div>
        </div>
        <FooterLinks />
      </div>
    </div>
  );
}

