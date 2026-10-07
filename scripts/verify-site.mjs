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
      assert(!content.includes('releases.czbrcj.cn/api/v1/release/paste/latest'), `${file}: obsolete release request`);
      assert(!/apps\.apple\.com\/[^"\s]*paste-newbee/.test(content), `${file}: obsolete store link`);
    }
  }
}
scan(dist);
console.log('Built-site migration checks passed: all locales, archived guides, root and release dependencies.');
