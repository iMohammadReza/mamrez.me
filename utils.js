// eslint-disable-next-line import/prefer-default-export
export function isClientSide() {
  return !(typeof window === 'undefined');
}

export function isDarkModeEnabled() {
  if (!isClientSide()) {
    return false;
  }

  if (window.matchMedia) {
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return true;
    }

    return false;
  }

  return false;
}
