# Basha Bakery & Restaurant — Website

A complete, responsive restaurant website: Home, Menu, About, Gallery, Contact, plus dish pages with reviews, search, cart, checkout and an order confirmation. Built with **React 19 + TypeScript**, bundled by **esbuild** into one self-contained `dist/index.html` that you can host anywhere.

## Run it

```bash
npm install
npm run dev      # http://localhost:5173 (rebuilds on save)
npm run build    # -> dist/index.html  (the whole site in one file)
```

Deploy `dist/index.html` to Netlify (drag & drop), GitHub Pages (a ready workflow is in `.github/workflows/deploy.yml` — turn on Pages → "GitHub Actions"), or any web host.

## The three things you'll edit

| What | Where |
|---|---|
| Phone, WhatsApp, email, address, hours, map, social links, delivery/pickup, delivery fee | `src/config.ts` |
| Dishes, prices, pizza sizes, availability | `src/data/menu.ts` |
| Dish photos | drop files into `src/assets/menu/` (see below) |
| Wording, gallery photos | `src/data/content.ts` + `src/assets/` |

Nothing is invented: anything left empty in `config.ts` is hidden or shown as "To be confirmed" (no fake phone number, hours, delivery fee, reviews or history).

## The menu shows photo + name

The **Menu page shows each dish's photo with its name underneath** — no descriptions or prices on the cards. A dish without a photo yet shows a tidy icon slot (its name is still shown). Prices appear on the dish page, in the cart, in search and at checkout.

### Adding dish photos

**Option A — files (best for the live site).** Save the photo as `src/assets/menu/<dish-id>.jpg` (extra photos: `<dish-id>-2.jpg`, `-3` …) and run `npm run build`. Use the dish ids below. `.jpg`, `.png`, `.webp` all work.

**Option B — in the browser.** Open the site, go to `#/manage` (footer link "Manage menu photos"), upload a picture per dish, set prices, sizes (e.g. `Small: 145, Large: 190`), availability, or add a brand-new dish. This is saved **only in that browser** — use **Export edits** to keep a backup. Good for preparing; Option A is how photos go live for everyone.

Photo shape: cards are square by default. Change `--menu-ratio` at the top of `src/styles.css` (e.g. `4/5`) if your photos are portrait.

### Dish ids

**salads** — `lebanese-salad`, `african-salad`, `fattoush-salad`, `tabbouleh-salad`, `grilled-chicken-salad`, `tuna-egg-salad`, `chicken-egg-salad`, `prawn-egg-salad`, `chicken-caesar`, `chicken-avocado`

**pasta** — `chicken-pasta`, `shrimps-alfredo`, `pesto-chicken-pasta`

**pizza** — `cheese-pizza`, `vegetarian-pizza`, `chicken-pizza`, `beef-pizza`, `shrimp-pizza`, `pepperoni-pizza`, `knockout-pizza`

**burgers** — `hamburger`, `cheeseburger`, `egg-cheeseburger`, `double-cheeseburger`, `basha-special-burger`, `philly-cheeseburger`, `dynamite-chicken-burger`, `fish-burger`, `grilled-chicken-burger`, `chicken-zinger-burger`, `the-veggie-delight`

**chicken** — `dynamite-strips`, `chicken-wings`, `bbq-wings`, `spicy-wings`, `chicken-strips`, `fried-chicken`

**sides** — `spring-rolls`, `french-fries`, `loaded-fries`, `spicy-chips`, `spicy-potatoes`, `hummus-and-sojok`, `fresh-vegetables`, `spicy-shrimp`, `fish-fingers`, `shrimps-scampi`

**omelettes** — `cheese-omelette`, `chicken-omelette`, `beef-omelette`, `shrimp-omelette`, `knockout-omelette`

**pies** — `cheese-pie`, `meat-pie`, `za-atar`, `vegetable-za-atar`, `cheese-pie-and-sojok`

**party** — `mini-pizza`, `mini-za-atar`, `sausage-rolls`, `kebbeh`, `falafel`, `beef-sliders`, `chicken-sliders`

## What is real vs. demonstration

* **Real:** browsing, search, filters, cart, gallery viewer, WhatsApp order button (once `contact.whatsapp` is set), phone/email links, contact form → opens the visitor's email app addressed to `contact.email` (once set).
* **Demonstration (clearly labelled on screen):** "Place Order" does **not** reach the restaurant and takes **no payment** until you set `orderEndpoint` in `config.ts` to a real backend; sign-in and reviews are stored in the visitor's own browser only. When you connect a backend, the order confirmation changes from "Demo" to "Order received" automatically.

## Replace these placeholders

The logo and the food/interior photos currently in `src/assets/` were **cropped from the design mockup** so the site could be built before the real photos arrived, so they're low-resolution. Replace them with the originals:
`src/assets/logo.png` (the logo works on dark backgrounds), `hero_food.jpg`, `about_*.jpg`, `g1…g9.jpg` (gallery).

## Prices

Prices on the site were read from the mockup and are flagged `verify: true` in `src/data/menu.ts`. Check each against the real menu; items with `price: null` show "Price to be confirmed" and are left out of cart totals.

## Structure

```
src/
  config.ts          business details & switches
  data/menu.ts       dishes, categories, prices, sizes
  data/content.ts    copy + gallery
  store.tsx          cart, search state, menu edits, toasts (React context)
  router.tsx         tiny hash router (#/menu, #/product/<id> …)
  pages/             Home, Menu, Product, About, Gallery, Contact, Cart, Checkout, Confirmation, Manage
  components/        Navbar, Footer, CartDrawer, SearchOverlay, Lightbox, AccountModal, …
  styles.css         design system (cream / charcoal / gold, paper textures, torn edges)
build.mjs            esbuild script -> dist/index.html
```
