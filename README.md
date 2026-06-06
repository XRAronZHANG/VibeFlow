# VibeFlow · 灵感微流

一个 **纯前端（Local-First）** 的“灵感 → 3 分钟微行动 → 任务日历”小工具：把天马行空变成可执行的下一步，并用一点点仪式感（功德）帮助启动行动。

> 这是课程作业版本：本仓库包含前端页面与一个 Netlify Function（用于代理调用 DeepSeek，避免访客需要自带 API Key）。

## 在线体验（Live Demo）

老师可以直接打开以下链接体验（推荐用电脑 Chrome / Edge）：  
https://vibeflowbyaron.netlify.app/

---

## 功能概览

- **The Void · 极致输入区**
  - **发射**：把一句话存入「灵感星空」（仅支持点击按钮发射，避免误触回车）
  - **入历**：把输入的一段话解析为 1 个日历任务并加入日历（AI / 失败回退本地）
  - **AI 给条路**：让 AI 生成一段“可行路径/步骤清单”（参考用），并可将其中任一步加入收集箱（再编辑后入历）
- **灵感星空 / 墓地**
  - 手动送墓地 + 自动“发霉”（默认 12 小时）进入墓地；支持抢救与永久删除
  - 灵感乱炖：勾选多条合成新灵感（可编辑后接受合并）
- **Micro‑Action Mat · 微行动看板**
  - 选中灵感后生成微行动拆解 + 倒计时
  - **从星入历**：从当前选中灵感生成 1–3 个任务候选，选择加入日历
- **日历 + 任务**
  - 月视图、选日查看任务、任务增删改完成
  - 连胜与今日完成率（基于“当天任务全部完成”或“当天无任务但完成 1 次微行动”）
- **天气**
  - 浏览器定位 + Open‑Meteo 8 天预报（不需要 API Key）
- **使用说明（新手引导）**
  - 第一次打开会自动弹出使用说明，之后可通过右上角「使用说明」随时再次打开

---

## Demo（作业展示建议）

> https://vibeflowbyaron.netlify.app/。

建议展示顺序：
1) 打开站点 → 自动弹出「使用说明」
2) The Void 输入一句话 → 发射
3) 点一颗星 → 3 分钟微动 → 标记完成 → 功德 +1
4) AI 给条路 → 选一步加入收集箱 → 再入历

---

## 设计理念（Why this exists）

- **先启动，再完美**：对拖延/ADHD 脑来说，最难的是“开始”。所以核心是把想法压缩到 **3 分钟微行动**。
- **路径是参考，不是强约束**：AI 的作用是给你一个“可行路径”，而不是强制你按格式执行；你可以挑任一步进入收集箱再入历。
- **代谢机制**：灵感会“发霉”进入墓地，避免星空堆积；需要时可抢救复活。
- **轻仪式奖励**：功德/木鱼是即时反馈，帮助形成“开始—完成”的正循环。

---

## 数据管理（备份/导入/清空）

在「设置 → 数据管理」里提供：
- **导出 JSON**：把本地数据导出为备份文件
- **导入 JSON**：从备份恢复（会覆盖本地数据）
- **清空数据**：双击确认清空本地数据并刷新页面

---

## 隐私（Privacy）

- 本项目为 **Local‑First**：灵感、任务、收集箱、统计等默认保存在浏览器 **localStorage**。
- AI 功能会将你输入的文本（例如灵感、路径请求）通过站点代理发送到 DeepSeek 进行生成；如果你不希望发送内容，可在设置中关闭 AI。
- 天气功能会请求浏览器定位权限；拒绝授权不会影响其他功能。

---

## 限制（Limitations）

- 数据存于 localStorage：**不支持多设备同步**，清理浏览器数据可能导致内容丢失（建议定期导出备份）。
- AI 能力受网络与限流影响：失败时会提示，你仍可手动编辑步骤/任务并继续使用。

## 代码结构

本项目刻意保持简单：

```
.
├─ index.html                 # 单文件前端应用（Tailwind CDN + Lucide CDN）
├─ netlify.toml               # Netlify 构建/Functions 配置
└─ netlify/
   └─ functions/
      └─ ai.js                # Netlify Function：DeepSeek 代理
```

---

## 依赖与外部服务

### 前端依赖（CDN）
- TailwindCSS CDN：`https://cdn.tailwindcss.com`
- Lucide Icons：`https://unpkg.com/lucide@latest`
- Google Fonts：Inter、Noto Sans SC

### 外部 API
- **DeepSeek（可选）**：用于 AI 拆解、路线生成等  
  - 本项目通过 **Netlify Function** 代理调用：前端不会要求访客输入 Key
- **Open‑Meteo（可选）**：天气预报（无需 Key）

### 数据存储
- 所有用户数据（灵感、任务、设置、统计）都保存在浏览器 **localStorage** 中。

---

## 如何运行（本地）（不建议本地运行，建议直接体验线上demo）

### 方式 1：直接打开（最简单）
双击打开 `index.html` 即可使用大部分功能。

> 注意：AI 会尝试调用 `/.netlify/functions/ai`。本地没有 Functions 时会报错并自动回退到本地模板（不影响基础使用）。

### 方式 2：本地起静态服务器（推荐）

在仓库根目录运行：

```bash
python3 -m http.server 8000
```

然后访问：
`http://localhost:8000`

### 方式 3：本地模拟 Netlify Functions（用于测试 AI 代理）

1) 安装 Netlify CLI

```bash
npm i -g netlify-cli
```

2) 在根目录创建 `.env`（或在终端里导出环境变量）

`.env` 示例：
```bash
DEEPSEEK_API_KEY=你的key
DEEPSEEK_BASE_URL=https://api.deepseek.com
DEEPSEEK_MODEL=deepseek-v4-flash
```

3) 启动
```bash
netlify dev
```

默认会给出一个本地地址（通常是 `http://localhost:8888`），并可通过：
`http://localhost:8888/.netlify/functions/ai` 访问函数。

---

## 如何部署（Netlify + GitHub）

1) 把本仓库推送到 GitHub（确保路径保持不变）：
   - `netlify.toml`
   - `netlify/functions/ai.js`

2) 在 Netlify 新建站点并连接该 GitHub 仓库

3) 在 Netlify 后台配置环境变量（Site settings → Environment variables）
   - `DEEPSEEK_API_KEY`（必填）
   - `DEEPSEEK_BASE_URL=https://api.deepseek.com`（推荐）
   - `DEEPSEEK_MODEL=deepseek-v4-flash`（推荐）

4) 触发一次重新部署（push commit 或 Trigger deploy）

```

---

## 常见问题（Troubleshooting）

### 1) 页面提示 “DeepSeek 调用失败：HTTP 404”
说明 **Netlify Function 没有部署出来**。请检查：
- GitHub 仓库里是否存在：`netlify/functions/ai.js`
- `netlify.toml` 是否存在且包含：
  ```toml
  [build]
    publish = "."
    functions = "netlify/functions"
  ```
- Netlify 是否已重新部署

### 2) 函数返回 “Missing DEEPSEEK_API_KEY”
说明站点环境变量没配好，或配好后未重新部署。到 Netlify 的 Environment variables 设置并重新部署。

### 3) AI 功能偶尔失败 / 回退本地
AI 相关功能（例如“灵感拆解”“乱炖”“从星入历”“AI 给条路”等）会通过 Netlify Function 代理调用 DeepSeek。网络波动、限流或模型输出不规整都可能导致失败；本项目会给出提示，并允许你手动把路径改成“每行一步”后再解析/加入收集箱，以保证基础流程可用。

---

## 备注

- 本项目无后端数据库；换浏览器/换设备会是全新数据（因为使用 localStorage）。
- 若需要多设备同步、登录系统、提醒通知等，需要引入后端或第三方服务（当前作业版本未实现）。
