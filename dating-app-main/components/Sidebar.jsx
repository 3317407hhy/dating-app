'use client';

import { useRouter } from 'next/navigation';
import Logo from './Logo';

// ============================================================
// Sidebar - 全局左侧导航栏（可复用组件）
// props:
//   active    - 'explore' | 'forum' | 'topic' | 'messages' | 其他
//   user      - 当前用户对象
//   msgCount  - 未读消息数（消息导航徽标）
//   onHomeTab - 可选的首页 tab 切换回调（首页传入）
// ============================================================

const NAV_ITEMS = [
  { key: 'explore', icon: '🔍', label: '探索', homeTab: 'matching' },
  { key: 'forum', icon: '💬', label: '社区', homeTab: 'forum' },
  { key: 'topic', icon: '🔥', label: '话题', href: '/topic' },
  { key: 'messages', icon: '💌', label: '消息', href: '/messages' },
];

export default function Sidebar({ active, user, msgCount = 0, onHomeTab }) {
  const router = useRouter();
  const isLoggedIn = !!(user && user.name && user.email);

  const handleNav = (item) => {
    // 首页内部切换「探索 / 社区」两个 tab
    if ((item.key === 'explore' || item.key === 'forum') && onHomeTab) {
      onHomeTab(item.homeTab);
      return;
    }
    if (item.href) {
      router.push(item.href);
    } else if (item.homeTab) {
      router.push('/');
    }
  };

  const userName = isLoggedIn ? user.name : '未登录';
  const userHandle = isLoggedIn ? user.handle || '' : '点击登录';
  const avatarChar = isLoggedIn ? user.avatarChar || user.name.charAt(0) : '?';

  return (
    <div className="sidebar">
      <div className="side-logo" onClick={() => router.push('/')}>
        <Logo />
      </div>
      <ul className="nav-list">
        {NAV_ITEMS.map((item) => (
          <li
            key={item.key}
            className={`nav-item${active === item.key ? ' active' : ''}`}
            onClick={() => handleNav(item)}
          >
            <span className="ni">{item.icon}</span>
            {item.label}
            {item.key === 'messages' && msgCount > 0 && (
              <span className="msg-badge">{msgCount > 9 ? '9+' : msgCount}</span>
            )}
          </li>
        ))}
      </ul>
      <button className="post-btn" onClick={() => router.push('/publish')}>
        发布
      </button>
      <div className="user-menu" onClick={() => router.push(isLoggedIn ? '/profile' : '/auth')}>
        <div className="u-avatar">{avatarChar}</div>
        <div className="u-info">
          <div className="u-name">{userName}</div>
          <div className="u-handle">{userHandle}</div>
        </div>
      </div>
    </div>
  );
}
