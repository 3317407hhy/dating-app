# EchoZshsamber · 二次元社恐友好匹配

由纯 HTML 页面迁移为 **React + Next.js** 的全栈应用。

- **React**：负责构建可复用的用户界面组件（侧边栏、帖子卡片、匹配卡片、Toast、弹窗等）
- **Next.js**：作为 React 的全栈框架，提供文件路由 + `app/api` 后端接口层

---

## 🚀 快速开始（推荐：双击启动）

> **直接双击项目根目录的 `启动.bat` 即可！**

项目已经内置了**免安装版 Node.js**（`nodejs/` 文件夹，无需手动安装）。
`启动.bat` 会自动完成：使用内置 Node → 自动安装依赖（首次）→ 启动开发服务器 → **自动打开浏览器**。

以后每次想运行，双击 `启动.bat` 即可，就像打开 html 一样简单。

> 💡 **备用脚本**：项目根目录还有一个英文名的 **`start.bat`**，功能完全相同。
> 如果双击 `启动.bat` 提示"不是运行程序"或打不开，可以：
> - 改双击 **`start.bat`**，或
> - 右键 `启动.bat` → 打开方式 → 选择 **Windows 命令处理程序**，或
> - 在资源管理器地址栏输入 `cmd` 回车，然后输入 `start.bat` 回车

### 手动命令方式（可选）

```bash
npm install     # 安装依赖
npm run dev     # 启动开发服务器，访问 http://localhost:3000
```

> 如果手动执行提示 `node` 不存在，说明系统 PATH 里没有 Node——项目自带版在 `nodejs\` 目录，
> 可直接用 `nodejs\node.exe` / `nodejs\npm.cmd` 替代命令中的 `node` / `npm`。

> **为什么不能像 html 一样直接双击打开？**
> 原 HTML 是静态文件，浏览器直接解析；而 React/Next.js 源码含 JSX 语法、
> 模块引用（import）、React 运行时和 API 服务，必须由 Node.js 编译运行后才能访问。
> 这就是"一键启动脚本"存在的原因 —— 它帮你完成了这些工作。

---

## 页面路由对照（原 HTML → 新路由）

| 原文件 | 新路由 | 说明 |
|---|---|---|
| `主页.html` | `/` | 首页（探索匹配 + 社区论坛） |
| `发布.html` | `/publish` | 发布动态 |
| `搜索.html` | `/search` | 搜索用户 / 话题 |
| `注册登录.html` | `/auth` | 注册 / 登录 |
| `消息.html` | `/messages` | 私信会话 |
| `话题.html` | `/topic` | 话题聚合页 |
| `个人主页.html` | `/profile` | 个人资料 |

原 `.html` 文件已整理到 `旧版HTML参考/` 文件夹中作为参考（未删除）。

---

## 项目结构

```
├── app/                    # Next.js App Router
│   ├── layout.js           # 根布局（全局样式 + Toast Provider）
│   ├── page.js             # 首页 /
│   ├── globals.css         # 全局样式（合并自原各页面 <style>）
│   ├── publish/            # 发布页
│   ├── search/             # 搜索页
│   ├── auth/               # 注册登录页
│   ├── messages/           # 消息页
│   ├── topic/              # 话题页
│   ├── profile/            # 个人主页
│   └── api/                # 后端 API 路由（Next.js 全栈层）
├── components/             # 可复用 React 组件
│   ├── Sidebar.jsx         # 全局侧边栏导航
│   ├── PostCard.jsx        # 帖子卡片（首页/话题/搜索共用）
│   ├── MatchCard.jsx       # 匹配推荐卡片
│   ├── CommentModal.jsx    # 评论弹窗
│   ├── ChatHelper.jsx      # 话题辅助浮窗
│   ├── SearchBar.jsx       # 搜索框
│   ├── TrendingPanel.jsx   # 正在发生面板
│   ├── SuggestUsers.jsx    # 推荐关注面板
│   ├── LoginGate.jsx       # 未登录引导
│   ├── FooterLinks.jsx     # 底部链接
│   ├── Logo.jsx            # 品牌 Logo SVG
│   └── Toast.jsx           # 全局 Toast（Context）
├── lib/
│   ├── storage.js          # 前端 localStorage 封装（与原 zx_ 约定一致）
│   ├── data.js             # 演示数据（纯数据，前后端共用）
│   └── server-store.js     # 服务端临时数据库（data/db.json 落盘）
└── data/                   # API 层生成的 db.json（已加入 .gitignore）
```

---

## 数据说明

### 前端（演示用，沿用原 localStorage 约定）

| Key | 用途 |
|---|---|
| `zx_user` | 当前登录用户 |
| `zx_messages` | 私信会话列表 |
| `zx_comments` | 帖子评论（key 为帖子 id） |
| `zx_liked` | 帖子点赞记录 |
| `zx_pendingPosts` | 用户发布的帖子（待入库） |
| `zx_msg_auto` | 首次访问模拟消息标记 |

### 后端 API（Next.js 全栈层）

`app/api/**` 实现了 API 接口文档中的全部端点，数据落盘在 `data/db.json`
（替换为 PostgreSQL 时只需改写 `lib/server-store.js` 中的 `readDb / writeDb`）。

常用接口：

```
POST /api/auth/register      注册
POST /api/auth/login         登录
POST /api/auth/logout        退出登录
GET  /api/auth/me            当前用户信息
POST /api/auth/oauth         第三方登录
GET  /api/user/profile/:id   用户主页信息
PUT  /api/user/profile       编辑资料
GET  /api/match/recommendations   匹配推荐
POST /api/match/quick        立即匹配
POST /api/match/request      打招呼
GET  /api/forum/posts        帖子列表
POST /api/forum/posts        发布帖子
POST /api/forum/posts/:id/like         点赞
POST /api/forum/posts/:id/comment      评论
GET  /api/search             搜索
GET  /api/topic/today        今日话题
POST /api/topic/vote         话题投票
GET  /api/chat/topics        话题辅助
GET  /api/trending           趋势
GET  /api/user/suggestions   推荐关注
POST /api/user/follow/:id    关注/取关
GET  /api/notifications      通知
...（完整列表见 前后端对接内容/API接口文档.txt）
```

浏览器中可直接测试：`http://localhost:3000/api/trending`

---

## 主要迁移点

1. **DOM 操作 → React 状态**：`getElementById / innerHTML` 改为 `useState` 声明式渲染
2. **事件绑定 → React 事件**：`onclick` 改为 `onClick` 事件处理器
3. **页面跳转 → Next.js 路由**：`window.location.href='xx.html'` 改为 `router.push('/xx')`
4. **重复代码 → 可复用组件**：侧边栏、帖子卡片、匹配卡片、评论弹窗等抽成公共组件
5. **多页面样式 → 单一全局样式**：`app/globals.css` 合并了所有页面的 `<style>`
