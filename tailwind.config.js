/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts}'],
  theme: {
    extend: {
        fontFamily: {
            sans: ['Poppins', 'sans-serif']
        },
        gridTemplateColumns: {
            '70/30': ' 70% 28%'
        },
        colors: {
          'login-button-main-color': '#89A8B2',
          'login-button-skip-color': '#A7754D',
          'friend-list-item': '#284B63',
          'popup-input': '#8D9EC6',

          'ui-box-color': '#B3C8CF',
          'ui-default-input-color': '#F1F0E8',
          'ui-default-bg-color': '#f8fafc',
          'ui-default-text-color': '#1c1917',
          'ui-default-text-color2': '#f8fafc',
          'ui-default-main-button': '#89A8B2',
          'ui-default-main-button2': '#284B63',
          'ui-default-secondary-button': '#153243',
          'ui-default-love-color': '#f87171',
          'ui-default-love-color-on-hover': '#b91c1c',

        }
        
    },
  },
  variants: {
      extend: {},
    },
  plugins: [
      require('tailwindcss-animated')
    ],
}

