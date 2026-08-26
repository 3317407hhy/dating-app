'use client';

import { NEED_MAP_SHORT } from '@/lib/data';

// ============================================================
// MatchCard - 匹配推荐卡片（可复用组件）
// ============================================================

export default function MatchCard({ user, onGreet }) {
  return (
    <div className="match-card">
      <div className="mc-avatar" style={{ background: user.avatar }}>
        {user.name.charAt(0)}
      </div>
      <div className="mc-info">
        <div className="mc-name">
          {user.name}
          <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>，{user.age}</span>
        </div>
        <div className="mc-mbti">{user.mbti} · {NEED_MAP_SHORT[user.need] || user.need}</div>
        <div className="mc-interests">
          {user.interests.map((i) => (
            <span key={i}>{i}</span>
          ))}
        </div>
      </div>
      <button className="mc-btn" onClick={() => onGreet && onGreet(user)}>
        打招呼
      </button>
    </div>
  );
}
