.PHONY: fmt lint test install-deps help

# 預設目標
.DEFAULT_GOAL := help

# 格式化程式碼（使用 Prettier）
fmt:
	npx prettier --write "src/**/*.{js,jsx,ts,tsx,json,css,md}"

# 執行 ESLint 檢查
lint:
	npx next lint

# 執行 E2E 測試（Playwright）
test:
	npx playwright test


