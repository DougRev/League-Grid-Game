/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}', // Include all files in the src directory
    './app/**/*.{js,jsx,ts,tsx}', // If App Router is used
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
