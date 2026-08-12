// File: src/app/page.tsx — 落地页 + 订阅购买入口
'use client';

import { useState } from 'react';

export default function Home() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function subscribe() {
    setLoading(true);
    setError('');
    const res = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    if (data.url) {
      window.location.href = data.url;
    } else {
      setError(data.error ?? '创建支付会话失败');
      setLoading(false);
    }
  }

  return (
    <main>
      <h1>TransFlow</h1>
      <p className="sub">
        订阅制 AI 翻译工具 —— Codex 蓝皮书 Ch.10 配套实战工程。
        输入邮箱，通过 Stripe 完成订阅后即可解锁翻译工作台。
      </p>
      <div className="card">
        <label htmlFor="email">邮箱地址</label>
        <input
          id="email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button onClick={subscribe} disabled={loading || !email}>
          {loading ? '跳转 Stripe 收银台…' : '订阅 Pro（Stripe Checkout）'}
        </button>
        {error && <p className="error">{error}</p>}
      </div>
      <p className="sub">
        已订阅？<a href="/login">登录工作台</a>
      </p>
    </main>
  );
}
