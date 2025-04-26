/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./src/**/*.{js,jsx,ts,tsx}",  // 👈 important
    ],
    theme: {
      extend: {
        colors: {
          primary: '#4f46e5', // customize this later easily
          secondary: '#22c55e',
        },
      },
    },
    plugins: [],
  }
  