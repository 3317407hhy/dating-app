import { NextResponse } from 'next/server';
import { readDb, writeDb } from '@/lib/server-store';

// POST /api/match/request - 向某用户发送匹配请求（打招呼）
export async function POST(request) {
  const { targetUserId, message } = await request.json();

  if (!targetUserId) {
    return NextResponse.json({ error: '缺少 targetUserId' }, { status: 400 });
  }

  const db = readDb();
  const target = db.users.find((u) => u.id === targetUserId);
  if (!target) {
    return NextResponse.json({ error: '目标用户不存在' }, { status: 404 });
  }

  const matchId = 'm_' + Date.now().toString(36);
  db.matches.push({
    id: matchId,
    fromUserId: db.users[0] ? db.users[0].id : null,
    targetUserId,
    message: message || '你好，想和你认识一下！',
    status: 'pending',
    createdAt: new Date().toISOString(),
  });
  writeDb(db);

  return NextResponse.json({ success: true, matchId });
}
