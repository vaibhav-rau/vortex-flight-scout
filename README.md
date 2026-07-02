# VORTEX // FLIGHT SCOUT

A high-velocity, industrial terminal browser extension that strips decorative layout noise from Google Flights Explore maps to calculate, extract, and sort flight routes by pure ascending mathematical value.

## Features
* **Industrial Sharp UI:** Flat, high-contrast matte interfaces with zero curves.
* **True Mathematical Sort:** Bypasses recommendation algorithms to order destinations strictly by cost ($ lowest to highest).
* **Multi-Routing States:** Toggle dynamically between native Round-Trip tracking and structured One-Way flight paths.
* **Deep Flight Linking:** Generates precise search-matrix parameters to deep-link directly into live booking engines.

## Architecture & File Structure
```text
flight-finder-extension/
├── manifest.json              # Extension security, routing configuration & asset declarations
├── icon.png                   # Custom browser bar asset
├── popup/
│   ├── popup.html             # Slate-gray matte industrial interface framework
│   └── popup.js               # Universal system router and deep link compiler
└── scripts/
    └── content-scout.js       # Mathematical pricing array scraping engine