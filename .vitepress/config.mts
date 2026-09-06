import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Codex 蓝皮书',
  description: '基于 OpenAI Codex 智能体的高效自动化开发、沙盒穿透与工程实战指南',
  base: (process.env.VITEPRESS_BASE || '/').replace(/\/?$/, '/'),
  cleanUrls: true,
  ignoreDeadLinks: true,
  srcExclude: [
    '**/node_modules/**',
    '**/examples/**',
    '**/scripts/**',
    '**/case-studies/recordings/**',
    '**/templates/**',
    'README.md',
    'CONTRIBUTING.md',
    'dev_task.md',
    'changelog.md',
    'codex_blue_book_zh.md',
    'codex_blue_book_en.md',
    'PROJECT.md',
    'TEST_*.md'
  ],

  locales: {
    root: {
      label: '简体中文',
      lang: 'zh-CN',
      title: 'Codex 蓝皮书',
      description: '基于 OpenAI Codex 智能体的高效自动化开发、终端自测与工程实战指南',
      themeConfig: {
        nav: [
          { text: '首页', link: '/' },
          { text: '章节阅读', link: '/chapters/ch01_mindset' },
          { text: '规约生成器', link: '/generator' },
          { text: '规约模版', link: 'https://github.com/aipmer/book/tree/main/templates' },
          { text: '实战样例', link: 'https://github.com/aipmer/book/tree/main/examples' },
          { text: '飞书助理', link: 'https://github.com/aipmer/plugins-codex-feishu' },
          {
            text: '下载 PDF',
            items: [
              { text: '中文版 PDF (直链下载)', link: '/downloads/codex_blue_book_zh.pdf' },
              { text: '英文版 PDF (Direct Download)', link: '/downloads/codex_blue_book_en.pdf' },
              { text: 'GitHub Release (v1.2.0)', link: 'https://github.com/aipmer/book/releases/tag/v1.2.0' }
            ]
          }
        ],
        sidebar: [
          {
            text: '第一部分：心智与基建（从打字员到指挥官）',
            collapsed: false,
            items: [
              { text: 'Ch.01 AI 原生心智：把 AI 当全栈团队，甩掉打字机包袱', link: '/chapters/ch01_mindset' },
              { text: 'Ch.02 多端指挥舱：CLI、桌面端与手机协同配置避坑', link: '/chapters/ch02_setup' },
              { text: 'Ch.03 本地环境与端口打通：让云端 AI 顺畅访问本地数据库', link: '/chapters/ch03_sandbox' },
            ]
          },
          {
            text: '第二部分：规范与认知编排（立规矩、防失控）',
            collapsed: false,
            items: [
              { text: 'Ch.04 目标驱动编程：别教大厨切菜，用验收断言锁死边界', link: '/chapters/ch04_goal_driven' },
              { text: 'Ch.05 打造项目专属规则：让 AI 听话、防破坏与防死循环', link: '/chapters/ch05_agents_protocol' },
              { text: 'Ch.06 透视 AI 思考过程：像技术总监一样随时纠偏与打断', link: '/chapters/ch06_reasoning_steer' },
            ]
          },
          {
            text: '第三部分：跨端自动化与全天候值班（解放双手与工位）',
            collapsed: false,
            items: [
              { text: 'Ch.07 真实接管桌面与浏览器：UI 自动走查与像素级还原', link: '/chapters/ch07_desktop_computer_use' },
              { text: 'Ch.08 飞书助理值班：人在路上，用手机随时监控与审批', link: '/chapters/ch08_mobile_workflow' },
            ]
          },
          {
            text: '第四部分：工程重构与闭环交付（真实硬核落地）',
            collapsed: false,
            items: [
              { text: 'Ch.09 改造混乱老代码：逆向工程、防崩测试与微创重构', link: '/chapters/ch09_legacy_code' },
              { text: 'Ch.10 商业化实战：2 小时跑通 Next.js + Stripe 付费 SaaS', link: '/chapters/ch10_saas_mvp' },
              { text: 'Ch.11 跨端原生 App：告别环境地狱，用 Expo 极速上架双端', link: '/chapters/ch11_expo_mobile' },
            ]
          },
          {
            text: '第五部分：商业化与前沿瞭望（一人公司与生态升级）',
            collapsed: false,
            items: [
              { text: 'Ch.12 一人公司增长飞轮：自动化营销、日常运营与变现路径', link: '/chapters/ch12_commercialization' },
              { text: 'Ch.13 2026 前沿作战地图：大版本迁移、新特性接管与避坑速查', link: '/chapters/ch13_2026_frontier' },
            ]
          },
          {
            text: '附录：生态工具与沙盒样例',
            collapsed: false,
            items: [
              { text: 'AGENTS.md 规约生成器', link: '/generator' },
              { text: 'Chrome 扩展沙盒样例 (Ch.06)', link: 'https://github.com/aipmer/book/tree/main/examples/ch06-chrome-extension' },
              { text: 'Next.js 全栈 SaaS 样例 (Ch.10)', link: 'https://github.com/aipmer/book/tree/main/examples/ch10-saas-mvp' },
              { text: 'Expo 移动端 App 样例 (Ch.11)', link: 'https://github.com/aipmer/book/tree/main/examples/ch11-expo-mobile' },
            ]
          }
        ],
        outline: {
          level: [2, 3],
          label: '本章目录'
        },
        docFooter: {
          prev: '上一章',
          next: '下一章'
        },
        darkModeSwitchLabel: '深浅模式',
        sidebarMenuLabel: '目录菜单',
        returnToTopLabel: '回到顶部'
      }
    },
    en: {
      label: 'English',
      lang: 'en-US',
      link: '/en/',
      title: 'Codex Blue Book',
      description: 'A Pragmatic Guide to Autonomous Agent Orchestration, Direct Execution & Commercial Delivery',
      themeConfig: {
        nav: [
          { text: 'Home', link: '/en/' },
          { text: 'Chapters', link: '/en/ch01_mindset' },
          { text: 'Protocol Generator', link: '/en/generator' },
          { text: 'Templates', link: 'https://github.com/aipmer/book/tree/main/templates' },
          { text: 'Examples', link: 'https://github.com/aipmer/book/tree/main/examples' },
          { text: 'Feishu Assistant', link: 'https://github.com/aipmer/plugins-codex-feishu' },
          {
            text: 'Download PDF',
            items: [
              { text: 'English Edition (Direct Download)', link: '/downloads/codex_blue_book_en.pdf' },
              { text: 'Chinese Edition (中文版直链)', link: '/downloads/codex_blue_book_zh.pdf' },
              { text: 'GitHub Release (v1.2.0)', link: 'https://github.com/aipmer/book/releases/tag/v1.2.0' }
            ]
          }
        ],
        sidebar: [
          {
            text: 'Part 1: Mindset & Infrastructure (From Typist to Architect)',
            collapsed: false,
            items: [
              { text: 'Ch.01 AI-Native Mindset: Treat AI as a Full-Stack Team', link: '/en/ch01_mindset' },
              { text: 'Ch.02 Multi-Surface Setup: Pitfalls & Setup for CLI, Desktop & Mobile', link: '/en/ch02_setup' },
              { text: 'Ch.03 Connect Local Environments & Ports: Access Local DB from Cloud AI', link: '/en/ch03_sandbox' },
            ]
          },
          {
            text: 'Part 2: Specifications & Cognitive Steering (Rules & Safety Boundaries)',
            collapsed: false,
            items: [
              { text: 'Ch.04 Goal-Driven Programming: Assert Boundaries Instead of Micromanaging', link: '/en/ch04_goal_driven' },
              { text: 'Ch.05 Custom Project Rules: Tame Agents, Prevent Loops & Breakages', link: '/en/ch05_agents_protocol' },
              { text: 'Ch.06 Steering AI Reasoning: Inspect & Correct Thinking Like a Lead Architect', link: '/en/ch06_reasoning_steer' },
            ]
          },
          {
            text: 'Part 3: Cross-Device Automation & 24/7 Feishu Sentinel',
            collapsed: false,
            items: [
              { text: 'Ch.07 Direct Desktop & Browser Control: Automated UI Testing & Pixel Review', link: '/en/ch07_desktop_computer_use' },
              { text: 'Ch.08 Feishu Assistant: 24/7 Mobile Telemetry & Remote Approvals', link: '/en/ch08_mobile_workflow' },
            ]
          },
          {
            text: 'Part 4: Refactoring & Commercial Delivery (Real Code, Zero Fluff)',
            collapsed: false,
            items: [
              { text: 'Ch.09 Refactoring Legacy Code: Reverse Engineering & Non-Breaking Tests', link: '/en/ch09_legacy_code' },
              { text: 'Ch.10 Commercial SaaS MVP: Shipping Stripe Monetization in 2 Hours', link: '/en/ch10_saas_mvp' },
              { text: 'Ch.11 Cross-Platform Mobile Apps: Ship Native iOS & Android with Expo', link: '/en/ch11_expo_mobile' },
            ]
          },
          {
            text: 'Part 5: Commercialization & Frontier (One-Person SaaS & 2026 Upgrades)',
            collapsed: false,
            items: [
              { text: 'Ch.12 One-Person SaaS Growth Flywheel: Automated Marketing & Ops', link: '/en/ch12_commercialization' },
              { text: 'Ch.13 2026 Ecosystem Battle Map: Migrations, New Features & Breaking Changes', link: '/en/ch13_2026_frontier' },
            ]
          },
          {
            text: 'Appendix: Tools & Sandboxes',
            collapsed: false,
            items: [
              { text: 'AGENTS.md Protocol Generator', link: '/en/generator' },
              { text: 'Chrome Extension Sample (Ch.06)', link: 'https://github.com/aipmer/book/tree/main/examples/ch06-chrome-extension' },
              { text: 'Next.js SaaS MVP Sample (Ch.10)', link: 'https://github.com/aipmer/book/tree/main/examples/ch10-saas-mvp' },
              { text: 'Expo Mobile App Sample (Ch.11)', link: 'https://github.com/aipmer/book/tree/main/examples/ch11-expo-mobile' },
            ]
          }
        ],
        outline: {
          level: [2, 3],
          label: 'On This Page'
        },
        docFooter: {
          prev: 'Previous Chapter',
          next: 'Next Chapter'
        }
      }
    }
  },

  themeConfig: {
    search: {
      provider: 'local',
      options: {
        locales: {
          root: {
            translations: {
              button: {
                buttonText: '搜索全书',
                buttonAriaLabel: '搜索全书'
              },
              modal: {
                noResultsText: '无法找到相关结果',
                resetButtonTitle: '清除查询条件',
                footer: {
                  selectText: '选择',
                  navigateText: '切换',
                  closeText: '关闭'
                }
              }
            }
          }
        }
      }
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/aipmer/book' }
    ],
    footer: {
      message: 'Released under the MIT & Apache-2.0 Licenses.',
      copyright: 'Copyright © 2026 AIPMER'
    }
  }
})
