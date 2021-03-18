import ReactGA from 'react-ga';

import { gaKey } from '../config';

function initialize() {
  ReactGA.initialize(gaKey);
  ReactGA.pageview(window.location.pathname + window.location.search);
}

function sendEvent(config) {
  ReactGA.event(config);
}

export default {
  initialize,
  sendEvent,
};
