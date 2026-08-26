import { NextResponse } from 'next/server';
import { chatTopics } from '@/lib/data';

// GET /api/chat/topics - 获取聊天话题辅助建议列表
export async function GET() {
  return NextResponse.json({
    topics: chatTopics.map((t) => ({ id: t.id, tag: t.tag, text: t.text })),
    freeCount: 1,
    hasUsed: false,
  });
}
