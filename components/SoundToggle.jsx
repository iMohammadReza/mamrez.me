import { useRef, useCallback } from 'react';
import { useSpring, useChain, animated } from 'react-spring';

import { useSoundSetting, useSound } from '../context/sound';
import analytics from '../services/analytics';
import { isClientSide } from '../utils';

export const properties = {
  on: {
    wave: {
      opacity: 1,
    },
    biggerWave: {
      opacity: 1,
    },
  },
  off: {
    wave: {
      opacity: 0,
    },
    biggerWave: {
      opacity: 0,
    },
  },
  springConfig: { mass: 4, tension: 250, friction: 35 },
};

function SoundToggle() {
  const { isSoundActive, toggleSound } = useSoundSetting();

  const { wave, biggerWave } = properties[isSoundActive ? 'on' : 'off'];

  const waveRef = useRef();
  const waveProps = useSpring({
    ...wave,
    config: properties.springConfig,
    ref: waveRef,
  });
  const biggerWaveRef = useRef();
  const biggerWavesProps = useSpring({
    ...biggerWave,
    config: properties.springConfig,
    ref: biggerWaveRef,
  });
  const chainOrder = isSoundActive ? [waveRef, biggerWaveRef] : [biggerWaveRef, waveRef];
  useChain(chainOrder, [0, 0.15]);

  const [playClick] = useSound(
    `/sounds/${isSoundActive ? 'disable-sound' : 'enable-sound'}.mp3`,
    {
      volume: 0.3,
      forsePlay: true,
    },
  );

  const handleClick = useCallback(() => {
    playClick();
    toggleSound();
    analytics.sendEvent({
      category: 'setting-interaction',
      action: 'sound toggle',
    });
  }, [playClick, toggleSound]);

  if (!isClientSide()) {
    return null;
  }

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 18 18"
      fill="none"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="currentColor"
      className="mt-2 cursor-pointer text-black dark:text-white"
      onClick={handleClick}
    >
      <path d="M8.25 3.75L4.5 6.75H1.5V11.25H4.5L8.25 14.25V3.75Z" />
      <animated.path
        d="
            M14.3025 3.69751
            C15.7086 5.10397 16.4984 7.01128 16.4984 9.00001
            C16.4984 10.9887 15.7086 12.8961 14.3025 14.3025
            "
        style={biggerWavesProps}
      />
      <animated.path
        d="
            M11.655 6.34501
            C12.358 7.04824 12.753 8.00189 12.753 8.99626
            C12.753 9.99063 12.358 10.9443 11.655 11.6475
          "
        style={waveProps}
      />
    </svg>
  );
}

export default SoundToggle;
