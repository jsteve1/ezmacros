type Theme = 'dark' | 'light' | 'system';

// Get system theme preference
const getSystemTheme = (): 'dark' | 'light' => {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

// Get current theme
export const getTheme = (): Theme => {
  if (typeof window === 'undefined') return 'system';
  return (localStorage.getItem('theme') as Theme) || 'system';
};

// Set theme
export const setTheme = (theme: Theme) => {
  const root = window.document.documentElement;
  root.classList.remove('dark');

  if (theme === 'system') {
    localStorage.removeItem('theme');
    if (getSystemTheme() === 'dark') {
      root.classList.add('dark');
    }
  } else {
    localStorage.setItem('theme', theme);
    if (theme === 'dark') {
      root.classList.add('dark');
    }
  }
};

// Initialize theme
export const initTheme = () => {
  if (typeof window === 'undefined') return;
  
  const theme = getTheme();
  setTheme(theme);

  // Listen for system theme changes
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  mediaQuery.addEventListener('change', () => {
    if (getTheme() === 'system') {
      setTheme('system');
    }
  });
}; 