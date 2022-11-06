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
    extend: {
      lineHeight: {
        "1dt125": "1.125rem"
      },
      letterSpacing: {
        "n0dt1": "-0.1px"
      },
      zIndex: {
        "one": "1"
      },
      backgroundColor: {
        "217-242-236-dt5": "rgba(217,242,236,.5)"
      },
      margin: {
        "mt0dt281": "0.281rem"
      },
      padding: {
        "0dt375": "0.375rem"
      }
    },
  },
  plugins: [],
};
