import { useState, useEffect } from 'react';
import { useInternetIdentity } from './hooks/useInternetIdentity';
import { useGetCallerUserProfile, useSaveCallerUserProfile, useActorReady } from './hooks/useQueries';
import { useQueryClient } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import EventDetailPage from './pages/EventDetailPage';
import DashboardPage from './pages/DashboardPage';
import AboutPage from './pages/AboutPage';
import ServicesPage from './pages/ServicesPage';
import ContactPage from './pages/ContactPage';
import ProfileSetupModal from './components/ProfileSetupModal';
import { Toaster } from './components/ui/sonner';
import { Loader2 } from 'lucide-react';

type Page = 'home' | 'event' | 'dashboard' | 'about' | 'services' | 'contact';

export default function App() {
  const { identity, isInitializing: identityInitializing, clear: clearIdentity } = useInternetIdentity();
  const isAuthenticated = !!identity;
  const { isReady: actorReady, isInitializing: actorInitializing } = useActorReady();
  const queryClient = useQueryClient();
  
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();
  const saveProfile = useSaveCallerUserProfile();
  
  const showProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null;

  // Only show loading for authenticated users during initial actor setup
  const showActorLoading = isAuthenticated && actorInitializing && !actorReady;

  // Handle URL-based routing on mount and popstate
  useEffect(() => {
    const handleRouteChange = () => {
      const path = window.location.pathname;
      
      if (path.startsWith('/event/')) {
        const eventId = path.split('/event/')[1];
        if (eventId) {
          setSelectedEventId(eventId);
          setCurrentPage('event');
        }
      } else if (path === '/dashboard') {
        setCurrentPage('dashboard');
      } else if (path === '/about') {
        setCurrentPage('about');
      } else if (path === '/services') {
        setCurrentPage('services');
      } else if (path === '/contact') {
        setCurrentPage('contact');
      } else {
        setCurrentPage('home');
        setSelectedEventId(null);
      }
    };

    // Handle initial load
    handleRouteChange();

    // Handle browser back/forward
    window.addEventListener('popstate', handleRouteChange);
    return () => window.removeEventListener('popstate', handleRouteChange);
  }, []);

  const handleProfileSave = async (name: string) => {
    await saveProfile.mutateAsync({ name });
  };

  const navigateToEvent = (eventId: string) => {
    setSelectedEventId(eventId);
    setCurrentPage('event');
    window.history.pushState({}, '', `/event/${eventId}`);
    window.scrollTo(0, 0);
  };

  const navigateToHome = () => {
    setCurrentPage('home');
    setSelectedEventId(null);
    window.history.pushState({}, '', '/');
    window.scrollTo(0, 0);
  };

  const navigateToDashboard = () => {
    setCurrentPage('dashboard');
    window.history.pushState({}, '', '/dashboard');
    window.scrollTo(0, 0);
  };

  const navigateToAbout = () => {
    setCurrentPage('about');
    window.history.pushState({}, '', '/about');
    window.scrollTo(0, 0);
  };

  const navigateToServices = () => {
    setCurrentPage('services');
    window.history.pushState({}, '', '/services');
    window.scrollTo(0, 0);
  };

  const navigateToContact = () => {
    setCurrentPage('contact');
    window.history.pushState({}, '', '/contact');
    window.scrollTo(0, 0);
  };

  const handleLogout = async () => {
    await clearIdentity();
    queryClient.clear();
    navigateToHome();
  };

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <div className="min-h-screen flex flex-col bg-background">
        <Header 
          currentPage={currentPage}
          onNavigateHome={navigateToHome}
          onNavigateDashboard={navigateToDashboard}
          onNavigateAbout={navigateToAbout}
          onNavigateServices={navigateToServices}
          onNavigateContact={navigateToContact}
          onLogout={handleLogout}
        />
        
        <main className="flex-1">
          {showActorLoading ? (
            <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-[60vh]">
              <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
              <h2 className="text-xl font-semibold mb-2">Connecting to backend…</h2>
              <p className="text-muted-foreground text-center max-w-md">
                Establishing secure connection to the Internet Computer network.
              </p>
            </div>
          ) : (
            <>
              {currentPage === 'home' && (
                <HomePage onNavigateToEvent={navigateToEvent} />
              )}
              {currentPage === 'event' && selectedEventId && (
                <EventDetailPage 
                  eventId={selectedEventId} 
                  onNavigateBack={navigateToHome}
                />
              )}
              {currentPage === 'dashboard' && (
                <DashboardPage onNavigateToEvent={navigateToEvent} />
              )}
              {currentPage === 'about' && (
                <AboutPage />
              )}
              {currentPage === 'services' && (
                <ServicesPage />
              )}
              {currentPage === 'contact' && (
                <ContactPage />
              )}
            </>
          )}
        </main>

        <Footer 
          onNavigateAbout={navigateToAbout}
          onNavigateServices={navigateToServices}
          onNavigateContact={navigateToContact}
        />
        
        {showProfileSetup && (
          <ProfileSetupModal 
            onSave={handleProfileSave}
            isSaving={saveProfile.isPending}
          />
        )}
        
        <Toaster />
      </div>
    </ThemeProvider>
  );
}
