export class PageTitleUtils {
    private _originalSiteTitle: string | undefined;
    private _originalPageHeaderDisplay: string | undefined;
    private _isModified: boolean = false;
    private _appendedPageTitle: string | undefined;

    public updateTitle(webTitle: string, pageTitle: string, template: string): void {
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

        if (template) {
            const newPageTitle: string = template.replace('{webTitle}', webTitle).replace('{pageName}', pageTitle);
            siteTitleSpan.textContent = newPageTitle;
            this._appendedPageTitle = pageTitle;
        } else {
            this._appendedPageTitle = undefined;
        }

        this._isModified = true;
    }

    public restoreTitle(): void {
        if (!this._isModified) {
            return;
        }

        // Restore Page Header
        const pageHeader: HTMLElement | null =
            document.querySelector('[data-automation-id="pageHeader"]') as HTMLElement | null;
        if (pageHeader) {
            if (this._originalPageHeaderDisplay !== undefined && this._originalPageHeaderDisplay !== '') {
                pageHeader.style.display = this._originalPageHeaderDisplay;
            } else {
                pageHeader.style.removeProperty('display');
            }
        }

        // Restore Site Title
        const siteTitleSpan: HTMLElement | null =
            document.querySelector('span[data-automationid="SiteHeaderTitle"]') as HTMLElement | null;
        if (siteTitleSpan) {
            if (this._originalSiteTitle !== undefined) {
                siteTitleSpan.textContent = this._originalSiteTitle;
            }
        }

        this._isModified = false;
        this._appendedPageTitle = undefined;
        this._originalPageHeaderDisplay = undefined;
        this._originalSiteTitle = undefined;
    }
}
