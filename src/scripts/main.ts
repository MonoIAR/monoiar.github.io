// ---------------------------------------------------------------------------
// MIAR LAB — client interactions
// Mobile menu toggle, copy-to-clipboard with toast, placeholder alerts,
// live server status, scroll progress bar + navbar scroll state.
//
// View Transitions note: the bundled module script runs ONCE per page load,
// while the DOM is swapped on every navigation. All per-element listeners are
// therefore delegated to the document (survive navigation), and anything that
// must re-run per page is hooked to `astro:page-load`.
// ---------------------------------------------------------------------------

import { SERVER_API_STATUS_URL, LEVEL_NAMES } from '../data/server';

/* ---------------------------------- Toast -------------------------------- */

let toastTimer: number | undefined;

function showToast(message: string): void {
  // Toast 节点每次导航后被替换，这里实时重新获取。
  const toast = document.getElementById('toast');
  const toastMsg = document.getElementById('toastMsg');
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

/* --------------------- Document-level event delegation -------------------- */
/* 顶层绑定一次，跨 View Transitions 导航依然有效。                            */

document.addEventListener('click', (event) => {
  const target = event.target as HTMLElement | null;

  // 复制房间码 / 占位链接
  const copyBtn = target?.closest<HTMLElement>('[data-copy]');
  if (copyBtn) {
    const value = copyBtn.dataset.copy;
    if (value) copyToClipboard(value);
    return;
  }

  const alertEl = target?.closest<HTMLElement>('[data-alert]');
  if (alertEl) {
    event.preventDefault();
    const message = alertEl.dataset.alert;
    if (message) alert(message);
    return;
  }

  // 移动端菜单切换
  if (target?.closest('#mobileMenuBtn')) {
    const mobileMenu = document.getElementById('mobileMenu');
    const btn = document.getElementById('mobileMenuBtn');
    if (mobileMenu && btn) {
      const isNowHidden = mobileMenu.classList.toggle('hidden');
      btn.setAttribute('aria-expanded', String(!isNowHidden));
    }
  }
});

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

// 更新文案并重放数字微弹动画（.status-pop）。
function setServerText(id: string, text: string): void {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = text;
  el.classList.remove('status-pop');
  void el.offsetWidth; // 强制 reflow，让动画能重新播放
  el.classList.add('status-pop');
}

function loadServerStatus(): void {
  const statusEl = document.getElementById('serverStatus');
  if (!statusEl) return;

  statusEl.innerHTML = SERVER_STATUS_TEXT.loading;

  fetch(SERVER_API_STATUS_URL)
    .then((res) => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json();
    })
    .then((data: ServerStatus) => {
      // 关卡条码形如 "fa53....c4144.Level.VoidG114"，默认取最后一段作为地图名
      const levelName =
        LEVEL_NAMES[data.currentLevel] ?? data.currentLevel.split('.').pop() ?? '';

      statusEl.innerHTML = data.online
        ? SERVER_STATUS_TEXT.online
        : SERVER_STATUS_TEXT.offline;
      setServerText('serverPlayers', `${data.playerCount} / ${data.maxPlayers}`);
      setServerText('serverMap', levelName || '--');
      // 游戏模式条码同样取最后一段显示，空值视为默认的“沙盒”
      const gamemode = data.currentGamemode.split('.').pop() ?? '';
      setServerText('serverGamemode', gamemode || '沙盒');
      setServerText('serverUptime', formatUptime(data.uptimeSeconds));
      setServerText('serverVersion', data.version || '--');
    })
    .catch(() => {
      // 请求失败：服务器离线、网络不通、或 HTTPS 页面请求 HTTP 接口被浏览器拦截。
      statusEl.innerHTML = SERVER_STATUS_TEXT.unreachable;
    });
}

// 首屏由模块顶层拉取一次；后续每次导航（astro:page-load）再拉取。
loadServerStatus();
let initialPageLoad = true;

/* --------------------- 滚动进度条 + 导航栏滚动状态 ------------------------ */

function updateScrollUI(): void {
  const progressBar = document.getElementById('scrollProgress');
  if (progressBar) {
    const doc = document.documentElement;
    const max = doc.scrollHeight - window.innerHeight;
    const progress = max > 0 ? window.scrollY / max : 0;
    progressBar.style.transform = `scaleX(${progress})`;
  }

  const header = document.getElementById('siteHeader');
  if (header) {
    header.classList.toggle('is-scrolled', window.scrollY > 60);
  }
}

window.addEventListener('scroll', updateScrollUI, { passive: true });
window.addEventListener('resize', updateScrollUI, { passive: true });

/* ------------------- GSAP 故障兜底（reveal 元素可见性） -------------------- */
/* 若首页 GSAP 模块初始化失败（chunk 加载失败等），reveal 元素会一直 opacity:0，
   这里强制把它们显示出来，避免整页空白。 */

function revealFallback(): void {
  if (document.documentElement.hasAttribute('data-gsap-ready')) return;
  document
    .querySelectorAll<HTMLElement>('[data-reveal], [data-reveal-stagger] > *')
    .forEach((el) => {
      el.style.opacity = '1';
    });
}

/* ------------------------ 每次页面加载后统一处理 --------------------------- */

document.addEventListener(
  'astro:page-load',
  (() => {
    if (!initialPageLoad) loadServerStatus();
    initialPageLoad = false;
    updateScrollUI(); // 导航后立即校正进度条，避免残留上一页的值
    revealFallback();
  }) as EventListener,
);
