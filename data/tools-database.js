/* ===========================================
   BigToolz - Master Tools Database
   Version: 2.0.0
   Last Updated: 2026-01-15
   Purpose: Central database for all 300 tools
   Usage: <script src="/data/tools-database.js" defer></script>
   =========================================== */

'use strict';

(function () {

  /* ===========================================
     1. SITE CONFIG
     =========================================== */
  const SITE_CONFIG = {
    name: 'BigToolz',
    domain: 'bigtoolz.com',
    url: 'https://bigtoolz.com',
    tagline: 'All the Tools You Need, in One Place!',
    description: '300+ free online tools for images, PDFs, text, SEO and more. No signup, no installation — fast, secure and 100% free.',
    totalTools: 300,
    totalCategories: 8,
    social: {
      facebook: 'https://facebook.com/bigtoolz',
      twitter: 'https://twitter.com/bigtoolz',
      youtube: 'https://youtube.com/@bigtoolz',
      instagram: 'https://instagram.com/bigtoolz',
      reddit: 'https://reddit.com/r/bigtoolz'
    },
    contact: {
      general: 'hello@bigtoolz.com',
      legal: 'legal@bigtoolz.com',
      partners: 'partners@bigtoolz.com'
    }
  };

  /* ===========================================
     2. CATEGORIES
     =========================================== */
  const CATEGORIES = [
    {
      slug: 'image-tools',
      name: 'Image Tools',
      icon: '🖼',
      color: '#10b981',
      description: 'Compress, resize, crop, convert and edit images online.',
      url: '/tools/image-tools/',
      count: 25
    },
    {
      slug: 'text-tools',
      name: 'Text Tools',
      icon: 'T',
      color: '#3b82f6',
      description: 'Count, convert, format and analyze text with ease.',
      url: '/tools/text-tools/',
      count: 25
    },
    {
      slug: 'developer-tools',
      name: 'Developer Tools',
      icon: '</>',
      color: '#f97316',
      description: 'Minify, format, encode, and validate code and data.',
      url: '/tools/developer-tools/',
      count: 25
    },
    {
      slug: 'calculator-tools',
      name: 'Calculator Tools',
      icon: '🧮',
      color: '#8b5cf6',
      description: 'Calculate EMI, BMI, GST, percentages and much more.',
      url: '/tools/calculator-tools/',
      count: 25
    },
    {
      slug: 'seo-tools',
      name: 'SEO Tools',
      icon: '📈',
      color: '#ef4444',
      description: 'Meta tags, keyword research, SERP preview and more.',
      url: '/tools/seo-tools/',
      count: 25
    },
    {
      slug: 'social-tools',
      name: 'Social Tools',
      icon: '📱',
      color: '#ec4899',
      description: 'Download media, generate hashtags, captions and bios.',
      url: '/tools/social-tools/',
      count: 25
    },
    {
      slug: 'utility-tools',
      name: 'Utility Tools',
      icon: '⚙️',
      color: '#06b6d4',
      description: 'Password generators, timers, converters and helpers.',
      url: '/tools/utility-tools/',
      count: 50
    },
    {
      slug: 'pdf-tools',
      name: 'PDF Tools',
      icon: '📕',
      color: '#dc2626',
      description: 'Convert, merge, split, protect and edit PDF files.',
      url: '/tools/pdf-tools/',
      count: 100
    }
  ];

  /* ===========================================
     3. PDF SUBCATEGORIES
     =========================================== */
  const PDF_SUBCATEGORIES = [
    {
      slug: 'convert-pdf',
      name: 'Convert PDF',
      icon: '🔄',
      url: '/tools/pdf-tools/convert-pdf/',
      count: 15
    },
    {
      slug: 'organize-pdf',
      name: 'Organize PDF',
      icon: '📂',
      url: '/tools/pdf-tools/organize-pdf/',
      count: 20
    },
    {
      slug: 'security-pdf',
      name: 'Security PDF',
      icon: '🔒',
      url: '/tools/pdf-tools/security-pdf/',
      count: 15
    },
    {
      slug: 'visual-pdf',
      name: 'Visual PDF',
      icon: '🎨',
      url: '/tools/pdf-tools/visual-pdf/',
      count: 15
    },
    {
      slug: 'form-pdf',
      name: 'Form PDF',
      icon: '📝',
      url: '/tools/pdf-tools/form-pdf/',
      count: 15
    },
    {
      slug: 'advanced-pdf',
      name: 'Advanced PDF',
      icon: '🚀',
      url: '/tools/pdf-tools/advanced-pdf/',
      count: 20
    }
  ];

  /* ===========================================
     4. TOOLS DATABASE (All 300 Tools)
     =========================================== */
  const TOOLS = [

    /* ============================================
       IMAGE TOOLS — 25 Tools (#1-25)
       ============================================ */
    { id: 1, slug: 'image-compressor', name: 'Image Compressor', category: 'image-tools', categoryName: 'Image Tools', url: '/tools/image-tools/image-compressor/', description: 'Reduce image size without losing quality', keywords: ['compress image', 'image optimizer', 'reduce image size', 'shrink image'], icon: '🖼', color: '#10b981', trending: true },
    { id: 2, slug: 'png-to-jpg', name: 'PNG to JPG', category: 'image-tools', categoryName: 'Image Tools', url: '/tools/image-tools/png-to-jpg/', description: 'Convert PNG images to JPG format', keywords: ['png to jpg', 'convert png', 'png converter'], icon: '🔄', color: '#3b82f6' },
    { id: 3, slug: 'jpg-to-png', name: 'JPG to PNG', category: 'image-tools', categoryName: 'Image Tools', url: '/tools/image-tools/jpg-to-png/', description: 'Convert JPG images to PNG format', keywords: ['jpg to png', 'convert jpg', 'jpg converter'], icon: '🔄', color: '#10b981' },
    { id: 4, slug: 'image-resizer', name: 'Image Resizer', category: 'image-tools', categoryName: 'Image Tools', url: '/tools/image-tools/image-resizer/', description: 'Resize images to any dimension', keywords: ['resize image', 'change image size', 'image dimensions'], icon: '📐', color: '#8b5cf6', trending: true },
    { id: 5, slug: 'image-crop', name: 'Image Crop', category: 'image-tools', categoryName: 'Image Tools', url: '/tools/image-tools/image-crop/', description: 'Crop images with precision', keywords: ['crop image', 'image cutter', 'trim image'], icon: '✂️', color: '#f97316' },
    { id: 6, slug: 'image-flip', name: 'Image Flip', category: 'image-tools', categoryName: 'Image Tools', url: '/tools/image-tools/image-flip/', description: 'Flip images horizontally or vertically', keywords: ['flip image', 'mirror image'], icon: '🔃', color: '#06b6d4' },
    { id: 7, slug: 'image-rotate', name: 'Image Rotate', category: 'image-tools', categoryName: 'Image Tools', url: '/tools/image-tools/image-rotate/', description: 'Rotate images to any angle', keywords: ['rotate image', 'turn image', 'image angle'], icon: '🔁', color: '#ec4899' },
    { id: 8, slug: 'image-to-base64', name: 'Image to Base64', category: 'image-tools', categoryName: 'Image Tools', url: '/tools/image-tools/image-to-base64/', description: 'Convert images to Base64 strings', keywords: ['image to base64', 'base64 encoder', 'encode image'], icon: '🔤', color: '#8b5cf6' },
    { id: 9, slug: 'base64-to-image', name: 'Base64 to Image', category: 'image-tools', categoryName: 'Image Tools', url: '/tools/image-tools/base64-to-image/', description: 'Convert Base64 strings to images', keywords: ['base64 to image', 'decode base64', 'base64 decoder'], icon: '🖼', color: '#10b981' },
    { id: 10, slug: 'image-color-picker', name: 'Image Color Picker', category: 'image-tools', categoryName: 'Image Tools', url: '/tools/image-tools/image-color-picker/', description: 'Pick colors from any image', keywords: ['color picker', 'pick color', 'hex color'], icon: '🎨', color: '#f59e0b' },
    { id: 11, slug: 'image-blur', name: 'Image Blur', category: 'image-tools', categoryName: 'Image Tools', url: '/tools/image-tools/image-blur/', description: 'Blur images or parts of images', keywords: ['blur image', 'image blur', 'gaussian blur'], icon: '💨', color: '#64748b' },
    { id: 12, slug: 'image-brightness', name: 'Image Brightness', category: 'image-tools', categoryName: 'Image Tools', url: '/tools/image-tools/image-brightness/', description: 'Adjust image brightness', keywords: ['brightness', 'brighten image', 'image exposure'], icon: '☀️', color: '#f59e0b' },
    { id: 13, slug: 'image-contrast', name: 'Image Contrast', category: 'image-tools', categoryName: 'Image Tools', url: '/tools/image-tools/image-contrast/', description: 'Adjust image contrast', keywords: ['contrast', 'image contrast'], icon: '◐', color: '#1e293b' },
    { id: 14, slug: 'image-grayscale', name: 'Image Grayscale', category: 'image-tools', categoryName: 'Image Tools', url: '/tools/image-tools/image-grayscale/', description: 'Convert images to grayscale', keywords: ['grayscale', 'black and white', 'bw image'], icon: '⚫', color: '#6b7280' },
    { id: 15, slug: 'image-pixelator', name: 'Image Pixelator', category: 'image-tools', categoryName: 'Image Tools', url: '/tools/image-tools/image-pixelator/', description: 'Pixelate images for privacy', keywords: ['pixelate', 'mosaic', 'censor image'], icon: '🔲', color: '#8b5cf6' },
    { id: 16, slug: 'image-sketch', name: 'Image to Sketch', category: 'image-tools', categoryName: 'Image Tools', url: '/tools/image-tools/image-sketch/', description: 'Convert photos to sketch', keywords: ['sketch', 'pencil drawing', 'drawing filter'], icon: '✏️', color: '#1e293b' },
    { id: 17, slug: 'image-ascii', name: 'Image to ASCII', category: 'image-tools', categoryName: 'Image Tools', url: '/tools/image-tools/image-ascii/', description: 'Convert images to ASCII art', keywords: ['ascii art', 'image to ascii'], icon: '🔤', color: '#0f172a' },
    { id: 18, slug: 'image-watermark', name: 'Image Watermark', category: 'image-tools', categoryName: 'Image Tools', url: '/tools/image-tools/image-watermark/', description: 'Add watermarks to images', keywords: ['watermark', 'add watermark', 'protect image'], icon: '💧', color: '#3b82f6' },
    { id: 19, slug: 'screenshot-editor', name: 'Screenshot Editor', category: 'image-tools', categoryName: 'Image Tools', url: '/tools/image-tools/screenshot-editor/', description: 'Edit screenshots online', keywords: ['screenshot editor', 'edit screenshot'], icon: '📸', color: '#ec4899' },
    { id: 20, slug: 'image-metadata', name: 'Image Metadata Viewer', category: 'image-tools', categoryName: 'Image Tools', url: '/tools/image-tools/image-metadata/', description: 'View image EXIF data', keywords: ['exif', 'metadata', 'image info'], icon: 'ℹ️', color: '#06b6d4' },
    { id: 21, slug: 'aspect-ratio', name: 'Aspect Ratio Calculator', category: 'image-tools', categoryName: 'Image Tools', url: '/tools/image-tools/aspect-ratio/', description: 'Calculate image aspect ratios', keywords: ['aspect ratio', 'ratio calculator'], icon: '📐', color: '#8b5cf6' },
    { id: 22, slug: 'placeholder-generator', name: 'Placeholder Generator', category: 'image-tools', categoryName: 'Image Tools', url: '/tools/image-tools/placeholder-generator/', description: 'Generate placeholder images', keywords: ['placeholder', 'dummy image'], icon: '⬜', color: '#64748b' },
    { id: 23, slug: 'qr-code-generator', name: 'QR Code Generator', category: 'image-tools', categoryName: 'Image Tools', url: '/tools/image-tools/qr-code-generator/', description: 'Create QR codes for text, links and more', keywords: ['qr code', 'qr generator', 'generate qr'], icon: '▦', color: '#3b82f6', trending: true },
    { id: 24, slug: 'svg-to-png', name: 'SVG to PNG', category: 'image-tools', categoryName: 'Image Tools', url: '/tools/image-tools/svg-to-png/', description: 'Convert SVG to PNG format', keywords: ['svg to png', 'svg converter'], icon: '🖼', color: '#10b981' },
    { id: 25, slug: 'color-extractor', name: 'Color Extractor', category: 'image-tools', categoryName: 'Image Tools', url: '/tools/image-tools/color-extractor/', description: 'Extract colors from images', keywords: ['extract color', 'color palette', 'image colors'], icon: '🎨', color: '#f59e0b' },

    /* ============================================
       TEXT TOOLS — 25 Tools (#26-50)
       ============================================ */
    { id: 26, slug: 'word-counter', name: 'Word Counter', category: 'text-tools', categoryName: 'Text Tools', url: '/tools/text-tools/word-counter/', description: 'Count words, characters and more', keywords: ['word count', 'character count', 'count words'], icon: 'T', color: '#3b82f6', trending: true },
    { id: 27, slug: 'character-counter', name: 'Character Counter', category: 'text-tools', categoryName: 'Text Tools', url: '/tools/text-tools/character-counter/', description: 'Count characters in text', keywords: ['character count', 'letter count'], icon: '🔤', color: '#8b5cf6' },
    { id: 28, slug: 'case-converter', name: 'Case Converter', category: 'text-tools', categoryName: 'Text Tools', url: '/tools/text-tools/case-converter/', description: 'Convert text case (upper, lower, title)', keywords: ['case converter', 'uppercase', 'lowercase', 'title case'], icon: 'Aa', color: '#f97316' },
    { id: 29, slug: 'fancy-text', name: 'Fancy Text Generator', category: 'text-tools', categoryName: 'Text Tools', url: '/tools/text-tools/fancy-text/', description: 'Generate fancy text styles', keywords: ['fancy text', 'cool fonts', 'stylish text'], icon: '✨', color: '#ec4899' },
    { id: 30, slug: 'bold-text', name: 'Bold Text Generator', category: 'text-tools', categoryName: 'Text Tools', url: '/tools/text-tools/bold-text/', description: 'Convert text to bold', keywords: ['bold text', 'bold generator'], icon: 'B', color: '#1e293b' },
    { id: 31, slug: 'italic-text', name: 'Italic Text Generator', category: 'text-tools', categoryName: 'Text Tools', url: '/tools/text-tools/italic-text/', description: 'Convert text to italic', keywords: ['italic text', 'italic generator'], icon: 'I', color: '#64748b' },
    { id: 32, slug: 'cursive-text', name: 'Cursive Text Generator', category: 'text-tools', categoryName: 'Text Tools', url: '/tools/text-tools/cursive-text/', description: 'Convert text to cursive', keywords: ['cursive text', 'script font'], icon: '𝒜', color: '#8b5cf6' },
    { id: 33, slug: 'upside-down', name: 'Upside Down Text', category: 'text-tools', categoryName: 'Text Tools', url: '/tools/text-tools/upside-down/', description: 'Flip text upside down', keywords: ['upside down', 'flip text'], icon: '🙃', color: '#06b6d4' },
    { id: 34, slug: 'small-text', name: 'Small Text Generator', category: 'text-tools', categoryName: 'Text Tools', url: '/tools/text-tools/small-text/', description: 'Convert text to small text', keywords: ['small text', 'tiny text'], icon: 'ᵃ', color: '#3b82f6' },
    { id: 35, slug: 'zalgo-text', name: 'Zalgo Text Generator', category: 'text-tools', categoryName: 'Text Tools', url: '/tools/text-tools/zalgo-text/', description: 'Generate Zalgo (glitch) text', keywords: ['zalgo', 'glitch text', 'creepy text'], icon: '👹', color: '#ef4444' },
    { id: 36, slug: 'reverse-text', name: 'Reverse Text', category: 'text-tools', categoryName: 'Text Tools', url: '/tools/text-tools/reverse-text/', description: 'Reverse any text', keywords: ['reverse text', 'backwards text'], icon: '🔃', color: '#8b5cf6' },
    { id: 37, slug: 'text-to-binary', name: 'Text to Binary', category: 'text-tools', categoryName: 'Text Tools', url: '/tools/text-tools/text-to-binary/', description: 'Convert text to binary', keywords: ['text to binary', 'binary converter'], icon: '01', color: '#0f172a' },
    { id: 38, slug: 'binary-to-text', name: 'Binary to Text', category: 'text-tools', categoryName: 'Text Tools', url: '/tools/text-tools/binary-to-text/', description: 'Convert binary to text', keywords: ['binary to text', 'decode binary'], icon: '🔤', color: '#3b82f6' },
    { id: 39, slug: 'text-to-hex', name: 'Text to Hex', category: 'text-tools', categoryName: 'Text Tools', url: '/tools/text-tools/text-to-hex/', description: 'Convert text to hexadecimal', keywords: ['text to hex', 'hex converter'], icon: '⬡', color: '#f97316' },
    { id: 40, slug: 'hex-to-text', name: 'Hex to Text', category: 'text-tools', categoryName: 'Text Tools', url: '/tools/text-tools/hex-to-text/', description: 'Convert hexadecimal to text', keywords: ['hex to text', 'decode hex'], icon: '🔤', color: '#10b981' },
    { id: 41, slug: 'text-to-morse', name: 'Text to Morse Code', category: 'text-tools', categoryName: 'Text Tools', url: '/tools/text-tools/text-to-morse/', description: 'Convert text to Morse code', keywords: ['morse code', 'text to morse'], icon: '·−', color: '#0f172a' },
    { id: 42, slug: 'morse-to-text', name: 'Morse Code to Text', category: 'text-tools', categoryName: 'Text Tools', url: '/tools/text-tools/morse-to-text/', description: 'Convert Morse code to text', keywords: ['morse to text', 'decode morse'], icon: '🔤', color: '#64748b' },
    { id: 43, slug: 'random-word', name: 'Random Word Generator', category: 'text-tools', categoryName: 'Text Tools', url: '/tools/text-tools/random-word/', description: 'Generate random words', keywords: ['random word', 'word generator'], icon: '🎲', color: '#8b5cf6' },
    { id: 44, slug: 'random-sentence', name: 'Random Sentence Generator', category: 'text-tools', categoryName: 'Text Tools', url: '/tools/text-tools/random-sentence/', description: 'Generate random sentences', keywords: ['random sentence', 'sentence generator'], icon: '💬', color: '#3b82f6' },
    { id: 45, slug: 'lorem-ipsum', name: 'Lorem Ipsum Generator', category: 'text-tools', categoryName: 'Text Tools', url: '/tools/text-tools/lorem-ipsum/', description: 'Generate Lorem Ipsum placeholder text', keywords: ['lorem ipsum', 'dummy text', 'placeholder text'], icon: '📄', color: '#64748b', trending: true },
    { id: 46, slug: 'text-rephraser', name: 'Text Rephraser', category: 'text-tools', categoryName: 'Text Tools', url: '/tools/text-tools/text-rephraser/', description: 'Rephrase text in different ways', keywords: ['rephrase', 'paraphrase', 'rewrite text'], icon: '✍️', color: '#10b981' },
    { id: 47, slug: 'keyword-density', name: 'Keyword Density Checker', category: 'text-tools', categoryName: 'Text Tools', url: '/tools/text-tools/keyword-density/', description: 'Check keyword density in text', keywords: ['keyword density', 'keyword frequency'], icon: '📊', color: '#8b5cf6' },
    { id: 48, slug: 'readability-checker', name: 'Readability Checker', category: 'text-tools', categoryName: 'Text Tools', url: '/tools/text-tools/readability-checker/', description: 'Check text readability score', keywords: ['readability', 'flesch score'], icon: '📖', color: '#3b82f6' },
    { id: 49, slug: 'word-frequency', name: 'Word Frequency Counter', category: 'text-tools', categoryName: 'Text Tools', url: '/tools/text-tools/word-frequency/', description: 'Count word frequency in text', keywords: ['word frequency', 'word count analysis'], icon: '📈', color: '#f97316' },
    { id: 50, slug: 'typing-speed', name: 'Typing Speed Test', category: 'text-tools', categoryName: 'Text Tools', url: '/tools/text-tools/typing-speed/', description: 'Test your typing speed', keywords: ['typing test', 'wpm test', 'typing speed'], icon: '⌨️', color: '#06b6d4' },

    /* ============================================
       DEVELOPER TOOLS — 25 Tools (#51-75)
       ============================================ */
    { id: 51, slug: 'html-minifier', name: 'HTML Minifier', category: 'developer-tools', categoryName: 'Developer Tools', url: '/tools/developer-tools/html-minifier/', description: 'Minify HTML code', keywords: ['html minifier', 'minify html', 'compress html'], icon: '</>', color: '#f97316' },
    { id: 52, slug: 'css-minifier', name: 'CSS Minifier', category: 'developer-tools', categoryName: 'Developer Tools', url: '/tools/developer-tools/css-minifier/', description: 'Minify CSS code', keywords: ['css minifier', 'minify css'], icon: '{}', color: '#3b82f6' },
    { id: 53, slug: 'js-minifier', name: 'JS Minifier', category: 'developer-tools', categoryName: 'Developer Tools', url: '/tools/developer-tools/js-minifier/', description: 'Minify JavaScript code', keywords: ['js minifier', 'minify javascript'], icon: 'JS', color: '#f59e0b' },
    { id: 54, slug: 'html-formatter', name: 'HTML Formatter', category: 'developer-tools', categoryName: 'Developer Tools', url: '/tools/developer-tools/html-formatter/', description: 'Format and beautify HTML', keywords: ['html formatter', 'beautify html'], icon: '</>', color: '#f97316' },
    { id: 55, slug: 'css-formatter', name: 'CSS Formatter', category: 'developer-tools', categoryName: 'Developer Tools', url: '/tools/developer-tools/css-formatter/', description: 'Format and beautify CSS', keywords: ['css formatter', 'beautify css'], icon: '{}', color: '#3b82f6' },
    { id: 56, slug: 'js-formatter', name: 'JS Formatter', category: 'developer-tools', categoryName: 'Developer Tools', url: '/tools/developer-tools/js-formatter/', description: 'Format and beautify JavaScript', keywords: ['js formatter', 'beautify js'], icon: 'JS', color: '#f59e0b' },
    { id: 57, slug: 'json-formatter', name: 'JSON Formatter', category: 'developer-tools', categoryName: 'Developer Tools', url: '/tools/developer-tools/json-formatter/', description: 'Format and beautify JSON data', keywords: ['json formatter', 'json beautifier', 'pretty json'], icon: '{ }', color: '#10b981', trending: true },
    { id: 58, slug: 'json-validator', name: 'JSON Validator', category: 'developer-tools', categoryName: 'Developer Tools', url: '/tools/developer-tools/json-validator/', description: 'Validate JSON data', keywords: ['json validator', 'validate json'], icon: '✓', color: '#10b981' },
    { id: 59, slug: 'json-to-xml', name: 'JSON to XML', category: 'developer-tools', categoryName: 'Developer Tools', url: '/tools/developer-tools/json-to-xml/', description: 'Convert JSON to XML', keywords: ['json to xml', 'convert json'], icon: '🔄', color: '#8b5cf6' },
    { id: 60, slug: 'xml-to-json', name: 'XML to JSON', category: 'developer-tools', categoryName: 'Developer Tools', url: '/tools/developer-tools/xml-to-json/', description: 'Convert XML to JSON', keywords: ['xml to json', 'convert xml'], icon: '🔄', color: '#f97316' },
    { id: 61, slug: 'base64-encoder', name: 'Base64 Encoder', category: 'developer-tools', categoryName: 'Developer Tools', url: '/tools/developer-tools/base64-encoder/', description: 'Encode text to Base64', keywords: ['base64 encode', 'base64 encoder'], icon: '🔐', color: '#8b5cf6' },
    { id: 62, slug: 'base64-decoder', name: 'Base64 Decoder', category: 'developer-tools', categoryName: 'Developer Tools', url: '/tools/developer-tools/base64-decoder/', description: 'Decode Base64 to text', keywords: ['base64 decode', 'base64 decoder'], icon: '🔓', color: '#3b82f6' },
    { id: 63, slug: 'url-encoder', name: 'URL Encoder', category: 'developer-tools', categoryName: 'Developer Tools', url: '/tools/developer-tools/url-encoder/', description: 'Encode URL strings', keywords: ['url encode', 'url encoder'], icon: '🔗', color: '#06b6d4' },
    { id: 64, slug: 'url-decoder', name: 'URL Decoder', category: 'developer-tools', categoryName: 'Developer Tools', url: '/tools/developer-tools/url-decoder/', description: 'Decode URL strings', keywords: ['url decode', 'url decoder'], icon: '🔗', color: '#10b981' },
    { id: 65, slug: 'rgb-to-hex', name: 'RGB to HEX', category: 'developer-tools', categoryName: 'Developer Tools', url: '/tools/developer-tools/rgb-to-hex/', description: 'Convert RGB color to HEX', keywords: ['rgb to hex', 'color converter'], icon: '🎨', color: '#ec4899' },
    { id: 66, slug: 'hex-to-rgb', name: 'HEX to RGB', category: 'developer-tools', categoryName: 'Developer Tools', url: '/tools/developer-tools/hex-to-rgb/', description: 'Convert HEX color to RGB', keywords: ['hex to rgb', 'color converter'], icon: '🎨', color: '#f59e0b' },
    { id: 67, slug: 'css-gradient', name: 'CSS Gradient Generator', category: 'developer-tools', categoryName: 'Developer Tools', url: '/tools/developer-tools/css-gradient/', description: 'Create CSS gradients visually', keywords: ['css gradient', 'gradient generator'], icon: '🌈', color: '#8b5cf6', trending: true },
    { id: 68, slug: 'box-shadow', name: 'Box Shadow Generator', category: 'developer-tools', categoryName: 'Developer Tools', url: '/tools/developer-tools/box-shadow/', description: 'Generate CSS box shadows', keywords: ['box shadow', 'css shadow'], icon: '◼', color: '#1e293b' },
    { id: 69, slug: 'border-radius', name: 'Border Radius Generator', category: 'developer-tools', categoryName: 'Developer Tools', url: '/tools/developer-tools/border-radius/', description: 'Generate CSS border radius', keywords: ['border radius', 'css radius'], icon: '▢', color: '#3b82f6' },
    { id: 70, slug: 'flexbox', name: 'Flexbox Playground', category: 'developer-tools', categoryName: 'Developer Tools', url: '/tools/developer-tools/flexbox/', description: 'Experiment with CSS Flexbox', keywords: ['flexbox', 'css flex'], icon: '⇄', color: '#10b981' },
    { id: 71, slug: 'css-grid', name: 'CSS Grid Generator', category: 'developer-tools', categoryName: 'Developer Tools', url: '/tools/developer-tools/css-grid/', description: 'Generate CSS grid layouts', keywords: ['css grid', 'grid generator'], icon: '⊞', color: '#8b5cf6' },
    { id: 72, slug: 'meta-tag', name: 'Meta Tag Generator', category: 'developer-tools', categoryName: 'Developer Tools', url: '/tools/developer-tools/meta-tag/', description: 'Generate SEO meta tags', keywords: ['meta tag', 'seo meta', 'meta generator'], icon: '🏷', color: '#3b82f6' },
    { id: 73, slug: 'robots-txt', name: 'Robots.txt Generator', category: 'developer-tools', categoryName: 'Developer Tools', url: '/tools/developer-tools/robots-txt/', description: 'Generate robots.txt files', keywords: ['robots.txt', 'robots generator'], icon: '🤖', color: '#64748b' },
    { id: 74, slug: 'sitemap-generator', name: 'Sitemap Generator', category: 'developer-tools', categoryName: 'Developer Tools', url: '/tools/developer-tools/sitemap-generator/', description: 'Generate XML sitemaps', keywords: ['sitemap', 'xml sitemap'], icon: '🗺', color: '#f97316' },
    { id: 75, slug: 'favicon-generator', name: 'Favicon Generator', category: 'developer-tools', categoryName: 'Developer Tools', url: '/tools/developer-tools/favicon-generator/', description: 'Generate favicons from images', keywords: ['favicon', 'favicon generator'], icon: '⭐', color: '#f59e0b' },

    /* ============================================
       CALCULATOR TOOLS — 25 Tools (#76-100)
       ============================================ */
    { id: 76, slug: 'percentage-calculator', name: 'Percentage Calculator', category: 'calculator-tools', categoryName: 'Calculator Tools', url: '/tools/calculator-tools/percentage-calculator/', description: 'Calculate percentages easily', keywords: ['percentage', 'percent calculator'], icon: '%', color: '#3b82f6', trending: true },
    { id: 77, slug: 'age-calculator', name: 'Age Calculator', category: 'calculator-tools', categoryName: 'Calculator Tools', url: '/tools/calculator-tools/age-calculator/', description: 'Calculate exact age in years, months, days', keywords: ['age calculator', 'calculate age'], icon: '🎂', color: '#ec4899', trending: true },
    { id: 78, slug: 'bmi-calculator', name: 'BMI Calculator', category: 'calculator-tools', categoryName: 'Calculator Tools', url: '/tools/calculator-tools/bmi-calculator/', description: 'Calculate your BMI', keywords: ['bmi', 'body mass index'], icon: '⚖️', color: '#10b981' },
    { id: 79, slug: 'calorie-calculator', name: 'Calorie Calculator', category: 'calculator-tools', categoryName: 'Calculator Tools', url: '/tools/calculator-tools/calorie-calculator/', description: 'Calculate daily calorie needs', keywords: ['calorie', 'calorie calculator'], icon: '🍎', color: '#f97316' },
    { id: 80, slug: 'loan-emi', name: 'Loan EMI Calculator', category: 'calculator-tools', categoryName: 'Calculator Tools', url: '/tools/calculator-tools/loan-emi/', description: 'Calculate loan EMI', keywords: ['emi calculator', 'loan calculator'], icon: '🏦', color: '#3b82f6', trending: true },
    { id: 81, slug: 'sip-calculator', name: 'SIP Calculator', category: 'calculator-tools', categoryName: 'Calculator Tools', url: '/tools/calculator-tools/sip-calculator/', description: 'Calculate SIP returns', keywords: ['sip', 'mutual fund calculator'], icon: '📈', color: '#10b981' },
    { id: 82, slug: 'compound-interest', name: 'Compound Interest Calculator', category: 'calculator-tools', categoryName: 'Calculator Tools', url: '/tools/calculator-tools/compound-interest/', description: 'Calculate compound interest', keywords: ['compound interest', 'interest calculator'], icon: '💰', color: '#f59e0b' },
    { id: 83, slug: 'gst-calculator', name: 'GST Calculator', category: 'calculator-tools', categoryName: 'Calculator Tools', url: '/tools/calculator-tools/gst-calculator/', description: 'Calculate GST instantly', keywords: ['gst', 'gst calculator', 'tax'], icon: '₹', color: '#8b5cf6' },
    { id: 84, slug: 'discount-calculator', name: 'Discount Calculator', category: 'calculator-tools', categoryName: 'Calculator Tools', url: '/tools/calculator-tools/discount-calculator/', description: 'Calculate discounts and final price', keywords: ['discount', 'discount calculator'], icon: '🏷', color: '#ec4899' },
    { id: 85, slug: 'tip-calculator', name: 'Tip Calculator', category: 'calculator-tools', categoryName: 'Calculator Tools', url: '/tools/calculator-tools/tip-calculator/', description: 'Calculate tips easily', keywords: ['tip', 'tip calculator'], icon: '💵', color: '#10b981' },
    { id: 86, slug: 'fuel-cost', name: 'Fuel Cost Calculator', category: 'calculator-tools', categoryName: 'Calculator Tools', url: '/tools/calculator-tools/fuel-cost/', description: 'Calculate trip fuel cost', keywords: ['fuel cost', 'petrol calculator'], icon: '⛽', color: '#f97316' },
    { id: 87, slug: 'electricity-bill', name: 'Electricity Bill Calculator', category: 'calculator-tools', categoryName: 'Calculator Tools', url: '/tools/calculator-tools/electricity-bill/', description: 'Calculate electricity bill', keywords: ['electricity bill', 'power bill'], icon: '⚡', color: '#f59e0b' },
    { id: 88, slug: 'unit-converter', name: 'Unit Converter', category: 'calculator-tools', categoryName: 'Calculator Tools', url: '/tools/calculator-tools/unit-converter/', description: 'Convert between units', keywords: ['unit converter', 'convert units'], icon: '🔄', color: '#3b82f6' },
    { id: 89, slug: 'length-converter', name: 'Length Converter', category: 'calculator-tools', categoryName: 'Calculator Tools', url: '/tools/calculator-tools/length-converter/', description: 'Convert length units', keywords: ['length converter', 'cm to inch'], icon: '📏', color: '#8b5cf6' },
    { id: 90, slug: 'weight-converter', name: 'Weight Converter', category: 'calculator-tools', categoryName: 'Calculator Tools', url: '/tools/calculator-tools/weight-converter/', description: 'Convert weight units', keywords: ['weight converter', 'kg to lbs'], icon: '⚖️', color: '#10b981' },
    { id: 91, slug: 'temperature-converter', name: 'Temperature Converter', category: 'calculator-tools', categoryName: 'Calculator Tools', url: '/tools/calculator-tools/temperature-converter/', description: 'Convert temperature units', keywords: ['temperature', 'celsius to fahrenheit'], icon: '🌡', color: '#ef4444' },
    { id: 92, slug: 'area-converter', name: 'Area Converter', category: 'calculator-tools', categoryName: 'Calculator Tools', url: '/tools/calculator-tools/area-converter/', description: 'Convert area units', keywords: ['area converter', 'sqft to sqm'], icon: '📐', color: '#06b6d4' },
    { id: 93, slug: 'volume-converter', name: 'Volume Converter', category: 'calculator-tools', categoryName: 'Calculator Tools', url: '/tools/calculator-tools/volume-converter/', description: 'Convert volume units', keywords: ['volume converter', 'liter to gallon'], icon: '🧪', color: '#8b5cf6' },
    { id: 94, slug: 'speed-converter', name: 'Speed Converter', category: 'calculator-tools', categoryName: 'Calculator Tools', url: '/tools/calculator-tools/speed-converter/', description: 'Convert speed units', keywords: ['speed converter', 'kmh to mph'], icon: '🚀', color: '#ec4899' },
    { id: 95, slug: 'data-storage', name: 'Data Storage Converter', category: 'calculator-tools', categoryName: 'Calculator Tools', url: '/tools/calculator-tools/data-storage/', description: 'Convert data storage units', keywords: ['data storage', 'mb to gb'], icon: '💾', color: '#3b82f6' },
    { id: 96, slug: 'time-zone', name: 'Time Zone Converter', category: 'calculator-tools', categoryName: 'Calculator Tools', url: '/tools/calculator-tools/time-zone/', description: 'Convert time zones', keywords: ['time zone', 'timezone converter'], icon: '🌍', color: '#10b981' },
    { id: 97, slug: 'date-difference', name: 'Date Difference Calculator', category: 'calculator-tools', categoryName: 'Calculator Tools', url: '/tools/calculator-tools/date-difference/', description: 'Calculate days between dates', keywords: ['date difference', 'days between'], icon: '📅', color: '#8b5cf6' },
    { id: 98, slug: 'ovulation-calculator', name: 'Ovulation Calculator', category: 'calculator-tools', categoryName: 'Calculator Tools', url: '/tools/calculator-tools/ovulation-calculator/', description: 'Calculate ovulation days', keywords: ['ovulation', 'fertility calculator'], icon: '🌸', color: '#ec4899' },
    { id: 99, slug: 'pregnancy-calculator', name: 'Pregnancy Calculator', category: 'calculator-tools', categoryName: 'Calculator Tools', url: '/tools/calculator-tools/pregnancy-calculator/', description: 'Calculate pregnancy due date', keywords: ['pregnancy', 'due date calculator'], icon: '👶', color: '#f59e0b' },
    { id: 100, slug: 'macro-calculator', name: 'Macro Calculator', category: 'calculator-tools', categoryName: 'Calculator Tools', url: '/tools/calculator-tools/macro-calculator/', description: 'Calculate macronutrient needs', keywords: ['macro', 'macros calculator'], icon: '🥗', color: '#10b981' },

    /* ============================================
       SEO TOOLS — 25 Tools (#101-125)
       ============================================ */
    { id: 101, slug: 'meta-description', name: 'Meta Description Generator', category: 'seo-tools', categoryName: 'SEO Tools', url: '/tools/seo-tools/meta-description/', description: 'Generate SEO meta descriptions', keywords: ['meta description', 'seo description'], icon: '📝', color: '#8b5cf6', trending: true },
    { id: 102, slug: 'serp-preview', name: 'SERP Preview', category: 'seo-tools', categoryName: 'SEO Tools', url: '/tools/seo-tools/serp-preview/', description: 'Preview Google search results', keywords: ['serp preview', 'google preview'], icon: '🔍', color: '#3b82f6' },
    { id: 103, slug: 'keyword-planner', name: 'Keyword Planner', category: 'seo-tools', categoryName: 'SEO Tools', url: '/tools/seo-tools/keyword-planner/', description: 'Plan SEO keywords', keywords: ['keyword planner', 'keyword research'], icon: '🎯', color: '#8b5cf6' },
    { id: 104, slug: 'keyword-density-checker', name: 'Keyword Density Checker', category: 'seo-tools', categoryName: 'SEO Tools', url: '/tools/seo-tools/keyword-density-checker/', description: 'Check keyword density', keywords: ['keyword density', 'seo density'], icon: '📊', color: '#10b981' },
    { id: 105, slug: 'anchor-text', name: 'Anchor Text Analyzer', category: 'seo-tools', categoryName: 'SEO Tools', url: '/tools/seo-tools/anchor-text/', description: 'Analyze anchor text', keywords: ['anchor text', 'link analyzer'], icon: '🔗', color: '#f97316' },
    { id: 106, slug: 'domain-age', name: 'Domain Age Checker', category: 'seo-tools', categoryName: 'SEO Tools', url: '/tools/seo-tools/domain-age/', description: 'Check domain age', keywords: ['domain age', 'domain checker'], icon: '📅', color: '#06b6d4' },
    { id: 107, slug: 'domain-authority', name: 'Domain Authority Checker', category: 'seo-tools', categoryName: 'SEO Tools', url: '/tools/seo-tools/domain-authority/', description: 'Check domain authority', keywords: ['domain authority', 'da checker'], icon: '🏆', color: '#f59e0b' },
    { id: 108, slug: 'page-speed', name: 'Page Speed Checker', category: 'seo-tools', categoryName: 'SEO Tools', url: '/tools/seo-tools/page-speed/', description: 'Check page loading speed', keywords: ['page speed', 'site speed'], icon: '⚡', color: '#3b82f6' },
    { id: 109, slug: 'mobile-friendly', name: 'Mobile Friendly Test', category: 'seo-tools', categoryName: 'SEO Tools', url: '/tools/seo-tools/mobile-friendly/', description: 'Test mobile friendliness', keywords: ['mobile friendly', 'responsive test'], icon: '📱', color: '#10b981' },
    { id: 110, slug: 'open-graph', name: 'Open Graph Generator', category: 'seo-tools', categoryName: 'SEO Tools', url: '/tools/seo-tools/open-graph/', description: 'Generate Open Graph tags', keywords: ['open graph', 'og tags'], icon: '📘', color: '#3b82f6' },
    { id: 111, slug: 'twitter-card', name: 'Twitter Card Generator', category: 'seo-tools', categoryName: 'SEO Tools', url: '/tools/seo-tools/twitter-card/', description: 'Generate Twitter Card tags', keywords: ['twitter card', 'twitter meta'], icon: '🐦', color: '#06b6d4' },
    { id: 112, slug: 'schema-markup', name: 'Schema Markup Generator', category: 'seo-tools', categoryName: 'SEO Tools', url: '/tools/seo-tools/schema-markup/', description: 'Generate schema markup', keywords: ['schema markup', 'structured data'], icon: '🏗', color: '#8b5cf6' },
    { id: 113, slug: 'article-title', name: 'Article Title Generator', category: 'seo-tools', categoryName: 'SEO Tools', url: '/tools/seo-tools/article-title/', description: 'Generate catchy article titles', keywords: ['title generator', 'headline'], icon: '📰', color: '#ec4899' },
    { id: 114, slug: 'blog-idea', name: 'Blog Idea Generator', category: 'seo-tools', categoryName: 'SEO Tools', url: '/tools/seo-tools/blog-idea/', description: 'Generate blog post ideas', keywords: ['blog ideas', 'content ideas'], icon: '💡', color: '#f59e0b' },
    { id: 115, slug: 'youtube-title', name: 'YouTube Title Generator', category: 'seo-tools', categoryName: 'SEO Tools', url: '/tools/seo-tools/youtube-title/', description: 'Generate YouTube titles', keywords: ['youtube title', 'video title'], icon: '▶', color: '#ef4444' },
    { id: 116, slug: 'youtube-description', name: 'YouTube Description Generator', category: 'seo-tools', categoryName: 'SEO Tools', url: '/tools/seo-tools/youtube-description/', description: 'Generate YouTube descriptions', keywords: ['youtube description', 'video description'], icon: '📝', color: '#ef4444' },
    { id: 117, slug: 'youtube-tag', name: 'YouTube Tag Generator', category: 'seo-tools', categoryName: 'SEO Tools', url: '/tools/seo-tools/youtube-tag/', description: 'Generate YouTube tags', keywords: ['youtube tags', 'video tags'], icon: '🏷', color: '#ef4444' },
    { id: 118, slug: 'instagram-hashtag', name: 'Instagram Hashtag Generator', category: 'seo-tools', categoryName: 'SEO Tools', url: '/tools/seo-tools/instagram-hashtag/', description: 'Generate Instagram hashtags', keywords: ['instagram hashtags', 'hashtag generator'], icon: '#️⃣', color: '#ec4899' },
    { id: 119, slug: 'facebook-post', name: 'Facebook Post Generator', category: 'seo-tools', categoryName: 'SEO Tools', url: '/tools/seo-tools/facebook-post/', description: 'Generate Facebook posts', keywords: ['facebook post', 'fb content'], icon: '📘', color: '#3b82f6' },
    { id: 120, slug: 'linkedin-headline', name: 'LinkedIn Headline Generator', category: 'seo-tools', categoryName: 'SEO Tools', url: '/tools/seo-tools/linkedin-headline/', description: 'Generate LinkedIn headlines', keywords: ['linkedin headline', 'linkedin bio'], icon: 'in', color: '#0077b5' },
    { id: 121, slug: 'email-signature', name: 'Email Signature Generator', category: 'seo-tools', categoryName: 'SEO Tools', url: '/tools/seo-tools/email-signature/', description: 'Create email signatures', keywords: ['email signature', 'signature generator'], icon: '✉️', color: '#8b5cf6' },
    { id: 122, slug: 'utm-builder', name: 'UTM Builder', category: 'seo-tools', categoryName: 'SEO Tools', url: '/tools/seo-tools/utm-builder/', description: 'Build UTM tracking URLs', keywords: ['utm builder', 'url tracking'], icon: '🔗', color: '#10b981' },
    { id: 123, slug: 'qr-code-logo', name: 'QR Code with Logo', category: 'seo-tools', categoryName: 'SEO Tools', url: '/tools/seo-tools/qr-code-logo/', description: 'Create QR codes with logo', keywords: ['qr code logo', 'branded qr'], icon: '▦', color: '#3b82f6' },
    { id: 124, slug: 'barcode-generator', name: 'Barcode Generator', category: 'seo-tools', categoryName: 'SEO Tools', url: '/tools/seo-tools/barcode-generator/', description: 'Generate barcodes', keywords: ['barcode', 'barcode generator'], icon: '▥', color: '#1e293b' },
    { id: 125, slug: 'color-palette', name: 'Color Palette Generator', category: 'seo-tools', categoryName: 'SEO Tools', url: '/tools/seo-tools/color-palette/', description: 'Generate color palettes', keywords: ['color palette', 'color scheme'], icon: '🎨', color: '#ec4899' },

    /* ============================================
       SOCIAL TOOLS — 25 Tools (#126-150)
       ============================================ */
    { id: 126, slug: 'youtube-thumbnail', name: 'YouTube Thumbnail Downloader', category: 'social-tools', categoryName: 'Social Tools', url: '/tools/social-tools/youtube-thumbnail/', description: 'Download YouTube thumbnails', keywords: ['youtube thumbnail', 'thumbnail download'], icon: '🖼', color: '#ef4444', trending: true },
    { id: 127, slug: 'youtube-tag-extractor', name: 'YouTube Tag Extractor', category: 'social-tools', categoryName: 'Social Tools', url: '/tools/social-tools/youtube-tag-extractor/', description: 'Extract YouTube video tags', keywords: ['youtube tags', 'tag extractor'], icon: '🏷', color: '#ef4444' },
    { id: 128, slug: 'youtube-channel-id', name: 'YouTube Channel ID Finder', category: 'social-tools', categoryName: 'Social Tools', url: '/tools/social-tools/youtube-channel-id/', description: 'Find YouTube channel ID', keywords: ['channel id', 'youtube id'], icon: '🔍', color: '#ef4444' },
    { id: 129, slug: 'youtube-video-id', name: 'YouTube Video ID Finder', category: 'social-tools', categoryName: 'Social Tools', url: '/tools/social-tools/youtube-video-id/', description: 'Find YouTube video ID', keywords: ['video id', 'youtube id'], icon: '🔍', color: '#ef4444' },
    { id: 130, slug: 'instagram-reels', name: 'Instagram Reels Downloader', category: 'social-tools', categoryName: 'Social Tools', url: '/tools/social-tools/instagram-reels/', description: 'Download Instagram reels', keywords: ['instagram reels', 'reels download'], icon: '📱', color: '#ec4899', trending: true },
    { id: 131, slug: 'instagram-dp', name: 'Instagram DP Downloader', category: 'social-tools', categoryName: 'Social Tools', url: '/tools/social-tools/instagram-dp/', description: 'Download Instagram profile pictures', keywords: ['instagram dp', 'profile download'], icon: '👤', color: '#ec4899' },
    { id: 132, slug: 'instagram-font', name: 'Instagram Font Generator', category: 'social-tools', categoryName: 'Social Tools', url: '/tools/social-tools/instagram-font/', description: 'Generate Instagram bio fonts', keywords: ['instagram font', 'bio fonts'], icon: '𝓐', color: '#ec4899' },
    { id: 133, slug: 'twitter-trends', name: 'Twitter Trends', category: 'social-tools', categoryName: 'Social Tools', url: '/tools/social-tools/twitter-trends/', description: 'Check trending topics on Twitter', keywords: ['twitter trends', 'trending'], icon: '📈', color: '#1e293b' },
    { id: 134, slug: 'twitter-bio', name: 'Twitter Bio Generator', category: 'social-tools', categoryName: 'Social Tools', url: '/tools/social-tools/twitter-bio/', description: 'Generate Twitter bios', keywords: ['twitter bio', 'bio generator'], icon: '𝕏', color: '#1e293b' },
    { id: 135, slug: 'facebook-video', name: 'Facebook Video Downloader', category: 'social-tools', categoryName: 'Social Tools', url: '/tools/social-tools/facebook-video/', description: 'Download Facebook videos', keywords: ['facebook video', 'fb download'], icon: '▶', color: '#3b82f6' },
    { id: 136, slug: 'pinterest-pin', name: 'Pinterest Pin Downloader', category: 'social-tools', categoryName: 'Social Tools', url: '/tools/social-tools/pinterest-pin/', description: 'Download Pinterest pins', keywords: ['pinterest pin', 'pin download'], icon: '📌', color: '#e60023' },
    { id: 137, slug: 'tiktok-video', name: 'TikTok Video Downloader', category: 'social-tools', categoryName: 'Social Tools', url: '/tools/social-tools/tiktok-video/', description: 'Download TikTok videos', keywords: ['tiktok', 'tiktok download'], icon: '♪', color: '#000000' },
    { id: 138, slug: 'whatsapp-link', name: 'WhatsApp Link Generator', category: 'social-tools', categoryName: 'Social Tools', url: '/tools/social-tools/whatsapp-link/', description: 'Create WhatsApp chat links', keywords: ['whatsapp link', 'wa link'], icon: '💬', color: '#25d366' },
    { id: 139, slug: 'whatsapp-dp', name: 'WhatsApp DP Downloader', category: 'social-tools', categoryName: 'Social Tools', url: '/tools/social-tools/whatsapp-dp/', description: 'Download WhatsApp profile pictures', keywords: ['whatsapp dp', 'profile pic'], icon: '👤', color: '#25d366' },
    { id: 140, slug: 'telegram-bio', name: 'Telegram Bio Generator', category: 'social-tools', categoryName: 'Social Tools', url: '/tools/social-tools/telegram-bio/', description: 'Generate Telegram bios', keywords: ['telegram bio', 'bio generator'], icon: '✈', color: '#0088cc' },
    { id: 141, slug: 'discord-emoji', name: 'Discord Emoji Maker', category: 'social-tools', categoryName: 'Social Tools', url: '/tools/social-tools/discord-emoji/', description: 'Create custom Discord emojis', keywords: ['discord emoji', 'emoji maker'], icon: '😀', color: '#5865f2' },
    { id: 142, slug: 'reddit-username', name: 'Reddit Username Generator', category: 'social-tools', categoryName: 'Social Tools', url: '/tools/social-tools/reddit-username/', description: 'Generate Reddit usernames', keywords: ['reddit username', 'username generator'], icon: '👽', color: '#ff4500' },
    { id: 143, slug: 'snapchat-streak', name: 'Snapchat Streak Calculator', category: 'social-tools', categoryName: 'Social Tools', url: '/tools/social-tools/snapchat-streak/', description: 'Calculate Snapchat streak', keywords: ['snapchat streak', 'streak'], icon: '👻', color: '#fffc00' },
    { id: 144, slug: 'social-scheduler', name: 'Social Media Scheduler', category: 'social-tools', categoryName: 'Social Tools', url: '/tools/social-tools/social-scheduler/', description: 'Plan social media posts', keywords: ['social scheduler', 'post scheduler'], icon: '📅', color: '#8b5cf6' },
    { id: 145, slug: 'caption-generator', name: 'Caption Generator', category: 'social-tools', categoryName: 'Social Tools', url: '/tools/social-tools/caption-generator/', description: 'Generate social media captions', keywords: ['caption', 'caption generator'], icon: '💬', color: '#ec4899' },
    { id: 146, slug: 'hashtag-generator', name: 'Hashtag Generator', category: 'social-tools', categoryName: 'Social Tools', url: '/tools/social-tools/hashtag-generator/', description: 'Generate trending hashtags', keywords: ['hashtag', 'hashtag generator'], icon: '#️⃣', color: '#3b82f6', trending: true },
    { id: 147, slug: 'emoji-translator', name: 'Emoji Translator', category: 'social-tools', categoryName: 'Social Tools', url: '/tools/social-tools/emoji-translator/', description: 'Translate text to emojis', keywords: ['emoji translator', 'emoji text'], icon: '😊', color: '#f59e0b' },
    { id: 148, slug: 'emoji-remover', name: 'Emoji Remover', category: 'social-tools', categoryName: 'Social Tools', url: '/tools/social-tools/emoji-remover/', description: 'Remove emojis from text', keywords: ['remove emoji', 'emoji remover'], icon: '🚫', color: '#ef4444' },
    { id: 149, slug: 'hashtag-counter', name: 'Hashtag Counter', category: 'social-tools', categoryName: 'Social Tools', url: '/tools/social-tools/hashtag-counter/', description: 'Count hashtags in text', keywords: ['hashtag counter', 'count hashtags'], icon: '📊', color: '#8b5cf6' },
    { id: 150, slug: 'brand-kit', name: 'Brand Kit Generator', category: 'social-tools', categoryName: 'Social Tools', url: '/tools/social-tools/brand-kit/', description: 'Create brand identity kits', keywords: ['brand kit', 'brand identity'], icon: '🎨', color: '#ec4899' },

    /* ============================================
       UTILITY TOOLS — 50 Tools (#151-200)
       ============================================ */
    { id: 151, slug: 'password-strength', name: 'Password Strength Checker', category: 'utility-tools', categoryName: 'Utility Tools', url: '/tools/utility-tools/password-strength/', description: 'Check password strength', keywords: ['password strength', 'password check'], icon: '🛡', color: '#10b981' },
    { id: 152, slug: 'password-generator', name: 'Password Generator', category: 'utility-tools', categoryName: 'Utility Tools', url: '/tools/utility-tools/password-generator/', description: 'Generate strong and secure passwords', keywords: ['password generator', 'strong password'], icon: '🔒', color: '#8b5cf6', trending: true },
    { id: 153, slug: 'otp-generator', name: 'OTP Generator', category: 'utility-tools', categoryName: 'Utility Tools', url: '/tools/utility-tools/otp-generator/', description: 'Generate random OTPs', keywords: ['otp generator', 'one time password'], icon: '🔢', color: '#3b82f6' },
    { id: 154, slug: 'pin-generator', name: 'PIN Generator', category: 'utility-tools', categoryName: 'Utility Tools', url: '/tools/utility-tools/pin-generator/', description: 'Generate random PINs', keywords: ['pin generator', 'random pin'], icon: '#️⃣', color: '#f97316' },
    { id: 155, slug: 'lottery-number', name: 'Lottery Number Generator', category: 'utility-tools', categoryName: 'Utility Tools', url: '/tools/utility-tools/lottery-number/', description: 'Generate lottery numbers', keywords: ['lottery', 'lucky numbers'], icon: '🎰', color: '#ef4444' },
    { id: 156, slug: 'name-picker', name: 'Random Name Picker', category: 'utility-tools', categoryName: 'Utility Tools', url: '/tools/utility-tools/name-picker/', description: 'Pick a random name from list', keywords: ['name picker', 'random picker'], icon: '🎯', color: '#8b5cf6' },
    { id: 157, slug: 'team-generator', name: 'Team Generator', category: 'utility-tools', categoryName: 'Utility Tools', url: '/tools/utility-tools/team-generator/', description: 'Generate random teams', keywords: ['team generator', 'random teams'], icon: '👥', color: '#3b82f6' },
    { id: 158, slug: 'wheel-names', name: 'Wheel of Names', category: 'utility-tools', categoryName: 'Utility Tools', url: '/tools/utility-tools/wheel-names/', description: 'Spin the wheel to pick names', keywords: ['wheel of names', 'spinner'], icon: '🎡', color: '#ec4899', trending: true },
    { id: 159, slug: 'decision-maker', name: 'Decision Maker', category: 'utility-tools', categoryName: 'Utility Tools', url: '/tools/utility-tools/decision-maker/', description: 'Make random decisions', keywords: ['decision maker', 'random decision'], icon: '🎲', color: '#f59e0b' },
    { id: 160, slug: 'coin-flip', name: 'Coin Flip', category: 'utility-tools', categoryName: 'Utility Tools', url: '/tools/utility-tools/coin-flip/', description: 'Flip a virtual coin', keywords: ['coin flip', 'heads tails'], icon: '🪙', color: '#f59e0b' },
    { id: 161, slug: 'dice-roll', name: 'Dice Roll', category: 'utility-tools', categoryName: 'Utility Tools', url: '/tools/utility-tools/dice-roll/', description: 'Roll virtual dice', keywords: ['dice roll', 'random dice'], icon: '🎲', color: '#ef4444' },
    { id: 162, slug: 'rock-paper-scissors', name: 'Rock Paper Scissors', category: 'utility-tools', categoryName: 'Utility Tools', url: '/tools/utility-tools/rock-paper-scissors/', description: 'Play Rock Paper Scissors', keywords: ['rock paper scissors', 'game'], icon: '✊', color: '#8b5cf6' },
    { id: 163, slug: 'tic-tac-toe', name: 'Tic Tac Toe', category: 'utility-tools', categoryName: 'Utility Tools', url: '/tools/utility-tools/tic-tac-toe/', description: 'Play Tic Tac Toe online', keywords: ['tic tac toe', 'game'], icon: '⭕', color: '#3b82f6' },
    { id: 164, slug: 'memory-game', name: 'Memory Game', category: 'utility-tools', categoryName: 'Utility Tools', url: '/tools/utility-tools/memory-game/', description: 'Play memory card game', keywords: ['memory game', 'card game'], icon: '🧠', color: '#ec4899' },
    { id: 165, slug: 'typing-game', name: 'Typing Game', category: 'utility-tools', categoryName: 'Utility Tools', url: '/tools/utility-tools/typing-game/', description: 'Practice typing speed', keywords: ['typing game', 'typing practice'], icon: '⌨️', color: '#10b981' },
    { id: 166, slug: 'reaction-time', name: 'Reaction Time Test', category: 'utility-tools', categoryName: 'Utility Tools', url: '/tools/utility-tools/reaction-time/', description: 'Test your reaction time', keywords: ['reaction time', 'reflex test'], icon: '⚡', color: '#f97316' },
    { id: 167, slug: 'aim-trainer', name: 'Aim Trainer', category: 'utility-tools', categoryName: 'Utility Tools', url: '/tools/utility-tools/aim-trainer/', description: 'Practice aim for gaming', keywords: ['aim trainer', 'aim practice'], icon: '🎯', color: '#ef4444' },
    { id: 168, slug: 'color-blind', name: 'Color Blind Test', category: 'utility-tools', categoryName: 'Utility Tools', url: '/tools/utility-tools/color-blind/', description: 'Test for color blindness', keywords: ['color blind test', 'ishihara'], icon: '👁', color: '#8b5cf6' },
    { id: 169, slug: 'eye-test', name: 'Eye Test', category: 'utility-tools', categoryName: 'Utility Tools', url: '/tools/utility-tools/eye-test/', description: 'Online eye vision test', keywords: ['eye test', 'vision test'], icon: '👁', color: '#3b82f6' },
    { id: 170, slug: 'hearing-test', name: 'Hearing Test', category: 'utility-tools', categoryName: 'Utility Tools', url: '/tools/utility-tools/hearing-test/', description: 'Test your hearing range', keywords: ['hearing test', 'audio test'], icon: '👂', color: '#f59e0b' },
    { id: 171, slug: 'iq-test', name: 'IQ Test', category: 'utility-tools', categoryName: 'Utility Tools', url: '/tools/utility-tools/iq-test/', description: 'Take an online IQ test', keywords: ['iq test', 'intelligence test'], icon: '🧠', color: '#8b5cf6' },
    { id: 172, slug: 'personality-test', name: 'Personality Test', category: 'utility-tools', categoryName: 'Utility Tools', url: '/tools/utility-tools/personality-test/', description: 'Discover your personality type', keywords: ['personality test', 'mbti'], icon: '🧩', color: '#ec4899' },
    { id: 173, slug: 'love-calculator', name: 'Love Calculator', category: 'utility-tools', categoryName: 'Utility Tools', url: '/tools/utility-tools/love-calculator/', description: 'Calculate love compatibility', keywords: ['love calculator', 'love test'], icon: '❤️', color: '#ef4444', trending: true },
    { id: 174, slug: 'friendship-test', name: 'Friendship Test', category: 'utility-tools', categoryName: 'Utility Tools', url: '/tools/utility-tools/friendship-test/', description: 'Test friendship compatibility', keywords: ['friendship test', 'friend calculator'], icon: '🤝', color: '#10b981' },
    { id: 175, slug: 'mood-tracker', name: 'Mood Tracker', category: 'utility-tools', categoryName: 'Utility Tools', url: '/tools/utility-tools/mood-tracker/', description: 'Track your daily mood', keywords: ['mood tracker', 'mood diary'], icon: '😊', color: '#f59e0b' },
    { id: 176, slug: 'habit-tracker', name: 'Habit Tracker', category: 'utility-tools', categoryName: 'Utility Tools', url: '/tools/utility-tools/habit-tracker/', description: 'Track daily habits', keywords: ['habit tracker', 'habit builder'], icon: '✅', color: '#10b981' },
    { id: 177, slug: 'goal-tracker', name: 'Goal Tracker', category: 'utility-tools', categoryName: 'Utility Tools', url: '/tools/utility-tools/goal-tracker/', description: 'Track your goals', keywords: ['goal tracker', 'goal setting'], icon: '🎯', color: '#8b5cf6' },
    { id: 178, slug: 'todo-list', name: 'To-Do List', category: 'utility-tools', categoryName: 'Utility Tools', url: '/tools/utility-tools/todo-list/', description: 'Simple to-do list', keywords: ['todo list', 'task list'], icon: '📋', color: '#3b82f6' },
    { id: 179, slug: 'daily-quote', name: 'Daily Quote', category: 'utility-tools', categoryName: 'Utility Tools', url: '/tools/utility-tools/daily-quote/', description: 'Get a daily motivational quote', keywords: ['daily quote', 'motivation'], icon: '💭', color: '#f59e0b' },
    { id: 180, slug: 'affirmation-generator', name: 'Affirmation Generator', category: 'utility-tools', categoryName: 'Utility Tools', url: '/tools/utility-tools/affirmation-generator/', description: 'Generate positive affirmations', keywords: ['affirmation', 'positive quotes'], icon: '✨', color: '#ec4899' },
    { id: 181, slug: 'manifestation-journal', name: 'Manifestation Journal', category: 'utility-tools', categoryName: 'Utility Tools', url: '/tools/utility-tools/manifestation-journal/', description: 'Digital manifestation journal', keywords: ['manifestation', 'journal'], icon: '🌟', color: '#8b5cf6' },
    { id: 182, slug: 'gratitude-journal', name: 'Gratitude Journal', category: 'utility-tools', categoryName: 'Utility Tools', url: '/tools/utility-tools/gratitude-journal/', description: 'Daily gratitude journal', keywords: ['gratitude', 'journal'], icon: '🙏', color: '#10b981' },
    { id: 183, slug: 'vision-board', name: 'Vision Board', category: 'utility-tools', categoryName: 'Utility Tools', url: '/tools/utility-tools/vision-board/', description: 'Create digital vision boards', keywords: ['vision board', 'dream board'], icon: '🖼', color: '#ec4899' },
    { id: 184, slug: 'dream-journal', name: 'Dream Journal', category: 'utility-tools', categoryName: 'Utility Tools', url: '/tools/utility-tools/dream-journal/', description: 'Log and analyze dreams', keywords: ['dream journal', 'dream log'], icon: '🌙', color: '#8b5cf6' },
    { id: 185, slug: 'sleep-cycle', name: 'Sleep Cycle Calculator', category: 'utility-tools', categoryName: 'Utility Tools', url: '/tools/utility-tools/sleep-cycle/', description: 'Calculate best sleep times', keywords: ['sleep cycle', 'sleep calculator'], icon: '😴', color: '#3b82f6' },
    { id: 186, slug: 'wake-up-time', name: 'Wake Up Time Calculator', category: 'utility-tools', categoryName: 'Utility Tools', url: '/tools/utility-tools/wake-up-time/', description: 'Find best wake up times', keywords: ['wake up time', 'sleep'], icon: '⏰', color: '#f97316' },
    { id: 187, slug: 'water-intake', name: 'Water Intake Calculator', category: 'utility-tools', categoryName: 'Utility Tools', url: '/tools/utility-tools/water-intake/', description: 'Calculate daily water intake', keywords: ['water intake', 'hydration'], icon: '💧', color: '#06b6d4' },
    { id: 188, slug: 'blood-pressure', name: 'Blood Pressure Tracker', category: 'utility-tools', categoryName: 'Utility Tools', url: '/tools/utility-tools/blood-pressure/', description: 'Track blood pressure readings', keywords: ['blood pressure', 'bp tracker'], icon: '🩺', color: '#ef4444' },
    { id: 189, slug: 'heart-rate', name: 'Heart Rate Calculator', category: 'utility-tools', categoryName: 'Utility Tools', url: '/tools/utility-tools/heart-rate/', description: 'Calculate target heart rate', keywords: ['heart rate', 'target hr'], icon: '❤️', color: '#ef4444' },
    { id: 190, slug: 'steps-km', name: 'Steps to KM Converter', category: 'utility-tools', categoryName: 'Utility Tools', url: '/tools/utility-tools/steps-km/', description: 'Convert steps to kilometers', keywords: ['steps to km', 'step converter'], icon: '👣', color: '#10b981' },
    { id: 191, slug: 'running-pace', name: 'Running Pace Calculator', category: 'utility-tools', categoryName: 'Utility Tools', url: '/tools/utility-tools/running-pace/', description: 'Calculate running pace', keywords: ['running pace', 'pace calculator'], icon: '🏃', color: '#f97316' },
    { id: 192, slug: 'yoga-pose', name: 'Yoga Pose Guide', category: 'utility-tools', categoryName: 'Utility Tools', url: '/tools/utility-tools/yoga-pose/', description: 'Learn yoga poses', keywords: ['yoga pose', 'yoga guide'], icon: '🧘', color: '#8b5cf6' },
    { id: 193, slug: 'workout-plan', name: 'Workout Plan Generator', category: 'utility-tools', categoryName: 'Utility Tools', url: '/tools/utility-tools/workout-plan/', description: 'Generate workout plans', keywords: ['workout plan', 'exercise'], icon: '💪', color: '#ef4444' },
    { id: 194, slug: 'diet-plan', name: 'Diet Plan Generator', category: 'utility-tools', categoryName: 'Utility Tools', url: '/tools/utility-tools/diet-plan/', description: 'Generate diet plans', keywords: ['diet plan', 'nutrition'], icon: '🥗', color: '#10b981' },
    { id: 195, slug: 'recipe-calorie', name: 'Recipe Calorie Calculator', category: 'utility-tools', categoryName: 'Utility Tools', url: '/tools/utility-tools/recipe-calorie/', description: 'Calculate recipe calories', keywords: ['recipe calorie', 'food calorie'], icon: '🍽', color: '#f59e0b' },
    { id: 196, slug: 'grocery-list', name: 'Grocery List Maker', category: 'utility-tools', categoryName: 'Utility Tools', url: '/tools/utility-tools/grocery-list/', description: 'Create grocery lists', keywords: ['grocery list', 'shopping list'], icon: '🛒', color: '#10b981' },
    { id: 197, slug: 'birthday-countdown', name: 'Birthday Countdown', category: 'utility-tools', categoryName: 'Utility Tools', url: '/tools/utility-tools/birthday-countdown/', description: 'Countdown to birthdays', keywords: ['birthday', 'countdown'], icon: '🎂', color: '#ec4899' },
    { id: 198, slug: 'event-countdown', name: 'Event Countdown', category: 'utility-tools', categoryName: 'Utility Tools', url: '/tools/utility-tools/event-countdown/', description: 'Countdown to events', keywords: ['event countdown', 'timer'], icon: '📅', color: '#3b82f6' },
    { id: 199, slug: 'stopwatch', name: 'Stopwatch', category: 'utility-tools', categoryName: 'Utility Tools', url: '/tools/utility-tools/stopwatch/', description: 'Online stopwatch', keywords: ['stopwatch', 'timer'], icon: '⏱', color: '#f59e0b' },
    { id: 200, slug: 'world-clock', name: 'World Clock', category: 'utility-tools', categoryName: 'Utility Tools', url: '/tools/utility-tools/world-clock/', description: 'Check time in any city', keywords: ['world clock', 'time zones'], icon: '🕐', color: '#06b6d4' },

    /* ============================================
       PDF TOOLS — 100 Tools (#201-300)
       ============================================ */
    /* --- Convert PDF (15) --- */
    { id: 201, slug: 'jpg-to-pdf', name: 'JPG to PDF', category: 'pdf-tools', categoryName: 'PDF Tools', subcategory: 'convert-pdf', url: '/tools/pdf-tools/convert-pdf/jpg-to-pdf/', description: 'Convert JPG images to PDF', keywords: ['jpg to pdf', 'image to pdf'], icon: '📕', color: '#ef4444', trending: true },
    { id: 202, slug: 'png-to-pdf', name: 'PNG to PDF', category: 'pdf-tools', categoryName: 'PDF Tools', subcategory: 'convert-pdf', url: '/tools/pdf-tools/convert-pdf/png-to-pdf/', description: 'Convert PNG images to PDF', keywords: ['png to pdf', 'image to pdf'], icon: '📕', color: '#ef4444' },
    { id: 203, slug: 'webp-to-pdf', name: 'WebP to PDF', category: 'pdf-tools', categoryName: 'PDF Tools', subcategory: 'convert-pdf', url: '/tools/pdf-tools/convert-pdf/webp-to-pdf/', description: 'Convert WebP images to PDF', keywords: ['webp to pdf', 'image to pdf'], icon: '📕', color: '#ef4444' },
    { id: 204, slug: 'bmp-to-pdf', name: 'BMP to PDF', category: 'pdf-tools', categoryName: 'PDF Tools', subcategory: 'convert-pdf', url: '/tools/pdf-tools/convert-pdf/bmp-to-pdf/', description: 'Convert BMP images to PDF', keywords: ['bmp to pdf', 'image to pdf'], icon: '📕', color: '#ef4444' },
    { id: 205, slug: 'gif-to-pdf', name: 'GIF to PDF', category: 'pdf-tools', categoryName: 'PDF Tools', subcategory: 'convert-pdf', url: '/tools/pdf-tools/convert-pdf/gif-to-pdf/', description: 'Convert GIF images to PDF', keywords: ['gif to pdf', 'image to pdf'], icon: '📕', color: '#ef4444' },
    { id: 206, slug: 'multiple-images', name: 'Multiple Images to PDF', category: 'pdf-tools', categoryName: 'PDF Tools', subcategory: 'convert-pdf', url: '/tools/pdf-tools/convert-pdf/multiple-images/', description: 'Combine multiple images into PDF', keywords: ['images to pdf', 'merge images'], icon: '📚', color: '#ef4444' },
    { id: 207, slug: 'word-to-pdf', name: 'Word to PDF', category: 'pdf-tools', categoryName: 'PDF Tools', subcategory: 'convert-pdf', url: '/tools/pdf-tools/convert-pdf/word-to-pdf/', description: 'Convert Word documents to PDF', keywords: ['word to pdf', 'docx to pdf'], icon: 'W', color: '#3b82f6', trending: true },
    { id: 208, slug: 'text-to-pdf', name: 'Text to PDF', category: 'pdf-tools', categoryName: 'PDF Tools', subcategory: 'convert-pdf', url: '/tools/pdf-tools/convert-pdf/text-to-pdf/', description: 'Convert plain text to PDF', keywords: ['text to pdf', 'txt to pdf'], icon: '📄', color: '#10b981' },
    { id: 209, slug: 'html-to-pdf', name: 'HTML to PDF', category: 'pdf-tools', categoryName: 'PDF Tools', subcategory: 'convert-pdf', url: '/tools/pdf-tools/convert-pdf/html-to-pdf/', description: 'Convert HTML pages to PDF', keywords: ['html to pdf', 'web to pdf'], icon: '</>', color: '#f97316' },
    { id: 210, slug: 'pdf-to-jpg', name: 'PDF to JPG', category: 'pdf-tools', categoryName: 'PDF Tools', subcategory: 'convert-pdf', url: '/tools/pdf-tools/convert-pdf/pdf-to-jpg/', description: 'Convert PDF pages to JPG images', keywords: ['pdf to jpg', 'pdf to image'], icon: '🖼', color: '#10b981' },
    { id: 211, slug: 'pdf-to-png', name: 'PDF to PNG', category: 'pdf-tools', categoryName: 'PDF Tools', subcategory: 'convert-pdf', url: '/tools/pdf-tools/convert-pdf/pdf-to-png/', description: 'Convert PDF pages to PNG images', keywords: ['pdf to png', 'pdf to image'], icon: '🖼', color: '#10b981' },
    { id: 212, slug: 'pdf-to-base64', name: 'PDF to Base64', category: 'pdf-tools', categoryName: 'PDF Tools', subcategory: 'convert-pdf', url: '/tools/pdf-tools/convert-pdf/pdf-to-base64/', description: 'Convert PDF to Base64 string', keywords: ['pdf to base64', 'encode pdf'], icon: '🔤', color: '#8b5cf6' },
    { id: 213, slug: 'base64-to-pdf', name: 'Base64 to PDF', category: 'pdf-tools', categoryName: 'PDF Tools', subcategory: 'convert-pdf', url: '/tools/pdf-tools/convert-pdf/base64-to-pdf/', description: 'Convert Base64 string to PDF', keywords: ['base64 to pdf', 'decode pdf'], icon: '🔓', color: '#8b5cf6' },
    { id: 214, slug: 'pdf-to-grayscale', name: 'PDF to Grayscale', category: 'pdf-tools', categoryName: 'PDF Tools', subcategory: 'convert-pdf', url: '/tools/pdf-tools/convert-pdf/pdf-to-grayscale/', description: 'Convert color PDF to grayscale', keywords: ['pdf grayscale', 'bw pdf'], icon: '⚫', color: '#6b7280' },
    { id: 215, slug: 'pdf-to-pdfa', name: 'PDF to PDF/A', category: 'pdf-tools', categoryName: 'PDF Tools', subcategory: 'convert-pdf', url: '/tools/pdf-tools/convert-pdf/pdf-to-pdfa/', description: 'Convert PDF to PDF/A archive format', keywords: ['pdfa', 'archive pdf'], icon: '📚', color: '#3b82f6' },

    /* --- Organize PDF (20) --- */
    { id: 216, slug: 'merge-pdf', name: 'Merge PDF', category: 'pdf-tools', categoryName: 'PDF Tools', subcategory: 'organize-pdf', url: '/tools/pdf-tools/organize-pdf/merge-pdf/', description: 'Combine multiple PDFs into one file', keywords: ['merge pdf', 'combine pdf', 'join pdf'], icon: '📚', color: '#3b82f6', trending: true },
    { id: 217, slug: 'split-pdf', name: 'Split PDF', category: 'pdf-tools', categoryName: 'PDF Tools', subcategory: 'organize-pdf', url: '/tools/pdf-tools/organize-pdf/split-pdf/', description: 'Split a PDF into multiple files', keywords: ['split pdf', 'separate pdf'], icon: '✂️', color: '#f97316' },
    { id: 218, slug: 'extract-pages', name: 'Extract PDF Pages', category: 'pdf-tools', categoryName: 'PDF Tools', subcategory: 'organize-pdf', url: '/tools/pdf-tools/organize-pdf/extract-pages/', description: 'Extract specific pages from PDF', keywords: ['extract pages', 'pdf pages'], icon: '📄', color: '#10b981' },
    { id: 219, slug: 'delete-pages', name: 'Delete PDF Pages', category: 'pdf-tools', categoryName: 'PDF Tools', subcategory: 'organize-pdf', url: '/tools/pdf-tools/organize-pdf/delete-pages/', description: 'Delete pages from PDF', keywords: ['delete pdf pages', 'remove pages'], icon: '🗑', color: '#ef4444' },
    { id: 220, slug: 'rotate-pdf', name: 'Rotate PDF', category: 'pdf-tools', categoryName: 'PDF Tools', subcategory: 'organize-pdf', url: '/tools/pdf-tools/organize-pdf/rotate-pdf/', description: 'Rotate PDF pages', keywords: ['rotate pdf', 'turn pdf'], icon: '🔁', color: '#8b5cf6' },
    { id: 221, slug: 'reverse-pdf', name: 'Reverse PDF', category: 'pdf-tools', categoryName: 'PDF Tools', subcategory: 'organize-pdf', url: '/tools/pdf-tools/organize-pdf/reverse-pdf/', description: 'Reverse PDF page order', keywords: ['reverse pdf', 'flip pdf'], icon: '🔃', color: '#06b6d4' },
    { id: 222, slug: 'sort-pdf', name: 'Sort PDF Pages', category: 'pdf-tools', categoryName: 'PDF Tools', subcategory: 'organize-pdf', url: '/tools/pdf-tools/organize-pdf/sort-pdf/', description: 'Sort PDF pages', keywords: ['sort pdf', 'organize pdf'], icon: '🔢', color: '#f59e0b' },
    { id: 223, slug: 'page-numbers', name: 'Add Page Numbers to PDF', category: 'pdf-tools', categoryName: 'PDF Tools', subcategory: 'organize-pdf', url: '/tools/pdf-tools/organize-pdf/page-numbers/', description: 'Add page numbers to PDF', keywords: ['page numbers', 'number pdf'], icon: '#️⃣', color: '#3b82f6' },
    { id: 224, slug: 'watermark-pdf', name: 'Watermark PDF', category: 'pdf-tools', categoryName: 'PDF Tools', subcategory: 'organize-pdf', url: '/tools/pdf-tools/organize-pdf/watermark-pdf/', description: 'Add watermark to PDF', keywords: ['watermark pdf', 'pdf watermark'], icon: '💧', color: '#06b6d4' },
    { id: 225, slug: 'image-stamp', name: 'Add Image Stamp to PDF', category: 'pdf-tools', categoryName: 'PDF Tools', subcategory: 'organize-pdf', url: '/tools/pdf-tools/organize-pdf/image-stamp/', description: 'Add image stamps to PDF', keywords: ['image stamp', 'pdf stamp'], icon: '🖼', color: '#ec4899' },
    { id: 226, slug: 'remove-pages', name: 'Remove PDF Pages', category: 'pdf-tools', categoryName: 'PDF Tools', subcategory: 'organize-pdf', url: '/tools/pdf-tools/organize-pdf/remove-pages/', description: 'Remove specific pages from PDF', keywords: ['remove pages', 'delete pages'], icon: '🗑', color: '#ef4444' },
    { id: 227, slug: 'page-size', name: 'Change PDF Page Size', category: 'pdf-tools', categoryName: 'PDF Tools', subcategory: 'organize-pdf', url: '/tools/pdf-tools/organize-pdf/page-size/', description: 'Change PDF page size', keywords: ['pdf page size', 'resize pdf'], icon: '📐', color: '#8b5cf6' },
    { id: 228, slug: 'crop-pdf', name: 'Crop PDF', category: 'pdf-tools', categoryName: 'PDF Tools', subcategory: 'organize-pdf', url: '/tools/pdf-tools/organize-pdf/crop-pdf/', description: 'Crop PDF pages', keywords: ['crop pdf', 'trim pdf'], icon: '✂️', color: '#f97316' },
    { id: 229, slug: 'page-counter', name: 'PDF Page Counter', category: 'pdf-tools', categoryName: 'PDF Tools', subcategory: 'organize-pdf', url: '/tools/pdf-tools/organize-pdf/page-counter/', description: 'Count pages in a PDF', keywords: ['pdf page count', 'count pages'], icon: '🔢', color: '#3b82f6' },
    { id: 230, slug: 'pdf-reader', name: 'PDF Reader', category: 'pdf-tools', categoryName: 'PDF Tools', subcategory: 'organize-pdf', url: '/tools/pdf-tools/organize-pdf/pdf-reader/', description: 'Read PDF files online', keywords: ['pdf reader', 'view pdf'], icon: '📖', color: '#10b981', trending: true },
    { id: 231, slug: 'thumbnail-generator', name: 'PDF Thumbnail Generator', category: 'pdf-tools', categoryName: 'PDF Tools', subcategory: 'organize-pdf', url: '/tools/pdf-tools/organize-pdf/thumbnail-generator/', description: 'Generate PDF thumbnails', keywords: ['pdf thumbnail', 'preview pdf'], icon: '🖼', color: '#ec4899' },
    { id: 232, slug: 'bookmark-viewer', name: 'PDF Bookmark Viewer', category: 'pdf-tools', categoryName: 'PDF Tools', subcategory: 'organize-pdf', url: '/tools/pdf-tools/organize-pdf/bookmark-viewer/', description: 'View PDF bookmarks', keywords: ['pdf bookmarks', 'outline'], icon: '🔖', color: '#f59e0b' },
    { id: 233, slug: 'attachment-remover', name: 'Remove PDF Attachments', category: 'pdf-tools', categoryName: 'PDF Tools', subcategory: 'organize-pdf', url: '/tools/pdf-tools/organize-pdf/attachment-remover/', description: 'Remove embedded attachments', keywords: ['pdf attachments', 'remove files'], icon: '📎', color: '#6b7280' },
    { id: 234, slug: 'duplicate-remover', name: 'Remove Duplicate PDF Pages', category: 'pdf-tools', categoryName: 'PDF Tools', subcategory: 'organize-pdf', url: '/tools/pdf-tools/organize-pdf/duplicate-remover/', description: 'Remove duplicate pages from PDF', keywords: ['duplicate pages', 'remove duplicates'], icon: '🔍', color: '#8b5cf6' },
    { id: 235, slug: 'batch-rotator', name: 'Batch Rotate PDF', category: 'pdf-tools', categoryName: 'PDF Tools', subcategory: 'organize-pdf', url: '/tools/pdf-tools/organize-pdf/batch-rotator/', description: 'Rotate multiple PDFs at once', keywords: ['batch rotate', 'rotate all'], icon: '🔄', color: '#06b6d4' },

    /* --- Security PDF (15) --- */
    { id: 236, slug: 'protect-pdf', name: 'Protect PDF', category: 'pdf-tools', categoryName: 'PDF Tools', subcategory: 'security-pdf', url: '/tools/pdf-tools/security-pdf/protect-pdf/', description: 'Add password protection to PDF', keywords: ['protect pdf', 'password pdf'], icon: '🔒', color: '#10b981' },
    { id: 237, slug: 'unlock-pdf', name: 'Unlock PDF', category: 'pdf-tools', categoryName: 'PDF Tools', subcategory: 'security-pdf', url: '/tools/pdf-tools/security-pdf/unlock-pdf/', description: 'Remove password from PDF', keywords: ['unlock pdf', 'remove password'], icon: '🔓', color: '#3b82f6', trending: true },
    { id: 238, slug: 'permission-remover', name: 'Remove PDF Restrictions', category: 'pdf-tools', categoryName: 'PDF Tools', subcategory: 'security-pdf', url: '/tools/pdf-tools/security-pdf/permission-remover/', description: 'Remove PDF permissions', keywords: ['pdf permissions', 'unlock'], icon: '🔓', color: '#f59e0b' },
    { id: 239, slug: 'flatten-pdf', name: 'Flatten PDF', category: 'pdf-tools', categoryName: 'PDF Tools', subcategory: 'security-pdf', url: '/tools/pdf-tools/security-pdf/flatten-pdf/', description: 'Flatten PDF form fields', keywords: ['flatten pdf', 'merge layers'], icon: '📄', color: '#8b5cf6' },
    { id: 240, slug: 'redaction', name: 'PDF Redaction', category: 'pdf-tools', categoryName: 'PDF Tools', subcategory: 'security-pdf', url: '/tools/pdf-tools/security-pdf/redaction/', description: 'Redact sensitive info from PDF', keywords: ['redact pdf', 'hide text'], icon: '⬛', color: '#1e293b' },
    { id: 241, slug: 'add-signature', name: 'Add Signature to PDF', category: 'pdf-tools', categoryName: 'PDF Tools', subcategory: 'security-pdf', url: '/tools/pdf-tools/security-pdf/add-signature/', description: 'Add digital signature to PDF', keywords: ['pdf signature', 'sign pdf'], icon: '✍️', color: '#3b82f6' },
    { id: 242, slug: 'text-extractor', name: 'PDF Text Extractor', category: 'pdf-tools', categoryName: 'PDF Tools', subcategory: 'security-pdf', url: '/tools/pdf-tools/security-pdf/text-extractor/', description: 'Extract text from PDF', keywords: ['extract text', 'pdf text'], icon: '📝', color: '#10b981' },
    { id: 243, slug: 'metadata-viewer', name: 'PDF Metadata Viewer', category: 'pdf-tools', categoryName: 'PDF Tools', subcategory: 'security-pdf', url: '/tools/pdf-tools/security-pdf/metadata-viewer/', description: 'View PDF metadata', keywords: ['pdf metadata', 'pdf info'], icon: 'ℹ️', color: '#06b6d4' },
    { id: 244, slug: 'metadata-editor', name: 'PDF Metadata Editor', category: 'pdf-tools', categoryName: 'PDF Tools', subcategory: 'security-pdf', url: '/tools/pdf-tools/security-pdf/metadata-editor/', description: 'Edit PDF metadata', keywords: ['edit pdf metadata', 'pdf properties'], icon: '✏️', color: '#8b5cf6' },
    { id: 245, slug: 'metadata-remover', name: 'Remove PDF Metadata', category: 'pdf-tools', categoryName: 'PDF Tools', subcategory: 'security-pdf', url: '/tools/pdf-tools/security-pdf/metadata-remover/', description: 'Remove metadata from PDF', keywords: ['remove metadata', 'clean pdf'], icon: '🗑', color: '#ef4444' },
    { id: 246, slug: 'watermark-remover', name: 'Remove PDF Watermark', category: 'pdf-tools', categoryName: 'PDF Tools', subcategory: 'security-pdf', url: '/tools/pdf-tools/security-pdf/watermark-remover/', description: 'Remove watermark from PDF', keywords: ['remove watermark', 'clean pdf'], icon: '🚫', color: '#f97316' },
    { id: 247, slug: 'encryption-checker', name: 'PDF Encryption Checker', category: 'pdf-tools', categoryName: 'PDF Tools', subcategory: 'security-pdf', url: '/tools/pdf-tools/security-pdf/encryption-checker/', description: 'Check PDF encryption status', keywords: ['pdf encryption', 'check security'], icon: '🔍', color: '#3b82f6' },
    { id: 248, slug: 'digital-signature', name: 'Digital Signature Verifier', category: 'pdf-tools', categoryName: 'PDF Tools', subcategory: 'security-pdf', url: '/tools/pdf-tools/security-pdf/digital-signature/', description: 'Verify digital signatures', keywords: ['verify signature', 'digital sign'], icon: '✓', color: '#10b981' },
    { id: 249, slug: 'anonymizer', name: 'PDF Anonymizer', category: 'pdf-tools', categoryName: 'PDF Tools', subcategory: 'security-pdf', url: '/tools/pdf-tools/security-pdf/anonymizer/', description: 'Anonymize PDF documents', keywords: ['anonymize pdf', 'remove info'], icon: '🕵', color: '#1e293b' },
    { id: 250, slug: 'secure-sharer', name: 'Secure PDF Sharer', category: 'pdf-tools', categoryName: 'PDF Tools', subcategory: 'security-pdf', url: '/tools/pdf-tools/security-pdf/secure-sharer/', description: 'Share PDFs securely', keywords: ['share pdf', 'secure share'], icon: '🔐', color: '#8b5cf6' },

    /* --- Visual PDF (15) --- */
    { id: 251, slug: 'compress-pdf', name: 'Compress PDF', category: 'pdf-tools', categoryName: 'PDF Tools', subcategory: 'visual-pdf', url: '/tools/pdf-tools/visual-pdf/compress-pdf/', description: 'Reduce PDF file size', keywords: ['compress pdf', 'reduce pdf size'], icon: '📉', color: '#10b981', trending: true },
    { id: 252, slug: 'repair-pdf', name: 'Repair PDF', category: 'pdf-tools', categoryName: 'PDF Tools', subcategory: 'visual-pdf', url: '/tools/pdf-tools/visual-pdf/repair-pdf/', description: 'Repair corrupted PDF files', keywords: ['repair pdf', 'fix pdf'], icon: '🔧', color: '#f97316' },
    { id: 253, slug: 'optimizer-pdf', name: 'PDF Optimizer', category: 'pdf-tools', categoryName: 'PDF Tools', subcategory: 'visual-pdf', url: '/tools/pdf-tools/visual-pdf/optimizer-pdf/', description: 'Optimize PDF for web', keywords: ['optimize pdf', 'pdf web'], icon: '⚡', color: '#3b82f6' },
    { id: 254, slug: 'contrast-booster', name: 'PDF Contrast Booster', category: 'pdf-tools', categoryName: 'PDF Tools', subcategory: 'visual-pdf', url: '/tools/pdf-tools/visual-pdf/contrast-booster/', description: 'Increase PDF contrast', keywords: ['pdf contrast', 'enhance pdf'], icon: '◐', color: '#1e293b' },
    { id: 255, slug: 'invert-colors', name: 'Invert PDF Colors', category: 'pdf-tools', categoryName: 'PDF Tools', subcategory: 'visual-pdf', url: '/tools/pdf-tools/visual-pdf/invert-colors/', description: 'Invert colors in PDF', keywords: ['invert pdf', 'dark pdf'], icon: '🌗', color: '#8b5cf6' },
    { id: 256, slug: 'bw-converter', name: 'Convert PDF to B&W', category: 'pdf-tools', categoryName: 'PDF Tools', subcategory: 'visual-pdf', url: '/tools/pdf-tools/visual-pdf/bw-converter/', description: 'Convert PDF to black and white', keywords: ['bw pdf', 'grayscale pdf'], icon: '⚫', color: '#6b7280' },
    { id: 257, slug: 'crop-marks', name: 'Add Crop Marks to PDF', category: 'pdf-tools', categoryName: 'PDF Tools', subcategory: 'visual-pdf', url: '/tools/pdf-tools/visual-pdf/crop-marks/', description: 'Add crop marks for printing', keywords: ['crop marks', 'print marks'], icon: '✂️', color: '#f97316' },
    { id: 258, slug: 'remove-crop-marks', name: 'Remove PDF Crop Marks', category: 'pdf-tools', categoryName: 'PDF Tools', subcategory: 'visual-pdf', url: '/tools/pdf-tools/visual-pdf/remove-crop-marks/', description: 'Remove crop marks from PDF', keywords: ['remove crop marks', 'clean pdf'], icon: '🚫', color: '#ef4444' },
    { id: 259, slug: 'highlight-text', name: 'Highlight PDF Text', category: 'pdf-tools', categoryName: 'PDF Tools', subcategory: 'visual-pdf', url: '/tools/pdf-tools/visual-pdf/highlight-text/', description: 'Highlight text in PDF', keywords: ['highlight pdf', 'mark text'], icon: '🖍', color: '#f59e0b' },
    { id: 260, slug: 'underline-text', name: 'Underline PDF Text', category: 'pdf-tools', categoryName: 'PDF Tools', subcategory: 'visual-pdf', url: '/tools/pdf-tools/visual-pdf/underline-text/', description: 'Underline text in PDF', keywords: ['underline pdf', 'mark text'], icon: '⎁', color: '#3b82f6' },
    { id: 261, slug: 'strikethrough', name: 'Strikethrough PDF Text', category: 'pdf-tools', categoryName: 'PDF Tools', subcategory: 'visual-pdf', url: '/tools/pdf-tools/visual-pdf/strikethrough/', description: 'Add strikethrough to PDF text', keywords: ['strikethrough pdf', 'cross out'], icon: '⎄', color: '#ef4444' },
    { id: 262, slug: 'annotate-pdf', name: 'Annotate PDF', category: 'pdf-tools', categoryName: 'PDF Tools', subcategory: 'visual-pdf', url: '/tools/pdf-tools/visual-pdf/annotate-pdf/', description: 'Add annotations to PDF', keywords: ['annotate pdf', 'comment pdf'], icon: '💬', color: '#8b5cf6' },
    { id: 263, slug: 'page-transition', name: 'PDF Page Transition', category: 'pdf-tools', categoryName: 'PDF Tools', subcategory: 'visual-pdf', url: '/tools/pdf-tools/visual-pdf/page-transition/', description: 'Add page transitions to PDF', keywords: ['pdf transition', 'page effect'], icon: '✨', color: '#ec4899' },
    { id: 264, slug: 'flip-effect', name: 'PDF Flip Effect', category: 'pdf-tools', categoryName: 'PDF Tools', subcategory: 'visual-pdf', url: '/tools/pdf-tools/visual-pdf/flip-effect/', description: 'Add flip effect to PDF', keywords: ['flip effect', 'page turn'], icon: '📖', color: '#f59e0b' },
    { id: 265, slug: 'print-checker', name: 'PDF Print Checker', category: 'pdf-tools', categoryName: 'PDF Tools', subcategory: 'visual-pdf', url: '/tools/pdf-tools/visual-pdf/print-checker/', description: 'Check PDF print readiness', keywords: ['print check', 'print pdf'], icon: '🖨', color: '#3b82f6' },

    /* --- Form PDF (15) --- */
    { id: 266, slug: 'create-form', name: 'Create PDF Form', category: 'pdf-tools', categoryName: 'PDF Tools', subcategory: 'form-pdf', url: '/tools/pdf-tools/form-pdf/create-form/', description: 'Create fillable PDF forms', keywords: ['pdf form', 'create form'], icon: '📝', color: '#8b5cf6' },
    { id: 267, slug: 'form-filler', name: 'Fill PDF Form', category: 'pdf-tools', categoryName: 'PDF Tools', subcategory: 'form-pdf', url: '/tools/pdf-tools/form-pdf/form-filler/', description: 'Fill PDF forms online', keywords: ['fill pdf', 'form filler'], icon: '✍️', color: '#3b82f6' },
    { id: 268, slug: 'form-data', name: 'Extract PDF Form Data', category: 'pdf-tools', categoryName: 'PDF Tools', subcategory: 'form-pdf', url: '/tools/pdf-tools/form-pdf/form-data/', description: 'Extract form data from PDF', keywords: ['pdf form data', 'extract form'], icon: '📊', color: '#10b981' },
    { id: 269, slug: 'table-extractor', name: 'PDF Table Extractor', category: 'pdf-tools', categoryName: 'PDF Tools', subcategory: 'form-pdf', url: '/tools/pdf-tools/form-pdf/table-extractor/', description: 'Extract tables from PDF', keywords: ['pdf table', 'extract table'], icon: '📋', color: '#f97316' },
    { id: 270, slug: 'pdf-to-excel', name: 'PDF to Excel', category: 'pdf-tools', categoryName: 'PDF Tools', subcategory: 'form-pdf', url: '/tools/pdf-tools/form-pdf/pdf-to-excel/', description: 'Convert PDF to Excel', keywords: ['pdf to excel', 'pdf to xls'], icon: 'X', color: '#10b981', trending: true },
    { id: 271, slug: 'pdf-to-csv', name: 'PDF to CSV', category: 'pdf-tools', categoryName: 'PDF Tools', subcategory: 'form-pdf', url: '/tools/pdf-tools/form-pdf/pdf-to-csv/', description: 'Convert PDF to CSV', keywords: ['pdf to csv', 'convert csv'], icon: '📊', color: '#3b82f6' },
    { id: 272, slug: 'excel-to-pdf', name: 'Excel to PDF', category: 'pdf-tools', categoryName: 'PDF Tools', subcategory: 'form-pdf', url: '/tools/pdf-tools/form-pdf/excel-to-pdf/', description: 'Convert Excel to PDF', keywords: ['excel to pdf', 'xls to pdf'], icon: '📕', color: '#10b981' },
    { id: 273, slug: 'invoice-generator', name: 'Invoice Generator', category: 'pdf-tools', categoryName: 'PDF Tools', subcategory: 'form-pdf', url: '/tools/pdf-tools/form-pdf/invoice-generator/', description: 'Generate PDF invoices', keywords: ['invoice', 'invoice pdf'], icon: '🧾', color: '#3b82f6' },
    { id: 274, slug: 'resume-generator', name: 'Resume Generator', category: 'pdf-tools', categoryName: 'PDF Tools', subcategory: 'form-pdf', url: '/tools/pdf-tools/form-pdf/resume-generator/', description: 'Create professional resumes', keywords: ['resume', 'cv generator'], icon: '📄', color: '#8b5cf6' },
    { id: 275, slug: 'certificate-generator', name: 'Certificate Generator', category: 'pdf-tools', categoryName: 'PDF Tools', subcategory: 'form-pdf', url: '/tools/pdf-tools/form-pdf/certificate-generator/', description: 'Generate PDF certificates', keywords: ['certificate', 'award'], icon: '🏆', color: '#f59e0b' },
    { id: 276, slug: 'barcode-pdf', name: 'Add Barcode to PDF', category: 'pdf-tools', categoryName: 'PDF Tools', subcategory: 'form-pdf', url: '/tools/pdf-tools/form-pdf/barcode-pdf/', description: 'Add barcodes to PDF', keywords: ['barcode pdf', 'pdf barcode'], icon: '▥', color: '#1e293b' },
    { id: 277, slug: 'qr-pdf', name: 'Add QR Code to PDF', category: 'pdf-tools', categoryName: 'PDF Tools', subcategory: 'form-pdf', url: '/tools/pdf-tools/form-pdf/qr-pdf/', description: 'Add QR codes to PDF', keywords: ['qr pdf', 'pdf qr'], icon: '▦', color: '#3b82f6' },
    { id: 278, slug: 'link-extractor', name: 'Extract PDF Links', category: 'pdf-tools', categoryName: 'PDF Tools', subcategory: 'form-pdf', url: '/tools/pdf-tools/form-pdf/link-extractor/', description: 'Extract links from PDF', keywords: ['extract links', 'pdf links'], icon: '🔗', color: '#06b6d4' },
    { id: 279, slug: 'link-annotator', name: 'Add Links to PDF', category: 'pdf-tools', categoryName: 'PDF Tools', subcategory: 'form-pdf', url: '/tools/pdf-tools/form-pdf/link-annotator/', description: 'Add hyperlinks to PDF', keywords: ['add links', 'pdf hyperlinks'], icon: '🔗', color: '#8b5cf6' },
    { id: 280, slug: 'bookmark-generator', name: 'PDF Bookmark Generator', category: 'pdf-tools', categoryName: 'PDF Tools', subcategory: 'form-pdf', url: '/tools/pdf-tools/form-pdf/bookmark-generator/', description: 'Add bookmarks to PDF', keywords: ['pdf bookmarks', 'add bookmark'], icon: '🔖', color: '#f59e0b' },

    /* --- Advanced PDF (20) --- */
    { id: 281, slug: 'pdf-to-flipbook', name: 'PDF to Flipbook', category: 'pdf-tools', categoryName: 'PDF Tools', subcategory: 'advanced-pdf', url: '/tools/pdf-tools/advanced-pdf/pdf-to-flipbook/', description: 'Convert PDF to interactive flipbook', keywords: ['flipbook', 'pdf flipbook'], icon: '📖', color: '#8b5cf6', trending: true },
    { id: 282, slug: 'pdf-compare', name: 'Compare PDF', category: 'pdf-tools', categoryName: 'PDF Tools', subcategory: 'advanced-pdf', url: '/tools/pdf-tools/advanced-pdf/pdf-compare/', description: 'Compare two PDF files', keywords: ['compare pdf', 'pdf diff'], icon: '🔍', color: '#3b82f6', trending: true },
    { id: 283, slug: 'similarity-checker', name: 'PDF Similarity Checker', category: 'pdf-tools', categoryName: 'PDF Tools', subcategory: 'advanced-pdf', url: '/tools/pdf-tools/advanced-pdf/similarity-checker/', description: 'Check similarity between PDFs', keywords: ['pdf similarity', 'compare pdf'], icon: '📊', color: '#06b6d4' },
    { id: 284, slug: 'text-to-speech', name: 'PDF Text to Speech', category: 'pdf-tools', categoryName: 'PDF Tools', subcategory: 'advanced-pdf', url: '/tools/pdf-tools/advanced-pdf/text-to-speech/', description: 'Convert PDF text to speech', keywords: ['pdf text to speech', 'tts'], icon: '🔊', color: '#f97316', trending: true },
    { id: 285, slug: 'language-detector', name: 'PDF Language Detector', category: 'pdf-tools', categoryName: 'PDF Tools', subcategory: 'advanced-pdf', url: '/tools/pdf-tools/advanced-pdf/language-detector/', description: 'Detect language in PDF', keywords: ['language detect', 'pdf language'], icon: '🌍', color: '#10b981' },
    { id: 286, slug: 'pdf-word-counter', name: 'PDF Word Counter', category: 'pdf-tools', categoryName: 'PDF Tools', subcategory: 'advanced-pdf', url: '/tools/pdf-tools/advanced-pdf/pdf-word-counter/', description: 'Count words in PDF', keywords: ['pdf word count', 'count words'], icon: '🔢', color: '#3b82f6' },
    { id: 287, slug: 'page-number-remover', name: 'Remove PDF Page Numbers', category: 'pdf-tools', categoryName: 'PDF Tools', subcategory: 'advanced-pdf', url: '/tools/pdf-tools/advanced-pdf/page-number-remover/', description: 'Remove page numbers from PDF', keywords: ['remove page numbers', 'clean pdf'], icon: '🚫', color: '#ef4444' },
    { id: 288, slug: 'header-remover', name: 'Remove PDF Headers', category: 'pdf-tools', categoryName: 'PDF Tools', subcategory: 'advanced-pdf', url: '/tools/pdf-tools/advanced-pdf/header-remover/', description: 'Remove headers and footers', keywords: ['remove header', 'clean pdf'], icon: '🚫', color: '#f97316' },
    { id: 289, slug: 'date-stamper', name: 'PDF Date Stamper', category: 'pdf-tools', categoryName: 'PDF Tools', subcategory: 'advanced-pdf', url: '/tools/pdf-tools/advanced-pdf/date-stamper/', description: 'Add date stamp to PDF', keywords: ['date stamp', 'timestamp pdf'], icon: '📅', color: '#10b981' },
    { id: 290, slug: 'random-page', name: 'Random PDF Page Picker', category: 'pdf-tools', categoryName: 'PDF Tools', subcategory: 'advanced-pdf', url: '/tools/pdf-tools/advanced-pdf/random-page/', description: 'Pick a random page from PDF', keywords: ['random page', 'pick page'], icon: '🎲', color: '#ec4899' },
    { id: 291, slug: 'split-by-size', name: 'Split PDF by Size', category: 'pdf-tools', categoryName: 'PDF Tools', subcategory: 'advanced-pdf', url: '/tools/pdf-tools/advanced-pdf/split-by-size/', description: 'Split PDF by file size', keywords: ['split by size', 'pdf size'], icon: '📊', color: '#8b5cf6' },
    { id: 292, slug: 'split-by-keyword', name: 'Split PDF by Keyword', category: 'pdf-tools', categoryName: 'PDF Tools', subcategory: 'advanced-pdf', url: '/tools/pdf-tools/advanced-pdf/split-by-keyword/', description: 'Split PDF by keyword', keywords: ['split by keyword', 'pdf split'], icon: '🔍', color: '#3b82f6' },
    { id: 293, slug: 'merge-alternate', name: 'Merge PDF Alternately', category: 'pdf-tools', categoryName: 'PDF Tools', subcategory: 'advanced-pdf', url: '/tools/pdf-tools/advanced-pdf/merge-alternate/', description: 'Merge two PDFs alternately', keywords: ['merge alternate', 'interleave pdf'], icon: '📚', color: '#8b5cf6' },
    { id: 294, slug: 'background-adder', name: 'Add Background to PDF', category: 'pdf-tools', categoryName: 'PDF Tools', subcategory: 'advanced-pdf', url: '/tools/pdf-tools/advanced-pdf/background-adder/', description: 'Add background to PDF', keywords: ['pdf background', 'background image'], icon: '🖼', color: '#f59e0b' },
    { id: 295, slug: 'foreground-extractor', name: 'Extract PDF Foreground', category: 'pdf-tools', categoryName: 'PDF Tools', subcategory: 'advanced-pdf', url: '/tools/pdf-tools/advanced-pdf/foreground-extractor/', description: 'Extract foreground from PDF', keywords: ['extract foreground', 'pdf layers'], icon: '🎨', color: '#ec4899' },
    { id: 296, slug: 'opacity-changer', name: 'Change PDF Opacity', category: 'pdf-tools', categoryName: 'PDF Tools', subcategory: 'advanced-pdf', url: '/tools/pdf-tools/advanced-pdf/opacity-changer/', description: 'Change PDF opacity', keywords: ['pdf opacity', 'transparency'], icon: '◐', color: '#06b6d4' },
    { id: 297, slug: 'overlay-merger', name: 'Overlay PDF Files', category: 'pdf-tools', categoryName: 'PDF Tools', subcategory: 'advanced-pdf', url: '/tools/pdf-tools/advanced-pdf/overlay-merger/', description: 'Overlay two PDFs', keywords: ['overlay pdf', 'stack pdf'], icon: '📚', color: '#3b82f6' },
    { id: 298, slug: 'nup-layout', name: 'PDF N-up Layout', category: 'pdf-tools', categoryName: 'PDF Tools', subcategory: 'advanced-pdf', url: '/tools/pdf-tools/advanced-pdf/nup-layout/', description: 'Arrange multiple pages per sheet', keywords: ['nup layout', 'pages per sheet'], icon: '⊞', color: '#8b5cf6', trending: true },
    { id: 299, slug: 'poster-printer', name: 'PDF Poster Printer', category: 'pdf-tools', categoryName: 'PDF Tools', subcategory: 'advanced-pdf', url: '/tools/pdf-tools/advanced-pdf/poster-printer/', description: 'Print PDF as poster', keywords: ['poster print', 'large print'], icon: '🖨', color: '#f97316' },
    { id: 300, slug: 'archive-creator', name: 'PDF Archive Creator', category: 'pdf-tools', categoryName: 'PDF Tools', subcategory: 'advanced-pdf', url: '/tools/pdf-tools/advanced-pdf/archive-creator/', description: 'Create PDF archive', keywords: ['pdf archive', 'compress archive'], icon: '📦', color: '#10b981' }

  ];

  /* ===========================================
     5. HELPER FUNCTIONS
     =========================================== */
  const ToolsData = {

    /* Get all tools */
    getAll() {
      return TOOLS;
    },

    /* Get tool by ID */
    getById(id) {
      return TOOLS.find(t => t.id === id);
    },

    /* Get tool by slug */
    getBySlug(slug) {
      return TOOLS.find(t => t.slug === slug);
    },

    /* Get tools by category slug */
    getByCategory(categorySlug) {
      return TOOLS.filter(t => t.category === categorySlug);
    },

    /* Get tools by subcategory (PDF only) */
    getBySubcategory(subcategorySlug) {
      return TOOLS.filter(t => t.subcategory === subcategorySlug);
    },

    /* Get trending tools */
    getTrending(limit = 12) {
      return TOOLS.filter(t => t.trending).slice(0, limit);
    },

    /* Simple search */
    search(query) {
      if (!query || !query.trim()) return [];
      const q = query.toLowerCase().trim();
      return TOOLS.filter(t =>
        t.name.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        (t.keywords || []).some(k => k.toLowerCase().includes(q))
      );
    },

    /* Get all categories */
    getCategories() {
      return CATEGORIES;
    },

    /* Get category by slug */
    getCategory(slug) {
      return CATEGORIES.find(c => c.slug === slug);
    },

    /* Get PDF subcategories */
    getPdfSubcategories() {
      return PDF_SUBCATEGORIES;
    },

    /* Get PDF subcategory by slug */
    getPdfSubcategory(slug) {
      return PDF_SUBCATEGORIES.find(c => c.slug === slug);
    },

    /* Get tools grouped by category */
    getGroupedByCategory() {
      const grouped = {};
      CATEGORIES.forEach(cat => {
        grouped[cat.slug] = TOOLS.filter(t => t.category === cat.slug);
      });
      return grouped;
    },

    /* Get tools for a specific category page, grouped by subcategory */
    getGroupedBySubcategory(categorySlug) {
      const grouped = {};
      PDF_SUBCATEGORIES.forEach(sub => {
        grouped[sub.slug] = TOOLS.filter(t => t.category === categorySlug && t.subcategory === sub.slug);
      });
      return grouped;
    },

    /* Total count */
    count() {
      return TOOLS.length;
    },

    /* Count by category */
    countByCategory(categorySlug) {
      return TOOLS.filter(t => t.category === categorySlug).length;
    },

    /* Get random tools */
    getRandom(count = 8) {
      const shuffled = [...TOOLS].sort(() => 0.5 - Math.random());
      return shuffled.slice(0, count);
    },

    /* Get related tools (same category, excluding current) */
    getRelated(toolId, limit = 6) {
      const tool = this.getById(toolId);
      if (!tool) return [];
      return TOOLS
        .filter(t => t.category === tool.category && t.id !== toolId)
        .slice(0, limit);
    },

    /* Site config */
    getSiteConfig() {
      return SITE_CONFIG;
    }
  };

  /* ===========================================
     6. EXPORTS (Global namespace)
     =========================================== */
  window.ToolsData = ToolsData;
  window.TOOLS_DATABASE = TOOLS;
  window.TOOLS_CATEGORIES = CATEGORIES;
  window.PDF_SUBCATEGORIES = PDF_SUBCATEGORIES;
  window.SITE_CONFIG = SITE_CONFIG;

  /* ===========================================
     7. CONSOLE LOG (verify loading)
     =========================================== */
  if (typeof console !== 'undefined') {
    console.log('%c⚒ BigToolz Database loaded', 'color:#2563eb;font-weight:bold;font-size:14px;');
    console.log('%c✓ ' + TOOLS.length + ' tools across ' + CATEGORIES.length + ' categories', 'color:#10b981;');
  }

})();