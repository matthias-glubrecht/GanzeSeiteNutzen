import { CssInjector } from './CssInjector';

/**
 * Pre-configured {@link CssInjector} that hides the SharePoint left navigation.
 */
export const hideLeftNavStyles: CssInjector = new CssInjector(
  'hide-left-nav-dynamic-styles',
  `
    div[class^=searchBox_], nav[role=navigation]:not(.mega-menu-main) {
      display: none !important;
    }

    div[class^=pageContainer_] {
      left: 0 !important;
    }
  `
);
