/* eslint-disable react/prop-types */
import { useEffect } from 'react';

import { ThemeSettingProvider } from '../context/theme';
import { SoundSettingProvider } from '../context/sound';
import analytics from '../services/analytics';

import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  useEffect(() => analytics.initialize(), []);

  return (
    <SoundSettingProvider>
      <ThemeSettingProvider>
        <Component {...pageProps} />
      </ThemeSettingProvider>
    </SoundSettingProvider>
  );
}

export default MyApp;
