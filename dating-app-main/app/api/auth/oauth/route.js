import { NextResponse } from 'next/server';

// POST /api/auth/oauth - 第三方登录（微信/QQ/B站）
export async function POST(request) {
  const { provider, code } = await request.json();

  if (!['wechat', 'qq', 'bilibili'].includes(provider) || !code) {
    return NextResponse.json({ error: '参数错误' }, { status: 400 });
  }

  // 演示环境：第三方登录后直接生成一个演示用户
  const providers = {
    wechat: { name: '微信用户', handle: '@wechat_' + code.slice(0, 4) },
    qq: { name: 'QQ用户', handle: '@qq_' + code.slice(0, 4) },
    bilibili: { name: 'B站用户', handle: '@bili_' + code.slice(0, 4) },
  };

  const user = {
    id: 'oauth_' + Date.now().toString(36),
    email: provider + '_' + code + '@oauth.echoz.com',
    username: providers[provider].name,
    handle: providers[provider].handle,
    password: '',
    avatar: '',
    mbti: '未知',
    interests: [],
    need: '',
    registeredAt: new Date().toISOString(),
  };

  return NextResponse.json({
    token: 'demo_' + Date.now().toString(36),
    user,
  });
}
