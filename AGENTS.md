# AGENTS.md - Repository Information for AI Agents

## Repository Overview

**Name:** tools.oalfawzan.sa  
**Type:** Static HTML/CSS/JS Tools Website  
**Deployment:** GitHub Pages  
**Domain:** https://tools.oalfawzan.sa  
**Language:** Arabic (RTL)

## Project Structure

```
/Users/oalfawzan/Documents/GitHub/tools.oalfawzan.sa/
├── index.html                          # Main landing page
├── AGENTS.md                           # This file
├── README.md                           # User-facing documentation
├── offer/
│   └── index.html                      # Job Offer Comparator
├── time/
│   └── index.html                      # Time Toolkit
├── qr-generator/
│   └── index.html                      # QR Code Generator
├── wheel-of-names/
│   └── index.html                      # Random Name Picker
├── json-formatter/
│   └── index.html                      # JSON Formatter & Validator
└── stock-analysis-dashboard/
    └── index.html                      # Stock Analysis Dashboard
```

## Tool Descriptions

### 1. Job Offer Comparator (`/offer/`)
- **Purpose:** Compare multiple job offers side-by-side
- **Features:**
  - Add unlimited job offers
  - Calculate financial scores
  - Custom fields for benefits
  - Export to Excel
  - RTL support for Arabic
- **Key Functions:** `addOffer()`, `switchCard()`, `calculateScore()`, `exportToExcel()`

### 2. Time Toolkit (`/time/`)
- **Purpose:** Time zone conversion and calculations
- **Features:**
  - Time zone converter
  - Duration calculator
  - Prayer times (custom implementation)
  - Hijri/Gregorian calendar
  - Custom date/time inputs with proper RTL handling
- **Key Functions:** `convertTime()`, `calculateDuration()`, `updateDisplay()`

### 3. QR Code Generator (`/qr-generator/`)
- **Purpose:** Generate QR codes from text/URLs
- **Features:**
  - Custom text/URL input
  - Real-time QR generation
  - Canvas-based rendering
  - Download functionality
  - Theme toggle (light/dark)
- **Key Functions:** `generateQR()`, `downloadQR()`, `applyTheme()`

### 4. Wheel of Names (`/wheel-of-names/`)
- **Purpose:** Random name picker with visual wheel
- **Features:**
  - Canvas-based spinning wheel
  - Add up to 20 names
  - Smooth animations
  - Reset functionality
  - Visual feedback
- **Key Functions:** `spin()`, `drawWheel()`, `getNames()`, `resetAll()`

### 5. JSON Formatter (`/json-formatter/`)
- **Purpose:** Format and validate JSON
- **Features:**
  - Syntax highlighting
  - Error detection
  - Pretty-print formatting
  - Minify/expand options
  - Copy to clipboard
- **Key Functions:** `formatJSON()`, `parseJSON()`, `setStatus()`, `clearAll()`

### 6. Stock Analysis Dashboard (`/stock-analysis-dashboard/`)
- **Purpose:** Saudi stock market analysis
- **Features:**
  - Ticker symbol search
  - Historical data visualization
  - Financial metrics
  - Chart rendering
  - Market data integration
- **Key Functions:** `analyzeTicker()`, `fetchHistory()`, `renderMetrics()`

## Technical Specifications

### Architecture
- **Type:** Pure static (client-side only)
- **Framework:** None (vanilla HTML/CSS/JS)
- **Styling:** Custom CSS with CSS variables
- **RTL Support:** Full Arabic right-to-left layout
- **Privacy:** All processing done client-side, no data collection

### Browser Requirements
- Modern browsers with ES6+ support
- Canvas API support (for QR, Wheel, Stock charts)
- LocalStorage (for theme preferences)

### Key Technologies
- HTML5
- CSS3 (with custom properties)
- Vanilla JavaScript (ES6+)
- Canvas API
- External CDNs:
  - SheetJS (xlsx) for Excel export
  - Additional charting libraries for stock dashboard

## GitHub Pages Configuration

### Deployment Settings
- **Source:** Branch: `main`, Folder: `/ (root)`
- **Domain:** Custom domain `tools.oalfawzan.sa`
- **Enforce HTTPS:** Enabled
- **Build Process:** None (static files only)

### Deployment Process
1. Push changes to `main` branch
2. GitHub Pages automatically deploys within seconds
3. Verify deployment at `https://tools.oalfawzan.sa/{tool-name}/`

### Branch Strategy
- **Main Branch:** Production-ready code for GitHub Pages
- **Feature Branches:** For development and testing
- **No Build Step:** Direct HTML/CSS/JS deployment

## Development Guidelines

### Code Style
- Indentation: 2 spaces
- HTML: Semantic tags, data attributes for i18n
- CSS: CSS custom properties for theming, BEM-like naming
- JS: Modular functions, event listeners, no global pollution

### Adding New Tools
1. Create new directory: `/{tool-name}/`
2. Add `index.html` with basic structure
3. Include shared CSS via `<link>`
4. Add tool-specific JavaScript
5. Update main `index.html` with tool card
6. Test locally and deploy to `main`

### Localization
- All text uses `data-i18n` attributes
- `STRINGS` object contains translations
- Current languages: Arabic (primary), English (fallback)
- RTL support via `dir="rtl"` attribute

## Performance Considerations

### Optimization
- No external frameworks (minimal bundle size)
- Images optimized/max 500KB
- CSS/JS inlined for critical path
- Cache headers: `Cache-Control: no-cache` for HTML
- CDN for external libraries

### Loading Strategy
- Critical CSS inlined
- Non-critical resources loaded asynchronously
- No render-blocking external CSS/JS
- Fast first contentful paint (< 1s)

## Security & Privacy

### Security Measures
- Pure client-side (no server vulnerabilities)
- No user data collection
- No external tracking scripts
- Content Security Policy (CSP) ready

### Privacy Features
- All processing in browser
- LocalStorage for user preferences only
- No analytics/telemetry
- GDPR compliant by design

## Known Issues & Limitations

### Current Issues
1. Mobile viewport code (`user-scalable=no`) may affect desktop zoom
2. No service worker (can't work offline)
3. Stock data limited to Saudi market
4. No user accounts/data persistence across devices

### Browser Compatibility
- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support
- Mobile browsers: Functional but not optimized

## Troubleshooting

### Common Issues
1. **Tool not loading:** Check browser console for JS errors
2. **RTL issues:** Verify `dir="rtl"` attribute present
3. **Theme not persisting:** Check LocalStorage enabled
4. **Canvas not rendering:** Verify browser supports Canvas API

### Debug Commands
```bash
# Test tool loading
curl -I https://tools.oalfawzan.sa/{tool}/

# Check for JS errors
curl -s https://tools.oalfawzan.sa/{tool}/ | grep -i "error"

# Verify deployment
gh api repos/:owner/:repo/pages | jq '.status'
```

## Future Enhancements

### Planned Features
- Service Worker for offline support
- PWA manifest for installability
- Additional tools (calculator, converter, etc.)
- Enhanced mobile responsiveness
- Multi-language support expansion

### Technical Debt
- Remove remaining mobile viewport code
- Refactor shared CSS into single file
- Add automated testing
- Implement CI/CD pipeline

## Contact & Support

- **Repository:** https://github.com/omarfoz/tools.oalfawzan.sa
- **Issues:** Use GitHub Issues for bug reports
- **Domain:** Administered via GitHub Pages settings

---

**Last Updated:** 2025  
**Version:** 1.0.0  
**Status:** Production (GitHub Pages)

## Tool 7: Loan Calculator (`/loan-calculator/`)

**Purpose:** Saudi housing loan comparator with regulatory compliance checking

**Key Features:**
- Standard amortization formula (accurate bank calculations)
- 10% down payment requirement (Saudi regulation)
- Personal loan for down payment option
- 65% debt-to-income regulatory limit (SAMA compliance)
- Multi-loan comparison (up to 4 loans)
- Amortization schedule generation
- Risk assessment with regulatory compliance badge
- Export to CSV functionality
- RTL Arabic support

**Regulatory Compliance:**
- Enforces Saudi Central Bank (SAMA) 65% DTI limit
- Validates down payment requirements
- Checks combined loan compliance
- Provides regulatory rejection notices

**Formulas Used:**
- Standard amortization: MRC = P×[r(1+r)^n]/[(1+r)^n-1]
- Debt-to-income: DTI = Monthly Payment ÷ Salary
- Down payment: 10% of property value + 10,000 SAR fee

**Implementation:**
- Location: `/loan-calculator/index.html`
- Languages: Arabic (primary), English fallback
- No external dependencies
- Pure client-side calculations
- Privacy-first (no data collection)

