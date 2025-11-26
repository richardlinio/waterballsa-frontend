# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 專案概述

這是一個使用 Next.js 15 (App Router)、React 19、TypeScript 與 shadcn/ui 元件庫的現代化模板專案。

## 技術堆疊

- **Framework**: Next.js 15.4.4 (App Router)
- **React**: 19.1.0 (React Server Components)
- **TypeScript**: 嚴格模式啟用
- **樣式**: Tailwind CSS v4 + tw-animate-css
- **UI 元件**: shadcn/ui (New York style)
- **圖示**: lucide-react
- **表單**: react-hook-form + zod + @hookform/resolvers
- **資料取得**: SWR
- **動畫**: framer-motion
- **套件管理器**: npm

## 開發指令

```bash
# 開發模式 (使用 Turbopack)
npm run dev

# 建置專案
make build

# 啟動正式環境伺服器
npm start

# 執行 ESLint 檢查
make lint
```

## 專案架構

### 目錄結構

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API 路由 (目前為空)
│   ├── layout.tsx         # 根佈局 (含 Geist 字型設定)
│   ├── page.tsx           # 首頁
│   └── globals.css        # 全域樣式
├── components/
│   └── ui/                # shadcn/ui 元件
│       └── button.tsx     # 按鈕元件
└── lib/
    └── utils.ts           # 工具函式 (cn 函式)
```

### 重要設定

1. **路徑別名**: `@/*` 對應到 `./src/*`
2. **shadcn/ui 設定** (components.json):

   - Style: new-york
   - Base Color: slate
   - CSS Variables: 啟用
   - 元件別名：`@/components`, `@/components/ui`, `@/lib`

3. **TypeScript**:
   - Target: ES2017
   - 嚴格模式啟用
   - 支援 Next.js plugin

## 新增 shadcn/ui 元件

使用 shadcn/ui CLI 新增元件：

```bash
npx shadcn@latest add [component-name]
```

元件會自動安裝到 `src/components/ui/` 目錄。

## 開發注意事項

1. **App Router 優先**: 此專案使用 Next.js 15 的 App Router，所有頁面和佈局應放在 `src/app/` 目錄
2. **React Server Components**: 預設所有元件都是伺服器元件，需要客戶端互動時使用 `"use client"` 指令
3. **樣式工具**: 使用 `cn()` 函式 (來自 `@/lib/utils`) 合併 Tailwind CSS 類別名稱
4. **表單驗證**: 使用 react-hook-form + zod 進行型別安全的表單驗證
5. **Tailwind CSS v4**: 注意此版本的 Tailwind 設定方式可能與 v3 不同

## 環境設定

- `.env.example`: 環境變數範本
- `.env.local`: 本地環境變數 (已在 .gitignore 中)
