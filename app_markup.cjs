/**
 * POLARSYNC Base HTML Markup
 */

function getAppHtml() {
  return `
  <!-- LOGIN PAGE VIEW -->
  <div id="view-login">
    <div class="login-card">
      <div class="login-brand">
        <div class="brand-icon-box">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
          </svg>
        </div>
        <div>
          <div class="login-title">POLARSYNC</div>
          <div style="font-size: 0.72rem; color: #64748b; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em;">Integrated Polar Expedition Logistics</div>
        </div>
      </div>
      
      <div class="tagline-strip">
        "One Expedition. One Digital Picture. One Coordinated Operation."
      </div>

      <div class="feature-chips">
        <span class="feature-chip">EXPEDITION PLANNING</span>
        <span class="feature-chip">CARGO TRACKING</span>
        <span class="feature-chip">ASSET MANAGEMENT</span>
        <span class="feature-chip">INVENTORY CONTROL</span>
        <span class="feature-chip">PERSONNEL SAFETY</span>
        <span class="feature-chip">EMERGENCY RESPONSE</span>
      </div>

      <form id="login-form" onsubmit="handleLogin(event)">
        <div style="margin-bottom: 14px;">
          <label class="text-xs font-semibold text-muted" style="display: block; margin-bottom: 5px;">COMMAND ACCESS EMAIL</label>
          <input type="email" id="login-email" class="input-control" value="admin@polarsync.gov" required placeholder="name@polarsync.gov">
        </div>

        <div style="margin-bottom: 20px;">
          <label class="text-xs font-semibold text-muted" style="display: block; margin-bottom: 5px;">AUTHORIZATION TOKEN / PASSWORD</label>
          <input type="password" id="login-password" class="input-control" value="admin123" required placeholder="••••••••">
        </div>

        <button type="submit" class="btn btn-primary w-full" style="padding: 10px; font-weight: 600;">
          Authenticate Command Session
        </button>
      </form>

      <div class="demo-account-box">
        <div class="flex items-center justify-between" style="margin-bottom: 6px;">
          <span class="font-semibold text-muted text-xs">DEMO CREDENTIALS</span>
          <button type="button" class="btn btn-secondary btn-sm" onclick="fillDemoCredentials()">Use Demo Account</button>
        </div>
        <div>Email: <code>admin@polarsync.gov</code></div>
        <div>Password: <code>admin123</code></div>
      </div>

      <div style="margin-top: 20px; text-align: center; font-size: 0.75rem; color: #94a3b8;">
        Smart India Hackathon 2026 Prototype — Problem Statement 26062<br>
        <span style="color: #64748b;">Operational polar data shown is simulated for demonstration.</span>
      </div>
    </div>
  </div>

  <!-- MAIN APPLICATION SHELL -->
  <div id="app-shell" class="hidden">
    <!-- SIDEBAR -->
    <aside id="sidebar">
      <div class="sidebar-header">
        <a href="#/dashboard" class="sidebar-brand">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" stroke-width="2.2">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
          </svg>
          <span class="nav-label">POLARSYNC</span>
        </a>
        <button id="sidebar-toggle-btn" class="btn btn-secondary btn-icon btn-sm" style="background: transparent; border: none; color: #94a3b8;" onclick="toggleSidebar()" title="Collapse Sidebar">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>
      </div>

      <div class="sidebar-nav">
        <div class="nav-section-title">COMMAND</div>
        <a href="#/dashboard" class="nav-item" data-route="dashboard">
          <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="3" width="7" height="7"></rect>
            <rect x="14" y="3" width="7" height="7"></rect>
            <rect x="14" y="14" width="7" height="7"></rect>
            <rect x="3" y="14" width="7" height="7"></rect>
          </svg>
          <span class="nav-label">Dashboard</span>
        </a>

        <div class="nav-section-title">OPERATIONS</div>
        <a href="#/expeditions" class="nav-item" data-route="expeditions">
          <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"></circle>
            <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon>
          </svg>
          <span class="nav-label">Expeditions</span>
          <span class="nav-badge" id="badge-expeditions-count">4</span>
        </a>
        <a href="#/cargo" class="nav-item" data-route="cargo">
          <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="1" y="3" width="15" height="13"></rect>
            <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
            <circle cx="5.5" cy="18.5" r="2.5"></circle>
            <circle cx="18.5" cy="18.5" r="2.5"></circle>
          </svg>
          <span class="nav-label">Cargo Tracking</span>
          <span class="nav-badge" id="badge-cargo-transit">23</span>
        </a>
        <a href="#/inventory" class="nav-item" data-route="inventory">
          <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
            <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
            <line x1="12" y1="22.08" x2="12" y2="12"></line>
          </svg>
          <span class="nav-label">Inventory</span>
          <span class="nav-badge danger" id="badge-inventory-critical">6</span>
        </a>
        <a href="#/assets" class="nav-item" data-route="assets">
          <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
          </svg>
          <span class="nav-label">Asset Management</span>
        </a>
        <a href="#/personnel" class="nav-item" data-route="personnel">
          <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
          </svg>
          <span class="nav-label">Personnel</span>
        </a>
        <a href="#/stations" class="nav-item" data-route="stations">
          <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
            <circle cx="12" cy="10" r="3"></circle>
          </svg>
          <span class="nav-label">Stations & Bases</span>
        </a>
        <a href="#/tasks" class="nav-item" data-route="tasks">
          <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="9 11 12 14 22 4"></polyline>
            <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
          </svg>
          <span class="nav-label">Tasks & Ops</span>
        </a>

        <div class="nav-section-title">SAFETY</div>
        <a href="#/emergency" class="nav-item" data-route="emergency">
          <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
            <line x1="12" y1="9" x2="12" y2="13"></line>
            <line x1="12" y1="17" x2="12.01" y2="17"></line>
          </svg>
          <span class="nav-label">Emergency Center</span>
          <span class="nav-badge danger" id="badge-emergency-open">2</span>
        </a>

        <div class="nav-section-title">INSIGHTS</div>
        <a href="#/analytics" class="nav-item" data-route="analytics">
          <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="20" x2="18" y2="10"></line>
            <line x1="12" y1="20" x2="12" y2="4"></line>
            <line x1="6" y1="20" x2="6" y2="14"></line>
          </svg>
          <span class="nav-label">Analytics & Reports</span>
        </a>

        <div class="nav-section-title">SYSTEM</div>
        <a href="#/notifications" class="nav-item" data-route="notifications">
          <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
          </svg>
          <span class="nav-label">Notifications</span>
          <span class="nav-badge" id="badge-notifications-unread">4</span>
        </a>
        <a href="#/documents" class="nav-item" data-route="documents">
          <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
            <polyline points="10 9 9 9 8 9"></polyline>
          </svg>
          <span class="nav-label">Documents</span>
        </a>
        <a href="#/users" class="nav-item" data-route="users">
          <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
          <span class="nav-label">User & Roles</span>
        </a>
        <a href="#/audit" class="nav-item" data-route="audit">
          <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
          </svg>
          <span class="nav-label">Audit Logs</span>
        </a>
        <a href="#/settings" class="nav-item" data-route="settings">
          <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="3"></circle>
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
          </svg>
          <span class="nav-label">Settings</span>
        </a>
      </div>

      <div class="sidebar-footer">
        <div class="system-status-indicator">
          <span class="badge-dot" style="background: #10b981;"></span>
          <span class="nav-label" style="font-size: 0.72rem;">NCPOR Gateway 2026.1</span>
        </div>
      </div>
    </aside>

    <!-- MAIN CONTENT WRAPPER -->
    <div id="main-wrapper">
      <!-- TOP HEADER -->
      <header id="top-header">
        <div class="header-left">
          <button class="btn btn-secondary btn-icon btn-sm" id="mobile-menu-btn" onclick="toggleMobileSidebar()" style="display: none;">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
          
          <div class="breadcrumb" id="header-breadcrumb">
            <span>Command</span>
            <span>/</span>
            <span class="breadcrumb-current" id="breadcrumb-title">Polar Operations Command Center</span>
          </div>
        </div>

        <div class="header-actions">
          <!-- Global Search Trigger -->
          <button class="search-trigger-btn" onclick="openGlobalSearch()" title="Search all modules (Ctrl+K)">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <span>Search PolarSync...</span>
            <span class="kbd-shortcut">⌘K</span>
          </button>

          <!-- SIH Demo Scenario Loader -->
          <button class="btn btn-accent btn-sm" onclick="loadJudgeDemoScenario()" title="Reset & Load Antarctic Scientific Expedition 2026 Scenario">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"></path>
            </svg>
            <span>Demo Scenario</span>
          </button>

          <!-- AI Operations Assistant Trigger -->
          <button class="btn btn-secondary btn-sm" onclick="openAiAssistantDrawer()" title="Open Rule-based Operations Assistant">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0ea5e9" stroke-width="2">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
            </svg>
            <span>AI Ops Assistant</span>
          </button>

          <!-- Offline / Online Demo Toggle -->
          <div id="connectivity-toggle" class="network-badge online" onclick="toggleOfflineMode()" title="Toggle simulated satellite connectivity">
            <span class="badge-dot" style="background: currentColor;"></span>
            <span id="connectivity-label">ONLINE</span>
          </div>

          <!-- Notification Bell -->
          <div style="position: relative;">
            <button class="btn btn-secondary btn-icon" onclick="openNotificationQuickMenu()" title="Notifications">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
              </svg>
            </button>
            <span id="notif-badge-bubble" style="position: absolute; top: -4px; right: -4px; width: 18px; height: 18px; background: #ef4444; color: #fff; font-size: 0.65rem; font-weight: 700; border-radius: 50%; display: flex; align-items: center; justify-content: center;">3</span>
          </div>

          <!-- User Menu -->
          <div style="position: relative;">
            <button class="btn btn-secondary" onclick="toggleUserDropdown()" style="padding: 5px 10px;">
              <div style="width: 26px; height: 26px; background: #0a192f; color: #fff; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.75rem; font-weight: 700;">
                AD
              </div>
              <span class="font-semibold text-xs" style="margin-left: 6px;">Administrator</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-left: 4px;">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </button>
            <div id="user-dropdown-menu" class="hidden" style="position: absolute; right: 0; top: 42px; width: 200px; background: var(--bg-surface); border: 1px solid var(--border-color); border-radius: var(--radius-sm); box-shadow: var(--shadow-lg); padding: 6px 0; z-index: 60;">
              <div style="padding: 8px 14px; border-bottom: 1px solid var(--border-color); font-size: 0.75rem;">
                <div class="font-bold">Dr. Rajeshwar Sharma</div>
                <div class="text-muted">admin@polarsync.gov</div>
              </div>
              <a href="#/settings" style="display: block; padding: 8px 14px; font-size: 0.8rem; color: var(--text-main); text-decoration: none;" onclick="closeUserDropdown()">System Settings</a>
              <button onclick="toggleDarkMode(); closeUserDropdown();" style="width: 100%; text-align: left; background: none; border: none; padding: 8px 14px; font-size: 0.8rem; color: var(--text-main); cursor: pointer;">Toggle Dark Mode</button>
              <div style="border-top: 1px solid var(--border-color); margin: 4px 0;"></div>
              <button onclick="handleLogout()" style="width: 100%; text-align: left; background: none; border: none; padding: 8px 14px; font-size: 0.8rem; color: var(--status-red); cursor: pointer; font-weight: 600;">Sign Out</button>
            </div>
          </div>
        </div>
      </header>

      <!-- OFFLINE BANNER -->
      <div id="offline-banner" class="hidden">
        <div class="flex items-center gap-2">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="1" y1="1" x2="23" y2="23"></line>
            <path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55"></path>
            <path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39"></path>
            <path d="M10.71 5.05A16 16 0 0 1 22.58 9"></path>
            <path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88"></path>
            <path d="M8.53 16.11a6 6 0 0 1 6.95 0"></path>
            <line x1="12" y1="20" x2="12.01" y2="20"></line>
          </svg>
          <span><strong>Satellite Link Offline:</strong> Working in local cached mode. Operational mutations are stored securely and will automatically synchronize when connection resumes.</span>
        </div>
        <button class="btn btn-secondary btn-sm" onclick="toggleOfflineMode()">Restore Uplink</button>
      </div>

      <!-- DYNAMIC PAGE CONTAINER -->
      <main id="page-container">
        <!-- Rendered dynamically by JavaScript Router -->
      </main>
    </div>
  </div>

  <!-- GENERIC MODAL CONTAINER -->
  <div id="modal-container" class="hidden"></div>

  <!-- SLIDE-OVER DRAWER (AI ASSISTANT & GLOBAL SEARCH) -->
  <div id="drawer-container" class="hidden"></div>

  <!-- TOAST NOTIFICATIONS CONTAINER -->
  <div id="toast-container"></div>
`;
}

module.exports = { getAppHtml };
