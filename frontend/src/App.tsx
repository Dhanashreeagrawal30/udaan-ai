import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { ToastContainer } from './components/ToastContainer';
import { AddStudentModal } from './components/AddStudentModal';
import { CsvImportModal } from './components/CsvImportModal';

// Pages
import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';
import { StudentsPage } from './pages/StudentsPage';
import { StudentProfilePage } from './pages/StudentProfilePage';
import { RiskAnalysisPage } from './pages/RiskAnalysisPage';
import { InterventionLabPage } from './pages/InterventionLabPage';
import { FollowUpsPage } from './pages/FollowUpsPage';
import { ReportsPage } from './pages/ReportsPage';
import { SettingsPage } from './pages/SettingsPage';

const AppContent: React.FC = () => {
  const { currentRoute } = useApp();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isCsvModalOpen, setIsCsvModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Landing page renders without app shell
  if (currentRoute === '/') {
    return (
      <>
        <LandingPage />
        <ToastContainer />
      </>
    );
  }

  // Render route content
  const renderPageContent = () => {
    if (currentRoute === '/dashboard') {
      return (
        <DashboardPage 
          onOpenAddModal={() => setIsAddModalOpen(true)}
          onOpenCsvModal={() => setIsCsvModalOpen(true)}
        />
      );
    }

    if (currentRoute === '/students') {
      return (
        <StudentsPage 
          onOpenAddModal={() => setIsAddModalOpen(true)}
          onOpenCsvModal={() => setIsCsvModalOpen(true)}
        />
      );
    }

    if (currentRoute.startsWith('/students/')) {
      const studentId = currentRoute.replace('/students/', '');
      return <StudentProfilePage studentId={studentId} />;
    }

    if (currentRoute === '/risk-analysis') {
      return <RiskAnalysisPage />;
    }

    if (currentRoute === '/intervention-lab') {
      return <InterventionLabPage />;
    }

    if (currentRoute === '/follow-ups') {
      return <FollowUpsPage />;
    }

    if (currentRoute === '/reports') {
      return <ReportsPage />;
    }

    if (currentRoute === '/settings') {
      return <SettingsPage />;
    }

    // Default fallback to dashboard
    return (
      <DashboardPage 
        onOpenAddModal={() => setIsAddModalOpen(true)}
        onOpenCsvModal={() => setIsCsvModalOpen(true)}
      />
    );
  };

  return (
    <div className="min-h-screen bg-[#F8F7F2] flex">
      {/* Persistent Left Sidebar */}
      <Sidebar 
        onOpenAddModal={() => setIsAddModalOpen(true)}
        onOpenCsvModal={() => setIsCsvModalOpen(true)}
        isMobileOpen={isMobileMenuOpen}
        setIsMobileOpen={setIsMobileMenuOpen}
      />

      {/* Main Layout Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64 transition-all duration-300">
        {/* Top Header */}
        <TopBar 
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
          onOpenAddModal={() => setIsAddModalOpen(true)}
        />

        {/* Content Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {renderPageContent()}
        </main>
      </div>

      {/* Modals & Toasts */}
      <AddStudentModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />

      <CsvImportModal
        isOpen={isCsvModalOpen}
        onClose={() => setIsCsvModalOpen(false)}
      />

      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
