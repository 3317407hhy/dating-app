'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import SearchBar from '@/components/SearchBar';
import TrendingPanel from '@/components/TrendingPanel';
import FooterLinks from '@/components/FooterLinks';
import PostCard from '@/components/PostCard';
import CommentModal from '@/components/CommentModal';
import { useToast } from '@/components/Toast';
import {
  getUser,
  getComments,
  getLiked,
  setLiked,
  getPendingPosts,
} from '@/lib/storage';
import { demoForumPosts } from '@/lib/data';

// 本页面依赖 URL 查询参数，使用动态渲染避免静态构建时的 Suspense 限制
export const dynamic = 'force-dynamic';

// ============================================================
// 话题页（原 话题.html）
// ============================================================

export default function TopicPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showToast } = useToast();

  const topic = (searchParams.get('topic') || '').trim().replace(/^#/, '');

  const [user, setUser] = useState({});
  const [posts, setPosts] = useState([]);
  const [likedMap, setLikedMap] = useState({});
  const [commentMap, setCommentMap] = useState({});
  const [commentPost, setCommentPost] = useState(null);

  useEffect(() => {
    const u = getUser();
    setUser(u);

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
    const all = userPosts.concat(demoForumPosts.map((p, i) => ({ ...p, id: 'd' + i })));
    setPosts(all);
    setLikedMap(getLiked());
    setCommentMap(getComments());
  }, []);

  const isLoggedIn = !!(user.name && user.email);

  const filteredPosts = useMemo(() => {
    if (!topic) return posts;
    const q = topic.toLowerCase();
    return posts.filter((p) => {
      const text = (p.text || '').toLowerCase();
      const tag = (p.tag || '').toLowerCase();
      const tp = (p.topic || '').toLowerCase();
      const cat = (p.cat || '').toLowerCase();
      return (
        tp === q || tp.indexOf(q) >= 0 || tag.indexOf(q) >= 0 || cat.indexOf(q) >= 0 ||
        text.indexOf('#' + q) >= 0 || text.indexOf(q) >= 0
      );
    });
  }, [posts, topic]);

  const goPublish = () => {
    router.push(topic ? `/publish?topic=${encodeURIComponent(topic)}` : '/publish');
  };

  const toggleLike = useCallback(
    (post) => {
      const liked = likedMap[post.id] || false;
      const next = { ...likedMap };
      if (liked) {
        delete next[post.id];
        showToast('💔 已取消点赞');
      } else {
        next[post.id] = true;
        showToast('✅ 已点赞！');
      }
      setLikedMap(next);
      setLiked(next);
    },
    [likedMap, showToast]
  );

  const submitComment = useCallback(
    (text) => {
      if (!commentPost) return;
      const key = commentPost.id;
      const next = { ...commentMap };
      next[key] = next[key] || [];
      next[key].push({ name: isLoggedIn ? user.name : '匿名用户', text, time: Date.now() });
      setCommentMap(next);
      // 同步到 localStorage（原 zx_comments 约定）
      try {
        const saved = JSON.parse(localStorage.getItem('zx_comments') || '{}');
        saved[key] = saved[key] || [];
        saved[key].push({ name: isLoggedIn ? user.name : '匿名用户', text, time: Date.now() });
        localStorage.setItem('zx_comments', JSON.stringify(saved));
      } catch (e) {
        /* ignore */
      }
      setCommentPost(null);
      showToast('✅ 评论已发布！');
    },
    [commentPost, commentMap, isLoggedIn, user.name, showToast]
  );

  return (
    <div className="app">
      <Sidebar active="topic" user={user} msgCount={0} />

      <div className="main">
        <div className="main-header">
          <button className="back-btn" onClick={() => router.push('/')}>
            ←
          </button>
          <span className="mh-title">{topic ? '#' + topic : '话题'}</span>
        </div>

        {filteredPosts.length === 0 ? (
          <div className="topic-empty">
            <div className="te-icon">🌵</div>
            <div>这个话题还没有内容</div>
            <div style={{ fontSize: 13, marginTop: 6 }}>来发布第一条相关内容吧！</div>
            <button className="te-btn" onClick={goPublish}>
              ✍️ 立即发布
            </button>
          </div>
        ) : (
          filteredPosts.map((p) => (
            <PostCard
              key={p.id}
              post={p}
              user={user}
              liked={!!likedMap[p.id]}
              commentCount={(commentMap[p.id] || []).length}
              onOpenComment={(post) => setCommentPost(post)}
              onToggleLike={toggleLike}
            />
          ))
        )}
      </div>

      <div className="right-side">
        <SearchBar placeholder="搜索话题或内容" />
        <TrendingPanel />
        <div className="panel-card">
          <div className="panel-title">关于话题</div>
          <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, padding: '0 16px 16px' }}>
            点击任意话题，即可查看所有用户发布的与该话题相关的内容。你也可以在发布页为动态添加话题标签。
          </div>
        </div>
        <FooterLinks />
      </div>

      <CommentModal
        post={commentPost}
        comments={commentPost ? commentMap[commentPost.id] || [] : []}
        onClose={() => setCommentPost(null)}
        onSubmit={submitComment}
      />
    </div>
  );
}
