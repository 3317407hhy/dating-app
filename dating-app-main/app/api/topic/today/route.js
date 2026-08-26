import { NextResponse } from 'next/server';
import { readDb } from '@/lib/server-store';
import { todayTopic } from '@/lib/data';

// GET /api/topic/today - 获取今日话题及实时投票数据
export async function GET() {
  const topic = todayTopic();
  const db = readDb();
  const hasVoted = db.votes.some(
    (v) => v.topicId === topic.id && v.userId === (db.users[0] ? db.users[0].id : null)
  );
  return NextResponse.json({ topic, hasVoted });
}
