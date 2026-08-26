import { NextResponse } from 'next/server';
import { readDb } from '@/lib/server-store';

// POST /api/vip/compatibility-report - 生成相处预测报告（VIP 专属）
export async function POST(request) {
  const { targetUserId } = await request.json();

  const db = readDb();
  const target = db.users.find((u) => u.id === targetUserId);
  if (!target) {
    return NextResponse.json({ error: '目标用户不存在' }, { status: 404 });
  }

  const mbti = target.mbti || 'INFP';
  const score = Math.round(65 + Math.random() * 30);

  return NextResponse.json({
    report: {
      compatibilityScore: score,
      strengths: [
        '你们都喜欢二次元文化，有天然的共同话题',
        'MBTI 类型互补，相处起来比较新鲜有趣',
        `对方的 ${mbti} 人格在情感上比较细腻`,
      ],
      notes: [
        '建议从共同爱好开始聊起，比如最近看的番剧',
        '初次见面选择安静一点的咖啡厅比较合适',
      ],
      scenarios: [
        { title: '一起看番', score: 92 },
        { title: '一起打游戏', score: 85 },
        { title: '线下逛漫展', score: 78 },
      ],
    },
  });
}
