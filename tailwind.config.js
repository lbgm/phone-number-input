/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: "jit",
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    colors: {
      transparent: "transparent",
      primary: "#006A52",
      "primary-light": "#EDF9F0",
      "danger-light": "#FEEFEF",
      DADEE3: "#DADEE3",
      white: "white",
      black: "black",
      danger: "#DA1414",
      gray: "#858C94",
      DA1414: "#DA1414",
      394452: "#394452",
    },
    extend: {},
  },
  plugins: [],
};
