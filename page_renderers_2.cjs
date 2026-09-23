/**
 * Page Renderers Part 2: Assets, Personnel, Stations, Emergency Center, Tasks
 */

function getRenderersPart2() {
  return `
/* =========================================================================
   ASSET MANAGEMENT MODULE RENDERER
   ========================================================================= */
function renderAssets(container) {
  const s = PolarSync.state;

  container.innerHTML = \`
    <div class="card">
      <div class="card-header">
        <div class="card-title">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
          Critical Mission Asset Registry & Telemetry
        </div>
        <div class="flex gap-2">
          <button class="btn btn-primary" onclick="openCreateAssetModal()">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            Register New Asset
          </button>
        </div>
      </div>
      <div class="card-body">
        <!-- FILTER BAR -->
        <div class="filter-bar">
          <div class="filter-group">
            <input type="text" id="asset-search-input" class="input-control" style="width: 220px;" placeholder="Search equipment..." oninput="filterAssetsTable()">
            <select id="asset-location-filter" class="select-control" style="width: 160px;" onchange="filterAssetsTable()">
              <option value="">All Locations</option>
              \${PolarSync.state.stations.map(st => \`<option value="\${st.name}">\${st.name}</option>\`).join('')}
            </select>
            <select id="asset-condition-filter" class="select-control" style="width: 150px;" onchange="filterAssetsTable()">
              <option value="">All Conditions</option>
              <option value="Operational">Operational</option>
              <option value="Maintenance">Maintenance</option>
              <option value="Standby">Standby</option>
              <option value="Decommissioned">Decommissioned</option>
            </select>
            <select id="asset-category-filter" class="select-control" style="width: 150px;" onchange="filterAssetsTable()">
              <option value="">All Categories</option>
              <option value="Heavy Traverse Vehicles">Vehicles</option>
              <option value="Life Support & Energy">Energy & Power</option>
              <option value="Communication Systems">Communications</option>
              <option value="Scientific Instruments">Scientific</option>
            </select>
          </div>
          <div class="flex gap-2">
            <button class="btn btn-secondary btn-sm" onclick="exportAssetsCsv()">Export CSV</button>
          </div>
        </div>

        <!-- ASSETS TABLE -->
        <div class="table-wrapper">
          <table class="data-table" id="assets-data-table">
            <thead>
              <tr>
                <th>Asset ID</th>
                <th>Asset Name</th>
                <th>Category</th>
                <th>Station / Location</th>
                <th>Assigned Mission</th>
                <th>Condition</th>
                <th>Maintenance Schedule</th>
                <th>Operator Lead</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody id="assets-table-body">
              <!-- Rendered dynamically -->
            </tbody>
          </table>
        </div>
      </div>
    </div>
  \`;

  renderAssetsRows(s.assets);
}

function renderAssetsRows(list) {
  const tbody = document.getElementById('assets-table-body');
  if (!tbody) return;

  if (list.length === 0) {
    tbody.innerHTML = '<tr><td colspan="9" class="text-center text-muted" style="padding: 24px;">No matching assets found.</td></tr>';
    return;
  }

  tbody.innerHTML = list.map(a => \`
    <tr>
      <td><strong>\${a.id}</strong></td>
      <td>
        <div class="font-bold">\${a.name}</div>
        <div class="text-xs text-muted">Status: \${a.status}</div>
      </td>
      <td>\${a.category}</td>
      <td>\${a.location}</td>
      <td class="text-xs">\${a.assignedExpedition || 'Unassigned / Station Pool'}</td>
      <td>
        <span class="badge \${a.condition === 'Operational' ? 'badge-success' : (a.condition === 'Maintenance' ? 'badge-danger' : 'badge-warning')}">
          <span class="badge-dot"></span>\${a.condition}
        </span>
      </td>
      <td class="text-xs">
        <div>Last: \${a.lastMaint}</div>
        <div class="text-muted">Next: <strong>\${a.nextMaint}</strong></div>
      </td>
      <td>\${a.lead}</td>
      <td>
        <div class="table-actions">
          <button class="btn btn-secondary btn-sm" onclick="openAssetMaintenanceModal('\${a.id}')" title="Log Maintenance">Maint</button>
          <button class="btn btn-secondary btn-sm" onclick="openAssignAssetModal('\${a.id}')" title="Assign Location">Assign</button>
          <button class="btn btn-danger-outline btn-sm" onclick="deleteAsset('\${a.id}')">Delete</button>
        </div>
      </td>
    </tr>
  \`).join('');
}

function filterAssetsTable() {
  const search = (document.getElementById('asset-search-input')?.value || '').toLowerCase();
  const location = document.getElementById('asset-location-filter')?.value || '';
  const condition = document.getElementById('asset-condition-filter')?.value || '';
  const category = document.getElementById('asset-category-filter')?.value || '';

  const filtered = PolarSync.state.assets.filter(a => {
    const matchSearch = a.name.toLowerCase().includes(search) || a.id.toLowerCase().includes(search) || a.lead.toLowerCase().includes(search);
    const matchLoc = !location || a.location === location;
    const matchCond = !condition || a.condition === condition;
    const matchCat = !category || a.category === category;
    return matchSearch && matchLoc && matchCond && matchCat;
  });

  renderAssetsRows(filtered);
}

function openCreateAssetModal() {
  const bodyHtml = \`
    <form id="create-asset-form">
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 12px;">
        <div>
          <label class="text-xs font-semibold text-muted">Asset Code</label>
          <input type="text" id="m-ast-id" class="input-control" value="AST-\${Math.floor(100 + Math.random() * 900)}" required>
        </div>
        <div>
          <label class="text-xs font-semibold text-muted">Category</label>
          <select id="m-ast-cat" class="select-control">
            <option>Heavy Traverse Vehicles</option>
            <option>Life Support & Energy</option>
            <option>Communication Systems</option>
            <option>Scientific Instruments</option>
          </select>
        </div>
      </div>

      <div style="margin-bottom: 12px;">
        <label class="text-xs font-semibold text-muted">Asset Name</label>
        <input type="text" id="m-ast-name" class="input-control" placeholder="e.g. Caterpillar D6N LGP Polar Bulldozer" required>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 12px;">
        <div>
          <label class="text-xs font-semibold text-muted">Station / Outpost Location</label>
          <select id="m-ast-loc" class="select-control">
            \${PolarSync.state.stations.map(st => \`<option value="\${st.name}">\${st.name}</option>\`).join('')}
          </select>
        </div>
        <div>
          <label class="text-xs font-semibold text-muted">Responsible Engineer</label>
          <input type="text" id="m-ast-lead" class="input-control" value="Er. Vikram Deshpande" required>
        </div>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 12px;">
        <div>
          <label class="text-xs font-semibold text-muted">Initial Condition</label>
          <select id="m-ast-cond" class="select-control">
            <option>Operational</option>
            <option>Standby</option>
            <option>Maintenance</option>
          </select>
        </div>
        <div>
          <label class="text-xs font-semibold text-muted">Next Maintenance Due</label>
          <input type="date" id="m-ast-next" class="input-control" value="2026-12-15" required>
        </div>
      </div>
    </form>
  \`;

  openModal('Register Critical Mission Asset', bodyHtml, '<button class="btn btn-primary" onclick="submitCreateAsset()">Register Asset</button>');
}

function submitCreateAsset() {
  const id = document.getElementById('m-ast-id').value;
  const name = document.getElementById('m-ast-name').value;
  const cat = document.getElementById('m-ast-cat').value;
  const loc = document.getElementById('m-ast-loc').value;
  const lead = document.getElementById('m-ast-lead').value;
  const cond = document.getElementById('m-ast-cond').value;
  const next = document.getElementById('m-ast-next').value;

  if (!id || !name) {
    showToast('Asset ID and Name are required.', 'danger');
    return;
  }

  const newAsset = {
    id: id,
    name: name,
    category: cat,
    location: loc,
    condition: cond,
    lastMaint: new Date().toISOString().split('T')[0],
    nextMaint: next,
    status: cond === 'Operational' ? 'In Use' : 'Standby',
    lead: lead,
    assignedExpedition: 'EXP-2026-01'
  };

  PolarSync.state.assets.unshift(newAsset);
  PolarSync.logAudit('ASSET_REGISTERED', 'Assets', id, \`Registered \${name} at \${loc}\`);
  PolarSync.save();
  closeModal();
  renderAssets(document.getElementById('page-container'));
  showToast(\`Registered asset \${name}\`, 'success');
}

function openAssetMaintenanceModal(assetId) {
  const asset = PolarSync.state.assets.find(a => a.id === assetId);
  if (!asset) return;

  const bodyHtml = \`
    <div style="margin-bottom: 12px;">
      <div class="font-bold text-lg">\${asset.name} (\${asset.id})</div>
      <div class="text-xs text-muted">Location: \${asset.location} • Lead: \${asset.lead}</div>
      <div class="text-xs text-muted" style="margin-top: 4px;">Current Condition: <strong>\${asset.condition}</strong></div>
    </div>

    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 12px;">
      <div>
        <label class="text-xs font-semibold text-muted">Update Condition</label>
        <select id="maint-ast-cond" class="select-control">
          <option \${asset.condition === 'Operational' ? 'selected' : ''}>Operational</option>
          <option \${asset.condition === 'Maintenance' ? 'selected' : ''}>Maintenance</option>
          <option \${asset.condition === 'Standby' ? 'selected' : ''}>Standby</option>
          <option \${asset.condition === 'Decommissioned' ? 'selected' : ''}>Decommissioned</option>
        </select>
      </div>
      <div>
        <label class="text-xs font-semibold text-muted">Next Scheduled Service</label>
        <input type="date" id="maint-ast-next" class="input-control" value="\${asset.nextMaint || '2026-12-30'}">
      </div>
    </div>

    <div style="margin-bottom: 12px;">
      <label class="text-xs font-semibold text-muted">Maintenance Service Log Notes</label>
      <textarea id="maint-ast-notes" class="input-control" rows="3" placeholder="Oil grade inspected for -50°C, seal replacement completed..."></textarea>
    </div>
  \`;

  openModal(\`Log Maintenance: \${asset.id}\`, bodyHtml, \`<button class="btn btn-primary" onclick="submitAssetMaintenance('\${asset.id}')">Record Service</button>\`);
}

function submitAssetMaintenance(assetId) {
  const asset = PolarSync.state.assets.find(a => a.id === assetId);
  if (!asset) return;

  const newCond = document.getElementById('maint-ast-cond').value;
  const newNext = document.getElementById('maint-ast-next').value;
  const notes = document.getElementById('maint-ast-notes').value || 'Routine inspection completed';

  asset.condition = newCond;
  asset.lastMaint = new Date().toISOString().split('T')[0];
  asset.nextMaint = newNext;
  asset.status = newCond === 'Operational' ? 'In Use' : (newCond === 'Maintenance' ? 'Maintenance' : 'Standby');

  PolarSync.logAudit('ASSET_MAINTENANCE_LOGGED', 'Assets', assetId, \`Updated condition to \${newCond}. Notes: \${notes}\`);
  PolarSync.save();
  closeModal();
  renderAssets(document.getElementById('page-container'));
  showToast(\`Maintenance recorded for \${asset.name}\`, 'success');
}

function openAssignAssetModal(assetId) {
  const asset = PolarSync.state.assets.find(a => a.id === assetId);
  if (!asset) return;

  const bodyHtml = \`
    <div style="margin-bottom: 12px;">
      <div class="font-bold text-lg">\${asset.name} (\${asset.id})</div>
      <div class="text-xs text-muted">Currently at: \${asset.location}</div>
    </div>

    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 12px;">
      <div>
        <label class="text-xs font-semibold text-muted">Relocate to Station</label>
        <select id="assign-ast-loc" class="select-control">
          \${PolarSync.state.stations.map(st => \`<option value="\${st.name}" \${asset.location === st.name ? 'selected' : ''}>\${st.name}</option>\`).join('')}
        </select>
      </div>
      <div>
        <label class="text-xs font-semibold text-muted">Assign to Expedition</label>
        <select id="assign-ast-exp" class="select-control">
          <option value="">Station Pool (Unassigned)</option>
          \${PolarSync.state.expeditions.map(e => \`<option value="\${e.id}" \${asset.assignedExpedition === e.id ? 'selected' : ''}>\${e.id} - \${e.name}</option>\`).join('')}
        </select>
      </div>
    </div>
  \`;

  openModal(\`Assign Asset: \${asset.id}\`, bodyHtml, \`<button class="btn btn-primary" onclick="submitAssignAsset('\${asset.id}')">Save Deployment</button>\`);
}

function submitAssignAsset(assetId) {
  const asset = PolarSync.state.assets.find(a => a.id === assetId);
  if (!asset) return;

  const newLoc = document.getElementById('assign-ast-loc').value;
  const newExp = document.getElementById('assign-ast-exp').value;

  asset.location = newLoc;
  asset.assignedExpedition = newExp;

  PolarSync.logAudit('ASSET_RELOCATED', 'Assets', assetId, \`Deployed to \${newLoc} (Mission: \${newExp || 'None'})\`);
  PolarSync.save();
  closeModal();
  renderAssets(document.getElementById('page-container'));
  showToast(\`Reassigned asset \${assetId}\`, 'success');
}

function deleteAsset(assetId) {
  if (!confirm(\`Decommission asset record \${assetId}?\`)) return;

  const idx = PolarSync.state.assets.findIndex(a => a.id === assetId);
  if (idx !== -1) {
    PolarSync.state.assets.splice(idx, 1);
    PolarSync.logAudit('ASSET_DECOMMISSIONED', 'Assets', assetId, 'Asset removed from active registry');
    PolarSync.save();
    renderAssets(document.getElementById('page-container'));
    showToast(\`Asset \${assetId} removed\`, 'info');
  }
}

function exportAssetsCsv() {
  const headers = ['AssetID', 'Name', 'Category', 'Location', 'AssignedExpedition', 'Condition', 'LastMaint', 'NextMaint', 'Status', 'Lead'];
  const rows = PolarSync.state.assets.map(a => [
    a.id, a.name, a.category, a.location, a.assignedExpedition, a.condition, a.lastMaint, a.nextMaint, a.status, a.lead
  ]);
  exportDataToCsv('PolarSync_Asset_Registry.csv', headers, rows);
}

/* =========================================================================
   PERSONNEL ROSTER MODULE RENDERER
   ========================================================================= */
function renderPersonnel(container) {
  const s = PolarSync.state;

  container.innerHTML = \`
    <div class="card">
      <div class="card-header">
        <div class="card-title">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
          Polar Expedition Personnel & Deployment Roster
        </div>
        <div class="flex gap-2">
          <button class="btn btn-primary" onclick="openCreatePersonnelModal()">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            Deploy Personnel
          </button>
        </div>
      </div>
      <div class="card-body">
        <!-- FILTER BAR -->
        <div class="filter-bar">
          <div class="filter-group">
            <input type="text" id="per-search-input" class="input-control" style="width: 220px;" placeholder="Search personnel..." oninput="filterPersonnelTable()">
            <select id="per-location-filter" class="select-control" style="width: 160px;" onchange="filterPersonnelTable()">
              <option value="">All Stations</option>
              \${PolarSync.state.stations.map(st => \`<option value="\${st.name}">\${st.name}</option>\`).join('')}
            </select>
            <select id="per-status-filter" class="select-control" style="width: 140px;" onchange="filterPersonnelTable()">
              <option value="">All Statuses</option>
              <option value="Deployed">Deployed</option>
              <option value="In Transit">In Transit</option>
              <option value="Standby">Standby</option>
            </select>
            <select id="per-dept-filter" class="select-control" style="width: 150px;" onchange="filterPersonnelTable()">
              <option value="">All Departments</option>
              <option value="Atmospheric Science">Atmospheric</option>
              <option value="Station Logistics & Ops">Logistics & Ops</option>
              <option value="Medical & Polar Safety">Medical</option>
              <option value="Telecommunications">Telecom</option>
            </select>
          </div>
          <div class="flex gap-2">
            <button class="btn btn-secondary btn-sm" onclick="exportPersonnelCsv()">Export Roster CSV</button>
          </div>
        </div>

        <!-- PERSONNEL TABLE -->
        <div class="table-wrapper">
          <table class="data-table" id="personnel-data-table">
            <thead>
              <tr>
                <th>Personnel ID</th>
                <th>Full Name</th>
                <th>Role & Specialization</th>
                <th>Department</th>
                <th>Current Station</th>
                <th>Assigned Mission</th>
                <th>Medical Clearance</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody id="personnel-table-body">
              <!-- Rendered dynamically -->
            </tbody>
          </table>
        </div>
      </div>
    </div>
  \`;

  renderPersonnelRows(s.personnel);
}

function renderPersonnelRows(list) {
  const tbody = document.getElementById('personnel-table-body');
  if (!tbody) return;

  if (list.length === 0) {
    tbody.innerHTML = '<tr><td colspan="9" class="text-center text-muted" style="padding: 24px;">No matching personnel records.</td></tr>';
    return;
  }

  tbody.innerHTML = list.map(p => \`
    <tr>
      <td><strong>\${p.id}</strong></td>
      <td>
        <div class="font-bold">\${p.name}</div>
        <div class="text-xs text-muted">\${p.contact}</div>
      </td>
      <td>\${p.role}</td>
      <td>\${p.dept}</td>
      <td>\${p.location}</td>
      <td class="text-xs">\${p.expedition}</td>
      <td>
        <span class="badge \${p.medicalClearance === 'Fit for Polar Winter' ? 'badge-success' : 'badge-warning'}">
          \${p.medicalClearance}
        </span>
      </td>
      <td>
        <span class="badge \${p.status === 'Deployed' ? 'badge-success' : (p.status === 'In Transit' ? 'badge-info' : 'badge-neutral')}">
          <span class="badge-dot"></span>\${p.status}
        </span>
      </td>
      <td>
        <div class="table-actions">
          <button class="btn btn-secondary btn-sm" onclick="openPersonnelProfileModal('\${p.id}')">Profile</button>
          <button class="btn btn-secondary btn-sm" onclick="openReassignPersonnelModal('\${p.id}')">Reassign</button>
          <button class="btn btn-danger-outline btn-sm" onclick="deletePersonnel('\${p.id}')">Remove</button>
        </div>
      </td>
    </tr>
  \`).join('');
}

function filterPersonnelTable() {
  const search = (document.getElementById('per-search-input')?.value || '').toLowerCase();
  const location = document.getElementById('per-location-filter')?.value || '';
  const status = document.getElementById('per-status-filter')?.value || '';
  const dept = document.getElementById('per-dept-filter')?.value || '';

  const filtered = PolarSync.state.personnel.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search) || p.id.toLowerCase().includes(search) || p.role.toLowerCase().includes(search);
    const matchLoc = !location || p.location === location;
    const matchStatus = !status || p.status === status;
    const matchDept = !dept || p.dept === dept;
    return matchSearch && matchLoc && matchStatus && matchDept;
  });

  renderPersonnelRows(filtered);
}

function openCreatePersonnelModal() {
  const bodyHtml = \`
    <form id="create-per-form">
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 12px;">
        <div>
          <label class="text-xs font-semibold text-muted">Service ID</label>
          <input type="text" id="m-per-id" class="input-control" value="POL-\${Math.floor(100 + Math.random() * 900)}" required>
        </div>
        <div>
          <label class="text-xs font-semibold text-muted">Full Name</label>
          <input type="text" id="m-per-name" class="input-control" placeholder="e.g. Dr. Priya Ramakrishnan" required>
        </div>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 12px;">
        <div>
          <label class="text-xs font-semibold text-muted">Role & Title</label>
          <input type="text" id="m-per-role" class="input-control" value="Glaciologist & Core Analyst" required>
        </div>
        <div>
          <label class="text-xs font-semibold text-muted">Department</label>
          <select id="m-per-dept" class="select-control">
            <option>Atmospheric Science</option>
            <option>Station Logistics & Ops</option>
            <option>Medical & Polar Safety</option>
            <option>Telecommunications</option>
            <option>Mechanical & Power Systems</option>
          </select>
        </div>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 12px;">
        <div>
          <label class="text-xs font-semibold text-muted">Station Deployment</label>
          <select id="m-per-loc" class="select-control">
            \${PolarSync.state.stations.map(st => \`<option value="\${st.name}">\${st.name}</option>\`).join('')}
          </select>
        </div>
        <div>
          <label class="text-xs font-semibold text-muted">Assigned Expedition</label>
          <input type="text" id="m-per-exp" class="input-control" value="EXP-2026-01">
        </div>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 12px;">
        <div>
          <label class="text-xs font-semibold text-muted">Medical Clearance</label>
          <select id="m-per-med" class="select-control">
            <option>Fit for Polar Winter</option>
            <option>Summer Field Fit</option>
            <option>Conditional Review</option>
          </select>
        </div>
        <div>
          <label class="text-xs font-semibold text-muted">Emergency Satellite Radio</label>
          <input type="text" id="m-per-contact" class="input-control" value="IRIDIUM-774-099">
        </div>
      </div>
    </form>
  \`;

  openModal('Deploy Polar Personnel', bodyHtml, '<button class="btn btn-primary" onclick="submitCreatePersonnel()">Enroll in Roster</button>');
}

function submitCreatePersonnel() {
  const id = document.getElementById('m-per-id').value;
  const name = document.getElementById('m-per-name').value;
  const role = document.getElementById('m-per-role').value;
  const dept = document.getElementById('m-per-dept').value;
  const loc = document.getElementById('m-per-loc').value;
  const exp = document.getElementById('m-per-exp').value;
  const med = document.getElementById('m-per-med').value;
  const contact = document.getElementById('m-per-contact').value;

  if (!id || !name) {
    showToast('Service ID and Name are required.', 'danger');
    return;
  }

  const newPer = {
    id: id,
    name: name,
    role: role,
    dept: dept,
    location: loc,
    expedition: exp,
    medicalClearance: med,
    contact: contact,
    status: 'Deployed'
  };

  PolarSync.state.personnel.unshift(newPer);
  PolarSync.logAudit('PERSONNEL_DEPLOYED', 'Personnel', id, \`Enrolled \${name} to \${loc}\`);
  PolarSync.save();
  closeModal();
  renderPersonnel(document.getElementById('page-container'));
  showToast(\`Personnel \${name} deployed to \${loc}\`, 'success');
}

function openPersonnelProfileModal(perId) {
  const p = PolarSync.state.personnel.find(item => item.id === perId);
  if (!p) return;

  const bodyHtml = \`
    <div class="flex items-center gap-4" style="margin-bottom: 20px;">
      <div style="width: 56px; height: 56px; border-radius: 50%; background: var(--primary-navy); color: #fff; display: flex; align-items: center; justify-content: center; font-size: 1.2rem; font-weight: 700;">
        \${p.name.split(' ').map(n=>n[0]).join('').substring(0, 2)}
      </div>
      <div>
        <div class="text-xl font-bold">\${p.name}</div>
        <div class="text-sm text-muted">\${p.role} • \${p.dept}</div>
        <div class="flex gap-2" style="margin-top: 6px;">
          <span class="badge badge-success">\${p.status}</span>
          <span class="badge badge-info">\${p.medicalClearance}</span>
        </div>
      </div>
    </div>

    <div style="background: var(--bg-subtle); padding: 16px; border-radius: var(--radius-sm); margin-bottom: 16px;">
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; font-size: 0.85rem;">
        <div><strong>Deployment Station:</strong> \${p.location}</div>
        <div><strong>Expedition Assignment:</strong> \${p.expedition}</div>
        <div><strong>Satellite Frequency:</strong> \${p.contact}</div>
        <div><strong>Clearance Protocol:</strong> NCPOR-MED-2026-A1</div>
      </div>
    </div>

    <div class="text-xs text-muted">
      Certified for Antarctic cold-weather survival, crevasse extraction, and high-altitude polar operations.
    </div>
  \`;

  openModal(\`Personnel Profile: \${p.id}\`, bodyHtml);
}

function openReassignPersonnelModal(perId) {
  const p = PolarSync.state.personnel.find(item => item.id === perId);
  if (!p) return;

  const bodyHtml = \`
    <div style="margin-bottom: 12px;">
      <div class="font-bold">\${p.name} (\${p.id})</div>
      <div class="text-xs text-muted">Currently deployed at \${p.location}</div>
    </div>

    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 12px;">
      <div>
        <label class="text-xs font-semibold text-muted">Transfer to Station</label>
        <select id="reassign-per-loc" class="select-control">
          \${PolarSync.state.stations.map(st => \`<option value="\${st.name}" \${p.location === st.name ? 'selected' : ''}>\${st.name}</option>\`).join('')}
        </select>
      </div>
      <div>
        <label class="text-xs font-semibold text-muted">Duty Status</label>
        <select id="reassign-per-status" class="select-control">
          <option \${p.status === 'Deployed' ? 'selected' : ''}>Deployed</option>
          <option \${p.status === 'In Transit' ? 'selected' : ''}>In Transit</option>
          <option \${p.status === 'Standby' ? 'selected' : ''}>Standby</option>
        </select>
      </div>
    </div>
  \`;

  openModal(\`Reassign: \${p.name}\`, bodyHtml, \`<button class="btn btn-primary" onclick="submitReassignPersonnel('\${p.id}')">Execute Transfer</button>\`);
}

function submitReassignPersonnel(perId) {
  const p = PolarSync.state.personnel.find(item => item.id === perId);
  if (!p) return;

  p.location = document.getElementById('reassign-per-loc').value;
  p.status = document.getElementById('reassign-per-status').value;

  PolarSync.logAudit('PERSONNEL_REASSIGNED', 'Personnel', perId, \`Transferred to \${p.location}, status: \${p.status}\`);
  PolarSync.save();
  closeModal();
  renderPersonnel(document.getElementById('page-container'));
  showToast(\`Updated assignment for \${p.name}\`, 'success');
}

function deletePersonnel(perId) {
  if (!confirm(\`Remove personnel record \${perId} from active roster?\`)) return;

  const idx = PolarSync.state.personnel.findIndex(p => p.id === perId);
  if (idx !== -1) {
    PolarSync.state.personnel.splice(idx, 1);
    PolarSync.logAudit('PERSONNEL_REMOVED', 'Personnel', perId, 'Removed from active roster');
    PolarSync.save();
    renderPersonnel(document.getElementById('page-container'));
    showToast(\`Personnel \${perId} removed\`, 'info');
  }
}

function exportPersonnelCsv() {
  const headers = ['PersonnelID', 'Name', 'Role', 'Department', 'Location', 'Expedition', 'MedicalClearance', 'Status', 'Contact'];
  const rows = PolarSync.state.personnel.map(p => [
    p.id, p.name, p.role, p.dept, p.location, p.expedition, p.medicalClearance, p.status, p.contact
  ]);
  exportDataToCsv('PolarSync_Personnel_Roster.csv', headers, rows);
}

/* =========================================================================
   STATIONS & REMOTE OUTPOSTS RENDERER
   ========================================================================= */
function renderStations(container) {
  const s = PolarSync.state;

  container.innerHTML = \`
    <div class="card">
      <div class="card-header">
        <div class="card-title">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
          Permanent Polar Research Stations & Remote Logistics Outposts
        </div>
      </div>
      <div class="card-body">
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 20px;">
          \${s.stations.map(st => {
            const occupancy = Math.round((st.personnelCount / st.capacity) * 100);
            return \`
              <div class="card" style="margin-bottom: 0; border-top: 3px solid var(--ice-blue);">
                <div class="card-header">
                  <div>
                    <div class="font-bold text-base">\${st.name}</div>
                    <div class="text-xs text-muted">\${st.coordinates} • \${st.type}</div>
                  </div>
                  <span class="badge \${st.status === 'Operational' ? 'badge-success' : 'badge-neutral'}">\${st.status}</span>
                </div>
                <div class="card-body">
                  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; font-size: 0.8rem; margin-bottom: 14px;">
                    <div>
                      <span class="text-muted">Station Lead:</span><br>
                      <strong>\${st.lead}</strong>
                    </div>
                    <div>
                      <span class="text-muted">Weather:</span><br>
                      <strong>\${st.weather}</strong>
                    </div>
                    <div>
                      <span class="text-muted">Uplink:</span><br>
                      <strong>\${st.connectivity}</strong>
                    </div>
                    <div>
                      <span class="text-muted">Life Support:</span><br>
                      <strong style="color: \${st.fuelStockPercent < 50 ? 'var(--status-red)' : 'var(--status-green)'};">\${st.fuelStockPercent}% Reserves</strong>
                    </div>
                  </div>

                  <div>
                    <div class="flex justify-between text-xs text-muted" style="margin-bottom: 4px;">
                      <span>Station Occupancy</span>
                      <span><strong>\${st.personnelCount}</strong> / \${st.capacity} Berths (\${occupancy}%)</span>
                    </div>
                    <div class="progress-bar-bg">
                      <div class="progress-bar-fill \${occupancy > 90 ? 'danger' : 'success'}" style="width: \${occupancy}%;"></div>
                    </div>
                  </div>

                  <div class="flex justify-between items-center" style="margin-top: 16px;">
                    <button class="btn btn-secondary btn-sm" onclick="openStationDetailModal('\${st.id}')">Station Telemetry</button>
                    <button class="btn btn-primary btn-sm" onclick="window.location.hash='#/inventory'">Manage Stocks</button>
                  </div>
                </div>
              </div>
            \`;
          }).join('')}
        </div>
      </div>
    </div>
  \`;
}

function openStationDetailModal(stationId) {
  const st = PolarSync.state.stations.find(s => s.id === stationId);
  if (!st) return;

  const stationPersonnel = PolarSync.state.personnel.filter(p => p.location === st.name);
  const stationAssets = PolarSync.state.assets.filter(a => a.location === st.name);

  const bodyHtml = \`
    <div style="margin-bottom: 16px;">
      <h2 class="text-xl font-bold">\${st.name}</h2>
      <div class="text-xs text-muted">\${st.coordinates} • \${st.type} • Established: \${st.established}</div>
    </div>

    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; background: var(--bg-subtle); padding: 14px; border-radius: var(--radius-sm); margin-bottom: 16px; font-size: 0.82rem;">
      <div><strong>Occupancy:</strong> \${st.personnelCount} / \${st.capacity}</div>
      <div><strong>Fuel Reserves:</strong> \${st.fuelStockPercent}%</div>
      <div><strong>Telecom:</strong> \${st.connectivity}</div>
    </div>

    <div style="margin-bottom: 14px;">
      <div class="font-bold text-xs text-muted" style="margin-bottom: 6px; text-transform: uppercase;">Resident Specialists (\${stationPersonnel.length})</div>
      <div style="display: flex; flex-wrap: wrap; gap: 6px;">
        \${stationPersonnel.map(p => \`<span class="feature-chip">\${p.name} (\${p.role})</span>\`).join('')}
      </div>
    </div>

    <div>
      <div class="font-bold text-xs text-muted" style="margin-bottom: 6px; text-transform: uppercase;">Station Assets & Machinery (\${stationAssets.length})</div>
      <div style="display: flex; flex-wrap: wrap; gap: 6px;">
        \${stationAssets.map(a => \`<span class="feature-chip">\${a.name} [\${a.condition}]</span>\`).join('')}
      </div>
    </div>
  \`;

  openModal(\`Station Overview: \${st.name}\`, bodyHtml);
}

/* =========================================================================
   EMERGENCY RESPONSE OPERATIONS CENTER RENDERER
   ========================================================================= */
function renderEmergency(container) {
  const s = PolarSync.state;
  const critical = s.emergencies.filter(e => e.severity === 'Critical' && e.status !== 'Resolved').length;

  container.innerHTML = \`
    <!-- CRITICAL INCIDENT BANNER IF ACTIVE -->
    \${critical > 0 ? \`
      <div class="card" style="border: 2px solid var(--status-red); background: var(--status-red-bg);">
        <div class="card-body">
          <div class="flex items-center justify-between flex-wrap gap-4">
            <div class="flex items-center gap-3">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2.5"><polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"></polygon><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
              <div>
                <div class="font-extrabold text-lg" style="color: #ef4444;">ACTIVE CRITICAL POLAR INCIDENT DETECTED (\${critical})</div>
                <div class="text-xs" style="color: #991b1b;">Immediate intervention and safety response coordination protocol mandated under Antarctic Treaty safety requirements.</div>
              </div>
            </div>
            <button class="btn btn-danger" onclick="openCreateEmergencyModal()">Declare Emergency Incident</button>
          </div>
        </div>
      </div>
    \` : ''}

    <div class="card">
      <div class="card-header">
        <div class="card-title" style="color: var(--status-red);">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
          Polar Emergency Response Operations Center
        </div>
        <div class="flex gap-2">
          <button class="btn btn-danger" onclick="openCreateEmergencyModal()">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            Declare Emergency Incident
          </button>
        </div>
      </div>
      <div class="card-body">
        <!-- FILTER BAR -->
        <div class="filter-bar">
          <div class="filter-group">
            <input type="text" id="emerg-search-input" class="input-control" style="width: 220px;" placeholder="Search incidents..." oninput="filterEmergencyTable()">
            <select id="emerg-severity-filter" class="select-control" style="width: 150px;" onchange="filterEmergencyTable()">
              <option value="">All Severities</option>
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Moderate">Moderate</option>
            </select>
            <select id="emerg-status-filter" class="select-control" style="width: 150px;" onchange="filterEmergencyTable()">
              <option value="">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Response Active">Response Active</option>
              <option value="Investigating">Investigating</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>
          <div class="flex gap-2">
            <button class="btn btn-secondary btn-sm" onclick="exportEmergencyCsv()">Export Logs CSV</button>
          </div>
        </div>

        <!-- EMERGENCY TABLE -->
        <div class="table-wrapper">
          <table class="data-table" id="emergency-data-table">
            <thead>
              <tr>
                <th>Incident ID</th>
                <th>Incident Type</th>
                <th>Station / Coordinates</th>
                <th>Description</th>
                <th>Reported Time</th>
                <th>Severity</th>
                <th>Response Lead</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody id="emergency-table-body">
              <!-- Rendered dynamically -->
            </tbody>
          </table>
        </div>
      </div>
    </div>
  \`;

  renderEmergencyRows(s.emergencies);
}

function renderEmergencyRows(list) {
  const tbody = document.getElementById('emergency-table-body');
  if (!tbody) return;

  if (list.length === 0) {
    tbody.innerHTML = '<tr><td colspan="9" class="text-center text-muted" style="padding: 24px;">No incident records matching criteria.</td></tr>';
    return;
  }

  tbody.innerHTML = list.map(e => \`
    <tr style="\${e.severity === 'Critical' && e.status !== 'Resolved' ? 'background: rgba(239, 68, 68, 0.05);' : ''}">
      <td><strong style="color: \${e.severity === 'Critical' ? 'var(--status-red)' : 'inherit'};">\${e.id}</strong></td>
      <td><strong>\${e.type}</strong></td>
      <td>\${e.location}</td>
      <td class="text-xs" style="max-width: 280px;">\${e.description}</td>
      <td class="text-xs">\${e.reportedAt}</td>
      <td>
        <span class="badge \${e.severity === 'Critical' ? 'badge-danger' : (e.severity === 'High' ? 'badge-warning' : 'badge-info')}">
          <span class="badge-dot"></span>\${e.severity}
        </span>
      </td>
      <td>\${e.assignedLead}</td>
      <td>
        <span class="badge \${e.status === 'Resolved' ? 'badge-success' : 'badge-danger'}">
          \${e.status}
        </span>
      </td>
      <td>
        <div class="table-actions">
          \${e.status !== 'Resolved' ? \`
            <button class="btn btn-success btn-sm" onclick="resolveEmergency('\${e.id}')" title="Mark Incident Resolved">Resolve</button>
            <button class="btn btn-secondary btn-sm" onclick="openUpdateEmergencyModal('\${e.id}')">Update</button>
          \` : \`
            <span class="text-xs text-muted font-semibold">Resolved</span>
          \`}
        </div>
      </td>
    </tr>
  \`).join('');
}

function filterEmergencyTable() {
  const search = (document.getElementById('emerg-search-input')?.value || '').toLowerCase();
  const severity = document.getElementById('emerg-severity-filter')?.value || '';
  const status = document.getElementById('emerg-status-filter')?.value || '';

  const filtered = PolarSync.state.emergencies.filter(e => {
    const matchSearch = e.description.toLowerCase().includes(search) || e.id.toLowerCase().includes(search) || e.type.toLowerCase().includes(search) || e.location.toLowerCase().includes(search);
    const matchSev = !severity || e.severity === severity;
    const matchStat = !status || e.status === status;
    return matchSearch && matchSev && matchStat;
  });

  renderEmergencyRows(filtered);
}

function openCreateEmergencyModal() {
  const bodyHtml = \`
    <form id="create-emerg-form">
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 12px;">
        <div>
          <label class="text-xs font-semibold text-muted">Incident Code</label>
          <input type="text" id="m-emg-id" class="input-control" value="INC-\${Math.floor(200 + Math.random() * 800)}" required>
        </div>
        <div>
          <label class="text-xs font-semibold text-muted">Incident Type</label>
          <select id="m-emg-type" class="select-control">
            <option>Power Plant Malfunction</option>
            <option>Blizzard & Severe Frostbite</option>
            <option>Crevasse Vehicle Fall</option>
            <option>Medical Evacuation (MEDEVAC)</option>
            <option>Satellite Uplink Blackout</option>
            <option>Fuel Leakage Hazard</option>
          </select>
        </div>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 12px;">
        <div>
          <label class="text-xs font-semibold text-muted">Affected Station / Outpost</label>
          <select id="m-emg-loc" class="select-control">
            \${PolarSync.state.stations.map(st => \`<option value="\${st.name}">\${st.name}</option>\`).join('')}
          </select>
        </div>
        <div>
          <label class="text-xs font-semibold text-muted">Severity Level</label>
          <select id="m-emg-sev" class="select-control">
            <option>Critical</option>
            <option>High</option>
            <option>Moderate</option>
          </select>
        </div>
      </div>

      <div style="margin-bottom: 12px;">
        <label class="text-xs font-semibold text-muted">Incident Description & Casualties</label>
        <textarea id="m-emg-desc" class="input-control" rows="3" placeholder="Provide precise situation report, affected personnel, immediate risks..." required></textarea>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 12px;">
        <div>
          <label class="text-xs font-semibold text-muted">Incident Commander / Response Lead</label>
          <input type="text" id="m-emg-lead" class="input-control" value="Dr. Arvind Swaminathan" required>
        </div>
        <div>
          <label class="text-xs font-semibold text-muted">Associated Expedition</label>
          <input type="text" id="m-emg-exp" class="input-control" value="EXP-2026-01">
        </div>
      </div>
    </form>
  \`;

  openModal('Declare Polar Emergency Incident', bodyHtml, '<button class="btn btn-danger" onclick="submitCreateEmergency()">Broadcast Emergency</button>');
}

function submitCreateEmergency() {
  const id = document.getElementById('m-emg-id').value;
  const type = document.getElementById('m-emg-type').value;
  const loc = document.getElementById('m-emg-loc').value;
  const sev = document.getElementById('m-emg-sev').value;
  const desc = document.getElementById('m-emg-desc').value;
  const lead = document.getElementById('m-emg-lead').value;
  const exp = document.getElementById('m-emg-exp').value;

  if (!id || !desc) {
    showToast('Incident Code and Description are required.', 'danger');
    return;
  }

  const newInc = {
    id: id,
    type: type,
    location: loc,
    description: desc,
    reportedAt: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
    severity: sev,
    status: 'Active',
    assignedLead: lead,
    expedition: exp
  };

  PolarSync.state.emergencies.unshift(newInc);
  PolarSync.logAudit('EMERGENCY_DECLARED', 'Emergency', id, \`Declared [\${sev}] \${type} at \${loc}\`, 'Alert');
  PolarSync.notify('Emergency', \`🚨 EMERGENCY DECLARED: \${id}\`, \`\${sev} incident at \${loc}: \${desc}\`);
  PolarSync.save();
  closeModal();
  renderEmergency(document.getElementById('page-container'));
  showToast(\`Emergency incident \${id} broadcasted to all polar stations\`, 'danger');
}

function resolveEmergency(incId) {
  const inc = PolarSync.state.emergencies.find(e => e.id === incId);
  if (!inc) return;

  inc.status = 'Resolved';
  PolarSync.logAudit('EMERGENCY_RESOLVED', 'Emergency', incId, \`Incident resolved by \${PolarSync.currentUser.name}\`);
  PolarSync.notify('Emergency', \`INCIDENT RESOLVED: \${incId}\`, \`\${inc.type} at \${inc.location} marked fully resolved.\`);
  PolarSync.save();
  renderEmergency(document.getElementById('page-container'));
  showToast(\`Incident \${incId} resolved\`, 'success');
}

function openUpdateEmergencyModal(incId) {
  const inc = PolarSync.state.emergencies.find(e => e.id === incId);
  if (!inc) return;

  const bodyHtml = \`
    <div style="margin-bottom: 12px;">
      <div class="font-bold">\${inc.id}: \${inc.type}</div>
      <div class="text-xs text-muted">\${inc.location} • \${inc.severity}</div>
    </div>

    <div style="margin-bottom: 12px;">
      <label class="text-xs font-semibold text-muted">Response Status</label>
      <select id="upd-emg-status" class="select-control">
        <option \${inc.status === 'Active' ? 'selected' : ''}>Active</option>
        <option \${inc.status === 'Response Active' ? 'selected' : ''}>Response Active</option>
        <option \${inc.status === 'Investigating' ? 'selected' : ''}>Investigating</option>
        <option \${inc.status === 'Resolved' ? 'selected' : ''}>Resolved</option>
      </select>
    </div>

    <div style="margin-bottom: 12px;">
      <label class="text-xs font-semibold text-muted">Response Team / Lead</label>
      <input type="text" id="upd-emg-lead" class="input-control" value="\${inc.assignedLead}">
    </div>
  \`;

  openModal(\`Update Incident: \${inc.id}\`, bodyHtml, \`<button class="btn btn-primary" onclick="submitUpdateEmergency('\${inc.id}')">Save Status</button>\`);
}

function submitUpdateEmergency(incId) {
  const inc = PolarSync.state.emergencies.find(e => e.id === incId);
  if (!inc) return;

  inc.status = document.getElementById('upd-emg-status').value;
  inc.assignedLead = document.getElementById('upd-emg-lead').value;

  PolarSync.logAudit('EMERGENCY_UPDATED', 'Emergency', incId, \`Status changed to \${inc.status}\`);
  PolarSync.save();
  closeModal();
  renderEmergency(document.getElementById('page-container'));
  showToast(\`Updated incident \${incId}\`, 'info');
}

function exportEmergencyCsv() {
  const headers = ['IncidentID', 'Type', 'Location', 'Description', 'ReportedAt', 'Severity', 'Status', 'ResponseLead', 'Expedition'];
  const rows = PolarSync.state.emergencies.map(e => [
    e.id, e.type, e.location, e.description, e.reportedAt, e.severity, e.status, e.assignedLead, e.expedition
  ]);
  exportDataToCsv('PolarSync_Emergency_Incidents.csv', headers, rows);
}

/* =========================================================================
   OPERATIONAL TASKS MODULE (TABLE & KANBAN VIEWS)
   ========================================================================= */
let currentTasksView = 'kanban'; // or 'table'

function renderTasks(container) {
  const s = PolarSync.state;

  container.innerHTML = \`
    <div class="card">
      <div class="card-header">
        <div class="card-title">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 11 12 14 22 4"></polyline><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path></svg>
          Operational Field Tasks & Logistics Workflows
        </div>
        <div class="flex gap-2">
          <div class="flex" style="background: var(--bg-subtle); border-radius: var(--radius-sm); padding: 2px;">
            <button class="btn btn-sm \${currentTasksView === 'kanban' ? 'btn-primary' : 'btn-secondary'}" onclick="setTasksView('kanban')" style="border: none;">Kanban Board</button>
            <button class="btn btn-sm \${currentTasksView === 'table' ? 'btn-primary' : 'btn-secondary'}" onclick="setTasksView('table')" style="border: none;">Table View</button>
          </div>
          <button class="btn btn-primary btn-sm" onclick="openCreateTaskModal()">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            Create Task
          </button>
        </div>
      </div>
      <div class="card-body">
        <div id="tasks-view-container">
          <!-- Rendered according to view mode -->
        </div>
      </div>
    </div>
  \`;

  renderTasksContent();
}

function setTasksView(mode) {
  currentTasksView = mode;
  renderTasks(document.getElementById('page-container'));
}

function renderTasksContent() {
  const container = document.getElementById('tasks-view-container');
  if (!container) return;

  const tasks = PolarSync.state.tasks;

  if (currentTasksView === 'table') {
    container.innerHTML = \`
      <div class="table-wrapper">
        <table class="data-table">
          <thead>
            <tr>
              <th>Task ID</th>
              <th>Task Title</th>
              <th>Assignee</th>
              <th>Due Date</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            \${tasks.map(t => \`
              <tr>
                <td><strong>\${t.id}</strong></td>
                <td>
                  <strong>\${t.title}</strong>
                  <div class="text-xs text-muted">Expedition: \${t.expedition}</div>
                </td>
                <td>\${t.assignee}</td>
                <td class="text-xs">\${t.dueDate}</td>
                <td>
                  <span class="badge \${t.priority === 'Critical' ? 'badge-danger' : (t.priority === 'High' ? 'badge-warning' : 'badge-neutral')}">
                    \${t.priority}
                  </span>
                </td>
                <td>
                  <span class="badge \${t.status === 'Completed' ? 'badge-success' : (t.status === 'In Progress' ? 'badge-info' : (t.status === 'Blocked' ? 'badge-danger' : 'badge-warning'))}">
                    \${t.status}
                  </span>
                </td>
                <td>
                  <div class="table-actions">
                    <button class="btn btn-secondary btn-sm" onclick="advanceTaskStatus('\${t.id}')">Advance</button>
                    <button class="btn btn-danger-outline btn-sm" onclick="deleteTask('\${t.id}')">Delete</button>
                  </div>
                </td>
              </tr>
            \`).join('')}
          </tbody>
        </table>
      </div>
    \`;
  } else {
    // KANBAN VIEW
    const cols = ['Pending', 'In Progress', 'Blocked', 'Completed'];

    container.innerHTML = \`
      <div class="kanban-board">
        \${cols.map(col => {
          const colTasks = tasks.filter(t => t.status === col);
          return \`
            <div class="kanban-col">
              <div class="kanban-header">
                <span>\${col}</span>
                <span class="badge badge-neutral">\${colTasks.length}</span>
              </div>
              <div class="kanban-cards-wrapper">
                \${colTasks.map(t => \`
                  <div class="kanban-card">
                    <div class="flex items-center justify-between" style="margin-bottom: 4px;">
                      <span class="text-xs font-bold text-muted">\${t.id}</span>
                      <span class="badge \${t.priority === 'Critical' ? 'badge-danger' : (t.priority === 'High' ? 'badge-warning' : 'badge-neutral')}">\${t.priority}</span>
                    </div>
                    <div class="font-bold text-sm" style="margin-bottom: 6px;">\${t.title}</div>
                    <div class="text-xs text-muted">Assignee: \${t.assignee}</div>
                    <div class="text-xs text-muted">Due: \${t.dueDate}</div>
                    <div class="flex justify-between items-center" style="margin-top: 10px; border-top: 1px solid var(--border-color); padding-top: 6px;">
                      <span class="text-xs text-muted">\${t.expedition}</span>
                      <button class="btn btn-secondary btn-sm" onclick="advanceTaskStatus('\${t.id}')" title="Move to next stage">→</button>
                    </div>
                  </div>
                \`).join('')}
              </div>
            </div>
          \`;
        }).join('')}
      </div>
    \`;
  }
}

function advanceTaskStatus(taskId) {
  const t = PolarSync.state.tasks.find(item => item.id === taskId);
  if (!t) return;

  const flow = ['Pending', 'In Progress', 'Completed'];
  let curIdx = flow.indexOf(t.status);
  if (curIdx === -1) curIdx = 0;
  t.status = flow[(curIdx + 1) % flow.length];

  PolarSync.logAudit('TASK_STATUS_CHANGED', 'Tasks', taskId, \`Advanced status to \${t.status}\`);
  PolarSync.save();
  renderTasksContent();
  showToast(\`Task \${taskId} marked \${t.status}\`, 'info');
}

function openCreateTaskModal() {
  const bodyHtml = \`
    <form id="create-task-form">
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 12px;">
        <div>
          <label class="text-xs font-semibold text-muted">Task ID</label>
          <input type="text" id="m-tsk-id" class="input-control" value="TSK-\${Math.floor(100 + Math.random() * 900)}" required>
        </div>
        <div>
          <label class="text-xs font-semibold text-muted">Priority</label>
          <select id="m-tsk-priority" class="select-control">
            <option>Critical</option>
            <option selected>High</option>
            <option>Medium</option>
            <option>Low</option>
          </select>
        </div>
      </div>

      <div style="margin-bottom: 12px;">
        <label class="text-xs font-semibold text-muted">Task Title</label>
        <input type="text" id="m-tsk-title" class="input-control" placeholder="e.g. Calibrate Dobson Ozone Spectrophotometer" required>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 12px;">
        <div>
          <label class="text-xs font-semibold text-muted">Assignee</label>
          <input type="text" id="m-tsk-assignee" class="input-control" value="Dr. Arvind Swaminathan" required>
        </div>
        <div>
          <label class="text-xs font-semibold text-muted">Due Date</label>
          <input type="date" id="m-tsk-due" class="input-control" value="2026-11-15" required>
        </div>
      </div>
    </form>
  \`;

  openModal('Create Operational Task', bodyHtml, '<button class="btn btn-primary" onclick="submitCreateTask()">Create Task</button>');
}

function submitCreateTask() {
  const id = document.getElementById('m-tsk-id').value;
  const title = document.getElementById('m-tsk-title').value;
  const priority = document.getElementById('m-tsk-priority').value;
  const assignee = document.getElementById('m-tsk-assignee').value;
  const due = document.getElementById('m-tsk-due').value;

  if (!id || !title) {
    showToast('Task ID and Title are required.', 'danger');
    return;
  }

  const newTask = {
    id: id,
    title: title,
    assignee: assignee,
    status: 'Pending',
    priority: priority,
    dueDate: due,
    expedition: 'EXP-2026-01'
  };

  PolarSync.state.tasks.unshift(newTask);
  PolarSync.logAudit('TASK_CREATED', 'Tasks', id, \`Created task: \${title}\`);
  PolarSync.save();
  closeModal();
  renderTasksContent();
  showToast(\`Created task \${id}\`, 'success');
}

function deleteTask(taskId) {
  const idx = PolarSync.state.tasks.findIndex(t => t.id === taskId);
  if (idx !== -1) {
    PolarSync.state.tasks.splice(idx, 1);
    PolarSync.logAudit('TASK_DELETED', 'Tasks', taskId, 'Task deleted');
    PolarSync.save();
    renderTasksContent();
    showToast(\`Task \${taskId} removed\`, 'info');
  }
}
`;
}

module.exports = { getRenderersPart2 };
