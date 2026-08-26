'use client';

import { useRouter } from 'next/navigation';
import { trends } from '@/lib/data';

// ============================================================
// TrendingPanel - 右侧栏「正在发生」趋势面板（可复用组件）
// ============================================================

export default function TrendingPanel({ showMore = true }) {
  const router = useRouter();

  const openTopic = (name) => {
    const topic = name.replace(/^#/, '');
    router.push(`/topic?topic=${encodeURIComponent(topic)}`);
  };

  return (
    <div className="panel-card">
      <div className="panel-title">正在发生</div>
      {trends.map((t) => (
        <div className="trend-item" key={t.name} onClick={() => openTopic(t.name)}>
          <div className="trend-cat">{t.category}</div>
          <div className="trend-name">{t.name}</div>
          <div className="trend-count">{t.count} 讨论</div>
        </div>
      ))}
      {showMore && (
        <div className="panel-footer" onClick={() => router.push('/topic')}>
          显示更多
        </div>
      )}
    </div>
  );
}
