import { useCallback } from 'react';
import PropTypes from 'prop-types';

import { useSound } from '../context/sound';
import analytics from '../services/analytics';

function PostItem({
  title,
  link,
  summary,
}) {
  const [playOpen] = useSound(
    '/sounds/article-open.mp3',
    { volume: 0.5 },
  );
  const [playHover, { stop }] = useSound(
    '/sounds/plunger-immediate.mp3',
    { volume: 0.5 },
  );

  const handleClick = useCallback(() => {
    playOpen();
    analytics.sendEvent({
      category: 'post-view',
      action: link,
    });
  }, [playOpen, link]);

  return (
    <article dir="auto" className="group mt-12 dark:text-gray-200">
      <a
        href={link}
        target="_blank"
        rel="noreferrer"
        onClick={handleClick}
        onFocus={playHover}
        onMouseEnter={playHover}
        onMouseLeave={stop}
      >
        <h1 className="text-2xl font-extrabold group-hover:text-indigo-700 dark:group-hover:text-indigo-500  transition-color">{title}</h1>
        {/* eslint-disable-next-line react/no-danger */}
        <div className="my-4 text-xl font-light font-sans" dangerouslySetInnerHTML={{ __html: summary }} />
        <p dir="ltr" className="font-mono font-bold group-hover:text-indigo-700 dark:group-hover:text-indigo-500 transition-color">
          Read more
          <i className="fas fa-arrow-right pl-2 transform group-hover:translate-x-4 transition-transform" />
        </p>
      </a>
    </article>
  );
}

PostItem.propTypes = {
  title: PropTypes.string.isRequired,
  link: PropTypes.string.isRequired,
  summary: PropTypes.string.isRequired,
};
export default PostItem;
