import { useCallback } from 'react';
import PropTypes from 'prop-types';

import { useSound } from '../context/sound';
import analytics from '../services/analytics';

function SocialChip({
  title,
  link,
  iconName,
}) {
  const [playHover, { stop }] = useSound(
    '/sounds/plunger-immediate.mp3',
    { volume: 0.5 },
  );

  const handleClick = useCallback(() => {
    analytics.sendEvent({
      category: 'social-view',
      action: link,
    });
  }, [link]);

  return (
    <a
      className="inline-block flex-initial rounded-full bg-gray-900 dark:bg-gray-200 hover:bg-gray-700 dark:hover:bg-gray-400 text-sm text-white dark:text-gray-900 mr-4 mb-4 px-4 py-1 transition-color transition-transform transform hover:scale-105"
      href={link}
      target="_blank"
      rel="noreferrer"
      onClick={handleClick}
      onFocus={playHover}
      onMouseEnter={playHover}
      onMouseLeave={stop}
    >
      <i className={`fab pr-2 ${iconName}`} />
      {title}
    </a>
  );
}

SocialChip.propTypes = {
  title: PropTypes.string.isRequired,
  link: PropTypes.string.isRequired,
  iconName: PropTypes.string.isRequired,
};

export default SocialChip;
