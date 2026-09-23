/**
 * Page Renderers Part 1: Dashboard, Expeditions, Expedition Detail, Cargo, Inventory
 */

function getRenderersPart1() {
  return `
/* === PAGE DISPATCHER BASE === */
function renderCurrentPage() {
  const hash = window.location.hash || '#/dashboard';
  const parts = hash.split('?');
  const route = parts[0].replace('#/', '') || 'dashboard';
  const params = new URLSearchParams(parts[1] || '');

  const container = document.getElementById('page-container');
  if (!container) return;

  // Cleanup existing charts to prevent memory leak
  Object.keys(PolarSync.activeChartInstances).forEach(k => {
    try { PolarSync.activeChartInstances[k].destroy(); } catch (e) {}
  });
  PolarSync.activeChartInstances = {};

  if (route === 'dashboard') {
    renderDashboard(container);
  } else if (route === 'expeditions') {
    renderExpeditions(container);
  } else if (route === 'expedition-detail') {
    renderExpeditionDetail(container, params.get('id'));
  } else if (route === 'cargo') {
    renderCargo(container);
  } else if (route === 'inventory') {
    renderInventory(container);
  } else if (route === 'assets') {
    renderAssets(container);
  } else if (route === 'personnel') {
    renderPersonnel(container);
  } else if (route === 'stations') {
    renderStations(container);
  } else if (route === 'emergency') {
    renderEmergency(container);
  } else if (route === 'tasks') {
    renderTasks(container);
  } else if (route === 'analytics') {
    renderAnalytics(container);
  } else if (route === 'notifications') {
    renderNotifications(container);
  } else if (route === 'documents') {
    renderDocuments(container);
  } else if (route === 'users') {
    renderUsers(container);
  } else if (route === 'audit') {
    renderAudit(container);
  } else if (route === 'settings') {
    renderSettings(container);
  } else {
    container.innerHTML = '<div class="card"><div class="card-body">Page not found. <a href="#/dashboard">Return to Dashboard</a></div></div>';
  }
}

/* =========================================================================
   DASHBOARD RENDERER
   ========================================================================= */
function renderDashboard(container) {
  const s = PolarSync.state;
  const activeExp = s.expeditions.filter(e => e.status === 'Active').length;
  const personnelDeployed = s.personnel.filter(p => p.status === 'Deployed').length;
  const inTransitCargo = s.cargo.filter(c => c.status === 'In Transit' || c.status === 'Delayed').length;
  const critInv = s.inventory.filter(i => i.status === 'Critical' || i.status === 'Out of Stock').length;
  const activeAssets = s.assets.filter(a => a.status === 'In Use').length;
  const openEmerg = s.emergencies.filter(e => e.status !== 'Resolved').length;

  container.innerHTML = \`
    <!-- TOP METRICS / KPIS -->
    <div class="kpi-grid">
      <div class="kpi-card" onclick="window.location.hash='#/expeditions'">
        <div class="kpi-icon-box" style="background: #e0f2fe; color: #0284c7;">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon></svg>
        </div>
        <div>
          <div class="kpi-label">Active Expeditions</div>
          <div class="kpi-value">\${activeExp}</div>
          <div class="kpi-sub">\${s.expeditions.length} Total Planned</div>
        </div>
      </div>

      <div class="kpi-card" onclick="window.location.hash='#/personnel'">
        <div class="kpi-icon-box" style="background: #dbeafe; color: #2563eb;">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle></svg>
        </div>
        <div>
          <div class="kpi-label">Personnel Deployed</div>
          <div class="kpi-value">\${personnelDeployed}</div>
          <div class="kpi-sub">Across 10 Outposts</div>
        </div>
      </div>

      <div class="kpi-card" onclick="window.location.hash='#/cargo'">
        <div class="kpi-icon-box" style="background: #fef3c7; color: #d97706;">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>
        </div>
        <div>
          <div class="kpi-label">Cargo in Transit</div>
          <div class="kpi-value">\${inTransitCargo}</div>
          <div class="kpi-sub">Shipments En Route</div>
        </div>
      </div>

      <div class="kpi-card" onclick="window.location.hash='#/inventory'">
        <div class="kpi-icon-box" style="background: \${critInv > 0 ? '#fee2e2' : '#ecfdf5'}; color: \${critInv > 0 ? '#dc2626' : '#059669'};">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
        </div>
        <div>
          <div class="kpi-label">Critical Inventory</div>
          <div class="kpi-value" style="color: \${critInv > 0 ? '#dc2626' : 'inherit'};">\${critInv}</div>
          <div class="kpi-sub">Requires Resupply</div>
        </div>
      </div>

      <div class="kpi-card" onclick="window.location.hash='#/assets'">
        <div class="kpi-icon-box" style="background: #f3e8ff; color: #9333ea;">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
        </div>
        <div>
          <div class="kpi-label">Active Assets</div>
          <div class="kpi-value">\${activeAssets}</div>
          <div class="kpi-sub">Field Equipment</div>
        </div>
      </div>

      <div class="kpi-card" onclick="window.location.hash='#/emergency'">
        <div class="kpi-icon-box" style="background: \${openEmerg > 0 ? '#fee2e2' : '#ecfdf5'}; color: \${openEmerg > 0 ? '#ef4444' : '#10b981'};">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
        </div>
        <div>
          <div class="kpi-label">Open Emergencies</div>
          <div class="kpi-value" style="color: \${openEmerg > 0 ? '#ef4444' : 'inherit'};">\${openEmerg}</div>
          <div class="kpi-sub">\${openEmerg > 0 ? 'Action Required' : 'All Clear'}</div>
        </div>
      </div>
    </div>

    <!-- POLAR OPERATIONS MAP & WEATHER STRIP -->
    <div class="card">
      <div class="card-header">
        <div class="card-title">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"></polygon><line x1="9" y1="3" x2="9" y2="18"></line><line x1="15" y1="6" x2="15" y2="21"></line></svg>
          Integrated Polar Geographical Telemetry
        </div>
        <div class="flex gap-2">
          <button class="btn btn-secondary btn-sm" onclick="initLeafletMap(true)">Center Antarctica</button>
          <button class="btn btn-secondary btn-sm" onclick="initLeafletMap(false)">Center Arctic</button>
        </div>
      </div>
      <div class="card-body" style="padding: 0; position: relative;">
        <div id="map-container"></div>
      </div>
      <div class="card-footer" style="font-size: 0.8rem; overflow-x: auto;">
        <div class="flex gap-4 items-center">
          <span><strong>Bharati:</strong> -24°C, Wind 38kt, Clear</span>
          <span><strong>Maitri:</strong> -28°C, Wind 45kt, Blizzard</span>
          <span><strong>Himadri (Svalbard):</strong> -12°C, Light Snow</span>
          <span><strong>Dakshin Gangotri:</strong> -34°C, Severe Ice</span>
        </div>
      </div>
    </div>

    <!-- 2-COLUMN OPERATIONAL OVERVIEW -->
    <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 24px;">
      <!-- LEFT COLUMN: ACTIVE EXPEDITIONS & CARGO -->
      <div>
        <!-- ACTIVE EXPEDITIONS OVERVIEW -->
        <div class="card">
          <div class="card-header">
            <div class="card-title">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon></svg>
              Active Expeditions Status
            </div>
            <a href="#/expeditions" class="btn btn-secondary btn-sm">View All Expeditions</a>
          </div>
          <div class="table-wrapper">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Expedition</th>
                  <th>Target Station</th>
                  <th>Commander</th>
                  <th>Timeline</th>
                  <th>Progress</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                \${s.expeditions.slice(0, 5).map(e => \`
                  <tr>
                    <td>
                      <strong>\${e.name}</strong>
                      <div class="text-xs text-muted">\${e.id} • \${e.type}</div>
                    </td>
                    <td>\${e.station}</td>
                    <td>\${e.commander}</td>
                    <td class="text-xs">\${e.startDate} to \${e.endDate}</td>
                    <td style="min-width: 120px;">
                      <div class="flex items-center justify-between text-xs" style="margin-bottom: 2px;">
                        <span>Progress</span>
                        <span>\${e.progress}%</span>
                      </div>
                      <div class="progress-bar-bg">
                        <div class="progress-bar-fill \${e.progress === 100 ? 'success' : ''}" style="width: \${e.progress}%;"></div>
                      </div>
                    </td>
                    <td>
                      <span class="badge \${e.status === 'Active' ? 'badge-success' : (e.status === 'Completed' ? 'badge-info' : 'badge-warning')}">
                        <span class="badge-dot"></span>\${e.status}
                      </span>
                    </td>
                    <td>
                      <button class="btn btn-secondary btn-sm" onclick="window.location.hash='#/expedition-detail?id=\${e.id}'">Details</button>
                    </td>
                  </tr>
                \`).join('')}
              </tbody>
            </table>
          </div>
        </div>

        <!-- CARGO MOVEMENTS IN FLIGHT -->
        <div class="card">
          <div class="card-header">
            <div class="card-title">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon></svg>
              Priority Cargo Logistics Pipeline
            </div>
            <a href="#/cargo" class="btn btn-secondary btn-sm">Full Cargo Manifest</a>
          </div>
          <div class="table-wrapper">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Shipment</th>
                  <th>Category</th>
                  <th>Route</th>
                  <th>Transport</th>
                  <th>Priority</th>
                  <th>ETA</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                \${s.cargo.slice(0, 5).map(c => \`
                  <tr>
                    <td>
                      <strong>\${c.id}</strong>
                      <div class="text-xs text-muted">\${c.description}</div>
                    </td>
                    <td>\${c.category}</td>
                    <td class="text-xs">\${c.origin} → <strong>\${c.destination}</strong></td>
                    <td>\${c.transportMode}</td>
                    <td>
                      <span class="badge \${c.priority === 'Critical' ? 'badge-danger' : (c.priority === 'High' ? 'badge-warning' : 'badge-neutral')}">
                        \${c.priority}
                      </span>
                    </td>
                    <td class="text-xs font-semibold">\${c.eta}</td>
                    <td>
                      <span class="badge \${c.status === 'In Transit' ? 'badge-info' : (c.status === 'Delivered' ? 'badge-success' : 'badge-warning')}">
                        \${c.status}
                      </span>
                    </td>
                  </tr>
                \`).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- RIGHT COLUMN: EMERGENCY MONITOR & INVENTORY CRITICALS -->
      <div>
        <!-- ACTIVE EMERGENCIES WIDGET -->
        <div class="card" style="border-top: 3px solid #ef4444;">
          <div class="card-header" style="background: \${openEmerg > 0 ? 'var(--status-red-bg)' : 'transparent'};">
            <div class="card-title" style="color: #ef4444;">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
              Emergency Command Monitor (\${openEmerg})
            </div>
            <a href="#/emergency" class="btn btn-danger-outline btn-sm">Incident Desk</a>
          </div>
          <div class="card-body">
            \${s.emergencies.filter(e => e.status !== 'Resolved').slice(0, 3).map(e => \`
              <div style="padding: 10px; border-left: 3px solid \${e.severity === 'Critical' ? '#ef4444' : '#f59e0b'}; background: var(--bg-subtle); border-radius: var(--radius-sm); margin-bottom: 10px;">
                <div class="flex items-center justify-between">
                  <span class="font-bold text-xs" style="color: \${e.severity === 'Critical' ? '#ef4444' : '#f59e0b'};">\${e.id} • \${e.severity}</span>
                  <span class="badge badge-danger">\${e.status}</span>
                </div>
                <div class="font-semibold text-sm" style="margin-top: 4px;">\${e.type} at \${e.location}</div>
                <div class="text-xs text-muted" style="margin-top: 2px;">\${e.description}</div>
                <div class="flex justify-between items-center" style="margin-top: 8px;">
                  <span class="text-xs text-muted">Lead: \${e.assignedLead}</span>
                  <button class="btn btn-danger btn-sm" onclick="window.location.hash='#/emergency'">Respond</button>
                </div>
              </div>
            \`).join('')}
            \${openEmerg === 0 ? '<div class="text-center text-muted" style="padding: 20px;">No active emergency alerts. All station perimeters nominal.</div>' : ''}
          </div>
        </div>

        <!-- CRITICAL INVENTORY ALERT BOX -->
        <div class="card">
          <div class="card-header">
            <div class="card-title">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path></svg>
              Critical Stock Depletions
            </div>
            <a href="#/inventory" class="btn btn-secondary btn-sm">Restock</a>
          </div>
          <div class="card-body">
            \${s.inventory.filter(i => i.status === 'Critical' || i.status === 'Out of Stock').slice(0, 4).map(i => \`
              <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px solid var(--border-color);">
                <div>
                  <div class="font-bold text-xs">\${i.item}</div>
                  <div class="text-xs text-muted">\${i.station} • \${i.category}</div>
                </div>
                <div class="text-right">
                  <div class="font-bold text-xs" style="color: var(--status-red);">\${i.available} \${i.unit}</div>
                  <div class="text-xs text-muted">Min: \${i.minimum} \${i.unit}</div>
                </div>
              </div>
            \`).join('')}
          </div>
        </div>

        <!-- RECENT AUDIT ACTIVITY -->
        <div class="card">
          <div class="card-header">
            <div class="card-title">Operations Log</div>
            <a href="#/audit" class="btn btn-secondary btn-sm">Full Log</a>
          </div>
          <div class="card-body">
            <div class="timeline">
              \${s.auditLogs.slice(0, 4).map(a => \`
                <div class="timeline-item">
                  <div class="timeline-dot"></div>
                  <div class="timeline-title">\${a.action}</div>
                  <div class="timeline-time">\${a.timestamp} • \${a.user}</div>
                  <div class="timeline-desc">\${a.details}</div>
                </div>
              \`).join('')}
            </div>
          </div>
        </div>
      </div>
    </div>
  \`;

  // Initialize Leaflet Map
  setTimeout(() => initLeafletMap(true), 150);
}

/* === LEAFLET POLAR MAP INITIALIZER === */
function initLeafletMap(isAntarctica = true) {
  const mapDiv = document.getElementById('map-container');
  if (!mapDiv) return;

  if (PolarSync.mapInstance) {
    try { PolarSync.mapInstance.remove(); } catch (e) {}
    PolarSync.mapInstance = null;
  }

  // Fallback to SVG if Leaflet library CDN fails or blocked
  if (typeof L === 'undefined') {
    renderSvgMapFallback(mapDiv);
    return;
  }

  try {
    const center = isAntarctica ? [-70.0, 75.0] : [78.9, 11.9];
    const zoom = isAntarctica ? 3 : 5;

    const map = L.map('map-container', {
      center: center,
      zoom: zoom,
      minZoom: 2,
      maxZoom: 9
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors | PolarSync GIS'
    }).addTo(map);

    // Plot stations
    PolarSync.state.stations.forEach(st => {
      const isAnt = st.coordinates.includes('S');
      if ((isAntarctica && isAnt) || (!isAntarctica && !isAnt)) {
        // Parse approximate lat/lon
        let lat = isAnt ? -70.0 : 78.9;
        let lng = 75.0;
        if (st.name.includes('Bharati')) { lat = -69.4; lng = 76.18; }
        else if (st.name.includes('Maitri')) { lat = -70.76; lng = 11.73; }
        else if (st.name.includes('Dakshin')) { lat = -70.08; lng = 12.0; }
        else if (st.name.includes('Himadri')) { lat = 78.92; lng = 11.93; }

        const marker = L.circleMarker([lat, lng], {
          radius: 8,
          fillColor: '#0284c7',
          color: '#ffffff',
          weight: 2,
          opacity: 1,
          fillOpacity: 0.9
        }).addTo(map);

        marker.bindPopup(\`
          <div style="font-family: inherit; font-size: 12px; line-height: 1.4;">
            <strong style="color: #0a192f; font-size: 13px;">\${st.name}</strong><br>
            <strong>Type:</strong> \${st.type}<br>
            <strong>Coordinates:</strong> \${st.coordinates}<br>
            <strong>Personnel:</strong> \${st.personnelCount} / \${st.capacity}<br>
            <strong>Status:</strong> <span style="color: #10b981; font-weight: bold;">\${st.status}</span><br>
            <div style="margin-top: 6px;">
              <button onclick="window.location.hash='#/stations'" style="padding: 3px 8px; font-size: 11px; background: #0a192f; color: #fff; border: none; border-radius: 4px; cursor: pointer;">View Station Telemetry</button>
            </div>
          </div>
        \`);
      }
    });

    PolarSync.mapInstance = map;
  } catch (err) {
    console.warn('Leaflet initialization failed, falling back to SVG:', err);
    renderSvgMapFallback(mapDiv);
  }
}

function renderSvgMapFallback(mapDiv) {
  mapDiv.innerHTML = \`
    <div style="height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; background: linear-gradient(180deg, #071224 0%, #0d2342 100%); color: #e0f2fe; padding: 24px; text-align: center;">
      <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" stroke-width="1.5">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="2" y1="12" x2="22" y2="12"></line>
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
      </svg>
      <div class="font-bold text-lg" style="margin-top: 12px;">Polar Geographic Satellite Plotter</div>
      <div class="text-xs text-muted" style="max-width: 480px; margin-top: 6px; color: #94a3b8;">
        Live positions: Bharati Station (-69.40°, 76.18°E) • Maitri Station (-70.76°, 11.73°E) • Himadri (78.92°N, 11.93°E). Coordinates tracked via offline GPS telemetry cache.
      </div>
      <div class="flex gap-2" style="margin-top: 14px;">
        <span class="badge badge-success">Bharati: Active</span>
        <span class="badge badge-success">Maitri: Active</span>
        <span class="badge badge-success">Himadri: Active</span>
      </div>
    </div>
  \`;
}

/* =========================================================================
   EXPEDITIONS MODULE RENDERER
   ========================================================================= */
function renderExpeditions(container) {
  const s = PolarSync.state;

  container.innerHTML = \`
    <div class="card">
      <div class="card-header">
        <div class="card-title">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon></svg>
          Expedition Planning & Tracking Registry
        </div>
        <div class="flex gap-2">
          <button class="btn btn-primary" onclick="openCreateExpeditionModal()">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            Plan New Expedition
          </button>
        </div>
      </div>
      <div class="card-body">
        <!-- FILTER BAR -->
        <div class="filter-bar">
          <div class="filter-group">
            <input type="text" id="exp-search-input" class="input-control" style="width: 220px;" placeholder="Search expeditions..." oninput="filterExpeditionsTable()">
            <select id="exp-status-filter" class="select-control" style="width: 150px;" onchange="filterExpeditionsTable()">
              <option value="">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Planning">Planning</option>
              <option value="Completed">Completed</option>
            </select>
            <select id="exp-type-filter" class="select-control" style="width: 150px;" onchange="filterExpeditionsTable()">
              <option value="">All Types</option>
              <option value="Scientific Research">Scientific Research</option>
              <option value="Logistics Resupply">Logistics Resupply</option>
              <option value="Deep Field">Deep Field</option>
            </select>
          </div>
          <div class="flex gap-2">
            <button class="btn btn-secondary btn-sm" onclick="exportExpeditionsCsv()">Export CSV</button>
          </div>
        </div>

        <!-- EXPEDITIONS TABLE -->
        <div class="table-wrapper">
          <table class="data-table" id="expeditions-data-table">
            <thead>
              <tr>
                <th>Expedition ID</th>
                <th>Expedition Name</th>
                <th>Target Station</th>
                <th>Type</th>
                <th>Commander</th>
                <th>Dates</th>
                <th>Progress</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody id="expeditions-table-body">
              <!-- Rendered dynamically -->
            </tbody>
          </table>
        </div>
      </div>
    </div>
  \`;

  renderExpeditionsRows(s.expeditions);
}

function renderExpeditionsRows(list) {
  const tbody = document.getElementById('expeditions-table-body');
  if (!tbody) return;

  if (list.length === 0) {
    tbody.innerHTML = '<tr><td colspan="9" class="text-center text-muted" style="padding: 24px;">No matching expeditions found.</td></tr>';
    return;
  }

  tbody.innerHTML = list.map(e => \`
    <tr>
      <td><strong>\${e.id}</strong></td>
      <td>
        <a href="#/expedition-detail?id=\${e.id}" class="font-bold" style="color: var(--ice-blue); text-decoration: none;">\${e.name}</a>
        <div class="text-xs text-muted">\${e.allocatedBudget} • Team of \${e.assignedPersonnel.length}</div>
      </td>
      <td>\${e.station}</td>
      <td>\${e.type}</td>
      <td>\${e.commander}</td>
      <td class="text-xs">\${e.startDate} to \${e.endDate}</td>
      <td style="min-width: 110px;">
        <div class="flex items-center justify-between text-xs">
          <span>\${e.progress}%</span>
        </div>
        <div class="progress-bar-bg">
          <div class="progress-bar-fill \${e.progress === 100 ? 'success' : ''}" style="width: \${e.progress}%;"></div>
        </div>
      </td>
      <td>
        <span class="badge \${e.status === 'Active' ? 'badge-success' : (e.status === 'Completed' ? 'badge-info' : 'badge-warning')}">
          <span class="badge-dot"></span>\${e.status}
        </span>
      </td>
      <td>
        <div class="table-actions">
          <button class="btn btn-secondary btn-sm" onclick="window.location.hash='#/expedition-detail?id=\${e.id}'" title="View Full Details">View</button>
          <button class="btn btn-secondary btn-sm" onclick="openEditExpeditionModal('\${e.id}')" title="Edit">Edit</button>
          <button class="btn btn-danger-outline btn-sm" onclick="deleteExpedition('\${e.id}')" title="Delete">Delete</button>
        </div>
      </td>
    </tr>
  \`).join('');
}

function filterExpeditionsTable() {
  const search = (document.getElementById('exp-search-input')?.value || '').toLowerCase();
  const status = document.getElementById('exp-status-filter')?.value || '';
  const type = document.getElementById('exp-type-filter')?.value || '';

  const filtered = PolarSync.state.expeditions.filter(e => {
    const matchSearch = e.name.toLowerCase().includes(search) || e.id.toLowerCase().includes(search) || e.commander.toLowerCase().includes(search);
    const matchStatus = !status || e.status === status;
    const matchType = !type || e.type === type;
    return matchSearch && matchStatus && matchType;
  });

  renderExpeditionsRows(filtered);
}

function openCreateExpeditionModal() {
  const bodyHtml = \`
    <form id="create-exp-form">
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 12px;">
        <div>
          <label class="text-xs font-semibold text-muted">Expedition ID</label>
          <input type="text" id="m-exp-id" class="input-control" value="EXP-2026-\${Math.floor(10 + Math.random() * 90)}" required>
        </div>
        <div>
          <label class="text-xs font-semibold text-muted">Expedition Name</label>
          <input type="text" id="m-exp-name" class="input-control" placeholder="e.g. Larsen Ice Shelf Survey" required>
        </div>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 12px;">
        <div>
          <label class="text-xs font-semibold text-muted">Primary Station</label>
          <select id="m-exp-station" class="select-control">
            \${PolarSync.state.stations.map(st => \`<option value="\${st.name}">\${st.name}</option>\`).join('')}
          </select>
        </div>
        <div>
          <label class="text-xs font-semibold text-muted">Mission Type</label>
          <select id="m-exp-type" class="select-control">
            <option>Scientific Research</option>
            <option>Logistics Resupply</option>
            <option>Deep Field Traverse</option>
            <option>Infrastructure Overhaul</option>
          </select>
        </div>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 12px;">
        <div>
          <label class="text-xs font-semibold text-muted">Commander / Lead</label>
          <input type="text" id="m-exp-commander" class="input-control" value="Dr. Arvind Swaminathan" required>
        </div>
        <div>
          <label class="text-xs font-semibold text-muted">Budget</label>
          <input type="text" id="m-exp-budget" class="input-control" value="₹ 4.2 Cr">
        </div>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 12px;">
        <div>
          <label class="text-xs font-semibold text-muted">Start Date</label>
          <input type="date" id="m-exp-start" class="input-control" value="2026-11-01" required>
        </div>
        <div>
          <label class="text-xs font-semibold text-muted">End Date</label>
          <input type="date" id="m-exp-end" class="input-control" value="2027-03-31" required>
        </div>
      </div>

      <div style="margin-bottom: 12px;">
        <label class="text-xs font-semibold text-muted">Mission Objectives & Description</label>
        <textarea id="m-exp-desc" class="input-control" rows="3" placeholder="Core scientific and logistics scope..."></textarea>
      </div>
    </form>
  \`;

  openModal('Plan New Expedition', bodyHtml, '<button class="btn btn-primary" onclick="submitCreateExpedition()">Register Expedition</button>');
}

function submitCreateExpedition() {
  const id = document.getElementById('m-exp-id').value;
  const name = document.getElementById('m-exp-name').value;
  const station = document.getElementById('m-exp-station').value;
  const type = document.getElementById('m-exp-type').value;
  const commander = document.getElementById('m-exp-commander').value;
  const budget = document.getElementById('m-exp-budget').value;
  const start = document.getElementById('m-exp-start').value;
  const end = document.getElementById('m-exp-end').value;
  const desc = document.getElementById('m-exp-desc').value;

  if (!id || !name) {
    showToast('Please provide an Expedition ID and Name.', 'danger');
    return;
  }

  const newExp = {
    id: id,
    name: name,
    code: id,
    station: station,
    type: type,
    commander: commander,
    startDate: start,
    endDate: end,
    allocatedBudget: budget,
    status: 'Planning',
    progress: 10,
    assignedPersonnel: ['Dr. Arvind Swaminathan', 'Capt. R. Deshmukh'],
    description: desc || 'Polar research mission authorized under SIH-2026 polar logistics master plan.'
  };

  PolarSync.state.expeditions.unshift(newExp);
  PolarSync.logAudit('EXPEDITION_CREATED', 'Expeditions', id, \`Registered new expedition: \${name} at \${station}\`);
  PolarSync.notify('Operations', 'NEW EXPEDITION REGISTERED', \`\${id}: \${name} scheduled for \${start}\`);
  PolarSync.save();
  closeModal();
  renderExpeditions(document.getElementById('page-container'));
  showToast(\`Expedition \${id} planned successfully\`, 'success');
}

function openEditExpeditionModal(expId) {
  const exp = PolarSync.state.expeditions.find(e => e.id === expId);
  if (!exp) return;

  const bodyHtml = \`
    <form id="edit-exp-form">
      <div style="margin-bottom: 12px;">
        <label class="text-xs font-semibold text-muted">Expedition Name</label>
        <input type="text" id="edit-exp-name" class="input-control" value="\${exp.name}" required>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 12px;">
        <div>
          <label class="text-xs font-semibold text-muted">Status</label>
          <select id="edit-exp-status" class="select-control">
            <option \${exp.status === 'Planning' ? 'selected' : ''}>Planning</option>
            <option \${exp.status === 'Active' ? 'selected' : ''}>Active</option>
            <option \${exp.status === 'Completed' ? 'selected' : ''}>Completed</option>
          </select>
        </div>
        <div>
          <label class="text-xs font-semibold text-muted">Progress (%)</label>
          <input type="number" id="edit-exp-progress" class="input-control" min="0" max="100" value="\${exp.progress}">
        </div>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 12px;">
        <div>
          <label class="text-xs font-semibold text-muted">Commander</label>
          <input type="text" id="edit-exp-commander" class="input-control" value="\${exp.commander}">
        </div>
        <div>
          <label class="text-xs font-semibold text-muted">Target Station</label>
          <input type="text" id="edit-exp-station" class="input-control" value="\${exp.station}">
        </div>
      </div>
    </form>
  \`;

  openModal(\`Edit Expedition \${exp.id}\`, bodyHtml, \`<button class="btn btn-primary" onclick="submitEditExpedition('\${exp.id}')">Save Changes</button>\`);
}

function submitEditExpedition(expId) {
  const exp = PolarSync.state.expeditions.find(e => e.id === expId);
  if (!exp) return;

  exp.name = document.getElementById('edit-exp-name').value;
  exp.status = document.getElementById('edit-exp-status').value;
  exp.progress = parseInt(document.getElementById('edit-exp-progress').value) || 0;
  exp.commander = document.getElementById('edit-exp-commander').value;
  exp.station = document.getElementById('edit-exp-station').value;

  PolarSync.logAudit('EXPEDITION_UPDATED', 'Expeditions', expId, \`Updated parameters for \${exp.name}\`);
  PolarSync.save();
  closeModal();
  renderExpeditions(document.getElementById('page-container'));
  showToast(\`Updated expedition \${expId}\`, 'success');
}

function deleteExpedition(expId) {
  if (!confirm(\`Are you sure you want to decommission expedition record \${expId}?\`)) return;

  const idx = PolarSync.state.expeditions.findIndex(e => e.id === expId);
  if (idx !== -1) {
    const deleted = PolarSync.state.expeditions.splice(idx, 1)[0];
    PolarSync.logAudit('EXPEDITION_DELETED', 'Expeditions', expId, \`Decommissioned expedition \${deleted.name}\`);
    PolarSync.save();
    renderExpeditions(document.getElementById('page-container'));
    showToast(\`Expedition \${expId} removed\`, 'info');
  }
}

function exportExpeditionsCsv() {
  const headers = ['ExpeditionID', 'Name', 'Station', 'Type', 'Commander', 'StartDate', 'EndDate', 'Budget', 'Progress', 'Status'];
  const rows = PolarSync.state.expeditions.map(e => [
    e.id, e.name, e.station, e.type, e.commander, e.startDate, e.endDate, e.allocatedBudget, e.progress + '%', e.status
  ]);
  exportDataToCsv('PolarSync_Expeditions_Report.csv', headers, rows);
}

/* =========================================================================
   EXPEDITION DETAIL RENDERER (CONNECTED VIEW)
   ========================================================================= */
function renderExpeditionDetail(container, expId) {
  const s = PolarSync.state;
  const exp = s.expeditions.find(e => e.id === expId) || s.expeditions[0];

  if (!exp) {
    container.innerHTML = '<div class="card"><div class="card-body">Expedition not found.</div></div>';
    return;
  }

  // Linked items
  const linkedCargo = s.cargo.filter(c => c.expedition === exp.id || c.destination === exp.station);
  const linkedAssets = s.assets.filter(a => a.assignedExpedition === exp.id || a.location === exp.station);
  const linkedEmerg = s.emergencies.filter(e => e.expedition === exp.id || e.location === exp.station);
  const linkedTasks = s.tasks.filter(t => t.expedition === exp.id);

  container.innerHTML = \`
    <div style="margin-bottom: 16px;">
      <a href="#/expeditions" class="btn btn-secondary btn-sm">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
        Back to Expeditions
      </a>
    </div>

    <!-- EXPEDITION HEADER BANNER -->
    <div class="card">
      <div class="card-body">
        <div class="flex items-center justify-between flex-wrap gap-4">
          <div>
            <div class="flex items-center gap-2">
              <h1 class="text-2xl font-bold">\${exp.name}</h1>
              <span class="badge \${exp.status === 'Active' ? 'badge-success' : 'badge-warning'}">\${exp.status}</span>
            </div>
            <div class="text-sm text-muted" style="margin-top: 4px;">
              <strong>ID:</strong> \${exp.id} • <strong>Target Station:</strong> \${exp.station} • <strong>Mission Type:</strong> \${exp.type}
            </div>
          </div>
          <div class="flex gap-2">
            <button class="btn btn-secondary" onclick="openEditExpeditionModal('\${exp.id}')">Edit Expedition</button>
            <button class="btn btn-primary" onclick="openCreateCargoForExpModal('\${exp.id}', '\${exp.station}')">Dispatch Cargo</button>
          </div>
        </div>

        <div style="margin-top: 20px; display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 16px; background: var(--bg-subtle); padding: 16px; border-radius: var(--radius-sm);">
          <div>
            <div class="text-xs text-muted">EXPEDITION COMMANDER</div>
            <div class="font-bold text-sm">\${exp.commander}</div>
          </div>
          <div>
            <div class="text-xs text-muted">TIMELINE</div>
            <div class="font-bold text-sm">\${exp.startDate} → \${exp.endDate}</div>
          </div>
          <div>
            <div class="text-xs text-muted">ALLOCATED BUDGET</div>
            <div class="font-bold text-sm">\${exp.allocatedBudget}</div>
          </div>
          <div>
            <div class="text-xs text-muted">MISSION PROGRESS</div>
            <div class="font-bold text-sm">\${exp.progress}% Complete</div>
          </div>
        </div>

        <!-- PROGRESS BAR -->
        <div style="margin-top: 16px;">
          <div class="progress-bar-bg" style="height: 10px;">
            <div class="progress-bar-fill" style="width: \${exp.progress}%;"></div>
          </div>
        </div>

        <!-- LIFECYCLE STAGES -->
        <div style="display: grid; grid-template-columns: repeat(6, 1fr); gap: 8px; margin-top: 14px; text-align: center; font-size: 0.75rem;">
          <div style="padding: 6px; background: var(--status-green-bg); color: var(--status-green); font-weight: 600; border-radius: 4px;">1. Planning</div>
          <div style="padding: 6px; background: var(--status-green-bg); color: var(--status-green); font-weight: 600; border-radius: 4px;">2. Approval</div>
          <div style="padding: 6px; background: var(--status-green-bg); color: var(--status-green); font-weight: 600; border-radius: 4px;">3. Cargo Prep</div>
          <div style="padding: 6px; background: \${exp.progress >= 50 ? 'var(--status-green-bg)' : 'var(--bg-subtle)'}; color: \${exp.progress >= 50 ? 'var(--status-green)' : 'inherit'}; font-weight: 600; border-radius: 4px;">4. Departure</div>
          <div style="padding: 6px; background: \${exp.progress >= 70 ? 'var(--status-green-bg)' : 'var(--bg-subtle)'}; color: \${exp.progress >= 70 ? 'var(--status-green)' : 'inherit'}; font-weight: 600; border-radius: 4px;">5. Arrival</div>
          <div style="padding: 6px; background: \${exp.progress === 100 ? 'var(--status-green-bg)' : 'var(--bg-subtle)'}; color: \${exp.progress === 100 ? 'var(--status-green)' : 'inherit'}; font-weight: 600; border-radius: 4px;">6. Operations</div>
        </div>
      </div>
    </div>

    <!-- LINKED DATA TABS / SECTIONS -->
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px;">
      <!-- LINKED CARGO CONSIGNMENTS -->
      <div class="card">
        <div class="card-header">
          <div class="card-title">Assigned Cargo Shipments (\${linkedCargo.length})</div>
          <a href="#/cargo" class="btn btn-secondary btn-sm">Manage</a>
        </div>
        <div class="table-wrapper">
          <table class="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Description</th>
                <th>Priority</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              \${linkedCargo.slice(0, 5).map(c => \`
                <tr>
                  <td><strong>\${c.id}</strong></td>
                  <td>\${c.description}</td>
                  <td><span class="badge \${c.priority === 'Critical' ? 'badge-danger' : 'badge-neutral'}">\${c.priority}</span></td>
                  <td><span class="badge badge-info">\${c.status}</span></td>
                </tr>
              \`).join('')}
              \${linkedCargo.length === 0 ? '<tr><td colspan="4" class="text-center text-muted">No cargo assigned.</td></tr>' : ''}
            </tbody>
          </table>
        </div>
      </div>

      <!-- LINKED ASSETS & EQUIPMENT -->
      <div class="card">
        <div class="card-header">
          <div class="card-title">Deployed Mission Assets (\${linkedAssets.length})</div>
          <a href="#/assets" class="btn btn-secondary btn-sm">Manage</a>
        </div>
        <div class="table-wrapper">
          <table class="data-table">
            <thead>
              <tr>
                <th>Asset ID</th>
                <th>Name</th>
                <th>Category</th>
                <th>Condition</th>
              </tr>
            </thead>
            <tbody>
              \${linkedAssets.slice(0, 5).map(a => \`
                <tr>
                  <td><strong>\${a.id}</strong></td>
                  <td>\${a.name}</td>
                  <td>\${a.category}</td>
                  <td><span class="badge \${a.condition === 'Operational' ? 'badge-success' : 'badge-warning'}">\${a.condition}</span></td>
                </tr>
              \`).join('')}
              \${linkedAssets.length === 0 ? '<tr><td colspan="4" class="text-center text-muted">No assets linked to this mission.</td></tr>' : ''}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  \`;
}

function openCreateCargoForExpModal(expId, destination) {
  openCreateCargoModal({ expedition: expId, destination: destination });
}

/* =========================================================================
   CARGO TRACKING MODULE RENDERER
   ========================================================================= */
function renderCargo(container) {
  const s = PolarSync.state;

  container.innerHTML = \`
    <div class="card">
      <div class="card-header">
        <div class="card-title">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon></svg>
          Integrated Polar Cargo Manifest & Tracking Pipeline
        </div>
        <div class="flex gap-2">
          <button class="btn btn-primary" onclick="openCreateCargoModal()">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            Dispatch New Cargo
          </button>
        </div>
      </div>
      <div class="card-body">
        <!-- FILTER BAR -->
        <div class="filter-bar">
          <div class="filter-group">
            <input type="text" id="cargo-search-input" class="input-control" style="width: 220px;" placeholder="Search consignments..." oninput="filterCargoTable()">
            <select id="cargo-status-filter" class="select-control" style="width: 150px;" onchange="filterCargoTable()">
              <option value="">All Statuses</option>
              <option value="Preparing">Preparing</option>
              <option value="In Transit">In Transit</option>
              <option value="Delayed">Delayed</option>
              <option value="At Station">At Station</option>
              <option value="Delivered">Delivered</option>
            </select>
            <select id="cargo-category-filter" class="select-control" style="width: 150px;" onchange="filterCargoTable()">
              <option value="">All Categories</option>
              <option value="Fuel & Energy">Fuel & Energy</option>
              <option value="Scientific Equipment">Scientific Equipment</option>
              <option value="Life Support & Rations">Life Support</option>
              <option value="Vehicle Spares">Vehicle Spares</option>
            </select>
          </div>
          <div class="flex gap-2">
            <button class="btn btn-secondary btn-sm" onclick="exportCargoCsv()">Export Manifest CSV</button>
          </div>
        </div>

        <!-- CARGO TABLE -->
        <div class="table-wrapper">
          <table class="data-table" id="cargo-data-table">
            <thead>
              <tr>
                <th>Cargo ID</th>
                <th>Description</th>
                <th>Category</th>
                <th>Route (Origin → Dest)</th>
                <th>Transport</th>
                <th>Weight</th>
                <th>Priority</th>
                <th>ETA</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody id="cargo-table-body">
              <!-- Rendered dynamically -->
            </tbody>
          </table>
        </div>
      </div>
    </div>
  \`;

  renderCargoRows(s.cargo);
}

function renderCargoRows(list) {
  const tbody = document.getElementById('cargo-table-body');
  if (!tbody) return;

  if (list.length === 0) {
    tbody.innerHTML = '<tr><td colspan="10" class="text-center text-muted" style="padding: 24px;">No matching cargo records found.</td></tr>';
    return;
  }

  tbody.innerHTML = list.map(c => \`
    <tr>
      <td><strong>\${c.id}</strong></td>
      <td>
        <div class="font-bold">\${c.description}</div>
        <div class="text-xs text-muted">Expedition: \${c.expedition || 'Station Resupply'}</div>
      </td>
      <td>\${c.category}</td>
      <td class="text-xs">\${c.origin} → <strong>\${c.destination}</strong></td>
      <td>\${c.transportMode}</td>
      <td>\${c.weightKg.toLocaleString()} kg</td>
      <td>
        <span class="badge \${c.priority === 'Critical' ? 'badge-danger' : (c.priority === 'High' ? 'badge-warning' : 'badge-neutral')}">
          \${c.priority}
        </span>
      </td>
      <td class="text-xs font-semibold">\${c.eta}</td>
      <td>
        <span class="badge \${c.status === 'In Transit' ? 'badge-info' : (c.status === 'Delivered' ? 'badge-success' : (c.status === 'Delayed' ? 'badge-danger' : 'badge-warning'))}">
          <span class="badge-dot"></span>\${c.status}
        </span>
      </td>
      <td>
        <div class="table-actions">
          <button class="btn btn-secondary btn-sm" onclick="openCargoRouteModal('\${c.id}')" title="View Route Timeline">Route</button>
          <button class="btn btn-secondary btn-sm" onclick="openUpdateCargoStatusModal('\${c.id}')">Status</button>
          <button class="btn btn-danger-outline btn-sm" onclick="deleteCargo('\${c.id}')">Delete</button>
        </div>
      </td>
    </tr>
  \`).join('');
}

function filterCargoTable() {
  const search = (document.getElementById('cargo-search-input')?.value || '').toLowerCase();
  const status = document.getElementById('cargo-status-filter')?.value || '';
  const category = document.getElementById('cargo-category-filter')?.value || '';

  const filtered = PolarSync.state.cargo.filter(c => {
    const matchSearch = c.description.toLowerCase().includes(search) || c.id.toLowerCase().includes(search) || c.destination.toLowerCase().includes(search);
    const matchStatus = !status || c.status === status;
    const matchCat = !category || c.category === category;
    return matchSearch && matchStatus && matchCat;
  });

  renderCargoRows(filtered);
}

function openCreateCargoModal(defaults = {}) {
  const bodyHtml = \`
    <form id="create-cargo-form">
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 12px;">
        <div>
          <label class="text-xs font-semibold text-muted">Cargo Consignment ID</label>
          <input type="text" id="m-cargo-id" class="input-control" value="CRG-2026-\${Math.floor(100 + Math.random() * 900)}" required>
        </div>
        <div>
          <label class="text-xs font-semibold text-muted">Category</label>
          <select id="m-cargo-cat" class="select-control">
            <option>Fuel & Energy</option>
            <option>Life Support & Rations</option>
            <option>Scientific Equipment</option>
            <option>Vehicle Spares</option>
            <option>Medical Supplies</option>
          </select>
        </div>
      </div>

      <div style="margin-bottom: 12px;">
        <label class="text-xs font-semibold text-muted">Cargo Description</label>
        <input type="text" id="m-cargo-desc" class="input-control" placeholder="e.g. 10 Drums Jet A-1 Fuel for Bharati" required>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 12px;">
        <div>
          <label class="text-xs font-semibold text-muted">Origin</label>
          <input type="text" id="m-cargo-origin" class="input-control" value="Cape Town Port" required>
        </div>
        <div>
          <label class="text-xs font-semibold text-muted">Destination Station</label>
          <select id="m-cargo-dest" class="select-control">
            \${PolarSync.state.stations.map(st => \`<option value="\${st.name}" \${defaults.destination === st.name ? 'selected' : ''}>\${st.name}</option>\`).join('')}
          </select>
        </div>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; margin-bottom: 12px;">
        <div>
          <label class="text-xs font-semibold text-muted">Transport Mode</label>
          <select id="m-cargo-mode" class="select-control">
            <option>Icebreaker (S.A. Agulhas II)</option>
            <option>Cargo Vessel (Vasiliy Golovnin)</option>
            <option>Ski-Aircraft (Basler BT-67)</option>
            <option>Piston Snowcat Traverse</option>
          </select>
        </div>
        <div>
          <label class="text-xs font-semibold text-muted">Weight (kg)</label>
          <input type="number" id="m-cargo-weight" class="input-control" value="2500" required>
        </div>
        <div>
          <label class="text-xs font-semibold text-muted">Priority</label>
          <select id="m-cargo-priority" class="select-control">
            <option>Critical</option>
            <option selected>High</option>
            <option>Normal</option>
            <option>Low</option>
          </select>
        </div>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 12px;">
        <div>
          <label class="text-xs font-semibold text-muted">Expected Arrival (ETA)</label>
          <input type="date" id="m-cargo-eta" class="input-control" value="2026-11-20" required>
        </div>
        <div>
          <label class="text-xs font-semibold text-muted">Assigned Expedition</label>
          <input type="text" id="m-cargo-exp" class="input-control" value="\${defaults.expedition || 'EXP-2026-01'}">
        </div>
      </div>
    </form>
  \`;

  openModal('Dispatch New Cargo Consignment', bodyHtml, '<button class="btn btn-primary" onclick="submitCreateCargo()">Dispatch Shipment</button>');
}

function submitCreateCargo() {
  const id = document.getElementById('m-cargo-id').value;
  const desc = document.getElementById('m-cargo-desc').value;
  const cat = document.getElementById('m-cargo-cat').value;
  const origin = document.getElementById('m-cargo-origin').value;
  const dest = document.getElementById('m-cargo-dest').value;
  const mode = document.getElementById('m-cargo-mode').value;
  const weight = parseInt(document.getElementById('m-cargo-weight').value) || 1000;
  const priority = document.getElementById('m-cargo-priority').value;
  const eta = document.getElementById('m-cargo-eta').value;
  const exp = document.getElementById('m-cargo-exp').value;

  if (!id || !desc) {
    showToast('Please specify Cargo ID and Description.', 'danger');
    return;
  }

  const newCargo = {
    id: id,
    description: desc,
    category: cat,
    origin: origin,
    destination: dest,
    transportMode: mode,
    weightKg: weight,
    priority: priority,
    status: 'In Transit',
    eta: eta,
    currentLocation: 'Southern Ocean (Lat 58°S)',
    expedition: exp
  };

  PolarSync.state.cargo.unshift(newCargo);
  PolarSync.logAudit('CARGO_DISPATCHED', 'Cargo', id, \`Dispatched \${desc} to \${dest} via \${mode}\`);
  PolarSync.notify('Cargo', 'CARGO CONSIGNMENT DISPATCHED', \`Shipment \${id} en route to \${dest}. ETA: \${eta}\`);
  PolarSync.save();
  closeModal();
  renderCargo(document.getElementById('page-container'));
  showToast(\`Consignment \${id} dispatched successfully\`, 'success');
}

function openUpdateCargoStatusModal(cargoId) {
  const cargo = PolarSync.state.cargo.find(c => c.id === cargoId);
  if (!cargo) return;

  const bodyHtml = \`
    <div style="margin-bottom: 12px;">
      <div class="font-bold">\${cargo.id} — \${cargo.description}</div>
      <div class="text-xs text-muted">Destination: \${cargo.destination}</div>
    </div>

    <div style="margin-bottom: 12px;">
      <label class="text-xs font-semibold text-muted">Current Status</label>
      <select id="update-cargo-status" class="select-control">
        <option \${cargo.status === 'Preparing' ? 'selected' : ''}>Preparing</option>
        <option \${cargo.status === 'In Transit' ? 'selected' : ''}>In Transit</option>
        <option \${cargo.status === 'Delayed' ? 'selected' : ''}>Delayed</option>
        <option \${cargo.status === 'At Station' ? 'selected' : ''}>At Station</option>
        <option \${cargo.status === 'Delivered' ? 'selected' : ''}>Delivered</option>
      </select>
    </div>

    <div style="margin-bottom: 12px;">
      <label class="text-xs font-semibold text-muted">Current Geographic Location</label>
      <input type="text" id="update-cargo-loc" class="input-control" value="\${cargo.currentLocation || ''}">
    </div>
  \`;

  openModal(\`Update Cargo Status: \${cargo.id}\`, bodyHtml, \`<button class="btn btn-primary" onclick="submitUpdateCargoStatus('\${cargo.id}')">Update Telemetry</button>\`);
}

function submitUpdateCargoStatus(cargoId) {
  const cargo = PolarSync.state.cargo.find(c => c.id === cargoId);
  if (!cargo) return;

  const newStatus = document.getElementById('update-cargo-status').value;
  const newLoc = document.getElementById('update-cargo-loc').value;

  cargo.status = newStatus;
  cargo.currentLocation = newLoc;

  PolarSync.logAudit('CARGO_STATUS_UPDATED', 'Cargo', cargoId, \`Status changed to \${newStatus}, loc: \${newLoc}\`);
  PolarSync.save();
  closeModal();
  renderCargo(document.getElementById('page-container'));
  showToast(\`Updated status for \${cargoId}\`, 'success');
}

function openCargoRouteModal(cargoId) {
  const cargo = PolarSync.state.cargo.find(c => c.id === cargoId);
  if (!cargo) return;

  const bodyHtml = \`
    <div style="margin-bottom: 16px;">
      <div class="text-lg font-bold">\${cargo.id}: \${cargo.description}</div>
      <div class="text-xs text-muted">\${cargo.category} • \${cargo.weightKg.toLocaleString()} kg • Transport: \${cargo.transportMode}</div>
    </div>

    <div class="timeline" style="margin-top: 20px;">
      <div class="timeline-item">
        <div class="timeline-dot success"></div>
        <div class="timeline-title">Stage 1: Manifest Registered & Loaded</div>
        <div class="timeline-time">\${cargo.origin} • Departure Confirmed</div>
        <div class="timeline-desc">Customs cleared, cold-resistant packaging verified for polar conditions.</div>
      </div>
      <div class="timeline-item">
        <div class="timeline-dot \${cargo.status === 'In Transit' || cargo.status === 'Delivered' ? 'success' : ''}"></div>
        <div class="timeline-title">Stage 2: Transit via \${cargo.transportMode}</div>
        <div class="timeline-time">Position: \${cargo.currentLocation || 'En Route'}</div>
        <div class="timeline-desc">Status: \${cargo.status}. Sea ice and weather telemetry monitored continuously.</div>
      </div>
      <div class="timeline-item">
        <div class="timeline-dot \${cargo.status === 'Delivered' ? 'success' : ''}"></div>
        <div class="timeline-title">Stage 3: Offload & Station Acceptance</div>
        <div class="timeline-time">Target: \${cargo.destination} • ETA: \${cargo.eta}</div>
        <div class="timeline-desc">Handover to station logistics lead for inventory integration.</div>
      </div>
    </div>
  \`;

  openModal(\`Shipment Route: \${cargo.id}\`, bodyHtml);
}

function deleteCargo(cargoId) {
  if (!confirm(\`Delete cargo shipment record \${cargoId}?\`)) return;

  const idx = PolarSync.state.cargo.findIndex(c => c.id === cargoId);
  if (idx !== -1) {
    PolarSync.state.cargo.splice(idx, 1);
    PolarSync.logAudit('CARGO_DELETED', 'Cargo', cargoId, 'Deleted consignment manifest entry');
    PolarSync.save();
    renderCargo(document.getElementById('page-container'));
    showToast(\`Consignment \${cargoId} deleted\`, 'info');
  }
}

function exportCargoCsv() {
  const headers = ['CargoID', 'Description', 'Category', 'Origin', 'Destination', 'TransportMode', 'WeightKg', 'Priority', 'Status', 'ETA', 'Location'];
  const rows = PolarSync.state.cargo.map(c => [
    c.id, c.description, c.category, c.origin, c.destination, c.transportMode, c.weightKg, c.priority, c.status, c.eta, c.currentLocation
  ]);
  exportDataToCsv('PolarSync_Cargo_Manifest.csv', headers, rows);
}

/* =========================================================================
   INVENTORY MODULE RENDERER
   ========================================================================= */
function renderInventory(container) {
  const s = PolarSync.state;
  const total = s.inventory.length;
  const critical = s.inventory.filter(i => i.status === 'Critical').length;
  const low = s.inventory.filter(i => i.status === 'Low Stock').length;
  const healthy = s.inventory.filter(i => i.status === 'Healthy').length;

  container.innerHTML = \`
    <!-- KPI SUMMARY STRIP -->
    <div class="kpi-grid">
      <div class="kpi-card">
        <div class="kpi-icon-box" style="background: #e0f2fe; color: #0284c7;">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path></svg>
        </div>
        <div>
          <div class="kpi-label">Total Catalogued Items</div>
          <div class="kpi-value">\${total}</div>
          <div class="kpi-sub">Across 10 Stations</div>
        </div>
      </div>

      <div class="kpi-card">
        <div class="kpi-icon-box" style="background: #fee2e2; color: #ef4444;">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"></polygon><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
        </div>
        <div>
          <div class="kpi-label">Critical Reserves</div>
          <div class="kpi-value" style="color: #ef4444;">\${critical}</div>
          <div class="kpi-sub">Below Safe Threshold</div>
        </div>
      </div>

      <div class="kpi-card">
        <div class="kpi-icon-box" style="background: #fef3c7; color: #d97706;">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
        </div>
        <div>
          <div class="kpi-label">Low Stock Warnings</div>
          <div class="kpi-value" style="color: #d97706;">\${low}</div>
          <div class="kpi-sub">Reorder Recommended</div>
        </div>
      </div>

      <div class="kpi-card">
        <div class="kpi-icon-box" style="background: #ecfdf5; color: #10b981;">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
        </div>
        <div>
          <div class="kpi-label">Optimal Health</div>
          <div class="kpi-value" style="color: #10b981;">\${healthy}</div>
          <div class="kpi-sub">Nominal Life Support</div>
        </div>
      </div>
    </div>

    <!-- INVENTORY TABLE CARD -->
    <div class="card">
      <div class="card-header">
        <div class="card-title">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path></svg>
          Life-Support & Station Inventory Stock Ledger
        </div>
        <div class="flex gap-2">
          <button class="btn btn-primary" onclick="openCreateInventoryModal()">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            Add Inventory Item
          </button>
        </div>
      </div>
      <div class="card-body">
        <!-- FILTER BAR -->
        <div class="filter-bar">
          <div class="filter-group">
            <input type="text" id="inv-search-input" class="input-control" style="width: 220px;" placeholder="Search stock items..." oninput="filterInventoryTable()">
            <select id="inv-station-filter" class="select-control" style="width: 160px;" onchange="filterInventoryTable()">
              <option value="">All Stations</option>
              \${PolarSync.state.stations.map(st => \`<option value="\${st.name}">\${st.name}</option>\`).join('')}
            </select>
            <select id="inv-status-filter" class="select-control" style="width: 140px;" onchange="filterInventoryTable()">
              <option value="">All Statuses</option>
              <option value="Critical">Critical</option>
              <option value="Low Stock">Low Stock</option>
              <option value="Healthy">Healthy</option>
            </select>
            <select id="inv-category-filter" class="select-control" style="width: 140px;" onchange="filterInventoryTable()">
              <option value="">All Categories</option>
              <option value="Fuel">Fuel</option>
              <option value="Rations">Rations</option>
              <option value="Medical">Medical</option>
              <option value="Spares">Spares</option>
            </select>
          </div>
          <div class="flex gap-2">
            <button class="btn btn-secondary btn-sm" onclick="exportInventoryCsv()">Export CSV</button>
          </div>
        </div>

        <!-- TABLE -->
        <div class="table-wrapper">
          <table class="data-table" id="inventory-data-table">
            <thead>
              <tr>
                <th>Item ID</th>
                <th>Item Name</th>
                <th>Category</th>
                <th>Station</th>
                <th>Available</th>
                <th>Min Threshold</th>
                <th>Stock Ratio</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody id="inventory-table-body">
              <!-- Rendered dynamically -->
            </tbody>
          </table>
        </div>
      </div>
    </div>
  \`;

  renderInventoryRows(s.inventory);
}

function renderInventoryRows(list) {
  const tbody = document.getElementById('inventory-table-body');
  if (!tbody) return;

  if (list.length === 0) {
    tbody.innerHTML = '<tr><td colspan="9" class="text-center text-muted" style="padding: 24px;">No matching inventory items found.</td></tr>';
    return;
  }

  tbody.innerHTML = list.map(i => {
    const ratio = Math.min(100, Math.round((i.available / (i.minimum * 2)) * 100));
    return \`
      <tr>
        <td><strong>\${i.id}</strong></td>
        <td><strong>\${i.item}</strong></td>
        <td>\${i.category}</td>
        <td>\${i.station}</td>
        <td class="font-bold">\${i.available.toLocaleString()} \${i.unit}</td>
        <td class="text-muted">\${i.minimum.toLocaleString()} \${i.unit}</td>
        <td style="min-width: 100px;">
          <div class="progress-bar-bg">
            <div class="progress-bar-fill \${i.status === 'Critical' ? 'danger' : (i.status === 'Low Stock' ? 'warning' : 'success')}" style="width: \${ratio}%;"></div>
          </div>
        </td>
        <td>
          <span class="badge \${i.status === 'Critical' ? 'badge-danger' : (i.status === 'Low Stock' ? 'badge-warning' : 'badge-success')}">
            <span class="badge-dot"></span>\${i.status}
          </span>
        </td>
        <td>
          <div class="table-actions">
            <button class="btn btn-secondary btn-sm" onclick="openAdjustInventoryModal('\${i.id}')" title="Adjust Quantity">Adjust Qty</button>
            <button class="btn btn-danger-outline btn-sm" onclick="deleteInventoryItem('\${i.id}')">Delete</button>
          </div>
        </td>
      </tr>
    \`;
  }).join('');
}

function filterInventoryTable() {
  const search = (document.getElementById('inv-search-input')?.value || '').toLowerCase();
  const station = document.getElementById('inv-station-filter')?.value || '';
  const status = document.getElementById('inv-status-filter')?.value || '';
  const category = document.getElementById('inv-category-filter')?.value || '';

  const filtered = PolarSync.state.inventory.filter(i => {
    const matchSearch = i.item.toLowerCase().includes(search) || i.id.toLowerCase().includes(search);
    const matchStation = !station || i.station === station;
    const matchStatus = !status || i.status === status;
    const matchCat = !category || i.category === category;
    return matchSearch && matchStation && matchStatus && matchCat;
  });

  renderInventoryRows(filtered);
}

function openAdjustInventoryModal(itemId) {
  const item = PolarSync.state.inventory.find(i => i.id === itemId);
  if (!item) return;

  const bodyHtml = \`
    <div style="margin-bottom: 12px;">
      <div class="font-bold text-lg">\${item.item}</div>
      <div class="text-xs text-muted">Station: \${item.station} • Category: \${item.category}</div>
      <div class="text-xs text-muted" style="margin-top: 4px;">Current Stock: <strong>\${item.available} \${item.unit}</strong> (Safe Threshold: \${item.minimum} \${item.unit})</div>
    </div>

    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 12px;">
      <div>
        <label class="text-xs font-semibold text-muted">Adjustment Action</label>
        <select id="adj-inv-type" class="select-control">
          <option value="add">Add Stock (Resupply / Restock)</option>
          <option value="subtract">Deduct Stock (Consumed / Expended)</option>
          <option value="set">Set Exact Count</option>
        </select>
      </div>
      <div>
        <label class="text-xs font-semibold text-muted">Amount (\${item.unit})</label>
        <input type="number" id="adj-inv-amount" class="input-control" value="100" min="1" required>
      </div>
    </div>

    <div style="margin-bottom: 12px;">
      <label class="text-xs font-semibold text-muted">Reason / Log Reference</label>
      <input type="text" id="adj-inv-reason" class="input-control" placeholder="e.g. Monthly station consumption audit" required>
    </div>
  \`;

  openModal(\`Adjust Stock: \${item.id}\`, bodyHtml, \`<button class="btn btn-primary" onclick="submitAdjustInventory('\${item.id}')">Apply Stock Adjustment</button>\`);
}

function submitAdjustInventory(itemId) {
  const item = PolarSync.state.inventory.find(i => i.id === itemId);
  if (!item) return;

  const type = document.getElementById('adj-inv-type').value;
  const amount = parseInt(document.getElementById('adj-inv-amount').value) || 0;
  const reason = document.getElementById('adj-inv-reason').value || 'Manual telemetry update';

  const oldVal = item.available;
  if (type === 'add') {
    item.available += amount;
  } else if (type === 'subtract') {
    item.available = Math.max(0, item.available - amount);
  } else if (type === 'set') {
    item.available = amount;
  }

  // Recalculate status
  if (item.available <= 0) {
    item.status = 'Out of Stock';
  } else if (item.available <= item.minimum) {
    item.status = 'Critical';
  } else if (item.available <= item.minimum * 1.5) {
    item.status = 'Low Stock';
  } else {
    item.status = 'Healthy';
  }

  PolarSync.logAudit('INVENTORY_ADJUSTED', 'Inventory', itemId, \`Adjusted \${item.item} at \${item.station} from \${oldVal} to \${item.available} \${item.unit}. Reason: \${reason}\`);
  PolarSync.save();
  closeModal();
  renderInventory(document.getElementById('page-container'));
  showToast(\`Stock updated for \${item.item}\`, 'success');
}

function openCreateInventoryModal() {
  const bodyHtml = \`
    <form id="create-inv-form">
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 12px;">
        <div>
          <label class="text-xs font-semibold text-muted">Item ID</label>
          <input type="text" id="m-inv-id" class="input-control" value="INV-\${Math.floor(200 + Math.random() * 800)}" required>
        </div>
        <div>
          <label class="text-xs font-semibold text-muted">Category</label>
          <select id="m-inv-cat" class="select-control">
            <option>Fuel</option>
            <option>Rations</option>
            <option>Medical</option>
            <option>Spares</option>
            <option>Scientific</option>
          </select>
        </div>
      </div>

      <div style="margin-bottom: 12px;">
        <label class="text-xs font-semibold text-muted">Item Name</label>
        <input type="text" id="m-inv-name" class="input-control" placeholder="e.g. Lithium High-Cold Batteries" required>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 12px;">
        <div>
          <label class="text-xs font-semibold text-muted">Station</label>
          <select id="m-inv-station" class="select-control">
            \${PolarSync.state.stations.map(st => \`<option value="\${st.name}">\${st.name}</option>\`).join('')}
          </select>
        </div>
        <div>
          <label class="text-xs font-semibold text-muted">Unit of Measure</label>
          <input type="text" id="m-inv-unit" class="input-control" value="Units" required>
        </div>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 12px;">
        <div>
          <label class="text-xs font-semibold text-muted">Initial Quantity</label>
          <input type="number" id="m-inv-qty" class="input-control" value="100" required>
        </div>
        <div>
          <label class="text-xs font-semibold text-muted">Minimum Reserve Threshold</label>
          <input type="number" id="m-inv-min" class="input-control" value="25" required>
        </div>
      </div>
    </form>
  \`;

  openModal('Add Life-Support Inventory Item', bodyHtml, '<button class="btn btn-primary" onclick="submitCreateInventory()">Record Item</button>');
}

function submitCreateInventory() {
  const id = document.getElementById('m-inv-id').value;
  const name = document.getElementById('m-inv-name').value;
  const cat = document.getElementById('m-inv-cat').value;
  const station = document.getElementById('m-inv-station').value;
  const unit = document.getElementById('m-inv-unit').value;
  const qty = parseInt(document.getElementById('m-inv-qty').value) || 0;
  const min = parseInt(document.getElementById('m-inv-min').value) || 0;

  if (!id || !name) {
    showToast('Item ID and Name are required.', 'danger');
    return;
  }

  const newItem = {
    id: id,
    item: name,
    category: cat,
    station: station,
    available: qty,
    minimum: min,
    unit: unit,
    status: qty <= min ? 'Critical' : (qty <= min * 1.5 ? 'Low Stock' : 'Healthy'),
    lastUpdated: new Date().toISOString().split('T')[0]
  };

  PolarSync.state.inventory.unshift(newItem);
  PolarSync.logAudit('INVENTORY_ITEM_CREATED', 'Inventory', id, \`Registered \${name} at \${station}\`);
  PolarSync.save();
  closeModal();
  renderInventory(document.getElementById('page-container'));
  showToast(\`Added \${name} to inventory\`, 'success');
}

function deleteInventoryItem(itemId) {
  if (!confirm(\`Delete inventory item \${itemId} from stock register?\`)) return;

  const idx = PolarSync.state.inventory.findIndex(i => i.id === itemId);
  if (idx !== -1) {
    PolarSync.state.inventory.splice(idx, 1);
    PolarSync.logAudit('INVENTORY_ITEM_DELETED', 'Inventory', itemId, 'Item removed from ledger');
    PolarSync.save();
    renderInventory(document.getElementById('page-container'));
    showToast(\`Inventory item \${itemId} removed\`, 'info');
  }
}

function exportInventoryCsv() {
  const headers = ['ItemID', 'ItemName', 'Category', 'Station', 'Available', 'Unit', 'Minimum', 'Status', 'LastUpdated'];
  const rows = PolarSync.state.inventory.map(i => [
    i.id, i.item, i.category, i.station, i.available, i.unit, i.minimum, i.status, i.lastUpdated
  ]);
  exportDataToCsv('PolarSync_Inventory_Stock.csv', headers, rows);
}
`;
}

module.exports = { getRenderersPart1 };
