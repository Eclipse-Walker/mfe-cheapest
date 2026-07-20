import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';

// Docs: https://rsbuild.rs/config/
export default defineConfig({
  plugins: [
    pluginReact({
      reactCompiler: true,
    }),
  ],
  output: {
    // relative path เพื่อให้ deploy ใต้ subpath ได้ (GitHub Pages: /mfe-cheapest/)
    assetPrefix: './',
  },
  html: {
    title: 'Cheapest?',
    meta: {
      viewport: 'width=device-width, initial-scale=1, viewport-fit=cover',
      'theme-color': '#0d0d0d',
      'apple-mobile-web-app-capable': 'yes',
      // default = iOS เลือกสีตัวหนังสือ status bar ตาม theme-color อัตโนมัติ
      // (black-translucent บังคับตัวหนังสือขาวเสมอ ทำให้กลืนกับพื้นหลัง light theme)
      'apple-mobile-web-app-status-bar-style': 'default',
    },
    tags: [
      {
        tag: 'link',
        attrs: { rel: 'manifest', href: 'manifest.webmanifest' },
      },
      {
        tag: 'link',
        attrs: { rel: 'apple-touch-icon', href: 'icon-192.png' },
      },
    ],
  },
});
