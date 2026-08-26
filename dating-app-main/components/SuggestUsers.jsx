'use client';

import { suggestUsers } from '@/lib/data';
import { useToast } from './Toast';

// ============================================================
// SuggestUsers - 右侧栏「推荐关注」面板（可复用组件）
// ============================================================

export default function SuggestUsers() {
  const { showToast } = useToast();

  const follow = (name) => {
    showToast(`✅ 已关注 ${name}`);
  };

  return (
    <div className="panel-card">
      <div className="panel-title">推荐关注</div>
      {suggestUsers.map((u) => (
        <div
          key={u.id}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '8px 16px',
            borderBottom: '1px solid var(--border)',
          }}
        >
          <div className="u-avatar" style={{ width: 36, height: 36, fontSize: 13 }}>
            {u.name.charAt(0)}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 600 }}>{u.name}</div>
            <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>
              {u.handle} · {u.mbti}
            </div>
          </div>
          <button
            style={{
              padding: '4px 14px',
              borderRadius: 'var(--radius)',
              border: '1px solid var(--accent)',
              background: 'transparent',
              color: 'var(--accent)',
              fontSize: 11,
              fontWeight: 600,
              cursor: 'pointer',
            }}
            onClick={() => follow(u.name)}
          >
            关注
          </button>
        </div>
      ))}
      <div className="panel-footer">显示更多</div>
    </div>
  );
}
