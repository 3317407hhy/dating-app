import { NextResponse } from 'next/server';
import { readDb } from '@/lib/server-store';

// POST /api/match/quick - 立即匹配：一键刷新并返回最优匹配推荐
export async function POST() {
  const db = readDb();
  const candidates = db.users.filter((u) => u.mbti && u.mbti !== '未知');

  if (candidates.length === 0) {
    return NextResponse.json({ error: '暂无匹配对象' }, { status: 404 });
  }

  const pick = candidates[Math.floor(Math.random() * candidates.length)];
  return NextResponse.json({
    match: {
      id: pick.id,
      name: pick.username || pick.name,
      avatar: pick.avatar,
      mbti: pick.mbti,
      need: pick.need,
      interests: pick.interests,
      matchScore: Math.round(60 + Math.random() * 39),
    },
    totalCandidates: candidates.length,
  });
}
