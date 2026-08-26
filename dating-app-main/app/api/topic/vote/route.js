import { NextResponse } from 'next/server';
import { readDb, writeDb } from '@/lib/server-store';
import { todayTopic } from '@/lib/data';

// POST /api/topic/vote - 对今日话题投票
export async function POST(request) {
  const { topicId, optionId } = await request.json();

  if (!topicId || !optionId) {
    return NextResponse.json({ error: '缺少参数' }, { status: 400 });
  }

  const db = readDb();
  const userId = db.users[0] ? db.users[0].id : null;

  // 每人每话题只能投一票
  const existing = db.votes.find((v) => v.topicId === topicId && v.userId === userId);
  if (existing) {
    return NextResponse.json({ error: '已经投过票了' }, { status: 409 });
  }

  db.votes.push({ topicId, optionId, userId, createdAt: new Date().toISOString() });
  writeDb(db);

  // 返回更新后的分布
  const topic = todayTopic();
  return NextResponse.json({
    success: true,
    updatedDistribution: topic.options,
  });
}
