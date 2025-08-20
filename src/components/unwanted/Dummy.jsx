@import url('https://fonts.googleapis.com/css2?family=Oswald:wght@200..700&display=swap');

@import "tailwindcss";

@theme {
  /* Ensure these follow the --color-* namespace */
  --color-footer-background: rgb(20, 22, 26);
  --color-blacky:rgb(30, 32, 36);
  --color-footer-foreground: rgb(217, 217, 217);
  --color-footer-muted: rgb(153, 153, 153);
  --color-footer-brand: rgb(255, 255, 255);
  --color-footer-border: rgb(44, 49, 58);
  --font-oswald:"Oswald",sans-serif;
}

@layer components {
  .footer {
    /* Use matching variables with the --color-* prefix */
    background-color: hsl(var(--color-footer-background));
    color: hsl(var(--color-footer-foreground));
    border-top: 1px solid hsl(var(--color-footer-border));
    padding: 2rem;
  }
  .footer-muted {
    color: hsl(var(--color-footer-muted));
  }
  .footer-brand {
    color: hsl(var(--color-footer-brand));
    font-weight: bold;
  }
}

@layer utilities {
  .font-oswald {
    font-family: var(--font-oswald), sans-serif;
    font-weight: 700;
    font: clamp(1.5rem, 2vw + 1rem, 2.5rem);
  }
}