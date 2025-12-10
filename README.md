# 水球軟體學院 (Waterball Software Academy) - 前端專案

水球軟體學院的線上學習平台前端應用，提供軟體設計模式課程與學習旅程管理系統。

[![Next.js](https://img.shields.io/badge/Next.js-15.5.7-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.1.0-blue?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)

## 專案概述

此專案為水球軟體學院的前端應用程式，使用 Next.js 15 App Router 架構，提供以下核心功能：

- 🎓 **課程展示** - 展示軟體設計模式等課程內容
- 📚 **學習旅程** - 組織化的學習路徑（Journeys、Chapters、Missions）
- 👤 **使用者系統** - 註冊、登入、個人檔案管理
- 🛒 **訂單管理** - 課程購買與訂單處理
- 🎬 **影片播放** - YouTube 整合的課程影片播放
- 📊 **學習進度追蹤** - 任務完成狀態與影片觀看進度

## 技術架構

### 核心框架

- **Next.js** 15.5.7 (App Router)
- **React** 19.1.0 (React Server Components)
- **TypeScript** 5 (嚴格模式)
- **Node.js** 20.x+

### UI/樣式

- **Tailwind CSS** 4
- **shadcn/ui** (New York style, Slate 主題)
- **Lucide React** - 圖示庫
- **Framer Motion** - 動畫效果
- **Sonner** - Toast 通知

### 狀態管理與資料取得

- **SWR** - React Hooks 資料取得與快取
- **React Context** - 全域狀態管理 (Auth, Journey, UserPurchase)
- **React Hook Form** + **Zod** - 表單驗證

### 開發工具

- **Playwright** - E2E 測試
- **ESLint** - 程式碼檢查
- **Prettier** - 程式碼格式化
- **Turbopack** - 極速開發體驗

## 專案結構

```
src/
├── app/                          # Next.js App Router
│   ├── (app)/                   # 主應用程式路由群組
│   │   ├── journeys/           # 學習旅程相關頁面
│   │   │   └── [journeySlug]/
│   │   │       ├── chapters/[chapterId]/missions/[missionId]/
│   │   │       ├── orders/     # 課程訂單頁面
│   │   │       └── page.tsx    # 旅程主頁
│   │   ├── orders/             # 訂單管理頁面
│   │   ├── users/              # 使用者個人頁面
│   │   ├── login/              # 登入頁面
│   │   ├── register/           # 註冊頁面
│   │   └── page.tsx            # 首頁（課程列表）
│   └── layout.tsx              # 根佈局
├── components/                  # React 元件
│   ├── auth/                   # 認證相關元件
│   ├── layout/                 # 佈局元件 (Header, Sidebar)
│   ├── mission/                # 任務相關元件（影片播放、進度）
│   ├── orders/                 # 訂單相關元件
│   └── ui/                     # shadcn/ui 基礎元件
├── contexts/                    # React Context
│   ├── auth-context.tsx        # 認證狀態
│   ├── journey-context.tsx     # 旅程狀態
│   └── user-purchase-context.tsx # 購買狀態
├── hooks/                       # 自定義 Hooks
│   ├── use-api.ts              # API 呼叫封裝
│   ├── use-mission.ts          # 任務資料管理
│   └── use-video-progress.ts   # 影片進度追蹤
├── lib/                         # 工具函式庫
│   ├── api/                    # API 相關
│   │   ├── core/              # API 客戶端核心
│   │   ├── services/          # API 服務層
│   │   └── api-schema/        # API Schema 定義
│   ├── auth.ts                 # 認證工具
│   └── utils.ts                # 通用工具函式
├── types/                       # TypeScript 型別定義
├── data/                        # 靜態資料
└── middleware.ts               # Next.js 中介層
```

## 開發指南

### 環境需求

- Node.js 20.x 或更高版本
- npm (專案使用 npm 作為套件管理器)

### 環境變數設定

複製 `.env.example` 並建立 `.env.local`：

```bash
cp .env.example .env.local
```

設定 API 端點：

```env
# 使用 Nginx 反向代理時使用相對路徑
NEXT_PUBLIC_API_URL=/api

# 開發環境直接存取後端時使用
# NEXT_PUBLIC_API_URL=http://localhost:8080
```

### 安裝與啟動

```bash
# 安裝依賴
npm install

# 啟動開發伺服器 (使用 Turbopack)
npm run dev

# 開啟瀏覽器訪問 http://localhost:3000
```

### 建置與部署

```bash
# 建置正式環境版本
npm run build
# 或使用 Makefile
make build

# 啟動正式環境伺服器
npm start
```

### 程式碼品質

```bash
# 執行 ESLint 檢查
npm run lint
# 或使用 Makefile
make lint

# 執行 Prettier 格式化
npm run format

# 檢查格式
npm run format:check
```

### 測試

```bash
# 執行 E2E 測試
npm run test:e2e
# 或使用 Makefile
make test:e2e

# 啟動測試 UI 介面
npm run test:e2e:ui

# 執行有界面的測試（方便除錯）
npm run test:e2e:headed
```

## API 整合

### API 客戶端架構

專案使用自定義的 API 客戶端，架構如下：

- **Core Client** (`lib/api/core/client.ts`) - 基礎 HTTP 客戶端
- **Services** (`lib/api/services/`) - API 服務層，包含：
  - `auth.ts` - 認證 API
  - `journeys.ts` - 學習旅程 API
  - `missions.ts` - 任務 API
  - `orders.ts` - 訂單 API
  - `user.ts` - 使用者 API
- **Schema** (`lib/api/api-schema/`) - Zod Schema 驗證

### 使用範例

```typescript
import { useApi } from '@/hooks/use-api'

function MyComponent() {
  const { data, error, isLoading } = useApi(() =>
    apiClient.journeys.getJourneyBySlug('software-design-pattern')
  )

  // ...
}
```

## 核心功能說明

### 認證系統

- JWT Token 儲存於 Cookie
- 使用 `AuthContext` 管理全域認證狀態
- 支援登入、註冊、登出功能

### 學習旅程系統

採用三層結構：

1. **Journey (旅程)** - 完整課程，如「軟體設計模式精通之旅」
2. **Chapter (章節)** - 旅程下的章節
3. **Mission (任務)** - 章節下的具體學習任務（影片、作業等）

### 訂單系統

- 支援課程購買流程
- 訂單狀態追蹤（PENDING、EXPIRED、PAID 等）
- 整合 UserPurchaseContext 管理購買狀態

### 影片播放

- 使用 `react-youtube` 整合 YouTube 播放器
- 自動儲存觀看進度
- 支援播放完成自動標記任務狀態

## Makefile 指令

專案提供 Makefile 簡化常用指令：

```bash
make build          # 建置專案
make lint           # 執行 ESLint
make test:e2e       # 執行 E2E 測試
make test:e2e:ui    # 啟動測試 UI
make test:e2e:headed # 執行有界面的測試
```

## 開發注意事項

### 路徑別名

```typescript
// 使用 @/* 存取 src 目錄
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
```

### React Server Components

- 預設所有元件為 Server Components
- 需要客戶端互動時使用 `"use client"` 指令
- 狀態管理、事件處理需在 Client Components 中進行

### 程式碼風格

- 使用 Prettier 統一格式
- 遵循 ESLint 規則
- 使用 TypeScript 嚴格模式

## 相關資源

- [Next.js 文件](https://nextjs.org/docs)
- [React 文件](https://react.dev)
- [shadcn/ui 文件](https://ui.shadcn.com)
- [Tailwind CSS 文件](https://tailwindcss.com/docs)
- [SWR 文件](https://swr.vercel.app)
- [Playwright 文件](https://playwright.dev)

## 授權

MIT License
