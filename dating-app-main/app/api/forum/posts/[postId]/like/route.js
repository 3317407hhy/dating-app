import { NextResponse } from 'next/server';
import { readDb, writeDb } from '@/lib/server-store';

// POST /api/forum/posts/[postId]/like - 点赞帖子
export async function POST(request, { params }) {
  const { postId } = params;
  const db = readDb();
  const post = db.posts.find((p) => p.id === postId);

  if (!post) {
    // 允许对演示帖子点赞（不持久化）
    return NextResponse.json({ success: true, likes: 100 });
  }

  post.likes = (post.likes || 0) + 1;
  writeDb(db);
  return NextResponse.json({ success: true, likes: post.likes });
}
