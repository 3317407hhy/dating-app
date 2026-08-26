import { NextResponse } from 'next/server';
import { readDb, writeDb } from '@/lib/server-store';

// GET /api/notifications - 获取用户通知
export async function GET() {
  const db = readDb();
  const userId = db.users[0] ? db.users[0].id : null;

  // 演示环境：没有通知时返回空列表
  const notifications = (db.notifications || []).filter(
    (n) => n.userId === userId
  );

  const unreadCount = notifications.filter((n) => !n.read).length;
  return NextResponse.json({ notifications, unreadCount });
}
