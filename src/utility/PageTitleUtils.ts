import { EnvironmentType } from '@microsoft/sp-core-library';
import { CssInjector } from './CssInjector';

/**
 * Escapes a string for safe use inside a CSS `content: "..."` value.
 */
function cssEscape(text: string): string {
    return text
        .replace(/\\/g, '\\\\')
        .replace(/"/g, '\\"')
        .replace(/\n/g, '\\a ');
}

export class PageTitleUtils {
    // --- On-premises (DOM manipulation) state ---
    private _originalSiteTitle: string | undefined;
    private _originalPageHeaderDisplay: string | undefined;
    private _isModified: boolean = false;

    // --- SPO (CSS-only) state ---
    private _spoTitleInjector: CssInjector = new CssInjector('replace-web-title-dynamic-styles', '');
    private _spoPageHeaderInjector: CssInjector = new CssInjector('hide-page-header-dynamic-styles', `
        [data-automation-id="pageHeader"] {
            display: none !important;
        }
    `);

    /**
     * Replaces the site title using a strategy appropriate for the environment.
     *
     * - **SharePoint on-premises** (`ClassicSharePoint`): directly modifies the
     *   DOM elements. This is safe because the page is not rendered by React.
     *   Also hides the page header element.
     *
     * - **SharePoint Online** (`SharePoint`): injects CSS that hides the original
     *   title text and shows replacement text via a `::after` pseudo-element.
     *   This avoids touching React-owned DOM nodes, which would break rendering.
     */
    public updateTitle(webTitle: string, pageTitle: string, template: string, environmentType: EnvironmentType): void {
        if (!template) {
            return;
        }

        const newTitle: string = template.replace('{webTitle}', webTitle).replace('{pageName}', pageTitle);

        if (environmentType === EnvironmentType.ClassicSharePoint) {
            this._applyOnPremises(newTitle);
        } else {
            this._applySpo(newTitle);
        }
    }

    public restoreTitle(): void {
        this._restoreOnPremises();
        this._restoreSpo();
    }

    // ── On-premises strategy (direct DOM manipulation) ───────────────────

    private _applyOnPremises(newTitle: string): void {
        const pageHeader: HTMLElement | null =
            document.querySelector('[data-automation-id="pageHeader"]') as HTMLElement | null;
        const siteTitleSpan: HTMLElement | null =
            document.querySelector('span[data-automationid="SiteHeaderTitle"]') as HTMLElement | null;

        if (!siteTitleSpan) {
            return;
        }

        // Hide Page Header
        if (pageHeader) {
            if (this._originalPageHeaderDisplay === undefined) {
                this._originalPageHeaderDisplay = pageHeader.style.display || '';
            }
            pageHeader.style.display = 'none';
        }

        // Update Site Title
        if (this._originalSiteTitle === undefined) {
            this._originalSiteTitle = siteTitleSpan.textContent || '';
        }
        siteTitleSpan.textContent = newTitle;
        this._isModified = true;
    }

    private _restoreOnPremises(): void {
        if (!this._isModified) {
            return;
        }

        const pageHeader: HTMLElement | null =
            document.querySelector('[data-automation-id="pageHeader"]') as HTMLElement | null;
        if (pageHeader) {
            if (this._originalPageHeaderDisplay !== undefined && this._originalPageHeaderDisplay !== '') {
                pageHeader.style.display = this._originalPageHeaderDisplay;
            } else {
                pageHeader.style.removeProperty('display');
            }
        }

        const siteTitleSpan: HTMLElement | null =
            document.querySelector('span[data-automationid="SiteHeaderTitle"]') as HTMLElement | null;
        if (siteTitleSpan && this._originalSiteTitle !== undefined) {
            siteTitleSpan.textContent = this._originalSiteTitle;
        }

        this._isModified = false;
        this._originalPageHeaderDisplay = undefined;
        this._originalSiteTitle = undefined;
    }

    // ── SPO strategy (CSS-only, no React DOM mutation) ───────────────────

    private _applySpo(newTitle: string): void {
        const escapedTitle: string = cssEscape(newTitle);

        const css: string = `
            /* Hide the original site-title text without removing the element */
            span[data-automationid="SiteHeaderTitle"] {
                font-size: 0 !important;
            }
            /* Show replacement text via a pseudo-element */
            span[data-automationid="SiteHeaderTitle"]::after {
                content: "${escapedTitle}" !important;
                font-size: 14px !important;
                font-weight: 600 !important;
            }
        `;

        this._spoTitleInjector.update(css);
        this._spoPageHeaderInjector.apply();
    }

    private _restoreSpo(): void {
        this._spoTitleInjector.remove();
        this._spoPageHeaderInjector.remove();
    }
}
