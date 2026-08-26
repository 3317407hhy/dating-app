'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Logo from '@/components/Logo';
import { useToast } from '@/components/Toast';
import { getUser, setUser } from '@/lib/storage';

// 本页面依赖 URL 查询参数，使用动态渲染避免静态构建时的 Suspense 限制
export const dynamic = 'force-dynamic';

// ============================================================
// 注册 / 登录页（原 注册登录.html）
// ============================================================

const MBTI_OPTIONS = [
  { code: 'INTJ', label: '建筑师' }, { code: 'INTP', label: '逻辑学家' },
  { code: 'ENTJ', label: '指挥官' }, { code: 'ENTP', label: '辩论家' },
  { code: 'INFJ', label: '提倡者' }, { code: 'INFP', label: '调停者' },
  { code: 'ENFJ', label: '主人公' }, { code: 'ENFP', label: '竞选者' },
  { code: 'ISTJ', label: '物流师' }, { code: 'ISFJ', label: '守卫者' },
  { code: 'ESTJ', label: '总经理' }, { code: 'ESFJ', label: '执政官' },
  { code: 'ISTP', label: '鉴赏家' }, { code: 'ISFP', label: '探险家' },
  { code: 'ESTP', label: '企业家' }, { code: 'ESFP', label: '表演者' },
];

const INTEREST_OPTIONS = [
  { key: 'anime', label: '动漫' }, { key: 'game', label: '游戏' },
  { key: 'cos', label: 'Cosplay' }, { key: 'music', label: '音乐' },
  { key: 'art', label: '绘画' }, { key: 'novel', label: '轻小说' },
  { key: 'vtuber', label: 'V Tuber' }, { key: 'film', label: '影视' },
];

const NEED_OPTIONS = [
  { key: 'companion', icon: '🤗', title: '陪伴型', desc: '需要有人每天在，渴望日常陪伴和分享' },
  { key: 'partner', icon: '🤝', title: '搭档型', desc: '希望一起成长、互相帮助，共同进步' },
  { key: 'attraction', icon: '✨', title: '吸引型', desc: '外表对我很重要，希望第一眼就心动' },
];

export default function AuthPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showToast } = useToast();

  /* ---------- 登录 ---------- */
  const [tab, setTab] = useState(searchParams.get('tab') === 'register' ? 'register' : 'login');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginErrors, setLoginErrors] = useState({ email: false, password: false });
  const [loginLoading, setLoginLoading] = useState(false);

  /* ---------- 注册 ---------- */
  const [step, setStep] = useState(1);
  const [regData, setRegData] = useState({
    name: '',
    email: '',
    password: '',
    gender: '',
    mbti: '',
    mbtiUnknown: false,
    interests: [],
    need: '',
  });
  const [regVerifyCode, setRegVerifyCode] = useState('');
  const [verifyCode, setVerifyCode] = useState('');
  const [verifyCountdown, setVerifyCountdown] = useState(0);
  const [regLoading, setRegLoading] = useState(false);
  const verifyTimerRef = useRef(null);

  /* ---------- 粒子背景 ---------- */
  useEffect(() => {
    const container = document.getElementById('bgParticles');
    if (!container) return;
    for (let i = 0; i < 30; i++) {
      const p = document.createElement('div');
      p.className = 'particle';
      p.style.left = Math.random() * 100 + '%';
      p.style.animationDuration = (12 + Math.random() * 20) + 's';
      p.style.animationDelay = Math.random() * 15 + 's';
      p.style.width = p.style.height = (2 + Math.random() * 4) + 'px';
      container.appendChild(p);
    }
    return () => {
      container.innerHTML = '';
    };
  }, []);

  /* ---------- 登录处理 ---------- */
  const handleLogin = (e) => {
    e.preventDefault();
    const em = loginEmail.trim();
    const pw = loginPassword;
    const errs = { email: false, password: false };
    let hasError = false;

    if (!em || !em.includes('@')) {
      errs.email = true;
      hasError = true;
    }
    if (!pw) {
      errs.password = true;
      hasError = true;
    }
    setLoginErrors(errs);
    if (hasError) return;

    setLoginLoading(true);
    setTimeout(() => {
      const saved = getUser();
      if (saved && saved.email) {
        if (saved.email === em) {
          const updated = { ...saved, lastLogin: new Date().toISOString() };
          setUser(updated);
          showToast('✅ 登录成功！');
          setTimeout(() => router.push('/'), 1000);
        } else {
          setLoginLoading(false);
          showToast('⚠️ 账号不存在，请先注册', 'error');
        }
      } else {
        // 演示环境：没有账号时自动创建一个
        const nu = {
          name: em.split('@')[0],
          email: em,
          password: pw,
          handle: '@user_' + Math.random().toString(36).slice(2, 6),
          mbti: '未知',
          interests: [],
          need: '',
          avatarChar: em.charAt(0).toUpperCase(),
        };
        setUser(nu);
        showToast('✅ 登录成功！');
        setTimeout(() => router.push('/'), 1000);
      }
    }, 1500);
  };

  /* ---------- 验证码 ---------- */
  const sendVerifyCode = () => {
    const email = regData.email.trim();
    if (!email || !email.includes('@')) {
      showToast('请先输入有效邮箱', 'error');
      return;
    }
    if (verifyCountdown > 0) {
      showToast(`请${verifyCountdown}秒后再试`, 'error');
      return;
    }
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setVerifyCode(code);
    showToast(`验证码已发送到 ${email}（测试环境验证码：${code}）`);
    setVerifyCountdown(60);
    const timer = setInterval(() => {
      setVerifyCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    verifyTimerRef.current = timer;
  };

  useEffect(() => {
    return () => {
      if (verifyTimerRef.current) clearInterval(verifyTimerRef.current);
    };
  }, []);

  /* ---------- 注册步骤 ---------- */
  const nextStep = (n) => {
    if (step === 1) {
      const { name, email, password, gender } = regData;
      if (!name.trim()) return showToast('请输入昵称', 'error');
      if (!email.trim() || !email.includes('@')) return showToast('请输入有效邮箱', 'error');
      if (password.length < 6) return showToast('密码至少6位', 'error');
      if (!gender) return showToast('请选择性别', 'error');
      if (!verifyCode) return showToast('请先获取邮箱验证码', 'error');
      if (regVerifyCode !== verifyCode) return showToast('验证码错误，请重新输入', 'error');
    }
    if (step === 2 && !regData.mbti && !regData.mbtiUnknown) {
      return showToast('请选择MBTI类型或跳过', 'error');
    }
    setStep(n);
  };

  const prevStep = (n) => setStep(n);

  /* ---------- 注册提交 ---------- */
  const handleRegister = () => {
    if (!regData.need) {
      showToast('请选择你的恋爱需求类型', 'error');
      return;
    }
    setRegLoading(true);
    const ud = {
      name: regData.name,
      email: regData.email,
      password: regData.password,
      gender: regData.gender,
      mbti: regData.mbti || '未知',
      mbtiUnknown: regData.mbtiUnknown,
      interests: regData.interests,
      need: regData.need,
      handle: '@' + regData.name.replace(/\s/g, '').toLowerCase() + Math.random().toString(36).slice(2, 5),
      avatarChar: regData.name.charAt(0),
      registeredAt: new Date().toISOString(),
    };
    setUser(ud);
    setTimeout(() => {
      setRegLoading(false);
      showToast('✅ 注册成功！正在跳转…');
      setTimeout(() => router.push('/'), 1200);
    }, 1500);
  };

  const switchTab = (t) => {
    setTab(t);
  };

  return (
    <div style={{ width: '100%', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div className="bg-particles" id="bgParticles" />
      <div className="container">
        <div className="logo-area">
          <div className="logo-svg">
            <Logo size={52} idPrefix="auth-" />
          </div>
          <div className="logo-title">EchoZshsamber</div>
          <div className="logo-sub">二次元 · 低压力 · 精准匹配</div>
        </div>

        <div className="auth-card">
          <div className="auth-tabs">
            <button className={`auth-tab${tab === 'login' ? ' active' : ''}`} onClick={() => switchTab('login')}>
              登录
            </button>
            <button className={`auth-tab${tab === 'register' ? ' active' : ''}`} onClick={() => switchTab('register')}>
              注册
            </button>
          </div>

          {/* 登录面板 */}
          <div className={`auth-panel${tab !== 'login' ? ' hidden' : ''}`}>
            <div className="card-title">欢迎回来</div>
            <div className="card-subtitle">登录你的 EchoZ 账号</div>
            <form onSubmit={handleLogin}>
              <div className="form-group">
                <label className="form-label">邮箱 / 手机号</label>
                <input
                  className={`form-input${loginErrors.email ? ' error' : ''}`}
                  type="text"
                  placeholder="请输入邮箱或手机号"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                />
                <div className={`error-msg${loginErrors.email ? ' show' : ''}`}>请输入有效的邮箱或手机号</div>
              </div>
              <div className="form-group">
                <label className="form-label">密码</label>
                <input
                  className={`form-input${loginErrors.password ? ' error' : ''}`}
                  type="password"
                  placeholder="请输入密码"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                />
                <div className={`error-msg${loginErrors.password ? ' show' : ''}`}>请输入密码</div>
              </div>
              <button className="btn-primary" type="submit" disabled={loginLoading}>
                {loginLoading ? <span className="spinner" /> : null}
                {loginLoading ? '登录中…' : '登录'}
              </button>
            </form>
            <button className="btn-secondary" onClick={() => switchTab('register')}>
              还没有账号？立即注册
            </button>
          </div>

          {/* 注册面板 */}
          <div className={`auth-panel${tab !== 'register' ? ' hidden' : ''}`}>
            {/* 第 1 步：基本信息 */}
            <div className={`onboarding-step${step === 1 ? ' active' : ''}`}>
              <div className="step-indicators">
                <div className="step-dot active"></div>
                <div className="step-dot"></div>
                <div className="step-dot"></div>
              </div>
              <div className="card-title">创建账号</div>
              <div className="card-subtitle">填写基本信息开始你的 EchoZ 之旅</div>
              <div className="form-group">
                <label className="form-label">昵称</label>
                <input
                  className="form-input"
                  type="text"
                  placeholder="你希望别人怎么称呼你？"
                  value={regData.name}
                  onChange={(e) => setRegData((d) => ({ ...d, name: e.target.value }))}
                />
              </div>
              <div className="form-group">
                <label className="form-label">邮箱</label>
                <input
                  className="form-input"
                  type="email"
                  placeholder="zx@example.com"
                  value={regData.email}
                  onChange={(e) => setRegData((d) => ({ ...d, email: e.target.value }))}
                />
              </div>
              <div className="form-group">
                <label className="form-label">邮箱验证码</label>
                <div style={{ display: 'flex', gap: 8 }}>
                  <input
                    className="form-input"
                    type="text"
                    placeholder="请输入验证码"
                    style={{ flex: 1 }}
                    value={regVerifyCode}
                    onChange={(e) => setRegVerifyCode(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={sendVerifyCode}
                    disabled={verifyCountdown > 0}
                    style={{
                      padding: '16px 14px',
                      border: '1px solid var(--border)',
                      borderRadius: 4,
                      background: 'transparent',
                      color: 'var(--accent)',
                      fontSize: 13,
                      fontWeight: 600,
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      fontFamily: 'inherit',
                      transition: 'all .2s',
                    }}
                  >
                    {verifyCountdown > 0 ? `重新发送(${verifyCountdown})` : '发送验证码'}
                  </button>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">密码</label>
                <input
                  className="form-input"
                  type="password"
                  placeholder="至少6位密码"
                  value={regData.password}
                  onChange={(e) => setRegData((d) => ({ ...d, password: e.target.value }))}
                />
              </div>
              <div className="form-group">
                <label className="form-label">性别</label>
                <div style={{ display: 'flex', gap: 8 }}>
                  {[
                    { v: 'male', t: '♂ 男生' },
                    { v: 'female', t: '♀ 女生' },
                  ].map((g) => (
                    <button
                      key={g.v}
                      type="button"
                      className={`mbti-option${regData.gender === g.v ? ' selected' : ''}`}
                      style={{ flex: 1 }}
                      onClick={() => setRegData((d) => ({ ...d, gender: g.v }))}
                    >
                      {g.t}
                    </button>
                  ))}
                </div>
              </div>
              <button type="button" className="btn-primary" style={{ marginTop: 8 }} onClick={() => nextStep(2)}>
                下一步
              </button>
            </div>

            {/* 第 2 步：MBTI + 兴趣 */}
            <div className={`onboarding-step${step === 2 ? ' active' : ''}`}>
              <div className="step-indicators">
                <div className="step-dot done"></div>
                <div className="step-dot active"></div>
                <div className="step-dot"></div>
              </div>
              <div className="card-title">你的 MBTI 类型</div>
              <div className="card-subtitle">用于精准匹配，没测过可以跳过</div>
              <div className="mbti-grid">
                {MBTI_OPTIONS.map((m) => (
                  <button
                    key={m.code}
                    type="button"
                    className={`mbti-option${regData.mbti === m.code ? ' selected' : ''}`}
                    onClick={() => setRegData((d) => ({ ...d, mbti: m.code, mbtiUnknown: false }))}
                  >
                    <span className="mbti-code">{m.code}</span>
                    <span className="mbti-label">{m.label}</span>
                  </button>
                ))}
              </div>
              <button
                type="button"
                className={`btn-secondary${regData.mbtiUnknown ? ' selected' : ''}`}
                onClick={() =>
                  setRegData((d) => ({ ...d, mbti: '', mbtiUnknown: true }))
                }
              >
                我不知道我的 MBTI
              </button>
              <div style={{ marginTop: 20 }}>
                <div className="form-label" style={{ marginBottom: 8 }}>你的兴趣领域（可多选）</div>
                <div className="interest-tags">
                  {INTEREST_OPTIONS.map((i) => (
                    <button
                      key={i.key}
                      type="button"
                      className={`interest-tag${regData.interests.includes(i.key) ? ' selected' : ''}`}
                      onClick={() =>
                        setRegData((d) => ({
                          ...d,
                          interests: d.interests.includes(i.key)
                            ? d.interests.filter((k) => k !== i.key)
                            : [...d.interests, i.key],
                        }))
                      }
                    >
                      {i.label}
                    </button>
                  ))}
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8, marginTop: 20 }}>
                <button type="button" className="btn-secondary" style={{ flex: 1 }} onClick={() => prevStep(1)}>
                  ← 上一步
                </button>
                <button type="button" className="btn-primary" style={{ flex: 1 }} onClick={() => nextStep(3)}>
                  下一步 →
                </button>
              </div>
            </div>

            {/* 第 3 步：恋爱需求 */}
            <div className={`onboarding-step${step === 3 ? ' active' : ''}`}>
              <div className="step-indicators">
                <div className="step-dot done"></div>
                <div className="step-dot done"></div>
                <div className="step-dot active"></div>
              </div>
              <div className="card-title">你的恋爱需求</div>
              <div className="card-subtitle">选择你想要的相处方式</div>
              <div className="need-options">
                {NEED_OPTIONS.map((n) => (
                  <div
                    key={n.key}
                    className={`need-option${regData.need === n.key ? ' selected' : ''}`}
                    onClick={() => setRegData((d) => ({ ...d, need: n.key }))}
                  >
                    <div className="n-icon">{n.icon}</div>
                    <div className="n-title">{n.title}</div>
                    <div className="n-desc">{n.desc}</div>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', gap: 8, marginTop: 20 }}>
                <button type="button" className="btn-secondary" style={{ flex: 1 }} onClick={() => prevStep(2)}>
                  ← 上一步
                </button>
                <button type="button" className="btn-primary" style={{ flex: 1 }} onClick={handleRegister} disabled={regLoading}>
                  {regLoading ? <span className="spinner" /> : null}
                  {regLoading ? '注册中…' : '完成注册'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

