/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: 'class',              // enable class-based dark mode
    content: [
      './index.html',
      './src/**/*.{js,jsx,ts,tsx}',
    ],
    plugins: [
      // add official plugins if needed
      require('@tailwindcss/forms'),
      require('@tailwindcss/typography'),
      require('daisyui'),
      require('@heroui/react/tailwind')  // integrates HeroUI theme tokens :contentReference[oaicite:7]{index=7}
      
    ],
  }
  