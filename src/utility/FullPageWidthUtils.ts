/**
 * ID used for the style element to ensure we can find and remove it later.
 */
const STYLE_ID: string = 'full-page-width-dynamic-styles';

/**
 * Injects CSS styles into the page head to expand the content area to full width.
 */
export function applyFullPageWidthStyles(): void {
  const cssRules: string = `
    div[class*=SPCanvas-canvas], div[class^=CanvasZone], div[class^="homePageContent"] {
      max-width: 100% !important;
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

export function removeFullPageWidthStyles(): void {
  const styleElement: HTMLElement | null = document.getElementById(STYLE_ID);

  if (styleElement) {
    styleElement.remove();
  }
}
