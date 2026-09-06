const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const root = path.resolve(__dirname, '..');
console.log('🔍 正在验证 Chrome Extension 样例工程...');

// 1. 验证 manifest.json
const manifestPath = path.join(root, 'manifest.json');
if (!fs.existsSync(manifestPath)) {
  throw new Error('manifest.json 不存在！');
}
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
if (manifest.manifest_version !== 3) {
  throw new Error(`期望 manifest_version 3，但得到了 ${manifest.manifest_version}`);
}
console.log('✅ manifest.json 格式正确 (Manifest V3)');

// 2. 验证 HTML 中不含任何内联 script
const popupHtmlPath = path.join(root, 'popup.html');
const popupHtml = fs.readFileSync(popupHtmlPath, 'utf8');
if (/<script(?![^>]*src=)[^>]*>[\s\S]*?<\/script>/i.test(popupHtml)) {
  throw new Error('popup.html 中检测到违规的内联 <script>！违反 MV3 CSP 规则。');
}
console.log('✅ popup.html 遵循严格 CSP（无内联脚本）');

// 3. 验证所有 JS 文件语法
const jsFiles = ['popup.js', 'content.js', 'service-worker.js'];
for (const file of jsFiles) {
  const filePath = path.join(root, file);
  if (!fs.existsSync(filePath)) {
    throw new Error(`缺少核心脚本文件: ${file}`);
  }
  execSync(`node --check "${filePath}"`);
  console.log(`✅ ${file} 语法校验通过 (node --check)`);
}

console.log('🎉 全部验证项通过！此扩展可直接加载至 Chrome 开发者模式。');
