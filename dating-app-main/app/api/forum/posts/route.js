import { NextResponse } from 'next/server';
import { readDb, writeDb, safeUser } from '@/lib/server-store';
import { demoForumPosts } from '@/lib/data';

// GET /api/forum/posts - 获取论坛帖子列表
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const cat = searchParams.get('cat') || 'all';
  const sort = searchParams.get('sort') || 'hot';
  const page = Math.max(Number(searchParams.get('page')) || 1, 1);
  const limit = Math.min(Number(searchParams.get('limit')) || 20, 50);

  const db = readDb();
  let posts = [...db.posts];

  // 合并演示帖子（保证即使 db.json 是空的也有数据）
  if (posts.length === 0) {
    posts = demoForumPosts.map((p, i) => ({
      id: 'd' + i,
      userId: null,
      text: p.text,
      category: p.cat,
      tag: p.tag,
      isAnonymous: p.anonymous,
      silentMode: p.silent,
      likes: p.likes,
      comments: [],
      createdAt: new Date().toISOString(),
    }));
  }

  if (cat !== 'all') {
    posts = posts.filter((p) => p.category === cat);
  }

  const withCounts = posts.map((p) => ({
    id: p.id,
    text: p.text,
    tag: p.tag,
    cat: p.category,
    isAnon: p.isAnonymous,
    silent: p.silentMode,
    userId: p.userId,
    comments: (p.comments || []).length,
    likes: p.likes || 0,
    createdAt: p.createdAt,
  }));

  if (sort === 'new') {
    withCounts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  } else {
    withCounts.sort((a, b) => b.likes - a.likes);
  }

  const start = (page - 1) * limit;
  return NextResponse.json({
    posts: withCounts.slice(start, start + limit),
    total: withCounts.length,
  });
}

// POST /api/forum/posts - 发布帖子（支持匿名 / 只想倾诉）
export async function POST(request) {
  const { text, cat, tag, isAnon, silent } = await request.json();

  if (!text || !text.trim()) {
    return NextResponse.json({ error: '帖子内容不能为空' }, { status: 400 });
  }

  const db = readDb();
  const post = {
    id: 'p_' + Date.now().toString(36),
    userId: db.users[0] ? db.users[0].id : null,
    text,
    category: cat || 'social',
    tag: tag || '日常',
    isAnonymous: !!isAnon,
    silentMode: !!silent,
    likes: 0,
    comments: [],
    createdAt: new Date().toISOString(),
  };
  db.posts.push(post);
  writeDb(db);

  return NextResponse.json({
    success: true,
    post: {
      id: post.id,
      text: post.text,
      tag: post.tag,
      cat: post.category,
      isAnon: post.isAnonymous,
      silent: post.silentMode,
      comments: 0,
      likes: 0,
    },
  });
}
