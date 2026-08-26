'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import PostCard from '@/components/PostCard';
import FooterLinks from '@/components/FooterLinks';
import { useToast } from '@/components/Toast';
import {
  getUser,
  getComments,
  getLiked,
  getPendingPosts,
} from '@/lib/storage';
import { demoForumPosts, matchUsers, NEED_MAP } from '@/lib/data';

// 本页面依赖 URL 查询参数，使用动态渲染避免静态构建时的 Suspense 限制
export const dynamic = 'force-dynamic';

// ============================================================
// 搜索页（原 搜索.html）
// ============================================================

export default function SearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showToast } = useToast();

  const [user, setUser] = useState({});
  const [cMap, setCMap] = useState({});
  const [lMap, setLMap] = useState({});
  const [type, setType] = useState('post'); // 'post' | 'user'

  const query = (searchParams.get('q') || '').trim();
  const typeParam = searchParams.get('type');

  // 初始化本地状态
  useEffect(() => {
    setUser(getUser());
    setCMap(getComments());
    setLMap(getLiked());
  }, []);

  const activeType = typeParam === 'user' || typeParam === 'post' ? typeParam : type;

  const results = useMemo(() => {
    if (!query) return [];
    const q = query.toLowerCase();
    const pending = getPendingPosts();
    const userPosts = pending.map((p, i) => ({
      id: 'u' + i + '_' + (p.time || 0),
      cat: p.cats && p.cats.length ? p.cats[0] : 'social',
      text: p.text,
      tag: p.tag || '日常',
      topic: p.topic || '',
      silent: !!p.silent,
      anonymous: !!p.anonymous,
      comments: 0,
      likes: p.likes || 0,
    }));
    const forumPosts = userPosts.concat(demoForumPosts.map((p, i) => ({ ...p, id: 'd' + i })));

    const list = [];

    // 搜索帖子
    forumPosts.forEach((p) => {
      if (
        (p.text || '').toLowerCase().includes(q) ||
        (p.tag || '').toLowerCase().includes(q) ||
        (p.cat || '').toLowerCase().includes(q)
      ) {
        list.push({ type: 'post', data: p });
      }
    });

    // 搜索用户（名称 / MBTI / 兴趣）
    matchUsers.forEach((u) => {
      if (
        u.name.toLowerCase().includes(q) ||
        u.mbti.toLowerCase().includes(q)
      ) {
        list.push({ type: 'user', data: u });
      } else if (
        u.interests.some((i) => i.toLowerCase().includes(q))
      ) {
        list.push({ type: 'user', data: u });
      }
    });

    if (activeType === 'post') return list.filter((r) => r.type === 'post');
    if (activeType === 'user') return list.filter((r) => r.type === 'user');
    return list;
  }, [query, activeType]);

  const setSearchType = (t) => {
    setType(t);
    // 通过 query 保持类型，方便刷新后保留
    const base = '/search?q=' + encodeURIComponent(query);
    router.push(base + (t !== 'post' ? '&type=' + t : ''));
  };

  const isLoggedIn = !!(user.name && user.email);

  const renderResult = (r) => {
    if (r.type === 'post') {
      const p = r.data;
      return (
        <PostCard
          key={p.id}
          post={p}
          user={user}
          liked={!!lMap[p.id]}
          commentCount={(cMap[p.id] || []).length}
          showMatchAction={false}
        />
      );
    }
    // 用户卡片
    const u = r.data;
    return (
      <div className="post-card" key={u.id}>
        <div className="pc-header">
          <div className="pc-avatar" style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)' }}>
            {u.name.charAt(0)}
          </div>
          <span style={{ fontWeight: 600, fontSize: 14 }}>{u.name}</span>
          <span className="pc-tag">{u.mbti}</span>
        </div>
        <div style={{ fontSize: 13, color: 'var(--text-secondary)', margin: '4px 0' }}>
          {NEED_MAP[u.need]} · {u.interests.join('、')}
        </div>
      </div>
    );
  };

  return (
    <div className="app">
      <Sidebar active="" user={user} msgCount={0} />

      <div className="main">
        <div className="main-header">
          <button className="back-btn" onClick={() => router.push('/')}>
            ←
          </button>
          <span>搜索结果{query ? `: ${query}` : ''}</span>
        </div>

        <div className="search-type-bar">
          <button
            className={`st-btn${activeType === 'post' ? ' active' : ''}`}
            onClick={() => setSearchType('post')}
          >
            话题
          </button>
          <button
            className={`st-btn${activeType === 'user' ? ' active' : ''}`}
            onClick={() => setSearchType('user')}
          >
            用户
          </button>
        </div>

        {!query.trim() ? (
          <div className="search-empty">
            <div className="se-icon">🔍</div>
            <div>请输入搜索关键词</div>
          </div>
        ) : results.length === 0 ? (
          <div className="search-empty">
            <div className="se-icon">😕</div>
            <div>
              未找到与{' '}
              <strong style={{ color: 'var(--text)' }}>"{query}"</strong>{' '}
              相关的内容
            </div>
            <div style={{ fontSize: 13, marginTop: 8 }}>请尝试其他关键词</div>
          </div>
        ) : (
          <>
            <div className="search-result-count">
              找到 <strong>{results.length}</strong> 条结果
            </div>
            {results.map(renderResult)}
          </>
        )}
      </div>

      <div className="right-side">
        <div className="panel-card">
          <div className="panel-title">关于</div>
          <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, padding: '0 16px 16px' }}>
            此处为测试版本，所有数据存储在浏览器本地。
          </div>
        </div>
        <FooterLinks />
      </div>
    </div>
  );
}
