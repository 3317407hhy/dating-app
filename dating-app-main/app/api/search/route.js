import { NextResponse } from 'next/server';
import { readDb, writeDb, genToken } from '@/lib/server-store';
import { matchUsers, demoForumPosts, chatTopics } from '@/lib/data';

// GET /api/search - 搜索用户 / 话题 / 帖子
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const q = (searchParams.get('q') || '').toLowerCase().trim();
  const type = searchParams.get('type') || 'all'; // all | users | topics | posts

  if (!q) {
    return NextResponse.json({ results: [], total: 0 });
  }

  const db = readDb();
  const results = [];

  // 用户
  const users = db.users.length ? db.users : matchUsers.map((u, i) => ({ ...u, id: u.id }));
  users.forEach((u) => {
    const name = (u.username || u.name || '').toLowerCase();
    const mbti = (u.mbti || '').toLowerCase();
    const interests = (u.interests || []).map((i) => i.toLowerCase());
    if (
      name.includes(q) ||
      mbti.includes(q) ||
      interests.some((i) => i.includes(q))
    ) {
      results.push({ type: 'users', data: u });
    }
  });

  // 帖子
  const posts = db.posts.length ? db.posts : demoForumPosts.map((p, i) => ({ ...p, id: 'd' + i }));
  posts.forEach((p) => {
    const text = (p.text || '').toLowerCase();
    const tag = (p.tag || '').toLowerCase();
    const cat = (p.category || p.cat || '').toLowerCase();
    if (text.includes(q) || tag.includes(q) || cat.includes(q)) {
      results.push({ type: 'posts', data: p });
    }
  });

  // 话题
  chatTopics.forEach((t) => {
    if ((t.text || '').toLowerCase().includes(q) || (t.tag || '').toLowerCase().includes(q)) {
      results.push({ type: 'topics', data: t });
    }
  });

  const filtered =
    type === 'users'
      ? results.filter((r) => r.type === 'users')
      : type === 'posts'
      ? results.filter((r) => r.type === 'posts')
      : type === 'topics'
      ? results.filter((r) => r.type === 'topics')
      : results;

  return NextResponse.json({ results: filtered.slice(0, 20), total: filtered.length });
}
