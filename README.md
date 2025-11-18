# Next.js Magic shadcn/ui Template

一個使用 Next.js 15 (App Router)、React 19、TypeScript 與 shadcn/ui 元件庫的現代化全端應用程式模板。

[![Next.js](https://img.shields.io/badge/Next.js-15.4.4-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.1.0-blue?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![shadcn/ui](https://img.shields.io/badge/shadcn/ui-latest-black)](https://ui.shadcn.com/)

## ✨ 特色

- ⚡️ **Next.js 15** - 使用最新的 App Router 與 React Server Components
- 🎨 **shadcn/ui** - 精美的 UI 元件庫 (New York style)
- 🎯 **TypeScript** - 完整的型別安全支援，嚴格模式啟用
- 💨 **Tailwind CSS v4** - 現代化的 utility-first CSS 框架
- 🎭 **Framer Motion** - 流暢的動畫效果
- 📋 **React Hook Form** - 強大的表單管理，搭配 Zod 驗證
- 📡 **SWR** - React Hooks 資料取得庫
- 🚀 **Turbopack** - 極速的開發體驗
- 🎨 **tw-animate-css** - Tailwind CSS 動畫工具

## 📦 技術堆疊

### 核心框架

- **Next.js** 15.4.4 (App Router)
- **React** 19.1.0
- **TypeScript** 5

### UI/UX

- **Tailwind CSS** 4
- **shadcn/ui** (New York style, Slate 主題)
- **lucide-react** (圖示庫)
- **framer-motion** (動畫)
- **class-variance-authority** (元件變體管理)
- **tailwind-merge** (Tailwind class 合併)
- **clsx** (條件式 className)

### 表單與驗證

- **react-hook-form** 7.61.1
- **zod** 4.0.10
- **@hookform/resolvers** 5.2.0

### 資料取得

- **SWR** 2.3.4

## 🚀 快速開始

### 環境需求

- Node.js 20.x 或更高版本
- pnpm (推薦) / npm / yarn

### 安裝

```bash
# 使用 pnpm (推薦)
pnpm install

# 或使用 npm
npm install

# 或使用 yarn
yarn install
```

### 開發

```bash
# 啟動開發伺服器 (使用 Turbopack)
pnpm dev

# 開啟瀏覽器訪問 http://localhost:3000
```

### 建置

```bash
# 建置正式環境版本
pnpm build

# 啟動正式環境伺服器
pnpm start
```

### 程式碼檢查

```bash
# 執行 ESLint
pnpm lint
```

## 📁 專案結構

```
nextjs-magic-shadcn-ui-template/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API 路由
│   │   ├── layout.tsx         # 根佈局 (含 Geist 字型)
│   │   ├── page.tsx           # 首頁
│   │   └── globals.css        # 全域樣式
│   ├── components/
│   │   └── ui/                # shadcn/ui 元件
│   │       └── button.tsx     # 按鈕元件
│   └── lib/
│       └── utils.ts           # 工具函式 (cn 函式)
├── public/                     # 靜態檔案
├── .env.example               # 環境變數範本
├── components.json            # shadcn/ui 設定
├── tsconfig.json              # TypeScript 設定
├── tailwind.config.ts         # Tailwind CSS 設定
├── next.config.ts             # Next.js 設定
└── package.json               # 專案依賴
```

## 🎨 使用 shadcn/ui 元件

### 新增元件

使用 shadcn/ui CLI 輕鬆新增預建元件：

```bash
npx shadcn@latest add [component-name]

# 例如：新增 card 元件
npx shadcn@latest add card

# 或一次新增多個元件
npx shadcn@latest add button input form
```

### 元件設定

專案使用以下 shadcn/ui 設定 (components.json):

- **Style**: New York
- **Base Color**: Slate
- **CSS Variables**: 啟用
- **Icon Library**: lucide-react
- **RSC**: 啟用 (React Server Components)

### 使用元件範例

```tsx
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <Button variant="default" size="lg">
      點擊我
    </Button>
  )
}
```

## 🛠️ 開發指南

### 路徑別名

專案設定了路徑別名，方便導入模組：

```typescript
// 使用 @/* 存取 src 目錄下的檔案
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
```

### App Router 使用

此專案使用 Next.js 15 的 App Router：

- 所有頁面和佈局放在 `src/app/` 目錄
- 預設為 React Server Components
- 需要客戶端互動時使用 `"use client"` 指令

```tsx
// Server Component (預設)
export default function Page() {
  return <div>伺服器元件</div>
}

// Client Component
"use client"
export default function InteractivePage() {
  return <button onClick={() => alert("點擊!")}>互動元件</button>
}
```

### 樣式工具

使用 `cn()` 函式合併 Tailwind CSS 類別：

```typescript
import { cn } from "@/lib/utils"

<div className={cn(
  "base-class",
  condition && "conditional-class",
  className // 外部傳入的 className
)} />
```

### 表單驗證

使用 react-hook-form + zod 建立型別安全的表單：

```typescript
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

const formSchema = z.object({
  username: z.string().min(2, "使用者名稱至少 2 個字元"),
  email: z.string().email("無效的電子郵件格式"),
})

type FormData = z.infer<typeof formSchema>

export default function MyForm() {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
  })

  // ... 表單邏輯
}
```

### 資料取得

使用 SWR 進行資料取得：

```typescript
"use client"
import useSWR from "swr"

const fetcher = (url: string) => fetch(url).then(res => res.json())

export default function Profile() {
  const { data, error, isLoading } = useSWR("/api/user", fetcher)

  if (error) return <div>載入失敗</div>
  if (isLoading) return <div>載入中...</div>
  return <div>你好 {data.name}!</div>
}
```

## 🔧 設定檔說明

### TypeScript 設定

- **Target**: ES2017
- **Strict Mode**: 啟用
- **Path Alias**: `@/*` → `./src/*`

### shadcn/ui 設定

- **Style**: new-york
- **Base Color**: slate
- **CSS Variables**: 啟用
- **RSC**: 啟用

### Tailwind CSS

使用 Tailwind CSS v4，設定檔位於 `tailwind.config.ts`

## 📝 環境變數

複製 `.env.example` 為 `.env.local` 並填入您的環境變數：

```bash
cp .env.example .env.local
```

## 🤝 貢獻

歡迎提交 Issue 或 Pull Request！

## 📄 授權

MIT License

## 🔗 相關資源

- [Next.js 文件](https://nextjs.org/docs)
- [React 文件](https://react.dev)
- [shadcn/ui 文件](https://ui.shadcn.com)
- [Tailwind CSS 文件](https://tailwindcss.com/docs)
- [TypeScript 文件](https://www.typescriptlang.org/docs)
