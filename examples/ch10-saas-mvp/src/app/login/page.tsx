// File: src/app/login/page.tsx — Supabase 邮箱魔法链接登录
'use client';

import { useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';

export default function Login() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  async function sendMagicLink() {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    });
    if (error) setError(error.message);
    else setSent(true);
  }

  return (
    <main>
      <h1>登录工作台</h1>
      <p className="sub">输入订阅时使用的邮箱，我们将发送免密码登录链接。</p>
      <div className="card">
        {sent ? (
          <p className="result">✅ 登录链接已发送至 {email}，请查收邮件。</p>
        ) : (
          <>
            <label htmlFor="email">邮箱地址</label>
            <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <button onClick={sendMagicLink} disabled={!email}>发送登录链接</button>
            {error && <p className="error">{error}</p>}
          </>
        )}
      </div>
    </main>
  );
}
