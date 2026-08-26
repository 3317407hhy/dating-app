import { NextResponse } from 'next/server';
import { readDb, safeUser, genToken } from '@/lib/server-store';

// POST /api/auth/login - 用户登录
export async function POST(request) {
  const { email, password } = await request.json();

  if (!email || !password) {
    return NextResponse.json({ error: '缺少邮箱或密码' }, { status: 400 });
  }

  const db = readDb();
  const user = db.users.find((u) => u.email === email && u.password === password);
  if (!user) {
    return NextResponse.json({ error: '邮箱或密码错误' }, { status: 401 });
  }

  return NextResponse.json({ token: genToken(), user: safeUser(user) });
}
