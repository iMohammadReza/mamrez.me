import {
  createContext, useContext, useState, useCallback,
} from 'react';
import PropTypes from 'prop-types';
import useSoundLib from 'use-sound';

import booleanStorage from '../services/booleanStorage';

const SoundSettingContext = createContext();
const localStorageKey = 'SOUND_SETTING_IS_ON';

const initialValue = booleanStorage.getItem(localStorageKey, { defaultValue: true });
export const useSoundSetting = () => useContext(SoundSettingContext);

export function useSound(sound, configs) {
  const { isSoundActive } = useSoundSetting();
  const [playSound, options] = useSoundLib(sound, configs);

  return [isSoundActive || configs.forsePlay ? playSound : () => {}, options];
}

export function SoundSettingProvider({ children }) {
  const [isSoundActive, setSeound] = useState(initialValue);

  const toggleSound = useCallback(() => {
    const newValue = !isSoundActive;
    setSeound(newValue);
    booleanStorage.setItem(localStorageKey, newValue);
  }, [isSoundActive]);

  const contextValue = {
    isSoundActive,
    toggleSound,
  };

  return (
    <SoundSettingContext.Provider value={contextValue}>
      {children}
    </SoundSettingContext.Provider>
  );
}

SoundSettingProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
