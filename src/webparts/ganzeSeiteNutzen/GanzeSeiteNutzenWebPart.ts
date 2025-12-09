// tslint:disable:max-line-length

import { DisplayMode } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
  PropertyPaneToggle
} from '@microsoft/sp-webpart-base';

import styles from './GanzeSeiteNutzenWebPart.module.scss';
import * as strings from 'GanzeSeiteNutzenWebPartStrings';
import { applyHideLeftNavStyles, removeHideLeftNavStyles } from '../../utility/HideLeftNavUtils';
import { applyRemoveTopNavStyles, removeRemoveTopNavStyles } from '../../utility/RemoveTopNavUtils';
import { applyFullPageWidthStyles, removeFullPageWidthStyles } from '../../utility/FullPageWidthUtils';
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
    this._applyChanges();
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

    this._applyChanges();
  }

  protected onDispose(): void {
    removeFullPageWidthStyles();
    this._pageTitleUtils.restoreTitle();
    removeHideLeftNavStyles();
    removeRemoveTopNavStyles();
  }

  protected onPropertyPaneFieldChanged(propertyPath: string, oldValue: any, newValue: any): void { // tslint:disable-line:no-any
    super.onPropertyPaneFieldChanged(propertyPath, oldValue, newValue);
    this._applyChanges();
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

  private _applyChanges(): void {
    // Full Page Width
    if (this.properties.useFullPageWidth) {
      applyFullPageWidthStyles();
    } else {
      removeFullPageWidthStyles();
    }

    // Hide Left Nav
    if (this.properties.removeLeftNav) {
      applyHideLeftNavStyles();
    } else {
      removeHideLeftNavStyles();
    }

    // Hide Top Nav
    if (this.properties.removeTopNav) {
      applyRemoveTopNavStyles();
    } else {
      removeRemoveTopNavStyles();
    }

    // Page Title
    if (this.properties.replaceWebTitle) {
      const { pageName, webTitle } = this._getPageAndWebTitle();
      this._pageTitleUtils.updateTitle(webTitle, pageName, this.properties.webTitleTemplate);
    } else {
      this._pageTitleUtils.restoreTitle();
    }
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
