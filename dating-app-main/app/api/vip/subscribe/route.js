import { NextResponse } from 'next/server';
import { readDb, writeDb } from '@/lib/server-store';

// POST /api/vip/subscribe - 开通 VIP 会员
export async function POST(request) {
  const { plan, paymentMethod } = await request.json();

  if (!['monthly', 'quarterly', 'yearly'].includes(plan)) {
    return NextResponse.json({ error: '无效的套餐' }, { status: 400 });
  }

  const db = readDb();
  const userId = db.users[0] ? db.users[0].id : null;

  const durationMap = { monthly: 30, quarterly: 90, yearly: 365 };
  const expiresAt = new Date(Date.now() + durationMap[plan] * 24 * 3600000).toISOString();

  db.vip[userId] = {
    plan,
    paymentMethod: paymentMethod || 'demo',
    expiresAt,
    isActive: true,
  };
  writeDb(db);

  return NextResponse.json({ success: true, vipExpiresAt: expiresAt });
}
