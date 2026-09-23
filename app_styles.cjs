/**
 * POLARSYNC Enterprise Command Platform CSS
 */

function getStyles() {
  return `
/* === BASE & RESET === */
*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

:root {
  --primary-navy: #0a192f;
  --primary-navy-dark: #071224;
  --primary-navy-light: #172a46;
  --ice-blue: #0284c7;
  --ice-blue-light: #e0f2fe;
  --ice-blue-subtle: #f0f9ff;
  --accent-cyan: #06b6d4;
  
  --bg-page: #f8fafc;
  --bg-surface: #ffffff;
  --bg-subtle: #f1f5f9;
  --bg-input: #ffffff;
  --border-color: #e2e8f0;
  --border-strong: #cbd5e1;
  
  --text-main: #0f172a;
  --text-muted: #64748b;
  --text-dim: #94a3b8;
  
  --status-green: #10b981;
  --status-green-bg: #ecfdf5;
  --status-blue: #3b82f6;
  --status-blue-bg: #eff6ff;
  --status-amber: #f59e0b;
  --status-amber-bg: #fffbeb;
  --status-red: #ef4444;
  --status-red-bg: #fef2f2;
  --status-gray: #64748b;
  --status-gray-bg: #f1f5f9;
  
  --radius-sm: 6px;
  --radius-md: 10px;
  --radius-lg: 14px;
  --radius-pill: 9999px;
  
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.07), 0 2px 4px -2px rgba(0, 0, 0, 0.07);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -4px rgba(0, 0, 0, 0.04);
  
  --sidebar-width: 260px;
  --sidebar-collapsed-width: 72px;
  --header-height: 64px;
}

body.theme-dark {
  --bg-page: #0b1329;
  --bg-surface: #111d38;
  --bg-subtle: #17264a;
  --bg-input: #1a2c54;
  --border-color: #1e335f;
  --border-strong: #2a4680;
  
  --text-main: #f1f5f9;
  --text-muted: #94a3b8;
  --text-dim: #64748b;
  
  --status-green-bg: rgba(16, 185, 129, 0.15);
  --status-blue-bg: rgba(59, 130, 246, 0.15);
  --status-amber-bg: rgba(245, 158, 11, 0.15);
  --status-red-bg: rgba(239, 68, 68, 0.15);
  --status-gray-bg: rgba(100, 116, 139, 0.15);
}

body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Helvetica Neue", sans-serif;
  background-color: var(--bg-page);
  color: var(--text-main);
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
  min-height: 100vh;
  overflow-x: hidden;
}

/* === UTILITY HELPERS === */
.hidden { display: none !important; }
.flex { display: flex; }
.flex-col { flex-direction: column; }
.items-center { align-items: center; }
.justify-between { justify-content: space-between; }
.justify-center { justify-content: center; }
.justify-end { justify-content: flex-end; }
.gap-1 { gap: 4px; }
.gap-2 { gap: 8px; }
.gap-3 { gap: 12px; }
.gap-4 { gap: 16px; }
.gap-6 { gap: 24px; }
.flex-1 { flex: 1; }
.flex-wrap { flex-wrap: wrap; }
.text-center { text-align: center; }
.text-right { text-align: right; }
.font-semibold { font-weight: 600; }
.font-bold { font-weight: 700; }
.text-sm { font-size: 0.875rem; }
.text-xs { font-size: 0.75rem; }
.text-lg { font-size: 1.125rem; }
.text-xl { font-size: 1.25rem; }
.text-2xl { font-size: 1.5rem; }
.text-muted { color: var(--text-muted); }
.w-full { width: 100%; }

/* === BUTTONS & CONTROLS === */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 8px 16px;
  font-size: 0.875rem;
  font-weight: 500;
  border-radius: var(--radius-sm);
  border: 1px solid transparent;
  cursor: pointer;
  transition: all 0.15s ease-in-out;
  white-space: nowrap;
  user-select: none;
}
.btn:hover { opacity: 0.95; transform: translateY(-1px); }
.btn:active { transform: translateY(0); }
.btn-primary {
  background-color: var(--primary-navy);
  color: #ffffff;
  border-color: var(--primary-navy);
}
.theme-dark .btn-primary {
  background-color: var(--ice-blue);
  border-color: var(--ice-blue);
}
.btn-secondary {
  background-color: var(--bg-surface);
  color: var(--text-main);
  border-color: var(--border-color);
}
.btn-secondary:hover {
  background-color: var(--bg-subtle);
}
.btn-accent {
  background-color: var(--ice-blue);
  color: #ffffff;
}
.btn-danger {
  background-color: var(--status-red);
  color: #ffffff;
}
.btn-danger-outline {
  background-color: transparent;
  color: var(--status-red);
  border-color: var(--status-red);
}
.btn-danger-outline:hover {
  background-color: var(--status-red-bg);
}
.btn-success {
  background-color: var(--status-green);
  color: #ffffff;
}
.btn-sm {
  padding: 5px 10px;
  font-size: 0.8rem;
  border-radius: 4px;
}
.btn-icon {
  width: 36px;
  height: 36px;
  padding: 0;
  border-radius: var(--radius-sm);
}

.input-control, .select-control {
  width: 100%;
  padding: 8px 12px;
  font-size: 0.875rem;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  background-color: var(--bg-input);
  color: var(--text-main);
  outline: none;
  transition: border-color 0.15s ease;
}
.input-control:focus, .select-control:focus {
  border-color: var(--ice-blue);
  box-shadow: 0 0 0 2px var(--ice-blue-light);
}

/* === BADGES === */
.badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 3px 8px;
  font-size: 0.72rem;
  font-weight: 600;
  border-radius: var(--radius-pill);
  text-transform: uppercase;
  letter-spacing: 0.03em;
  white-space: nowrap;
}
.badge-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  display: inline-block;
}
.badge-success { background-color: var(--status-green-bg); color: var(--status-green); }
.badge-success .badge-dot { background-color: var(--status-green); }

.badge-info { background-color: var(--status-blue-bg); color: var(--status-blue); }
.badge-info .badge-dot { background-color: var(--status-blue); }

.badge-warning { background-color: var(--status-amber-bg); color: var(--status-amber); }
.badge-warning .badge-dot { background-color: var(--status-amber); }

.badge-danger { background-color: var(--status-red-bg); color: var(--status-red); }
.badge-danger .badge-dot { background-color: var(--status-red); animation: pulse 1.5s infinite; }

.badge-neutral { background-color: var(--status-gray-bg); color: var(--status-gray); }
.badge-neutral .badge-dot { background-color: var(--status-gray); }

@keyframes pulse {
  0% { transform: scale(0.95); opacity: 0.7; }
  50% { transform: scale(1.3); opacity: 1; }
  100% { transform: scale(0.95); opacity: 0.7; }
}

/* === LOGIN PAGE === */
#view-login {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #071224 0%, #0a192f 50%, #0f2b48 100%);
  padding: 20px;
  position: relative;
  overflow: hidden;
}
#view-login::before {
  content: "";
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle at 70% 30%, rgba(6, 182, 212, 0.12) 0%, transparent 60%),
              radial-gradient(circle at 20% 80%, rgba(2, 132, 199, 0.15) 0%, transparent 50%);
  pointer-events: none;
}
.login-card {
  width: 100%;
  max-width: 480px;
  background: rgba(255, 255, 255, 0.98);
  border-radius: var(--radius-lg);
  padding: 36px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.4);
  position: relative;
  z-index: 2;
  border: 1px solid rgba(255, 255, 255, 0.3);
}
.login-brand {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
}
.brand-icon-box {
  width: 44px;
  height: 44px;
  background: linear-gradient(135deg, #0a192f, #0284c7);
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
}
.login-title {
  font-size: 1.6rem;
  font-weight: 800;
  color: var(--primary-navy);
  letter-spacing: -0.02em;
}
.login-subtitle {
  font-size: 0.85rem;
  color: #64748b;
  margin-bottom: 24px;
  line-height: 1.4;
}
.tagline-strip {
  font-size: 0.75rem;
  font-weight: 600;
  color: #0284c7;
  background: #f0f9ff;
  border: 1px solid #bae6fd;
  border-radius: var(--radius-sm);
  padding: 8px 12px;
  margin-bottom: 24px;
  text-align: center;
}
.feature-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 24px;
}
.feature-chip {
  font-size: 0.68rem;
  font-weight: 700;
  background: #f1f5f9;
  color: #334155;
  padding: 4px 8px;
  border-radius: 4px;
  letter-spacing: 0.04em;
}
.demo-account-box {
  background: #f8fafc;
  border: 1px dashed #cbd5e1;
  border-radius: var(--radius-sm);
  padding: 12px;
  margin-top: 16px;
  font-size: 0.8rem;
}
.demo-account-box code {
  background: #e2e8f0;
  padding: 2px 6px;
  border-radius: 3px;
  font-family: monospace;
}

/* === APP LAYOUT === */
#app-shell {
  display: flex;
  min-height: 100vh;
}

/* Sidebar */
#sidebar {
  width: var(--sidebar-width);
  background: var(--primary-navy);
  color: #e2e8f0;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  transition: width 0.2s ease;
  z-index: 50;
  position: relative;
}
#sidebar.collapsed {
  width: var(--sidebar-collapsed-width);
}
.sidebar-header {
  height: var(--header-height);
  padding: 0 18px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}
.sidebar-brand {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #ffffff;
  font-weight: 800;
  font-size: 1.15rem;
  letter-spacing: 0.02em;
  text-decoration: none;
  overflow: hidden;
}
.sidebar-nav {
  flex: 1;
  padding: 16px 10px;
  overflow-y: auto;
}
.nav-section-title {
  font-size: 0.65rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #64748b;
  font-weight: 700;
  padding: 12px 10px 4px 10px;
}
#sidebar.collapsed .nav-section-title {
  display: none;
}
.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 9px 12px;
  border-radius: var(--radius-sm);
  color: #94a3b8;
  text-decoration: none;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.15s ease;
  margin-bottom: 2px;
  position: relative;
}
.nav-item:hover {
  background: rgba(255, 255, 255, 0.07);
  color: #ffffff;
}
.nav-item.active {
  background: var(--ice-blue);
  color: #ffffff;
  font-weight: 600;
}
.nav-icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}
.nav-badge {
  margin-left: auto;
  font-size: 0.7rem;
  background: rgba(255, 255, 255, 0.2);
  color: #fff;
  padding: 2px 6px;
  border-radius: 10px;
}
.nav-badge.danger {
  background: var(--status-red);
}
#sidebar.collapsed .nav-label,
#sidebar.collapsed .nav-badge {
  display: none;
}

/* Sidebar Footer */
.sidebar-footer {
  padding: 14px 18px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  gap: 10px;
}
.system-status-indicator {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.75rem;
  color: #94a3b8;
}

/* Main Content Area */
#main-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  overflow-y: auto;
}

/* Top Header Bar */
#top-header {
  height: var(--header-height);
  background: var(--bg-surface);
  border-bottom: 1px solid var(--border-color);
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: sticky;
  top: 0;
  z-index: 40;
}
.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}
.breadcrumb {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.85rem;
  color: var(--text-muted);
}
.breadcrumb-current {
  color: var(--text-main);
  font-weight: 600;
}
.header-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

/* Global Search Trigger */
.search-trigger-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 7px 14px;
  background: var(--bg-subtle);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  color: var(--text-muted);
  font-size: 0.85rem;
  cursor: pointer;
  width: 220px;
}
.search-trigger-btn:hover {
  border-color: var(--border-strong);
  background: var(--bg-surface);
}
.kbd-shortcut {
  font-size: 0.7rem;
  background: var(--bg-surface);
  border: 1px solid var(--border-color);
  padding: 2px 5px;
  border-radius: 3px;
  margin-left: auto;
}

/* Connectivity Mode Toggle */
.network-badge {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 5px 10px;
  border-radius: var(--radius-pill);
  cursor: pointer;
  user-select: none;
  border: 1px solid transparent;
}
.network-badge.online {
  background: #ecfdf5;
  color: #059669;
  border-color: #a7f3d0;
}
.network-badge.offline {
  background: #fffbeb;
  color: #b45309;
  border-color: #fde68a;
}

/* Offline Banner */
#offline-banner {
  background: #fff7ed;
  border-bottom: 1px solid #fdba74;
  color: #9a3412;
  padding: 8px 24px;
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

/* Page Container */
#page-container {
  padding: 24px;
  flex: 1;
}

/* === CARD & SECTION STYLING === */
.card {
  background: var(--bg-surface);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
  overflow: hidden;
  margin-bottom: 24px;
}
.card-header {
  padding: 16px 20px;
  border-bottom: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.card-title {
  font-size: 1.05rem;
  font-weight: 700;
  color: var(--text-main);
  display: flex;
  align-items: center;
  gap: 8px;
}
.card-body {
  padding: 20px;
}
.card-footer {
  padding: 12px 20px;
  background: var(--bg-subtle);
  border-top: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

/* === KPI STAT CARDS === */
.kpi-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
}
.kpi-card {
  background: var(--bg-surface);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  padding: 18px;
  box-shadow: var(--shadow-sm);
  display: flex;
  align-items: center;
  gap: 14px;
  cursor: pointer;
  transition: transform 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease;
}
.kpi-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
  border-color: var(--ice-blue);
}
.kpi-icon-box {
  width: 46px;
  height: 46px;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.kpi-label {
  font-size: 0.78rem;
  color: var(--text-muted);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}
.kpi-value {
  font-size: 1.6rem;
  font-weight: 800;
  color: var(--text-main);
  line-height: 1.2;
}
.kpi-sub {
  font-size: 0.75rem;
  color: var(--text-muted);
  margin-top: 2px;
}

/* === DATA TABLES === */
.table-wrapper {
  width: 100%;
  overflow-x: auto;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
}
.data-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  font-size: 0.85rem;
}
.data-table th {
  background: var(--bg-subtle);
  color: var(--text-muted);
  font-weight: 600;
  padding: 11px 16px;
  border-bottom: 1px solid var(--border-color);
  white-space: nowrap;
  user-select: none;
}
.data-table td {
  padding: 12px 16px;
  border-bottom: 1px solid var(--border-color);
  color: var(--text-main);
}
.data-table tbody tr:last-child td {
  border-bottom: none;
}
.data-table tbody tr:hover {
  background-color: var(--bg-subtle);
}
.table-actions {
  display: flex;
  align-items: center;
  gap: 6px;
}

/* === FILTER BAR === */
.filter-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}
.filter-group {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

/* === PROGRESS BARS === */
.progress-bar-bg {
  width: 100%;
  height: 8px;
  background: var(--bg-subtle);
  border-radius: var(--radius-pill);
  overflow: hidden;
}
.progress-bar-fill {
  height: 100%;
  border-radius: var(--radius-pill);
  background: var(--ice-blue);
  transition: width 0.3s ease;
}
.progress-bar-fill.success { background: var(--status-green); }
.progress-bar-fill.warning { background: var(--status-amber); }
.progress-bar-fill.danger { background: var(--status-red); }

/* === KANBAN BOARD === */
.kanban-board {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}
.kanban-col {
  background: var(--bg-subtle);
  border-radius: var(--radius-md);
  padding: 14px;
  min-height: 480px;
  display: flex;
  flex-direction: column;
}
.kanban-header {
  font-size: 0.85rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 2px solid var(--border-color);
}
.kanban-cards-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
  overflow-y: auto;
}
.kanban-card {
  background: var(--bg-surface);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  padding: 12px;
  box-shadow: var(--shadow-sm);
  cursor: pointer;
  transition: transform 0.1s ease, box-shadow 0.1s ease;
}
.kanban-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

/* === TIMELINE COMPONENT === */
.timeline {
  position: relative;
  padding-left: 24px;
}
.timeline::before {
  content: "";
  position: absolute;
  left: 7px;
  top: 6px;
  bottom: 6px;
  width: 2px;
  background: var(--border-color);
}
.timeline-item {
  position: relative;
  margin-bottom: 16px;
}
.timeline-item:last-child {
  margin-bottom: 0;
}
.timeline-dot {
  position: absolute;
  left: -24px;
  top: 4px;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: var(--bg-surface);
  border: 2px solid var(--ice-blue);
}
.timeline-dot.critical { border-color: var(--status-red); background: var(--status-red); }
.timeline-dot.success { border-color: var(--status-green); background: var(--status-green); }
.timeline-title {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--text-main);
}
.timeline-time {
  font-size: 0.72rem;
  color: var(--text-muted);
}
.timeline-desc {
  font-size: 0.8rem;
  color: var(--text-muted);
  margin-top: 3px;
}

/* === MODAL DIALOGS === */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(10, 25, 47, 0.7);
  backdrop-filter: blur(2px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  padding: 20px;
}
.modal-dialog {
  background: var(--bg-surface);
  border-radius: var(--radius-lg);
  max-width: 680px;
  width: 100%;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  box-shadow: var(--shadow-lg);
  border: 1px solid var(--border-color);
  animation: modalIn 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}
.modal-dialog.lg {
  max-width: 880px;
}
.modal-header {
  padding: 18px 24px;
  border-bottom: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.modal-body {
  padding: 24px;
  overflow-y: auto;
  flex: 1;
}
.modal-footer {
  padding: 16px 24px;
  border-top: 1px solid var(--border-color);
  background: var(--bg-subtle);
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
}
@keyframes modalIn {
  from { opacity: 0; transform: scale(0.96) translateY(10px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
}

/* === SLIDE-OVER DRAWER (AI Assistant / Global Search) === */
.drawer-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 110;
  display: flex;
  justify-content: flex-end;
}
.drawer-panel {
  width: 100%;
  max-width: 440px;
  background: var(--bg-surface);
  height: 100%;
  display: flex;
  flex-direction: column;
  box-shadow: -4px 0 25px rgba(0, 0, 0, 0.2);
  animation: drawerSlide 0.25s ease;
}
@keyframes drawerSlide {
  from { transform: translateX(100%); }
  to { transform: translateX(0); }
}

/* === TOAST NOTIFICATIONS === */
#toast-container {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 200;
  display: flex;
  flex-direction: column;
  gap: 10px;
  pointer-events: none;
}
.toast {
  pointer-events: auto;
  min-width: 300px;
  max-width: 420px;
  background: var(--bg-surface);
  border: 1px solid var(--border-color);
  border-left: 4px solid var(--ice-blue);
  border-radius: var(--radius-sm);
  padding: 12px 16px;
  box-shadow: var(--shadow-lg);
  display: flex;
  align-items: flex-start;
  gap: 10px;
  font-size: 0.85rem;
  animation: toastIn 0.2s ease;
}
.toast.success { border-left-color: var(--status-green); }
.toast.danger { border-left-color: var(--status-red); }
.toast.warning { border-left-color: var(--status-amber); }
@keyframes toastIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

/* === LEAFLET MAP WRAPPER === */
#map-container {
  height: 380px;
  border-radius: var(--radius-sm);
  overflow: hidden;
  position: relative;
  z-index: 10;
}

/* === RESPONSIVE BREAKPOINTS === */
@media (max-width: 1024px) {
  .kanban-board {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  #sidebar {
    position: fixed;
    height: 100vh;
    left: -260px;
    top: 0;
    transition: left 0.25s ease;
  }
  #sidebar.mobile-open {
    left: 0;
  }
  .search-trigger-btn {
    width: 140px;
  }
  .kanban-board {
    grid-template-columns: 1fr;
  }
  .kpi-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .kpi-grid {
    grid-template-columns: 1fr;
  }
  #top-header {
    padding: 0 12px;
  }
  #page-container {
    padding: 12px;
  }
}
`;
}

module.exports = { getStyles };
