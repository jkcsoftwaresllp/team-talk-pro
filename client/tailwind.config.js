/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        beige: "#f5f5dc",
        olive: "#3e3e1f",     // Dark olive for container
        darkbrown: "#3b2f2f"  // Border color option
      },
    },
  },
  plugins: [],
}
