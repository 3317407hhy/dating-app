import { NextResponse } from 'next/server';
import { readDb, safeUser } from '@/lib/server-store';

// GET /api/auth/me - 获取当前登录用户信息
// 演示环境：通过 Authorization: Bearer demo_xxx 解析
export async function GET(request) {
  const auth = request.headers.get('authorization') || '';
  const token = auth.replace(/^Bearer\s+/i, '');

  if (!token || !token.startsWith('demo_')) {
    return NextResponse.json({ error: '未登录' }, { status: 401 });
  }

  // 演示环境返回第一个用户作为当前用户（token 无状态）
  const db = readDb();
  const user = db.users[0];
  if (!user) {
    return NextResponse.json({ error: '用户不存在' }, { status: 404 });
  }

  return NextResponse.json({ user: safeUser(user) });
}
