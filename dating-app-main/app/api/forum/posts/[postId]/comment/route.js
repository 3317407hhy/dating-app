import { NextResponse } from 'next/server';
import { readDb, writeDb } from '@/lib/server-store';

// POST /api/forum/posts/[postId]/comment - 评论帖子
export async function POST(request, { params }) {
  const { postId } = params;
  const { text } = await request.json();

  if (!text || !text.trim()) {
    return NextResponse.json({ error: '评论内容不能为空' }, { status: 400 });
  }

  const db = readDb();
  const post = db.posts.find((p) => p.id === postId);
  if (!post) {
    return NextResponse.json({ error: '帖子不存在' }, { status: 404 });
  }

  const comment = {
    id: 'c_' + Date.now().toString(36),
    userId: db.users[0] ? db.users[0].id : null,
    text,
    createdAt: new Date().toISOString(),
  };
  post.comments = post.comments || [];
  post.comments.push(comment);
  writeDb(db);

  return NextResponse.json({ success: true, comment });
}
