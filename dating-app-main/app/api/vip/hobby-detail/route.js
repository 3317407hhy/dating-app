import { NextResponse } from 'next/server';
import { readDb, writeDb } from '@/lib/server-store';

// GET /api/vip/hobby-detail - 获取 VIP 爱好详细档案
export async function GET() {
  const db = readDb();
  const userId = db.users[0] ? db.users[0].id : 'guest';
  const detail = db.hobbyDetails[userId] || {
    anime: [],
    games: [],
    music: [],
    schedule: 'night',
    socialFrequency: 'daily',
  };
  return NextResponse.json(detail);
}

// PUT /api/vip/hobby-detail - 更新 VIP 爱好详细档案
export async function PUT(request) {
  const body = await request.json();
  const db = readDb();
  const userId = db.users[0] ? db.users[0].id : 'guest';
  db.hobbyDetails[userId] = { ...db.hobbyDetails[userId], ...body };
  writeDb(db);
  return NextResponse.json({ success: true });
}
