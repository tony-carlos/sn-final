// tailwind.config.js
module.exports = {
  content: [
    "./app/admin/**/*.{js,ts,jsx,tsx}",       // Tailwind for admin routes
    "./app/components/**/*.{js,ts,jsx,tsx}",  // Tailwind for app components
  ],
  theme: {
    extend: {
      colors: {
        primary: '#F29F67',
        dark: '#1E1E2C',
        blue: '#3B8FF3',
        teal: '#34B1AA',
        lime: '#E0B50F',
      },
    },
  },
  plugins: [],
};
