const plugin = require('tailwindcss/plugin')
export default {
  content: ["./src/**/*.{html,js,vue}"],
  darkMode: 'class',
  plugins: [
    plugin(function({ addUtilities }) {
      addUtilities({
        /* Hide scrollbar for Chrome, Safari and Opera */
        '.no-scrollbar::-webkit-scrollbar': {
          'display': 'none',
        },
        /* Hide scrollbar for IE, Edge and Firefox */
        '.no-scrollbar': {
            '-ms-overflow-style': 'none',  /* IE and Edge */
            'scrollbar-width': 'none'  /* Firefox */
        }
      })
    }),
  ],
  theme: {
    extend: {},
  },
}

