# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## About This Site

Personal website and blog for Shreyas Ragavan (https://shreyas.ragavan.cc), built with Hugo using a heavily modified version of the [Hugo Zen theme](https://github.com/frjo/hugo-theme-zen). Content is authored in Emacs Org-mode via ox-hugo and exported to markdown. The site targets [250kb.club](https://250kb.club) compliance — keep page payloads minimal.

## Common Commands

```bash
# Local development server with live reload
hugo server -D

# Build production site
hugo --minify

# Build to a specific destination
hugo --destination /path/to/public
```

## Architecture Overview

### Theme Customization Model

The `themes/zen/` directory is the upstream theme — **never modify files there**. All customizations live in the project root and override theme files via Hugo's lookup order:

- `layouts/` — template overrides (takes priority over `themes/zen/layouts/`)
- `assets/sass/` — SCSS overrides (`_custom.scss`, `_variables.scss`, `_extra.scss`)
- `assets/css/` — additional CSS files loaded via `layouts/partials/head/styles.html`
- `static/` — static assets (favicons, images, JS)

### CSS Loading Architecture

CSS is loaded in two tiers for performance:

**Global (all pages)** — loaded via `layouts/partials/head/styles.html`:
1. Theme base: `themes/zen/assets/sass/styles.scss`
2. `assets/css/elegant-clean.css` — global overrides, tag pills, responsive nav, mobile menu
3. `assets/css/unified-pages.css` — page header/title normalization across all page types

**Page-specific (conditional)** — loaded via `define "head"` blocks in templates:
- `assets/css/archive.css` — archive page (`layouts/_default/archives.html`)
- `assets/css/tags-filter.css` — tag filter page (`layouts/tags-filter/single.html`)
- `assets/css/list-pages.css` — tag/category list pages (`layouts/_default/list.html`, `layouts/taxonomy/tag.html`)
- `assets/css/project-showcase.css` — project cards (`layouts/project/list.html`)

**Critical rule**: Never add `.post-single-line` or `.post-tags` rules to `elegant-clean.css` — this causes layout conflicts. Page-specific CSS uses `!important` to override theme defaults.

### SCSS Customizations

`assets/sass/_custom.scss` contains:
- CSS variable overrides (colors, typography)
- External link detection and styling (uses `a[href^="http"]` — generic, no hardcoded domains)
- Text flow fixes (`max-width: none !important` on `.main p`)
- Pre/code block exclusions to prevent style conflicts with `code-blocks.css`

### Key Layout Templates

- `layouts/_default/baseof.html` — base template wrapping all pages
- `layouts/_default/list.html` — post/tag listings
- `layouts/_default/archives.html` — archive page with year navigation
- `layouts/project/list.html` — card-based project showcase grid
- `layouts/tags-filter/single.html` — interactive tag filter with search
- `layouts/partials/head/styles.html` — controls CSS loading order
- `layouts/_default/_markup/render-image.html` — custom image rendering

### Post Layout Structure

Archive and tag-filter pages use a two-line post layout:
- Line 1: Post title (left) + Date (right) — `.post-first-line`
- Line 2: Content type badge + Tags (indented 1rem) — `.post-second-line`
- No box/border around post sections

### Project Showcase

Projects use a card grid (`layouts/project/list.html` + `assets/css/project-showcase.css`):
- Featured images: place `featured.jpg/png/webp` alongside the markdown file, or set `image = "/path"` in frontmatter
- Entire card is clickable; tags use `event.stopPropagation()` for independent navigation
- Responsive grid: 1 col mobile, 2 col tablet, 3+ col desktop

### JavaScript

- `static/scroll-to-top.js` — scroll-to-top button behavior
- `static/tags-filter.js` — tag search with multi-priority CamelCase-aware matching; uses `setProperty('display', 'none', 'important')` to override CSS specificity

### Site Configuration

`config.yaml` key settings:
- `params.sassTranspiler: "libsass"` — use libsass, not dart-sass
- `params.mobileMenu: true` — enables slide-out mobile nav at ≤666px
- Mobile menu breakpoint (666px) must match the JS breakpoint in the Zen theme
- `markup.highlight` — syntax highlighting uses `noClasses: false` (class-based, not inline styles); highlight CSS lives in `assets/css/chroma-github.css`

## Assistant Role

You are a knowledgeable coding assistant versed in Hugo and custom theme development. Follow best practices: clear comments, no unnecessary repetition, prefer simpler approaches. Design choices should be aesthetically sound and optimize for page load size. Always re-use existing theme elements and CSS patterns before adding new ones.
