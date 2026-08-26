import { NextResponse } from 'next/server';
import { readDb, writeDb, safeUser } from '@/lib/server-store';

// PUT /api/user/profile - 编辑个人资料
export async function PUT(request) {
  const body = await request.json();
  const db = readDb();

  // 演示环境：默认更新第一个用户
  const user = db.users[0];
  if (!user) {
    return NextResponse.json({ error: '用户不存在' }, { status: 404 });
  }

  const allowed = ['name', 'bio', 'mbti', 'need', 'interests', 'gender'];
  allowed.forEach((key) => {
    if (body[key] !== undefined) {
      if (key === 'name') user.username = body[key];
      else user[key] = body[key];
    }
  });

  writeDb(db);
  return NextResponse.json({ success: true, user: safeUser(user) });
}
