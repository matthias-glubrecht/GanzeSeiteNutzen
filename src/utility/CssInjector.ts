/**
 * A reusable utility for injecting and removing a block of CSS from the page.
 *
 * Each instance is identified by a unique style-element ID so that the same
 * CSS is never injected twice, and can be cleanly removed later.
 */
export class CssInjector {
  private _cssRules: string;

  constructor(
    private readonly _styleId: string,
    cssRules: string
  ) {
    this._cssRules = cssRules;
  }

  /**
   * Injects the CSS rules into the page head (no-op if already present).
   */
  public apply(): void {
    if (!document.getElementById(this._styleId)) {
      const head: HTMLHeadElement = document.getElementsByTagName('head')[0];
      const style: HTMLStyleElement = document.createElement('style');
      style.id = this._styleId;
      style.appendChild(document.createTextNode(this._cssRules));
      head.appendChild(style);
    }
  }

  /**
   * Removes the previously injected CSS from the page head (no-op if absent).
   */
  public remove(): void {
    const styleElement: HTMLElement | null = document.getElementById(this._styleId);
    if (styleElement) {
      styleElement.remove();
    }
  }

  /**
   * Updates the CSS rules and re-applies the style element.
   * Removes the old element first so the new rules take effect.
   */
  public update(cssRules: string): void {
    this._cssRules = cssRules;
    this.remove();
    this.apply();
  }

  /**
   * Convenience method: applies the styles when {@link enabled} is `true`,
   * removes them otherwise.
   */
  public toggle(enabled: boolean): void {
    if (enabled) {
      this.apply();
    } else {
      this.remove();
    }
  }
}
