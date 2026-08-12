// File: src/lib/stripe.ts
import Stripe from 'stripe';

// 延迟初始化：避免 next build 阶段因缺少 env 而失败
let cached: Stripe | null = null;

export function getStripe(): Stripe {
  if (!cached) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error('STRIPE_SECRET_KEY is not set');
    }
    cached = new Stripe(process.env.STRIPE_SECRET_KEY, {
      // 与 Ch.10 §10.2 一致：上线前查阅 Stripe Changelog 确认最新稳定版本
      apiVersion: '2026-04-22.dahlia' as Stripe.LatestApiVersion,
    });
  }
  return cached;
}
