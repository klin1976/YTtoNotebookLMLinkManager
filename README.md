# YouTube to NotebookLM Link Manager

<div align="center">

[![GitHub Pages](https://img.shields.io/badge/Demo-GitHub%20Pages-blue?style=for-the-badge&logo=github)](https://klin1976.github.io/YTtoNotebookLMLinkManager/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](LICENSE)

**批次擷取 YouTube 播放清單或頻道的影片連結，快速匯入 NotebookLM**

[🚀 立即使用](https://klin1976.github.io/YTtoNotebookLMLinkManager/) · [📖 API Key 申請教學](#-取得-youtube-data-api-key)

</div>

---

## ✨ 功能特色

- 🎬 **播放清單 & 頻道支援** — 貼上 URL 即可批量抓取所有影片連結
- 🚫 **智慧過濾** — 自動排除 Shorts 及 60 秒以下短影片
- 🌐 **雙語介面** — 繁體中文 / English 即時切換
- 📋 **一鍵複製** — 勾選後批次複製，直接貼到 NotebookLM
- 🔒 **隱私優先** — API Key 僅儲存在你的瀏覽器本地 (localStorage)
- 🎨 **深色主題** — 現代化 Glassmorphism 設計

---

## 🚀 線上使用

👉 **[https://klin1976.github.io/YTtoNotebookLMLinkManager/](https://klin1976.github.io/YTtoNotebookLMLinkManager/)**

無需安裝，開啟瀏覽器即可使用。

---

## 🔑 取得 YouTube Data API Key

> 每個 API Key 每日有 **10,000 單位**配額，抓取一次播放清單約消耗 50-200 單位。

### 步驟

1. 前往 [Google Cloud Console](https://console.cloud.google.com/)
2. **建立專案**（或選擇現有專案）
3. 左側選單 → **API 和服務** → **資料庫**
4. 搜尋 `YouTube Data API v3` → 點擊 **啟用**
5. 左側選單 → **憑證** → **建立憑證** → **API 金鑰**
6. 複製產生的 API Key，貼到網站中

### 🔐 安全性建議

建議在 **API 金鑰設定** 中加入限制：
- **應用程式限制**：網站 → 輸入 `https://klin1976.github.io/*`
- **API 限制**：僅限 YouTube Data API v3

---

## � 使用方式

1. 開啟 [線上網站](https://klin1976.github.io/YTtoNotebookLMLinkManager/)
2. 輸入你的 YouTube Data API Key（首次使用需輸入，之後會自動記住）
3. 貼上 YouTube 播放清單或頻道網址，例如：
   - `https://www.youtube.com/playlist?list=PLxxxxxx`
   - `https://www.youtube.com/@ChannelHandle`
   - `https://www.youtube.com/c/ChannelName`
4. 點擊「**分析**」按鈕
5. 勾選需要的影片
6. 點擊「**複製已選連結**」
7. 到 NotebookLM 貼上連結

---

## 🛠️ 本地開發

```bash
# Clone
git clone https://github.com/klin1976/YTtoNotebookLMLinkManager.git
cd YTtoNotebookLMLinkManager

# 使用 Python
python -m http.server 8080

# 或使用 Node.js
npx serve
```

開啟 `http://localhost:8080`

---

## 📁 專案結構

```
YTtoNotebookLMLinkManager/
├── index.html      # 主頁面
├── style.css       # 深色 Glassmorphism 樣式
├── app.js          # 主程式邏輯 (API 整合、URL 解析)
├── i18n.js         # 多語系設定
└── README.md
```

---

## 🤝 貢獻

歡迎提交 Issue 或 Pull Request！

---

## 📄 License

[MIT](LICENSE)

---

<div align="center">
Made with ❤️ for NotebookLM users
</div>
