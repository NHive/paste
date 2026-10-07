import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
const dist = 'docs/.vitepress/dist';
const targets = {
  en: 'https://arcrelay.app/en/products/arcrelay#downloads',
  'zh-cn': 'https://arcrelay.app/zh/products/arcrelay#downloads',
  'zh-hk': 'https://arcrelay.app/zh/products/arcrelay#downloads',
};
for (const [locale, target] of Object.entries(targets)) {
  for (const page of ['index.html', 'download.html', 'guide/getting-started.html']) {
    const file = path.join(dist, locale, page);
    const html = fs.readFileSync(file, 'utf8');
    assert(html.includes(`href="${target}"`), `${file}: missing ArcRelay download link`);
    assert(!html.includes('releases.czbrcj.cn'), `${file}: still depends on Paste release service`);
    if (page.startsWith('guide/')) assert(html.includes('migration-notice'), `${file}: missing archive notice`);
  }
}
assert(fs.readFileSync(path.join(dist, 'index.html'), 'utf8').includes(targets.en));
function scan(dir) {
  for (const entry of fs.readdirSync(dir, {withFileTypes: true})) {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) scan(file);
    else if (/\.(html|js)$/.test(file)) {
      const content = fs.readFileSync(file, 'utf8');
      if (file.endsWith('.html') && (path.basename(file) === '404.html' ||
          fs.existsSync(path.join('docs', path.relative(dist, file).replace(/\.html$/, '.md'))))) {
        const head = content.split('</head>')[0];
        const relative = path.relative(dist, file).replaceAll(path.sep, '/');
        if (relative === '404.html') {
          assert(head.includes('name="robots" content="noindex"'), '404 must not be indexed');
        } else {
          const canonicals = [...head.matchAll(/<link\b[^>]*rel="canonical"[^>]*href="([^"]+)"/g)];
          assert.equal(canonicals.length, 1, `${file}: must have one canonical`);
          let route = '/' + relative.replace(/(^|\/)index\.html$/, '$1').replace(/\.html$/, '');
          if (route === '/en/') route = '/';
          assert.equal(canonicals[0][1], 'https://www.nbhive.com' + route, `${file}: wrong canonical page`);
          assert(!/name="robots" content="[^"]*noindex/.test(head), `${file}: primary HTML must remain indexable`);
        }
      }
      assert(!content.includes('releases.czbrcj.cn/api/v1/release/paste/latest'), `${file}: obsolete release request`);
      assert(!/apps\.apple\.com\/[^"\s]*paste-newbee/.test(content), `${file}: obsolete store link`);
    }
  }
}
scan(dist);
const sitemap = fs.readFileSync(path.join(dist, 'sitemap.xml'), 'utf8');
const locations = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => match[1]);
assert.equal(new Set(locations).size, locations.length, 'duplicate sitemap URLs');
assert(locations.length > 20, 'sitemap unexpectedly lost archived pages');
assert(locations.every(url => url.startsWith('https://www.nbhive.com/') && !url.endsWith('.html')), 'noncanonical sitemap URL');
assert(!locations.includes('https://www.nbhive.com/en/'), 'duplicate English homepage in sitemap');
assert(!locations.includes('https://www.nbhive.com/404'), '404 in sitemap');
assert(locations.includes('https://www.nbhive.com/zh-cn/download'), 'missing canonical Chinese download page');
const chineseHome = fs.readFileSync(path.join(dist, 'zh-cn/index.html'), 'utf8').split('</head>')[0];
assert(chineseHome.includes('hreflang="en" href="https://www.nbhive.com/"'), 'missing English alternate');
assert(chineseHome.includes('hreflang="zh-HK" href="https://www.nbhive.com/zh-hk/"'), 'missing traditional Chinese alternate');
assert.equal(fs.readFileSync(path.join(dist, 'robots.txt'), 'utf8').trim(), 'User-agent: *\nAllow: /\n\nSitemap: https://www.nbhive.com/sitemap.xml');
assert(fs.readFileSync(path.join(dist, '_headers'), 'utf8').includes('https://:version.newbeesite.pages.dev/*\n  X-Robots-Tag: noindex'), 'missing preview noindex rule');
console.log('Built-site checks passed: migration links, archive notices, per-page canonical, language alternatives and canonical sitemap.');
