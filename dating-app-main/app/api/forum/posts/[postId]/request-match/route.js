import { NextResponse } from 'next/server';
import { readDb, writeDb } from '@/lib/server-store';

// POST /api/forum/posts/[postId]/request-match - 从帖子申请与发帖人匹配
export async function POST(request, { params }) {
  const { postId } = params;
  const db = readDb();
  const post = db.posts.find((p) => p.id === postId);

  const matchId = 'm_' + Date.now().toString(36);
  db.matches.push({
    id: matchId,
    fromUserId: db.users[0] ? db.users[0].id : null,
    targetUserId: post ? post.userId : null,
    sourcePostId: postId,
    status: 'pending',
    createdAt: new Date().toISOString(),
  });
  writeDb(db);

  return NextResponse.json({ success: true, matchId });
}
