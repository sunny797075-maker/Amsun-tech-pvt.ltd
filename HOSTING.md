# Hosting Guide

This project is a static React/Vite website. After building, upload the `dist` folder contents to any static hosting provider.

## Build

```bash
npm install
npm run build
```

In this workspace, portable Node is installed, so this also works:

```powershell
& ".tools\node-v24.14.0-win-x64\node.exe" "node_modules\vite\bin\vite.js" build
```

## Hostinger

1. Run the production build.
2. Open Hostinger File Manager.
3. Go to `public_html`.
4. Upload everything inside `dist`, not the `dist` folder itself.
5. Keep the included `.htaccess` file so React pages like `/services/odoo-erp-solutions` work on refresh.

## AWS S3 + CloudFront

1. Create an S3 bucket and enable static website hosting.
2. Upload everything inside `dist`.
3. Set `index.html` as the index document.
4. For SPA routes, configure CloudFront custom error responses:
   - `403` -> `/index.html` with status `200`
   - `404` -> `/index.html` with status `200`
5. Invalidate CloudFront cache after each deployment.

## Deployable Folder

Use this folder after build:

```text
dist/
```
