import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import {
  AppProvider,
  AppLayout,
  AdminLayout,
  LoginPage,
  JoinPage,
  MyInboxPage,
  TeamInboxPage,
  DelegatedPage,
  SettingsPage,
  AdminOverviewPage,
  SeatsPage,
  PeoplePage,
  DepartmentsPage,
  RoutingPage,
  PoliciesPage,
} from "@/features/saas";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="light" storageKey="ainbox-theme">
      <AppProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <Routes>
            {/* Auth Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/join" element={<JoinPage />} />
            
            {/* App Routes */}
            <Route path="/app" element={<AppLayout />}>
              <Route index element={<Navigate to="/app/inbox" replace />} />
              <Route path="inbox" element={<MyInboxPage />} />
              <Route path="team" element={<TeamInboxPage />} />
              <Route path="delegated" element={<DelegatedPage />} />
              <Route path="settings" element={<SettingsPage />} />
              
              {/* Admin Routes */}
              <Route path="admin" element={<AdminLayout />}>
                <Route index element={<Navigate to="/app/admin/overview" replace />} />
                <Route path="overview" element={<AdminOverviewPage />} />
                <Route path="seats" element={<SeatsPage />} />
                <Route path="people" element={<PeoplePage />} />
                <Route path="departments" element={<DepartmentsPage />} />
                <Route path="routing" element={<RoutingPage />} />
                <Route path="policies" element={<PoliciesPage />} />
              </Route>
            </Route>
            
            {/* Redirect root to login */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            
            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </TooltipProvider>
      </AppProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
