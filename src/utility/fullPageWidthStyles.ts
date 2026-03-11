import { CssInjector } from './CssInjector';

/**
 * Pre-configured {@link CssInjector} that expands the content area to full page width.
 */
export const fullPageWidthStyles: CssInjector = new CssInjector(
  'full-page-width-dynamic-styles',
  `
    div[class*=SPCanvas-canvas], div[class^=CanvasZone], div[class^="homePageContent"] {
      max-width: 100% !important;
    }
  `
);
