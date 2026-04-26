"use client";

import { useState, useEffect, useRef } from "react";

// ─── DATA ────────────────────────────────────────────────────────────────────

const CUT_ITEMS = [
  { name: "Turborepo / Monorepo", reason: "只有大团队用，面试不常问，学完再说" },
  { name: "Playwright E2E", reason: "Vitest 已经够面试用，E2E 是加分项不是必须" },
  { name: "tRPC 深入", reason: "了解概念即可，实际用到再深入" },
  { name: "Bun", reason: "还没主流化，不影响求职" },
  { name: "React 19 全部新API", reason: "了解 use() 和 Actions 概念就够，不用精通" },
];

const WEEKS = [
  {
    id: 1, title: "Next.js App Router + TypeScript",
    color: "#38BDF8", totalHours: "~11 hrs",
    goal: "能独立搭一个 Next.js 14+ 项目，讲清楚 RSC 是什么",
    weekdays: [
      { id:"1-1", day:"Mon", label:"Next.js App Router 核心概念", type:"📖 读文档", time:"1hr", task:"读 Next.js 官方文档 App Router 部分：理解 app/ 目录结构、layout.tsx、page.tsx、loading.tsx、error.tsx 各自的作用。不需要动手，先把思维模型建立起来。", link:"nextjs.org/docs/app/building-your-application/routing" },
      { id:"1-2", day:"Tue", label:"Server Components vs Client Components", type:"📖 读文档", time:"1hr", task:"这是面试必考题。重点理解：RSC 在服务端渲染，没有 useState/useEffect；'use client' 边界是什么；两者如何组合使用。读完后能用自己的话解释这个区别。", link:"nextjs.org/docs/app/building-your-application/rendering" },
      { id:"1-3", day:"Wed", label:"Next.js Data Fetching + Server Actions", type:"📖 读文档", time:"1hr", task:"Server Component 里直接 async/await fetch()；Static vs Dynamic rendering；Server Actions 基本用法（'use server'）。这块取代了以前的 getServerSideProps。", link:"nextjs.org/docs/app/building-your-application/data-fetching" },
      { id:"1-4", day:"Thu", label:"TypeScript 进阶：Utility Types", type:"📖 练习", time:"1hr", task:"专攻面试高频：Partial<T>、Required<T>、Pick<T,K>、Omit<T,K>、ReturnType<T>、Parameters<T>。每个写一个实际用例，不要只看定义。", link:"typescriptlang.org/docs/handbook/utility-types.html" },
      { id:"1-5", day:"Fri", label:"TypeScript 进阶：Generics + discriminated unions", type:"📖 练习", time:"1hr", task:"Generics 实战写法；discriminated union 用于 API response 类型；type vs interface 的实际区别。Total TypeScript 的免费部分值得看。", link:"totaltypescript.com/tutorials" },
      { id:"1-6", day:"Sat", label:"【动手】搭 Next.js 项目骨架", type:"💻 写代码", time:"2-3hrs", task:"npx create-next-app@latest，用 App Router。做一个有 2-3 个页面的应用骨架。要用到：layout.tsx 共享布局、Server Component 请求数据、至少一个 Client Component 有交互、部署到 Vercel。", link:"vercel.com/new" },
      { id:"1-7", day:"Sun", label:"【复盘】整理笔记 + 能回答的问题", type:"📝 复盘", time:"1hr", task:"写下你能回答的问题：'什么是 RSC？'、'Server Actions 和 API Route 什么区别？'、'app router 和 pages router 怎么选？'。用自己的话，不用很完美。", link:"" },
    ]
  },
  {
    id: 2, title: "GraphQL + 现代数据获取",
    color: "#A78BFA", totalHours: "~11 hrs",
    goal: "能用 Apollo Client 查 GraphQL API，理解和 REST 的核心区别，会用 TanStack Query",
    weekdays: [
      { id:"2-1", day:"Mon", label:"GraphQL 核心概念", type:"📖 读文档", time:"1hr", task:"只看这几个概念：Schema / Type System、Query vs Mutation vs Subscription、Resolver 是什么、为什么比 REST 灵活（客户端决定数据形状）。推荐 How to GraphQL 的前3节。", link:"howtographql.com" },
      { id:"2-2", day:"Tue", label:"Apollo Client：useQuery + useMutation", type:"📖 读文档", time:"1hr", task:"重点：ApolloProvider 怎么配置、useQuery 的 loading/error/data、useMutation 的用法、gql 模板字符串写查询。暂时跳过缓存机制，先把基本用法搞清楚。", link:"apollographql.com/docs/react/get-started" },
      { id:"2-3", day:"Wed", label:"Apollo Client：缓存 + optimistic updates", type:"📖 读文档", time:"1hr", task:"InMemoryCache 的工作原理、cache.modify 和 refetchQueries 两种更新策略、optimistic response 是什么。这块是面试会深挖的地方，Senior 需要能解释 cache 策略选择。", link:"apollographql.com/docs/react/caching/overview" },
      { id:"2-4", day:"Thu", label:"TanStack Query 核心", type:"📖 读文档", time:"1hr", task:"即使用 REST 也必须会。useQuery / useMutation / useInfiniteQuery 三个核心 hook；queryKey 设计；invalidateQueries 触发刷新；staleTime 和 gcTime 的区别。", link:"tanstack.com/query/latest/docs/framework/react/overview" },
      { id:"2-5", day:"Fri", label:"Zod + React Hook Form", type:"📖 练习", time:"1hr", task:"Zod 定义 schema → infer TypeScript 类型 → 配合 React Hook Form 做表单验证。这个组合在现代项目里几乎是标配，写一个登录表单练手。", link:"zod.dev / react-hook-form.com" },
      { id:"2-6", day:"Sat", label:"【动手】GitHub GraphQL API 项目", type:"💻 写代码", time:"3hrs", task:"用 Apollo Client 查你自己的 GitHub profile：repos 列表、star 数量、语言统计。加到上周的 Next.js 项目里作为一个页面。目标：至少写 2 个 Query，1 个用上 variables。", link:"docs.github.com/en/graphql/overview/explorer" },
      { id:"2-7", day:"Sun", label:"【复盘】REST vs GraphQL 对比总结", type:"📝 复盘", time:"1hr", task:"写出你能回答的问题：'GraphQL 解决了 REST 的什么问题？'、'什么情况下不用 GraphQL？'（over-engineering）、'N+1 问题是什么？'。面试官喜欢问 trade-off。", link:"" },
    ]
  },
  {
    id: 3, title: "Tailwind + 状态管理 + 工具链",
    color: "#34D399", totalHours: "~10 hrs",
    goal: "项目看起来像真实产品，会用现代工具链，Zustand 能替代 Redux 解释",
    weekdays: [
      { id:"3-1", day:"Mon", label:"Tailwind CSS v3 实战", type:"📖 练习", time:"1hr", task:"重点：JIT 模式原理、@layer 自定义、arbitrary values [w-[137px]]、响应式 sm:/md:/lg: 前缀、dark: 模式。直接在项目里改样式，边改边记。", link:"tailwindcss.com/docs" },
      { id:"3-2", day:"Tue", label:"shadcn/ui 哲学 + 实践", type:"📖 练习", time:"1hr", task:"理解它不是 npm 包而是 copy-paste 到你项目里的组件。装几个常用组件：Button、Dialog、Form、Table。看懂 cn() 工具函数。这个理解本身就是面试加分点。", link:"ui.shadcn.com" },
      { id:"3-3", day:"Wed", label:"Zustand 状态管理", type:"📖 练习", time:"1hr", task:"create store、selector 用法（避免不必要重渲染）、devtools 中间件、persist 本地存储。重点能解释：为什么比 Redux 简单？和 TanStack Query 怎么分工？（服务器状态 vs 客户端状态）", link:"zustand-demo.pmnd.rs" },
      { id:"3-4", day:"Thu", label:"Vite + 现代构建工具", type:"📖 读文档", time:"1hr", task:"重点理解：为什么比 Webpack 快（ESM native dev server）、基本 vite.config.ts 配置、环境变量、build 优化。不需要深入插件开发，能配置和解释原理就够。", link:"vitejs.dev/guide" },
      { id:"3-5", day:"Fri", label:"React 性能优化", type:"📖 练习", time:"1hr", task:"useMemo/useCallback 的正确使用时机（更重要的是知道什么时候不用）；React DevTools Profiler 怎么用；code splitting 和 dynamic import；列表虚拟化概念（react-virtual）。", link:"react.dev/learn/render-and-commit" },
      { id:"3-6", day:"Sat", label:"【动手】把项目做成真实产品样子", type:"💻 写代码", time:"2-3hrs", task:"给之前的 Next.js 项目加上：shadcn/ui 组件替换原有 UI、Zustand 管理一个客户端状态（比如主题/用户偏好）、Tailwind 让页面响应式。目标：截图放 GitHub README 看起来像真实产品。", link:"" },
      { id:"3-7", day:"Sun", label:"【Lighthouse 性能审计】", type:"💻 写代码", time:"1hr", task:"对你的 Vercel 部署跑 Lighthouse，记录 LCP/CLS/INP 分数。找一个问题优化它，记录优化前后数据。哪怕只从 72 → 89，面试时能说出具体数字非常加分。", link:"pagespeed.web.dev" },
    ]
  },
  {
    id: 4, title: "测试 + CI/CD + AI 集成",
    color: "#FB923C", totalHours: "~9 hrs",
    goal: "项目有测试覆盖，有 CI/CD pipeline，加一个 AI 功能亮点",
    weekdays: [
      { id:"4-1", day:"Mon", label:"Vitest 单元测试", type:"📖 练习", time:"1hr", task:"Vitest 的配置（和 Vite 共用配置）、@testing-library/react 测 React 组件、vi.mock() 模拟模块、MSW 模拟 API 请求。给你项目里一个工具函数和一个组件写测试。", link:"vitest.dev/guide" },
      { id:"4-2", day:"Tue", label:"测试策略：什么值得测？", type:"📖 读文章", time:"1hr", task:"比写测试更重要的是测试策略。读 Kent C. Dodds 的 'Testing Trophy'（不是测试金字塔）。能回答：单元/集成/E2E 各适合什么场景？100% coverage 是目标吗？", link:"kentcdodds.com/blog/the-testing-trophy-and-testing-classifications" },
      { id:"4-3", day:"Wed", label:"GitHub Actions CI/CD", type:"📖 练习", time:"1hr", task:"写一个完整 workflow：触发条件（push/PR）→ install → lint → type-check → test → build。加上 Vercel Preview Deployments。这个 .github/workflows/ci.yml 文件放进项目，面试展示用。", link:"docs.github.com/en/actions" },
      { id:"4-4", day:"Thu", label:"Vercel AI SDK 基础", type:"📖 练习", time:"1hr", task:"useChat hook 实现流式聊天、streamText Server Action 用法。不需要深入，能在项目里加一个 AI 功能就够了（哪怕只是一个简单的 chatbox）。2025年几乎每个产品都有 AI 功能。", link:"sdk.vercel.ai/docs/introduction" },
      { id:"4-5", day:"Fri", label:"Web Vitals + 监控", type:"📖 读文档", time:"1hr", task:"三个核心指标：LCP（最大内容渲染）< 2.5s、INP（交互延迟，FID 的替代）< 200ms、CLS（布局偏移）< 0.1。理解每个指标的含义和常见优化手段。", link:"web.dev/articles/vitals" },
      { id:"4-6", day:"Sat", label:"【动手】加 AI 功能 + 完善测试", type:"💻 写代码", time:"2-3hrs", task:"给项目加一个小 AI 功能（用 Vercel AI SDK + OpenAI），哪怕是 '用 AI 生成项目描述' 这种简单的。同时给核心功能加 2-3 个测试。确保 CI 跑绿。", link:"" },
      { id:"4-7", day:"Sun", label:"【项目收尾】README + 截图 + Demo", type:"📝 整理", time:"1hr", task:"写好 README：项目说明、技术栈 badges、截图或 GIF、部署链接、本地运行步骤。这是你简历里项目链接指向的地方，招聘方会看的。", link:"" },
    ]
  },
  {
    id: 5, title: "简历更新 + 面试冲刺",
    color: "#F472B6", totalHours: "~9 hrs",
    goal: "简历反映新技术栈，能回答前端系统设计题，准备好 behavior questions",
    weekdays: [
      { id:"5-1", day:"Mon", label:"简历技术栈更新", type:"📝 求职", time:"1hr", task:"Skills 区加入：Next.js 14+、TypeScript、GraphQL、Apollo Client、TanStack Query、Tailwind CSS、Zustand、Vitest、Vercel。把项目描述里的动词改成有数据的结果：'reduced LCP by 40%'、'migrated state management from Redux to Zustand'。", link:"levels.fyi 查薪资范围" },
      { id:"5-2", day:"Tue", label:"简历项目描述重写", type:"📝 求职", time:"1hr", task:"用 STAR 格式重写每个项目：Situation（背景）、Task（任务）、Action（具体做了什么技术决策）、Result（结果，有数字最好）。面试官花 6 秒扫简历，每个项目只有 2-3 行，必须有技术深度。", link:"" },
      { id:"5-3", day:"Wed", label:"前端系统设计：Feed流 / 无限滚动", type:"📖 练习", time:"1hr", task:"练习回答：设计一个 Twitter Feed。要覆盖：数据获取策略（TanStack Query + cursor pagination）、虚拟化、optimistic updates、实时更新方案（polling vs WebSocket vs SSE）。", link:"greatfrontend.com/system-design" },
      { id:"5-4", day:"Thu", label:"前端系统设计：实时功能 / 权限系统", type:"📖 练习", time:"1hr", task:"两个高频题：(1) 设计一个实时协作编辑器（WebSocket、OT 概念）；(2) 设计前端权限系统（RBAC、Protected Routes、token refresh 策略）。", link:"greatfrontend.com/system-design" },
      { id:"5-5", day:"Fri", label:"Behavior Questions 准备", type:"📖 练习", time:"1hr", task:"准备5个故事：(1) 技术决策/架构重构；(2) 和设计/产品的分歧如何解决；(3) 最难的 bug；(4) 带领/影响他人；(5) 失败和复盘。Senior 面试50%是 behavior，很多人败在这里。", link:"" },
      { id:"5-6", day:"Sat", label:"【模拟面试】技术题 + 系统设计", type:"💻 练习", time:"2-3hrs", task:"找朋友或用 Pramp 做一次模拟面试。准备好能讲30分钟的项目介绍（你这5周做的那个）。GreatFrontEnd 上做 2-3 道 JavaScript/React 题目（实现 throttle/debounce/Promise.all 那种）。", link:"pramp.com / greatfrontend.com" },
      { id:"5-7", day:"Sun", label:"LinkedIn + 开始投简历", type:"📝 求职", time:"1hr", task:"更新 LinkedIn：Skills 加新技术、项目更新、'Open to work' 打开（可以只对招聘方可见）。整理目标公司清单，按 Dream/Reach/Safe 分类。优先走 Referral 渠道。", link:"levels.fyi / linkedin.com" },
    ]
  }
];

const TYPE_STYLE = {
  "📖 读文档": { bg:"#1e3a5f", color:"#38BDF8" },
  "📖 练习":   { bg:"#1e3a5f", color:"#38BDF8" },
  "📖 读文章": { bg:"#1e3a5f", color:"#38BDF8" },
  "💻 写代码": { bg:"#14532d", color:"#34D399" },
  "📝 复盘":   { bg:"#3b1f5e", color:"#A78BFA" },
  "📝 整理":   { bg:"#3b1f5e", color:"#A78BFA" },
  "📝 求职":   { bg:"#831843", color:"#F472B6" },
  "💻 练习":   { bg:"#14532d", color:"#34D399" },
};

const TAG_COLORS = {
  "RSC / React 原理": "#38BDF8",
  "Next.js":          "#38BDF8",
  "TypeScript":       "#A78BFA",
  "GraphQL":          "#A78BFA",
  "CSS / Tailwind":   "#34D399",
  "状态管理":         "#34D399",
  "性能":             "#FB923C",
  "测试":             "#34D399",
  "求职 / 面试":      "#F472B6",
  "工具链":           "#FB923C",
  "AI / SDK":         "#A78BFA",
  "其他":             "#71717a",
};

const PROB_CATEGORIES = ["Array / Object", "String", "Promise / Async", "DOM / Event", "React Component", "UI 实现", "其他"];
const PROB_DIFF = { Easy: "#10b981", Medium: "#f59e0b", Hard: "#ef4444" };
const PROB_STATUS = { Solved: "#10b981", Attempted: "#f59e0b", Reviewing: "#A78BFA" };

// ─── COMPONENTS ──────────────────────────────────────────────────────────────

function CheckIcon({ done, color }) {
  return (
    <div style={{
      width: 20, height: 20, borderRadius: "50%",
      border: `2px solid ${done ? color : "#3f3f46"}`,
      background: done ? color : "transparent",
      display: "flex", alignItems: "center", justifyContent: "center",
      flexShrink: 0, transition: "all 0.2s", cursor: "pointer"
    }}>
      {done && <span style={{ color:"#000", fontSize:11, fontWeight:700 }}>✓</span>}
    </div>
  );
}

// ─── LOG VIEW ────────────────────────────────────────────────────────────────

function LogView({ logs, setLogs }) {
  const [text, setText]     = useState("");
  const [tag, setTag]       = useState("RSC / React 原理");
  const [mins, setMins]     = useState(60);
  const [date, setDate]     = useState(new Date().toISOString().slice(0,10));
  const [showForm, setShowForm] = useState(false);

  const totalMins = logs.reduce((s, l) => s + (l.mins || 0), 0);
  const totalHrs  = Math.floor(totalMins / 60);
  const remMins   = totalMins % 60;

  const addLog = () => {
    if (!text.trim()) return;
    const entry = { id: Date.now(), date, content: text.trim(), tag, mins: Number(mins) };
    setLogs(prev => [entry, ...prev]);
    setText(""); setShowForm(false);
  };

  const deleteLog = (id) => setLogs(prev => prev.filter(l => l.id !== id));

  const grouped = logs.reduce((acc, l) => {
    if (!acc[l.date]) acc[l.date] = [];
    acc[l.date].push(l);
    return acc;
  }, {});

  const sortedDates = Object.keys(grouped).sort((a,b) => b.localeCompare(a));

  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: "20px 24px 60px" }}>

      {/* Stats bar */}
      <div style={{
        display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap"
      }}>
        {[
          ["📅 学习天数", `${Object.keys(grouped).length} 天`],
          ["⏱ 总时长",   `${totalHrs}h ${remMins}m`],
          ["📝 记录条数", `${logs.length} 条`],
        ].map(([label, val]) => (
          <div key={label} style={{
            flex: 1, minWidth: 120,
            background: "#111113", border: "1px solid #27272a",
            borderRadius: 8, padding: "12px 16px"
          }}>
            <div style={{ fontSize: 10, color: "#52525b", marginBottom: 4 }}>{label}</div>
            <div style={{ fontSize: 18, fontWeight: 700, fontFamily: "sans-serif", color: "#e4e4e7" }}>{val}</div>
          </div>
        ))}
      </div>

      {/* Add button */}
      <button
        onClick={() => setShowForm(!showForm)}
        style={{
          width: "100%", marginBottom: 16,
          background: showForm ? "#18181b" : "#10b98115",
          border: `1px dashed ${showForm ? "#3f3f46" : "#10b981"}`,
          color: showForm ? "#71717a" : "#10b981",
          borderRadius: 8, padding: "10px",
          cursor: "pointer", fontSize: 13, fontFamily: "monospace",
          transition: "all 0.15s"
        }}>
        {showForm ? "✕ 取消" : "+ 添加今日学习记录"}
      </button>

      {/* Add form */}
      {showForm && (
        <div style={{
          background: "#111113", border: "1px solid #27272a",
          borderRadius: 8, padding: "16px", marginBottom: 16
        }}>
          {/* Date + mins row */}
          <div style={{ display: "flex", gap: 10, marginBottom: 12 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 10, color: "#52525b", marginBottom: 4, letterSpacing: 1 }}>日期</div>
              <input
                type="date" value={date}
                onChange={e => setDate(e.target.value)}
                style={{
                  width: "100%", background: "#09090b", border: "1px solid #3f3f46",
                  color: "#e4e4e7", borderRadius: 5, padding: "6px 10px",
                  fontSize: 12, fontFamily: "monospace", boxSizing: "border-box"
                }}
              />
            </div>
            <div style={{ width: 90 }}>
              <div style={{ fontSize: 10, color: "#52525b", marginBottom: 4, letterSpacing: 1 }}>时长(分钟)</div>
              <input
                type="number" value={mins} min={5} max={480}
                onChange={e => setMins(e.target.value)}
                style={{
                  width: "100%", background: "#09090b", border: "1px solid #3f3f46",
                  color: "#e4e4e7", borderRadius: 5, padding: "6px 10px",
                  fontSize: 12, fontFamily: "monospace", boxSizing: "border-box"
                }}
              />
            </div>
          </div>

          {/* Tag selector */}
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 10, color: "#52525b", marginBottom: 6, letterSpacing: 1 }}>标签</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {Object.keys(TAG_COLORS).map(t => {
                const c = TAG_COLORS[t];
                const sel = tag === t;
                return (
                  <button key={t} onClick={() => setTag(t)} style={{
                    background: sel ? `${c}25` : "transparent",
                    border: `1px solid ${sel ? c : "#3f3f46"}`,
                    color: sel ? c : "#71717a",
                    borderRadius: 4, padding: "3px 9px",
                    fontSize: 10, cursor: "pointer", fontFamily: "monospace",
                    transition: "all 0.12s"
                  }}>{t}</button>
                );
              })}
            </div>
          </div>

          {/* Text area */}
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 10, color: "#52525b", marginBottom: 4, letterSpacing: 1 }}>今天学了什么</div>
            <textarea
              value={text}
              onChange={e => setText(e.target.value)}
              placeholder="例：今天看了 TanStack Query 的 invalidateQueries，理解了 staleTime 和 gcTime 的区别..."
              rows={3}
              style={{
                width: "100%", background: "#09090b", border: "1px solid #3f3f46",
                color: "#e4e4e7", borderRadius: 5, padding: "8px 10px",
                fontSize: 13, fontFamily: "sans-serif", resize: "vertical",
                boxSizing: "border-box", lineHeight: 1.6,
                outline: "none"
              }}
            />
          </div>

          <button onClick={addLog} style={{
            background: "#10b981", border: "none",
            color: "#000", borderRadius: 5, padding: "8px 20px",
            fontSize: 12, fontWeight: 700, cursor: "pointer",
            fontFamily: "monospace"
          }}>保存记录</button>
        </div>
      )}

      {/* Log entries */}
      {sortedDates.length === 0 ? (
        <div style={{ textAlign: "center", color: "#52525b", padding: "40px 0", fontSize: 13, fontFamily: "sans-serif" }}>
          还没有记录，点上面的按钮开始吧
        </div>
      ) : (
        sortedDates.map(d => (
          <div key={d} style={{ marginBottom: 20 }}>
            {/* Date header */}
            <div style={{
              display: "flex", alignItems: "center", gap: 8, marginBottom: 8
            }}>
              <div style={{ fontSize: 11, color: "#71717a", fontFamily: "monospace" }}>{d}</div>
              <div style={{ flex: 1, height: 1, background: "#27272a" }} />
              <div style={{ fontSize: 10, color: "#52525b" }}>
                {grouped[d].reduce((s,l) => s + (l.mins||0), 0)}min
              </div>
            </div>

            {/* Entries */}
            {grouped[d].map(entry => {
              const c = TAG_COLORS[entry.tag] || "#71717a";
              return (
                <div key={entry.id} style={{
                  background: "#111113", border: "1px solid #27272a",
                  borderRadius: 7, padding: "12px 14px", marginBottom: 6,
                  borderLeft: `3px solid ${c}`
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
                    <div style={{ flex: 1 }}>
                      <p style={{
                        margin: "0 0 8px", fontSize: 13, color: "#d4d4d8",
                        fontFamily: "sans-serif", lineHeight: 1.65
                      }}>
                        {entry.content}
                      </p>
                      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                        <span style={{
                          fontSize: 10, padding: "2px 7px", borderRadius: 3,
                          background: `${c}18`, color: c, border: `1px solid ${c}30`,
                          fontFamily: "monospace"
                        }}>{entry.tag}</span>
                        <span style={{ fontSize: 10, color: "#52525b" }}>⏱ {entry.mins}min</span>
                      </div>
                    </div>
                    <button
                      onClick={() => deleteLog(entry.id)}
                      style={{
                        background: "none", border: "none",
                        color: "#3f3f46", cursor: "pointer",
                        fontSize: 14, padding: "0 4px", flexShrink: 0,
                        lineHeight: 1
                      }}
                      title="删除">✕</button>
                  </div>
                </div>
              );
            })}
          </div>
        ))
      )}
    </div>
  );
}

// ─── PROBLEM VIEW ─────────────────────────────────────────────────────────────

function ProblemView({ problems, setProblems }) {
  const [showForm, setShowForm]   = useState(false);
  const [name, setName]           = useState("");
  const [category, setCategory]   = useState("Array / Object");
  const [diff, setDiff]           = useState("Medium");
  const [status, setStatus]       = useState("Solved");
  const [notes, setNotes]         = useState("");
  const [date, setDate]           = useState(new Date().toISOString().slice(0,10));
  const [filterCat, setFilterCat] = useState("全部");
  const [filterDiff, setFilterDiff] = useState("全部");

  const add = () => {
    if (!name.trim()) return;
    setProblems(prev => [{
      id: Date.now(), date, name: name.trim(),
      category, diff, status, notes: notes.trim()
    }, ...prev]);
    setName(""); setNotes(""); setShowForm(false);
  };

  const del = (id) => setProblems(prev => prev.filter(p => p.id !== id));

  const toggle = (id, field, vals) => {
    setProblems(prev => prev.map(p => {
      if (p.id !== id) return p;
      const idx = vals.indexOf(p[field]);
      return { ...p, [field]: vals[(idx + 1) % vals.length] };
    }));
  };

  const filtered = problems.filter(p =>
    (filterCat  === "全部" || p.category === filterCat) &&
    (filterDiff === "全部" || p.diff === filterDiff)
  );

  const solvedCount    = problems.filter(p => p.status === "Solved").length;
  const attemptedCount = problems.filter(p => p.status === "Attempted").length;

  const grouped = filtered.reduce((acc, p) => {
    if (!acc[p.date]) acc[p.date] = [];
    acc[p.date].push(p);
    return acc;
  }, {});
  const sortedDates = Object.keys(grouped).sort((a,b) => b.localeCompare(a));

  const pill = (label, color, onClick, active) => (
    <button onClick={onClick} style={{
      background: active ? `${color}22` : "transparent",
      border: `1px solid ${active ? color : "#3f3f46"}`,
      color: active ? color : "#71717a",
      borderRadius: 4, padding: "2px 9px", fontSize: 10,
      cursor: "pointer", fontFamily: "monospace", transition: "all 0.12s"
    }}>{label}</button>
  );

  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: "20px 24px 60px" }}>

      {/* Stats */}
      <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
        {[
          ["总题数",    `${problems.length}`, "#e4e4e7"],
          ["已解决",    `${solvedCount}`,      "#10b981"],
          ["尝试中",    `${attemptedCount}`,   "#f59e0b"],
        ].map(([label, val, color]) => (
          <div key={label} style={{
            flex: 1, minWidth: 100, background: "#111113",
            border: "1px solid #27272a", borderRadius: 8, padding: "12px 16px"
          }}>
            <div style={{ fontSize: 10, color: "#52525b", marginBottom: 4 }}>{label}</div>
            <div style={{ fontSize: 18, fontWeight: 700, fontFamily: "sans-serif", color }}>{val}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 14 }}>
        {["全部", ...PROB_CATEGORIES].map(c =>
          pill(c, "#38BDF8", () => setFilterCat(c), filterCat === c)
        )}
        <span style={{ width: 1, background: "#27272a", margin: "0 4px" }} />
        {["全部", "Easy", "Medium", "Hard"].map(d =>
          pill(d, PROB_DIFF[d] || "#38BDF8", () => setFilterDiff(d), filterDiff === d)
        )}
      </div>

      {/* Add button */}
      <button onClick={() => setShowForm(!showForm)} style={{
        width: "100%", marginBottom: 14,
        background: showForm ? "#18181b" : "#38BDF815",
        border: `1px dashed ${showForm ? "#3f3f46" : "#38BDF8"}`,
        color: showForm ? "#71717a" : "#38BDF8",
        borderRadius: 8, padding: "10px", cursor: "pointer",
        fontSize: 13, fontFamily: "monospace", transition: "all 0.15s"
      }}>
        {showForm ? "✕ 取消" : "+ 添加练习题"}
      </button>

      {/* Add form */}
      {showForm && (
        <div style={{ background: "#111113", border: "1px solid #27272a", borderRadius: 8, padding: "16px", marginBottom: 14 }}>

          {/* Row 1: date + name */}
          <div style={{ display: "flex", gap: 10, marginBottom: 12 }}>
            <div style={{ width: 130 }}>
              <div style={{ fontSize: 10, color: "#52525b", marginBottom: 4 }}>日期</div>
              <input type="date" value={date} onChange={e => setDate(e.target.value)} style={{
                width: "100%", background: "#09090b", border: "1px solid #3f3f46",
                color: "#e4e4e7", borderRadius: 5, padding: "6px 10px",
                fontSize: 12, fontFamily: "monospace", boxSizing: "border-box"
              }}/>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 10, color: "#52525b", marginBottom: 4 }}>题目名称</div>
              <input value={name} onChange={e => setName(e.target.value)}
                placeholder="例：实现 Promise.all / 写一个 debounce / Infinite scroll 组件"
                style={{
                  width: "100%", background: "#09090b", border: "1px solid #3f3f46",
                  color: "#e4e4e7", borderRadius: 5, padding: "6px 10px",
                  fontSize: 12, fontFamily: "sans-serif", boxSizing: "border-box"
                }}/>
            </div>
          </div>

          {/* Row 2: category */}
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 10, color: "#52525b", marginBottom: 6 }}>分类</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {PROB_CATEGORIES.map(c => pill(c, "#38BDF8", () => setCategory(c), category === c))}
            </div>
          </div>

          {/* Row 3: difficulty + status */}
          <div style={{ display: "flex", gap: 20, marginBottom: 12 }}>
            <div>
              <div style={{ fontSize: 10, color: "#52525b", marginBottom: 6 }}>难度</div>
              <div style={{ display: "flex", gap: 6 }}>
                {Object.keys(PROB_DIFF).map(d => pill(d, PROB_DIFF[d], () => setDiff(d), diff === d))}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 10, color: "#52525b", marginBottom: 6 }}>状态</div>
              <div style={{ display: "flex", gap: 6 }}>
                {Object.keys(PROB_STATUS).map(s => pill(s, PROB_STATUS[s], () => setStatus(s), status === s))}
              </div>
            </div>
          </div>

          {/* Notes */}
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 10, color: "#52525b", marginBottom: 4 }}>解题思路 / 难点</div>
            <textarea value={notes} onChange={e => setNotes(e.target.value)}
              placeholder="例：用 Map 记录 seen，O(n) 时间复杂度。边界：空数组、重复值..."
              rows={3}
              style={{
                width: "100%", background: "#09090b", border: "1px solid #3f3f46",
                color: "#e4e4e7", borderRadius: 5, padding: "8px 10px",
                fontSize: 13, fontFamily: "sans-serif", resize: "vertical",
                boxSizing: "border-box", lineHeight: 1.6, outline: "none"
              }}/>
          </div>

          <button onClick={add} style={{
            background: "#38BDF8", border: "none", color: "#000",
            borderRadius: 5, padding: "8px 20px", fontSize: 12,
            fontWeight: 700, cursor: "pointer", fontFamily: "monospace"
          }}>保存</button>
        </div>
      )}

      {/* Problem list */}
      {sortedDates.length === 0 ? (
        <div style={{ textAlign: "center", color: "#52525b", padding: "40px 0", fontSize: 13, fontFamily: "sans-serif" }}>
          还没有记录 — 今天写了什么题？
        </div>
      ) : sortedDates.map(d => (
        <div key={d} style={{ marginBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <div style={{ fontSize: 11, color: "#71717a", fontFamily: "monospace" }}>{d}</div>
            <div style={{ flex: 1, height: 1, background: "#27272a" }} />
            <div style={{ fontSize: 10, color: "#52525b" }}>{grouped[d].length} 题</div>
          </div>

          {grouped[d].map(p => {
            const dc = PROB_DIFF[p.diff]   || "#71717a";
            const sc = PROB_STATUS[p.status] || "#71717a";
            return (
              <div key={p.id} style={{
                background: "#111113", border: "1px solid #27272a",
                borderRadius: 7, padding: "12px 14px", marginBottom: 6,
                borderLeft: `3px solid ${dc}`
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, fontFamily: "sans-serif", color: "#e4e4e7", marginBottom: 6 }}>
                      {p.name}
                    </div>
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center", marginBottom: p.notes ? 8 : 0 }}>
                      <span style={{ fontSize: 10, padding: "2px 7px", borderRadius: 3, background: `${dc}18`, color: dc, border: `1px solid ${dc}30`, fontFamily: "monospace", cursor: "pointer" }}
                        onClick={() => toggle(p.id, "diff", ["Easy","Medium","Hard"])}>
                        {p.diff}
                      </span>
                      <span style={{ fontSize: 10, padding: "2px 7px", borderRadius: 3, background: `${sc}18`, color: sc, border: `1px solid ${sc}30`, fontFamily: "monospace", cursor: "pointer" }}
                        onClick={() => toggle(p.id, "status", ["Solved","Attempted","Reviewing"])}>
                        {p.status}
                      </span>
                      <span style={{ fontSize: 10, padding: "2px 7px", borderRadius: 3, background: "#38BDF815", color: "#38BDF8", border: "1px solid #38BDF830", fontFamily: "monospace" }}>
                        {p.category}
                      </span>
                    </div>
                    {p.notes && (
                      <p style={{ margin: 0, fontSize: 12, color: "#71717a", fontFamily: "sans-serif", lineHeight: 1.65 }}>
                        {p.notes}
                      </p>
                    )}
                  </div>
                  <button onClick={() => del(p.id)} style={{
                    background: "none", border: "none", color: "#3f3f46",
                    cursor: "pointer", fontSize: 14, padding: "0 4px", flexShrink: 0, lineHeight: 1
                  }}>✕</button>
                </div>
              </div>
            );
          })}
        </div>
      ))}

      <div style={{ fontSize: 10, color: "#3f3f46", textAlign: "center", marginTop: 8, fontFamily: "sans-serif" }}>
        点 Difficulty / Status 标签可以快速切换
      </div>
    </div>
  );
}

// ─── MAIN APP ────────────────────────────────────────────────────────────────

export default function App() {
  const [loaded, setLoaded]     = useState(false);
  const [saveStatus, setSaveStatus] = useState("idle"); // "idle" | "saving" | "saved"
  const [activeTab, setActiveTab]   = useState("roadmap");
  const [activeWeek, setActiveWeek] = useState(0);
  const [expanded, setExpanded]     = useState(null);
  const [done, setDone]             = useState({});
  const [showCut, setShowCut]       = useState(false);
  const [logs, setLogs]             = useState([]);
  const [problems, setProblems]     = useState([]);
  const saveTimer = useRef(null);

  // Load state from server on mount
  useEffect(() => {
    fetch("/api/data")
      .then(r => r.json())
      .then(data => {
        if (data.done)     setDone(data.done);
        if (data.logs)     setLogs(data.logs);
        if (data.problems) setProblems(data.problems);
        setLoaded(true);
      });
  }, []);

  // Auto-save 1 second after any state change
  useEffect(() => {
    if (!loaded) return;
    setSaveStatus("saving");
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      fetch("/api/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ done, logs, problems }),
      }).then(() => setSaveStatus("saved"));
    }, 1000);
  }, [done, logs, problems, loaded]);

  const toggleDone = (id, e) => {
    e.stopPropagation();
    setDone(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const week      = WEEKS[activeWeek];
  const weekDone  = week.weekdays.filter(d => done[d.id]).length;
  const totalDone = WEEKS.flatMap(w => w.weekdays).filter(d => done[d.id]).length;
  const totalTasks= WEEKS.flatMap(w => w.weekdays).length;

  const totalLogMins = logs.reduce((s,l) => s + (l.mins||0), 0);
  const solvedProbs  = problems.filter(p => p.status === "Solved").length;

  if (!loaded) {
    return (
      <div style={{
        background: "#09090b", minHeight: "100vh",
        display: "flex", alignItems: "center", justifyContent: "center",
        color: "#52525b", fontFamily: "monospace", fontSize: 13
      }}>
        loading...
      </div>
    );
  }

  return (
    <div style={{
      background: "#09090b", minHeight: "100vh",
      fontFamily: "'DM Mono','Fira Code',monospace",
      color: "#e4e4e7", fontSize: 13
    }}>

      {/* ── HEADER ── */}
      <div style={{ padding:"28px 24px 20px", borderBottom:"1px solid #27272a", background:"#0c0c0f" }}>
        <div style={{ maxWidth:720, margin:"0 auto" }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:12 }}>
            <div>
              <div style={{ color:"#52525b", fontSize:11, letterSpacing:2, textTransform:"uppercase", marginBottom:6 }}>
                Senior FE Engineer · 跳槽 Roadmap v3
              </div>
              <h1 style={{ margin:0, fontSize:22, fontWeight:700, fontFamily:"system-ui,sans-serif", letterSpacing:-0.5 }}>
                5周学习计划 + 每日日志
              </h1>
              <div style={{ color:"#71717a", fontSize:12, marginTop:4, fontFamily:"sans-serif" }}>
                平日1hr概念 + 周末2-3hr写代码 · 总计约 ~50小时
              </div>
            </div>
            <div style={{ display:"flex", gap:12, flexWrap:"wrap", alignItems:"flex-start" }}>
              {/* Save indicator */}
              <div style={{ textAlign:"right", alignSelf:"flex-end" }}>
                <div style={{
                  fontSize: 10, fontFamily: "monospace",
                  color: saveStatus === "saved" ? "#10b981" : "#52525b",
                  transition: "color 0.3s"
                }}>
                  {saveStatus === "saving" ? "saving…" : saveStatus === "saved" ? "● saved" : ""}
                </div>
              </div>
              <div style={{ textAlign:"right" }}>
                <div style={{ fontSize:10, color:"#52525b", marginBottom:2 }}>完成进度</div>
                <div style={{ fontSize:18, fontWeight:700 }}>
                  {totalDone}<span style={{ color:"#52525b", fontSize:12 }}>/{totalTasks}</span>
                </div>
                <div style={{ width:70, height:3, background:"#27272a", borderRadius:2, marginTop:5, marginLeft:"auto" }}>
                  <div style={{ width:`${(totalDone/totalTasks)*100}%`, height:"100%", background:"#38BDF8", borderRadius:2, transition:"width 0.3s" }} />
                </div>
              </div>
              <div style={{ textAlign:"right" }}>
                <div style={{ fontSize:10, color:"#52525b", marginBottom:2 }}>已学时长</div>
                <div style={{ fontSize:18, fontWeight:700, color:"#10b981" }}>
                  {Math.floor(totalLogMins/60)}
                  <span style={{ color:"#52525b", fontSize:12 }}>h {totalLogMins%60}m</span>
                </div>
                <div style={{ fontSize:9, color:"#52525b", marginTop:5 }}>{logs.length} 条日志</div>
              </div>
              <div style={{ textAlign:"right" }}>
                <div style={{ fontSize:10, color:"#52525b", marginBottom:2 }}>练习题</div>
                <div style={{ fontSize:18, fontWeight:700, color:"#38BDF8" }}>
                  {solvedProbs}<span style={{ color:"#52525b", fontSize:12 }}>/{problems.length}</span>
                </div>
                <div style={{ fontSize:9, color:"#52525b", marginTop:5 }}>solved</div>
              </div>
            </div>
          </div>

          {/* cut items */}
          <button onClick={() => setShowCut(!showCut)} style={{
            marginTop:16, background:"none", border:"1px solid #3f3f46",
            color:"#71717a", fontSize:11, padding:"5px 12px", borderRadius:4,
            cursor:"pointer", letterSpacing:0.5, fontFamily:"monospace"
          }}>
            {showCut ? "▾" : "▸"} 已删减内容 ({CUT_ITEMS.length}项)
          </button>

          {showCut && (
            <div style={{ marginTop:10, padding:"12px 16px", background:"#111113", border:"1px solid #27272a", borderRadius:6 }}>
              <div style={{ fontSize:10, color:"#52525b", letterSpacing:1.5, textTransform:"uppercase", marginBottom:8 }}>从上版删掉的内容</div>
              {CUT_ITEMS.map((item,i) => (
                <div key={i} style={{ display:"flex", gap:10, marginBottom:6, alignItems:"flex-start" }}>
                  <span style={{ color:"#ef4444", fontSize:10, marginTop:1, flexShrink:0 }}>✕</span>
                  <span style={{ fontFamily:"sans-serif", fontSize:12, color:"#a1a1aa" }}>
                    <strong style={{ color:"#d4d4d8" }}>{item.name}</strong>
                    <span style={{ color:"#71717a" }}> — {item.reason}</span>
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── TABS ── */}
      <div style={{ borderBottom:"1px solid #27272a", background:"#0c0c0f", position:"sticky", top:0, zIndex:10, overflowX:"auto" }}>
        <div style={{ maxWidth:720, margin:"0 auto", display:"flex", minWidth:"max-content", padding:"0 24px" }}>

          <button onClick={() => setActiveTab("log")} style={{
            background:"none", border:"none",
            borderBottom: activeTab==="log" ? "2px solid #10b981" : "2px solid transparent",
            color: activeTab==="log" ? "#10b981" : "#52525b",
            padding:"12px 16px 10px", cursor:"pointer", fontSize:11,
            fontFamily:"monospace", letterSpacing:0.5, transition:"all 0.15s",
            whiteSpace:"nowrap", display:"flex", alignItems:"center", gap:6
          }}>
            📓 学习日志
            <span style={{ background:"#10b98125", color:"#10b981", fontSize:9, padding:"1px 5px", borderRadius:10 }}>
              {logs.length}
            </span>
          </button>

          <button onClick={() => setActiveTab("problems")} style={{
            background:"none", border:"none",
            borderBottom: activeTab==="problems" ? "2px solid #38BDF8" : "2px solid transparent",
            color: activeTab==="problems" ? "#38BDF8" : "#52525b",
            padding:"12px 16px 10px", cursor:"pointer", fontSize:11,
            fontFamily:"monospace", letterSpacing:0.5, transition:"all 0.15s",
            whiteSpace:"nowrap", display:"flex", alignItems:"center", gap:6
          }}>
            💻 练习题
            {problems.length > 0 && (
              <span style={{ background:"#38BDF825", color:"#38BDF8", fontSize:9, padding:"1px 5px", borderRadius:10 }}>
                {solvedProbs}/{problems.length}
              </span>
            )}
          </button>

          {WEEKS.map((w,i) => {
            const wDone = w.weekdays.filter(d => done[d.id]).length;
            const isActive = activeTab==="roadmap" && activeWeek===i;
            return (
              <button key={w.id}
                onClick={() => { setActiveTab("roadmap"); setActiveWeek(i); setExpanded(null); }}
                style={{
                  background:"none", border:"none",
                  borderBottom: isActive ? `2px solid ${w.color}` : "2px solid transparent",
                  color: isActive ? w.color : "#52525b",
                  padding:"12px 16px 10px", cursor:"pointer", fontSize:11,
                  fontFamily:"monospace", letterSpacing:0.5, transition:"all 0.15s",
                  whiteSpace:"nowrap", display:"flex", alignItems:"center", gap:6
                }}>
                <span>W{w.id}</span>
                {wDone > 0 && (
                  <span style={{ background:`${w.color}25`, color:w.color, fontSize:9, padding:"1px 5px", borderRadius:10 }}>
                    {wDone}/7
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── CONTENT ── */}
      {activeTab === "log" ? (
        <LogView logs={logs} setLogs={setLogs} />
      ) : activeTab === "problems" ? (
        <ProblemView problems={problems} setProblems={setProblems} />
      ) : (
        <div style={{ maxWidth:720, margin:"0 auto", padding:"20px 24px 60px" }}>

          <div style={{
            padding:"14px 18px", marginBottom:16,
            background:`${week.color}0d`, border:`1px solid ${week.color}30`,
            borderRadius:8, display:"flex", justifyContent:"space-between",
            alignItems:"flex-start", flexWrap:"wrap", gap:8
          }}>
            <div>
              <div style={{ fontSize:10, color:week.color, letterSpacing:2, textTransform:"uppercase", marginBottom:4 }}>
                Week {week.id} · {week.totalHours}
              </div>
              <div style={{ fontSize:16, fontWeight:700, fontFamily:"sans-serif", letterSpacing:-0.3 }}>{week.title}</div>
              <div style={{ fontSize:12, color:"#71717a", marginTop:4, fontFamily:"sans-serif" }}>🎯 {week.goal}</div>
            </div>
            <div style={{ textAlign:"right", flexShrink:0 }}>
              <div style={{ fontSize:10, color:"#52525b" }}>本周完成</div>
              <div style={{ fontSize:18, fontWeight:700, color:week.color }}>
                {weekDone}<span style={{ color:"#52525b", fontSize:12 }}>/7</span>
              </div>
            </div>
          </div>

          <div style={{ display:"flex", gap:12, marginBottom:14, flexWrap:"wrap" }}>
            {[["📖 读/看","#38BDF8"],["💻 写代码","#34D399"],["📝 整理/求职","#A78BFA"]].map(([label,color]) => (
              <div key={label} style={{ display:"flex", alignItems:"center", gap:5, fontSize:10, color:"#71717a" }}>
                <div style={{ width:6, height:6, borderRadius:"50%", background:color }} />{label}
              </div>
            ))}
            <div style={{ fontSize:10, color:"#52525b" }}>· 点击展开，点圆圈标完成</div>
          </div>

          <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
            {week.weekdays.map(d => {
              const isExp    = expanded === d.id;
              const isDone   = !!done[d.id];
              const ts       = TYPE_STYLE[d.type] || { bg:"#1c1c1e", color:"#71717a" };
              const isWeekend= d.day==="Sat" || d.day==="Sun";

              return (
                <div key={d.id}
                  onClick={() => setExpanded(isExp ? null : d.id)}
                  style={{
                    background: isDone ? "#0f1a0f" : isExp ? "#18181b" : "#111113",
                    border: `1px solid ${isDone ? "#166534" : isExp ? week.color+"50" : "#27272a"}`,
                    borderRadius:7, cursor:"pointer", transition:"all 0.18s", opacity: isDone ? 0.7 : 1
                  }}>
                  <div style={{ display:"flex", alignItems:"center", gap:10, padding:"11px 14px" }}>
                    <div onClick={e => toggleDone(d.id, e)}>
                      <CheckIcon done={isDone} color={week.color} />
                    </div>
                    <div style={{ width:36, textAlign:"center", fontSize:10, fontWeight:700, color: isWeekend ? "#fb923c" : "#52525b", flexShrink:0 }}>
                      {d.day}
                    </div>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{
                        fontSize:13, fontWeight:600, fontFamily:"sans-serif",
                        textDecoration: isDone ? "line-through" : "none",
                        color: isDone ? "#71717a" : "#e4e4e7",
                        overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap"
                      }}>
                        {d.label}
                      </div>
                    </div>
                    <div style={{ display:"flex", gap:6, alignItems:"center", flexShrink:0 }}>
                      <span style={{ fontSize:10, padding:"2px 7px", borderRadius:3, background:ts.bg, color:ts.color, border:`1px solid ${ts.color}30` }}>
                        {d.type}
                      </span>
                      <span style={{ fontSize:10, color:"#52525b" }}>{d.time}</span>
                      <span style={{ color:"#52525b", fontSize:14, transform: isExp ? "rotate(180deg)" : "rotate(0deg)", transition:"transform 0.2s", display:"block", lineHeight:1 }}>⌄</span>
                    </div>
                  </div>

                  {isExp && (
                    <div style={{ padding:"12px 14px 14px", borderTop:"1px solid #27272a", marginLeft:44 }}>
                      <p style={{ margin:"0 0 10px", fontSize:13, color:"#d4d4d8", lineHeight:1.75, fontFamily:"sans-serif" }}>
                        {d.task}
                      </p>
                      {d.link && (
                        <div style={{ fontSize:11, color:"#52525b", fontFamily:"monospace" }}>
                          <span style={{ color:week.color }}>→ </span>{d.link}
                        </div>
                      )}
                      {isWeekend && (
                        <div style={{ marginTop:10, padding:"6px 10px", background:"#fb923c12", border:"1px solid #fb923c30", borderRadius:4, fontSize:11, color:"#fb923c", fontFamily:"sans-serif" }}>
                          ⚡ 周末写代码课时 — 平日理解概念，今天动手实现
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── FOOTER ── */}
      <div style={{ borderTop:"1px solid #27272a", padding:"20px 24px", background:"#0c0c0f" }}>
        <div style={{ maxWidth:720, margin:"0 auto" }}>
          <div style={{ fontSize:10, color:"#52525b", letterSpacing:1.5, textTransform:"uppercase", marginBottom:12 }}>学完后简历技术栈</div>
          <div style={{ display:"flex", flexWrap:"wrap", gap:7 }}>
            {[
              ["Next.js 14+","#38BDF8"],["TypeScript","#38BDF8"],
              ["GraphQL","#A78BFA"],["Apollo Client","#A78BFA"],
              ["TanStack Query","#38BDF8"],["Zod","#34D399"],
              ["React Hook Form","#34D399"],["Tailwind CSS","#fb923c"],
              ["shadcn/ui","#F472B6"],["Zustand","#34D399"],
              ["Vite","#fb923c"],["Vitest","#34D399"],
              ["GitHub Actions","#38BDF8"],["Vercel","#38BDF8"],
              ["Vercel AI SDK","#A78BFA"],
            ].map(([t,c]) => (
              <span key={t} style={{ fontSize:10, padding:"3px 9px", borderRadius:3, background:`${c}18`, color:c, border:`1px solid ${c}30`, fontFamily:"monospace" }}>{t}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
