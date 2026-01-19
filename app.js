// ============================================
// YT to NotebookLM Link Manager - Main App
// ============================================

const YOUTUBE_API_BASE = 'https://www.googleapis.com/youtube/v3';
const API_KEY_HELP_URL = 'https://developers.google.com/youtube/v3/getting-started';

let videos = [];
let isApiKeyVisible = false;

// DOM Elements
const elements = {
    title: document.getElementById('title'),
    subtitle: document.getElementById('subtitle'),
    apiKeyLabel: document.getElementById('apiKeyLabel'),
    apiKeyInput: document.getElementById('apiKeyInput'),
    apiKeyToggle: document.getElementById('apiKeyToggle'),
    apiKeyHelp: document.getElementById('apiKeyHelp'),
    apiKeyClear: document.getElementById('apiKeyClear'),
    urlLabel: document.getElementById('urlLabel'),
    urlInput: document.getElementById('urlInput'),
    analyzeBtn: document.getElementById('analyzeBtn'),
    analyzeBtnText: document.getElementById('analyzeBtnText'),
    statusContainer: document.getElementById('statusContainer'),
    resultsSection: document.getElementById('resultsSection'),
    resultsInfo: document.getElementById('resultsInfo'),
    selectAllBtn: document.getElementById('selectAllBtn'),
    copySelectedBtn: document.getElementById('copySelectedBtn'),
    videoList: document.getElementById('videoList'),
    filterInfo: document.getElementById('filterInfo'),
    langZh: document.getElementById('langZh'),
    langEn: document.getElementById('langEn')
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadSavedApiKey();
    updateUI();
    bindEvents();
});

function loadSavedApiKey() {
    const savedKey = localStorage.getItem('ytlm_apikey');
    if (savedKey) {
        elements.apiKeyInput.value = savedKey;
    }
}

function bindEvents() {
    // Language toggle
    elements.langZh.addEventListener('click', () => setLang('zh'));
    elements.langEn.addEventListener('click', () => setLang('en'));

    // API Key toggle visibility
    elements.apiKeyToggle.addEventListener('click', toggleApiKeyVisibility);

    // API Key save on blur
    elements.apiKeyInput.addEventListener('blur', saveApiKey);

    // Clear API Key
    elements.apiKeyClear.addEventListener('click', clearApiKey);

    // Analyze button
    elements.analyzeBtn.addEventListener('click', analyze);

    // Enter key on URL input
    elements.urlInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') analyze();
    });

    // Select all toggle
    elements.selectAllBtn.addEventListener('click', toggleSelectAll);

    // Copy selected
    elements.copySelectedBtn.addEventListener('click', copySelected);
}

function updateUI() {
    // Update language button states
    elements.langZh.classList.toggle('active', currentLang === 'zh');
    elements.langEn.classList.toggle('active', currentLang === 'en');

    // Update text content
    elements.title.textContent = t('title');
    elements.subtitle.textContent = t('subtitle');
    elements.apiKeyLabel.textContent = t('apiKeyLabel');
    elements.apiKeyInput.placeholder = t('apiKeyPlaceholder');
    elements.apiKeyToggle.textContent = isApiKeyVisible ? t('apiKeyHide') : t('apiKeyShow');
    elements.apiKeyHelp.textContent = t('apiKeyHelp');
    elements.apiKeyClear.textContent = t('clearKey');
    elements.urlLabel.textContent = t('urlLabel');
    elements.urlInput.placeholder = t('urlPlaceholder');
    elements.analyzeBtnText.textContent = t('analyzeBtn');
    elements.filterInfo.textContent = t('filterInfo');

    // Update results if visible
    if (videos.length > 0) {
        updateResultsInfo();
        elements.selectAllBtn.textContent = isAllSelected() ? t('deselectAll') : t('selectAll');
        elements.copySelectedBtn.innerHTML = `<span>${t('copySelected')}</span>`;
    }
}

function toggleApiKeyVisibility() {
    isApiKeyVisible = !isApiKeyVisible;
    elements.apiKeyInput.type = isApiKeyVisible ? 'text' : 'password';
    elements.apiKeyToggle.textContent = isApiKeyVisible ? t('apiKeyHide') : t('apiKeyShow');
}

function saveApiKey() {
    const key = elements.apiKeyInput.value.trim();
    if (key) {
        localStorage.setItem('ytlm_apikey', key);
    }
}

function clearApiKey() {
    elements.apiKeyInput.value = '';
    localStorage.removeItem('ytlm_apikey');
    showToast(t('clearedKey'), 'success');
}

// ============================================
// YouTube URL Parsing
// ============================================

function parseYouTubeUrl(url) {
    try {
        const urlObj = new URL(url);
        const hostname = urlObj.hostname.replace('www.', '');

        if (!hostname.includes('youtube.com') && !hostname.includes('youtu.be')) {
            return null;
        }

        // Playlist
        const playlistId = urlObj.searchParams.get('list');
        if (playlistId) {
            return { type: 'playlist', id: playlistId };
        }

        // Channel URLs
        const pathParts = urlObj.pathname.split('/').filter(Boolean);

        if (pathParts[0] === 'channel') {
            return { type: 'channel', id: pathParts[1] };
        }

        if (pathParts[0] === 'c' || pathParts[0] === 'user' || pathParts[0].startsWith('@')) {
            return { type: 'handle', handle: pathParts[0].startsWith('@') ? pathParts[0] : pathParts[1] };
        }

        if (pathParts[0]?.startsWith('@')) {
            return { type: 'handle', handle: pathParts[0] };
        }

        return null;
    } catch {
        return null;
    }
}

// ============================================
// YouTube API Functions
// ============================================

async function fetchApi(endpoint, params) {
    const apiKey = elements.apiKeyInput.value.trim();
    if (!apiKey) {
        throw new Error('NO_API_KEY');
    }

    const url = new URL(`${YOUTUBE_API_BASE}/${endpoint}`);
    url.searchParams.set('key', apiKey);
    Object.entries(params).forEach(([key, value]) => {
        url.searchParams.set(key, value);
    });

    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok) {
        if (data.error?.errors?.[0]?.reason === 'quotaExceeded') {
            throw new Error('QUOTA_EXCEEDED');
        }
        if (response.status === 400 || response.status === 403) {
            throw new Error('INVALID_API_KEY');
        }
        throw new Error('API_ERROR');
    }

    return data;
}

async function getChannelUploadsPlaylistId(channelIdentifier) {
    let channelId;

    if (channelIdentifier.type === 'channel') {
        channelId = channelIdentifier.id;
    } else if (channelIdentifier.type === 'handle') {
        // Search for channel by handle
        const handle = channelIdentifier.handle.replace('@', '');
        const searchData = await fetchApi('search', {
            part: 'snippet',
            q: handle,
            type: 'channel',
            maxResults: 1
        });

        if (!searchData.items?.length) {
            throw new Error('CHANNEL_NOT_FOUND');
        }
        channelId = searchData.items[0].snippet.channelId;
    }

    // Get channel's uploads playlist
    const channelData = await fetchApi('channels', {
        part: 'contentDetails',
        id: channelId
    });

    if (!channelData.items?.length) {
        throw new Error('CHANNEL_NOT_FOUND');
    }

    return channelData.items[0].contentDetails.relatedPlaylists.uploads;
}

async function getPlaylistVideos(playlistId) {
    const allVideos = [];
    let pageToken = '';

    do {
        const params = {
            part: 'snippet,contentDetails',
            playlistId: playlistId,
            maxResults: 50
        };

        if (pageToken) {
            params.pageToken = pageToken;
        }

        const data = await fetchApi('playlistItems', params);

        if (data.items) {
            allVideos.push(...data.items);
        }

        pageToken = data.nextPageToken || '';

        // Update status with progress
        showStatus(`${t('analyzing')} (${allVideos.length} ${t('videosFound')})`, 'info');

    } while (pageToken);

    return allVideos;
}

async function getVideoDetails(videoIds) {
    // API allows max 50 videos per request
    const chunks = [];
    for (let i = 0; i < videoIds.length; i += 50) {
        chunks.push(videoIds.slice(i, i + 50));
    }

    const allDetails = [];
    for (const chunk of chunks) {
        const data = await fetchApi('videos', {
            part: 'contentDetails,snippet',
            id: chunk.join(',')
        });

        if (data.items) {
            allDetails.push(...data.items);
        }
    }

    return allDetails;
}

function parseDuration(duration) {
    // ISO 8601 duration format: PT1H2M3S
    const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
    if (!match) return 0;

    const hours = parseInt(match[1] || 0);
    const minutes = parseInt(match[2] || 0);
    const seconds = parseInt(match[3] || 0);

    return hours * 3600 + minutes * 60 + seconds;
}

function formatDuration(seconds) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;

    if (h > 0) {
        return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    }
    return `${m}:${s.toString().padStart(2, '0')}`;
}

// ============================================
// Main Analyze Function
// ============================================

async function analyze() {
    const url = elements.urlInput.value.trim();

    if (!elements.apiKeyInput.value.trim()) {
        showStatus(t('invalidApiKey'), 'error');
        return;
    }

    const parsed = parseYouTubeUrl(url);
    if (!parsed) {
        showStatus(t('invalidUrl'), 'error');
        return;
    }

    setLoading(true);
    hideResults();
    showStatus(t('analyzing'), 'info', true);

    try {
        let playlistId;

        if (parsed.type === 'playlist') {
            playlistId = parsed.id;
        } else {
            playlistId = await getChannelUploadsPlaylistId(parsed);
        }

        // Get playlist items
        const playlistVideos = await getPlaylistVideos(playlistId);

        if (!playlistVideos.length) {
            showStatus(t('noVideos'), 'warning');
            setLoading(false);
            return;
        }

        // Get video details for duration
        const videoIds = playlistVideos
            .map(v => v.contentDetails?.videoId || v.snippet?.resourceId?.videoId)
            .filter(Boolean);

        const videoDetails = await getVideoDetails(videoIds);

        // Create lookup map
        const detailsMap = new Map(videoDetails.map(v => [v.id, v]));

        // Filter and process videos
        videos = playlistVideos
            .map(item => {
                const videoId = item.contentDetails?.videoId || item.snippet?.resourceId?.videoId;
                const details = detailsMap.get(videoId);

                if (!details) return null;

                const durationSeconds = parseDuration(details.contentDetails.duration);
                const title = item.snippet.title;

                // Filter out Shorts (< 60s) and videos with #shorts in title
                if (durationSeconds < 60 || title.toLowerCase().includes('#shorts')) {
                    return null;
                }

                return {
                    id: videoId,
                    title: title,
                    duration: durationSeconds,
                    durationFormatted: formatDuration(durationSeconds),
                    url: `https://www.youtube.com/watch?v=${videoId}`,
                    selected: true
                };
            })
            .filter(Boolean);

        if (!videos.length) {
            showStatus(t('noVideos'), 'warning');
            setLoading(false);
            return;
        }

        hideStatus();
        renderResults();

    } catch (error) {
        console.error('Analyze error:', error);

        let message = t('apiError');
        if (error.message === 'NO_API_KEY') {
            message = t('invalidApiKey');
        } else if (error.message === 'QUOTA_EXCEEDED') {
            message = t('quotaExceeded');
        } else if (error.message === 'INVALID_API_KEY') {
            message = t('invalidApiKey');
        } else if (error.message === 'CHANNEL_NOT_FOUND') {
            message = t('invalidUrl');
        } else if (error.name === 'TypeError') {
            message = t('networkError');
        }

        showStatus(message, 'error');
    }

    setLoading(false);
}

// ============================================
// UI Functions
// ============================================

function setLoading(loading) {
    elements.analyzeBtn.disabled = loading;

    if (loading) {
        elements.analyzeBtnText.innerHTML = `<span class="spinner"></span> ${t('analyzing')}`;
    } else {
        elements.analyzeBtnText.textContent = t('analyzeBtn');
    }
}

function showStatus(message, type = 'info', showSpinner = false) {
    elements.statusContainer.innerHTML = `
    <div class="status ${type}">
      ${showSpinner ? '<span class="spinner"></span>' : ''}
      <span>${message}</span>
    </div>
  `;
    elements.statusContainer.classList.remove('hidden');
}

function hideStatus() {
    elements.statusContainer.classList.add('hidden');
}

function hideResults() {
    elements.resultsSection.classList.remove('visible');
}

function renderResults() {
    elements.resultsSection.classList.add('visible');
    updateResultsInfo();

    elements.selectAllBtn.textContent = isAllSelected() ? t('deselectAll') : t('selectAll');

    elements.videoList.innerHTML = videos.map((video, index) => `
    <div class="video-item">
      <input type="checkbox" 
             id="video-${index}" 
             ${video.selected ? 'checked' : ''} 
             onchange="toggleVideo(${index})">
      <div class="video-info">
        <div class="video-title" title="${escapeHtml(video.title)}">${escapeHtml(video.title)}</div>
        <div class="video-meta">
          <span>${t('duration')}: ${video.durationFormatted}</span>
        </div>
      </div>
      <button class="btn btn-icon btn-sm video-copy-btn" onclick="copyOne(${index})" title="Copy">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
        </svg>
      </button>
    </div>
  `).join('');
}

function updateResultsInfo() {
    const selectedCount = videos.filter(v => v.selected).length;
    elements.resultsInfo.innerHTML = `
    <strong>${videos.length}</strong> ${t('videosFound')} · 
    <strong>${selectedCount}</strong> ${t('selected')}
  `;
}

function toggleVideo(index) {
    videos[index].selected = !videos[index].selected;
    updateResultsInfo();
    elements.selectAllBtn.textContent = isAllSelected() ? t('deselectAll') : t('selectAll');
}

function isAllSelected() {
    return videos.every(v => v.selected);
}

function toggleSelectAll() {
    const allSelected = isAllSelected();
    videos.forEach(v => v.selected = !allSelected);

    // Update checkboxes
    videos.forEach((_, index) => {
        const checkbox = document.getElementById(`video-${index}`);
        if (checkbox) checkbox.checked = !allSelected;
    });

    updateResultsInfo();
    elements.selectAllBtn.textContent = isAllSelected() ? t('deselectAll') : t('selectAll');
}

async function copyOne(index) {
    try {
        await navigator.clipboard.writeText(videos[index].url);
        showToast(t('copied'), 'success');
    } catch {
        // Fallback
        fallbackCopy(videos[index].url);
    }
}

async function copySelected() {
    const selectedUrls = videos
        .filter(v => v.selected)
        .map(v => v.url)
        .join('\n');

    if (!selectedUrls) {
        showToast(t('noVideos'), 'error');
        return;
    }

    try {
        await navigator.clipboard.writeText(selectedUrls);
        showToast(t('copied'), 'success');
    } catch {
        fallbackCopy(selectedUrls);
    }
}

function fallbackCopy(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();

    try {
        document.execCommand('copy');
        showToast(t('copied'), 'success');
    } catch {
        showToast('Copy failed', 'error');
    }

    document.body.removeChild(textarea);
}

function showToast(message, type = 'success') {
    // Remove existing toast
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);

    // Trigger animation
    requestAnimationFrame(() => {
        toast.classList.add('show');
    });

    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 2000);
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
