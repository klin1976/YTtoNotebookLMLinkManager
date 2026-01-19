# YT to NotebookLM Link Manager - Web 版實作計畫

> **部署方式**：純靜態 GitHub Pages  
> **資料來源**：YouTube Data API v3  
> **目標用戶**：公開使用

---

## 1. 架構設計

```
┌─────────────────────────────────────────────┐
│                  GitHub Pages               │
│  ┌─────────────────────────────────────┐    │
│  │   index.html + style.css + app.js   │    │
│  └─────────────────────────────────────┘    │
│                    │                        │
│                    ▼                        │
│  ┌─────────────────────────────────────┐    │
│  │     YouTube Data API v3 (JSONP)     │◄───┼─── 用戶提供 API Key
│  └─────────────────────────────────────┘    │
└─────────────────────────────────────────────┘
```

## 2. API Key 處理策略

> [!IMPORTANT]
> 因為是公開網站，**不能將 API Key 寫死在程式碼中**。

採用方案：**用戶自行輸入 API Key**
- 提供輸入框讓用戶貼上自己的 YouTube Data API Key
- Key 存在 `localStorage`，下次開啟自動載入
- 附上申請 API Key 的教學連結

好處：
- 每個用戶用自己的配額（每日 10,000 單位）
- 無需後端認證
- 無洩漏風險

---

## 3. 核心功能

| 功能 | 實作方式 |
|------|----------|
| 抓取播放清單 | `playlistItems.list` API |
| 抓取頻道影片 | `search.list` API (先取得 uploads playlist ID) |
| 過濾 Shorts | 排除 `duration < 60s` 或標題含 `#shorts` |
| 多語系 | 純 JS + `lang_data` 物件切換 |
| 剪貼簿 | `navigator.clipboard.writeText()` |

---

## 4. UI 設計

- **主題**：深色 Glassmorphism（呼應 NotebookLM 風格）
- **主要元件**：
  1. API Key 輸入框（可隱藏/顯示）
  2. URL 輸入框 + 分析按鈕
  3. 載入動畫 (Skeleton / Spinner)
  4. 多選影片清單（Checkbox + 標題 + 時長）
  5. 全選/取消全選
  6. 一鍵複製已選連結
  7. 語言切換 (繁中/EN)

---

## 5. 檔案結構

```
YT to NotebookLM Link Manager/
├── index.html          # 主頁面
├── style.css           # 樣式 (深色 Glassmorphism)
├── app.js              # 主邏輯
├── i18n.js             # 多語系文字
└── README.md           # 使用說明 + API Key 申請教學
```

---

## 6. 驗證計畫

### 測試項目
- [ ] 輸入有效播放清單 URL → 正確列出影片
- [ ] 輸入頻道 URL → 正確列出影片
- [ ] Shorts 影片被正確過濾
- [ ] 複製功能在 Chrome/Edge/Firefox 正常運作
- [ ] 語言切換即時更新 UI
- [ ] API Key 儲存/載入正常
- [ ] 錯誤處理（無效 URL、API 配額用完、無網路）

### 部署驗證
- [ ] GitHub Pages 部署成功
- [ ] HTTPS 環境下剪貼簿功能正常

---

*文件版本: v2 | 2026-01-19*
