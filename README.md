# Static HTML Version

This folder contains the original static HTML version of the HireStack Solutions website.

## Contents

- `index.html` - Main HTML file
- `css/` - Stylesheets
  - `styles.css` - Main stylesheet
  - `styles.css.backup` - Backup copy
- `js/` - JavaScript files
  - `animation.js` - Three.js particle effects
  - `interactions.js` - Interactive features and form validation
- `robots.txt` - Search engine directives
- `sitemap.xml` - Site structure for search engines
- `.htaccess` - Apache server configuration

## Deployment

This is a standalone static website that can be deployed to:

- **GitHub Pages**: Push this folder to `gh-pages` branch
- **Netlify**: Drag and drop this folder or connect via Git
- **Vercel**: Deploy as static site
- **Any web server**: Upload all files via FTP

## Features

- Interactive Three.js particle background
- Responsive design (mobile, tablet, desktop)
- Contact form with validation
- Interactive calculator
- Collapsible FAQ section
- Service cards with expandable details
- Professional SVG icons (no emojis)
- Scroll progress indicator
- Sticky CTA button

## Usage

Simply open `index.html` in a web browser or deploy the entire folder to a web server.

No build process required - this is pure HTML/CSS/JavaScript.

## Note

The main project has been migrated to **Astro + TinaCMS** (see parent directory).
This static version is maintained for quick deployments and as a backup.
