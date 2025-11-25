# Sicairo's Juice Station

Simple static website for a small juice shop: menu, cart, checkout, and a few informational pages.

Contents
- `index.html` - homepage with menu
- `style.css` - styles
- `app.js` - menu rendering and cart logic (uses localStorage)
- `cart.html`, `checkout.html`, `confirmation.html`, `contact.html`, `faq.html`, `about.html`, `privacy.html`, `terms.html` - supporting pages
- `hero-bg.jpg` - optional hero background image (not required)

Quick local preview

From PowerShell in the project folder:

```powershell
# open directly
Start-Process -FilePath 'index.html'
# or run a simple static server (recommended)
cd 'd:\Computer Science practice\Juice Web site'
python -m http.server 8000; Start-Process 'http://localhost:8000'
```

Create a GitHub repository and push (commands below).

Notes
- The cart and last order use `localStorage` — no backend required for basic testing.
- Replace or add `hero-bg.jpg` in the project root to enable the optional hero image on the homepage.
- The site is intentionally simple; for production you should add server-side order handling and sanitization.
