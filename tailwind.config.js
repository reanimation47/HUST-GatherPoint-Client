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
          'login-button-main-color': '#998650',
          'login-button-skip-color': '#A7754D',
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

