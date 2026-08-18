import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { Footer } from './components/Footer';
import { LoginModal } from './components/LoginModal';

import { DashboardPage } from './pages/DashboardPage';
import { SpaceMapPage } from './pages/SpaceMapPage';
import { VacantSpacesPage } from './pages/VacantSpacesPage';
import { RevenuePage } from './pages/RevenuePage';
import { ApplicationsPage } from './pages/ApplicationsPage';
import { LeasesPage } from './pages/LeasesPage';
import { OperationsPage } from './pages/OperationsPage';
import { FootfallPage } from './pages/FootfallPage';
import { SimulatorPage } from './pages/SimulatorPage';
import { ReportsPage } from './pages/ReportsPage';
import { BusinessValuePage } from './pages/BusinessValuePage';
import { AuditLogsPage } from './pages/AuditLogsPage';

const MainLayout: React.FC = () => {
  const { isLoggedIn, activeTab } = useApp();

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans antialiased selection:bg-blue-500 selection:text-white">
      {/* Top Navbar */}
      <Navbar />

      {/* Main Body */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col lg:flex-row gap-6">
        <Sidebar />

        <main className="flex-1 min-w-0">
          {activeTab === 'dashboard' && <DashboardPage />}
          {activeTab === 'spacemap' && <SpaceMapPage />}
          {activeTab === 'vacant' && <VacantSpacesPage />}
          {activeTab === 'revenue' && <RevenuePage />}
          {activeTab === 'applications' && <ApplicationsPage />}
          {activeTab === 'leases' && <LeasesPage />}
          {activeTab === 'operations' && <OperationsPage />}
          {activeTab === 'footfall' && <FootfallPage />}
          {activeTab === 'simulator' && <SimulatorPage />}
          {activeTab === 'reports' && <ReportsPage />}
          {activeTab === 'business' && <BusinessValuePage />}
          {activeTab === 'audit' && <AuditLogsPage />}
        </main>
      </div>

      {/* Footer */}
      <Footer />

      {/* Login Modal overlay if logged out */}
      {!isLoggedIn && <LoginModal />}
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}

