import { useCallback, useEffect, useState } from 'react';

type Theme = 'dark' | 'light';

const THEME_STORAGE_KEY = 'theme';

function getInitialTheme(): Theme {
  const stored = localStorage.getItem(THEME_STORAGE_KEY);
  return stored === 'light' || stored === 'dark' ? stored : 'dark';
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  }, []);

  return { theme, toggleTheme };
}
