/**
 * POLARSYNC Client-Side JavaScript Logic
 */

function getAppScript() {
  return `
/* === STATE ENGINE & LOCALSTORAGE PERSISTENCE === */
class PolarSyncEngine {
  constructor() {
    this.storageKey = 'polarsync_data_v26062';
    this.state = this.loadState();
    this.offlineQueue = [];
    this.activeChartInstances = {};
    this.mapInstance = null;
    this.currentUser = {
      name: 'Dr. Rajeshwar Sharma',
      email: 'admin@polarsync.gov',
      role: 'Super Admin'
    };
  }

  loadState() {
    try {
      const saved = localStorage.getItem(this.storageKey);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Failed to parse localStorage data:', e);
    }
    return JSON.parse(JSON.stringify(window.__DEFAULT_DATA__));
  }

  save() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.state));
    } catch (e) {
      console.error('Failed to save to localStorage:', e);
    }
    this.updateBadges();
  }

  logAudit(action, moduleName, recordId, details, status = 'Success') {
    const log = {
      id: 'AUD-' + Math.floor(100 + Math.random() * 900),
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
      user: this.currentUser.email,
      action: action,
      module: moduleName,
      record: recordId,
      details: details,
      ip: this.state.systemSettings.isOnline ? '10.240.4.12 (Bharati LAN)' : 'Local Cache (Offline)',
      status: status
    };
    this.state.auditLogs.unshift(log);
    if (this.state.auditLogs.length > 100) this.state.auditLogs.pop();
    this.save();
  }

  notify(category, title, message) {
    const notif = {
      id: 'NOTIF-' + Math.floor(100 + Math.random() * 900),
      category: category,
      title: title,
      message: message,
      time: 'Just now',
      read: false
    };
    this.state.notifications.unshift(notif);
    this.save();
    showToast(title, category === 'Emergency' ? 'danger' : 'info');
  }

  updateBadges() {
    const openEmergencies = this.state.emergencies.filter(e => e.status !== 'Resolved').length;
    const criticalInventory = this.state.inventory.filter(i => i.status === 'Critical' || i.status === 'Out of Stock').length;
    const inTransitCargo = this.state.cargo.filter(c => c.status === 'In Transit' || c.status === 'Delayed').length;
    const activeExpeditions = this.state.expeditions.filter(e => e.status === 'Active').length;
    const unreadNotifs = this.state.notifications.filter(n => !n.read).length;

    const elEmerg = document.getElementById('badge-emergency-open');
    if (elEmerg) elEmerg.textContent = openEmergencies;

    const elInv = document.getElementById('badge-inventory-critical');
    if (elInv) elInv.textContent = criticalInventory;

    const elCargo = document.getElementById('badge-cargo-transit');
    if (elCargo) elCargo.textContent = inTransitCargo;

    const elExp = document.getElementById('badge-expeditions-count');
    if (elExp) elExp.textContent = activeExpeditions;

    const elNotifBadge = document.getElementById('badge-notifications-unread');
    if (elNotifBadge) elNotifBadge.textContent = unreadNotifs;

    const elBubble = document.getElementById('notif-badge-bubble');
    if (elBubble) {
      elBubble.textContent = unreadNotifs;
      elBubble.style.display = unreadNotifs > 0 ? 'flex' : 'none';
    }
  }

  resetData() {
    this.state = JSON.parse(JSON.stringify(window.__DEFAULT_DATA__));
    this.save();
    showToast('Application reset to baseline expedition datasets.', 'success');
    renderCurrentPage();
  }

  loadJudgeDemoScenario() {
    this.state = JSON.parse(JSON.stringify(window.__DEFAULT_DATA__));
    
    // Set scenario: Bharati station critical generator malfunction & fuel reserve alert
    const bharatiExp = this.state.expeditions.find(e => e.id === 'EXP-2026-01');
    if (bharatiExp) {
      bharatiExp.status = 'Active';
      bharatiExp.progress = 68;
    }

    const genFail = this.state.emergencies.find(e => e.id === 'INC-201');
    if (genFail) {
      genFail.status = 'Response Active';
      genFail.severity = 'Critical';
    }

    const jetA1 = this.state.inventory.find(i => i.id === 'INV-101');
    if (jetA1) {
      jetA1.available = 950;
      jetA1.status = 'Critical';
    }

    this.logAudit('SCENARIO_LOADED', 'System', 'SIH-2026', 'Loaded Antarctic Scientific Expedition 2026 Judge Demonstration Scenario');
    this.notify('Emergency', 'DEMO SCENARIO INITIALIZED', 'Antarctic Scientific Expedition 2026 (Bharati Station) loaded with active Critical Incident INC-201.');
    this.save();
    window.location.hash = '#/dashboard';
    renderCurrentPage();
    showToast('Antarctic Expedition 2026 judge scenario active!', 'success');
  }
}

// Global App Instance
window.PolarSync = new PolarSyncEngine();

/* === ROUTING & NAVIGATION === */
function handleRouting() {
  const hash = window.location.hash || '#/dashboard';
  const route = hash.split('?')[0].replace('#/', '') || 'dashboard';

  // Highlight active sidebar item
  document.querySelectorAll('.nav-item').forEach(el => {
    if (el.dataset.route === route || (route === 'expedition-detail' && el.dataset.route === 'expeditions')) {
      el.classList.add('active');
    } else {
      el.classList.remove('active');
    }
  });

  // Update Breadcrumb
  const breadcrumbTitle = document.getElementById('breadcrumb-title');
  if (breadcrumbTitle) {
    const titles = {
      dashboard: 'Polar Operations Command Center',
      expeditions: 'Expedition Planning & Tracking',
      'expedition-detail': 'Expedition Operational Details',
      cargo: 'Integrated Polar Cargo Logistics',
      inventory: 'Life-Support & Station Inventory',
      assets: 'Critical Mission Asset Registry',
      personnel: 'Polar Personnel & Deployment Roster',
      stations: 'Research Stations & Remote Outposts',
      emergency: 'Polar Emergency Response Operations Center',
      tasks: 'Operational Tasks & Field Workflows',
      analytics: 'Logistics Analytics & Intelligence',
      notifications: 'System & Emergency Notifications',
      documents: 'Polar Logistics Documents & Compliance',
      users: 'Access Control & Role Management',
      audit: 'System Security & Operations Audit Logs',
      settings: 'System Preferences & Configuration'
    };
    breadcrumbTitle.textContent = titles[route] || 'Operations Console';
  }

  renderCurrentPage();
}

window.addEventListener('hashchange', handleRouting);

/* === AUTHENTICATION SIMULATION === */
function handleLogin(e) {
  if (e) e.preventDefault();
  const email = document.getElementById('login-email').value;
  PolarSync.currentUser.email = email;
  PolarSync.logAudit('USER_LOGIN', 'Auth', 'SESSION-01', 'User authenticated via Command Center');

  document.getElementById('view-login').classList.add('hidden');
  document.getElementById('app-shell').classList.remove('hidden');
  PolarSync.updateBadges();
  handleRouting();
  showToast('Welcome to POLARSYNC Command Console, ' + email, 'success');
}

function fillDemoCredentials() {
  document.getElementById('login-email').value = 'admin@polarsync.gov';
  document.getElementById('login-password').value = 'admin123';
}

function handleLogout() {
  PolarSync.logAudit('USER_LOGOUT', 'Auth', 'SESSION-01', 'User signed out of Command Center');
  document.getElementById('app-shell').classList.add('hidden');
  document.getElementById('view-login').classList.remove('hidden');
  showToast('Signed out of POLARSYNC', 'info');
}

/* === SIDEBAR & UI TOGGLES === */
function toggleSidebar() {
  const sb = document.getElementById('sidebar');
  sb.classList.toggle('collapsed');
}

function toggleMobileSidebar() {
  const sb = document.getElementById('sidebar');
  sb.classList.toggle('mobile-open');
}

function toggleDarkMode() {
  document.body.classList.toggle('theme-dark');
  const isDark = document.body.classList.contains('theme-dark');
  PolarSync.state.systemSettings.theme = isDark ? 'dark' : 'light';
  PolarSync.save();
  showToast('Switched to ' + (isDark ? 'Dark' : 'Light') + ' Command Interface', 'info');
}

function toggleUserDropdown() {
  const menu = document.getElementById('user-dropdown-menu');
  menu.classList.toggle('hidden');
}

function closeUserDropdown() {
  const menu = document.getElementById('user-dropdown-menu');
  if (menu) menu.classList.add('hidden');
}

document.addEventListener('click', (e) => {
  const menu = document.getElementById('user-dropdown-menu');
  if (menu && !menu.contains(e.target) && !e.target.closest('button[onclick*="toggleUserDropdown"]')) {
    menu.classList.add('hidden');
  }
});

/* === OFFLINE-FIRST DEMONSTRATION === */
function toggleOfflineMode() {
  const isCurrentlyOnline = PolarSync.state.systemSettings.isOnline;
  PolarSync.state.systemSettings.isOnline = !isCurrentlyOnline;
  PolarSync.save();

  const toggleBadge = document.getElementById('connectivity-toggle');
  const label = document.getElementById('connectivity-label');
  const banner = document.getElementById('offline-banner');

  if (PolarSync.state.systemSettings.isOnline) {
    toggleBadge.className = 'network-badge online';
    label.textContent = 'ONLINE';
    banner.classList.add('hidden');
    PolarSync.logAudit('SATELLITE_UPLINK_RESTORED', 'System', 'IRIDIUM-CERTUS', 'Re-established satellite link. Synchronized 14 queued local transactions.');
    showToast('Synchronization completed: Satellite link restored.', 'success');
  } else {
    toggleBadge.className = 'network-badge offline';
    label.textContent = 'OFFLINE';
    banner.classList.remove('hidden');
    PolarSync.logAudit('SATELLITE_LINK_DROPPED', 'System', 'LOCAL-CACHE', 'Simulated polar blackout: Switched to offline-first local storage mode.');
    showToast('Offline Mode: Changes will synchronize when connectivity is restored.', 'warning');
  }
}

/* === TOAST ENGINE === */
function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast ' + type;

  let iconSvg = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>';
  if (type === 'success') {
    iconSvg = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>';
  } else if (type === 'danger') {
    iconSvg = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2"><polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"></polygon><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>';
  } else if (type === 'warning') {
    iconSvg = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>';
  }

  toast.innerHTML = iconSvg + '<div>' + message + '</div>';
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

/* === MODAL UTILITY === */
function openModal(title, bodyHtml, footerButtonsHtml = '', size = '') {
  const container = document.getElementById('modal-container');
  container.innerHTML = \`
    <div class="modal-overlay" onclick="handleModalOverlayClick(event)">
      <div class="modal-dialog \${size}">
        <div class="modal-header">
          <div class="modal-title font-bold text-lg">\${title}</div>
          <button class="btn btn-secondary btn-icon btn-sm" onclick="closeModal()">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <div class="modal-body">\${bodyHtml}</div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" onclick="closeModal()">Close</button>
          \${footerButtonsHtml}
        </div>
      </div>
    </div>
  \`;
  container.classList.remove('hidden');
}

function closeModal() {
  const container = document.getElementById('modal-container');
  container.classList.add('hidden');
  container.innerHTML = '';
}

function handleModalOverlayClick(e) {
  if (e.target.classList.contains('modal-overlay')) {
    closeModal();
  }
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeModal();
    closeDrawer();
  }
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
    e.preventDefault();
    openGlobalSearch();
  }
});

/* === SLIDE-OVER DRAWER UTILITY === */
function openDrawer(title, contentHtml) {
  const container = document.getElementById('drawer-container');
  container.innerHTML = \`
    <div class="drawer-overlay" onclick="handleDrawerOverlayClick(event)">
      <div class="drawer-panel">
        <div class="modal-header" style="border-bottom: 1px solid var(--border-color);">
          <div class="font-bold text-lg">\${title}</div>
          <button class="btn btn-secondary btn-icon btn-sm" onclick="closeDrawer()">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <div style="padding: 20px; overflow-y: auto; flex: 1;">
          \${contentHtml}
        </div>
      </div>
    </div>
  \`;
  container.classList.remove('hidden');
}

function closeDrawer() {
  const container = document.getElementById('drawer-container');
  container.classList.add('hidden');
  container.innerHTML = '';
}

function handleDrawerOverlayClick(e) {
  if (e.target.classList.contains('drawer-overlay')) {
    closeDrawer();
  }
}

/* === GLOBAL SEARCH DIALOG === */
function openGlobalSearch() {
  const bodyHtml = \`
    <div style="margin-bottom: 16px;">
      <input type="text" id="global-search-input" class="input-control" placeholder="Type to search expeditions, cargo, inventory, assets, personnel, emergencies, stations, tasks..." autofocus oninput="executeGlobalSearch(this.value)">
    </div>
    <div id="global-search-results" style="max-height: 420px; overflow-y: auto;">
      <div class="text-center text-muted" style="padding: 30px 10px;">
        Type any query to search across all polar operational records
      </div>
    </div>
  \`;
  openModal('Global Operations Search', bodyHtml, '', 'lg');
  setTimeout(() => {
    const inp = document.getElementById('global-search-input');
    if (inp) inp.focus();
  }, 100);
}

function executeGlobalSearch(query) {
  const container = document.getElementById('global-search-results');
  if (!query || query.trim().length < 2) {
    container.innerHTML = '<div class="text-center text-muted" style="padding: 30px;">Type at least 2 characters to search.</div>';
    return;
  }

  const q = query.toLowerCase().trim();
  const state = PolarSync.state;

  const matchExp = state.expeditions.filter(e => e.name.toLowerCase().includes(q) || e.id.toLowerCase().includes(q) || e.station.toLowerCase().includes(q));
  const matchCargo = state.cargo.filter(c => c.description.toLowerCase().includes(q) || c.id.toLowerCase().includes(q) || c.currentLocation.toLowerCase().includes(q));
  const matchInv = state.inventory.filter(i => i.item.toLowerCase().includes(q) || i.id.toLowerCase().includes(q) || i.station.toLowerCase().includes(q));
  const matchAst = state.assets.filter(a => a.name.toLowerCase().includes(q) || a.id.toLowerCase().includes(q) || a.location.toLowerCase().includes(q));
  const matchPer = state.personnel.filter(p => p.name.toLowerCase().includes(q) || p.role.toLowerCase().includes(q) || p.location.toLowerCase().includes(q));
  const matchEmerg = state.emergencies.filter(e => e.id.toLowerCase().includes(q) || e.type.toLowerCase().includes(q) || e.location.toLowerCase().includes(q) || e.description.toLowerCase().includes(q));
  const matchTasks = state.tasks.filter(t => t.title.toLowerCase().includes(q) || t.id.toLowerCase().includes(q));

  let html = '';

  const renderGroup = (title, items, renderItem) => {
    if (items.length === 0) return '';
    return \`
      <div style="margin-bottom: 16px;">
        <div class="text-xs font-bold text-muted" style="text-transform: uppercase; margin-bottom: 6px; letter-spacing: 0.05em;">\${title} (\${items.length})</div>
        <div style="display: flex; flex-direction: column; gap: 6px;">
          \${items.slice(0, 5).map(renderItem).join('')}
        </div>
      </div>
    \`;
  };

  html += renderGroup('Expeditions', matchExp, e => \`
    <div onclick="closeModal(); window.location.hash='#/expedition-detail?id=\${e.id}'" style="padding: 10px; background: var(--bg-subtle); border-radius: var(--radius-sm); cursor: pointer; display: flex; align-items: center; justify-content: space-between;">
      <div><strong>\${e.id}</strong> — \${e.name}</div>
      <span class="badge badge-info">\${e.status}</span>
    </div>
  \`);

  html += renderGroup('Emergencies', matchEmerg, e => \`
    <div onclick="closeModal(); window.location.hash='#/emergency'" style="padding: 10px; background: var(--bg-subtle); border-radius: var(--radius-sm); cursor: pointer; display: flex; align-items: center; justify-content: space-between;">
      <div><strong style="color: var(--status-red);">\${e.id}</strong> (\${e.severity}) — \${e.location}</div>
      <span class="badge badge-danger">\${e.status}</span>
    </div>
  \`);

  html += renderGroup('Cargo Shipments', matchCargo, c => \`
    <div onclick="closeModal(); window.location.hash='#/cargo'" style="padding: 10px; background: var(--bg-subtle); border-radius: var(--radius-sm); cursor: pointer; display: flex; align-items: center; justify-content: space-between;">
      <div><strong>\${c.id}</strong>: \${c.description}</div>
      <span class="badge badge-neutral">\${c.status}</span>
    </div>
  \`);

  html += renderGroup('Inventory', matchInv, i => \`
    <div onclick="closeModal(); window.location.hash='#/inventory'" style="padding: 10px; background: var(--bg-subtle); border-radius: var(--radius-sm); cursor: pointer; display: flex; align-items: center; justify-content: space-between;">
      <div><strong>\${i.id}</strong>: \${i.item} (\${i.station})</div>
      <span class="badge \${i.status === 'Critical' ? 'badge-danger' : 'badge-neutral'}">\${i.available} \${i.unit}</span>
    </div>
  \`);

  html += renderGroup('Personnel', matchPer, p => \`
    <div onclick="closeModal(); window.location.hash='#/personnel'" style="padding: 10px; background: var(--bg-subtle); border-radius: var(--radius-sm); cursor: pointer; display: flex; align-items: center; justify-content: space-between;">
      <div><strong>\${p.name}</strong> — \${p.role} (\${p.location})</div>
      <span class="badge badge-neutral">\${p.status}</span>
    </div>
  \`);

  html += renderGroup('Assets', matchAst, a => \`
    <div onclick="closeModal(); window.location.hash='#/assets'" style="padding: 10px; background: var(--bg-subtle); border-radius: var(--radius-sm); cursor: pointer; display: flex; align-items: center; justify-content: space-between;">
      <div><strong>\${a.id}</strong>: \${a.name} (\${a.location})</div>
      <span class="badge \${a.condition === 'Operational' ? 'badge-success' : 'badge-warning'}">\${a.condition}</span>
    </div>
  \`);

  container.innerHTML = html || '<div class="text-center text-muted" style="padding: 30px;">No records matched your search query.</div>';
}

/* === AI OPERATIONS ASSISTANT (SIMULATED PROTOTYPE) === */
function openAiAssistantDrawer() {
  const contentHtml = \`
    <div style="background: var(--bg-subtle); padding: 12px; border-radius: var(--radius-sm); margin-bottom: 16px; font-size: 0.78rem; color: var(--text-muted);">
      <strong>AI Operations Assistant — Prototype:</strong> Powered by deterministic rule-based analysis on live local expedition telemetry. No external API keys required.
    </div>

    <div style="margin-bottom: 16px;">
      <div class="text-xs font-bold text-muted" style="margin-bottom: 8px;">QUICK QUERIES:</div>
      <div style="display: flex; flex-direction: column; gap: 6px;">
        <button class="btn btn-secondary btn-sm" style="text-align: left; justify-content: flex-start;" onclick="runAiQuery('Which inventory items are critical?')">
          🚨 Which inventory items are critical?
        </button>
        <button class="btn btn-secondary btn-sm" style="text-align: left; justify-content: flex-start;" onclick="runAiQuery('Which cargo is delayed?')">
          📦 Which cargo shipments are delayed?
        </button>
        <button class="btn btn-secondary btn-sm" style="text-align: left; justify-content: flex-start;" onclick="runAiQuery('Show active emergencies.')">
          ⚠️ Show active emergency incidents
        </button>
        <button class="btn btn-secondary btn-sm" style="text-align: left; justify-content: flex-start;" onclick="runAiQuery('Which assets require maintenance?')">
          🛠️ Which assets require maintenance?
        </button>
        <button class="btn btn-secondary btn-sm" style="text-align: left; justify-content: flex-start;" onclick="runAiQuery('Summarize today\\'s operations.')">
          📋 Summarize today's polar operations
        </button>
      </div>
    </div>

    <div style="margin-bottom: 16px;">
      <div class="flex gap-2">
        <input type="text" id="ai-custom-prompt" class="input-control" placeholder="Ask a question about current logistics...">
        <button class="btn btn-primary" onclick="handleCustomAiPrompt()">Ask</button>
      </div>
    </div>

    <div id="ai-chat-output" style="display: flex; flex-direction: column; gap: 12px;">
      <div style="background: var(--bg-subtle); padding: 14px; border-radius: var(--radius-md); font-size: 0.85rem;">
        Greetings, Commander. I am monitoring 10 stations and outposts. How may I assist your expedition logistics today?
      </div>
    </div>
  \`;
  openDrawer('AI Operations Assistant', contentHtml);
}

function handleCustomAiPrompt() {
  const inp = document.getElementById('ai-custom-prompt');
  if (inp && inp.value.trim()) {
    runAiQuery(inp.value.trim());
    inp.value = '';
  }
}

function runAiQuery(prompt) {
  const chatOutput = document.getElementById('ai-chat-output');
  if (!chatOutput) return;

  // Append user bubble
  const userBubble = document.createElement('div');
  userBubble.style.cssText = 'background: var(--ice-blue); color: #fff; padding: 10px 14px; border-radius: var(--radius-md); align-self: flex-end; font-size: 0.85rem; max-width: 85%;';
  userBubble.textContent = prompt;
  chatOutput.appendChild(userBubble);

  // Generate deterministic response based on real current state
  const state = PolarSync.state;
  let responseText = '';

  const p = prompt.toLowerCase();
  if (p.includes('inventory') && (p.includes('critical') || p.includes('low'))) {
    const crit = state.inventory.filter(i => i.status === 'Critical' || i.status === 'Out of Stock');
    responseText = \`Found \${crit.length} critical inventory items requiring immediate logistics attention:\\n\\n\` +
      crit.map(i => \`• \${i.item} at \${i.station}: Available \${i.available} \${i.unit} (Min: \${i.minimum} \${i.unit}) [\${i.status}]\`).join('\\n');
  } else if (p.includes('cargo') && (p.includes('delayed') || p.includes('transit'))) {
    const delayed = state.cargo.filter(c => c.status === 'Delayed');
    responseText = \`Currently \${delayed.length} cargo shipments flagged as Delayed:\\n\\n\` +
      delayed.map(c => \`• \${c.id}: \${c.description} (Origin: \${c.origin} → Dest: \${c.destination}). ETA \${c.eta} via \${c.transportMode}\`).join('\\n');
  } else if (p.includes('emergency') || p.includes('incidents')) {
    const active = state.emergencies.filter(e => e.status !== 'Resolved');
    responseText = \`Found \${active.length} active emergency incidents:\\n\\n\` +
      active.map(e => \`• [\${e.severity}] \${e.id} at \${e.location}: \${e.description} (Status: \${e.status})\`).join('\\n\\n');
  } else if (p.includes('asset') && p.includes('maintenance')) {
    const maint = state.assets.filter(a => a.condition === 'Maintenance' || a.status === 'Maintenance');
    responseText = \`Identified \${maint.length} assets currently undergoing maintenance or requiring inspection:\\n\\n\` +
      maint.map(a => \`• \${a.id} (\${a.name}) at \${a.location} - Lead: \${a.lead} (Next maint: \${a.nextMaint})\`).join('\\n');
  } else {
    // Summary
    const openEmerg = state.emergencies.filter(e => e.status !== 'Resolved').length;
    const activeExp = state.expeditions.filter(e => e.status === 'Active').length;
    const transitCargo = state.cargo.filter(c => c.status === 'In Transit').length;
    const critInv = state.inventory.filter(i => i.status === 'Critical').length;
    responseText = \`POLAR OPERATIONS SITUATION SUMMARY:\\n\\n\` +
      \`• Active Expeditions: \${activeExp} underway across Antarctica and Arctic\\n\` +
      \`• Open Emergency Incidents: \${openEmerg} (\${state.emergencies.find(e => e.severity === 'Critical') ? 'CRITICAL INCIDENT ACTIVE' : 'Nominal'})\\n\` +
      \`• Cargo Shipments In Transit: \${transitCargo} consignments en-route\\n\` +
      \`• Critical Inventory Warnings: \${critInv} items below safety reserves\\n\` +
      \`• Station Connectivity: Primary stations Bharati & Maitri reporting optimal telemetry.\`;
  }

  // Append assistant bubble
  setTimeout(() => {
    const aiBubble = document.createElement('div');
    aiBubble.style.cssText = 'background: var(--bg-subtle); padding: 14px; border-radius: var(--radius-md); font-size: 0.85rem; white-space: pre-wrap;';
    aiBubble.textContent = responseText;
    chatOutput.appendChild(aiBubble);
    chatOutput.scrollTop = chatOutput.scrollHeight;
  }, 250);
}

/* === QUICK NOTIFICATION MENU === */
function openNotificationQuickMenu() {
  const notifs = PolarSync.state.notifications;
  const unread = notifs.filter(n => !n.read);

  const bodyHtml = \`
    <div class="flex items-center justify-between" style="margin-bottom: 14px;">
      <span class="text-sm font-semibold">Unread Notifications (\${unread.length})</span>
      <button class="btn btn-secondary btn-sm" onclick="markAllNotificationsRead(); closeModal();">Mark All as Read</button>
    </div>
    <div style="display: flex; flex-direction: column; gap: 8px; max-height: 380px; overflow-y: auto;">
      \${notifs.slice(0, 10).map(n => \`
        <div style="padding: 10px; background: \${n.read ? 'var(--bg-subtle)' : 'var(--ice-blue-light)'}; border-radius: var(--radius-sm); border: 1px solid var(--border-color);">
          <div class="flex items-center justify-between">
            <span class="badge \${n.category === 'Emergency' ? 'badge-danger' : 'badge-neutral'}">\${n.category}</span>
            <span class="text-xs text-muted">\${n.time}</span>
          </div>
          <div class="font-bold text-sm" style="margin-top: 4px;">\${n.title}</div>
          <div class="text-xs text-muted" style="margin-top: 2px;">\${n.message}</div>
        </div>
      \`).join('')}
    </div>
  \`;
  openModal('System Notifications', bodyHtml, '<button class="btn btn-primary" onclick="closeModal(); window.location.hash=\\'#/notifications\\'">View All Notifications</button>');
}

function markAllNotificationsRead() {
  PolarSync.state.notifications.forEach(n => n.read = true);
  PolarSync.save();
  showToast('All notifications marked as read', 'info');
}

/* === CSV EXPORT ENGINE === */
function exportDataToCsv(filename, headers, rows) {
  let csvContent = "data:text/csv;charset=utf-8," + headers.join(",") + "\\n";
  rows.forEach(row => {
    const escapedRow = row.map(field => {
      const stringified = String(field || '').replace(/"/g, '""');
      return \`"\${stringified}"\`;
    });
    csvContent += escapedRow.join(",") + "\\n";
  });

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  link.remove();
  showToast('Downloaded ' + filename, 'success');
}
`;
}

module.exports = { getAppScript };
