import { NextResponse } from 'next/server';
import { readDb, writeDb } from '@/lib/server-store';

// POST /api/user/follow/[userId] - 关注 / 取消关注用户
export async function POST(request, { params }) {
  const { userId } = params;
  const db = readDb();
  const currentUserId = db.users[0] ? db.users[0].id : null;

  if (!currentUserId) {
    return NextResponse.json({ error: '未登录' }, { status: 401 });
  }

  const key = currentUserId;
  db.follows[key] = db.follows[key] || [];
  const already = db.follows[key].includes(userId);

  if (already) {
    db.follows[key] = db.follows[key].filter((id) => id !== userId);
  } else {
    db.follows[key].push(userId);
  }

  writeDb(db);
  return NextResponse.json({ success: true, isFollowing: !already });
}
