import os
import re

# Resolve the workspace root dynamically relative to this script's directory
script_dir = os.path.dirname(os.path.abspath(__file__))
workspace = os.path.dirname(script_dir)
chapters_dir = os.path.join(workspace, "chapters")
en_dir = os.path.join(workspace, "en")

chapter_files = [
    "ch01_mindset.md",
    "ch02_setup.md",
    "ch03_sandbox.md",
    "ch04_goal_driven.md",
    "ch05_agents_protocol.md",
    "ch06_reasoning_steer.md",
    "ch07_desktop_computer_use.md",
    "ch08_mobile_workflow.md",
    "ch09_legacy_code.md",
    "ch10_saas_mvp.md",
    "ch11_expo_mobile.md",
    "ch12_commercialization.md"
]

toc_zh = """
## 🧭 目录 (Table of Contents)

### 第一部分：AI-Native 时代的产品心智与搭建
- [Ch.01 告别手写代码：Vibe Coding 时代的产品心智](#ch01-告别手写代码vibe-coding-时代的产品心智)
- [Ch.02 跨端掌控：Codex 多端生产力矩阵搭建](#ch02-跨端掌控codex-多端生产力矩阵搭建)
- [Ch.03 破局云端孤岛：沙盒调试与本地环境深度穿透](#ch03-破局云端孤岛沙盒调试与本地环境深度穿透)

### 第二部分：架构工程与智能体约束
- [Ch.04 目标驱动：用“边界与断言”驾驭推理型智能体](#ch04-目标驱动用边界与断言驾驭推理型智能体)
- [Ch.05 制定 CAP 协议：构建项目专属的 AGENTS.md 规则层](#ch05-制定-cap-协议构建项目专属的-agentsmd-规则层)
- [Ch.06 思维纠偏：如何像技术总监一样透视 CoT 推理链](#ch06-思维纠偏如何像技术总监一样透视-cot-推理链)

### 第三部分：高级多端编排与巡检
- [Ch.07 视觉闭环：Desktop Computer Use 自动巡检与设计还原](#ch07-视觉闭环desktop-computer-use-自动巡检与设计还原)
- [Ch.08 移动看护工作流：全天候离线编排实战](#ch08-移动看护工作流全天候离线编排实战)
- [Ch.09 架构复苏：混乱遗留系统的全景解析与渐进式解耦](#ch09-架构复苏混乱遗留系统的全景解析与渐进式解耦)

### 第四部分：一人公司的商业闭环
- [Ch.10 商业实战：2小时跑通 Next.js + Stripe 商业级 MVP](#ch10-商业实战2小时跑通-nextjs--stripe-商业级-mvp)
- [Ch.11 触角延伸：Expo 跨端原生 App 开发与云端打包](#ch11-触角延伸expo-跨端原生-app-开发与云端打包)
- [Ch.12 终局思考：独立开发者如何打造自动化商业飞轮](#ch12-终局思考独立开发者如何打造自动化商业飞轮)
"""

toc_en = """
## 🧭 Table of Contents

### Part 1: Product Survival in the AI-Native Era
- [Ch.01 Saying Goodbye to Handwritten Code: Product Mindset in the Era of Vibe Coding](#ch01-saying-goodbye-to-handwritten-code-product-mindset-in-the-era-of-vibe-coding)
- [Ch.02 Cross-Device Control: Building Your Codex Multi-Surface Productivity Matrix](#ch02-cross-device-control-building-your-codex-multi-surface-productivity-matrix)
- [Ch.03 Breaking the Cloud Island: Sandbox Debugging and Deep Local Environment Tunneling](#ch03-breaking-the-cloud-island-sandbox-debugging-and-deep-local-environment-tunneling)

### Part 2: Architecture & Constraints
- [Ch.04 Goal-Driven Engineering: Taming Reasoning Agents with Boundaries and Assertions](#ch04-goal-driven-engineering-taming-reasoning-agents-with-boundaries-and-assertions)
- [Ch.05 Defining the CAP Protocol: Building Your Project's AGENTS.md Rule Compliance Layer](#ch05-defining-the-cap-protocol-building-your-projects-agentsmd-rule-compliance-layer)
- [Ch.06 Correcting Course: Supervising the CoT Reasoning Chain Like a Tech Lead](#ch06-correcting-course-supervising-the-cot-reasoning-chain-like-a-tech-lead)

### Part 3: Advanced Multi-Surface Telemetry
- [Ch.07 Closing the Visual Loop: Automated Auditing and Design Verification with Desktop Computer Use](#ch07-closing-the-visual-loop-automated-auditing-and-design-verification-with-desktop-computer-use)
- [Ch.08 Mobile Sentinel Workflows: 24/7 Remote Development and Orchestration](#ch08-mobile-sentinel-workflows-247-remote-development-and-orchestration)
- [Ch.09 Codebase Revitalization: Reverse Engineering and Progressive Decoupling of Legacy Systems](#ch09-codebase-revitalization-reverse-engineering-and-progressive-decoupling-of-legacy-systems)

### Part 4: One-Person SaaS Commercialization
- [Ch.10 Monetization in Practice: Shipping a Commercial SaaS MVP in 2 Hours](#ch10-monetization-in-practice-shipping-a-commercial-saas-mvp-in-2-hours)
- [Ch.11 Mobile Extension: Expo Cross-Platform App Development and Cloud Packaging](#ch11-mobile-extension-expo-cross-platform-app-development-and-cloud-packaging)
- [Ch.12 The Final Frontier: Building an Automated Growth Flywheel for a One-Person SaaS](#ch12-the-final-frontier-building-an-automated-growth-flywheel-for-a-one-person-saas)
"""

def clean_and_process_file(filepath, is_en=False):
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()
    
    # Split into lines
    lines = content.splitlines()
    cleaned_lines = []
    
    for line in lines:
        # Skip navigation bars
        if is_en:
            if "Index" in line or "Next" in line or "Prev" in line:
                continue
        else:
            if "主目录" in line or "下一章" in line or "上一章" in line or "返回首页" in line:
                continue
        cleaned_lines.append(line)
        
    processed_content = "\n".join(cleaned_lines).strip()
    
    # Adjust relative paths for root level collection file
    # Replace [AGENTS.md](../AGENTS.md) with [AGENTS.md](./AGENTS.md)
    processed_content = processed_content.replace("../AGENTS.md", "./AGENTS.md")
    processed_content = processed_content.replace("../README.md", "./README.md")
    processed_content = processed_content.replace("../README_EN.md", "./README_EN.md")
    
    # Replace relative chapter links: (./chXX_xxx.md) -> (./chapters/chXX_xxx.md) or (./en/chXX_xxx.md)
    if is_en:
        processed_content = re.sub(r'\(\./(ch\d+_[^)]+\.md)\)', r'(./en/\1)', processed_content)
    else:
        processed_content = re.sub(r'\(\./(ch\d+_[^)]+\.md)\)', r'(./chapters/\1)', processed_content)
        
    return processed_content

def build_zh():
    combined = []
    combined.append("# OpenAI Codex 蓝皮书：从入门到架构大师\n")
    combined.append("主理人: [Hunk Wu](https://pmer.cn) (X: [@ai_pmer](https://x.com/ai_pmer))\n")
    combined.append("[ 🌐 English PDF Version ](./codex_blue_book_en.pdf) | [ 🌐 English Online Version ](./en/ch01_mindset.md)\n")
    combined.append(toc_zh.strip() + "\n\n---\n")
    combined.append("## 🔌 关联开源项目\n")
    combined.append("*   **[Codex 飞书插件](https://github.com/hunkwu/plugins-codex-feishu)**：将 Codex 强大的智能体自动化开发与重构能力无缝接入飞书多维表格与机器人工作流，实现日常办公任务的自动化编排与高效数据流转。\n\n---\n")
    
    for filename in chapter_files:
        zh_path = os.path.join(chapters_dir, filename)
        if os.path.exists(zh_path):
            chapter_content = clean_and_process_file(zh_path, is_en=False)
            combined.append(chapter_content + "\n\n---\n")
            
    # Write to file
    out_path = os.path.join(workspace, "codex_blue_book_zh.md")
    with open(out_path, "w", encoding="utf-8") as f:
        f.write("\n".join(combined))
    print("Compiled and saved codex_blue_book_zh.md")

def build_en():
    combined = []
    combined.append("# Codex Book: From Beginner to Architect\n")
    combined.append("Author: [Hunk Wu](https://pmer.cn) (X: [@ai_pmer](https://x.com/ai_pmer))\n")
    combined.append("[ 🌐 中文 PDF 版 ](./codex_blue_book_zh.pdf) | [ 🌐 中文在线版 ](./chapters/ch01_mindset.md)\n")
    combined.append(toc_en.strip() + "\n\n---\n")
    combined.append("## 🔌 Related Projects\n")
    combined.append("*   **[Codex Feishu Plugin](https://github.com/hunkwu/plugins-codex-feishu)**: Integrates Codex's autonomous agent development and refactoring capabilities directly into Feishu (Lark) multidimensional tables and robot workflows, enabling automated daily office task orchestration and high-efficiency data flows.\n\n---\n")
    
    for filename in chapter_files:
        en_path = os.path.join(en_dir, filename)
        if os.path.exists(en_path):
            chapter_content = clean_and_process_file(en_path, is_en=True)
            combined.append(chapter_content + "\n\n---\n")
            
    # Write to file
    out_path = os.path.join(workspace, "codex_blue_book_en.md")
    with open(out_path, "w", encoding="utf-8") as f:
        f.write("\n".join(combined))
    print("Compiled and saved codex_blue_book_en.md")

if __name__ == "__main__":
    build_zh()
    build_en()
