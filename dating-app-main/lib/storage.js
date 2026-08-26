'use client';

// ============================================================
// 本地存储封装（与原「临时数据库」约定保持一致）
//   存数据：localStorage.setItem('zx_user', JSON.stringify(user))
//   读数据：localStorage.getItem('zx_user')
// ============================================================

const KEYS = {
  user: 'zx_user',
  messages: 'zx_messages',
  comments: 'zx_comments',
  liked: 'zx_liked',
  pendingPosts: 'zx_pendingPosts',
  msgAuto: 'zx_msg_auto',
};

/** 安全的读取 localStorage JSON（SSR / 解析失败时返回 fallback） */
export function getJSON(key, fallback) {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (e) {
    return fallback;
  }
}

/** 安全的写入 localStorage JSON */
export function setJSON(key, value) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, JSON.stringify(value));
}

/* ---- 用户 ---- */
export const getUser = () => getJSON(KEYS.user, {});
export const setUser = (user) => setJSON(KEYS.user, user);
export const removeUser = () => {
  if (typeof window !== 'undefined') localStorage.removeItem(KEYS.user);
};

/* ---- 消息会话 ---- */
export const getConversations = () => getJSON(KEYS.messages, []);
export const setConversations = (convs) => setJSON(KEYS.messages, convs);

/** 计算未读消息总数 */
export function getUnreadCount() {
  const convs = getConversations();
  return convs.reduce((n, c) => n + (c.unread || 0), 0);
}

/* ---- 帖子评论 / 点赞 ---- */
export const getComments = () => getJSON(KEYS.comments, {});
export const setComments = (comments) => setJSON(KEYS.comments, comments);
export const getLiked = () => getJSON(KEYS.liked, {});
export const setLiked = (liked) => setJSON(KEYS.liked, liked);

/* ---- 用户发布的帖子（待入库） ---- */
export const getPendingPosts = () => getJSON(KEYS.pendingPosts, []);
export const setPendingPosts = (posts) => setJSON(KEYS.pendingPosts, posts);

/** 把当前用户 + 用户发布的帖子合并成论坛完整帖子列表 */
export function getAllForumPosts() {
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
  return userPosts;
}

/** 判断是否已登录 */
export function isLoggedIn() {
  const u = getUser();
  return !!(u && u.name && u.email);
}
