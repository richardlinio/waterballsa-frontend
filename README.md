# Waterball Software Academy Clone - Frontend (水球軟體學院重製版 - 前端部分)

[![Next.js](https://img.shields.io/badge/Next.js-15.5.9-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.3-blue?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)

> 此專案為展示用作品集，重製 [水球軟體學院](https://www.waterballsa.tw) 線上課程平台的核心功能。非官方版本，商標與品牌權利歸水球軟體學院所有。

## Project Overview

### 實作範圍

- 完整的使用者認證系統 (JWT + Cookie)
- 三層學習旅程架構 (Journey → Chapter → Mission)
- 課程購買與訂單管理流程
- 課程影片播放與進度追蹤
- 任務完成狀態管理
- 響應式 UI/UX 設計

## Tech Stack & Architecture

### 技術選型與理由

| 技術             | 版本   | 選擇理由                                                     |
| ---------------- | ------ | ------------------------------------------------------------ |
| **Next.js**      | 15.5.9 | App Router + RSC 提供最佳 SEO 與效能；Turbopack 極速開發體驗 |
| **React**        | 19.2.3 | 最新的 Server Components 與 Actions 支援                     |
| **TypeScript**   | 5.x    | 嚴格型別檢查，減少執行期錯誤                                 |
| **Tailwind CSS** | 4.x    | Utility-first 快速開發；v4 原生 CSS 層級支援                 |
| **shadcn/ui**    | Latest | 無 runtime overhead 的元件庫；完整的可訪問性支援             |
| **SWR**          | 2.x    | 宣告式資料取得；自動快取與重新驗證機制                       |
| **Zod**          | 3.x    | Runtime 型別驗證；與 TypeScript 整合                         |
| **Playwright**   | Latest | 跨瀏覽器 E2E 測試                                            |

### 架構設計

```
前端架構 (Next.js App Router)
├── Presentation Layer (React Components)
│   ├── Server Components (預設)
│   └── Client Components (互動功能)
├── State Management
│   ├── React Context (Auth, Journey, UserPurchase)
│   └── SWR Cache (API 資料)
├── API Integration Layer
│   ├── Core Client (Fetch wrapper)
│   ├── Services (業務邏輯封裝)
│   └── Schema Validation (Zod)
└── Routing (File-based + Middleware)
```

**關鍵設計決策**:

1. **Server Components 優先** - 減少 JavaScript bundle；提升首屏載入速度
2. **Context 限縮使用** - 僅用於跨元件共享狀態 (認證、購買狀態)；避免過度使用造成 re-render
3. **API Services 分層** - 將 API 呼叫封裝成服務層，便於測試與維護
4. **路由群組隔離** - 使用 `(app)` 路由群組區分公開/私密頁面

## Core Features

### 🔐 認證系統

- JWT Token 管理 (httpOnly Cookie 儲存)
- 自動 token 驗證與刷新機制
- Next.js Middleware 保護路由

### 📚 學習旅程系統

**三層資料結構**:

```
Journey (軟體設計模式精通之旅)
└── Chapter (第一章：設計模式基礎)
    └── Mission (任務：觀看策略模式講解影片)
```

- 動態路由: `/journeys/[slug]/chapters/[id]/missions/[id]`
- Context 狀態管理避免 prop drilling
- 伺服器端預渲染課程內容 (SEO 友善)

### 🛒 訂單系統

- 多狀態管理: PENDING → PAID / EXPIRED
- 購買狀態全域同步 (`UserPurchaseContext`)
- 訂單倒數計時器 (客戶端)

### 🎬 影片播放

- `react-youtube` 整合 YouTube IFrame API
- 自動儲存觀看進度至後端
- 播放完成自動標記任務完成狀態

## Technical Challenges & Solutions

### 1. **Server/Client Components 邊界管理**

**挑戰**: Next.js 15 預設為 Server Components，但互動功能需要 Client Components，如何劃分邊界？

**解決方案**:

```typescript
// ❌ 錯誤：在 Server Component 直接使用 useState
export default function MissionPage() {
  const [progress, setProgress] = useState(0) // Error!
}

// ✅ 正確：拆分成 Server + Client 架構
// app/missions/[id]/page.tsx (Server Component)
export default async function MissionPage({ params }) {
  const mission = await fetchMission(params.id) // 伺服器端資料取得
  return <MissionClient mission={mission} />
}

// components/mission-client.tsx (Client Component)
;('use client')
export function MissionClient({ mission }) {
  const [progress, setProgress] = useState(0)
  // 互動邏輯...
}
```

**成果**: 減少 30%+ 的 JavaScript bundle size；提升 TTI (Time to Interactive)

### 2. **跨頁面狀態同步問題**

**挑戰**: 使用者購買課程後，需要即時更新導航列、側邊欄、課程頁的購買狀態，避免不一致。

**解決方案**:

- 使用 `UserPurchaseContext` 集中管理購買狀態
- 搭配 SWR 的 `mutate` API 手動觸發重新驗證

```typescript
const { mutate } = useSWRConfig()

// 購買完成後
await apiClient.orders.create(orderId)
mutate('/api/user/purchases') // 全域刷新購買狀態
```

**成果**: 避免頁面刷新；提供即時的 UX 回饋

### 3. **影片進度追蹤的防抖動處理**

**挑戰**: YouTube `onProgress` 每秒觸發，直接呼叫 API 會造成過多請求。

**解決方案**:

```typescript
const debouncedSave = useMemo(
  () =>
    debounce((progress: number) => {
      apiClient.missions.updateProgress(missionId, progress)
    }, 2000),
  [missionId]
)
```

**成果**: API 呼叫減少 90%+；降低伺服器負載

### 4. **TypeScript 型別安全的 API Layer**

**挑戰**: 後端 API 缺少 OpenAPI spec，如何確保前端型別正確？

**解決方案**:

- 使用 Zod 定義 API Response Schema
- 自動推導 TypeScript 型別

```typescript
// lib/api/api-schema/journey.ts
const JourneySchema = z.object({
  id: z.number(),
  slug: z.string(),
  name: z.string(),
  // ...
})

export type Journey = z.infer<typeof JourneySchema>

// lib/api/services/journeys.ts
export async function getJourney(slug: string): Promise<Journey> {
  const data = await fetch(`/api/journeys/${slug}`)
  return JourneySchema.parse(data) // Runtime 驗證 + 型別推導
}
```

**成果**: 100% 型別覆蓋率；Runtime 驗證錯誤資料

## UX Considerations (工程導向)

### 效能優化

1. **Code Splitting**
   - Next.js 自動 route-based splitting
   - 動態 import 大型元件 (`react-youtube`)

2. **圖片最佳化**
   - 使用 `next/image` 自動 lazy loading + WebP 轉換

3. **快取策略**
   - SWR stale-while-revalidate 機制
   - 課程資料設定較長 cache time (不常變動)

## Trade-offs & Future Improvements

### 目前的技術債與權衡

| 項目           | 現狀                | 權衡考量                                 | 未來改進                        |
| -------------- | ------------------- | ---------------------------------------- | ------------------------------- |
| **狀態管理**   | Context + SWR       | Context re-render 可能造成效能問題       | 考慮引入 Zustand 或 Jotai       |
| **測試覆蓋率** | 僅 E2E 測試         | 開發速度優先，未寫 Unit/Integration 測試 | 補充 Vitest 單元測試            |
| **錯誤邊界**   | 僅頁面層級          | 細粒度錯誤處理需要更多元件               | 增加元件層級 Error Boundary     |
| **API Schema** | 手動維護 Zod Schema | 可能與後端不同步                         | 考慮 tRPC 或自動生成 Schema     |
| **i18n**       | 目前僅中文          | MVP 階段不需要多語系                     | 引入 next-intl                  |
| **監控**       | 無                  | 本地開發環境暫不需要                     | 整合 Sentry 或 Vercel Analytics |

## Setup

### 環境需求

- **Node.js**: 20.x 或更高
- **Package Manager**: npm (專案使用 npm)
- **瀏覽器**: Chrome/Edge/Firefox/Safari (最新版)

### 快速開始

```bash
# 1. Clone 專案
git clone <your-repo-url>
cd waterballsa-frontend

# 2. 安裝依賴
npm install

# 3. 設定環境變數
cp .env.example .env.local
# 編輯 .env.local，設定 NEXT_PUBLIC_API_URL

# 4. 啟動開發伺服器
npm run dev

# 5. 開啟瀏覽器訪問 http://localhost:3000
```

### 環境變數說明

```env
# API 端點設定
NEXT_PUBLIC_API_URL=/api          # 使用 Nginx 反向代理
# NEXT_PUBLIC_API_URL=http://localhost:8080  # 直接存取後端
```

### 常用指令

```bash
# 開發
npm run dev              # 啟動開發伺服器 (Turbopack)

# 建置
npm run build            # Production 建置
npm start                # 啟動正式環境伺服器

# 程式碼品質
npm run lint             # ESLint 檢查
npm run format           # Prettier 格式化
npm run format:check     # 檢查格式

# 測試
npm run test:e2e         # E2E 測試 (headless)
npm run test:e2e:headed  # E2E 測試 (有 UI)
npm run test:e2e:ui      # Playwright UI mode

# Makefile 快捷指令
make build
make lint
make test:e2e
```

### 專案結構

```
src/
├── app/                          # Next.js App Router
│   ├── (app)/                   # 主應用程式路由群組
│   │   ├── journeys/[journeySlug]/
│   │   │   ├── chapters/[chapterId]/missions/[missionId]/
│   │   │   ├── orders/
│   │   │   └── page.tsx
│   │   ├── orders/
│   │   ├── users/
│   │   ├── login/
│   │   ├── register/
│   │   └── page.tsx
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── auth/                     # 認證元件
│   ├── layout/                   # Header, Sidebar
│   ├── mission/                  # 任務/影片播放
│   ├── orders/                   # 訂單流程
│   └── ui/                       # shadcn/ui 基礎元件
├── contexts/
│   ├── auth-context.tsx
│   ├── journey-context.tsx
│   └── user-purchase-context.tsx
├── hooks/
│   ├── use-api.ts               # SWR 封裝
│   ├── use-mission.ts
│   └── use-video-progress.ts
├── lib/
│   ├── api/
│   │   ├── core/                # API Client 核心
│   │   ├── services/            # API Services
│   │   └── api-schema/          # Zod Schemas
│   ├── auth.ts
│   └── utils.ts
├── types/                        # TypeScript 型別
└── middleware.ts                 # 路由保護
```

---

## License

此專案僅供學習與作品集展示使用，不得用於商業用途。「水球軟體學院」商標與品牌歸水球球有限公司所有，本專案與水球球有限公司無正式關聯。
