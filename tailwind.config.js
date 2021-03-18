// eslint-disable-next-line import/no-extraneous-dependencies
const colors = require('tailwindcss/colors');

module.exports = {
  purge: ['./pages/**/*.{js,jsx}', './components/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    fontFamily: {
      sans: ['Inter', 'Almarai', 'sans-serif'],
      mono: ['Roboto Slab', 'serif'],
    },
    colors: {
      white: colors.white,
      black: colors.black,
      red: colors.red,
      indigo: colors.indigo,
      gray: colors.trueGray,
    },
    scale: {
      25: '.25',
      50: '.5',
      105: '1.05',
    },
    screens: {
      sm: '690px',
      md: '768px',
      lg: '1024px',
    },
    extend: {
      transitionProperty: {
        color: 'background-color',
      },
    },
  },
  variants: {
    extend: {
      translate: ['group-hover'],
      rotate: ['group-hover'],
      scale: ['group-hover'],
      display: ['group-hover'],
    },
  },
};
