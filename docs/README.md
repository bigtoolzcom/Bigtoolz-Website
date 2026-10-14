# 📦 BigToolz Components Library

> Reusable HTML + CSS + JS components for BigToolz.
> Drop-in widgets that work on any page with minimal setup.

---

## 📖 Overview

The `components/` folder contains **10 reusable widgets** used across BigToolz:

- **Self-contained** — each component has inline styles + script
- **Auto-init** — no manual JS calls needed
- **Data-attribute driven** — configure via HTML attributes
- **Dark mode ready** — respects `[data-theme="dark"]`
- **Mobile-first** — responsive by default
- **Framework-free** — pure vanilla JS, no dependencies

---

## 📂 Component List

| # | Component | Status | Purpose |
|---|---|---|---|
| 1 | `header.html` | ⏳ Pending | Site header with logo, nav, search, theme toggle |
| 2 | `footer.html` | ⏳ Pending | Site footer with links, social, newsletter |
| 3 | `breadcrumb.html` | ⏳ Pending | Auto-generated breadcrumb from URL |
| 4 | `related-tools.html` | ✅ Ready | Related tools widget (sidebar + bottom) |
| 5 | `faq-section.html` | ✅ Ready | FAQ accordion + JSON-LD schema |
| 6 | `ad-space.html` | ✅ Ready | AdSense ad slots (lazy, consent-aware) |
| 7 | `search-bar.html` | ✅ Ready | Live search with 4 variants |
| 8 | `social-share.html` | ✅ Ready | Social sharing (3 variants, 8 platforms) |
| 9 | `newsletter.html` | ✅ Ready | Newsletter signup (4 variants) |
| 10 | `cookie-consent.html` | ✅ Ready | GDPR cookie banner + Consent Mode v2 |

**Legend:** ✅ Ready · ⏳ Pending · 🚧 In Progress

---

## 🚀 Quick Start

### Step 1 — Include Prerequisites

Some components depend on data files or global scripts. Always include **first**:

```html
<!-- 1. Tools database (required for search, related-tools) -->
<script src="/data/tools-database.js" defer></script>

<!-- 2. Main JS (required for theme toggle, analytics) -->
<script src="/assets/js/main.js" defer></script>

<!-- 3. Analytics (optional, for tracking) -->
<script src="/assets/js/analytics.js" defer></script>