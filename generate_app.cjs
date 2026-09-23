/**
 * POLARSYNC Single-File HTML Generator Script
 * Reads all modules and produces the complete self-contained index.html
 */

const fs = require('fs');
const path = require('path');

const { mockData } = require('./mock_data.cjs');
const { getStyles } = require('./app_styles.cjs');
const { getAppHtml } = require('./app_markup.cjs');
const { getAppScript } = require('./app_script.cjs');
const { getRenderersPart1 } = require('./page_renderers_1.cjs');
const { getRenderersPart2 } = require('./page_renderers_2.cjs');
const { getRenderersPart3 } = require('./page_renderers_3.cjs');

function generate() {
  const styles = getStyles();
  const markup = getAppHtml();
  const scriptCore = getAppScript();
  const renderers1 = getRenderersPart1();
  const renderers2 = getRenderersPart2();
  const renderers3 = getRenderersPart3();
  const serializedMockData = JSON.stringify(mockData, null, 2);

  const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>POLARSYNC | Integrated Polar Expedition Logistics & Asset Management System</title>
  <meta name="description" content="Integrated Polar Expedition Logistics & Asset Management System for Smart India Hackathon 2026 Problem Statement 26062.">

  <!-- Leaflet GIS Mapping CDN -->
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=" crossorigin=""/>
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js" integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=" crossorigin=""></script>

  <!-- Chart.js CDN -->
  <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.2/dist/chart.umd.min.js"></script>

  <style>
${styles}
  </style>
</head>
<body>
  <!-- APPLICATION MARKUP -->
${markup}

  <!-- APPLICATION DATA & SCRIPTS -->
  <script>
    // Initial Seed Mock Datasets
    window.__DEFAULT_DATA__ = ${serializedMockData};

${scriptCore}

${renderers1}

${renderers2}

${renderers3}

    // Startup Initialization
    window.addEventListener('DOMContentLoaded', () => {
      // Set initial route or dashboard
      if (!window.location.hash) {
        window.location.hash = '#/dashboard';
      }
      
      // Auto-authenticate for direct preview experience
      if (document.getElementById('view-login') && document.getElementById('app-shell')) {
        document.getElementById('view-login').classList.add('hidden');
        document.getElementById('app-shell').classList.remove('hidden');
        PolarSync.updateBadges();
        handleRouting();
      }
    });
  </script>
</body>
</html>`;

  fs.writeFileSync(path.join(__dirname, 'index.html'), fullHtml, 'utf8');
  console.log('Successfully generated complete single-file index.html. Size:', fullHtml.length, 'bytes');
}

generate();
