/* eslint-disable react/jsx-props-no-spreading */
const ifarmeDefaultProps = {
  height: '80',
  frameBorder: '0',
  allowtransparency: 'true',
  allow: 'encrypted-media',
};

function Playlists() {
  return (
    <div className="my-12 flex flex-col sm:flex-row lg:flex-col justify-between">
      <iframe
        title="Metal spotify playlist"
        src="https://open.spotify.com/embed/playlist/5U3TbOPUeBSwAwIs6RF76j"
        className="max-w-lg flex-grow mb-6 sm:mr-6 sm:mb-0 lg:mr-0 lg:mb-6"
        {...ifarmeDefaultProps}
      />
      <iframe
        title="ZeroToHund spotify playlist"
        src="https://open.spotify.com/embed/playlist/54OLgLlkPKD70bTf2nt24w"
        className="max-w-lg flex-grow"
        {...ifarmeDefaultProps}
      />
    </div>
  );
}

export default Playlists;
