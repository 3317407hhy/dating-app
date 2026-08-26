import { NextResponse } from 'next/server';

// POST /api/auth/logout - 退出登录
// 演示环境 token 无状态，直接返回成功；正式接入 Redis/JWT 黑名单后可扩展
export async function POST() {
  return NextResponse.json({ success: true });
}
