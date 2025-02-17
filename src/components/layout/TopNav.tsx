import { useEffect, useState } from 'preact/hooks';
import { supabase } from '../../lib/supabase';
import { getTheme, setTheme } from '../../lib/theme';
import type { User } from '@supabase/supabase-js';

const ThemeIcon = ({ theme }: { theme: string }) => {
  if (theme === 'dark') {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
        <path stroke-linecap="round" stroke-linejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
      </svg>
    );
  }
  if (theme === 'light') {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
      </svg>
    );
  }
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
      <path stroke-linecap="round" stroke-linejoin="round" d="M9 17.25v1.007a3 3 0 0 1-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0 1 15 18.257V17.25m6-12V15a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 15V5.25m18 0A2.25 2.25 0 0 0 18.75 3H5.25A2.25 2.25 0 0 0 3 5.25m18 0V12a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 12V5.25" />
    </svg>
  );
};

export default function TopNav() {
  const [user, setUser] = useState<User | null>(null);
  const [theme, setCurrentTheme] = useState(getTheme());

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleThemeChange = () => {
    const themes: ('light' | 'dark' | 'system')[] = ['light', 'dark', 'system'];
    const currentIndex = themes.indexOf(theme as any);
    const nextTheme = themes[(currentIndex + 1) % themes.length];
    setTheme(nextTheme);
    setCurrentTheme(nextTheme);
  };

  return (
    <nav class="fixed top-0 left-0 right-0 h-16 px-4 flex items-center justify-between bg-white dark:bg-dark-bg border-b border-gray-200 dark:border-dark-accent">
      <div class="flex items-center gap-3">
        <span class="text-2xl" role="img" aria-label="hamburger">🍔</span>
        <div class="text-xl font-bold text-gray-900 dark:text-white">EZ Macros</div>
      </div>
      
      <div class="flex items-center gap-4">
        <button
          onClick={handleThemeChange}
          class="p-2 text-gray-700 dark:text-gray-200 bg-white dark:bg-transparent rounded-lg hover:bg-gray-100 dark:hover:bg-dark-hover"
          aria-label="Toggle theme"
        >
          <ThemeIcon theme={theme} />
        </button>

        {user ? (
          <button
            onClick={() => supabase.auth.signOut()}
            class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-transparent hover:bg-gray-100 dark:hover:bg-dark-hover rounded-lg"
          >
            Sign Out
          </button>
        ) : (
          <button
            onClick={() => window.location.hash = '/login'}
            class="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg"
          >
            Sign In
          </button>
        )}
      </div>
    </nav>
  );
} 