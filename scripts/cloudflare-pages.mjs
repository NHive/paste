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
  const domains = existing ? await api(`${projectPath}/domains`) : [];
  const evidence = {
    checked_at: new Date().toISOString(), project,
    project_existed: !!existing,
    previous_production: existing?.canonical_deployment?.id ?? null,
    project_subdomain: existing?.subdomain ?? null,
    source_type: existing?.source?.type ?? 'direct-upload',
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
  const existing = await api(projectPath);
  const target = existing.subdomain;
  if (!target || !target.endsWith('.pages.dev')) throw new Error('Unexpected Pages hostname');
  const domains = await api(`${projectPath}/domains`);
  for (const name of ['www.nbhive.com','www.nbhive.cn']) {
    if (!domains.some(d => d.name === name)) await api(`${projectPath}/domains`, 'POST', {name});
  }
  console.log(JSON.stringify({domains:await api(`${projectPath}/domains`), external_dns:['www.nbhive.com','www.nbhive.cn'].map(name => ({name,type:'CNAME',target}))}));
}
const command = process.argv[2];
if (command === 'snapshot') await snapshot();
else if (command === 'ensure-project') await ensureProject();
else if (command === 'attach-domains') await attachDomains();
else if (command === 'status') {
  const p=await api(projectPath);
  console.log(JSON.stringify({project:p.name,subdomain:p.subdomain,deployment:p.canonical_deployment?.id,domains:await api(`${projectPath}/domains`)}));
} else throw new Error('Unknown Pages operation');
