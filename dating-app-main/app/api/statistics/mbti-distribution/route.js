import { NextResponse } from 'next/server';
import { MBTI_LABELS } from '@/lib/data';

// GET /api/statistics/mbti-distribution - 获取平台 MBTI 类型分布
export async function GET() {
  const types = Object.keys(MBTI_LABELS);
  // 演示数据：随机生成分布
  const distribution = types.map((type, i) => {
    const base = [12, 8, 7, 6, 5, 10, 6, 7, 5, 4, 3, 3, 4, 5, 3, 3];
    const count = base[i] * 100;
    return { type, pct: base[i], count };
  });
  return NextResponse.json({ distribution });
}
