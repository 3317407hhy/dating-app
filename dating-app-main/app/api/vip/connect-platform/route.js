import { NextResponse } from 'next/server';
import { readDb, writeDb } from '@/lib/server-store';

// POST /api/vip/connect-platform - 接入第三方平台（Steam/Bangumi/网易云）
export async function POST(request) {
  const { platform, authCode } = await request.json();
  const allowed = ['steam', 'bangumi', 'anilist', 'netease', 'spotify'];

  if (!allowed.includes(platform)) {
    return NextResponse.json({ error: '不支持的平台' }, { status: 400 });
  }

  const db = readDb();
  const userId = db.users[0] ? db.users[0].id : 'guest';
  db.platformConnections = db.platformConnections || {};
  db.platformConnections[userId] = db.platformConnections[userId] || {};
  db.platformConnections[userId][platform] = {
    authCode,
    connectedAt: new Date().toISOString(),
  };
  writeDb(db);

  return NextResponse.json({
    success: true,
    profile: {
      platform,
      platformData: { username: 'demo_' + platform, level: 42 },
    },
  });
}
