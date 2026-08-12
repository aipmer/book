// File: src/app/api/translate/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createSupabaseServer } from '@/lib/supabase/server';

export async function POST(req: Request) {
  // 1. 鉴权：必须登录
  const supabase = await createSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // 2. 会员闸门：订阅状态必须为 ACTIVE
  const dbUser = await prisma.user.findUnique({
    where: { email: user.email },
    include: { subscription: true },
  });
  if (dbUser?.subscription?.status !== 'ACTIVE') {
    return NextResponse.json({ error: 'Subscription required' }, { status: 402 });
  }

  // 3. 调用 OpenAI 翻译
  const { text, targetLang } = (await req.json()) as { text?: string; targetLang?: string };
  if (!text) {
    return NextResponse.json({ error: 'text is required' }, { status: 400 });
  }

  const completion = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: `You are a translation engine. Translate the user's text into ${targetLang ?? 'English'}. Return only the translation.` },
        { role: 'user', content: text },
      ],
    }),
  }).then((r) => r.json());

  const translatedText: string = completion.choices?.[0]?.message?.content ?? '';

  // 4. 落库翻译记录
  await prisma.translationRecord.create({
    data: { userId: dbUser.id, sourceText: text, translatedText },
  });

  return NextResponse.json({ translatedText });
}
