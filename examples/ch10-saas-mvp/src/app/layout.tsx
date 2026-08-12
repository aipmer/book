// File: src/app/layout.tsx
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'TransFlow — AI 翻译 SaaS MVP',
  description: 'Codex 蓝皮书 Ch.10 配套实战工程：Next.js 15 + Supabase + Stripe',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
