/** @type {import('tailwindcss').Config} */
module.exports = {
  // NativeWind 预设：将 Tailwind 工具类映射到 React Native 样式
  presets: [require('nativewind/preset')],
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [],
};
