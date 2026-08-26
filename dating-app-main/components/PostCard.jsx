'use client';

import { useRouter } from 'next/navigation';
import { useToast } from './Toast';

// ============================================================
// PostCard - 论坛帖子卡片（可复用组件）
// 在 首页论坛 / 话题页 / 搜索页 共用
// ============================================================

/** 把文本中的 #话题 转为可点击的 React 节点 */
export function linkTopics(txt, onTopicClick) {
  const parts = String(txt || '').split(/(#[\u4e00-\u9fa5A-Za-z0-9_·]+)/g);
  return parts.map((part, i) => {
    if (/^#[\u4e00-\u9fa5A-Za-z0-9_·]+$/.test(part)) {
      return (
        <span
          key={i}
          className="link-topic"
          onClick={(e) => {
            e.stopPropagation();
            if (onTopicClick) onTopicClick(part.slice(1));
          }}
        >
          {part}
        </span>
      );
    }
    return part;
  });
}

export default function PostCard({
  post,
  user,
  liked = false,
  commentCount = 0,
  onOpenComment,
  onToggleLike,
  showMatchAction = true,
}) {
  const router = useRouter();
  const { showToast } = useToast();

  const isAnon = post.anonymous || !(user && user.name);
  const who = isAnon ? '匿名用户' : user.name;
  const avatar = isAnon ? '?' : user.avatarChar || user.name.charAt(0);
  const tagName = (post.topic || post.tag || '日常').replace(/^#/, '');
  const likeCount = (post.likes || 0) + (liked ? 1 : 0);

  const openTopic = (topic) => {
    router.push(`/topic?topic=${encodeURIComponent(topic)}`);
  };

  return (
    <div className="post-card">
      <div className="pc-header">
        <div
          className="pc-avatar"
          style={{ background: 'linear-gradient(135deg,var(--accent),var(--purple))' }}
        >
          {avatar}
        </div>
        <span className="pc-anon">{who}</span>
        <span className="pc-tag" onClick={(e) => { e.stopPropagation(); openTopic(tagName); }}>
          #{tagName}
        </span>
      </div>
      <div className="pc-text">{linkTopics(post.text, openTopic)}</div>
      {post.silent && <div className="pc-silent">🌿 只想倾诉，不需要建议</div>}
      <div className="pc-actions">
        <span onClick={() => onOpenComment && onOpenComment(post)}>💬 {commentCount}</span>
        <span
          style={liked ? { color: 'var(--pink)' } : {}}
          onClick={() => onToggleLike && onToggleLike(post)}
        >
          ❤️ {likeCount}
        </span>
        {showMatchAction && (
          <span onClick={() => showToast('✅ 匹配请求已发送！')}>🤝 申请匹配</span>
        )}
      </div>
    </div>
  );
}
