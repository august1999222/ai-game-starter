# 可复用网页小游戏标准模板

这是一个面向小型网页游戏的起步仓库。它把“可测试的游戏规则”和“Phaser 画面表现”分开，并预先配置 TypeScript、Vite、Vitest、Playwright、ESLint、Prettier 及 GitHub 自动检查。

仓库自带一个可以完整删除的冒烟演示：页面显示方块与分数，点击或触摸画布会让方块移动并加分，点击“重新开始”会恢复初始状态。演示只用于证明输入、规则、渲染和测试链路可用，不代表任何正式游戏设计。

演示的试玩假设是：首次打开模板的使用者无需额外讲解，就能在一次尝试内点击或触摸画布，使方块移动并看到分数变化，然后用“重新开始”恢复 0 分。自动化测试验证这条操作路径；是否真正做到“无需讲解”，应按 `docs/04_PLAYTEST_PLAN.md` 安排真人试玩确认。

## 适合用来做什么

- 快速验证一个明确的试玩假设。
- 用纯 TypeScript 编写可重复测试的游戏规则。
- 用 Phaser 处理输入、显示、动画和音效。
- 在提交合并前自动完成格式、质量、测试和构建检查。

本模板默认不包含后端、数据库、账号、登录、支付、广告或在线 AI 服务，也不应在浏览器代码中保存任何密钥。

## 环境要求

- Git。
- Node.js 22.13.0 或 `package.json` 中 `engines` 声明的更高兼容稳定版本。
- npm 10.9.0 或更高兼容稳定版本（Node.js 安装包会附带）。
- 可选：GitHub Desktop，适合不熟悉命令行的使用者。

在终端运行以下命令检查是否安装成功：

```text
node --version
npm --version
```

请不要使用测试版、Beta 或 RC 版 Node.js。若命令不存在，请从 Node.js 官方网站安装 LTS 版本，然后重新打开终端。

## 安装与启动

克隆仓库后，在仓库根目录执行：

```text
npm ci
npm run dev
```

终端会显示本地访问地址，通常是 `http://localhost:5173`。在浏览器打开该地址即可试玩。停止开发服务器时，在终端按 `Ctrl+C`。

`npm ci` 会严格按照 `package-lock.json` 安装依赖，适合日常开发和持续集成。只有在有意识地升级依赖时才使用 `npm install`，并应同时审查 `package.json` 与 lockfile 的变化。

## 常用命令

| 命令                   | 用途                             |
| ---------------------- | -------------------------------- |
| `npm run dev`          | 启动本地开发服务器               |
| `npm run format`       | 自动整理受支持文件的格式         |
| `npm run format:check` | 检查格式但不改文件               |
| `npm run lint`         | 运行 ESLint                      |
| `npm run typecheck`    | 运行 TypeScript 类型检查         |
| `npm run test`         | 运行 Vitest 单元与集成测试       |
| `npm run build`        | 生成生产构建                     |
| `npm run preview`      | 本地预览生产构建                 |
| `npm run test:e2e`     | 运行 Playwright 端到端测试       |
| `npm run check`        | 按 CI 顺序运行全部本地检查与测试 |

第一次运行端到端测试前，如本机尚无 Playwright 浏览器，请执行：

```text
npx playwright install chromium
```

提交合并请求前，至少依次运行：

```text
npm run format:check
npm run lint
npm run typecheck
npm run test
npm run build
npm run test:e2e
```

## 项目结构

```text
.github/                 GitHub Actions、Dependabot 与合并请求模板
docs/                    需求、游戏设计、范围、试玩、指标和决策模板
public/assets/           自有或已获授权的音频、字体与图片
src/core/                纯 TypeScript 游戏规则；不得依赖 Phaser 或浏览器
src/config/              数值、关卡和可调配置
src/game/scenes/         Phaser 场景；负责编排输入与显示
src/game/entities/       可见游戏对象
src/game/input/          键盘、鼠标和触摸输入适配
src/game/effects/        动画、粒子、屏幕反馈等表现
src/game/ui/             游戏内界面
src/platform/            平台与浏览器能力的隔离层
src/main.ts              应用入口
tests/unit/              核心规则的快速单元测试
tests/integration/       模块协作测试
tests/e2e/               浏览器端到端测试
TASK.md                  当前唯一任务
AGENTS.md                编码代理协作规则
```

核心依赖方向应保持简单：

```text
Phaser 场景/输入/UI -> src/core 公开函数 -> 新状态
                     -> src/config 配置
平台实现             -> src/platform 接口
```

`src/core` 只接收普通数据并返回普通数据。相同初始状态、固定种子和相同输入必须得到相同结果。场景可以播放动画，但不能成为计分、胜负、移动合法性或重启规则的唯一来源。

## 推荐文档与开发流程

```text
需求发现与定义 → 一页 GDD → MVP 范围 → 核心循环 → 实现 → 试玩 → 指标分析 → 决策
```

1. 用 `docs/00_PRODUCT_REQUIREMENTS.md` 定义机会、目标玩家、场景、需求、约束、假设和进入设计阶段的条件。
2. 用 `docs/01_ONE_PAGE_GDD.md` 设计满足已确认需求的游戏方案。
3. 用 `docs/02_MVP_SCOPE.md` 选择本轮要验证的最小范围，再用 `docs/03_CORE_LOOP.md` 定义循环与规则边界。
4. 通过 `TASK.md` 实现一个可追溯到需求编号或试玩假设的当前任务。
5. 按 `docs/04_PLAYTEST_PLAN.md` 试玩，用 `docs/05_METRICS.md` 分析待验证指标，再在 `docs/06_DECISIONS.md` 记录继续、调整或停止的决定。

通用模板只保留可复制填写的空白需求模板。使用模板创建具体游戏仓库后，再填写真实项目需求；需求尚未确认，或需求确认中尚未允许进入游戏设计阶段时，不进入正式功能开发。

## 如何从模板创建新游戏

1. 在 GitHub 仓库页面选择 **Use this template**，创建一个新仓库；也可以复制本地文件，但不要复制旧仓库的 `.git`。
2. 使用 GitHub Desktop 将新仓库克隆到电脑，创建一个短生命周期功能分支。
3. 先填写 `docs/00_PRODUCT_REQUIREMENTS.md`；只有需求确认明确允许进入设计阶段，才继续正式游戏设计与开发。
4. 再依次填写 `docs/01_ONE_PAGE_GDD.md`、`docs/02_MVP_SCOPE.md`、`docs/03_CORE_LOOP.md`，并在 `docs/06_DECISIONS.md` 记录关键取舍。
5. 在 `TASK.md` 只写一个当前任务，关联需求编号或试玩假设，并填写范围、验收标准和测试计划。
6. 修改 `package.json` 中的项目名称与说明，但不要随意增加依赖。
7. 先在 `src/core` 实现规则和测试，再让 Phaser 场景调用规则并补充浏览器测试。
8. 把游戏数值、关卡数据和可调参数放进 `src/config`，不要散落在场景里。
9. 只使用自制、公共领域或已明确授权的素材，并在项目中记录来源和许可证。
10. 完成本页列出的全部检查，通过试玩后再合并到 `main`。

## 如何删除通用演示

建议先在新分支操作，并保持每一步都能启动：

1. 删除或改写 `src/core/gameState.ts` 中的演示状态与动作，并同步更新 `src/core/index.ts`；保留 `src/core/random.ts` 供新游戏复用。
2. 删除或替换 `src/config/gameConfig.ts` 和 `src/config/levels.ts` 中的演示数值与关卡占位数据。
3. 用新游戏场景替换 `src/game/scenes/SmokeDemoScene.ts`，并让 `src/main.ts` 注册新场景。
4. 替换 `src/platform/webUi.ts` 中只服务于演示分数和重启按钮的页面绑定；按新页面需要更新 `index.html` 与 `src/styles.css`。
5. 将 `tests/unit/gameState.test.ts`、`tests/integration/demoSession.test.ts` 和 `tests/e2e/smoke.spec.ts` 的演示断言替换为新游戏的验收测试；保留 `tests/unit/random.test.ts` 对确定性随机数的验证。
6. 稳定的测试接口应继续使用 `data-testid` 或等价标识。搜索 `SmokeDemo`、`demo`、演示页面文字和旧测试标识，确认没有残留。
7. 运行 `npm run check`；若任一步失败，先恢复当前分支可运行状态，再继续删减。

不要直接把规则改写进 Phaser 场景，也不要删除构建、测试、安全扫描或依赖更新配置。

## 推荐分支流程

1. `main` 始终保持可安装、可启动、可测试和可构建。
2. 从最新 `main` 创建一个只解决当前 `TASK.md` 的分支，例如 `feat/tap-feedback` 或 `fix/restart-state`。
3. 小步修改并在本地运行相关测试。
4. 发起 Pull Request，填写变更目的、关联需求编号/试玩假设、验证方式、测试结果、风险与回滚。
5. 等 CI 全部通过并完成试玩复核后再合并。
6. 合并后删除功能分支，再更新 `TASK.md` 为下一个任务。

不要在一个分支混入无关重构、依赖升级和新玩法。自动测试通过是合并的必要条件，不替代真人试玩。

## 设置为 GitHub Template Repository

需要仓库管理员在 GitHub 网页完成一次设置：

1. 打开仓库的 **Settings**。
2. 在 **General** 页面找到 **Template repository**。
3. 勾选该选项；若看不到，请确认自己拥有管理员权限。
4. 回到仓库首页，确认出现 **Use this template** 按钮。
5. 创建一个临时仓库验证模板文件完整、`.git` 历史不会被复制，并删除临时仓库。

设置模板属性不会替代分支保护。建议为 `main` 启用 Pull Request、必需状态检查和禁止直接推送等保护规则。

## 常见问题排查

### `node` 或 `npm` 命令不存在

安装 Node.js LTS，关闭并重新打开终端。仍失败时，检查 Node.js 是否加入系统 `PATH`。

### `npm ci` 提示 `package.json` 与 lockfile 不一致

不要手工编辑 lockfile。确认没有遗漏他人的依赖变更；确实需要更新依赖时，在干净分支运行 `npm install`，审查两个文件后重新执行 `npm ci`。

### 页面空白或画布没有出现

先查看启动终端与浏览器开发者工具中的第一条错误。确认从仓库根目录启动、依赖安装完整，并检查 `src/main.ts` 是否仍注册了有效场景。

### 点击没有反应

确认点击的是画布，且没有其他元素盖住画布。规则变化应能在 `src/core` 测试中复现；输入映射问题则检查 `src/game/input` 与场景绑定。

### 端到端测试找不到浏览器

运行 `npx playwright install chromium` 后重试。Linux CI 环境通常需要由工作流安装浏览器及系统依赖。

### 测试偶尔失败

不要简单重跑后忽略。移除对真实时间、无种子随机数、动画完成时机和不稳定选择器的依赖；规则测试使用固定种子，页面测试使用稳定测试标识。

### 端口已被占用

停止旧的开发服务器，或按照 Vite 提示使用新端口。Playwright 应使用配置中的固定测试服务器地址。

### 可以添加新的库吗

先证明现有工具无法以简单方式完成任务，再在 `docs/06_DECISIONS.md` 记录用途、替代方案、包体和维护风险。未经任务明确允许，不要擅自安装。

## 许可证

本模板代码采用 [MIT License](./LICENSE)。游戏项目使用的第三方素材可能有各自许可证，必须单独核验和记录。
