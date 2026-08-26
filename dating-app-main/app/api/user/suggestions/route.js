import { NextResponse } from 'next/server';
import { readDb } from '@/lib/server-store';
import { suggestUsers } from '@/lib/data';

// GET /api/user/suggestions - 获取推荐关注用户
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const limit = Math.min(Number(searchParams.get('limit')) || 3, 10);

  const db = readDb();
  const users = db.users.length ? db.users : suggestUsers;

  return NextResponse.json({
    users: users.slice(0, limit).map((u) => ({
      id: u.id,
      name: u.username || u.name,
      handle: u.handle,
      mbti: u.mbti,
      avatar: u.avatar,
    })),
  });
}
