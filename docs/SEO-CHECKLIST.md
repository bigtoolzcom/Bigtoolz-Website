# 🔍 BigToolz SEO Checklist

> Complete, actionable SEO guide for BigToolz — from launch to ranking.
> **Goal:** 1M+ monthly organic traffic within 12 months.

---

## 📖 Table of Contents

1. [On-Page SEO](#1-on-page-seo)
2. [Technical SEO](#2-technical-seo)
3. [Structured Data](#3-structured-data)
4. [Content Quality](#4-content-quality)
5. [Internal Linking](#5-internal-linking)
6. [Off-Page SEO](#6-off-page-seo)
7. [Google Search Console](#7-google-search-console)
8. [Google Analytics (GA4)](#8-google-analytics-ga4)
9. [Google AdSense](#9-google-adsense)
10. [Page Speed](#10-page-speed)
11. [Mobile SEO](#11-mobile-seo)
12. [Content Strategy](#12-content-strategy)
13. [Per-Page Checklist](#13-per-page-checklist)
14. [Common Mistakes](#14-common-mistakes)
15. [Tools & Resources](#15-tools--resources)

---

## 1. On-Page SEO

### Every Page Must Have

- [ ] **Unique `<title>`** — 50–60 chars, primary keyword first
- [ ] **Meta description** — 150–160 chars, compelling, includes keyword
- [ ] **Meta keywords** — 5–10 relevant (not critical but harmless)
- [ ] **Canonical URL** — `<link rel="canonical" href="https://bigtoolz.com/page/">`
- [ ] **Robots meta** — `index, follow` (default), `noindex` for error/admin
- [ ] **Language** — `<html lang="en">`
- [ ] **Viewport** — `<meta name="viewport" content="width=device-width, initial-scale=1.0">`
- [ ] **Charset** — `<meta charset="UTF-8">`

### Heading Structure

- [ ] **One `<h1>` per page** — matches title intent
- [ ] **H2 for main sections** — 3–8 per page
- [ ] **H3 for subsections** — under H2
- [ ] **No skipped levels** — H1 → H2 → H3, not H1 → H3
- [ ] **Descriptive headings** — not "Overview" but "How to Compress Images"

### Content

- [ ] **Unique** — not duplicated from other pages
- [ ] **Human-written** — not AI copy-paste
- [ ] **Relevant** — matches search intent
- [ ] **Comprehensive** — tool pages 1,500+ words, blog posts 2,000+ words
- [ ] **Keyword density** — 1–2% (natural, not stuffed)
- [ ] **LSI keywords** — related terms naturally included
- [ ] **Proper grammar** — proofread, no typos
- [ ] **Readability** — short paragraphs (2–4 sentences), bullet lists, subheadings

### Images

- [ ] **Descriptive filenames** — `image-compressor.png` not `img-001.png`
- [ ] **Alt text** — describes image, includes keyword when natural
- [ ] **`width` + `height` attributes** — prevents CLS
- [ ] **WebP/AVIF format** — smaller than JPG/PNG
- [ ] **Compressed** — TinyPNG, Squoosh, or our own Image Compressor
- [ ] **Lazy loading** — `loading="lazy"` for below-fold images
- [ ] **Responsive** — `srcset` for different sizes

### Links

- [ ] **Internal links** — 3–10 per page to related content
- [ ] **External links** — 1–3 to authoritative sources
- [ ] **Descriptive anchor text** — "Image Compressor" not "click here"
- [ ] **`rel="noopener noreferrer"`** on external links
- [ ] **No broken links** — check monthly

---

## 2. Technical SEO

### Core Requirements

- [ ] **HTTPS everywhere** — no mixed content
- [ ] **SSL certificate valid** — not expired
- [ ] **`www` vs non-`www`** — choose one, redirect other
- [ ] **Trailing slash consistency** — pick one convention
- [ ] **404 page** — custom, helpful, links to homepage
- [ ] **301 redirects** — for moved pages
- [ ] **Clean URLs** — `/tools/image-tools/image-compressor/` not `/page?id=1`
- [ ] **URL length** — under 100 chars
- [ ] **Hyphens not underscores** — `image-compressor` not `image_compressor`
- [ ] **Lowercase URLs** — no capital letters

### Files

- [ ] **`sitemap.xml`** — submitted to GSC, all important pages
- [ ] **`robots.txt`** — correct rules, sitemap reference
- [ ] **`ads.txt`** — AdSense verification
- [ ] **`manifest.json`** — PWA manifest
- [ ] **`favicon.ico`** — appears in browser tabs
- [ ] **`apple-touch-icon.png`** — for iOS home screen
- [ ] **OG image** — `og-image.jpg` 1200×630
- [ ] **RSS feed** — `blog/rss.xml`
- [ ] **404 page** — `404.html`

### Crawling & Indexing

- [ ] **No accidental `noindex`** — check on all pages
- [ ] **No `Disallow` blocking important pages** — check `robots.txt`
- [ ] **Sitemap submission** — in Search Console
- [ ] **URL Inspection** — check important pages in GSC
- [ ] **Request indexing** — for new/updated pages

---

## 3. Structured Data

### Required Schema Types

- [ ] **`WebSite`** — homepage
- [ ] **`Organization`** — homepage
- [ ] **`WebPage`** — every page
- [ ] **`BreadcrumbList`** — every page with breadcrumbs
- [ ] **`SoftwareApplication`** — tool pages
- [ ] **`FAQPage`** — pages with FAQ
- [ ] **`HowTo`** — step-by-step guides
- [ ] **`Article`** — blog posts
- [ ] **`Blog`** — blog index
- [ ] **`ItemList`** — category pages
- [ ] **`CollectionPage`** — category pages
- [ ] **`SearchAction`** — site search
- [ ] **`AggregateRating`** — tool ratings (if applicable)

### Validation

- [ ] **Test in Rich Results Test** — https://search.google.com/test/rich-results
- [ ] **Test in Schema Markup Validator** — https://validator.schema.org/
- [ ] **Fix all errors** — warnings are okay but fix if possible
- [ ] **JSON-LD format** — not Microdata or RDFa

---

## 4. Content Quality

### E-E-A-T Signals (Experience, Expertise, Authoritativeness, Trustworthiness)

- [ ] **Author bylines** — real names + bios
- [ ] **Author pages** — with credentials, social links
- [ ] **About Us** — with team info
- [ ] **Contact Us** — real contact info
- [ ] **Citations** — link to authoritative sources
- [ ] **Original research/data** — unique insights
- [ ] **Updated dates** — "Last updated: [date]"

### Content Types

| Type | Word Count | Frequency | Purpose |
|---|---|---|---|
| Tool page | 1,500+ | Static | Rank for tool keywords |
| Tool guide | 2,500+ | Static | Rank for "how to" queries |
| Blog post | 2,000+ | Weekly | Rank for informational queries |
| Category page | 500+ | Static | Hub for tool listings |
| FAQ page | 500+ | Static | Answer common questions |

### Content Rules

- [ ] **No plagiarism** — 100% original
- [ ] **No AI-fluff** — human-written, edited
- [ ] **No thin content** — every page adds value
- [ ] **No duplicate content** — unique per page
- [ ] **No keyword stuffing** — natural language
- [ ] **No clickbait** — clear, honest titles
- [ ] **No hidden text** — white on white, tiny fonts

---

## 5. Internal Linking

### Strategy

- [ ] **Category → Tool pages** — hub structure
- [ ] **Tool pages → Related tools** — sidebar widget
- [ ] **Blog → Tool pages** — contextual links
- [ ] **Tool pages → Blog guides** — deeper reading
- [ ] **Homepage → Top categories** — main navigation
- [ ] **Footer → Legal + top pages** — site-wide

### Best Practices

- [ ] **3–10 internal links per page**
- [ ] **Descriptive anchor text** — "Image Compressor" not "this tool"
- [ ] **Vary anchor text** — natural variations
- [ ] **Link to new content** — from existing popular pages
- [ ] **Fix broken internal links** — monthly audit
- [ ] **No orphan pages** — every page linked from somewhere

---

## 6. Off-Page SEO

### Link Building (White-Hat Only)

- [ ] **Digital PR** — pitch to journalists, bloggers
- [ ] **Guest posting** — on relevant blogs
- [ ] **Broken link building** — find + replace broken links
- [ ] **Resource page links** — get listed on resource pages
- [ ] **HARO/Connectively** — answer journalist queries
- [ ] **Original research** — publish data others will cite
- [ ] **Free tool** — our tools themselves attract links

### Backlink Profile

- [ ] **Quality > quantity** — 10 great links > 1,000 spam
- [ ] **Relevant domains** — tech, tools, productivity
- [ ] **Diverse anchors** — brand, URL, natural text
- [ ] **No paid links** — Google penalty risk
- [ ] **No PBN links** — private blog networks are spam
- [ ] **No link farms** — auto-generated link directories

### Social Signals

- [ ] **Active Twitter/X** — share every blog post
- [ ] **Facebook page** — post updates
- [ ] **LinkedIn** — B2B content
- [ ] **YouTube** — tool tutorials
- [ ] **Reddit** — participate genuinely, no spam
- [ ] **Pinterest** — visual content (infographics)

### Target: 2,000 Quality Backlinks

**Realistic timeline:**
- Month 1–3: 0–50 (foundation)
- Month 4–6: 50–200 (guest posts + PR)
- Month 7–12: 200–800 (compounding)
- Year 2: 800–2,000+ (authority effect)

**Warning:** Do NOT buy 2,000 backlinks. Google will penalize you. Earn them naturally.

---

## 7. Google Search Console

### Setup

- [ ] **Add property** — `https://bigtoolz.com/`
- [ ] **Verify ownership** — DNS or HTML file
- [ ] **Submit sitemap** — `https://bigtoolz.com/sitemap.xml`
- [ ] **Set preferred domain** — www or non-www
- [ ] **Enable email alerts** — for issues

### Monitor Weekly

- [ ] **Performance report** — impressions, clicks, CTR, position
- [ ] **Coverage report** — indexed vs excluded pages
- [ ] **Core Web Vitals** — LCP, INP, CLS
- [ ] **Mobile usability** — errors
- [ ] **Sitemaps** — status = Success
- [ ] **Security issues** — 0 issues
- [ ] **Manual actions** — 0 actions

### Fix Immediately

- [ ] **404 errors** — set up 301 redirects
- [ ] **Server errors (5xx)** — fix server
- [ ] **Soft 404s** — add content or redirect
- [ ] **Crawl errors** — fix `robots.txt` or DNS
- [ ] **Indexing issues** — request indexing or fix `noindex`

---

## 8. Google Analytics (GA4)

### Setup

- [ ] **Create GA4 property** — analytics.google.com
- [ ] **Add measurement ID** — `G-XXXXXXXXXX`
- [ ] **Install gtag.js** — via `/assets/js/analytics.js`
- [ ] **Set up data streams** — web stream
- [ ] **Enable enhanced measurement** — scrolls, outbound clicks
- [ ] **Link to Search Console** — for combined data

### Key Events to Track

- [ ] `page_view` — every page
- [ ] `scroll` — 25%, 50%, 75%, 100%
- [ ] `user_engagement` — 15+ seconds
- [ ] `search` — tool searches
- [ ] `tool_use` — tool interactions
- [ ] `file_download` — downloads
- [ ] `share` — social shares
- [ ] `copy_to_clipboard` — copy actions
- [ ] `theme_change` — dark/light toggle
- [ ] `ad_click` — AdSense clicks
- [ ] `signup` — newsletter
- [ ] `consent_update` — cookie consent
- [ ] **Core Web Vitals** — LCP, INP, CLS

### KPIs to Monitor

| Metric | Target | Frequency |
|---|---|---|
| Organic sessions | Growing MoM | Weekly |
| Avg. engagement time | > 1:30 | Weekly |
| Bounce rate | < 60% | Weekly |
| Pages per session | > 2 | Weekly |
| Conversion rate | > 2% | Monthly |
| Top landing pages | — | Weekly |
| Traffic sources | — | Monthly |

---

## 9. Google AdSense

### Prerequisites (Before Applying)

- [ ] **Domain age** — 2–4 weeks minimum
- [ ] **Content quality** — 30+ unique, useful pages
- [ ] **No AI-only content** — human-written + edited
- [ ] **No plagiarism** — 100% original
- [ ] **Required pages exist:**
  - [ ] About Us
  - [ ] Contact Us
  - [ ] Privacy Policy
  - [ ] Terms of Service
  - [ ] Disclaimer
- [ ] **Clear navigation** — header, footer, breadcrumbs
- [ ] **No broken links** — audit complete
- [ ] **Fast loading** — under 3 seconds
- [ ] **Mobile-friendly** — responsive
- [ ] **HTTPS enabled** — SSL certificate

### Application

- [ ] **Create AdSense account** — adsense.google.com
- [ ] **Add site** — `bigtoolz.com`
- [ ] **Verify ownership** — via meta tag or DNS
- [ ] **Add AdSense code** — in `<head>`
- [ ] **Set up `ads.txt`** — at root with publisher ID
- [ ] **Wait for review** — 1–2 weeks typical

### Post-Approval

- [ ] **Add ad units** — via `components/ad-space.html`
- [ ] **Enable Auto Ads** — optional, test first
- [ ] **Set ad density** — not more than 3–4 per page
- [ ] **Monitor violations** — weekly
- [ ] **Track revenue** — AdSense dashboard + GA4

### What to Avoid

- ❌ **Clicking your own ads** — account ban
- ❌ **Fake traffic** — bots, paid clicks
- ❌ **Adult content** — prohibited
- ❌ **Copyright content** — prohibited
- ❌ **Too many ads** — poor UX, penalized
- ❌ **Ads on empty pages** — no content = no ads

---

## 10. Page Speed

### Target Scores (PageSpeed Insights)

| Metric | Mobile | Desktop |
|---|---|---|
| Performance | 90+ | 95+ |
| Accessibility | 95+ | 95+ |
| Best Practices | 95+ | 95+ |
| SEO | 100 | 100 |

### Core Web Vitals

| Metric | Good | Needs Work | Poor |
|---|---|---|---|
| **LCP** | ≤ 2.5s | 2.5–4.0s | > 4.0s |
| **INP** | ≤ 200ms | 200–500ms | > 500ms |
| **CLS** | ≤ 0.1 | 0.1–0.25 | > 0.25 |

### Optimization Checklist

**Images:**
- [ ] WebP/AVIF format
- [ ] `width` + `height` attributes
- [ ] `loading="lazy"` (below fold)
- [ ] Compressed
- [ ] `srcset` for responsive

**CSS:**
- [ ] Inline critical CSS
- [ ] Defer non-critical
- [ ] Minified
- [ ] Remove unused

**JavaScript:**
- [ ] `defer` or `async`
- [ ] Minified
- [ ] Lazy-load heavy code
- [ ] No blocking scripts

**Fonts:**
- [ ] Self-hosted
- [ ] `font-display: swap`
- [ ] Preload critical fonts
- [ ] Subset to used chars

**Caching:**
- [ ] Browser cache headers
- [ ] CDN for static assets
- [ ] Service Worker (PWA)

**Third-party:**
- [ ] Defer analytics
- [ ] Lazy-load ads
- [ ] Remove unused tags
- [ ] Use `preconnect`

---

## 11. Mobile SEO

- [ ] **Responsive design** — same URL for mobile + desktop
- [ ] **Viewport meta tag** — set correctly
- [ ] **Touch targets** — 48×48px minimum
- [ ] **Font size** — 16px minimum body text
- [ ] **No horizontal scroll** — fits viewport
- [ ] **Mobile-friendly test** — passes GSC
- [ ] **Fast on 3G** — under 5s load
- [ ] **No intrusive interstitials** — no popups blocking content
- [ ] **Tap-to-call** — tel: links work
- [ ] **Readable** — no pinch-zoom needed

---

## 12. Content Strategy

### Keyword Research

**Tools:**
- Google Keyword Planner
- Ahrefs / Semrush (paid)
- Ubersuggest (free)
- AnswerThePublic
- Google Suggest / People Also Ask

**Target Mix:**
- **60% long-tail** (low competition, high intent)
- **30% medium-tail** (moderate competition)
- **10% head** (high competition, brand authority)

### Content Calendar

**Weekly Schedule:**
- **Monday:** Publish 1 blog post
- **Wednesday:** Update 1 old post
- **Friday:** Publish 1 tool guide

**Monthly:**
- **Week 1:** Keyword research + plan
- **Week 2–4:** Publish + promote
- **End of month:** Performance review

### Topic Clusters

**Structure:**

---

## 13. Per-Page Checklist

### For Every Tool Page

- [ ] Unique `<title>` with primary keyword
- [ ] Meta description (150–160 chars)
- [ ] Canonical URL
- [ ] OG + Twitter Card tags
- [ ] Breadcrumb navigation
- [ ] H1 with tool name
- [ ] H2 sections: What is, How to, Features, FAQ
- [ ] 1,500+ words of SEO content
- [ ] FAQ section (5–8 questions)
- [ ] Related tools sidebar
- [ ] Schema: `SoftwareApplication`, `HowTo`, `FAQPage`, `BreadcrumbList`
- [ ] Internal links: 5–10
- [ ] Image alt text
- [ ] Mobile responsive
- [ ] Page speed: 90+ on mobile
- [ ] Tested in GSC URL Inspection

### For Every Blog Post

- [ ] Unique `<title>` (50–60 chars)
- [ ] Meta description (150–160 chars)
- [ ] Canonical URL
- [ ] OG + Twitter Card tags
- [ ] Author byline + bio
- [ ] Publish date + last updated date
- [ ] H1 with keyword
- [ ] 2,000+ words
- [ ] 3–5 images (WebP, alt text)
- [ ] Internal links: 5–10
- [ ] External links: 2–3 authoritative
- [ ] Schema: `Article`, `BreadcrumbList`, `FAQPage`
- [ ] Table of contents (for 1,500+ words)
- [ ] Social share buttons
- [ ] Related posts
- [ ] FAQ section
- [ ] CTA at end
- [ ] Mobile responsive
- [ ] Page speed: 90+ on mobile

---

## 14. Common Mistakes

### ❌ SEO Killers

- **Keyword stuffing** — 1–2% density max
- **Duplicate content** — unique every page
- **Hidden text** — white-on-white penalties
- **Cloaking** — different content to bots
- **Paid links** — Google penalty
- **Auto-generated content** — low quality
- **Thin content** — under 300 words
- **Broken links** — bad UX + trust
- **Slow pages** — over 3 seconds
- **No mobile version** — 60%+ traffic is mobile
- **Poor navigation** — hard to find content
- **404 pages** — no redirects set
- **Missing alt text** — accessibility + SEO
- **Over-optimized anchors** — natural variation
- **No schema** — missing rich snippets

### ❌ AdSense Killers

- **Clicking your own ads** — instant ban
- **Fake traffic** — bot traffic = ban
- **Incentivizing clicks** — "click here to support us"
- **Too many ads** — poor UX
- **Ads on empty pages** — no content
- **Adult/gambling content** — prohibited
- **Copyright content** — DMCA issues
- **No privacy policy** — required

---

## 15. Tools & Resources

### Free SEO Tools

| Tool | Purpose | URL |
|---|---|---|
| Google Search Console | Indexing + performance | search.google.com/search-console |
| Google Analytics 4 | Traffic analytics | analytics.google.com |
| PageSpeed Insights | Speed test | pagespeed.web.dev |
| Rich Results Test | Schema validation | search.google.com/test/rich-results |
| Mobile-Friendly Test | Mobile check | search.google.com/test/mobile-friendly |
| Ahrefs Webmaster Tools | Free backlink check | ahrefs.com/webmaster-tools |
| Bing Webmaster Tools | Bing indexing | bing.com/webmasters |
| Keyword Planner | Keyword research | ads.google.com |
| AnswerThePublic | Question research | answerthepublic.com |
| Ubersuggest | Keyword + competitor | neilpatel.com/ubersuggest |
| Screaming Frog (free) | Site audit | screamingfrog.co.uk |
| TinyPNG | Image compression | tinypng.com |
| Squoosh | Image compression | squoosh.app |
| Schema Markup Generator | Schema.org | validator.schema.org |
| Google Trends | Trending topics | trends.google.com |

### Paid SEO Tools

- **Ahrefs** — $99/mo — best for backlinks
- **Semrush** — $119/mo — all-in-one
- **Moz Pro** — $99/mo — DA/PA + audits
- **Surfer SEO** — $59/mo — content optimization
- **Screaming Frog** — £149/year — technical audit

### Learning Resources

- **Google Search Central** — developers.google.com/search
- **Moz Blog** — moz.com/blog
- **Search Engine Journal** — searchenginejournal.com
- **Ahrefs Blog** — ahrefs.com/blog
- **Backlinko** — backlinko.com

---

## 📊 Expected Timeline

| Month | Traffic | Backlinks | Focus |
|---|---|---|---|
| 1–3 | 0–1K | 0–50 | Foundation, indexing |
| 4–6 | 1K–10K | 50–200 | Content + backlinks |
| 7–9 | 10K–50K | 200–500 | Scale content + PR |
| 10–12 | 50K–200K | 500–1000 | Authority + optimization |
| Year 2 | 200K–1M+ | 1000–2000+ | Compounding + AdSense |

**Note:** These are estimates. Actual results depend on competition, content quality, backlinks, and algorithm changes.

---

## ✅ Final Pre-Launch Checklist

**Before going live:**

- [ ] All required pages exist (About, Contact, Privacy, Terms, Disclaimer)
- [ ] 30+ quality articles/tool pages published
- [ ] No broken links (run Screaming Frog)
- [ ] All schema valid (Rich Results Test)
- [ ] Page speed 90+ (PageSpeed Insights)
- [ ] Mobile-friendly (GSC test)
- [ ] HTTPS working (no mixed content)
- [ ] Sitemap submitted to GSC
- [ ] Robots.txt configured
- [ ] Ads.txt configured
- [ ] GA4 tracking verified
- [ ] Cookie consent working
- [ ] Search working
- [ ] All tools functional
- [ ] Dark mode works
- [ ] 404 page redirects

**After launch:**

- [ ] Monitor GSC daily for first week
- [ ] Publish 2 posts per week
- [ ] Build 5–10 quality backlinks per month
- [ ] Update old content monthly
- [ ] Review analytics weekly
- [ ] Apply for AdSense after 30 days
- [ ] Scale content based on performance

---

**Last Updated:** January 15, 2026  
**Version:** 1.0.0  
**Maintained by:** BigToolz Team

**Questions?** Contact [contact@bigtoolz.com](mailto:contact@bigtoolz.com)