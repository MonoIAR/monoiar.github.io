// ---------------------------------------------------------------------------
// MIAR LAB — client interactions
// Mobile menu toggle, copy-to-clipboard with toast, placeholder alerts,
// and live server status.
// ---------------------------------------------------------------------------

import { SERVER_API_STATUS_URL, LEVEL_NAMES } from '../data/server';

/* ---------------------------------- Toast -------------------------------- */

const toast = document.getElementById('toast');
const toastMsg = document.getElementById('toastMsg');
let toastTimer: number | undefined;

function showToast(message: string): void {
  if (!toast || !toastMsg) return;
  toastMsg.innerText = message;
  toast.classList.remove('hidden');
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.add('hidden'), 3000);
}

/* ----------------------------- Copy to clipboard -------------------------- */

function copyToClipboard(text: string): void {
  const showSuccess = () => showToast(`[SUCCESS] 已复制地址: ${text}`);

  const legacyFallback = (): void => {
    const tempInput = document.createElement('input');
    tempInput.value = text;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand('copy');
    document.body.removeChild(tempInput);
    showSuccess();
  };

  if (navigator.clipboard?.writeText) {
    navigator.clipboard.writeText(text).then(showSuccess, legacyFallback);
  } else {
    legacyFallback();
  }
}

document.querySelectorAll<HTMLElement>('[data-copy]').forEach((btn) => {
  btn.addEventListener('click', () => {
    const value = btn.dataset.copy;
    if (value) copyToClipboard(value);
  });
});

/* --------------------------- Placeholder alerts --------------------------- */
/* These are temporary stubs for links whose destinations do not exist yet.  */

document.querySelectorAll<HTMLElement>('[data-alert]').forEach((el) => {
  el.addEventListener('click', (event) => {
    event.preventDefault();
    const message = el.dataset.alert;
    if (message) alert(message);
  });
});

/* --------------------- Mobile menu toggle --------------------------------- */

const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileMenu = document.getElementById('mobileMenu');

if (mobileMenuBtn && mobileMenu) {
  mobileMenuBtn.addEventListener('click', () => {
    const isNowHidden = mobileMenu.classList.toggle('hidden');
    mobileMenuBtn.setAttribute('aria-expanded', String(!isNowHidden));
  });
}

/* ----------------------- 联机服务器实时状态 -------------------------------- */
/* 从 src/data/server.ts 配置的接口拉取 Fusion 服务器状态，填充服务器卡片。    */

interface ServerStatus {
  online: boolean;
  serverName: string;
  roomCode: string;
  version: string;
  maxPlayers: number;
  playerCount: number;
  currentLevel: string;
  currentGamemode: string;
  uptimeSeconds: number;
  updatedAt: string;
}

const SERVER_STATUS_TEXT = {
  loading:
    '<span class="w-2 h-2 rounded-full bg-brand-border animate-pulse"></span> 连接中…',
  online:
    '<span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span> 运行中',
  offline: '<span class="w-2 h-2 rounded-full bg-red-400"></span> 离线',
  unreachable: '<span class="w-2 h-2 rounded-full bg-red-400"></span> 无法连接',
} as const;

function formatUptime(totalSeconds: number): string {
  if (totalSeconds < 60) return `${totalSeconds}秒`;
  const minutes = Math.floor(totalSeconds / 60);
  if (minutes < 60) return `${minutes}分${totalSeconds % 60}秒`;
  const hours = Math.floor(minutes / 60);
  return `${hours}时${minutes % 60}分`;
}

function setServerText(id: string, text: string): void {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}

function loadServerStatus(): void {
  const statusEl = document.getElementById('serverStatus');
  const copyBtn = document.getElementById('serverCopyBtn');
  if (!statusEl) return;

  statusEl.innerHTML = SERVER_STATUS_TEXT.loading;

  fetch(SERVER_API_STATUS_URL)
    .then((res) => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json();
    })
    .then((data: ServerStatus) => {
      const levelName = LEVEL_NAMES[data.currentLevel] ?? data.currentLevel.slice(0, 8);

      statusEl.innerHTML = data.online
        ? SERVER_STATUS_TEXT.online
        : SERVER_STATUS_TEXT.offline;
      setServerText('serverPlayers', `${data.playerCount} / ${data.maxPlayers}`);
      setServerText('serverMap', levelName || '--');
      setServerText('serverRoomCode', data.roomCode || '--');
      setServerText('serverUptime', formatUptime(data.uptimeSeconds));
      setServerText('serverVersion', data.version || '--');

      if (copyBtn && data.roomCode) copyBtn.dataset.copy = data.roomCode;
    })
    .catch(() => {
      // 请求失败：服务器离线、网络不通、或 HTTPS 页面请求 HTTP 接口被浏览器拦截。
      statusEl.innerHTML = SERVER_STATUS_TEXT.unreachable;
    });
}

loadServerStatus();
