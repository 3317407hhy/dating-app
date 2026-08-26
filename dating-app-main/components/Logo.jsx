// ============================================================
// Logo - EchoZshsamber 品牌 SVG 图标（可复用组件）
// 通过 size 控制大小，通过 idPrefix 避免多个实例的渐变 id 冲突
// ============================================================

export default function Logo({ size = 30, idPrefix = '' }) {
  return (
    <svg
      width={size}
      height={size}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1024 1024"
      style={{ display: 'block' }}
      aria-label="EchoZshsamber"
    >
      <defs>
        <radialGradient id={`${idPrefix}bg`} cx="0.5" cy="0.45" r="0.65">
          <stop offset="0%" stopColor="#27283b" />
          <stop offset="100%" stopColor="#14141f" />
        </radialGradient>
        <linearGradient id={`${idPrefix}zGrad`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#8b9cf7" />
          <stop offset="100%" stopColor="#6366f1" />
        </linearGradient>
        <linearGradient id={`${idPrefix}xGrad`} x1="1" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#a78bfa" />
          <stop offset="100%" stopColor="#7c3aed" />
        </linearGradient>
      </defs>

      {/* 背景圆角方块 */}
      <rect x="64" y="64" width="896" height="896" rx="224" ry="224" fill={`url(#${idPrefix}bg)`} />

      {/* 内环 */}
      <rect
        x="64" y="64" width="896" height="896" rx="224" ry="224"
        fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="2"
      />

      {/* 字母 z */}
      <g fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="54">
        <line x1="222" y1="378" x2="482" y2="378" stroke={`url(#${idPrefix}zGrad)`} />
        <line x1="482" y1="378" x2="222" y2="648" stroke={`url(#${idPrefix}zGrad)`} />
        <line x1="222" y1="648" x2="482" y2="648" stroke={`url(#${idPrefix}zGrad)`} />
      </g>

      {/* 字母 x */}
      <g fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="54">
        <line x1="542" y1="378" x2="802" y2="648" stroke={`url(#${idPrefix}xGrad)`} />
        <line x1="802" y1="378" x2="542" y2="648" stroke={`url(#${idPrefix}xGrad)`} />
      </g>
    </svg>
  );
}
