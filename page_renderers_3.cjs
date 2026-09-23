/**
 * Page Renderers Part 3: Analytics, Notifications, Documents, Users, Audit, Settings
 */

function getRenderersPart3() {
  return `
/* =========================================================================
   ANALYTICS & INTELLIGENCE MODULE (CHART.JS SUITE)
   ========================================================================= */
let currentAnalyticsRange = '30d';

function renderAnalytics(container) {
  const s = PolarSync.state;

  container.innerHTML = \`
    <div class="card">
      <div class="card-header">
        <div class="card-title">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>
          Integrated Polar Logistics Analytics & Operational Intelligence
        </div>
        <div class="flex gap-2">
          <select id="analytics-range-select" class="select-control" style="width: 140px;" onchange="setAnalyticsRange(this.value)">
            <option value="7d" \${currentAnalyticsRange === '7d' ? 'selected' : ''}>Past 7 Days</option>
            <option value="30d" \${currentAnalyticsRange === '30d' ? 'selected' : ''}>Past 30 Days</option>
            <option value="90d" \${currentAnalyticsRange === '90d' ? 'selected' : ''}>Past Quarter</option>
            <option value="1y" \${currentAnalyticsRange === '1y' ? 'selected' : ''}>Annual 2026</option>
          </select>
          <button class="btn btn-secondary btn-sm" onclick="exportAnalyticsReport()">Export Intelligence Report</button>
        </div>
      </div>
      <div class="card-body">
        <!-- 6 INTERACTIVE ANALYTICAL CHARTS GRID -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(420px, 1fr)); gap: 24px;">
          <!-- CHART 1: EXPEDITION STATUS BREAKDOWN -->
          <div class="card" style="margin-bottom: 0;">
            <div class="card-header">
              <div class="font-bold text-sm">Expedition Status Distribution</div>
            </div>
            <div class="card-body" style="height: 260px; position: relative;">
              <canvas id="chart-expeditions"></canvas>
            </div>
          </div>

          <!-- CHART 2: CARGO BY TRANSPORT MODE -->
          <div class="card" style="margin-bottom: 0;">
            <div class="card-header">
              <div class="font-bold text-sm">Cargo Shipments by Transport Mode</div>
            </div>
            <div class="card-body" style="height: 260px; position: relative;">
              <canvas id="chart-cargo-mode"></canvas>
            </div>
          </div>

          <!-- CHART 3: INVENTORY CATEGORY HEALTH -->
          <div class="card" style="margin-bottom: 0;">
            <div class="card-header">
              <div class="font-bold text-sm">Inventory Health & Depletion Status</div>
            </div>
            <div class="card-body" style="height: 260px; position: relative;">
              <canvas id="chart-inventory-health"></canvas>
            </div>
          </div>

          <!-- CHART 4: ASSET OPERATIONAL CONDITIONS -->
          <div class="card" style="margin-bottom: 0;">
            <div class="card-header">
              <div class="font-bold text-sm">Asset Mechanical Condition Split</div>
            </div>
            <div class="card-body" style="height: 260px; position: relative;">
              <canvas id="chart-assets-condition"></canvas>
            </div>
          </div>

          <!-- CHART 5: PERSONNEL STATION DEPLOYMENTS -->
          <div class="card" style="margin-bottom: 0;">
            <div class="card-header">
              <div class="font-bold text-sm">Personnel Distribution Across Bases</div>
            </div>
            <div class="card-body" style="height: 260px; position: relative;">
              <canvas id="chart-personnel-station"></canvas>
            </div>
          </div>

          <!-- CHART 6: HISTORICAL LOGISTICS & INCIDENT TREND -->
          <div class="card" style="margin-bottom: 0;">
            <div class="card-header">
              <div class="font-bold text-sm">Monthly Logistics Throughput & Incident Trend</div>
            </div>
            <div class="card-body" style="height: 260px; position: relative;">
              <canvas id="chart-logistics-trend"></canvas>
            </div>
          </div>
        </div>
      </div>
    </div>
  \`;

  setTimeout(() => initAllAnalyticsCharts(), 100);
}

function setAnalyticsRange(range) {
  currentAnalyticsRange = range;
  renderAnalytics(document.getElementById('page-container'));
}

function initAllAnalyticsCharts() {
  if (typeof Chart === 'undefined') {
    console.warn('Chart.js CDN unavailable. Charts cannot be initialized.');
    return;
  }

  const s = PolarSync.state;

  // Chart 1: Expeditions
  const expActive = s.expeditions.filter(e => e.status === 'Active').length;
  const expPlan = s.expeditions.filter(e => e.status === 'Planning').length;
  const expComp = s.expeditions.filter(e => e.status === 'Completed').length;

  const ctx1 = document.getElementById('chart-expeditions');
  if (ctx1) {
    PolarSync.activeChartInstances.exp = new Chart(ctx1, {
      type: 'doughnut',
      data: {
        labels: ['Active', 'Planning', 'Completed'],
        datasets: [{
          data: [expActive, expPlan, expComp],
          backgroundColor: ['#10b981', '#f59e0b', '#3b82f6'],
          borderWidth: 2,
          borderColor: '#ffffff'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { position: 'bottom' } }
      }
    });
  }

  // Chart 2: Cargo Mode
  const modeCounts = {};
  s.cargo.forEach(c => {
    const m = c.transportMode.split(' ')[0] || 'Vessel';
    modeCounts[m] = (modeCounts[m] || 0) + 1;
  });

  const ctx2 = document.getElementById('chart-cargo-mode');
  if (ctx2) {
    PolarSync.activeChartInstances.cargo = new Chart(ctx2, {
      type: 'bar',
      data: {
        labels: Object.keys(modeCounts),
        datasets: [{
          label: 'Shipments',
          data: Object.values(modeCounts),
          backgroundColor: '#0284c7',
          borderRadius: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: true } }
      }
    });
  }

  // Chart 3: Inventory Health
  const invHealthy = s.inventory.filter(i => i.status === 'Healthy').length;
  const invLow = s.inventory.filter(i => i.status === 'Low Stock').length;
  const invCrit = s.inventory.filter(i => i.status === 'Critical' || i.status === 'Out of Stock').length;

  const ctx3 = document.getElementById('chart-inventory-health');
  if (ctx3) {
    PolarSync.activeChartInstances.inv = new Chart(ctx3, {
      type: 'pie',
      data: {
        labels: ['Healthy (Nominal)', 'Low Stock', 'Critical / Out'],
        datasets: [{
          data: [invHealthy, invLow, invCrit],
          backgroundColor: ['#10b981', '#f59e0b', '#ef4444'],
          borderWidth: 2,
          borderColor: '#ffffff'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { position: 'bottom' } }
      }
    });
  }

  // Chart 4: Asset Condition
  const astOp = s.assets.filter(a => a.condition === 'Operational').length;
  const astMaint = s.assets.filter(a => a.condition === 'Maintenance').length;
  const astStby = s.assets.filter(a => a.condition === 'Standby').length;

  const ctx4 = document.getElementById('chart-assets-condition');
  if (ctx4) {
    PolarSync.activeChartInstances.ast = new Chart(ctx4, {
      type: 'bar',
      data: {
        labels: ['Operational', 'In Maintenance', 'Standby'],
        datasets: [{
          label: 'Assets',
          data: [astOp, astMaint, astStby],
          backgroundColor: ['#10b981', '#ef4444', '#f59e0b'],
          borderRadius: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: true } }
      }
    });
  }

  // Chart 5: Personnel Station
  const stCounts = {};
  s.personnel.forEach(p => {
    stCounts[p.location] = (stCounts[p.location] || 0) + 1;
  });

  const ctx5 = document.getElementById('chart-personnel-station');
  if (ctx5) {
    PolarSync.activeChartInstances.per = new Chart(ctx5, {
      type: 'polarArea',
      data: {
        labels: Object.keys(stCounts),
        datasets: [{
          data: Object.values(stCounts),
          backgroundColor: ['#0284c7', '#38bdf8', '#0ea5e9', '#6366f1', '#a855f7', '#ec4899', '#f43f5e', '#10b981', '#f59e0b', '#64748b']
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { position: 'bottom' } }
      }
    });
  }

  // Chart 6: Trend
  const ctx6 = document.getElementById('chart-logistics-trend');
  if (ctx6) {
    PolarSync.activeChartInstances.trend = new Chart(ctx6, {
      type: 'line',
      data: {
        labels: ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov'],
        datasets: [
          {
            label: 'Cargo Tonnage (MT)',
            data: [120, 180, 240, 310, 420, 390, 480],
            borderColor: '#0284c7',
            backgroundColor: 'rgba(2, 132, 199, 0.1)',
            fill: true,
            tension: 0.3
          },
          {
            label: 'Emergency Incidents',
            data: [1, 2, 0, 3, 1, 2, 1],
            borderColor: '#ef4444',
            backgroundColor: 'transparent',
            tension: 0.3
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { position: 'bottom' } },
        scales: { y: { beginAtZero: true } }
      }
    });
  }
}

function exportAnalyticsReport() {
  const headers = ['Metric', 'CurrentValue', 'ContextNotes'];
  const s = PolarSync.state;
  const rows = [
    ['Active Expeditions', s.expeditions.filter(e=>e.status==='Active').length, 'Ongoing field research missions'],
    ['Cargo Shipments in Flight', s.cargo.filter(c=>c.status==='In Transit').length, 'Active consignments en route'],
    ['Critical Inventory Items', s.inventory.filter(i=>i.status==='Critical').length, 'Stock below minimum safety reserves'],
    ['Deployed Personnel', s.personnel.filter(p=>p.status==='Deployed').length, 'Station and traverse field teams'],
    ['Total Station Assets', s.assets.length, 'Capital heavy machinery & equipment'],
    ['Active Emergencies', s.emergencies.filter(e=>e.status!=='Resolved').length, 'Requiring operational response']
  ];
  exportDataToCsv('PolarSync_Analytics_Summary.csv', headers, rows);
}

/* =========================================================================
   NOTIFICATIONS MODULE RENDERER
   ========================================================================= */
function renderNotifications(container) {
  const notifs = PolarSync.state.notifications;

  container.innerHTML = \`
    <div class="card">
      <div class="card-header">
        <div class="card-title">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
          System Notifications & Dispatch Alerts
        </div>
        <div class="flex gap-2">
          <button class="btn btn-secondary btn-sm" onclick="markAllNotificationsRead(); renderNotifications(document.getElementById('page-container'));">Mark All as Read</button>
        </div>
      </div>
      <div class="card-body">
        <div style="display: flex; flex-direction: column; gap: 10px;">
          \${notifs.map(n => \`
            <div style="padding: 14px; background: \${n.read ? 'var(--bg-subtle)' : 'var(--ice-blue-light)'}; border: 1px solid var(--border-color); border-radius: var(--radius-sm); display: flex; justify-content: space-between; align-items: flex-start;">
              <div>
                <div class="flex items-center gap-2">
                  <span class="badge \${n.category === 'Emergency' ? 'badge-danger' : (n.category === 'Cargo' ? 'badge-info' : 'badge-neutral')}">\${n.category}</span>
                  <span class="font-bold text-sm">\${n.title}</span>
                </div>
                <div class="text-xs text-muted" style="margin-top: 4px;">\${n.message}</div>
              </div>
              <div class="text-xs text-muted font-semibold">\${n.time}</div>
            </div>
          \`).join('')}
        </div>
      </div>
    </div>
  \`;
}

/* =========================================================================
   DOCUMENTS & COMPLIANCE MODULE RENDERER
   ========================================================================= */
function renderDocuments(container) {
  const s = PolarSync.state;

  container.innerHTML = \`
    <div class="card">
      <div class="card-header">
        <div class="card-title">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line></svg>
          Polar Expedition Compliance Documents & Environmental Permits
        </div>
        <div class="flex gap-2">
          <button class="btn btn-primary" onclick="openUploadDocumentModal()">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            Upload Document
          </button>
        </div>
      </div>
      <div class="card-body">
        <div class="table-wrapper">
          <table class="data-table">
            <thead>
              <tr>
                <th>Document ID</th>
                <th>Title</th>
                <th>Category</th>
                <th>Expedition</th>
                <th>Upload Date</th>
                <th>File Size</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              \${s.documents.map(d => \`
                <tr>
                  <td><strong>\${d.id}</strong></td>
                  <td><strong>\${d.title}</strong></td>
                  <td><span class="badge badge-neutral">\${d.category}</span></td>
                  <td>\${d.expedition}</td>
                  <td class="text-xs">\${d.uploadedAt}</td>
                  <td class="text-xs">\${d.size}</td>
                  <td>
                    <button class="btn btn-secondary btn-sm" onclick="showToast('Simulated download: ' + '\${d.title}', 'success')">Download</button>
                  </td>
                </tr>
              \`).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  \`;
}

function openUploadDocumentModal() {
  const bodyHtml = \`
    <form id="upload-doc-form">
      <div style="margin-bottom: 12px;">
        <label class="text-xs font-semibold text-muted">Document Title</label>
        <input type="text" id="doc-title" class="input-control" placeholder="e.g. Antarctic Treaty Environmental Impact Assessment" required>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 12px;">
        <div>
          <label class="text-xs font-semibold text-muted">Category</label>
          <select id="doc-cat" class="select-control">
            <option>Compliance & Treaty</option>
            <option>Flight Manifest</option>
            <option>Cargo Bill of Lading</option>
            <option>Scientific Charter</option>
          </select>
        </div>
        <div>
          <label class="text-xs font-semibold text-muted">Expedition</label>
          <input type="text" id="doc-exp" class="input-control" value="EXP-2026-01">
        </div>
      </div>

      <div style="border: 2px dashed var(--border-color); border-radius: var(--radius-sm); padding: 24px; text-align: center; margin-bottom: 12px;">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-bottom: 8px; color: var(--text-muted);"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
        <div class="text-sm font-semibold">Select PDF / DOCX document to attach</div>
        <div class="text-xs text-muted">Simulated file upload for hackathon prototype</div>
      </div>
    </form>
  \`;

  openModal('Upload Logistics Document', bodyHtml, '<button class="btn btn-primary" onclick="submitUploadDocument()">Save Document</button>');
}

function submitUploadDocument() {
  const title = document.getElementById('doc-title').value;
  const cat = document.getElementById('doc-cat').value;
  const exp = document.getElementById('doc-exp').value;

  if (!title) {
    showToast('Document Title is required.', 'danger');
    return;
  }

  const newDoc = {
    id: 'DOC-' + Math.floor(100 + Math.random() * 900),
    title: title,
    category: cat,
    uploadedAt: new Date().toISOString().split('T')[0],
    size: '1.8 MB',
    expedition: exp
  };

  PolarSync.state.documents.unshift(newDoc);
  PolarSync.logAudit('DOCUMENT_UPLOADED', 'Documents', newDoc.id, \`Uploaded document \${title}\`);
  PolarSync.save();
  closeModal();
  renderDocuments(document.getElementById('page-container'));
  showToast(\`Document \${title} uploaded\`, 'success');
}

/* =========================================================================
   USER MANAGEMENT & ROLE-BASED ACCESS
   ========================================================================= */
function renderUsers(container) {
  const s = PolarSync.state;

  container.innerHTML = \`
    <div class="card">
      <div class="card-header">
        <div class="card-title">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
          Command Center Access & Role Management
        </div>
        <button class="btn btn-primary" onclick="openCreateUserModal()">Add User Account</button>
      </div>
      <div class="card-body">
        <div class="table-wrapper">
          <table class="data-table">
            <thead>
              <tr>
                <th>User ID</th>
                <th>Full Name</th>
                <th>Email Address</th>
                <th>Role</th>
                <th>Assigned Station</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              \${s.users.map(u => \`
                <tr>
                  <td><strong>\${u.id}</strong></td>
                  <td><strong>\${u.name}</strong></td>
                  <td>\${u.email}</td>
                  <td><span class="badge badge-info">\${u.role}</span></td>
                  <td>\${u.station}</td>
                  <td><span class="badge badge-success">\${u.status}</span></td>
                  <td>
                    <button class="btn btn-secondary btn-sm" onclick="showToast('Password reset link sent to ' + '\${u.email}', 'info')">Reset Auth</button>
                  </td>
                </tr>
              \`).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  \`;
}

function openCreateUserModal() {
  const bodyHtml = \`
    <form id="create-user-form">
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 12px;">
        <div>
          <label class="text-xs font-semibold text-muted">User ID</label>
          <input type="text" id="usr-id" class="input-control" value="USR-\${Math.floor(100 + Math.random() * 900)}" required>
        </div>
        <div>
          <label class="text-xs font-semibold text-muted">Full Name</label>
          <input type="text" id="usr-name" class="input-control" placeholder="e.g. Flight Officer Tarun Mehra" required>
        </div>
      </div>

      <div style="margin-bottom: 12px;">
        <label class="text-xs font-semibold text-muted">Official Email</label>
        <input type="email" id="usr-email" class="input-control" placeholder="name@polarsync.gov" required>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 12px;">
        <div>
          <label class="text-xs font-semibold text-muted">System Role</label>
          <select id="usr-role" class="select-control">
            <option>Expedition Commander</option>
            <option>Logistics Lead</option>
            <option>Safety & Medical Officer</option>
            <option>Station Operator</option>
            <option>Auditor</option>
          </select>
        </div>
        <div>
          <label class="text-xs font-semibold text-muted">Assigned Station</label>
          <select id="usr-station" class="select-control">
            \${PolarSync.state.stations.map(st => \`<option value="\${st.name}">\${st.name}</option>\`).join('')}
          </select>
        </div>
      </div>
    </form>
  \`;

  openModal('Provision Command User Account', bodyHtml, '<button class="btn btn-primary" onclick="submitCreateUser()">Create User</button>');
}

function submitCreateUser() {
  const id = document.getElementById('usr-id').value;
  const name = document.getElementById('usr-name').value;
  const email = document.getElementById('usr-email').value;
  const role = document.getElementById('usr-role').value;
  const station = document.getElementById('usr-station').value;

  if (!id || !name || !email) {
    showToast('All fields are required.', 'danger');
    return;
  }

  const newUser = {
    id: id,
    name: name,
    email: email,
    role: role,
    station: station,
    status: 'Active'
  };

  PolarSync.state.users.push(newUser);
  PolarSync.logAudit('USER_CREATED', 'Users', id, \`Provisioned \${name} as \${role}\`);
  PolarSync.save();
  closeModal();
  renderUsers(document.getElementById('page-container'));
  showToast(\`User \${name} provisioned\`, 'success');
}

/* =========================================================================
   AUDIT LOGS MODULE RENDERER
   ========================================================================= */
function renderAudit(container) {
  const s = PolarSync.state;

  container.innerHTML = \`
    <div class="card">
      <div class="card-header">
        <div class="card-title">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
          Immutable Operations Security & Audit Trail
        </div>
        <button class="btn btn-secondary btn-sm" onclick="exportAuditCsv()">Export Audit CSV</button>
      </div>
      <div class="card-body">
        <div class="table-wrapper">
          <table class="data-table">
            <thead>
              <tr>
                <th>Audit ID</th>
                <th>Timestamp (UTC)</th>
                <th>User Account</th>
                <th>Action</th>
                <th>Module</th>
                <th>Record Ref</th>
                <th>Details</th>
                <th>Network Source</th>
              </tr>
            </thead>
            <tbody>
              \${s.auditLogs.map(a => \`
                <tr>
                  <td><strong>\${a.id}</strong></td>
                  <td class="text-xs">\${a.timestamp}</td>
                  <td>\${a.user}</td>
                  <td><strong>\${a.action}</strong></td>
                  <td><span class="badge badge-neutral">\${a.module}</span></td>
                  <td>\${a.record}</td>
                  <td class="text-xs">\${a.details}</td>
                  <td class="text-xs text-muted">\${a.ip}</td>
                </tr>
              \`).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  \`;
}

function exportAuditCsv() {
  const headers = ['AuditID', 'Timestamp', 'User', 'Action', 'Module', 'Record', 'Details', 'Source'];
  const rows = PolarSync.state.auditLogs.map(a => [
    a.id, a.timestamp, a.user, a.action, a.module, a.record, a.details, a.ip
  ]);
  exportDataToCsv('PolarSync_Security_Audit_Logs.csv', headers, rows);
}

/* =========================================================================
   SYSTEM SETTINGS MODULE RENDERER
   ========================================================================= */
function renderSettings(container) {
  const s = PolarSync.state;

  container.innerHTML = \`
    <div class="card">
      <div class="card-header">
        <div class="card-title">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
          System Configuration & Data Synchronization Settings
        </div>
      </div>
      <div class="card-body">
        <div style="max-width: 680px; display: flex; flex-direction: column; gap: 20px;">
          <!-- THEME TOGGLE -->
          <div style="display: flex; justify-content: space-between; align-items: center; padding: 14px; background: var(--bg-subtle); border-radius: var(--radius-sm);">
            <div>
              <div class="font-bold">Command Interface Theme</div>
              <div class="text-xs text-muted">Toggle between High-Contrast Navy Light mode and Polar Night Dark mode.</div>
            </div>
            <button class="btn btn-secondary" onclick="toggleDarkMode()">Switch Theme</button>
          </div>

          <!-- SATELLITE SYNC SIMULATOR -->
          <div style="display: flex; justify-content: space-between; align-items: center; padding: 14px; background: var(--bg-subtle); border-radius: var(--radius-sm);">
            <div>
              <div class="font-bold">Simulated Satellite Connectivity</div>
              <div class="text-xs text-muted">Test PolarSync offline-first resilience when satellite link drops.</div>
            </div>
            <button class="btn btn-secondary" onclick="toggleOfflineMode()">Toggle Link</button>
          </div>

          <!-- DEMO SCENARIO LOADER -->
          <div style="display: flex; justify-content: space-between; align-items: center; padding: 14px; background: var(--bg-subtle); border-radius: var(--radius-sm);">
            <div>
              <div class="font-bold">SIH 2026 Judge Demonstration Scenario</div>
              <div class="text-xs text-muted">Loads the Antarctic Scientific Expedition 2026 (Bharati Station) with active emergency.</div>
            </div>
            <button class="btn btn-accent" onclick="PolarSync.loadJudgeDemoScenario()">Load Demo Scenario</button>
          </div>

          <!-- BACKUP & EXPORT JSON -->
          <div style="display: flex; justify-content: space-between; align-items: center; padding: 14px; background: var(--bg-subtle); border-radius: var(--radius-sm);">
            <div>
              <div class="font-bold">Export Operational Telemetry (JSON)</div>
              <div class="text-xs text-muted">Download entire local database as structured JSON backup.</div>
            </div>
            <button class="btn btn-secondary" onclick="exportDatabaseJson()">Export JSON</button>
          </div>

          <!-- RESET DATA -->
          <div style="display: flex; justify-content: space-between; align-items: center; padding: 14px; border: 1px solid var(--status-red); background: var(--status-red-bg); border-radius: var(--radius-sm);">
            <div>
              <div class="font-bold" style="color: var(--status-red);">Factory Reset Local Datasets</div>
              <div class="text-xs" style="color: #991b1b;">Reverts all stations, inventory, cargo, and expeditions to original initial state.</div>
            </div>
            <button class="btn btn-danger" onclick="if(confirm('Reset all PolarSync local data?')) PolarSync.resetData()">Reset Baseline</button>
          </div>
        </div>
      </div>
    </div>
  \`;
}

function exportDatabaseJson() {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(PolarSync.state, null, 2));
  const link = document.createElement("a");
  link.setAttribute("href", dataStr);
  link.setAttribute("download", "PolarSync_Backup_2026.json");
  document.body.appendChild(link);
  link.click();
  link.remove();
  showToast('Exported complete PolarSync JSON telemetry database', 'success');
}
`;
}

module.exports = { getRenderersPart3 };
