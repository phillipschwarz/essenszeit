# Essenszeit

A meal planning PWA that helps you pick weekly meals from your collection and generates a consolidated shopping list, grouped by supermarket aisle.

## Features

- **Meal gallery** -- browse, search, and filter meals by tags. Tap to select, long-press to edit.
- **Meal plan** -- adjust portion sizes per meal with a stepper. Swipe-to-delete on mobile.
- **Shopping list** -- ingredients are automatically consolidated (same item + unit = summed amounts), grouped by category (Obst & Gemuse, Milchprodukte, Fleisch & Fisch, etc.), with a check-off progress bar. Share via native share sheet or clipboard.
- **Auth & cloud sync** -- email/password authentication via Supabase. Data syncs across devices; local cache provides offline fallback.
- **Installable PWA** -- service worker with cache-first strategy for the app shell. Add to home screen on iOS/Android.
- **10 seed meals** included for new accounts (Spaghetti Bolognese, Chicken Curry, Flammkuchen, etc.).

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Vanilla HTML/CSS/JS -- no framework, no build step |
| Backend | [Supabase](https://supabase.com) (Postgres + Auth + RLS) |
| Hosting | [Vercel](https://vercel.com) (static deploy) |
| Offline | Service worker (cache-first for app shell, network-first for Supabase) |

## Project Structure

```
essenszeit-pwa/
  index.html              # Single-page app shell (auth screen, 3 tabs, modals)
  app.js                  # All application logic in one IIFE
  style.css               # Apple-inspired warm minimal design system
  sw.js                   # Service worker -- cache-first strategy
  manifest.json           # PWA manifest (standalone, portrait, theme #E07A5F)
  icons/
    icon-192.svg
    icon-512.svg
  supabase-setup.sql      # Database schema (profiles, meals, ingredients,
                          #   meal_selections, checklist_items) + RLS policies
  email-template-confirm.html  # Supabase email confirmation template
```

## Data Model

```
Meal { id, name, image, tags[], defaultServings, ingredients[] }
Ingredient { id, name, amount, unit, category }
Selection { mealId, servings }
```

**Units:** g, kg, ml, l, Stk, EL, TL, Bund, Dose, Scheibe, Prise

**Categories:** Obst & Gemuse, Milchprodukte, Fleisch & Fisch, Brot & Backwaren, Pantry, Gewurze, Sonstiges

## Database Setup

1. Create a Supabase project.
2. Run `supabase-setup.sql` in the SQL Editor. This creates all tables, indexes, RLS policies, and triggers (auto-profile creation on signup, auto-`updated_at`).
3. Update `SUPABASE_URL` and `SUPABASE_ANON_KEY` in `index.html`.
4. Configure the email confirmation template in Supabase Auth settings using `email-template-confirm.html`.

## Local Development

No build step required. Serve the `essenszeit-pwa/` directory with any static file server:

```sh
# Python
python3 -m http.server 8000 -d essenszeit-pwa

# Node
npx serve essenszeit-pwa
```

Open `http://localhost:8000` in your browser.

## Deployment

The app is deployed to Vercel as a static site. Push to `main` to trigger a deploy.

## Version

0.0.1
