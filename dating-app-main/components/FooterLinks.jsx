// ============================================================
// FooterLinks - 右侧栏底部版权信息（可复用组件）
// ============================================================

export default function FooterLinks({ showCookie = false }) {
  return (
    <div className="footer-links">
      <span>服务条款</span>
      <span>隐私政策</span>
      {showCookie && <span>Cookie 政策</span>}
      <span style={{ width: '100%', marginTop: 4 }}>© 2026 EchoZshsamber</span>
    </div>
  );
}
