// Only Jenkins' credential binding supplies credentials. Never log request headers or secret values.
import fs from 'node:fs';
const project = 'newbeesite';
const token = process.env.CLOUDFLARE_API_TOKEN;
const account = process.env.CLOUDFLARE_ACCOUNT_ID;
if (!token || !account) throw new Error('Cloudflare credential binding is missing');
const projectPath = `/accounts/${encodeURIComponent(account)}/pages/projects/${project}`;
async function api(path, method = 'GET', body, allowMissing = false) {
  const response = await fetch(`https://api.cloudflare.com/client/v4${path}`, {
    method,
    headers: {Authorization: `Bearer ${token}`, 'Content-Type': 'application/json'},
    ...(body ? {body: JSON.stringify(body)} : {}),
  });
  const data = await response.json();
  if (allowMissing && response.status === 404) return null;
  if (!response.ok || !data.success) {
    throw new Error(`Cloudflare ${method} failed: HTTP ${response.status}, codes ${(data.errors || []).map(e => e.code).join(',')}`);
  }
  return data.result;
}
async function snapshot() {
  const existing = await api(projectPath, 'GET', undefined, true);
  const zones = await api(`/zones?name=nbhive.com&account.id=${encodeURIComponent(account)}`);
  if (zones.length !== 1) throw new Error('Expected exactly one accessible nbhive.com zone');
  const zone = zones[0];
  const records = await api(`/zones/${zone.id}/dns_records?name=www.nbhive.com`);
  const domains = existing ? await api(`${projectPath}/domains`) : [];
  const evidence = {
    checked_at: new Date().toISOString(), project,
    project_existed: !!existing,
    previous_production: existing?.canonical_deployment?.id ?? null,
    project_subdomain: existing?.subdomain ?? null,
    source_type: existing?.source?.type ?? 'direct-upload',
    zone_id: zone.id,
    records: records.map(({id, type, name, content, ttl, proxied}) => ({id, type, name, content, ttl, proxied})),
    domains: domains.map(({name, status}) => ({name, status})),
  };
  fs.mkdirSync('evidence', {recursive:true});
  fs.writeFileSync('evidence/cloudflare-before.json', JSON.stringify(evidence,null,2)+'\n');
  console.log(JSON.stringify(evidence));
}
async function ensureProject() {
  let existing = await api(projectPath, 'GET', undefined, true);
  if (!existing) existing = await api(`/accounts/${encodeURIComponent(account)}/pages/projects`, 'POST', {name:project, production_branch:'main'});
  console.log(JSON.stringify({project:existing.name, subdomain:existing.subdomain, production_branch:existing.production_branch}));
}
async function attachDomains() {
  const prior = JSON.parse(fs.readFileSync('evidence/cloudflare-before.json','utf8'));
  const existing = await api(projectPath);
  const target = existing.subdomain;
  if (!target || !target.endsWith('.pages.dev')) throw new Error('Unexpected Pages hostname');
  const records = await api(`/zones/${prior.zone_id}/dns_records?name=www.nbhive.com`);
  if (records.length !== 1 || records[0].type !== 'CNAME') throw new Error('Expected one www CNAME; refusing broader DNS changes');
  const current = records[0];
  const validOld = '6db540e2.www.nbhive.com.dns.edgeone.app';
  if (![validOld,target].includes(current.content.replace(/\.$/,''))) throw new Error('www.nbhive.com has an unexpected target; review required');
  const domains = await api(`${projectPath}/domains`);
  for (const name of ['www.nbhive.com','www.nbhive.cn']) {
    if (!domains.some(d => d.name === name)) await api(`${projectPath}/domains`, 'POST', {name});
  }
  // Re-read because Pages may create or update DNS while attaching the custom domain.
  const fresh = await api(`/zones/${prior.zone_id}/dns_records?name=www.nbhive.com`);
  if (fresh.length !== 1 || fresh[0].type !== 'CNAME') throw new Error('Unexpected www state after Pages domain association');
  if (fresh[0].content.replace(/\.$/,'') !== target) {
    if (fresh[0].content.replace(/\.$/,'') !== validOld) throw new Error('www DNS changed concurrently; refusing overwrite');
    await api(`/zones/${prior.zone_id}/dns_records/${fresh[0].id}`, 'PATCH', {type:'CNAME',name:'www.nbhive.com',content:target,ttl:1,proxied:true});
  }
  console.log(JSON.stringify({domains:await api(`${projectPath}/domains`), external_dns:{name:'www.nbhive.cn',type:'CNAME',target}}));
}
const command = process.argv[2];
if (command === 'snapshot') await snapshot();
else if (command === 'ensure-project') await ensureProject();
else if (command === 'attach-domains') await attachDomains();
else if (command === 'status') {
  const p=await api(projectPath);
  console.log(JSON.stringify({project:p.name,subdomain:p.subdomain,deployment:p.canonical_deployment?.id,domains:await api(`${projectPath}/domains`)}));
} else throw new Error('Unknown Pages operation');
