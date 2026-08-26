'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from './Toast';

// ============================================================
// SearchBar - 右侧栏搜索框（可复用组件）
// 回车 / 点击 🔍 跳转到 /search?q=xxx
// ============================================================

export default function SearchBar({ placeholder = '搜索' }) {
  const [value, setValue] = useState('');
  const router = useRouter();
  const { showToast } = useToast();

  const doSearch = () => {
    const q = value.trim();
    if (q) {
      router.push(`/search?q=${encodeURIComponent(q)}`);
    } else {
      showToast('请输入搜索关键词');
    }
  };

  return (
    <div className="search-bar">
      <div className="search-bar-inner">
        <input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') doSearch();
          }}
        />
        <span className="search-icon" onClick={doSearch} title="搜索">
          🔍
        </span>
      </div>
    </div>
  );
}
