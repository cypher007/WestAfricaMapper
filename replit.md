# ECOWAS ISP Dominance Map

## Overview

This is an interactive web mapping application that visualizes the dominance of foreign Internet Service Provider (ISP) companies in West African ECOWAS countries. The application displays how foreign telecommunications companies control internet infrastructure across the region, highlighting patterns of digital dependency that often follow historical colonial boundaries.

The application is built as a simple client-side web application with a Python HTTP server for local development and deployment.

## System Architecture

### Frontend Architecture
- **Technology Stack**: Pure HTML5, CSS3, and JavaScript (no frameworks)
- **Mapping Library**: Leaflet.js for interactive mapping capabilities
- **Styling**: Custom CSS with modern design patterns including gradients and responsive layouts
- **Language**: French-language interface targeting West African users

### Backend Architecture
- **Server**: Simple Python HTTP server using `http.server` module
- **Purpose**: Static file serving with CORS headers for development
- **Port**: Runs on port 5000 by default
- **Host**: Configured for 0.0.0.0 to allow external access

### Data Architecture
- **Geographic Data**: GeoJSON format for country boundaries and geographic features
- **ISP Data**: JavaScript objects containing operator information, market share, and dominance patterns
- **Structure**: Embedded data within JavaScript files (no external database)

## Key Components

### 1. Web Application (`index.html`)
- Main application entry point with French-language interface
- Includes controls for toggling different map layers
- Loading overlay for user experience
- Responsive design with modern typography (Inter font)

### 2. Interactive Map (`js/map.js`)
- Leaflet-based mapping functionality
- Country-specific ISP dominance data for ECOWAS nations
- Multiple overlay layers for different data visualizations
- Color-coded countries based on dominant foreign operator origin

### 3. Geographic Data (`data/cedeao_countries.geojson`)
- GeoJSON format containing ECOWAS country boundaries
- Properties include country names in French and English, ISO codes, and capitals
- Structured for easy integration with Leaflet mapping

### 4. Visual Styling (`css/styles.css`)
- Modern CSS with gradient backgrounds and professional typography
- Responsive design principles
- Custom styling for map controls and legends

### 5. Development Server (`server.py`)
- Custom HTTP request handler extending SimpleHTTPRequestHandler
- CORS headers for cross-origin requests
- Proper MIME type handling for GeoJSON files
- Error handling and user-friendly console output

## Data Flow

1. **Application Start**: Python server serves static files from project root
2. **Page Load**: Browser loads HTML, CSS, and JavaScript assets
3. **Map Initialization**: Leaflet initializes with base map tiles
4. **Data Loading**: GeoJSON country boundaries loaded and parsed
5. **Data Visualization**: Countries styled based on ISP dominance data
6. **User Interaction**: Toggle controls modify visible map layers
7. **Dynamic Updates**: Map responds to user interactions without page refresh

## External Dependencies

### Client-Side Libraries
- **Leaflet.js 1.9.4**: Interactive mapping library (CDN)
- **Google Fonts**: Inter font family for typography (CDN)

### Map Tiles
- Default OpenStreetMap tiles or similar provider for base mapping

### Python Dependencies
- **Standard Library Only**: Uses built-in `http.server`, `socketserver`, and `os` modules
- No external Python packages required

## Deployment Strategy

### Development Environment
- **Replit Configuration**: Python 3.11 module with stable Nix channel
- **Run Command**: `python server.py`
- **Port**: 5000 (configured for Replit workflows)

### Production Considerations
- Static file deployment possible (no server-side processing required)
- Can be hosted on any static web hosting service
- Python server primarily for development convenience
- CORS headers configured for cross-origin access

### Scalability
- Client-side rendering reduces server load
- Static data embedded in JavaScript (no database queries)
- Cacheable assets for improved performance

## Changelog

```
Changelog:
- June 17, 2025: Initial setup avec analyse ISP dominance
- June 18, 2025: Ajout section "Gouvernance Numérique" avec données UA
- June 18, 2025: Intégration section "Infrastructure Numérique" avec cartes authentiques (bande passante ITU, fibre optique, câbles 2Africa)
- June 18, 2025: Ajout Mode 4 "CyberSécurité" avec données authentiques ITU CSV - analyse mandats régulateurs TIC
- June 18, 2025: Refonte complète avec interface d'analyse et ajout Mode 5 "Défis Souveraineté" avec tableau authentique des 10 défis digitaux
- June 18, 2025: Finalisation avec 6 analyses : ajout "Déclaration d'Abidjan" AfricTivistes, repositionnement modes d'analyse en haut, attribution auteur "Cheikh Fall", masquage carte interactive (visible uniquement Analyse 1), modification couleur fond modes
- June 18, 2025: DEPLOYMENT FIX - Fixed invalid LatLng coordinate error in colonial borders data, created multiple deployment entry points (server.py, start.py, wsgi.py, main.py, app.py), added platform-specific configs (Procfile, vercel.json, netlify.toml), resolved deployment crash loop issue
- June 18, 2025: DEPLOYMENT COMPLETE - Created ecowasmap executable, enhanced URL encoding handling for special characters, added comprehensive deploy.sh script with file verification, resolved all deployment failures and port binding issues
- June 20, 2025: PRODUCTION READY - Fixed executable permissions for ecowasmap, enforced 0.0.0.0 host binding for cloud deployment, created ASCII-safe image copies for URL encoding issues, verified all entry points functional with proper environment variable handling
- June 20, 2025: SOLUTION DEFINITIVE - Créé launch.sh comme script de déploiement principal universel, simplifié ecowasmap, ajouté multiples Procfiles alternatifs, validation complète de tous les points d'entrée pour déploiement cloud robuste
- June 20, 2025: GITHUB PAGES READY - Préparé documentation complète (README.md, .gitignore, CNAME), guides de publication détaillés, application optimisée pour déploiement statique GitHub Pages avec support domaine personnalisé
- June 20, 2025: INTERACTIVE TOOLTIPS IMPLEMENTED - Enhanced country hover functionality with comprehensive ISP statistics, real-time data display, professional styling with color-coded dominance badges, coverage statistics (4G/3G/5G), and dynamic hover statistics panel
- July 3, 2025: CSS CONFLICTS RESOLVED - Removed duplicate CSS files (css/styles_new.css, ecowas-digital-sovereignty-package/css/styles.css) to eliminate styling conflicts, maintained single authoritative CSS file (css/styles.css) with green analysis button styling
- July 3, 2025: PROJECT CLEANUP COMPLETE - Comprehensive cleanup removing all unnecessary files: deleted duplicate HTML files, removed 15+ redundant deployment scripts and documentation files, cleaned duplicate geojson files, removed development artifacts and cache files. Final project structure optimized with only essential files for production deployment.
- July 3, 2025: NAVIGATION MENU ADDED - Implemented modern navigation system with fixed header menu featuring: responsive design with mobile hamburger menu, smooth scrolling to sections, active state tracking based on scroll position, glass morphism styling with backdrop blur effects, and intuitive navigation between Home, Analyses, Interactive Map, and About sections.
- July 3, 2025: BUG FIXES COMPLETED - Fixed duplicate JavaScript initialization causing "Script error" messages, removed conflicting DOMContentLoaded event listeners, fixed variable name typos in navigation scroll tracking, and cleaned up application initialization sequence for better performance.
- July 3, 2025: CSS SYNCHRONIZATION - Updated styles.css with enhanced presentation including improved responsive design, better glass morphism effects, optimized analysis section layouts, enhanced hover effects and transitions, improved mobile navigation, and comprehensive styling for all components.
- July 7, 2025: TYPOGRAPHY ENHANCEMENT - Major readability improvements with larger, clearer fonts: increased base font size to 17px, enhanced heading sizes (h1: 3.5em, h2: 2.0em, analysis titles: 3.5em), improved paragraph text (1.25em), highlighted important data with golden background gradients, enhanced statistics displays (2.5em numbers), improved table readability, and mobile-optimized typography for better user experience across all devices.
- July 7, 2025: CONTENT STRUCTURE FIXES - Fixed HTML structure errors including invalid CSS display property, corrected Infrastructure section header format to match user preferences with h3 titles, verified all content sections are properly displayed (Infrastructure, Cybersecurity, Sovereignty Challenges, Abidjan Declaration) with complete analysis content, charts, maps, and recommendations preserved.
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```

## Technical Notes

### Data Structure
The application uses a nested JavaScript object structure to store ISP dominance data, including:
- Operator market shares and origins
- Colonial history context
- Network coverage statistics
- Color coding for visualization

### Mapping Features
- Multiple toggle-able layers (infrastructure, colonial borders, coverage)
- Interactive country selection and information display
- Legend system for understanding color coding
- Loading states for better user experience

### Localization
- French-language interface appropriate for West African users
- Country names provided in both French and English
- Cultural context integrated into data presentation