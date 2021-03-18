import { useCallback } from 'react';
import PropTypes from 'prop-types';
import absoluteUrl from 'next-absolute-url';

import MetaTags from '../components/MetaTags';
import WaveDivider from '../components/WaveDivider';
import Posts from '../components/Posts';
import Playlists from '../components/Playlists';
import Contact from '../components/Contact';
import ThemeToggle from '../components/ThemeToggle';
import SoundToggle from '../components/SoundToggle';
import { useSound } from '../context/sound';
import request from '../services/request';
import analytics from '../services/analytics';
import { header } from '../config';

function Home({ posts }) {
  const [playPop] = useSound(
    '/sounds/pop.mp3',
    { volume: 0.3 },
  );
  const [playPopDown] = useSound(
    '/sounds/pop-down.mp3',
    { volume: 0.3 },
  );
  const handleMouseEnter = useCallback(() => {
    playPop();
    analytics.sendEvent({
      category: 'header-easter-egg',
      action: 'hover',
    });
  }, [playPop]);

  return (
    <div>
      <MetaTags />
      <div className="fixed top-2 right-2">
        <ThemeToggle />
        <SoundToggle />
      </div>
      <header className="py-48 text-center">
        <h1
          className="group relative inline-block font-extralight text-4xl sm:text-6xl md:text-7xl lg:text-8xl dark:text-white select-none"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={playPopDown}
        >
          <b className="font-extrabold inline-block transform duration-300 group-hover:rotate-45 group-hover:translate-x-10 md:group-hover:translate-x-40 group-hover:-translate-y-20 group-hover:scale-50 md:group-hover:scale-25 transition-transform">
            {header.firstName}
          </b>
          <br />
          {header.lastName}
          <p className="absolute inset-x-0 top-4 hidden group-hover:block font-mono font-bold text-lg text-red-500">{header.easterText}</p>
        </h1>
        <h2 className="font-mono font-light text-lg sm:text-xl md:text-2xl  text-gray-800 dark:text-gray-200 mt-8">{header.jobtitle}</h2>
      </header>
      <WaveDivider />
      <main className="bg-white dark:bg-black">
        <div className="lg:max-w-6xl lg:mx-auto py-16 px-8 lg:flex lg:flex-row-reverse">
          <aside className="lg:max-w-xs">
            <h3 className="section-title">Playlists</h3>
            <Playlists />
            <h3 className="section-title">Contact me</h3>
            <Contact />
          </aside>
          <div className="flex-1 lg:mr-24">
            <h3 className="section-title">Recently Published</h3>
            <Posts posts={posts} />
          </div>
        </div>
      </main>
      <footer className="bg-white dark:bg-black py-12 px-8">
        <p className="font-mono text-sm font-light text-center dark:text-gray-100">
          {`© ${new Date().getFullYear()} `}
          <a className="hover:text-red-500 transition-color" href="/">
            {`${header.firstName} ${header.lastName}. `}
          </a>
          All Rights Reserved.
        </p>
      </footer>
    </div>
  );
}

Home.propTypes = {
  posts: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
};

export async function getServerSideProps({ req }) {
  const { origin } = absoluteUrl(req);
  const posts = await request(`${origin}/api/posts`, req);

  return { props: { posts } };
}

export default Home;
