const { mdToPdf } = require('md-to-pdf');
const path = require('path');
const fs = require('fs');

async function compile() {
  // Resolve the workspace root dynamically relative to this script's directory (__dirname is /scripts)
  const scriptDir = __dirname;
  const workspace = path.dirname(scriptDir);
  
  console.log('Converting Chinese Book to PDF...');
  const pdfZh = await mdToPdf(
    { path: path.join(workspace, 'codex_blue_book_zh.md') },
    {
      pdf_options: {
        format: 'A4',
        margin: { top: '20mm', right: '20mm', bottom: '20mm', left: '20mm' },
        printBackground: true
      }
    }
  );
  fs.writeFileSync(path.join(workspace, 'codex_blue_book_zh.pdf'), pdfZh.content);
  console.log('Created codex_blue_book_zh.pdf');

  console.log('Converting English Book to PDF...');
  const pdfEn = await mdToPdf(
    { path: path.join(workspace, 'codex_blue_book_en.md') },
    {
      pdf_options: {
        format: 'A4',
        margin: { top: '20mm', right: '20mm', bottom: '20mm', left: '20mm' },
        printBackground: true
      }
    }
  );
  fs.writeFileSync(path.join(workspace, 'codex_blue_book_en.pdf'), pdfEn.content);
  console.log('Created codex_blue_book_en.pdf');
}

compile().catch(console.error);
