'use client';

import { useState } from 'react';

// ============================================================
// CommentModal - 帖子评论弹窗（可复用组件）
// props:
//   post      - 当前评论的帖子（null 表示关闭）
//   comments  - 该帖子的评论数组
//   onClose   - 关闭回调
//   onSubmit  - 提交评论回调（接收评论文本）
// ============================================================

export default function CommentModal({ post, comments = [], onClose, onSubmit }) {
  const [text, setText] = useState('');

  if (!post) return null;

  const handleSubmit = () => {
    const value = text.trim();
    if (!value) return;
    onSubmit(value);
    setText('');
  };

  return (
    <div
      className="modal-overlay comment-overlay show"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="modal-box">
        <div className="modal-title">💬 评论</div>
        <div className="comment-list">
          {comments.length > 0 ? (
            comments.map((c, i) => (
              <div className="comment-item" key={i}>
                <div className="c-head">
                  {c.name}
                  <span className="c-time">{new Date(c.time).toLocaleString()}</span>
                </div>
                <div className="c-text">{c.text}</div>
              </div>
            ))
          ) : (
            <div className="c-empty">还没有评论，来抢沙发～</div>
          )}
        </div>
        <textarea
          className="comment-input"
          placeholder="写下你的评论..."
          maxLength={200}
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <div className="modal-actions">
          <button style={{ background: 'var(--accent)', color: '#fff' }} onClick={handleSubmit}>
            发布评论
          </button>
          <button className="cancel" onClick={onClose}>
            取消
          </button>
        </div>
      </div>
    </div>
  );
}
