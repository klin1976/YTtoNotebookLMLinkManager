# YouTube to NotebookLM Link Manager

批次擷取 YouTube 播放清單或頻道的影片連結，快速匯入 NotebookLM。自動過濾 Shorts 及 60 秒以下短影片。

## 🚀 線上使用

直接開啟 `index.html` 或部署到 GitHub Pages 即可使用。

## 🔑 取得 YouTube Data API Key

1. 前往 [Google Cloud Console](https://console.cloud.google.com/)
2. 建立新專案（或選擇現有專案）
3. 點選左側選單 **API 和服務** → **資料庫**
4. 搜尋並啟用 **YouTube Data API v3**
5. 點選左側選單 **憑證** → **建立憑證** → **API 金鑰**
6. 複製產生的 API Key

> ⚠️ **安全提醒**：建議在 API 金鑰設定中加入網站限制，只允許你的網域使用。

## 📦 功能

- ✅ 支援 YouTube 播放清單網址
- ✅ 支援 YouTube 頻道網址（包含 @handle 格式）
- ✅ 自動過濾 Shorts 及 60 秒以下短影片
- ✅ 繁中/英文雙語介面
- ✅ 一鍵複製所選連結
- ✅ API Key 本地儲存（下次開啟自動載入）

## 🛠️ 本地開發

由於瀏覽器安全限制，直接開啟 `index.html` 可能無法正常運作（CORS 問題）。建議使用本地伺服器：

```bash
# 使用 Python
python -m http.server 8080

# 或使用 Node.js
npx serve
```

然後開啟 `http://localhost:8080`

## 📄 License

MIT
