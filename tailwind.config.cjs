/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      colors: {
        neongreen: "#D6FD02",
        darkgreen: "#314B38",
      },
    },
  },
  plugins: [],
};
