[ 🏠 Index ](/en/) | [ ⬅️ Prev (Ch.12) ](./ch12_commercialization.md) | [ 🌐 中文版 ](../chapters/ch13_2026_frontier.md)

# Ch.13 Frontier Watch: The 2026 Codex Ecosystem Overhaul

> 🎯 **The Real Problem**: Rapid tool churn, deprecated commands (Codex desktop merging into ChatGPT code mode), model evolutions (GPT-5.6), and unexpected CLI breaking changes.  
> 💡 **Tangible Output & Takeaway**: 2026 migration command battle map (winget/brew setups, CLI 0.14x configurations, Plugins ecosystem integration), and compatibility test scripts.  
> ⚡ **Viral Screenshot Quote**: *"Tools retool every quarter, but mental models remain your moat. Zero fluff—only an actionable battle map of what deprecated and what to adopt."*

The first twelve chapters built a version-independent orchestration methodology. But methodology must land on real tooling. In 2026, the Codex ecosystem went through four structural shifts: **the desktop merger, the model transition, the maturing plugin economy, and security becoming its own product line**. This chapter breaks down each shift with concrete migration commands and configurations.

---

## 🎯 Intuitive Metaphor: Avionics Retrofit of a Supersonic Airliner

Do not panic over frequent tool upgrades. View this transition through the eyes of a pilot:

```Plaintext
[Pilot Mindset]   ──> Your flight manual remains identical: goal-driven execution (takeoff & landing targets)
                      and strict boundary constraints (flight corridors & safe altitudes).
[Engines]         ──> Propulsion overhauled to next-generation powerplants:
                      - Frontier Flagship Core: "GPT-6 Astra" (beyond-visual-range radar & autonomous computer operator);
                      - Daily Primary Thrust Engine: "GPT-5.6 Terra" (balanced deep reasoning);
                      - Auxiliary Cruise Engine: "GPT-5.6 Luna" (Guardian auto-approval & low-latency checks).
[Cockpit Screen]  ──> The former standalone secondary monitor (separate Codex App) is officially integrated
                      into the main instrument panel (ChatGPT Desktop Code Mode), adding Sites radar & Annotations.
[Autopilot]       ──> Old simple cruise control (--full-auto) upgraded to an intelligent co-pilot
                      with flight corridor self-checking (--sandbox workspace-write + Guardian).
```

With your mental model intact, upgraded avionics only help you fly faster and steadier.

---

## 🚀 Beginner Quickstart (3 Easy Steps)

Complete your 2026 toolchain health check and migration in 3 simple steps:

1. **Step 1: Scan for Deprecated Legacy Model Codenames**  
   Run a grep scan in your project root:
   ```bash
   grep -rn "gpt-5.4" ~/.codex/config.toml .
   ```
2. **Step 2: Globally Upgrade to CLI 0.147.0+ Stable Release**  
   Run the global npm update:
   ```bash
   npm install -g @openai/codex@latest
   codex --version
   ```
3. **Step 3: Eliminate the Deprecated `--full-auto` Flag**  
   In all your shell aliases and CI scripts, replace `--full-auto` with:
   ```bash
   codex exec --sandbox workspace-write "<task>"
   ```

---

## 13.1 The Desktop Merger: Codex App Folds into the ChatGPT Client

In July 2026, the standalone Codex desktop app was retired. All of its capabilities moved into the **ChatGPT desktop client** as a dedicated "Codex Code Mode," available to Free, Plus, and Enterprise users.

**Migration steps:**

```bash
# macOS: download ChatGPT.dmg and drag it into Applications
# Windows: install via winget
winget install OpenAI.ChatGPT
```

After signing in, click the **Codex** tab in the left sidebar to enter Code Mode. Two caveats:

1. **Account vs. API Key**: Signing in with a ChatGPT account unlocks the full feature set (cloud tasks, cross-device sync, Sites hosting, Computer Use); an API key grants only basic local coding.
2. **Standalone components are unaffected**: the Codex CLI, the VS Code extension, and Codex Cloud continue to evolve independently. The multi-surface matrix from Ch.02 still holds — the "desktop app" cell is simply replaced by the ChatGPT client.

**New capabilities at a glance:**
- Upgraded built-in browser: search browsing history from the address bar; the Chrome extension can reference open tabs.
- **Multi-repo Review**: multi-folder projects show changed lines across all repositories in one review view — no more tab-hopping between diffs.
- **Sites**: create, deploy, and manage hosted web projects directly in the client, with Annotations for in-place "point and edit" workflows.

---

## 13.2 The Model Transition: GPT-6 Astra & the 2026 Landscape

In late 2026, OpenAI fundamentally restructured its model strategy away from single-model patches toward a persistent tiered architecture: introducing the frontier autonomous agent **GPT-6 Astra**, while solidifying the **GPT-5.6 family** into a clear three-tier capability hierarchy (Sol / Terra / Luna).

### 1. The Next-Gen Frontier Flagship: GPT-6 Astra (Launched September 3, 2026)

On September 3, 2026, OpenAI officially unveiled its most intelligent and aligned model to date: **GPT-6 Astra** (API model identifier: `gpt-6-astra`). Key specifications and capabilities include:

*   **1.05 Million Token Context & 128k Output**: Natively supports a **1,050,000 token context window** with **128,000 maximum output tokens**, eliminating context truncations for massive monolithic repositories and multi-app codebases.
*   **Native Computer Operator**: Purpose-built for **Computer Use**, Astra operates software like a human engineer—directly inspecting screen pixels, clicking GUI controls, navigating browsers, and executing end-to-end coding workflows across desktop applications.
*   **Benchmark Dominance**: Set state-of-the-art records across software engineering (SWE-bench) and advanced mathematics (FrontierMath).
*   **Safety Classification**: First OpenAI model rated at the "Critical" cybersecurity capability level under the Preparedness Framework, featuring advanced automated vulnerability discovery and reverse-engineering capabilities under gated access.

### 2. The 2026 Active Model Decision Matrix

Avoid the anti-pattern of blindly defaulting to the most expensive tier. Distribute tasks systematically:

| Model ID | Public Tier Name | Core Positioning & Use Cases | Selection Guidance |
| :--- | :--- | :--- | :--- |
| `gpt-6-astra` | **GPT-6 Astra** | Frontier Agentic Flagship / Native Computer Operator | Multi-application desktop workflows, ultra-long context refactoring, high-fidelity visual audits |
| `gpt-5.6-sol` / `gpt-5.6` | **GPT-5.6 Sol** | High-Reasoning Architecture Flagship (Daybreak Blue) | Distributed system design, deep legacy refactoring, mission-critical security defenses |
| `gpt-5.6-terra` | **GPT-5.6 Terra** | Balanced Daily Coding Workhorse | Standard for everyday professional development; optimal balance of depth, latency, and cost |
| `gpt-5.6-luna` | **GPT-5.6 Luna** | Ultra-Fast, Low-Latency Guardian & Triaging | High-frequency micro-edits, test routing, automated Guardian (`--approve-for-me`) approvals |

### 3. 2026 OpenAI Model Deprecation & Sunset Schedule

Throughout 2026, OpenAI executed a rigorous deprecation timeline. Audit your configurations to prevent production downtime:

| Date | Action Type | Affected Models / Services | Impact & Official Replacement |
| :--- | :--- | :--- | :--- |
| **March 26, 2026** | Shutdown | `gpt-4-0314`, `gpt-4-1106-preview`, `gpt-4-0125-preview` | Legacy GPT-4 snapshots shut down; migrate to `gpt-5.6-terra` |
| **May 12, 2026** | API Shutdown | DALL-E 2 / DALL-E 3 | Image generation APIs retired; migrate to `gpt-image-1` / `gpt-image-2` |
| **June 2026** | ChatGPT Retired | `o3`, `gpt-4.5`, early `gpt-5` thinking snapshots | Removed from ChatGPT UI; consolidated onto GPT-5.6 / 6 tiers |
| **August 26, 2026** | API Shutdown | Legacy Assistants API | Deprecated older architecture; superseded by Responses API & native agents |
| **August 31, 2026** | Codex Retired | `gpt-5.4`, `gpt-5.4-mini` | Retired from Codex ChatGPT login mode; replaced by `gpt-5.6-terra` / `luna` |
| **September 3, 2026**| General Launch | **GPT-6 Astra (`gpt-6-astra`)** | Frontier flagship launch with 1.05M context and native Computer Use |
| **October 23, 2026** | Scheduled Sunset| Remaining legacy Preview snapshot models | Batch shutdown of preview tags; developers must pin stable model IDs |
| **December 1, 2026** | Scheduled Sunset| `gpt-image-1-mini`, `gpt-image-1.5`, `chatgpt-image-latest` | Image models fully consolidated onto `gpt-image-2` |

**Recommended Configuration:**

```toml
# ~/.codex/config.toml

# Default daily development engine (Terra: optimal balance of depth & speed)
model = "gpt-5.6-terra"

# Optional: Frontier autonomous agent & Computer Use (Astra)
# model = "gpt-6-astra"

# Fast automated approvals and guardian sentinels (Luna: low cost & sub-second latency)
[profiles.guardian]
model = "gpt-5.6-luna"

# High-stakes architectural refactoring & security defense (Sol: peak reasoning)
[profiles.architect]
model = "gpt-5.6-sol"
```

> ⚠️ **Warning**: Audit all scheduled Automations, workspace default profiles, and CI scripts. Remove all hardcoded references to retired `gpt-5.4` or temporary `preview` models.

---

## 13.3 CLI 0.14x: The Breaking Changes You Must Know

The Codex CLI is now in the `0.14x` era (latest stable: `0.147.0+`).

```bash
npm install -g @openai/codex@latest
```

### 1. `--full-auto` Is Officially Removed

```bash
# ❌ Old syntax (now errors out)
codex exec --full-auto "fix all lint errors"

# ✅ New syntax: express autonomy via sandbox mode
codex exec --sandbox workspace-write "fix all lint errors"
```

### 2. The Hooks Engine Graduates to Stable

Configure `SessionStart` / `Stop` hooks directly in `config.toml`, observing MCP tool calls, `apply_patch`, and long-running Bash sessions:

```toml
# ~/.codex/config.toml
[hooks]
session_start = "bash scripts/bootstrap-env.sh"
stop = "npm run lint --silent"
```

### 3. Agent Plugins and Marketplaces

Support for local, personal, workspace, and remote catalogs:

```bash
# Unified plugin management entry point
codex plugin list
codex plugin marketplace add https://plugins.example.com/catalog.json
codex plugin install security-workbench
```

Mention a plugin in chat with `@plugin` to auto-inject its context.

### 4. Subagents and Multi-Agent Orchestration

The CLI natively spawns subagents with independent context windows:

```text
> Spawn two subagents: one adds integration tests for src/api,
  another refactors state management in src/hooks in parallel.
  Aggregate the diffs for my review at the end.
```

### 5. Guardian Auto-Approval and `--approve-for-me`

Human confirmation is no longer the only path for high-risk operations. The new `--approve-for-me` flag routes approval requests to a Guardian subagent (powered by GPT-5.6 Luna):

```bash
codex --approve-for-me "upgrade dependencies and make tests pass"
```

---

## 13.4 The Skills Economy: Compounding Repeated Workflows into Assets

If AGENTS.md is a project's "constitutional law," **Skills are the standard operating procedures for specific task types**:

```text
skills/
└── pr-review/
    └── SKILL.md      # A procedural manual with YAML frontmatter
```

---

## 13.5 Codex Security and Daybreak: Security Becomes a Product Line

For enterprise defense and mission-critical infrastructure, OpenAI established the **Daybreak** defense architecture and official security plugins:

- **Daybreak Blue**: general-purpose engineering defense and automated patch generation powered by the high-reasoning **GPT-5.6 Sol**.
- **Daybreak Red / Frontier Eval**: red-teaming offensive evaluation and penetration testing powered by the frontier flagship **GPT-6 Astra** (gated under the Critical cybersecurity capability framework), delivering end-to-end zero-day discovery and automated binary reverse-engineering.

```bash
codex plugin install codex-security
codex-security scan --deep --report sarif > results.sarif
```

---

## 13.6 Spatial Intelligence & 3D Cross-Domain Frontiers: GPT-6 Astra with Blender and Tripo3D

As frontier models evolved from pure text and 2D web code toward spatial physical reasoning, the second half of 2026 unleashed a **cross-disciplinary revolution** across 3D modeling, spatial computing, and game engineering.

### 1. Industry Breakthrough: From 2D Code to Spatial Geometry

In September 2026, OpenAI demonstrated GPT-6 Astra's spatial geometry capabilities ([tweet #2100679992720142459](https://x.com/openai/status/2100679992720142459?s=46)) and unveiled **BenchCAD**—where Astra achieved a record-breaking **95.9% mean voxel IoU** in multi-view CAD code reconstruction. This shattered the long-standing limitation that large language models lack three-dimensional spatial intuition.

Global 3D generation leader **Tripo3D** swiftly announced deep integration, launching a dedicated **[GPT-6 Astra 3D Prompt Engineering Center](https://www.tripo3d.ai/zh/3d-prompts/models/gpt-6-astra)**. Indie developers can now leverage an ultra-lean pipeline to accomplish 3D modeling, lighting setup, and material baking in minutes instead of weeks.

### 2. The "Dual-Engine" Architectural Mental Model

Solo developers must discard a common misconception: expecting an LLM to generate raw 3D mesh files containing tens of thousands of polygons from pure text is inefficient. The state-of-the-art production workflow relies on **complementary synergy between GPT-6 Astra, native 3D generation (Tripo3D), and professional DCC software (Blender)**:

```Plaintext
[ Creative Concept & Spatial Requirements ]
                    │
                    ▼
[ GPT-6 Astra (3D Art Director & Technical Artist) ] ──> Structured Prompt Expansion (Topology / PBR / Scaling)
                    │
                    ▼
[ Tripo3D (Native 3D Geometry & Material Engine) ]   ──> Generates Continuous Mesh (Quad Topology, UVs, PBR GLB)
                    │
                    ▼
[ Blender + bpy / Blender MCP (Astra Auto-Control) ] ──> Origin Centering, 3-Point Lighting, Viewport Regression
                    │
                    ▼
[ Frontend Web / Game Engine (Three.js / React Three Fiber) ] ──> Zero-Cost Interactive Distribution
```

*   **Tripo3D (Native Geometry & Material Synthesis)**: Trained on hundreds of millions of 3D meshes, it generates clean, quad-dominant watertight meshes with PBR maps (Albedo / Roughness / Metallic / Normal) from single images or text prompts.
*   **GPT-6 Astra (Technical Director & Automation Pipeline Hub)**: Acts as the Lead Technical Artist (TA). It structures prompts, manages project specs, and takes over Blender via Python (`bpy`) or **Blender MCP** to automate asset centering, studio lighting, camera rigs, and autonomous visual inspection.

### 3. Step-by-Step Production Walkthrough

#### Step 1: Structure 3D Prompts via GPT-6 Astra
Instruct Astra in your terminal or desktop prompt:

```text
Act as a Lead 3D Technical Artist. I want to build a "Cyberpunk Holographic Vending Machine" for a Web 3D product showcase.
Generate an engine-optimized, structured 3D prompt for Tripo3D.

Requirements:
1. Emphasize silhouette and geometric symmetry;
2. Enforce mesh topology tags (Clean quad topology, game-ready, low-poly);
3. Define PBR material specifications (Matte painted metal, glowing neon emissive panels).
```

Astra outputs a production-ready prompt:

```text
Cyberpunk holographic vending machine, freestanding rectangular kiosk with chamfered edges.
Center features transparent acrylic dispenser bay with internal glowing LED strip.
Materials: Brushed matte dark gray titanium alloy (roughness: 0.35, metallic: 0.85),
glowing cyan neon emissive trim lines (emission strength: 5.0), scratched hazard decals on base.
Topology tags: clean quad-dominant topology, watertight mesh, manifold geometry, PBR 4K textures, game-ready asset.
```

#### Step 2: Generate & Export Standardized GLB via Tripo3D
Paste the refined prompt into [Tripo3D](https://www.tripo3d.ai/zh/3d-prompts/models/gpt-6-astra). Within 30 seconds, Tripo3D synthesizes the mesh, UV layout, and textures. Download the asset as **`vending_machine.glb`** and save it into `public/models/`.

#### Step 3: Automate Blender via GPT-6 Astra (`pipeline.py`)
Instead of wrestling with manual GUI dials, have Astra write and execute a headless Blender Python automation script:

```python
import bpy
import math

# 1. Clean factory environment
bpy.ops.wm.read_factory_settings(use_empty=True)

# 2. Import Tripo3D GLB asset
asset_path = "./public/models/vending_machine.glb"
bpy.ops.import_scene.gltf(filepath=asset_path)

# 3. Compute bounding box, center origin, and ground asset (Z=0)
imported_objs = [obj for obj in bpy.context.selected_objects if obj.type == 'MESH']
if imported_objs:
    bpy.ops.object.select_all(action='DESELECT')
    for obj in imported_objs:
        obj.select_set(True)
    bpy.context.view_layer.objects.active = imported_objs[0]
    bpy.ops.object.origin_set(type='ORIGIN_GEOMETRY', center='BOUNDS')
    
    min_z = min([v[2] for obj in imported_objs for v in [obj.matrix_world @ v.co for v in obj.data.vertices]])
    for obj in imported_objs:
        obj.location.z -= min_z

# 4. Automated Studio Three-Point Lighting
# Key Light
key_light_data = bpy.data.lights.new(name="Key_Light", type='AREA')
key_light_data.energy = 500
key_light_data.size = 2.0
key_light = bpy.data.objects.new(name="Key_Light", object_data=key_light_data)
key_light.location = (3.0, -3.0, 4.0)
bpy.context.collection.objects.link(key_light)

# Fill Light
fill_light_data = bpy.data.lights.new(name="Fill_Light", type='AREA')
fill_light_data.energy = 200
fill_light_data.size = 3.0
fill_light = bpy.data.objects.new(name="Fill_Light", object_data=fill_light_data)
fill_light.location = (-3.0, -2.0, 2.0)
bpy.context.collection.objects.link(fill_light)

# Rim Light
rim_light_data = bpy.data.lights.new(name="Rim_Light", type='SUN')
rim_light_data.energy = 3.0
rim_light = bpy.data.objects.new(name="Rim_Light", object_data=rim_light_data)
rim_light.location = (0.0, 4.0, 3.0)
rim_light.rotation_euler = (math.radians(-45), 0, math.radians(180))
bpy.context.collection.objects.link(rim_light)

# 5. Product Showcase Camera
cam_data = bpy.data.cameras.new("Product_Camera")
cam_obj = bpy.data.objects.new("Product_Camera", cam_data)
cam_obj.location = (0, -4.5, 2.0)
cam_obj.rotation_euler = (math.radians(72), 0, 0)
bpy.context.collection.objects.link(cam_obj)
bpy.context.scene.camera = cam_obj

# 6. Eevee Next Headless Inspection Render
bpy.context.scene.render.engine = 'BLENDER_EEVEE_NEXT'
bpy.context.scene.render.resolution_x = 1280
bpy.context.scene.render.resolution_y = 720
bpy.context.scene.render.filepath = "./public/renders/validation_preview.png"

bpy.ops.render.render(write_still=True)
print("✅ Headless Blender validation frame generated: ./public/renders/validation_preview.png")
```

Execute in background mode:
```bash
blender --background --python pipeline.py
```
Astra immediately inspects `validation_preview.png` using multimodal vision, identifying any inverted normals or lighting washouts and self-correcting script parameters automatically.

#### Step 4: Instant Web Embed (React Three Fiber / Three.js)
Distribute the optimized GLB asset directly inside your Next.js 15 or Vite web application:

```tsx
// components/VendingMachineViewer.tsx
import { Canvas } from '@react-three/fiber';
import { useGLTF, OrbitControls, Environment } from '@react-three/drei';

export function VendingMachineViewer() {
  const { scene } = useGLTF('/models/vending_machine.glb');
  return (
    <div className="w-full h-[500px] bg-slate-900 rounded-xl overflow-hidden shadow-2xl">
      <Canvas camera={{ position: [0, 2, 4], fov: 45 }}>
        <ambientLight intensity={0.7} />
        <directionalLight position={[5, 10, 5]} intensity={1.2} />
        <primitive object={scene} position={[0, -1, 0]} />
        <Environment preset="city" />
        <OrbitControls autoRotate autoRotateSpeed={2.0} enableZoom={true} />
      </Canvas>
    </div>
  );
}
```

---

## 13.7 Cost Optimization & Elastic Routing: Codex Switch in Practice

In the 2026 multi-model ecosystem, seasoned indie developers avoid vendor lock-in with a resilient routing strategy:

1. **Tiered Model Routing**: Standard everyday development runs on `gpt-5.6-terra`, lightweight approvals run on `gpt-5.6-luna`, reserving `gpt-6-astra` for complex multi-app visual audits, 3D spatial computing, and full-system architecture.
2. **Multi-Provider Failover & Seamless Continuation**: When OpenAI account limits (rate limits or 3-hour quotas) are hit, use the open-source companion tool **[Codex Switch](https://github.com/aipmer/codex-switch)** to toggle instantly to DeepSeek or Kimi Code. Its **cross-provider session continuation engine** preserves existing conversation context and SQLite thread history without losing state.

---

## 13.8 Migration Checklist (TL;DR)

```bash
# ① Desktop: install the ChatGPT client
winget install OpenAI.ChatGPT        # Windows

# ② Upgrade the CLI to 0.147.0+
npm install -g @openai/codex@latest

# ③ Upgrade models to the GPT-6 Astra / GPT-5.6 hierarchy
grep -rn "gpt-5.4" ~/.codex/ .       # full audit to replace retired models

# ④ Replace the removed --full-auto flag
codex exec --sandbox workspace-write "<task>"

# ⑤ Enable Guardian auto-approval
codex --approve-for-me "<task>"

# ⑥ Seamless multi-provider failover with Codex Switch
git clone https://github.com/aipmer/codex-switch.git && cd codex-switch && ./install.sh
codex-switch --to deepseek

# ⑦ Install plugin marketplaces and the security plugin
codex plugin marketplace add <catalog-url>
codex plugin install codex-security
```

---

## 🛡️ Troubleshooting & Pitfall Cheat Sheet

| Common Pitfall | Root Cause | Rapid Diagnosis & Fix Guide |
| :--- | :--- | :--- |
| `Unknown argument: --full-auto` | 0.14x completely removed this flag, aborting scripts | Replace with `--sandbox workspace-write` |
| `API Error: Model 'gpt-5.4' is deprecated` | Model retired after August 31 | Edit `~/.codex/config.toml` and change model to `gpt-5.6-terra` |
| `Failed to install plugin: catalog not found` | Marketplace catalog URL is unreachable or blocked | Check network connectivity, or install via local path: `codex plugin install ./my-plugin` |

---

## 13.7 The Constants That Survive Every Version

The tooling lesson is singular: **every version number, CLI flag, and model codename hard-coded into scripts is technical debt**. Centralize them in `config.toml` and `AGENTS.md`, so migration cost collapses to "edit one line."

And the three principles that outlive every release cycle are exactly what this book keeps hammering: goal-driven rather than step-driven, boundaries first rather than post-mortem blame, and human-in-the-loop orchestrating the AI rather than being led by it. Tools change blood; your mindset compounds.

---

[ 🏠 Index ](/en/) | [ ⬅️ Prev (Ch.12) ](./ch12_commercialization.md) | [ 🌐 中文版 ](../chapters/ch13_2026_frontier.md)
