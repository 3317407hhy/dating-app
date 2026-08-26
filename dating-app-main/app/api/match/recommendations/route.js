import { NextResponse } from 'next/server';
import { readDb } from '@/lib/server-store';

// GET /api/match/recommendations - 获取匹配推荐用户列表
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const filter = searchParams.get('filter') || 'all';
  const limit = Math.min(Number(searchParams.get('limit')) || 20, 50);

  const db = readDb();
  let users = db.users.filter((u) => u.mbti && u.mbti !== '未知');

  if (filter === 'similar' && db.users[0] && db.users[0].mbti) {
    const first = db.users[0].mbti[0];
    users = users.filter((u) => u.mbti[0] === first);
  }
  if (filter === 'complement' && db.users[0] && db.users[0].mbti) {
    const first = db.users[0].mbti[0];
    users = users.filter((u) => u.mbti[0] !== first);
  }

  const result = users.slice(0, limit).map((u) => ({
    id: u.id,
    name: u.username || u.name,
    avatar: u.avatar,
    mbti: u.mbti,
    need: u.need,
    interests: u.interests,
    age: u.age,
    gender: u.gender,
    matchScore: Math.round(50 + Math.random() * 45),
  }));

  return NextResponse.json({ users: result, total: users.length });
}
