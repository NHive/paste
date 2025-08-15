import { defineConfig } from "vitepress";

// 配置导出
export default defineConfig({
  title: "Paste Newbee",
  description: "Paste Newbee 是全球唯一支持跨操作系统、跨设备实时同步文本、图片、文件的云剪贴板应用。支持Windows/Mac云剪切板同步，内置OCR、多标签管理、全流程数据加密的网络剪贴板工具，颜值与功能并存。",
  lang: "zh-CN",
  sitemap: {
    hostname: "https://www.nbhive.com",
    transformItems: (items) => {
      // 为关键SEO页面添加更高优先级
      return items.map((item) => {
        if (item.url === '/' || item.url === '/index.html') {
          item.priority = 1.0;
          item.changefreq = 'daily';
        } else if (item.url.includes('/guide/features') || item.url.includes('/question')) {
          item.priority = 0.9;
          item.changefreq = 'weekly';
        } else if (item.url.includes('/download')) {
          item.priority = 0.8;
          item.changefreq = 'weekly';
        } else {
          item.priority = 0.7;
          item.changefreq = 'monthly';
        }
        return item;
      });
    }
  },
  head: [
    ['meta', { name: 'keywords', content: '云剪贴板, 云剪切板, 网络剪贴板, 剪贴板同步, 跨设备剪贴板, 网络粘贴板, 在线剪贴板, 实时同步剪贴板, Windows Mac 剪贴板, 跨操作系统剪贴板, OCR剪贴板, 数据加密剪贴板, 多标签管理剪贴板' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:title', content: 'Paste Newbee云剪贴板 - 全球唯一跨系统实时同步' }],
    ['meta', { property: 'og:description', content: '全球首款支持跨操作系统、跨设备实时同步的云剪贴板，高颜值界面，OCR识别，数据加密保护' }],
    ['meta', { property: 'og:url', content: 'https://www.nbhive.com' }],
    ['meta', { property: 'og:image', content: 'https://www.nbhive.com/logo.png' }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'twitter:title', content: 'Paste Newbee云剪贴板 - 全球唯一跨系统实时同步' }],
    ['meta', { name: 'twitter:description', content: 'Paste Newbee云剪贴板，支持Windows/Mac实时同步，OCR识别，多标签管理' }],
    ['meta', { name: 'twitter:image', content: 'https://www.nbhive.com/logo.png' }],
    ['link', { rel: 'canonical', href: 'https://www.nbhive.com' }],
    // Microsoft Clarity tracking code
    ['script', {}, `
      (function(c,l,a,r,i,t,y){
        c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
        t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i+"?ref=bwt";
        y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
      })(window, document, "clarity", "script", "st8fnsiq78");
    `]
  ],
  themeConfig: {
    logo: "/logo.png",
    nav: [
      { text: "主页", link: "/" },
      { text: "剪贴板指南", link: "/guide/getting-started" },
      { text: "功能特性", link: "/guide/features" },
      { text: "问题解答", link: "/question" },
      { text: "下载", link: "/download" },
      { text: "更新日志", link: "/changelog" },
    ],
    sidebar: {
      "/guide/": [
        {
          text: "云剪贴板介绍",
          items: [
            { text: "快速开始", link: "/guide/getting-started" },
            { text: "核心功能", link: "/guide/features" },
            { text: "技术特点", link: "/guide/tech" },
            { text: "问答", link: "/question" },
          ],
        },
        {
          text: "使用指南",
          items: [
            { text: "基础使用", link: "/guide/basic-usage" },
            { text: "高级功能", link: "/guide/advanced" },
            { text: "常见问题", link: "/guide/faq" },
          ],
        },
      ],
    },
    footer: {
      message: "NewbeeHive",
      copyright: "Copyright © 2024 深圳市长柠科技有限公司 ｜ <a href='https://beian.miit.gov.cn/' target='_blank' rel='noopener'>粤ICP备2025448714号-1</a>",
    },
    outline: [1, 2],
    outlineTitle: '本页导航'
  },
  appearance: {

  }
});
