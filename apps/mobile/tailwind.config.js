/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./app/**/*.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // Laurel brand colors - Design System (matches web app)
        laurel: {
          forest: "#2D5A3D", // Primary - Forest Green
          sage: "#7CB07F", // Secondary - Sage
          amber: "#E8A54B", // Accent - Warm Amber
          white: "#FAFAF8", // Background - Warm White
          charcoal: "#1A1A1A", // Text - Near Black
          surface: "#F5F5F3", // Surface color
          "forest-dark": "#1A3D26", // Darker forest
          "forest-light": "#3D7A4D", // Lighter forest for hover
        },
      },
    },
  },
  plugins: [],
};
