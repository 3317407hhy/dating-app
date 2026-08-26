import { NextResponse } from 'next/server';
import { readDb, writeDb, safeUser, genToken } from '@/lib/server-store';

// POST /api/auth/register - 用户注册
export async function POST(request) {
  const { email, username, password } = await request.json();

  if (!email || !username || !password) {
    return NextResponse.json({ error: '缺少参数' }, { status: 400 });
  }

  const db = readDb();
  if (db.users.some((u) => u.email === email)) {
    return NextResponse.json({ error: '该邮箱已被注册' }, { status: 409 });
  }

  const user = {
    id: 'usr_' + Date.now().toString(36),
    email,
    username,
    handle: '@' + username.replace(/\s/g, '').toLowerCase(),
    password,
    avatar: '',
    mbti: '未知',
    interests: [],
    need: '',
    gender: '',
    registeredAt: new Date().toISOString(),
  };
  db.users.push(user);
  writeDb(db);

  return NextResponse.json({ token: genToken(), user: safeUser(user) });
}
