// ---------------------------------------------------------------------------
// MIAR LAB — 首页动效编排（GSAP + ScrollTrigger）
// 仅在首页 index.astro 通过 <script> 加载；文档页不加载 GSAP chunk。
// 与 View Transitions 协调：每次导航后先 kill 旧实例再重建，文档页零动效零泄漏。
// ---------------------------------------------------------------------------

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.config({ ignoreMobileResize: true });

// 标记 GSAP 已就绪：main.ts 的故障兜底据此判断是否强制显示 reveal 元素。
document.documentElement.setAttribute('data-gsap-ready', '');

// 尊重 prefers-reduced-motion：完全跳过 JS 动画。
// reveal 元素的可见性交给 global.css 中的媒体查询处理。
if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  init();
}

function init(): void {
  let hasPlayedHero = false;

  // Hero 分层入场 —— 仅首次整页加载播放，导航回首页不重播（避免黑闪）。
  function heroIntro(): void {
    const els = gsap.utils.toArray<HTMLElement>('[data-hero-reveal]');
    if (!els.length) return;
    gsap.fromTo(
      els,
      { autoAlpha: 0, y: 24 },
      {
        autoAlpha: 1,
        y: 0,
        duration: 0.7,
        ease: 'power2.out',
        stagger: 0.12,
        delay: 0.05,
        clearProps: 'transform',
      },
    );
  }

  // 滚动入场：单独元素 [data-reveal] + 组元素 [data-reveal-stagger]。
  // 必须用 fromTo 而非 from（CSS 已把元素 opacity:0，from 会把终态算成 0）；
  // clearProps 只清 transform、绝不清 opacity（清了会回到 CSS 的 0 而永久隐藏），
  // 同时清掉内联 transform 让卡片自身的 CSS hover transform 生效。
  function initScrollReveals(): void {
    gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((el) => {
      gsap.fromTo(
        el,
        { autoAlpha: 0, y: 20 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.6,
          ease: 'power2.out',
          clearProps: 'transform',
          scrollTrigger: { trigger: el, start: 'top 85%', once: true },
        },
      );
    });

    gsap.utils.toArray<HTMLElement>('[data-reveal-stagger]').forEach((container) => {
      const children = gsap.utils.toArray<HTMLElement>(container.children);
      if (!children.length) return;
      gsap.fromTo(
        children,
        { autoAlpha: 0, y: 24 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.6,
          ease: 'power2.out',
          stagger: 0.08,
          clearProps: 'transform',
          scrollTrigger: { trigger: container, start: 'top 82%', once: true },
        },
      );
    });
  }

  // 统一入口：先清理旧实例（导航后 DOM 已被替换），再判断当前页是否为首页。
  function initHomeAnimations(): void {
    ScrollTrigger.getAll().forEach((st) => st.kill());
    if (!document.querySelector('[data-reveal], [data-hero-reveal]')) return;

    if (!hasPlayedHero) {
      hasPlayedHero = true;
      heroIntro();
    }
    initScrollReveals();
  }

  // 首屏整页加载（无 swap 事件）由模块顶层直接初始化。
  initHomeAnimations();

  document.addEventListener('astro:after-swap', initHomeAnimations as EventListener);
  document.addEventListener(
    'astro:page-load',
    (() => {
      // 字体/图片加载会造成布局位移，兜底 refresh 一次校正触发位置。
      ScrollTrigger.refresh();
      document.fonts.ready.then(() => ScrollTrigger.refresh());
    }) as EventListener,
  );
}
