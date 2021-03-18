import { isClientSide } from '../utils';

function getItem(key, { defaultValue = false } = {}) {
  if (!isClientSide()) {
    return undefined;
  }

  const value = localStorage.getItem(key);
  if (value === null) {
    return defaultValue;
  }

  return Boolean(Number(value));
}

function setItem(key, value) {
  if (!isClientSide()) {
    return;
  }

  localStorage.setItem(key, Number(Boolean(value)));
}

export default {
  getItem,
  setItem,
};
