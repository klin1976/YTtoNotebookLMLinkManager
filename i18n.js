// 多語系設定
const i18n = {
  en: {
    title: "YouTube to NotebookLM Link Manager",
    subtitle: "Batch extract video links for NotebookLM",
    apiKeyLabel: "YouTube Data API Key",
    apiKeyPlaceholder: "Paste your API Key here...",
    apiKeyHelp: "How to get an API Key?",
    apiKeyShow: "Show",
    apiKeyHide: "Hide",
    urlLabel: "YouTube URL",
    urlPlaceholder: "Paste playlist or channel URL...",
    analyzeBtn: "Analyze",
    analyzing: "Analyzing...",
    selectAll: "Select All",
    deselectAll: "Deselect All",
    copySelected: "Copy Selected Links",
    copied: "Copied!",
    noVideos: "No videos found (Shorts and videos under 60s are excluded)",
    invalidUrl: "Invalid YouTube URL",
    apiError: "API Error",
    quotaExceeded: "API quota exceeded. Try again tomorrow or use a different API Key.",
    networkError: "Network error. Please check your connection.",
    invalidApiKey: "Invalid API Key",
    videosFound: "videos found",
    selected: "selected",
    duration: "Duration",
    filterInfo: "Shorts and videos under 60 seconds are automatically excluded",
    savedKey: "API Key saved",
    clearedKey: "API Key cleared",
    clearKey: "Clear saved key"
  },
  zh: {
    title: "YouTube to NotebookLM 連結管理器",
    subtitle: "批次擷取影片連結，快速匯入 NotebookLM",
    apiKeyLabel: "YouTube Data API Key",
    apiKeyPlaceholder: "在此貼上你的 API Key...",
    apiKeyHelp: "如何取得 API Key？",
    apiKeyShow: "顯示",
    apiKeyHide: "隱藏",
    urlLabel: "YouTube 網址",
    urlPlaceholder: "貼上播放清單或頻道網址...",
    analyzeBtn: "分析",
    analyzing: "分析中...",
    selectAll: "全選",
    deselectAll: "取消全選",
    copySelected: "複製已選連結",
    copied: "已複製！",
    noVideos: "找不到影片（Shorts 及 60 秒以下影片已排除）",
    invalidUrl: "無效的 YouTube 網址",
    apiError: "API 錯誤",
    quotaExceeded: "API 配額已用完，請明天再試或更換 API Key。",
    networkError: "網路錯誤，請檢查連線。",
    invalidApiKey: "無效的 API Key",
    videosFound: "部影片",
    selected: "已選擇",
    duration: "時長",
    filterInfo: "Shorts 及 60 秒以下影片已自動排除",
    savedKey: "API Key 已儲存",
    clearedKey: "API Key 已清除",
    clearKey: "清除已儲存的 Key"
  }
};

let currentLang = localStorage.getItem('ytlm_lang') || 'zh';

function t(key) {
  return i18n[currentLang][key] || i18n['en'][key] || key;
}

function setLang(lang) {
  currentLang = lang;
  localStorage.setItem('ytlm_lang', lang);
  updateUI();
}
