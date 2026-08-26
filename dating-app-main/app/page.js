'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import SearchBar from '@/components/SearchBar';
import TrendingPanel from '@/components/TrendingPanel';
import SuggestUsers from '@/components/SuggestUsers';
import FooterLinks from '@/components/FooterLinks';
import LoginGate from '@/components/LoginGate';
import PostCard from '@/components/PostCard';
import MatchCard from '@/components/MatchCard';
import ChatHelper from '@/components/ChatHelper';
import { useToast } from '@/components/Toast';
import {
  getUser,
  getComments,
  getLiked,
  setLiked,
  getPendingPosts,
  getUnreadCount,
} from '@/lib/storage';
import { matchUsers, demoForumPosts, sheetData } from '@/lib/data';

// ============================================================
// 主页（原 主页.html）
//   - 探索 tab：匹配推荐 + 筛选
//   - 社区 tab：论坛帖子列表
// ============================================================

const FORUM_CATS = [
  { key: 'all', label: '全部' },
  { key: 'anime', label: '动漫' },
  { key: 'game', label: '游戏' },
  { key: 'cos', label: 'Cos' },
  { key: 'social', label: '日常' },
  { key: 'match', label: '交友' },
];

export default function HomePage() {
  const router = useRouter();
  const { showToast } = useToast();

  const [user, setUser] = useState({});
  const [tab, setTab] = useState('matching');
  const [msgCount, setMsgCount] = useState(0);

  // 匹配筛选
  const [filterState, setFilterState] = useState({
    interest: '不限',
    ageMin: '',
    ageMax: '',
    region: '不限',
  });
  const [showFilter, setShowFilter] = useState(false);
  const [sheetKey, setSheetKey] = useState(null); // 'interest' | 'region' | null

  // 论坛
  const [forumCat, setForumCat] = useState('all');
  const [posts, setPosts] = useState([]);
  const [likedMap, setLikedMap] = useState({});
  const [commentMap, setCommentMap] = useState({});
  const [commentPost, setCommentPost] = useState(null);

  useEffect(() => {
    const u = getUser();
    setUser(u);
    setMsgCount(getUnreadCount());

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
    const allPosts = demoForumPosts.map((p, i) => ({ ...p, id: 'd' + i })).concat(userPosts);
    setPosts(allPosts);
    setLikedMap(getLiked());
    setCommentMap(getComments());
  }, []);

  const isLoggedIn = !!(user.name && user.email);

  /* ---------- 侧栏切换首页 tab ---------- */
  const handleHomeTab = useCallback((t) => {
    setTab(t);
  }, []);

  /* ---------- 匹配列表（含筛选） ---------- */
  const matches = useMemo(() => {
    let items = [...matchUsers];
    if (filterState.interest && filterState.interest !== '不限') {
      items = items.filter((u) => u.interests.includes(filterState.interest));
    }
    if (filterState.ageMin || filterState.ageMax) {
      items = items.filter((u) => {
        if (filterState.ageMin && filterState.ageMax) {
          return u.age >= +filterState.ageMin && u.age <= +filterState.ageMax;
        }
        if (filterState.ageMin) return u.age >= +filterState.ageMin;
        return u.age <= +filterState.ageMax;
      });
    }
    if (filterState.region && filterState.region !== '不限') {
      items = items.filter((u) => u.region === filterState.region);
    }
    return items;
  }, [filterState]);

  const greet = (u) => {
    showToast(`✅ 已发送匹配请求给 ${u.name}`);
  };

  /* ---------- 论坛帖子 ---------- */
  const forumPosts = useMemo(() => {
    if (forumCat === 'all') return posts;
    return posts.filter((p) => p.cat === forumCat);
  }, [posts, forumCat]);

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
      // 评论同步存进 localStorage（原 zx_comments 约定）
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

  /* ---------- 筛选弹窗 ---------- */
  const openSheet = (key) => setSheetKey(key);
  const closeSheet = () => setSheetKey(null);
  const pickSheet = (key, value) => {
    setFilterState((s) => ({ ...s, [key]: value }));
    setSheetKey(null);
  };
  const resetFilter = () => {
    setFilterState({ interest: '不限', ageMin: '', ageMax: '', region: '不限' });
    showToast('已重置筛选条件');
  };
  const applyFilter = () => {
    setShowFilter(false);
    showToast('已应用筛选条件');
  };

  /* ---------- 立即匹配 ---------- */
  const quickMatch = () => {
    if (!isLoggedIn) {
      router.push('/auth');
      return;
    }
    setTab('matching');
    showToast('✨ 已为你刷新匹配推荐');
    setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 200);
  };

  const activeSheet = sheetKey ? sheetData[sheetKey] : null;


  return (
    <div className="app">
      <Sidebar
        active={tab === 'matching' ? 'explore' : tab === 'forum' ? 'forum' : ''}
        user={user}
        msgCount={msgCount}
        onHomeTab={handleHomeTab}
      />

      <div className="main">
        <div className="main-header justify-space">
          <span>{tab === 'matching' ? '🔍' : '💬'}</span>
          <span>{tab === 'matching' ? '匹配推荐' : '论坛社区'}</span>
          {tab === 'matching' && (
            <button className="header-filter-btn" onClick={() => setShowFilter(true)}>
              筛选 ▾
            </button>
          )}
        </div>

        {!isLoggedIn && <LoginGate desc="登录即可发现和你兴趣相投的二次元朋友" />}

        {/* 探索 / 匹配推荐 */}
        <div className={`tab-content${tab === 'matching' ? ' active' : ''}`}>
          <div className="tab-pad">
            <div className="match-grid">
              {isLoggedIn &&
                matches.map((u) => (
                  <MatchCard key={u.id} user={u} onGreet={greet} />
                ))}
            </div>
          </div>
        </div>

        {/* 社区 / 论坛 */}
        <div className={`tab-content${tab === 'forum' ? ' active' : ''}`}>
          <div className="forum-cats">
            {FORUM_CATS.map((c) => (
              <button
                key={c.key}
                className={`forum-cat${forumCat === c.key ? ' active' : ''}`}
                onClick={() => setForumCat(c.key)}
              >
                {c.label}
              </button>
            ))}
          </div>
          <div>
            {isLoggedIn &&
              forumPosts.map((p) => (
                <PostCard
                  key={p.id}
                  post={p}
                  user={user}
                  liked={!!likedMap[p.id]}
                  commentCount={(commentMap[p.id] || []).length}
                  onOpenComment={(post) => setCommentPost(post)}
                  onToggleLike={toggleLike}
                />
              ))}
          </div>
        </div>
      </div>

      {/* 右侧栏 */}
      <div className="right-side">
        <SearchBar />
        <TrendingPanel />
        {isLoggedIn && <SuggestUsers />}
        <div className="panel-card">
          <div className="panel-title">⚡ 快速操作</div>
          <div style={{ padding: '0 16px 16px' }}>
            <button
              style={{
                width: '100%',
                padding: 12,
                borderRadius: 9999,
                border: 'none',
                background: 'linear-gradient(135deg,var(--accent),var(--accent-hover))',
                color: '#fff',
                fontSize: 15,
                fontWeight: 700,
                cursor: 'pointer',
                fontFamily: 'inherit',
                transition: 'opacity .2s',
              }}
              onClick={quickMatch}
            >
              ✨ 立即匹配
            </button>
          </div>
        </div>
        <FooterLinks showCookie />
      </div>

      {/* 话题辅助 */}
      <ChatHelper />


      {/* 筛选弹窗 */}
      <div
        className={`filter-overlay${showFilter ? ' show' : ''}`}
        onClick={(e) => {
          if (e.target === e.currentTarget) setShowFilter(false);
        }}
      >
        <div className="filter-modal">
          <div className="fmh">
            <span>筛选交友对象</span>
            <button onClick={() => setShowFilter(false)}>×</button>
          </div>
          <div className="f-row">
            <div className="f-label">兴趣领域</div>
            <button
              className={`f-pick${filterState.interest !== '不限' ? ' selected' : ''}`}
              onClick={() => openSheet('interest')}
            >
              {filterState.interest} ▾
            </button>
          </div>
          <div className="f-row">
            <div className="f-label">年龄</div>
            <div className="f-age-range">
              <input
                type="number"
                className="f-input"
                placeholder="最小"
                min="18"
                max="99"
                value={filterState.ageMin}
                onChange={(e) => setFilterState((s) => ({ ...s, ageMin: e.target.value }))}
              />
              <span className="f-age-sep">-</span>
              <input
                type="number"
                className="f-input"
                placeholder="最大"
                min="18"
                max="99"
                value={filterState.ageMax}
                onChange={(e) => setFilterState((s) => ({ ...s, ageMax: e.target.value }))}
              />
            </div>
          </div>
          <div className="f-row">
            <div className="f-label">地区</div>
            <button
              className={`f-pick${filterState.region !== '不限' ? ' selected' : ''}`}
              onClick={() => openSheet('region')}
            >
              {filterState.region} ▾
            </button>
          </div>
          <div className="fmf">
            <button className="f-reset" onClick={resetFilter}>
              重置
            </button>
            <button className="f-apply" onClick={applyFilter}>
              应用筛选
            </button>
          </div>
        </div>
      </div>

      {/* 筛选底部选择弹层 */}
      <div
        className={`filter-sheet-overlay${sheetKey ? ' show' : ''}`}
        onClick={(e) => {
          if (e.target === e.currentTarget) closeSheet();
        }}
      >
        <div className="filter-sheet">
          <div className="fs-title">{activeSheet ? activeSheet.title : ''}</div>
          {activeSheet &&
            activeSheet.options.map((o) => (
              <button
                key={o.v}
                className={`fs-item${filterState[sheetKey] === o.v ? ' active' : ''}`}
                onClick={() => pickSheet(sheetKey, o.v)}
              >
                {o.t}
              </button>
            ))}
        </div>
      </div>
    </div>
  );
}

