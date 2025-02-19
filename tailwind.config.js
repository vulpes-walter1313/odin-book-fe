/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      colors: {},
      fontSize: {
        deskh1: ["3.375rem", { lineHeight: "110%", fontWeight: "700" }],
        deskh2: ["2.8125rem", { lineHeight: "110%", fontWeight: "700" }],
        deskh3: ["2.3125rem", { lineHeight: "110%", fontWeight: "700" }],
        deskh4: ["1.9375rem", { lineHeight: "110%", fontWeight: "700" }],
        deskh5: ["1.625rem", { lineHeight: "110%", fontWeight: "700" }],
        deskh6: ["1.375rem", { lineHeight: "110%", fontWeight: "700" }],
        deskp: ["1.125rem", { lineHeight: "150%", fontWeight: "400" }],
        desksmp: ["0.9375rem", { lineHeight: "150%", fontWeight: "400" }],
        deskxsp: ["0.8125rem", { lineHeight: "150%", fontWeight: "400" }],
        mobh1: ["2.25rem", { lineHeight: "110%", fontWeight: "700" }],
        mobh2: ["2rem", { lineHeight: "110%", fontWeight: "700" }],
        mobh3: ["1.8125rem", { lineHeight: "110%", fontWeight: "700" }],
        mobh4: ["1.625rem", { lineHeight: "110%", fontWeight: "700" }],
        mobh5: ["1.4375rem", { lineHeight: "110%", fontWeight: "700" }],
        mobh6: ["1.25rem", { lineHeight: "110%", fontWeight: "700" }],
        mobp: ["1.125rem", { lineHeight: "150%", fontWeight: "400" }],
        mobsmp: ["1rem", { lineHeight: "150%", fontWeight: "400" }],
        mobxsp: ["0.875rem", { lineHeight: "150%", fontWeight: "400" }],
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
