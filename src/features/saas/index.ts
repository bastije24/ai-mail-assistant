// Types
export * from './types';

// Context
export { AppProvider, useApp } from './context/AppContext';

// Mock Data
export * from './data/mockData';

// Layout Components
export { AppLayout } from './components/layout/AppLayout';
export { AdminLayout } from './components/layout/AdminLayout';

// UI Components
export { PriorityBadge } from './components/ui/PriorityBadge';
export { StatusBadge } from './components/ui/StatusBadge';
export { EmptyState } from './components/ui/EmptyState';
export { TableSkeleton, CardSkeleton, ListSkeleton } from './components/ui/LoadingSkeleton';

// Auth Pages
export { LoginPage } from './pages/LoginPage';
export { JoinPage } from './pages/JoinPage';

// Main Pages
export { MyInboxPage } from './pages/MyInboxPage';
export { TeamInboxPage } from './pages/TeamInboxPage';
export { DelegatedPage } from './pages/DelegatedPage';
export { SettingsPage } from './pages/SettingsPage';

// Admin Pages
export { AdminOverviewPage } from './pages/admin/AdminOverviewPage';
export { SeatsPage } from './pages/admin/SeatsPage';
export { PeoplePage } from './pages/admin/PeoplePage';
export { DepartmentsPage } from './pages/admin/DepartmentsPage';
export { RoutingPage } from './pages/admin/RoutingPage';
export { PoliciesPage } from './pages/admin/PoliciesPage';
