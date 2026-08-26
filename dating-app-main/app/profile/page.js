'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import FooterLinks from '@/components/FooterLinks';
import { useToast } from '@/components/Toast';
import { getUser, setUser, removeUser } from '@/lib/storage';
import {
  MBTI_LABELS,
  INTEREST_LABELS,
  GENDER_LABELS,
  AVATAR_COLORS,
} from '@/lib/data';

// ============================================================
// 个人主页（原 个人主页.html）
// ============================================================

const MBTIS = Object.keys(MBTI_LABELS);
const INTERESTS = Object.keys(INTEREST_LABELS);

const NEED_LABELS = {
  companion: { l: '陪伴型', i: '🤗' },
  partner: { l: '搭档型', i: '🤝' },
  attraction: { l: '吸引型', i: '✨' },
};

export default function ProfilePage() {
  const router = useRouter();
  const { showToast } = useToast();

  const [user, setUserData] = useState({});
  const [editOpen, setEditOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [listModal, setListModal] = useState(null); // { title, items }
  const [bio, setBio] = useState('');

  // 编辑表单
  const [editForm, setEditForm] = useState({
    name: '',
    bio: '',
    need: '',
    gender: '',
    age: '',
    height: '',
    mbti: '',
    interests: [],
  });

  useEffect(() => {
    const u = getUser();
    setUserData(u);
    setBio(u.bio || '');
  }, []);

  const notLoggedIn = !user.name || !user.email;

  const avatarChar = user.avatarChar || (user.name ? user.name.charAt(0) : '?');
  const handle = user.handle || '';
  const registeredAt = user.registeredAt ? new Date(user.registeredAt).toLocaleDateString() : '未知';

  /* ---------- 资料完整度 ---------- */
  const completeness = useMemo(() => {
    const u = user;
    const total = 8;
    let completed = 0;
    if (u.name && u.name.trim()) completed++;
    if (u.bio && u.bio.trim()) completed++;
    if (u.mbti && u.mbti !== '未知') completed++;
    if (u.need) completed++;
    if (u.interests && u.interests.length > 0) completed++;
    if (u.gender) completed++;
    if (u.age) completed++;
    if (u.height) completed++;
    return Math.round((completed / total) * 100);
  }, [user]);

  const completenessColor = completeness < 30 ? 'var(--red)' : completeness < 60 ? 'var(--pink)' : completeness < 80 ? 'var(--accent)' : 'var(--green)';

  /* ---------- 关注 / 访问 / 粉丝 ---------- */
  const followingList = user.followingUsers || [];
  const visitedList = user.visitedUsers || [];
  const fansList = user.fans || [];

  const openListModal = (title, items) => {
    setListModal({ title, items });
  };

  const makeItem = (name, handle, avatarChar) => {
    const c = avatarChar || (name ? name.charAt(0) : '?');
    const idx = name ? Math.abs(name.charCodeAt(0) || 0) % AVATAR_COLORS.length : 0;
    const h = handle || (name ? '@' + name : '');
    return { name, handle: h, avatarChar: c, color: AVATAR_COLORS[idx] };
  };

  const openFollowing = () => {
    if (followingList.length === 0) {
      openListModal('我的关注 (0)', []);
    } else {
      openListModal(
        '我的关注 (' + followingList.length + ')',
        followingList.map((f) => makeItem(f.name, f.handle, f.avatarChar))
      );
    }
  };

  const openVisited = () => {
    if (visitedList.length === 0) {
      openListModal('最近访问 (0)', []);
    } else {
      openListModal(
        '最近访问 (' + visitedList.length + ')',
        visitedList.map((f) => makeItem(f.name, f.handle, f.avatarChar))
      );
    }
  };

  const openFans = () => {
    if (fansList.length === 0) {
      openListModal('我的粉丝 (0)', []);
    } else {
      openListModal(
        '我的粉丝 (' + fansList.length + ')',
        fansList.map((f) => makeItem(f.name, f.handle, f.avatarChar))
      );
    }
  };

  /* ---------- 编辑资料 ---------- */
  const openEdit = () => {
    if (notLoggedIn) {
      showToast('请先登录');
      router.push('/auth');
      return;
    }
    setEditForm({
      name: (user.name || '').substring(0, 50),
      bio: (user.bio || '').substring(0, 160),
      need: user.need || '',
      gender: user.gender || '',
      age: user.age || '',
      height: user.height || '',
      mbti: user.mbti || '',
      interests: user.interests || [],
    });
    setEditOpen(true);
  };

  const toggleEditInterest = (key) => {
    setEditForm((f) => ({
      ...f,
      interests: f.interests.includes(key)
        ? f.interests.filter((i) => i !== key)
        : [...f.interests, key],
    }));
  };

  const saveProfile = () => {
    const updated = {
      ...user,
      name: editForm.name.trim() || user.name,
      bio: editForm.bio.trim(),
      need: editForm.need,
      gender: editForm.gender,
      age: editForm.age,
      height: editForm.height,
      mbti: editForm.mbti || user.mbti,
      interests: editForm.interests,
    };
    setUser(updated);
    setUserData(updated);
    setBio(editForm.bio.trim());
    setEditOpen(false);
    showToast('✅ 资料已保存');
  };

  /* ---------- 退出登录 ---------- */
  const handleLogout = () => {
    removeUser();
    router.push('/auth');
  };
  return (
    <div className="app">
      <Sidebar active="" user={user} msgCount={0} />

      <div className="main">
        <div className="main-header">个人资料</div>

        <div className="profile-header">
          <div className="profile-cover" />
          <div className="profile-avatar-wrap">
            <div className="profile-avatar">{notLoggedIn ? '?' : avatarChar}</div>
          </div>
        </div>

        <div className="profile-info">
          <div className="pi-name">{notLoggedIn ? '未登录' : user.name}</div>
          <div className="pi-handle">{notLoggedIn ? '' : handle}</div>
          <div className="pi-bio">{bio || '该用户什么都没留下'}</div>
          <div className="pi-meta">
            <span onClick={openFollowing}>
              {notLoggedIn ? '0 关注' : followingList.length + ' 关注'}
            </span>
            <span onClick={openVisited}>
              {notLoggedIn ? '已访问' : visitedList.length + ' 已访问'}
            </span>
            <span onClick={openFans}>
              {notLoggedIn ? '0 粉丝' : fansList.length + ' 粉丝'}
            </span>
          </div>
        </div>

        {notLoggedIn ? (
          <div className="profile-actions">
            <button
              className="primary"
              style={{ background: 'var(--accent)', color: '#fff', border: 'none' }}
              onClick={() => router.push('/auth')}
            >
              前往登录
            </button>
          </div>
        ) : (
          <div className="profile-actions">
            <button className="primary" onClick={openEdit}>
              编辑个人资料
            </button>
            <button style={{ borderColor: '#f4212e', color: '#f4212e' }} onClick={() => setConfirmOpen(true)}>
              退出登录
            </button>
          </div>
        )}

        <div className="section-title">资料完整度</div>
        <div className="profile-completeness">
          <div className="pc-bar-wrap">
            <div className="pc-bar-bg">
              <div className="pc-bar-fill" style={{ width: completeness + '%', background: completenessColor }} />
            </div>
            <span className="pc-pct">{completeness}%</span>
          </div>
          <div className="pc-tip">
            {completeness < 80 ? (
              <>
                完善资料至 <strong>80% 以上</strong>
                ，有利于更精准为您匹配喜欢的类型
              </>
            ) : (
              <>✅ 资料已完善，系统将为您精准匹配</>
            )}
          </div>
        </div>

        <div className="section-title">MBTI 类型</div>
        <div>
          {user.mbti && user.mbti !== '未知' ? (
            <div className="mbti-badge">
              <span className="mb-code">{user.mbti}</span>
              <span className="mb-label">{MBTI_LABELS[user.mbti] || ''}</span>
            </div>
          ) : (
            <div className="mbti-badge" style={{ opacity: 0.5 }}>
              <span className="mb-code">??</span>
              <span className="mb-label">未测试</span>
            </div>
          )}
        </div>

        <div className="section-title">个人信息</div>
        <div className="info-item">
          <span className="ii-label">年龄</span>
          <span className="ii-value">{user.age || '未设置'}</span>
        </div>
        <div className="info-item">
          <span className="ii-label">身高 (cm)</span>
          <span className="ii-value">{user.height || '未设置'}</span>
        </div>
        <div className="info-item">
          <span className="ii-label">邮箱</span>
          <span className="ii-value">{user.email || '未设置'}</span>
        </div>
        <div className="info-item">
          <span className="ii-label">性别</span>
          <span className="ii-value">{GENDER_LABELS[user.gender] || '未设置'}</span>
        </div>
        <div className="info-item">
          <span className="ii-label">注册时间</span>
          <span className="ii-value">{registeredAt}</span>
        </div>
        <div className="info-item">
          <span className="ii-label">恋爱需求</span>
          <span className="ii-value">
            {user.need ? (
              <span className={`need-badge ${user.need}`} style={{ margin: 0, fontSize: 12, padding: '3px 12px' }}>
                {NEED_LABELS[user.need].i} {NEED_LABELS[user.need].l}
              </span>
            ) : (
              '未设置'
            )}
          </span>
        </div>
        <div className="info-item" style={{ alignItems: 'flex-start' }}>
          <span className="ii-label" style={{ paddingTop: 4 }}>兴趣爱好</span>
          <span className="ii-value" style={{ display: 'flex', flexWrap: 'wrap', gap: 6, justifyContent: 'flex-end' }}>
            {user.interests && user.interests.length > 0 ? (
              user.interests.map((i) => (
                <span
                  key={i}
                  style={{ padding: '4px 10px', borderRadius: 9999, background: 'var(--bg-input)', fontSize: 12, color: 'var(--text-secondary)' }}
                >
                  {INTEREST_LABELS[i] || i}
                </span>
              ))
            ) : (
              '暂无'
            )}
          </span>
        </div>

        <div className="section-title">VIP 会员</div>
        <div className="vip-card">
          <div className="vc-title">开通 VIP 享受更多功能</div>
          <div className="vc-desc">
            · 爱好详细档案：填写最喜欢的番剧和游戏，精准匹配共同爱好<br />
            · 聊天话题辅助：无限次使用、自动生成话题<br />
            · 附近会面推荐：发现身边的同好<br />
            · 第三方平台展示：Steam/Bangumi/网易云<br />
            · 相处预测报告：深度分析你的恋爱模式
          </div>
          <div>
            <button className="vc-price" onClick={() => showToast('开通VIP成功！')}>
              开通 VIP · ¥30/月
            </button>
          </div>
        </div>

        <div className="section-title">附近会面推荐</div>
        <div className="nearby-section">
          <div className="ns-title">附近的兴趣相投的人</div>
          <div className="ns-desc">
            当前本地用户达到一定规模后开启此功能。建议同城用户达500人以上时启用。
          </div>
          <div>
            <span className="ns-badge"># 暂未开启</span>
            <span style={{ fontSize: 12, color: 'var(--text-secondary)', marginLeft: 8 }}>同城用户: 0人</span>
          </div>
        </div>
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

      {/* 列表弹窗（关注 / 访问 / 粉丝） */}
      <div
        className={`modal-overlay${listModal ? ' show' : ''}`}
        onClick={(e) => {
          if (e.target === e.currentTarget) setListModal(null);
        }}
      >
        <div className="modal-box" style={{ maxWidth: 500 }}>
          <div className="modal-header">
            <button onClick={() => setListModal(null)}>✕</button>
            <span className="mh-title">{listModal ? listModal.title : '列表'}</span>
          </div>
          <div className="modal-body" style={{ maxHeight: 400, overflowY: 'auto', padding: 0 }}>
            {listModal && listModal.items.length > 0 ? (
              listModal.items.map((it, i) => (
                <div className="user-list-item" key={i}>
                  <div className="uli-avatar" style={{ background: it.color }}>
                    {it.avatarChar}
                  </div>
                  <div className="uli-info">
                    <div className="uli-name">{it.name}</div>
                    <div className="uli-handle">{it.handle}</div>
                  </div>
                </div>
              ))
            ) : (
              <div className="user-list-empty">
                <div className="ule-icon">🔍</div>
                <div>这里还是空的</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 编辑资料弹窗 */}
      <div
        className={`modal-overlay${editOpen ? ' show' : ''}`}
        onClick={(e) => {
          if (e.target === e.currentTarget) setEditOpen(false);
        }}
      >
        <div className="modal-box">
          <div className="modal-header">
            <button onClick={() => setEditOpen(false)}>✕</button>
            <span className="mh-title">编辑个人资料</span>
            <button className="mh-save" onClick={saveProfile}>
              保存
            </button>
          </div>
          <div className="modal-body">
            <div className="edit-field">
              <div className="ef-label">昵称</div>
              <input
                maxLength={50}
                value={editForm.name}
                onChange={(e) => setEditForm((f) => ({ ...f, name: e.target.value }))}
              />
            </div>
            <div className="edit-field">
              <div className="ef-label">个人简介</div>
              <textarea
                maxLength={160}
                placeholder="介绍一下你自己吧..."
                value={editForm.bio}
                onChange={(e) => setEditForm((f) => ({ ...f, bio: e.target.value }))}
              />
            </div>
            <div className="edit-field">
              <div className="ef-label">MBTI 类型</div>
              <div className="ef-mbti-grid">
                {MBTIS.map((m) => (
                  <button
                    key={m}
                    className={editForm.mbti === m ? 'sel' : ''}
                    onClick={() => setEditForm((f) => ({ ...f, mbti: m }))}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>
            <div className="edit-field">
              <div className="ef-label">恋爱需求</div>
              <select
                value={editForm.need}
                onChange={(e) => setEditForm((f) => ({ ...f, need: e.target.value }))}
              >
                <option value="">未设置</option>
                <option value="companion">陪伴型</option>
                <option value="partner">搭档型</option>
                <option value="attraction">吸引型</option>
              </select>
            </div>
            <div className="edit-field">
              <div className="ef-label">兴趣领域（多选）</div>
              <div className="ef-tags">
                {INTERESTS.map((i) => (
                  <button
                    key={i}
                    className={editForm.interests.includes(i) ? 'sel' : ''}
                    onClick={() => toggleEditInterest(i)}
                  >
                    {INTEREST_LABELS[i] || i}
                  </button>
                ))}
              </div>
            </div>
            <div className="edit-field">
              <div className="ef-label">性别</div>
              <select
                value={editForm.gender}
                onChange={(e) => setEditForm((f) => ({ ...f, gender: e.target.value }))}
              >
                <option value="">未设置</option>
                <option value="male">男</option>
                <option value="female">女</option>
                <option value="other">其他</option>
              </select>
            </div>
            <div className="edit-field">
              <div className="ef-label">年龄</div>
              <select
                value={editForm.age}
                onChange={(e) => setEditForm((f) => ({ ...f, age: e.target.value }))}
              >
                <option value="">未设置</option>
                <option value="18">18岁以下</option>
                <option value="18-22">18-22岁</option>
                <option value="23-27">23-27岁</option>
                <option value="28-32">28-32岁</option>
                <option value="33-40">33-40岁</option>
                <option value="40+">40岁以上</option>
              </select>
            </div>
            <div className="edit-field">
              <div className="ef-label">身高 (cm)</div>
              <select
                value={editForm.height}
                onChange={(e) => setEditForm((f) => ({ ...f, height: e.target.value }))}
              >
                <option value="">未设置</option>
                <option value="150以下">150以下</option>
                <option value="150-155">150-155</option>
                <option value="156-160">156-160</option>
                <option value="161-165">161-165</option>
                <option value="166-170">166-170</option>
                <option value="171-175">171-175</option>
                <option value="176-180">176-180</option>
                <option value="181-185">181-185</option>
                <option value="186-190">186-190</option>
                <option value="190以上">190以上</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* 退出登录确认弹窗 */}
      <div
        className={`modal-overlay confirm-overlay${confirmOpen ? ' show' : ''}`}
        onClick={(e) => {
          if (e.target === e.currentTarget) setConfirmOpen(false);
        }}
      >
        <div className="modal-box" onClick={(e) => e.stopPropagation()}>
          <div className="modal-title">退出 EchoZshsamber？</div>
          <div className="modal-desc">
            退出登录后，你需要重新登录才能查看你的个人资料和匹配信息。
          </div>
          <div className="modal-actions">
            <button className="modal-btn danger" onClick={handleLogout}>
              退出
            </button>
            <button className="modal-btn cancel" onClick={() => setConfirmOpen(false)}>
              取消
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

