import {
  createContext, useState, useContext, useCallback, useEffect,
} from 'react';
import PropTypes from 'prop-types';

import booleanStorage from '../services/booleanStorage';
import { isClientSide, isDarkModeEnabled } from '../utils';

export const ThemeContext = createContext();
const localStorageKey = 'THEME_SETTING_IS_DARK';

const initialValue = booleanStorage.getItem(
  localStorageKey,
  { defaultValue: isDarkModeEnabled() },
);

export const useThemeSetting = () => useContext(ThemeContext);

export function ThemeSettingProvider({ children }) {
  const [isDarkMode, setTheme] = useState(initialValue);

  if (isClientSide()) {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }

  useEffect(() => {
    if (isClientSide() && window.matchMedia) {
      const colorSchemeQuery = window.matchMedia('(prefers-color-scheme: dark)');
      colorSchemeQuery.addEventListener('change', () => setTheme(isDarkModeEnabled()));
    }
  }, []);

  const toggleTheme = useCallback(() => {
    const newValue = !isDarkMode;
    setTheme(newValue);
    booleanStorage.setItem(localStorageKey, newValue);
  }, [isDarkMode]);

  const contextValue = {
    isDarkMode,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
}

ThemeSettingProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
