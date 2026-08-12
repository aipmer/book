// File: src/app/dashboard/translator.tsx — 客户端翻译交互组件
'use client';

import { useState } from 'react';

export default function Translator() {
  const [text, setText] = useState('');
  const [targetLang, setTargetLang] = useState('English');
  const [result, setResult] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function translate() {
    setLoading(true);
    setError('');
    setResult('');
    const res = await fetch('/api/translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, targetLang }),
    });
    const data = await res.json();
    if (res.ok) setResult(data.translatedText);
    else setError(data.error ?? '翻译失败');
    setLoading(false);
  }

  return (
    <div className="card">
      <label htmlFor="source">原文</label>
      <textarea id="source" value={text} onChange={(e) => setText(e.target.value)} placeholder="输入要翻译的内容…" />
      <label htmlFor="lang">目标语言</label>
      <select id="lang" value={targetLang} onChange={(e) => setTargetLang(e.target.value)}>
        <option>English</option>
        <option>简体中文</option>
        <option>日本語</option>
        <option>Français</option>
      </select>
      <button onClick={translate} disabled={loading || !text}>
        {loading ? '翻译中…' : '翻译'}
      </button>
      {result && <p className="result">{result}</p>}
      {error && <p className="error">{error}</p>}
    </div>
  );
}
