# 📝 YT to NotebookLM Link Manager - 對話紀錄

> **專案名稱**: YT to NotebookLM Link Manager  
> **紀錄開始日期**: 2026-01-19

---

## 📅 2026-01-19

### 對話 ID: `e7c06d9b-e6e6-4265-9f3f-b841ed065109`

---

### 💬 對話 1 - API 金鑰安全性設定

**🕐 時間**: 21:23:16

#### 👤 用戶提問

> 🔐 安全性建議  
> 建議在 API 金鑰設定中加入限制：
> - 應用程式限制：網站 → 輸入 `https://klin1976.github.io/*`
> - API 限制：僅限 YouTube Data API v3
> 
> 這是什麼意思???

#### 🤖 AI 回應

這是關於 **Google Cloud Console** 中 API 金鑰的安全性設定建議。

**1. 應用程式限制（網站限制）**
```
https://klin1976.github.io/*
```
- **只有**來自 `https://klin1976.github.io/` 網域的請求才能使用這個 API 金鑰
- `*` 是萬用字元，代表該網域下的**所有路徑**都可以使用
- 如果有人竊取了你的 API 金鑰，想從其他網站使用，**Google 會拒絕該請求**

**2. API 限制（僅限 YouTube Data API v3）**
- 這把金鑰**只能用於呼叫 YouTube Data API v3**
- 即使有人拿到你的金鑰，也**無法用它來呼叫其他 Google API**
- 這可以防止金鑰被濫用於其他用途

**如何設定？**
1. 前往 [Google Cloud Console](https://console.cloud.google.com/)
2. 選擇你的專案
3. 左側選單 → **API 和服務** → **憑證**
4. 點擊你的 API 金鑰
5. 設定：
   - **應用程式限制** → 選擇「HTTP 參照網址（網站）」→ 新增 `https://klin1976.github.io/*`
   - **API 限制** → 選擇「限制金鑰」→ 只勾選 **YouTube Data API v3**

| 風險 | 沒有限制 | 有限制 |
|------|----------|--------|
| API 金鑰外洩 | 任何人都能用你的配額 | 只有你的網站能用 |
| 被惡意使用 | 可能產生大量費用 | 請求會被拒絕 |
| 濫用其他 API | 金鑰可用於任何 Google API | 只能用於 YouTube API |

---

### 💬 對話 2 - 創建對話紀錄檔

**🕐 時間**: 21:27:24

#### 👤 用戶提問

> 幫我生成一個這個專案在這台電腦的對話紀錄檔 ConversationRecord.txt，並且儲存在目前專案底下

#### 🤖 AI 回應

已創建對話紀錄檔 `ConversationRecord.txt`

---

### 💬 對話 3 - 詢問紀錄格式

**🕐 時間**: 21:29:22

#### 👤 用戶提問

> 這是什麼紀錄的格式???

#### 🤖 AI 回應

這是自行設計的純文字格式，並提供了其他標準格式選項（Markdown, JSON, YAML, CSV）供選擇。

---

### 💬 對話 4 - 轉換為 Markdown 格式

**🕐 時間**: 21:30:48

#### 👤 用戶提問

> 幫 ConversationRecord.txt 改成 ConversationRecord.md 將內容改成 Markdown (.md) 格式

#### 🤖 AI 回應

已將對話紀錄轉換為 Markdown 格式並儲存為 `ConversationRecord.md`

---

## 📌 備註

- 此紀錄檔會持續更新，記錄專案開發過程中的所有對話
- 使用 Markdown 格式以便於閱讀和版本控制
