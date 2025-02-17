import { useEffect, useState } from 'preact/hooks';
import { supabase } from './lib/supabase';
import { initTheme } from './lib/theme';
import Layout from './components/layout/Layout';
import Login from './pages/Login';
import Signup from './pages/Signup';
import MacroSummary from './components/MacroSummary';
import { DateRangeProvider } from './context/DateRangeContext';
import { MacroTotalsProvider } from './context/MacroTotalsContext';
import type { User } from '@supabase/supabase-js';

export function App() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentHash, setCurrentHash] = useState(window.location.hash.slice(1) || '/');

  // Handle hash changes
  useEffect(() => {
    const handleHashChange = () => {
      setCurrentHash(window.location.hash.slice(1) || '/');
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Handle auth state changes
  useEffect(() => {
    // Initialize theme
    initTheme();

    // Check for user session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        // Force navigation to login page on sign out
        window.location.hash = '/login';
      } else if (event === 'SIGNED_IN') {
        // Clear hash when signing in
        window.location.hash = '/';
      }
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Handle initial route on load
  useEffect(() => {
    if (!isLoading) {
      if (!user && currentHash !== '/signup') {
        // If not authenticated and not trying to sign up, go to login
        window.location.hash = '/login';
      } else if (user && (currentHash === '/login' || currentHash === '/signup')) {
        // If authenticated but on auth pages, go to home
        window.location.hash = '/';
      }
    }
  }, [user, isLoading]);

  if (isLoading) {
    return (
      <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-dark-bg">
        <div class="text-gray-500 dark:text-gray-400">Loading...</div>
      </div>
    );
  }

  // Route based on current hash and auth state
  if (!user) {
    if (currentHash === '/signup') {
      return <Signup />;
    }
    return <Login />;
  }

  // If user is authenticated, show main app
  return (
    <DateRangeProvider>
      <MacroTotalsProvider>
        <Layout>
          <div class="container mx-auto px-4 py-8">
            <MacroSummary />
          </div>
        </Layout>
      </MacroTotalsProvider>
    </DateRangeProvider>
  );
}
