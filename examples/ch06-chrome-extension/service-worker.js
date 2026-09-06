// Background Service Worker (Manifest V3)
// 遵循生命周期短暂性原则，不依赖持久全局变量

chrome.runtime.onInstalled.addListener(() => {
  // 创建右键划词菜单
  chrome.contextMenus.create({
    id: 'codex-copilot-explain',
    title: '🤖 Codex 智能提炼选中文本',
    contexts: ['selection']
  });

  console.log('[Codex Copilot] 插件初始化成功，CAP 规约守卫已就绪。');
});

// 处理右键菜单点击
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'codex-copilot-explain' && info.selectionText) {
    chrome.storage.local.set({
      lastSelectedText: info.selectionText,
      sourceUrl: tab.url,
      timestamp: Date.now()
    }, () => {
      console.log('[Codex Copilot] 已保存划词至本地沙盒存储。');
    });
  }
});
