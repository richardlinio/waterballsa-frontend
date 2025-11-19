.PHONY: fmt lint test install-deps help

# 預設目標
.DEFAULT_GOAL := help

# 格式化程式碼（使用 Prettier）
fmt:
	npx prettier --write "src/**/*.{js,jsx,ts,tsx,json,css,md}" "e2e/**/*.{js,jsx,ts,tsx,json,md}"

# 執行 ESLint 和 TypeScript 類型檢查（並行）
lint:
	npx next lint & npx tsc --noEmit & wait

# 執行 E2E 測試（Playwright）
test-e2e:
	npx playwright test

# 顯示 Playwright 測試報告
test-e2e-report:
	npx playwright show-report


