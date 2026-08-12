import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Stripe Webhook 需要原始 body，App Router route handler 默认即满足，无需额外配置
};

export default nextConfig;
