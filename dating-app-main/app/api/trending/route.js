import { NextResponse } from 'next/server';
import { trends } from '@/lib/data';

// GET /api/trending - 获取热门趋势
export async function GET() {
  return NextResponse.json({
    trends: trends.map((t) => ({
      category: t.category,
      name: t.name,
      count: t.count,
    })),
  });
}
