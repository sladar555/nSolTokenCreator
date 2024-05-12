/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      backgroundImage: {
        "nurse-avatar": "url(/assets/images/nurseAvatar.png)",
        "baby-avatar": "url(/assets/images/babyAvatar.png)",
        "down-icon": "url(/assets/icons/down.png)",
        "arrow-icon": "url(/assets/images/arrow.png)",
        "logo-image": "url(/assets/images/logo.webp)",
        "loop-avatar": "url(/assets/images/NFT-flipthrough-web.gif)"
      }
    },
  },
  plugins: [],
};
