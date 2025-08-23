---
aside: false
title: 下载剪贴板管理器 - Paste Newbee
description: 为Windows和macOS下载最新版本的Paste Newbee剪贴板管理器。获取这款强大的剪贴板管理软件，享受跨设备同步的便利。
---

<script setup>
import { ref, onMounted } from 'vue'
import { useData, withBase } from 'vitepress'

const { site } = useData()
const releaseInfo = ref({
  windows: { version: '', size: 0, url: '' },
  macos: { version: '', size: 0, url: '' }
})

onMounted(async () => {
  try {
    const response = await fetch('https://releases.czbrcj.cn/api/v1/release/paste/latest')
    const data = await response.json()
    releaseInfo.value = data
  } catch (error) {
    console.error('获取版本信息失败:', error)
  }
})

// 格式化文件大小的函数
const formatSize = (bytes) => {
  return (bytes / (1024 * 1024)).toFixed(2) + ' MB'
}

// 添加下载处理函数
const handleDownload = (url, platform) => {
  // 开始下载
  window.location.href = url
  
  // 延迟跳转到下载完成页面
  setTimeout(() => {
    window.location.href = withBase(`/download-complete.html?platform=${platform}`)
  }, 3000)
}
</script>

## 选择您的平台

<div class="download-cards">
  <div class="download-card">
    <img src="/icons/windows.svg" alt="Windows" class="os-icon">
    <h3>Windows 版本</h3>
    <div class="version-info">
      <span>最新版本：v{{ releaseInfo.windows.version }}</span>
      <span>大小：{{ formatSize(releaseInfo.windows.size) }}</span>
    </div>
    <ul class="requirements-list">
      <li>支持 Windows 10 及以上系统</li>
      <li>支持 x86/x64 系统</li>
      <li>自动更新</li>
    </ul>
    <a @click.prevent="handleDownload(releaseInfo.windows.url, 'windows')" class="download-button">
      下载 Windows 版本
    </a>
  </div>

  <div class="download-card">
    <img src="/icons/macos.svg" alt="macOS" class="os-icon">
    <h3>macOS 版本</h3>
    <div class="version-info">
      <span>最新版本：v{{ releaseInfo.macos.version }}</span>
      <span>大小：{{ formatSize(releaseInfo.macos.size) }}</span>
    </div>
    <ul class="requirements-list">
      <li>支持 macOS 12.0 及以上系统</li>
      <li>支持 Apple Silicon/Intel</li>
      <li>自动更新</li>
    </ul>
    <a @click.prevent="handleDownload(releaseInfo.macos.url, 'macos')" class="download-button">
      下载 macOS 版本
    </a>
  </div>
</div>

## 系统要求

<div class="requirements-card">
  <h3>Windows 系统要求</h3>
  <ul class="requirements-list">
    <li>Windows 10 或更高版本</li>
    <li>最低 4GB 内存</li>
    <li>200MB 可用磁盘空间</li>
    <li>需要网络连接以使用同步功能</li>
  </ul>
</div>

<div class="requirements-card">
  <h3>macOS 系统要求</h3>
  <ul class="requirements-list">
    <li>macOS 12.0 或更高版本</li>
    <li>最低 4GB 内存</li>
    <li>200MB 可用磁盘空间</li>
    <li>需要网络连接以使用同步功能</li>
  </ul>
</div>

::: warning 安全提示
请务必从官方渠道下载 Paste-Newbee 以确保安全。所有下载链接均使用 HTTPS 加密传输。
:::
