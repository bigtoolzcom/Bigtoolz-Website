/* ===========================================
   BigToolz - Blog Posts Database
   Version: 2.0.0
   Last Updated: 2026-01-15
   Purpose: Central database for all blog posts
   Usage: <script src="/data/blog-database.js" defer></script>
   =========================================== */

'use strict';

(function () {

  /* ===========================================
     1. BLOG CONFIG
     =========================================== */
  const BLOG_CONFIG = {
    name: 'BigToolz Blog',
    tagline: 'Tips, Tutorials & Guides',
    description: 'Learn how to get the most out of free online tools. Practical guides on image editing, PDFs, SEO, productivity, and content creation.',
    url: 'https://bigtoolz.com/blog',
    rssUrl: 'https://bigtoolz.com/blog/rss.xml',
    postsPerPage: 9,
    relatedPostsCount: 3,
    featuredPostSlug: 'top-10-free-online-tools-2026',
    author: {
      name: 'BigToolz Team',
      email: 'hello@bigtoolz.com',
      avatar: '/assets/images/authors/bigtoolz-team.png',
      bio: 'We write about free online tools, image editing, PDF tips, SEO and productivity. Fresh content published regularly.'
    }
  };

  /* ===========================================
     2. BLOG CATEGORIES
     =========================================== */
  const BLOG_CATEGORIES = [
    {
      slug: 'tools',
      name: 'Tools',
      icon: '🛠',
      color: '#2563eb',
      description: 'Discover new tools, features and updates.',
      url: '/blog/categories/tool-guides/',
      count: 12
    },
    {
      slug: 'seo',
      name: 'SEO',
      icon: '📈',
      color: '#10b981',
      description: 'SEO strategies, keyword research and ranking tips.',
      url: '/blog/categories/seo-tips/',
      count: 10
    },
    {
      slug: 'how-to',
      name: 'How-To',
      icon: '📚',
      color: '#8b5cf6',
      description: 'Step-by-step guides and tutorials.',
      url: '/blog/categories/how-to/',
      count: 8
    },
    {
      slug: 'tips',
      name: 'Tips',
      icon: '💡',
      color: '#f59e0b',
      description: 'Productivity tips and time-saving hacks.',
      url: '/blog/categories/tips/',
      count: 6
    },
    {
      slug: 'ai',
      name: 'AI & Tech',
      icon: '🤖',
      color: '#ec4899',
      description: 'Artificial intelligence tools and technology news.',
      url: '/blog/categories/ai-tech/',
      count: 5
    },
    {
      slug: 'news',
      name: 'News',
      icon: '📰',
      color: '#dc2626',
      description: 'Latest updates from BigToolz and the industry.',
      url: '/blog/categories/news/',
      count: 4
    }
  ];

  /* ===========================================
     3. AUTHORS
     =========================================== */
  const AUTHORS = {
    bigtoolz: {
      id: 'bigtoolz',
      name: 'BigToolz Team',
      role: 'Content Writers',
      avatar: '⚒',
      bio: 'We write about free online tools, image editing, PDF tips, SEO and productivity. Fresh content published regularly.',
      url: '/authors/bigtoolz-team/'
    },
    arjun: {
      id: 'arjun',
      name: 'Arjun Sharma',
      role: 'SEO Specialist',
      avatar: '👨‍💻',
      bio: 'SEO expert with 8+ years of experience. Writes about keyword research, technical SEO, and content strategy.',
      url: '/authors/arjun-sharma/'
    },
    priya: {
      id: 'priya',
      name: 'Priya Verma',
      role: 'Designer & Writer',
      avatar: '👩‍🎨',
      bio: 'UI/UX designer and content creator. Loves simplifying complex design topics for beginners.',
      url: '/authors/priya-verma/'
    }
  };

  /* ===========================================
     4. BLOG POSTS DATABASE (30 Posts)
     =========================================== */
  const BLOG_POSTS = [

    /* ==========================================
       FEATURED / POPULAR POSTS (1-10)
       ========================================== */
    {
      id: 1,
      slug: 'top-10-free-online-tools-2026',
      title: 'Top 10 Free Online Tools You Must Try in 2026',
      description: 'Discover the best free online tools to boost your productivity, save time, and make your work easier. From image editing to PDF conversion, these 10 tools are absolute must-haves.',
      category: 'tools',
      categoryName: 'Tools',
      tags: ['online tools', 'productivity', 'free tools', '2026'],
      author: 'bigtoolz',
      image: '/blog/images/2026-08-28-top-10-tools.jpg',
      thumb: 'blue',
      thumbEmoji: '🚀',
      publishedAt: '2026-08-28',
      updatedAt: '2026-08-28',
      readTime: 8,
      featured: true,
      trending: true,
      url: '/blog/posts/top-10-free-online-tools-2026/',
      relatedTools: ['image-compressor', 'merge-pdf', 'word-counter']
    },
    {
      id: 2,
      slug: 'complete-seo-guide-beginners-2026',
      title: 'Complete SEO Guide for Beginners (2026)',
      description: 'Learn SEO step by step with easy strategies to rank higher on Google and get more organic traffic. Covers keyword research, on-page SEO, and technical fundamentals.',
      category: 'seo',
      categoryName: 'SEO',
      tags: ['seo', 'google', 'ranking', 'beginner guide'],
      author: 'arjun',
      image: '/blog/images/2026-08-25-seo-guide.jpg',
      thumb: 'dark',
      thumbEmoji: '🔍',
      publishedAt: '2026-08-25',
      updatedAt: '2026-08-26',
      readTime: 12,
      trending: true,
      url: '/blog/posts/complete-seo-guide-beginners-2026/',
      relatedTools: ['keyword-planner', 'serp-preview', 'meta-description']
    },
    {
      id: 3,
      slug: 'how-to-create-ai-cartoon-videos',
      title: 'How to Create AI Cartoon Videos (Free Tools & Step-by-Step Guide)',
      description: 'Turn your ideas into amazing cartoon videos using free AI tools. Full guide with tools, setup, and workflow from script to final render.',
      category: 'how-to',
      categoryName: 'How-To',
      tags: ['ai', 'video', 'cartoon', 'tutorial'],
      author: 'priya',
      image: '/blog/images/2026-08-22-ai-cartoon.jpg',
      thumb: 'purple',
      thumbEmoji: '🎨',
      publishedAt: '2026-08-22',
      readTime: 10,
      trending: true,
      url: '/blog/posts/how-to-create-ai-cartoon-videos/',
      relatedTools: ['text-to-speech', 'image-to-base64']
    },
    {
      id: 4,
      slug: 'best-image-compression-tools',
      title: 'Best Image Compression Tools Online (Free & Easy to Use)',
      description: 'Reduce image size without losing quality. Check out the best free image compressor tools for faster website loading and better SEO.',
      category: 'tools',
      categoryName: 'Tools',
      tags: ['image', 'compression', 'optimization', 'web performance'],
      author: 'bigtoolz',
      image: '/blog/images/2026-08-18-image-compression.jpg',
      thumb: 'teal',
      thumbEmoji: '🖼',
      publishedAt: '2026-08-18',
      readTime: 7,
      url: '/blog/posts/best-image-compression-tools/',
      relatedTools: ['image-compressor', 'png-to-jpg', 'webp-to-pdf']
    },
    {
      id: 5,
      slug: 'how-to-make-website-without-coding',
      title: 'How to Make a Website Without Coding (2026)',
      description: 'Create your own website easily without any coding knowledge. Best tools, step-by-step guide and tips for beginners.',
      category: 'how-to',
      categoryName: 'How-To',
      tags: ['website', 'no-code', 'beginner', 'tools'],
      author: 'bigtoolz',
      image: '/blog/images/2026-08-15-website-no-code.jpg',
      thumb: 'indigo',
      thumbEmoji: '💻',
      publishedAt: '2026-08-15',
      readTime: 9,
      url: '/blog/posts/how-to-make-website-without-coding/',
      relatedTools: ['meta-tag', 'favicon-generator', 'robots-txt']
    },
    {
      id: 6,
      slug: 'best-pdf-converter-tools',
      title: 'Best PDF Converter Tools (Free & Fast)',
      description: 'Convert PDF to Word, JPG, Excel and more. Here are the best free PDF converter tools you can use right now.',
      category: 'tools',
      categoryName: 'Tools',
      tags: ['pdf', 'converter', 'word', 'excel'],
      author: 'bigtoolz',
      image: '/blog/images/2026-08-12-pdf-converters.jpg',
      thumb: 'dark',
      thumbEmoji: '📕',
      publishedAt: '2026-08-12',
      readTime: 6,
      url: '/blog/posts/best-pdf-converter-tools/',
      relatedTools: ['pdf-to-jpg', 'word-to-pdf', 'pdf-to-excel']
    },
    {
      id: 7,
      slug: '10-productivity-tips-2026',
      title: '10 Simple Productivity Tips for 2026',
      description: 'Work smarter, save time and get more done with these simple yet powerful productivity tips.',
      category: 'tips',
      categoryName: 'Tips',
      tags: ['productivity', 'time management', 'habits'],
      author: 'priya',
      image: '/blog/images/2026-08-10-productivity.jpg',
      thumb: 'green',
      thumbEmoji: '⚡',
      publishedAt: '2026-08-10',
      readTime: 5,
      url: '/blog/posts/10-productivity-tips-2026/',
      relatedTools: ['habit-tracker', 'todo-list', 'pomodoro']
    },
    {
      id: 8,
      slug: 'best-ai-tools-for-students',
      title: 'Best AI Tools for Students in 2026',
      description: 'Explore the top AI tools that can help students study better, write faster and improve their skills.',
      category: 'ai',
      categoryName: 'AI & Tech',
      tags: ['ai', 'students', 'education', 'study'],
      author: 'bigtoolz',
      image: '/blog/images/2026-08-08-ai-students.jpg',
      thumb: 'blue',
      thumbEmoji: '🤖',
      publishedAt: '2026-08-08',
      readTime: 8,
      url: '/blog/posts/best-ai-tools-for-students/',
      relatedTools: ['text-to-speech', 'readability-checker', 'word-counter']
    },
    {
      id: 9,
      slug: 'grow-youtube-channel-2026',
      title: 'How to Grow Your YouTube Channel in 2026',
      description: 'Proven tips to get more views, subscribers and build a successful YouTube channel from scratch.',
      category: 'how-to',
      categoryName: 'How-To',
      tags: ['youtube', 'growth', 'video', 'content'],
      author: 'bigtoolz',
      image: '/blog/images/2026-08-05-youtube-growth.jpg',
      thumb: 'red',
      thumbEmoji: '📺',
      publishedAt: '2026-08-05',
      readTime: 11,
      url: '/blog/posts/grow-youtube-channel-2026/',
      relatedTools: ['youtube-thumbnail', 'youtube-tag-extractor', 'youtube-title']
    },
    {
      id: 10,
      slug: 'best-pdf-tools-online-2026',
      title: 'Top 15 PDF Tools You Need in 2026',
      description: 'Complete guide to the most useful PDF tools — merge, split, compress, convert, sign, and protect PDFs online.',
      category: 'tools',
      categoryName: 'Tools',
      tags: ['pdf', 'tools', 'online', 'editing'],
      author: 'bigtoolz',
      image: '/blog/images/2026-08-03-pdf-tools.jpg',
      thumb: 'dark',
      thumbEmoji: '📚',
      publishedAt: '2026-08-03',
      readTime: 10,
      url: '/blog/posts/best-pdf-tools-online-2026/',
      relatedTools: ['merge-pdf', 'split-pdf', 'compress-pdf']
    },

    /* ==========================================
       REGULAR POSTS (11-20)
       ========================================== */
    {
      id: 11,
      slug: 'keyword-research-guide',
      title: 'Complete Keyword Research Guide for 2026',
      description: 'Learn how to find profitable keywords, analyze search intent, and use keyword tools to rank higher on Google.',
      category: 'seo',
      categoryName: 'SEO',
      tags: ['keywords', 'research', 'seo', 'google'],
      author: 'arjun',
      image: '/blog/images/2026-07-30-keyword-research.jpg',
      thumb: 'dark',
      thumbEmoji: '🎯',
      publishedAt: '2026-07-30',
      readTime: 14,
      url: '/blog/posts/keyword-research-guide/',
      relatedTools: ['keyword-planner', 'keyword-density']
    },
    {
      id: 12,
      slug: 'image-optimization-seo',
      title: 'Image Optimization for SEO: Complete Guide',
      description: 'Optimize images for faster loading and better Google rankings. Compression, alt text, lazy loading, and modern formats.',
      category: 'seo',
      categoryName: 'SEO',
      tags: ['image seo', 'optimization', 'webp', 'compression'],
      author: 'arjun',
      image: '/blog/images/2026-07-27-image-seo.jpg',
      thumb: 'teal',
      thumbEmoji: '🖼',
      publishedAt: '2026-07-27',
      readTime: 9,
      url: '/blog/posts/image-optimization-seo/',
      relatedTools: ['image-compressor', 'jpg-to-png', 'webp-to-pdf']
    },
    {
      id: 13,
      slug: 'password-security-tips',
      title: '10 Password Security Tips Everyone Should Follow',
      description: 'Protect your accounts with strong passwords, 2FA, and password managers. Simple security tips for everyday users.',
      category: 'tips',
      categoryName: 'Tips',
      tags: ['password', 'security', '2fa', 'privacy'],
      author: 'bigtoolz',
      image: '/blog/images/2026-07-24-password-security.jpg',
      thumb: 'indigo',
      thumbEmoji: '🔒',
      publishedAt: '2026-07-24',
      readTime: 6,
      url: '/blog/posts/password-security-tips/',
      relatedTools: ['password-strength', 'password-generator', 'otp-generator']
    },
    {
      id: 14,
      slug: 'how-to-compress-pdf-without-losing-quality',
      title: 'How to Compress PDF Without Losing Quality',
      description: 'Reduce PDF file size while keeping text and images sharp. Best compression settings, tools, and tips.',
      category: 'how-to',
      categoryName: 'How-To',
      tags: ['pdf', 'compress', 'optimization'],
      author: 'bigtoolz',
      image: '/blog/images/2026-07-21-compress-pdf.jpg',
      thumb: 'dark',
      thumbEmoji: '📉',
      publishedAt: '2026-07-21',
      readTime: 8,
      url: '/blog/posts/how-to-compress-pdf-without-losing-quality/',
      relatedTools: ['compress-pdf', 'optimizer-pdf']
    },
    {
      id: 15,
      slug: 'convert-images-to-pdf-guide',
      title: 'How to Convert Images to PDF (Step-by-Step)',
      description: 'Turn JPG, PNG, or multiple images into a single PDF. Full guide with tools and settings.',
      category: 'how-to',
      categoryName: 'How-To',
      tags: ['image to pdf', 'jpg', 'png', 'conversion'],
      author: 'bigtoolz',
      image: '/blog/images/2026-07-18-image-to-pdf.jpg',
      thumb: 'orange',
      thumbEmoji: '🔄',
      publishedAt: '2026-07-18',
      readTime: 7,
      url: '/blog/posts/convert-images-to-pdf-guide/',
      relatedTools: ['jpg-to-pdf', 'png-to-pdf', 'multiple-images']
    },
    {
      id: 16,
      slug: 'best-qr-code-generators',
      title: 'Best QR Code Generators for Business (Free)',
      description: 'Create QR codes for menus, links, and products. Best free QR generators for small businesses.',
      category: 'tools',
      categoryName: 'Tools',
      tags: ['qr code', 'business', 'marketing'],
      author: 'priya',
      image: '/blog/images/2026-07-15-qr-codes.jpg',
      thumb: 'blue',
      thumbEmoji: '▦',
      publishedAt: '2026-07-15',
      readTime: 6,
      url: '/blog/posts/best-qr-code-generators/',
      relatedTools: ['qr-code-generator', 'qr-code-logo', 'qr-pdf']
    },
    {
      id: 17,
      slug: 'json-formatter-guide',
      title: 'JSON Formatter: How to Beautify and Validate JSON',
      description: 'Complete guide to formatting, validating, and debugging JSON for developers.',
      category: 'how-to',
      categoryName: 'How-To',
      tags: ['json', 'developer', 'coding', 'format'],
      author: 'bigtoolz',
      image: '/blog/images/2026-07-12-json-formatter.jpg',
      thumb: 'dark',
      thumbEmoji: '{ }',
      publishedAt: '2026-07-12',
      readTime: 7,
      url: '/blog/posts/json-formatter-guide/',
      relatedTools: ['json-formatter', 'json-validator', 'json-to-xml']
    },
    {
      id: 18,
      slug: 'word-counter-for-writers',
      title: 'Best Word Counter Tools for Writers and Bloggers',
      description: 'Count words, characters, sentences, and paragraphs. Best free tools for writers and content creators.',
      category: 'tools',
      categoryName: 'Tools',
      tags: ['word count', 'writing', 'content', 'tools'],
      author: 'priya',
      image: '/blog/images/2026-07-08-word-counter.jpg',
      thumb: 'green',
      thumbEmoji: 'T',
      publishedAt: '2026-07-08',
      readTime: 5,
      url: '/blog/posts/word-counter-for-writers/',
      relatedTools: ['word-counter', 'character-counter', 'readability-checker']
    },
    {
      id: 19,
      slug: 'how-to-protect-pdf-with-password',
      title: 'How to Protect Your PDF with a Password',
      description: 'Add password protection to sensitive PDFs. Step-by-step guide with the best free tools.',
      category: 'how-to',
      categoryName: 'How-To',
      tags: ['pdf', 'security', 'password', 'encryption'],
      author: 'bigtoolz',
      image: '/blog/images/2026-07-05-pdf-password.jpg',
      thumb: 'red',
      thumbEmoji: '🔐',
      publishedAt: '2026-07-05',
      readTime: 6,
      url: '/blog/posts/how-to-protect-pdf-with-password/',
      relatedTools: ['protect-pdf', 'unlock-pdf', 'add-signature']
    },
    {
      id: 20,
      slug: 'color-theory-for-designers',
      title: 'Color Theory for Designers: Beginner\'s Guide',
      description: 'Master color theory — color wheel, harmonies, psychology, and practical tips for UI/UX designers.',
      category: 'tips',
      categoryName: 'Tips',
      tags: ['color', 'design', 'ui', 'ux'],
      author: 'priya',
      image: '/blog/images/2026-07-02-color-theory.jpg',
      thumb: 'pink',
      thumbEmoji: '🎨',
      publishedAt: '2026-07-02',
      readTime: 10,
      url: '/blog/posts/color-theory-for-designers/',
      relatedTools: ['color-palette', 'image-color-picker', 'color-extractor']
    },

    /* ==========================================
       NEWER POSTS (21-30)
       ========================================== */
    {
      id: 21,
      slug: 'how-to-split-pdf-pages',
      title: 'How to Split a PDF into Multiple Files',
      description: 'Learn how to split a large PDF into smaller files or extract specific pages. Free tools and tips.',
      category: 'how-to',
      categoryName: 'How-To',
      tags: ['pdf', 'split', 'extract', 'pages'],
      author: 'bigtoolz',
      image: '/blog/images/2026-06-28-split-pdf.jpg',
      thumb: 'orange',
      thumbEmoji: '✂️',
      publishedAt: '2026-06-28',
      readTime: 7,
      url: '/blog/posts/how-to-split-pdf-pages/',
      relatedTools: ['split-pdf', 'extract-pages', 'delete-pages']
    },
    {
      id: 22,
      slug: 'on-page-seo-checklist',
      title: 'On-Page SEO Checklist for 2026',
      description: 'The definitive on-page SEO checklist — titles, meta descriptions, headings, internal links, and more.',
      category: 'seo',
      categoryName: 'SEO',
      tags: ['seo', 'checklist', 'on-page', 'optimization'],
      author: 'arjun',
      image: '/blog/images/2026-06-25-on-page-seo.jpg',
      thumb: 'dark',
      thumbEmoji: '📋',
      publishedAt: '2026-06-25',
      readTime: 12,
      url: '/blog/posts/on-page-seo-checklist/',
      relatedTools: ['meta-description', 'serp-preview', 'article-title']
    },
    {
      id: 23,
      slug: 'best-image-formats-web',
      title: 'Best Image Formats for the Web (2026)',
      description: 'WebP vs JPG vs PNG vs AVIF — which format should you use? Complete guide with pros, cons, and use cases.',
      category: 'tools',
      categoryName: 'Tools',
      tags: ['image', 'formats', 'webp', 'avif', 'jpg'],
      author: 'priya',
      image: '/blog/images/2026-06-22-image-formats.jpg',
      thumb: 'teal',
      thumbEmoji: '🖼',
      publishedAt: '2026-06-22',
      readTime: 9,
      url: '/blog/posts/best-image-formats-web/',
      relatedTools: ['png-to-jpg', 'jpg-to-png', 'image-compressor']
    },
    {
      id: 24,
      slug: 'how-to-remove-pdf-watermark',
      title: 'How to Remove a Watermark from a PDF',
      description: 'Remove unwanted watermarks from PDFs. Free tools and step-by-step guide.',
      category: 'how-to',
      categoryName: 'How-To',
      tags: ['pdf', 'watermark', 'remove'],
      author: 'bigtoolz',
      image: '/blog/images/2026-06-20-remove-watermark.jpg',
      thumb: 'red',
      thumbEmoji: '🚫',
      publishedAt: '2026-06-20',
      readTime: 6,
      url: '/blog/posts/how-to-remove-pdf-watermark/',
      relatedTools: ['watermark-remover', 'watermark-pdf']
    },
    {
      id: 25,
      slug: 'lorem-ipsum-guide-designers',
      title: 'Why Designers Use Lorem Ipsum (And Why You Should Too)',
      description: 'The history of Lorem Ipsum and why it\'s still the best placeholder text for designers and developers.',
      category: 'tips',
      categoryName: 'Tips',
      tags: ['lorem ipsum', 'design', 'placeholder'],
      author: 'priya',
      image: '/blog/images/2026-06-17-lorem-ipsum.jpg',
      thumb: 'indigo',
      thumbEmoji: '📄',
      publishedAt: '2026-06-17',
      readTime: 5,
      url: '/blog/posts/lorem-ipsum-guide-designers/',
      relatedTools: ['lorem-ipsum', 'placeholder-generator']
    },
    {
      id: 26,
      slug: 'future-of-ai-in-content-creation',
      title: 'The Future of AI in Content Creation (2026 Outlook)',
      description: 'How AI is changing content creation — tools, trends, and what it means for creators and marketers.',
      category: 'ai',
      categoryName: 'AI & Tech',
      tags: ['ai', 'content', 'future', 'trends'],
      author: 'bigtoolz',
      image: '/blog/images/2026-06-14-ai-content.jpg',
      thumb: 'pink',
      thumbEmoji: '🤖',
      publishedAt: '2026-06-14',
      readTime: 11,
      url: '/blog/posts/future-of-ai-in-content-creation/',
      relatedTools: ['text-to-speech', 'text-rephraser']
    },
    {
      id: 27,
      slug: 'bigtoolz-100-tools-milestone',
      title: 'BigToolz Reaches 100 Free Tools Milestone',
      description: 'Celebrating 100 free online tools on BigToolz. Here\'s what\'s new and what\'s coming next.',
      category: 'news',
      categoryName: 'News',
      tags: ['bigtoolz', 'milestone', 'update'],
      author: 'bigtoolz',
      image: '/blog/images/2026-06-10-milestone.jpg',
      thumb: 'blue',
      thumbEmoji: '🎉',
      publishedAt: '2026-06-10',
      readTime: 4,
      url: '/blog/posts/bigtoolz-100-tools-milestone/',
      relatedTools: []
    },
    {
      id: 28,
      slug: 'how-to-use-css-gradient',
      title: 'How to Use CSS Gradients (Complete Guide)',
      description: 'Master linear, radial, and conic gradients in CSS with practical examples.',
      category: 'how-to',
      categoryName: 'How-To',
      tags: ['css', 'gradient', 'design', 'web'],
      author: 'arjun',
      image: '/blog/images/2026-06-07-css-gradient.jpg',
      thumb: 'purple',
      thumbEmoji: '🌈',
      publishedAt: '2026-06-07',
      readTime: 8,
      url: '/blog/posts/how-to-use-css-gradient/',
      relatedTools: ['css-gradient', 'box-shadow', 'border-radius']
    },
    {
      id: 29,
      slug: 'compress-images-faster-website',
      title: 'Compress Images for a Faster Website (2026)',
      description: 'Complete guide to image compression for better Core Web Vitals, faster loading, and higher rankings.',
      category: 'seo',
      categoryName: 'SEO',
      tags: ['image', 'compression', 'performance', 'core web vitals'],
      author: 'arjun',
      image: '/blog/images/2026-06-04-compress-faster.jpg',
      thumb: 'teal',
      thumbEmoji: '⚡',
      publishedAt: '2026-06-04',
      readTime: 10,
      url: '/blog/posts/compress-images-faster-website/',
      relatedTools: ['image-compressor', 'optimizer-pdf']
    },
    {
      id: 30,
      slug: 'best-time-to-post-social-media',
      title: 'Best Time to Post on Social Media in 2026',
      description: 'Data-driven guide to the best posting times on Instagram, Twitter, Facebook, LinkedIn, and YouTube.',
      category: 'tips',
      categoryName: 'Tips',
      tags: ['social media', 'timing', 'engagement', 'marketing'],
      author: 'priya',
      image: '/blog/images/2026-06-01-social-timing.jpg',
      thumb: 'orange',
      thumbEmoji: '⏰',
      publishedAt: '2026-06-01',
      readTime: 9,
      url: '/blog/posts/best-time-to-post-social-media/',
      relatedTools: ['social-scheduler', 'hashtag-generator', 'caption-generator']
    }

  ];

  /* ===========================================
     5. HELPER FUNCTIONS
     =========================================== */
  const BlogData = {

    /* Get all posts */
    getAll() {
      return BLOG_POSTS;
    },

    /* Get post by ID */
    getById(id) {
      return BLOG_POSTS.find(p => p.id === id);
    },

    /* Get post by slug */
    getBySlug(slug) {
      return BLOG_POSTS.find(p => p.slug === slug);
    },

    /* Get posts by category */
    getByCategory(categorySlug) {
      return BLOG_POSTS.filter(p => p.category === categorySlug);
    },

    /* Get posts by tag */
    getByTag(tag) {
      return BLOG_POSTS.filter(p => (p.tags || []).includes(tag));
    },

    /* Get posts by author */
    getByAuthor(authorId) {
      return BLOG_POSTS.filter(p => p.author === authorId);
    },

    /* Get featured post */
    getFeatured() {
      return BLOG_POSTS.find(p => p.featured) ||
             BLOG_POSTS.find(p => p.slug === BLOG_CONFIG.featuredPostSlug) ||
             BLOG_POSTS[0];
    },

    /* Get trending posts */
    getTrending(limit = 5) {
      return BLOG_POSTS.filter(p => p.trending).slice(0, limit);
    },

    /* Get recent posts (sorted by date desc) */
    getRecent(limit = 10) {
      return [...BLOG_POSTS]
        .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))
        .slice(0, limit);
    },

    /* Get popular posts (trending first, then recent) */
    getPopular(limit = 5) {
      const trending = BLOG_POSTS.filter(p => p.trending);
      const rest = BLOG_POSTS.filter(p => !p.trending)
        .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
      return [...trending, ...rest].slice(0, limit);
    },

    /* Get related posts (same category, excluding current) */
    getRelated(postId, limit = 3) {
      const post = this.getById(postId);
      if (!post) return [];

      const sameCategory = BLOG_POSTS.filter(
        p => p.id !== postId && p.category === post.category
      );

      // If not enough, add posts with shared tags
      if (sameCategory.length < limit) {
        const tagged = BLOG_POSTS.filter(p => {
          if (p.id === postId || sameCategory.includes(p)) return false;
          return (p.tags || []).some(t => (post.tags || []).includes(t));
        });
        return [...sameCategory, ...tagged].slice(0, limit);
      }

      return sameCategory.slice(0, limit);
    },

    /* Simple text search */
    search(query) {
      if (!query || !query.trim()) return [];
      const q = query.toLowerCase().trim();
      return BLOG_POSTS.filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        (p.tags || []).some(t => t.toLowerCase().includes(q)) ||
        p.categoryName.toLowerCase().includes(q)
      );
    },

    /* Get all categories with post counts */
    getCategories() {
      return BLOG_CATEGORIES.map(cat => ({
        ...cat,
        count: BLOG_POSTS.filter(p => p.category === cat.slug).length
      }));
    },

    /* Get category by slug */
    getCategory(slug) {
      return BLOG_CATEGORIES.find(c => c.slug === slug);
    },

    /* Get author by ID */
    getAuthor(authorId) {
      return AUTHORS[authorId];
    },

    /* Get all authors */
    getAuthors() {
      return Object.values(AUTHORS);
    },

    /* Get all unique tags */
    getAllTags() {
      const tags = new Set();
      BLOG_POSTS.forEach(p => (p.tags || []).forEach(t => tags.add(t)));
      return [...tags].sort();
    },

    /* Paginate posts */
    paginate(page = 1, perPage = BLOG_CONFIG.postsPerPage) {
      const sorted = [...BLOG_POSTS]
        .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
      const start = (page - 1) * perPage;
      const end = start + perPage;
      return {
        posts: sorted.slice(start, end),
        total: sorted.length,
        page,
        perPage,
        totalPages: Math.ceil(sorted.length / perPage)
      };
    },

    /* Total count */
    count() {
      return BLOG_POSTS.length;
    },

    /* Count by category */
    countByCategory(categorySlug) {
      return BLOG_POSTS.filter(p => p.category === categorySlug).length;
    },

    /* Format date */
    formatDate(dateStr, locale = 'en-US') {
      const date = new Date(dateStr);
      return date.toLocaleDateString(locale, {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    },

    /* Blog config */
    getConfig() {
      return BLOG_CONFIG;
    }
  };

  /* ===========================================
     6. EXPORTS (Global namespace)
     =========================================== */
  window.BlogData = BlogData;
  window.BLOG_DATABASE = BLOG_POSTS;
  window.BLOG_CATEGORIES = BLOG_CATEGORIES;
  window.BLOG_AUTHORS = AUTHORS;
  window.BLOG_CONFIG = BLOG_CONFIG;

  /* ===========================================
     7. CONSOLE LOG
     =========================================== */
  if (typeof console !== 'undefined') {
    console.log('%c📝 BigToolz Blog Database loaded', 'color:#8b5cf6;font-weight:bold;font-size:14px;');
    console.log('%c✓ ' + BLOG_POSTS.length + ' posts across ' + BLOG_CATEGORIES.length + ' categories', 'color:#10b981;');
  }

})();