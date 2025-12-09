/**
 * ID used for the style element to ensure we can find and remove it later.
 */
const STYLE_ID: string = 'hide-left-nav-dynamic-styles';

/**
 * Injects CSS styles into the page head to hide the SharePoint left navigation
 */
export function applyHideLeftNavStyles(): void {
  const cssRules: string = `
    div[class^=searchBox_], nav[role=navigation]:not(.mega-menu-main) {
      display: none !important;
    }

    div[class^=pageContainer_] {
      left: 0 !important;
    }
  `;

  if (!document.getElementById(STYLE_ID)) {
    const head: HTMLHeadElement = document.getElementsByTagName('head')[0];
    const style: HTMLStyleElement = document.createElement('style');
    style.id = STYLE_ID;
    style.appendChild(document.createTextNode(cssRules));
    head.appendChild(style);
  }
}

export function removeHideLeftNavStyles(): void {
  const styleElement: HTMLElement | null = document.getElementById(STYLE_ID);

  if (styleElement) {
    styleElement.remove();
  }
}
