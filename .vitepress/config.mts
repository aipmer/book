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
    'codex_blue_book_en.md'
  ],

  locales: {
    root: {
      label: '简体中文',
      lang: 'zh-CN',
      title: 'Codex 蓝皮书',
      description: '基于 OpenAI Codex 智能体的高效自动化开发、沙盒穿透与工程实战指南',
      themeConfig: {
        nav: [
          { text: '首页', link: '/' },
          { text: '章节阅读', link: '/chapters/ch01_mindset' },
          { text: '规约生成器', link: '/generator' },
          { text: '规约模版', link: 'https://github.com/aipmer/book/tree/main/templates' },
          { text: '实战样例', link: 'https://github.com/aipmer/book/tree/main/examples' },
          { text: '看护助理', link: 'https://github.com/aipmer/plugins-codex-feishu' },
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
            text: '第一部分：心智与基建',
            collapsed: false,
            items: [
              { text: 'Ch.01 AI 原生心智：从代码补全到自主智能体', link: '/chapters/ch01_mindset' },
              { text: 'Ch.02 环境搭建与基建：打造沙盒穿透与调试环境', link: '/chapters/ch02_setup' },
              { text: 'Ch.03 沙盒边界与执行：安全防护与受限提权', link: '/chapters/ch03_sandbox' },
            ]
          },
          {
            text: '第二部分：规范与认知编排',
            collapsed: false,
            items: [
              { text: 'Ch.04 目标驱动式编程：从模糊意图到可执行规范', link: '/chapters/ch04_goal_driven' },
              { text: 'Ch.05 智能体协作协议：AGENTS.md 实操与 Anti-Loop 护栏', link: '/chapters/ch05_agents_protocol' },
              { text: 'Ch.06 思考链控制：干预与引导智能体推理路径', link: '/chapters/ch06_reasoning_steer' },
            ]
          },
          {
            text: '第三部分：跨端自动化与全天候值班',
            collapsed: false,
            items: [
              { text: 'Ch.07 桌面端自动化与 Computer Use：跨越命令行鸿沟', link: '/chapters/ch07_desktop_computer_use' },
              { text: 'Ch.08 移动看护工作流：全天候离线编排实战', link: '/chapters/ch08_mobile_workflow' },
            ]
          },
          {
            text: '第四部分：工程重构与闭环交付',
            collapsed: false,
            items: [
              { text: 'Ch.09 遗留代码重构：外科手术式改造与反退化测试', link: '/chapters/ch09_legacy_code' },
              { text: 'Ch.10 从 0 到 1 商业级 SaaS MVP：闭环交付全解', link: '/chapters/ch10_saas_mvp' },
              { text: 'Ch.11 跨端移动应用：Expo/React Native 极速商业化', link: '/chapters/ch11_expo_mobile' },
            ]
          },
          {
            text: '第五部分：商业化与前沿瞭望',
            collapsed: false,
            items: [
              { text: 'Ch.12 独立开发者的商业化与交付自动化', link: '/chapters/ch12_commercialization' },
              { text: 'Ch.13 2026 生态前沿与全景升级指南', link: '/chapters/ch13_2026_frontier' },
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
      description: 'A Pragmatic Guide to Autonomous Agent Orchestration, Sandbox Penetration & Commercial Delivery',
      themeConfig: {
        nav: [
          { text: 'Home', link: '/en/' },
          { text: 'Chapters', link: '/en/ch01_mindset' },
          { text: 'Protocol Generator', link: '/en/generator' },
          { text: 'Templates', link: 'https://github.com/aipmer/book/tree/main/templates' },
          { text: 'Examples', link: 'https://github.com/aipmer/book/tree/main/examples' },
          { text: 'Sentinel', link: 'https://github.com/aipmer/plugins-codex-feishu' },
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
            text: 'Part 1: Mindset & Infrastructure',
            collapsed: false,
            items: [
              { text: 'Ch.01 The AI-Native Mindset', link: '/en/ch01_mindset' },
              { text: 'Ch.02 Environment Setup & Infrastructure', link: '/en/ch02_setup' },
              { text: 'Ch.03 Sandbox Boundaries and Execution', link: '/en/ch03_sandbox' },
            ]
          },
          {
            text: 'Part 2: Specifications & Cognitive Steering',
            collapsed: false,
            items: [
              { text: 'Ch.04 Goal-Driven Programming', link: '/en/ch04_goal_driven' },
              { text: 'Ch.05 Agent Collaboration Protocol & Anti-Loop', link: '/en/ch05_agents_protocol' },
              { text: 'Ch.06 Steering Chain-of-Thought', link: '/en/ch06_reasoning_steer' },
            ]
          },
          {
            text: 'Part 3: Cross-Device & 24/7 Watchdog',
            collapsed: false,
            items: [
              { text: 'Ch.07 Desktop Automation & Computer Use', link: '/en/ch07_desktop_computer_use' },
              { text: 'Ch.08 Mobile Watchdog: 24/7 Offline Orchestration', link: '/en/ch08_mobile_workflow' },
            ]
          },
          {
            text: 'Part 4: Refactoring & Commercial Delivery',
            collapsed: false,
            items: [
              { text: 'Ch.09 Refactoring Legacy Code', link: '/en/ch09_legacy_code' },
              { text: 'Ch.10 From Zero to Commercial SaaS MVP', link: '/en/ch10_saas_mvp' },
              { text: 'Ch.11 Cross-Platform Mobile Apps with Expo', link: '/en/ch11_expo_mobile' },
            ]
          },
          {
            text: 'Part 5: Commercialization & Frontier',
            collapsed: false,
            items: [
              { text: 'Ch.12 Indie Hacker Commercialization', link: '/en/ch12_commercialization' },
              { text: 'Ch.13 2026 Ecosystem Frontier & Landscape', link: '/en/ch13_2026_frontier' },
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
