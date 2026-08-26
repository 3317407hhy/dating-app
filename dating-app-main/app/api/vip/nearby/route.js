import { NextResponse } from 'next/server';
import { readDb } from '@/lib/server-store';

// GET /api/vip/nearby - 附近会面推荐（达量启动，VIP 专属）
export async function GET() {
  const db = readDb();
  const totalNearby = db.users.length; // 演示环境：就是注册用户数

  // 同城用户需 ≥ 500 人才返回结果
  if (totalNearby < 500) {
    return NextResponse.json({
      users: [],
      sceneRecommendations: [],
      totalNearby,
      message: '同城用户未达 500 人，暂未开启',
    });
  }

  const users = db.users.slice(0, 10).map((u, i) => ({
    id: u.id,
    name: u.username || u.name,
    avatar: u.avatar,
    mbti: u.mbti,
    distance: (0.5 + i * 0.8).toFixed(1),
    commonInterests: (u.interests || []).slice(0, 3),
  }));

  return NextResponse.json({
    users,
    sceneRecommendations: [
      { type: '漫展', title: '周末漫展' },
      { type: '咖啡厅', title: '主题咖啡厅' },
    ],
    totalNearby,
  });
}
