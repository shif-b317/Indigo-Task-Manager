import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme || 'theme-midnight';
  });

  useEffect(() => {
    const root = window.document.body;
    root.classList.remove('theme-midnight', 'theme-vanilla');
    root.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'theme-midnight' ? 'theme-vanilla' : 'theme-midnight'));
  };

  const isMidnight = theme === 'theme-midnight';

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme, isMidnight }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
