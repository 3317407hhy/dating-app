// ============================================================
// 演示数据（与原各 HTML 内嵌数据保持一致）
// 该文件可被客户端组件与服务端 API 路由共同引用（纯数据，无 DOM）
// ============================================================

/* ---- 匹配推荐用户 ---- */
export const matchUsers = [
  { id: 'u1', name: '小夜', mbti: 'INFP', need: 'companion', interests: ['动漫', '音乐', '绘画'], avatar: 'linear-gradient(135deg,#f472b6,#ec4899)', gender: 'female', age: 22, region: '北京' },
  { id: 'u2', name: '星野', mbti: 'INFJ', need: 'partner', interests: ['游戏', '轻小说', 'V Tuber'], avatar: 'linear-gradient(135deg,#818cf8,#6366f1)', gender: 'female', age: 24, region: '上海' },
  { id: 'u3', name: '阿空', mbti: 'ENFP', need: 'companion', interests: ['动漫', 'Cosplay', '影视'], avatar: 'linear-gradient(135deg,#34d399,#10b981)', gender: 'male', age: 23, region: '广州' },
  { id: 'u4', name: '琉璃', mbti: 'INTJ', need: 'partner', interests: ['游戏', '音乐', '轻小说'], avatar: 'linear-gradient(135deg,#f59e0b,#d97706)', gender: 'female', age: 25, region: '深圳' },
  { id: 'u5', name: '晓', mbti: 'ISTP', need: 'attraction', interests: ['动漫', '游戏', 'Cosplay'], avatar: 'linear-gradient(135deg,#a78bfa,#7c3aed)', gender: 'male', age: 22, region: '成都' },
  { id: 'u6', name: '桃子', mbti: 'ENFJ', need: 'companion', interests: ['绘画', '音乐', '影视'], avatar: 'linear-gradient(135deg,#fb923c,#f97316)', gender: 'female', age: 21, region: '杭州' },
];

/* ---- 论坛示例帖子 ---- */
export const demoForumPosts = [
  { cat: 'anime', text: '刚看完无职转生第二季，父辈的故事太催泪了...', tag: '动漫讨论', topic: '动漫讨论', silent: false, comments: 0, likes: 56, anonymous: true },
  { cat: 'anime', text: '#孤独摇滚 第十二集真的封神！波奇的吉他solo太燃了🔥', tag: '孤独摇滚', topic: '孤独摇滚', silent: false, comments: 0, likes: 320, anonymous: true },
  { cat: 'game', text: '#原神 新版本地图设计太惊艳了，探索感拉满！', tag: '原神', topic: '原神', silent: false, comments: 0, likes: 210, anonymous: true },
  { cat: 'social', text: '#INFP日常 周末宅家看番打游戏，感觉这就是幸福...', tag: 'INFP日常', topic: 'INFP日常', silent: true, comments: 0, likes: 128, anonymous: true },
  { cat: 'social', text: '今天在公司群被@了，作为社恐直接原地消失...', tag: '社恐日常', topic: '社恐日常', silent: true, comments: 0, likes: 128, anonymous: true },
  { cat: 'game', text: '求推荐适合社恐人玩的联机游戏！', tag: '游戏求助', topic: '游戏求助', silent: false, comments: 0, likes: 89, anonymous: true },
  { cat: 'match', text: '我是INFP，想找一个ENFJ或者ENFP的朋友！', tag: '交友', topic: '交友', silent: false, comments: 0, likes: 72, anonymous: true },
  { cat: 'cos', text: '第一次去漫展出了cos，全程社恐但超开心！', tag: 'Cosplay', topic: 'Cosplay', silent: false, comments: 0, likes: 210, anonymous: true },
  { cat: 'anime', text: '有人看今年的四月新番吗？#新番推荐 求安利！', tag: '新番推荐', topic: '新番推荐', silent: false, comments: 0, likes: 134, anonymous: true },
  { cat: 'social', text: '聊了三个月的网友提出要见面，怎么办在线等！', tag: '社恐日常', topic: '社恐日常', silent: true, comments: 0, likes: 203, anonymous: true },
];

/* ---- 聊天话题辅助 ---- */
export const chatTopics = [
  { id: 't1', tag: '共同爱好', text: '你觉得《孤独摇滚》第几集是最高潮？' },
  { id: 't2', tag: '性格探索', text: '作为INFP，你有没有过突然不想回消息的时候？' },
  { id: 't3', tag: '轻松日常', text: '今天有没有什么让你觉得还挺开心的小事？' },
  { id: 't4', tag: '假设问题', text: '如果可以进入一部动漫的世界，你选哪个？' },
  { id: 't5', tag: '番剧推荐', text: '你最近在看什么番？' },
  { id: 't6', tag: '游戏话题', text: '打完一周目后觉得好空虚...' },
];

/* ---- 推荐关注 ---- */
export const suggestUsers = [
  { id: 's1', name: '小樱', handle: '@sakura_chan', mbti: 'ENFP' },
  { id: 's2', name: '阿杰', handle: '@jie_otaku', mbti: 'INTJ' },
  { id: 's3', name: 'Momo', handle: '@momo_paint', mbti: 'INFP' },
];

/* ---- 趋势 ---- */
export const trends = [
  { category: '动漫 · 趋势', name: '#孤独摇滚', count: '12.4万' },
  { category: '游戏 · 趋势', name: '#原神', count: '8.7万' },
  { category: 'MBTI · 趋势', name: '#INFP日常', count: '5.2万' },
  { category: '二次元 · 趋势', name: '#新番推荐', count: '3.8万' },
];

/* ---- 消息模拟池 ---- */
export const inboxPool = [
  { id: 'sakura', msgs: ['今晚八点一起看动画回放呀～', '我也养猫，你最近有看什么新番吗？', '你主页那句“二次元社恐”太真实了哈哈'] },
  { id: 'jie', msgs: ['刚打完周本，掉落不错！下次一起？', '你抽到新角色了吗？', '周末有空联机吗？'] },
  { id: 'momo', msgs: ['我新画了一张插画，想听听你的意见！', '你的作品真的很有氛围感', '要不要一起打卡画画？'] },
  { id: 'xye', msgs: ['我也超喜欢《孤独摇滚》！', '今天也在单曲循环乐队的歌', 'INFP抱团取暖哈哈'] },
  { id: 'xingye', name: '星野', handle: '@hoshi_23', mbti: 'INFJ', avatar: 'linear-gradient(135deg,#a78bfa,#7c3aed)', msgs: ['你好呀，看了你的主页觉得你很温柔～', '我们喜欢的番好像差不多，好巧！'] },
  { id: 'taozi', name: '桃子', handle: '@momoko', mbti: 'ENFJ', avatar: 'linear-gradient(135deg,#fda4af,#fb7185)', msgs: ['嗨！你也是画画爱好者吗？', '周末有个二次元聚会，要来吗？'] },
];

/* ---- 筛选弹窗选项 ---- */
export const sheetData = {
  interest: {
    title: '兴趣领域',
    options: [
      { v: '不限', t: '不限' }, { v: '动漫', t: '动漫' }, { v: '游戏', t: '游戏' },
      { v: '音乐', t: '音乐' }, { v: '绘画', t: '绘画' }, { v: 'Cosplay', t: 'Cosplay' },
      { v: '影视', t: '影视' }, { v: '轻小说', t: '轻小说' }, { v: 'V Tuber', t: 'V Tuber' },
    ],
  },
  region: {
    title: '地区',
    options: [
      { v: '不限', t: '不限' }, { v: '北京', t: '北京' }, { v: '上海', t: '上海' },
      { v: '广州', t: '广州' }, { v: '深圳', t: '深圳' }, { v: '杭州', t: '杭州' },
      { v: '成都', t: '成都' }, { v: '武汉', t: '武汉' }, { v: '南京', t: '南京' },
    ],
  },
};

/* ---- 字典映射 ---- */
export const MBTI_LABELS = {
  INTJ: '建筑师', INTP: '逻辑学家', ENTJ: '指挥官', ENTP: '辩论家',
  INFJ: '提倡者', INFP: '调停者', ENFJ: '主人公', ENFP: '竞选者',
  ISTJ: '物流师', ISFJ: '守卫者', ESTJ: '总经理', ESFJ: '执政官',
  ISTP: '鉴赏家', ISFP: '探险家', ESTP: '企业家', ESFP: '表演者',
};

export const NEED_MAP = {
  companion: '🤗陪伴型',
  partner: '🤝搭档型',
  attraction: '✨吸引型',
};

export const NEED_MAP_SHORT = {
  companion: '🤗陪伴',
  partner: '🤝搭档',
  attraction: '✨吸引',
};

export const INTEREST_LABELS = {
  anime: '动漫', game: '游戏', cos: 'Cosplay', music: '音乐',
  art: '绘画', novel: '轻小说', vtuber: 'V Tuber', film: '影视',
};

export const AVATAR_COLORS = [
  'linear-gradient(135deg,#6366f1,#8b5cf6)',
  'linear-gradient(135deg,#f91880,#fc2)',
  'linear-gradient(135deg,#1d9bf0,#00ba7c)',
  'linear-gradient(135deg,#ff7b00,#f91880)',
  'linear-gradient(135deg,#00ba7c,#1d9bf0)',
];

export const GENDER_LABELS = { male: '男', female: '女', other: '其他' };

/* ---- 今日话题（含默认投票分布，API 层使用） ---- */
export function todayTopic() {
  return {
    id: 'topic_daily_' + new Date().toISOString().slice(0, 10),
    question: '作为社恐，你更倾向于哪种交朋友的方式？',
    date: new Date().toISOString().slice(0, 10),
    options: [
      { id: 'o1', text: '通过共同爱好群聊认识', pct: 38, count: 4560 },
      { id: 'o2', text: '匹配推荐一对一打招呼', pct: 32, count: 3840 },
      { id: 'o3', text: '线下漫展 / 聚会', pct: 18, count: 2160 },
      { id: 'o4', text: '看缘分，随缘就好', pct: 12, count: 1440 },
    ],
    mbtiDistribution: [
      { type: 'INFP', pct: 22 },
      { type: 'INFJ', pct: 15 },
      { type: 'ENFP', pct: 13 },
      { type: 'INTJ', pct: 10 },
      { type: '其他', pct: 40 },
    ],
  };
}
