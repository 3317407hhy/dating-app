'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import FooterLinks from '@/components/FooterLinks';
import { useToast } from '@/components/Toast';
import { getUser, getPendingPosts, setPendingPosts } from '@/lib/storage';

// 本页面依赖 URL 查询参数，使用动态渲染避免静态构建时的 Suspense 限制
export const dynamic = 'force-dynamic';

// ============================================================
// 发布页（原 发布.html）
// ============================================================

const TAG_OPTIONS = [
  { key: 'social', label: '日常闲聊' },
  { key: 'anime', label: '动漫' },
  { key: 'game', label: '游戏' },
  { key: 'cos', label: 'Cosplay' },
  { key: 'match', label: '交友' },
];

export default function PublishPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showToast } = useToast();

  const [user, setUser] = useState({});
  const [text, setText] = useState('');
  const [topic, setTopic] = useState('');
  const [cats, setCats] = useState([]);
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [fileName, setFileName] = useState('');
  const fileInputRef = useRef(null);

  // 支持从话题页跳转过来自动带上话题（?topic=xxx）
  useEffect(() => {
    const u = getUser();
    setUser(u);
    const t = (searchParams.get('topic') || '').trim().replace(/^#+/, '');
    if (t) setTopic('#' + t);
  }, [searchParams]);

  const toggleTag = (key) => {
    setCats((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const handleFileChange = (e) => {
    const file = e.target.files && e.target.files[0];
    setFileName(file ? file.name : '');
  };

  const submitPost = () => {
    const t = text.trim();
    if (!t) {
      showToast('请输入内容');
      return;
    }
    if (cats.length === 0) {
      showToast('请至少选择一个标签');
      return;
    }
    const topicVal = topic.trim().replace(/^#+/, '');
    const pendingPosts = getPendingPosts();
    pendingPosts.push({
      cats,
      text: t,
      tag: topicVal || '日常',
      topic: topicVal,
      silent: false,
      comments: 0,
      likes: 0,
      time: Date.now(),
      anonymous: isAnonymous,
    });
    setPendingPosts(pendingPosts);
    showToast('✅ 发布成功！');
    setTimeout(() => router.push('/'), 800);
  };

  const isLoggedIn = !!(user.name && user.email);

  return (
    <div className="app">
      <Sidebar active="" user={user} msgCount={0} />

      <div className="main">
        <div className="main-header">
          <button className="back-btn" onClick={() => router.push('/')}>
            ←
          </button>
          <span className="mh-title">发布动态</span>
          <button className="publish-btn" onClick={submitPost}>
            发布
          </button>
        </div>

        <div className="edit-field">
          <div className="ef-label">内容</div>
          <textarea
            placeholder="分享你的想法..."
            maxLength={500}
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </div>

        <div className="edit-field">
          <div className="ef-label">配图/视频（可选）</div>
          <div style={{ padding: '8px 0' }}>
            <button className="file-btn" onClick={() => fileInputRef.current && fileInputRef.current.click()}>
              📷 选择文件
            </button>
            <div className="file-name">{fileName || '未选择文件'}</div>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,video/*"
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />
        </div>

        <div className="edit-field">
          <div className="ef-label">标签（可多选）</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, padding: '8px 0' }}>
            {TAG_OPTIONS.map((t) => (
              <button
                key={t.key}
                className={`tag-btn${cats.includes(t.key) ? ' sel' : ''}`}
                onClick={() => toggleTag(t.key)}
              >
                {t.label}
              </button>
            ))}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 0' }}>
            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                cursor: 'pointer',
                fontSize: 14,
                color: 'var(--text)',
                userSelect: 'none',
              }}
            >
              <input
                type="checkbox"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
                style={{ width: 16, height: 16, cursor: 'pointer', accentColor: 'var(--accent)' }}
              />
              👤 匿名发布
            </label>
          </div>
        </div>

        <div className="edit-field">
          <div className="ef-label">话题（可选）</div>
          <input
            type="text"
            maxLength={30}
            placeholder="输入话题，如 #孤独摇滚"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />
        </div>

        <div style={{ textAlign: 'right', padding: 16 }}>
          <button
            className="post-btn"
            onClick={submitPost}
            style={{ display: 'inline-block', width: 'auto', margin: 0, padding: '12px 32px', fontSize: 16 }}
          >
            发布
          </button>
        </div>
      </div>

      <div className="right-side">
        <div className="panel-card">
          <div className="panel-title">发布提示</div>
          <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.8, padding: '0 16px 16px' }}>
            · 请遵守社区规范<br />· 请勿发布违规内容<br />· 违反规定的内容将被拦截
          </div>
        </div>
        <FooterLinks />
      </div>
    </div>
  );
}
