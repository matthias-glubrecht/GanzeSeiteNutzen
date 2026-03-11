import { CssInjector } from './CssInjector';

/**
 * Pre-configured {@link CssInjector} that hides the top navigation (mega menu).
 */
export const removeTopNavStyles: CssInjector = new CssInjector(
  'remove-top-nav-dynamic-styles',
  `
    nav.mega-menu-main {
      display: none !important;
    }
  `
);
