// tslint:disable:max-line-length

import { DisplayMode, Environment } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
  PropertyPaneToggle
} from '@microsoft/sp-webpart-base';

import styles from './GanzeSeiteNutzenWebPart.module.scss';
import * as strings from 'GanzeSeiteNutzenWebPartStrings';
import { hideLeftNavStyles } from '../../utility/hideLeftNavStyles';
import { removeTopNavStyles } from '../../utility/removeTopNavStyles';
import { fullPageWidthStyles } from '../../utility/fullPageWidthStyles';
import { PageTitleUtils } from '../../utility/PageTitleUtils';

export interface IGanzeSeiteNutzenWebPartProps {
  removeLeftNav: boolean;
  removeTopNav: boolean;
  useFullPageWidth: boolean;
  replaceWebTitle: boolean;
  webTitleTemplate: string;
}

export default class GanzeSeiteNutzenWebPart extends BaseClientSideWebPart<IGanzeSeiteNutzenWebPartProps> {

  private _pageTitleUtils: PageTitleUtils;

  public onInit(): Promise<void> {
    this._pageTitleUtils = new PageTitleUtils();
    this._applyCssChanges();
    return super.onInit();
  }

  public render(): void {
    if (this.displayMode === DisplayMode.Edit) {

      this.domElement.innerHTML = `
      <div class="${styles.ganzeSeiteNutzen}">
        <div class="${styles.container}">
          <div class="${styles.row}">
            <div class="${styles.column}">
              <span class="${styles.title}">${strings.AppTitle}</span>
              <p class="${styles.subTitle}">
                ${strings.AppDescription}
                <ul>
                <li>${strings.UseFullPageWidthLabel} (${this.properties.useFullPageWidth ? strings.Activated : strings.NotActivated})</li>
                <li>${strings.RemoveLeftNavLabel} (${this.properties.removeLeftNav ? strings.Activated : strings.NotActivated})</li>
                <li>${strings.RemoveTopNavLabel} (${this.properties.removeTopNav ? strings.Activated : strings.NotActivated})</li>
                <li>${strings.ReplaceWebTitleLabel} (${this.properties.replaceWebTitle ? strings.Activated : strings.NotActivated})</li>
                </ul>
              </p>
              <p class="${styles.subTitle}">
                ${strings.AppConfigInstruction}
              </p>
            </div>
          </div>
        </div>
      </div>`;
    } else {
      this.domElement.innerHTML = '';
    }

    this._applyCssChanges();
    this._applyPageTitle();
  }

  protected onDispose(): void {
    fullPageWidthStyles.remove();
    this._pageTitleUtils.restoreTitle();
    hideLeftNavStyles.remove();
    removeTopNavStyles.remove();
  }

  protected onPropertyPaneFieldChanged(propertyPath: string, oldValue: any, newValue: any): void { // tslint:disable-line:no-any
    super.onPropertyPaneFieldChanged(propertyPath, oldValue, newValue);
    this._applyCssChanges();
    this._applyPageTitle();
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneToggle('removeLeftNav', {
                  label: strings.RemoveLeftNavLabel
                }),
                PropertyPaneToggle('removeTopNav', {
                  label: strings.RemoveTopNavLabel
                }),
                PropertyPaneToggle('useFullPageWidth', {
                  label: strings.UseFullPageWidthLabel
                }),
                PropertyPaneToggle('replaceWebTitle', {
                  label: strings.ReplaceWebTitleLabel
                }),
                PropertyPaneTextField('webTitleTemplate', {
                  label: strings.WebTitleTemplateLabel,
                  description: strings.WebTitleTemplateDescription,
                  disabled: !this.properties.replaceWebTitle
                })
              ]
            }
          ]
        }
      ]
    };
  }

  /** Apply CSS injections – safe to call early (no DOM dependency). */
  private _applyCssChanges(): void {
    fullPageWidthStyles.toggle(this.properties.useFullPageWidth);
    hideLeftNavStyles.toggle(this.properties.removeLeftNav);
    removeTopNavStyles.toggle(this.properties.removeTopNav);
  }

  /** Apply page-title changes – must be called after the DOM is ready. */
  private _applyPageTitle(): void {
    // Skip in edit mode to avoid blanking the SPO page
    if (this.properties.replaceWebTitle && !this._isPageInEditMode()) {
      const { pageName, webTitle } = this._getPageAndWebTitle();
      this._pageTitleUtils.updateTitle(webTitle, pageName, this.properties.webTitleTemplate, Environment.type);
    } else {
      this._pageTitleUtils.restoreTitle();
    }
  }

  /**
   * Reliably detects whether the page is in edit mode.
   * this.displayMode only reflects the web-part's own state, so we also
   * check several DOM indicators that SPO sets when editing a page.
   */
  private _isPageInEditMode(): boolean {
    // 1. SPFx web-part-level flag (set when the property pane is open)
    if (this.displayMode === DisplayMode.Edit) {
      return true;
    }

    // 2. Any contenteditable region on the page (SPO makes canvas zones editable)
    if (document.querySelector('[contenteditable="true"]')) {
      return true;
    }

    // 3. SPO edit-mode command-bar buttons (Publish / Save / Discard)
    if (document.querySelector('button[data-automation-id="pageCommandBarPublishButton"]') ||
        document.querySelector('button[data-automation-id="pageCommandBarSaveButton"]')) {
      return true;
    }

    return false;
  }

  private _getPageAndWebTitle(): { pageName: string, webTitle: string } {
    const listItem: any = this.context.pageContext.listItem; // tslint:disable-line:no-any

    let pageName: string = '';
    if (listItem && listItem.Title) {
      pageName = listItem.Title;
    } else {
      // Fallback to DOM
      const pageHeader: HTMLElement | null = document.querySelector('[data-automation-id="pageHeader"]') as HTMLElement | null;
      if (pageHeader) {
        const pageNameSpan: HTMLElement | null = pageHeader.querySelector('span[role="heading"]') as HTMLElement | null;
        if (pageNameSpan) {
          pageName = pageNameSpan.textContent || '';
        }
      }
    }

    const webTitle: string = this.context.pageContext.web && this.context.pageContext.web.title ?
      this.context.pageContext.web.title :
      '';

    return { pageName, webTitle };
  }
}
