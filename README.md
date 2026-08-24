# Amsun Technology Private Limited Website

Modern multi-page IT services website built with React, Vite, Tailwind CSS and Framer Motion.

## Features

- Multi-page routing for Home, Services, ERP & CRM Demo Center, Industries, About, Careers and Contact.
- Dark/light mode with persisted preference.
- Animated hero, scroll-triggered reveals, counters and smooth page transitions.
- Searchable and filterable demo center with modal video player support.
- Lead-generation forms, floating contact button, newsletter section and professional footer.
- SEO tags, Open Graph metadata, schema markup, robots.txt and sitemap.xml.
- GitHub Pages-ready Vite configuration.

## Getting Started

```bash
npm install
npm run dev
```

The dev server usually runs at `http://localhost:5173`.

## Production Build

```bash
npm run build
npm run preview
```

The deployable static website is generated in `dist/`. Upload the contents of `dist` to Hostinger `public_html`, AWS S3, CloudFront, Netlify, Vercel or any static host.

See `HOSTING.md` for Hostinger and AWS setup notes.

## Homepage Google Drive Video

The homepage hero video is loaded from Google Drive through a single config variable:

```js
// src/config/video.js
export const GOOGLE_DRIVE_VIDEO_URL = "https://drive.google.com/file/d/XXXXXXXXXXXXXXXXXXXXXXXX/view?usp=sharing";
```

Paste a standard Google Drive sharing link into `GOOGLE_DRIVE_VIDEO_URL`. The app automatically converts Drive file links into a playable video source while keeping autoplay, muted, loop and mobile inline playback enabled.

## GitHub Pages Deployment

1. Update the `homepage` field in `package.json` to match your GitHub Pages URL.
2. Install dependencies with `npm install`.
3. Deploy with:

```bash
npm run deploy
```

For a custom domain, update the canonical URL, Open Graph URL and sitemap entries in `index.html` and `public/sitemap.xml`.
If deploying to a custom domain instead of a GitHub Pages project path, set `pathSegmentsToKeep` to `0` in `public/404.html`.

## Customization Notes

- Service, demo, industry, case study, testimonial and FAQ content is defined in `src/main.jsx`.
- Brand colors and typography are configured in `tailwind.config.js`.
- Placeholder demo videos use embeddable YouTube URLs and can be replaced with company demos.
