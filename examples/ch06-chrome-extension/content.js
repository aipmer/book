// Content Script: 负责与宿主页面 DOM 交互，遵循最小侵入与安全防护原则

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'GET_PAGE_SUMMARY') {
    const selection = window.getSelection().toString().trim();
    const pageTitle = document.title;
    const metaDesc = document.querySelector('meta[name="description"]')?.content || '';
    
    // 如果有划词选中，优先返回划词；否则提取正文前 200 字
    let bodySnippet = '';
    const mainEl = document.querySelector('main, article, [role="main"]') || document.body;
    if (mainEl) {
      bodySnippet = mainEl.innerText.replace(/\s+/g, ' ').slice(0, 200);
    }

    sendResponse({
      selection: selection || null,
      title: pageTitle,
      summary: metaDesc || bodySnippet || pageTitle
    });
    return true;
  }

  if (request.action === 'EXTRACT_KEY_POINTS') {
    // 提取页面所有 H1/H2 以及正文关键句
    const headings = Array.from(document.querySelectorAll('h1, h2, h3'))
      .slice(0, 5)
      .map(h => h.innerText.trim())
      .filter(Boolean);

    const selection = window.getSelection().toString().trim();
    let result = '';

    if (selection) {
      result = `【选区重点】\n${selection}\n\n【字符数】: ${selection.length}`;
    } else if (headings.length > 0) {
      result = `【核心纲要】\n` + headings.map((h, i) => `${i + 1}. ${h}`).join('\n');
    } else {
      result = document.title;
    }

    sendResponse({ keyPoints: result });
    return true;
  }
});
