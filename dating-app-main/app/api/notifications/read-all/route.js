import { NextResponse } from 'next/server';
import { readDb, writeDb } from '@/lib/server-store';

// POST /api/notifications/read-all - 标记所有通知为已读
export async function POST() {
  const db = readDb();
  const userId = db.users[0] ? db.users[0].id : null;

  (db.notifications || []).forEach((n) => {
    if (n.userId === userId) n.read = true;
  });
  writeDb(db);

  return NextResponse.json({ success: true });
}
