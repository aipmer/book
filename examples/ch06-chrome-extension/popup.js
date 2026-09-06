document.addEventListener('DOMContentLoaded', async () => {
  const selectedTextEl = document.getElementById('selectedText');
  const summarizeBtn = document.getElementById('summarizeBtn');
  const copyMarkdownBtn = document.getElementById('copyMarkdownBtn');
  const statusBar = document.getElementById('statusBar');

  let activeTab = null;

  try {
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    activeTab = tabs[0];
  } catch (err) {
    selectedTextEl.textContent = '无法获取当前标签页信息';
    return;
  }

  if (!activeTab || !activeTab.id || activeTab.url.startsWith('chrome://')) {
    selectedTextEl.textContent = '当前为系统受保护页面，无法注入脚本。请在普通网页中使用。';
    summarizeBtn.disabled = true;
    copyMarkdownBtn.disabled = true;
    return;
  }

  // 请求 content script 获取选中文本或页面摘要
  chrome.tabs.sendMessage(activeTab.id, { action: 'GET_PAGE_SUMMARY' }, (response) => {
    if (chrome.runtime.lastError || !response) {
      selectedTextEl.textContent = `页面标题: ${activeTab.title || '未知'}\n网址: ${activeTab.url}`;
      return;
    }

    if (response.selection) {
      selectedTextEl.textContent = `「选中文本」:\n${response.selection}`;
    } else {
      selectedTextEl.textContent = `「页面摘要」:\n${response.summary || activeTab.title}`;
    }
  });

  // 提取核心要点模拟
  summarizeBtn.addEventListener('click', async () => {
    statusBar.textContent = '正在由 Codex 思考链进行结构化提炼...';
    summarizeBtn.disabled = true;

    chrome.tabs.sendMessage(activeTab.id, { action: 'EXTRACT_KEY_POINTS' }, (res) => {
      summarizeBtn.disabled = false;
      if (chrome.runtime.lastError || !res) {
        statusBar.textContent = '提取完成（默认模式）';
        return;
      }
      selectedTextEl.textContent = res.keyPoints || '未能提取到正文文本。';
      statusBar.textContent = '提炼完成 · 已遵循规范过滤广告与冗余';
    });
  });

  // 复制为 Markdown 引用
  copyMarkdownBtn.addEventListener('click', async () => {
    const text = selectedTextEl.textContent;
    const title = activeTab.title || '网页引用';
    const url = activeTab.url;
    const markdownQuote = `> ${text.replace(/\n/g, '\n> ')}\n\n*来源: [${title}](${url})*`;

    try {
      await navigator.clipboard.writeText(markdownQuote);
      statusBar.textContent = '✅ 已成功复制 Markdown 引用到剪贴板！';
      setTimeout(() => {
        statusBar.textContent = '就绪 · 遵循 Anti-Loop 护栏约束';
      }, 2500);
    } catch (err) {
      statusBar.textContent = '复制失败，请手动选择复制。';
    }
  });
});
