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

  useEffect(() => {
    // Initialize theme
    initTheme();

    // Check for user session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Handle routing
  const path = window.location.pathname;
  const isGitHubPages = path.startsWith('/ezmacros');
  const basePath = isGitHubPages ? '/ezmacros' : '';
  const relativePath = isGitHubPages ? path.replace('/ezmacros', '') : path;

  if (isLoading) {
    return (
      <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-dark-bg">
        <div class="text-gray-500 dark:text-gray-400">Loading...</div>
      </div>
    );
  }

  if (!user) {
    if (relativePath === '/signup') {
      return <Signup />;
    }
    return <Login />;
  }

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
