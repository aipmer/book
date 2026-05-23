[ 🏠 Index ](../README_EN.md) | [ ⬅️ Prev (Ch.11) ](./ch11_expo_mobile.md)

# Ch.12 The Final Frontier: Building an Automated Growth Flywheel for a One-Person SaaS

Building the product is only half the battle. You must build an automated acquisition funnel.

---

## 12.1 SEO Content Automation
Write a Node.js script to automatically generate your static sitemaps as new blog posts deploy:

```javascript
// scripts/generate-sitemap.js
const fs = require('fs');
const urls = ['/', '/auth/login', '/features', '/blog/introducing-our-saas'];
const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${urls.map(url => `<url><loc>https://pmer.cn${url}</loc></url>`).join('')}
</urlset>`;
fs.writeFileSync('public/sitemap.xml', xml);
```

---

## 12.2 Daily Stripe Briefings
Get daily performance updates sent directly to your phone:

```javascript
// daily-report.js
const userCount = await prisma.user.count({ where: { createdAt: { gte: yesterday } } });
const activeSubs = await prisma.subscription.count({ where: { status: 'ACTIVE' } });
await axios.post(process.env.MOBILE_WEBHOOK_URL, {
  text: `昨日新增用户: ${userCount}人 | 活跃订阅: ${activeSubs}个`
});
```

---

## 12.3 The Ultimate Moat
Code is commoditized. Your real moats are **domain expertise** and **empathy for the user**. Keep shipping, keep optimizing, and stay close to your audience.

---

[ 🏠 Index ](../README_EN.md) | [ ⬅️ Prev (Ch.11) ](./ch11_expo_mobile.md)
