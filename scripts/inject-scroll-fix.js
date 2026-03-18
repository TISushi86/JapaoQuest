/**
 * Injeta CSS de correção de scroll no index.html após o build.
 * Necessário para o scroll funcionar no Vercel (produção).
 */
const fs = require('fs');
const path = require('path');

const distPath = path.join(__dirname, '..', 'dist', 'index.html');
if (!fs.existsSync(distPath)) {
  console.warn('dist/index.html não encontrado. Pulando inject-scroll-fix.');
  process.exit(0);
}

const SCROLL_FIX_CSS = `
    <style id="japaoquest-scroll-fix">
      html, body { height: 100%; margin: 0; }
      #root, #root > div { display: flex; flex-direction: column; height: 100%; min-height: 100vh; overflow: hidden; }
      #root * { box-sizing: border-box; }
      #root [style*="flex: 1"], #root [style*="flex:1"] { min-height: 0 !important; }
      #root [style*="overflow"] { overflow: auto !important; -webkit-overflow-scrolling: touch !important; touch-action: pan-y !important; }
    </style>
`;

let html = fs.readFileSync(distPath, 'utf8');
if (html.includes('japaoquest-scroll-fix')) {
  console.log('Scroll fix já presente em index.html');
  process.exit(0);
}

html = html.replace('</head>', SCROLL_FIX_CSS + '\n  </head>');
fs.writeFileSync(distPath, html);
console.log('✓ Scroll fix injetado em dist/index.html');
