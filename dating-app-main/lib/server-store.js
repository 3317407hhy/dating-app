import fs from 'node:fs';
import path from 'node:path';
import { matchUsers, demoForumPosts, trends, suggestUsers, chatTopics } from './data';

// ============================================================
// 服务端临时数据库（Next.js 全栈 API 层使用）
// 说明：与前端 localStorage 演示数据不同，这里把数据落盘到
//       data/db.json（已加入 .gitignore）。正式接入 PostgreSQL
//       时，替换 readDb / writeDb 的实现即可。
// ============================================================

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

function seedUsers() {
  return matchUsers.map((u, i) => ({
    id: u.id,
    name: u.name,
    handle: '@' + u.name.toLowerCase() + '_' + (i + 1),
    email: 'user' + (i + 1) + '@echoz.com',
    password: '123456',
    bio: '',
    mbti: u.mbti,
    need: u.need,
    interests: u.interests,
    gender: u.gender,
    age: String(u.age),
    avatar: u.avatar,
    registeredAt: new Date().toISOString(),
  }));
}

function defaultDb() {
  return {
    users: seedUsers(),
    posts: demoForumPosts.map((p, i) => ({
      id: 'd' + i,
      userId: null,
      text: p.text,
      category: p.cat,
      tag: p.tag,
      isAnonymous: p.anonymous,
      silentMode: p.silent,
      likes: p.likes,
      comments: [],
      createdAt: new Date().toISOString(),
    })),
    matches: [],
    notifications: [],
    votes: [],
    vip: {},
    hobbyDetails: {},
    follows: {},
  };
}

export function readDb() {
  try {
    if (!fs.existsSync(DB_FILE)) return defaultDb();
    const parsed = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
    // 合并默认字段，避免老数据缺字段
    return { ...defaultDb(), ...parsed };
  } catch (e) {
    return defaultDb();
  }
}

export function writeDb(db) {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf8');
}

/* ---- 常用查询 ---- */
export function findUserById(db, id) {
  return db.users.find((u) => u.id === id);
}

export function findUserByEmail(db, email) {
  return db.users.find((u) => u.email === email);
}

/** 去掉敏感字段（password） */
export function safeUser(user) {
  if (!user) return null;
  const { password, ...rest } = user;
  return rest;
}

/** 简单生成演示 token */
export function genToken() {
  return 'demo_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 10);
}
