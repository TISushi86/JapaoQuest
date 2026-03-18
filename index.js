// Fix scroll na web (Vercel) — injeta CSS antes do React montar
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.id = 'japaoquest-scroll-fix';
  style.textContent = `
    html, body { height: 100%; margin: 0; }
    #root, #root > div { display: flex; flex-direction: column; height: 100%; min-height: 100vh; overflow: hidden; }
    #root * { box-sizing: border-box; }
    #root [style*="flex: 1"], #root [style*="flex: 1 1"] { min-height: 0 !important; }
    #root [style*="overflow"] { overflow: auto !important; -webkit-overflow-scrolling: touch !important; touch-action: pan-y !important; }
  `;
  document.head.appendChild(style);
}

import { registerRootComponent } from 'expo';

import App from './App';

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
