/** @type {import('tailwindcss').Config} */ 
module.exports = {
  content: [
     "./src/**/*.{js,jsx,ts,tsx}",
     /**Tailwind escanea esos archivos
        Genera SOLO las clases que usás
        Optimiza el CSS final */
  ],
  theme: {
      extend: {
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      },
      colors: {
        background: 'hsl(var(--background))', /*se crea la clase bg-background -> fondo con --background*/
        foreground: 'hsl(var(--foreground))', /*se crea la clase text-foreground -> fondo con --foreground*/
        primary: {
          DEFAULT: 'hsl(var(--primary))',  /**se pude crear la clase: bg-primary; color del boton */
          foreground: 'hsl(var(--primary-foreground))' /**se puede crear la clase: text-primary-foreground ; texto del botón*/
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))'
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))'
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))'
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
      }
    }
  },
  plugins: [require("tailwindcss-animate")],
  /*Permite animaciones tipo:
  animate-in
  fade-in
  slide-in-from-right
   */
}    

/**Cómo todo se une (ejemplo real)
 *<SheetContent className="bg-background text-foreground border-border">
bg-background
↓
colors.background
↓
hsl(var(--background))
↓
--background definido en index.css

Resultado: fondo claro
 */
