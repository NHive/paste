# Paste 官网归档

[English](README.md) | 中文

Paste 已停止维护，后续下载统一前往 [ArcRelay](https://arcrelay.app/zh/products/arcrelay#downloads)。ArcRelay 是开源的局域网跨设备应用。本仓库保留 Paste 旧版指南，并提供升级说明和下载入口。

归档文档描述的是旧版 Paste 服务，不代表 ArcRelay 自动继承旧账户、历史记录或订阅。原有用户可联系 support@nbhive.com。

## 本地开发

使用 Node.js 24：

```bash
npm ci
npm run docs:build
npm run verify:site
npm run docs:dev
```

## 发布

Jenkins 任务 `nbhive-website` 从 `main` 读取 `Jenkinsfile`，轮询代码变更，构建、校验后发布到 Cloudflare Pages 项目 `newbeesite`。鉴权复用 Jenkins 的 `cf-account-id`、`cf-pages-api-token`，GitHub Actions 仅负责构建校验。

- `DEPLOY_PRODUCTION=true`：发布校验通过的 main，默认为 true；设为 false 时仅构建。
- `SYNC_DOMAINS=true`：将两个 www 域名关联到 Pages，DNS 记录另行备份、预览和切换；平时保持 false。
- www.nbhive.cn 保留现有外部 DNS 服务商，在关联 Pages 后切换 www CNAME。
- Jenkins 归档 `evidence/cloudflare-before.json`，保存原生产部署；DNS 记录在切换前单独备份。恢复原 DNS 记录可回到原托管平台，内容回退可在 Cloudflare 中回滚 Pages 部署。

官网：[www.nbhive.com](https://www.nbhive.com)、[www.nbhive.cn](https://www.nbhive.cn)。

## 搜索引擎规范网址

www.nbhive.com 是主要收录域名。所有 HTML 页面使用对应的 .com 规范网址（canonical），并提供真实存在的语言版本链接；www.nbhive.cn 保持可访问，指向同一页面的 .com canonical。站点地图与 robots.txt 只声明 .com 规范网址；旧 .html 地址由 Pages 转到无扩展名地址。

英文首页统一为 /，/en 与 /en/ 永久重定向到 /。Pages 生产和版本预览地址通过限定主机的 X-Robots-Tag: noindex 禁止收录，两个 www 正式域名没有 noindex。搜索引擎重新抓取后才能逐步应用这些信号。

## 版权

版权所有 © 2024 NBHIVE 团队。保留所有权利。Paste 应用并未开源，ArcRelay 的源码和许可独立管理。
