// File: src/app/dashboard/page.tsx — 会员翻译工作台（服务端做订阅闸门）
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { createSupabaseServer } from '@/lib/supabase/server';
import Translator from './translator';

export const dynamic = 'force-dynamic';

export default async function Dashboard() {
  const supabase = await createSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) redirect('/login');

  const dbUser = await prisma.user.findUnique({
    where: { email: user.email },
    include: { subscription: true },
  });

  if (dbUser?.subscription?.status !== 'ACTIVE') redirect('/');

  return (
    <main>
      <h1>翻译工作台</h1>
      <p className="sub">
        订阅有效期至 {dbUser.subscription.currentPeriodEnd.toLocaleDateString('zh-CN')}（{user.email}）
      </p>
      <Translator />
    </main>
  );
}
