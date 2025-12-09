# Ganze Seite nutzen (Use Full Page Area)

This SharePoint Framework (SPFx) Web Part allows you to maximize the available screen space on your SharePoint pages. It provides a set of configurable options to hide standard navigation elements and force the content area to use the full width of the browser window.

## Features

*   **Full Page Width**: Forces the content area to expand to 100% of the available width.
*   **Hide Left Navigation**: Hides the quick launch / left-hand navigation bar.
*   **Hide Top Navigation**: Hides the top navigation bar (Mega Menu).
*   **Replace Web Title**: Allows you to replace the default website title with a custom text or template.

## Configuration

The Web Part is fully configurable via the Property Pane. When in **Edit** mode on a SharePoint page, select the Web Part and click the pencil icon to access the settings:

*   **Use full page width**: Toggle to enable/disable the 100% width override.
*   **Remove left navigation**: Toggle to hide the left sidebar.
*   **Remove top navigation**: Toggle to hide the top navigation bar.
*   **Replace web title**: Toggle to enable title replacement.
*   **New web title**: Enter the text to display instead of the default site title.

## Installation & Usage

### Prerequisites

*   Node.js v8.17
*   Gulp CLI installed globally (`npm install -g gulp-cli`)

### Building the Code

1.  Clone the repository:
    ```bash
    git clone <repo-url>
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Build the solution:
    ```bash
    gulp bundle --ship
    gulp package-solution --ship
    ```

### Deployment

1.  Upload the `.sppkg` file found in the `sharepoint/solution` folder to your SharePoint App Catalog.
2.  Deploy the solution.
3.  Add the **"Ganze Seite nutzen"** (or **"Use full page area"**) Web Part to any SharePoint page.

## Development

To run the Web Part in a local workbench or hosted workbench:

```bash
gulp serve
```

## Technologies

*   SharePoint Framework (SPFx) v1.4.1
*   TypeScript
*   SCSS / CSS Modules

