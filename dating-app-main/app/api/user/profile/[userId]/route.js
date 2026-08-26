import { NextResponse } from 'next/server';
import { readDb, writeDb, safeUser } from '@/lib/server-store';

// GET /api/user/profile/[userId] - 获取用户主页信息
export async function GET(request, { params }) {
  const { userId } = params;
  const db = readDb();
  const user = db.users.find((u) => u.id === userId);
  if (!user) {
    return NextResponse.json({ error: '用户不存在' }, { status: 404 });
  }
  return NextResponse.json({
    user: {
      id: user.id,
      name: user.username || user.name,
      handle: user.handle,
      bio: user.bio || '',
      mbti: user.mbti,
      need: user.need,
      interests: user.interests,
      avatar: user.avatar,
      coverImage: '',
      joinDate: user.registeredAt,
    },
  });
}
