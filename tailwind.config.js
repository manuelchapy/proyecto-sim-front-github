/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./app/**/*.{js,ts,jsx,tsx}", // ✅ Asegurar que escanee archivos en `app/`
      "./components/**/*.{js,ts,jsx,tsx}", // ✅ Incluir la carpeta `components/`
      "./pages/**/*.{js,ts,jsx,tsx}" // (Opcional, si tienes `pages/`)
    ],
    theme: {
      extend: {},
    },
    plugins: [],
  };  