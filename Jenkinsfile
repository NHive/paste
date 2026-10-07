pipeline {
    agent { label 'linux' }
    options {
        timestamps()
        timeout(time: 30, unit: 'MINUTES')
        disableConcurrentBuilds()
        buildDiscarder(logRotator(numToKeepStr: '20'))
        skipDefaultCheckout(true)
    }
    triggers { pollSCM('H/5 * * * *') }
    parameters {
        booleanParam(name: 'DEPLOY_PRODUCTION', defaultValue: true, description: 'Publish verified main to Cloudflare Pages')
        booleanParam(name: 'SYNC_DOMAINS', defaultValue: false, description: 'After Pages verification, associate both www domains; DNS changes are handled separately')
    }
    stages {
        stage('Checkout') {
            steps {
                checkout scm
                script {
                    env.REVISION = sh(returnStdout: true, script: 'git rev-parse HEAD').trim()
                    env.SOURCE_BRANCH = (env.BRANCH_NAME ?: env.GIT_BRANCH ?: 'main').replaceAll('^origin/', '')
                    if (params.DEPLOY_PRODUCTION && (env.CHANGE_ID || env.SOURCE_BRANCH != 'main')) {
                        error 'Production publishing is restricted to main'
                    }
                }
            }
        }
        stage('Build and Verify') {
            steps {
                sh '''#!/usr/bin/env bash
set -euo pipefail
export NVM_DIR="${HOME}/.nvm"
. "${NVM_DIR}/nvm.sh"
nvm use 24 >/dev/null
npm ci --registry=https://registry.npmjs.org --no-audit
npm run docs:build
npm run verify:site
'''
            }
        }
        stage('Publish Cloudflare Pages') {
            when { expression { return params.DEPLOY_PRODUCTION } }
            environment {
                CLOUDFLARE_ACCOUNT_ID = credentials('cf-account-id')
                CLOUDFLARE_API_TOKEN = credentials('cf-pages-api-token')
                WRANGLER_SEND_METRICS = 'false'
            }
            steps {
                sh '''#!/usr/bin/env bash
set -euo pipefail
export NVM_DIR="${HOME}/.nvm"
. "${NVM_DIR}/nvm.sh"
nvm use 24 >/dev/null
node scripts/cloudflare-pages.mjs snapshot
node scripts/cloudflare-pages.mjs ensure-project
./node_modules/.bin/wrangler pages deploy docs/.vitepress/dist \
  --project-name=newbeesite --branch=main --commit-hash="${REVISION}"
# Check the deployment before custom-domain or DNS mutation.
curl --connect-timeout 10 --max-time 30 --retry 3 --retry-delay 5 -fsSL \
  https://newbeesite.pages.dev/en/download -o evidence/pages-download.html
python3 - <<'PY'
from pathlib import Path
body = Path('evidence/pages-download.html').read_text()
assert 'https://arcrelay.app/en/products/arcrelay#downloads' in body
assert 'releases.czbrcj.cn/api/v1/release/paste/latest' not in body
print('Pages public download path verified')
PY
'''
                script {
                    if (params.SYNC_DOMAINS) {
                        sh '''#!/usr/bin/env bash
set -euo pipefail
export NVM_DIR="${HOME}/.nvm"
. "${NVM_DIR}/nvm.sh"
nvm use 24 >/dev/null
node scripts/cloudflare-pages.mjs attach-domains
'''
                    }
                }
                sh '''#!/usr/bin/env bash
set -euo pipefail
export NVM_DIR="${HOME}/.nvm"
. "${NVM_DIR}/nvm.sh"
nvm use 24 >/dev/null
node scripts/cloudflare-pages.mjs status
'''
            }
        }
    }
    post {
        always {
            archiveArtifacts artifacts: 'evidence/**', allowEmptyArchive: true
        }
    }
}
