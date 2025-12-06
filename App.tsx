
import React, { useState, useEffect } from 'react';
import LandingPage from './components/LandingPage';
import ChatInterface from './components/ChatInterface';
import DestinationsView from './components/Destinations/DestinationsView';
import SettingsView from './components/Settings/SettingsView';
import FlightsView from './components/Flights/FlightsView';
import PaymentView from './components/Payment/PaymentView';
import TripsView from './components/Trips/TripsView';
import AuthModal from './components/AuthModal';
import { supabase } from './lib/supabaseClient';

type View = 'landing' | 'chat' | 'destinations' | 'settings' | 'flights' | 'payment' | 'trips';

const App: React.FC = () => {
  // Initialize state from localStorage if available
  const [currentView, setCurrentView] = useState<View>(() => {
    const savedView = localStorage.getItem('wanderlust_current_view');
    return (savedView as View) || 'landing';
  });

  const [activeSessionId, setActiveSessionId] = useState<string | null>(() => {
    return localStorage.getItem('wanderlust_active_session_id');
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [session, setSession] = useState<any>(null);

  // Persist currentView changes
  useEffect(() => {
    localStorage.setItem('wanderlust_current_view', currentView);
  }, [currentView]);

  // Persist activeSessionId changes
  useEffect(() => {
    if (activeSessionId) {
      localStorage.setItem('wanderlust_active_session_id', activeSessionId);
    } else {
      localStorage.removeItem('wanderlust_active_session_id');
    }
  }, [activeSessionId]);

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // Listen for changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        setIsAuthModalOpen(false); // Close modal on success
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleStartNewChat = () => {
    setActiveSessionId(null);
    setCurrentView('chat');
  };

  const handleSelectSession = (sessionId: string) => {
    setActiveSessionId(sessionId);
    setCurrentView('chat');
  };

  const renderView = () => {
    switch (currentView) {
      case 'destinations':
        return <DestinationsView onGoHome={() => setCurrentView('chat')} />;
      case 'flights':
        return (
            <FlightsView 
              onGoHome={() => setCurrentView('landing')} 
              onGoDestinations={() => setCurrentView('destinations')}
              onGoFlights={() => setCurrentView('flights')}
              onGoSettings={() => setCurrentView('settings')}
              user={session?.user}
              onNewChat={handleStartNewChat}
              onSelectSession={handleSelectSession}
            />
        );
      case 'settings':
        return <SettingsView onGoHome={() => setCurrentView('chat')} user={session?.user} />;
      case 'trips':
        return <TripsView onGoHome={() => setCurrentView('chat')} user={session?.user} />;
      case 'payment':
        return (
          <PaymentView 
            onGoBack={() => setCurrentView('chat')} 
            onPaymentSuccess={() => setCurrentView('trips')}
            sessionId={activeSessionId || ''}
          />
        );
      case 'chat':
        return (
          <ChatInterface 
            onGoHome={() => setCurrentView('landing')} 
            onGoDestinations={() => setCurrentView('destinations')}
            onGoFlights={() => setCurrentView('flights')}
            onGoSettings={() => setCurrentView('settings')}
            onGoPayment={() => setCurrentView('payment')}
            onGoTrips={() => setCurrentView('trips')}
            user={session?.user} 
            sessionId={activeSessionId}
            onNewChat={handleStartNewChat}
            onSelectSession={handleSelectSession}
          />
        );
      case 'landing':
      default:
        return (
          <LandingPage 
            onStartChat={() => setCurrentView('chat')} 
            onOpenAuth={() => setIsAuthModalOpen(true)}
            user={session?.user}
          />
        );
    }
  };

  return (
    <div className="font-sans antialiased text-stone-800">
      {renderView()}

      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />
    </div>
  );
};

export default App;
