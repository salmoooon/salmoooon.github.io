# Copilot Instructions - salmoooon.github.io

## Project Overview
This is a **personal GitHub Pages portfolio site** with vanilla HTML/CSS/JavaScript. It's a single-page personal website hosted at `nicotine.buzz`, featuring a personal bio, furry character gallery, and contact information.

**Key trait**: The site emphasizes **dark/light theme switching** and **smooth animations**. Built entirely with ChatGPT assistance, so the code is modern vanilla JS with no build tools or frameworks.

## Architecture

### Data Flow
1. **HTML structure** ([index.html](index.html)): Static markup with semantic cards and collapsible `<details>` elements
2. **CSS theming** ([style.css](style.css)): CSS custom properties (`--bg`, `--text`, `--accent`, etc.) driven by `data-theme` attribute on `<body>`
3. **JavaScript interactivity** ([script.js](script.js)):
   - Theme toggle → updates `data-theme` → CSS transitions kick in
   - Lightbox gallery → keyboard navigation + arrow controls
   - Animated details collapse → smooth height animations
   - Star background canvas → continuous animation with theme-aware colors

### Component Boundaries
- **Theme System**: Controlled by `localStorage.theme` + `data-theme` attribute. Light/dark color palettes defined in `:root` and `[data-theme="light"]` selectors
- **Lightbox Gallery**: Self-contained module (lines 29-85 in script.js). Gathers image metadata from `data-*` attributes on `<img>` elements
- **Animated Collapsibles**: Uses Web Animations API for custom open/close transitions (lines 97-120 in script.js)
- **Star Canvas**: Fixed background layer (`z-index: -1`), auto-animates with sine wave opacity, wraps around viewport edges

## Key Patterns & Conventions

### Theme Switching
- **How it works**: Check `localStorage.getItem("theme")` on load, update `body.setAttribute("data-theme", theme)` on toggle
- **Example**: When checkbox changes, both the attribute update and localStorage persist occur in the same listener (lines 17-23)
- **Important**: Star canvas must redraw when theme changes to update color (`drawStars()` called in theme listener)

### Image Gallery & Lightbox
- **Data source**: Images in HTML use `data-name`, `data-desc`, `data-link` attributes to populate lightbox captions
- **Navigation**: Circular array navigation (modulo arithmetic on currentIndex) with keyboard support (ArrowLeft/Right/Escape)
- **Metadata example** (line 240-244 in index.html):
  ```html
  <img src="/images/1.jpg" data-name="Character Sheet" data-desc="Omurice炸黑輪" data-link="https://...">
  ```
- **Prevent propagation**: Event listeners use `stopPropagation()` to prevent nested click handlers from interfering

### Animated Details Elements
- **No CSS-only approach**: Uses JavaScript with `Web Animations API` + `details.animate()` for smooth height transitions
- **Why**: Browser's default `<details>` toggle is instant; custom animation gives 300ms easing effect
- **Pattern** (lines 102-120 in script.js):
  1. Get content height while expanded
  2. Animate from current height to 0 (or reverse)
  3. Toggle `details.open` only after animation completes
  4. Clear inline height styles to allow responsive reflowing

### CSS Variables & Responsive Design
- **Mobile breakpoint**: 600px (lines 308-327 in style.css)
- **Theme vars** (6 properties: `--bg`, `--card`, `--text`, `--muted`, `--accent`, `--border`)
- **Example**: Text color always uses `var(--text)` so it auto-updates when theme changes

## Critical Workflows

### Adding New Gallery Images
1. Add `<img>` to `.gallery-grid` with `data-name`, `data-desc`, `data-link` attributes
2. Place image file in `/images/` folder
3. Lightbox automatically picks it up (no config needed due to `querySelectorAll(".gallery-grid img")`)

### Modifying Colors
- Edit CSS custom properties in `:root` (dark) or `[data-theme="light"]` selector in style.css
- **Avoid**: Hardcoding colors like `#ffffff`; use `var(--card)` instead
- Theme toggle and star canvas will immediately adapt

### Testing Theme Toggle
- Open DevTools console and run: `document.body.setAttribute("data-theme", "light")`
- Or click theme toggle in top-left corner; verify all cards, text, and star colors change

## File Organization
- **[index.html](index.html)**: Semantic HTML with cards, details, gallery, contact section
- **[style.css](style.css)**: All styling; no preprocessor; mobile-first approach with 600px media query
- **[script.js](script.js)**: ~200 lines; vanilla JS, no dependencies
- **[CNAME](CNAME)**: GitHub Pages domain file (nicotine.buzz)
- **favicon/**: Web manifest and icon files
- **images/**: Gallery image assets

## External Dependencies
**None** — site runs on vanilla HTML/CSS/JS with no npm packages, frameworks, or build step.

Deployment: Direct GitHub Pages integration; commits to main branch auto-deploy.
