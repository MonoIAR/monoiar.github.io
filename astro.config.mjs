// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  // 部署到 Cloudflare Pages 时更新为实际域名（Pages 自动构建，无需 base 路径）
  site: 'https://miar.cn',
  vite: {
    plugins: [tailwindcss()]
  }
});
