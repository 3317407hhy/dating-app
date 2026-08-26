import { NextResponse } from 'next/server';
import { readDb, writeDb } from '@/lib/server-store';
import { chatTopics } from '@/lib/data';

// POST /api/chat/send-topic - 一键发送话题给匹配对象
export async function POST(request) {
  const { topicId, targetUserId } = await request.json();

  if (!topicId) {
    return NextResponse.json({ error: '缺少 topicId' }, { status: 400 });
  }

  const topic = chatTopics.find((t) => t.id === topicId);
  const text = topic ? topic.text : '今天过得怎么样呀？';

  const db = readDb();
  db.matches.push({
    id: 'm_' + Date.now().toString(36),
    fromUserId: db.users[0] ? db.users[0].id : null,
    targetUserId: targetUserId || null,
    message: text,
    status: 'sent',
    createdAt: new Date().toISOString(),
  });
  writeDb(db);

  return NextResponse.json({ success: true });
}
