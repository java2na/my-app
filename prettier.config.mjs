/** @type {import('prettier').Config} */
const prettierConfig = {
  plugins: ["prettier-plugin-tailwindcss"],
  tailwindFunctions: ["cn", "cva"],
};

export default prettierConfig;
