/**
 * BASHA MENU DATA — the one place to edit products.
 *
 * - Names come from the menu list supplied for the project.
 * - Prices marked below were read from the website mockup and are NOT yet confirmed
 *   against the real menu (`verify: true`). `price: null` = price not known yet.
 *   Fix them here, or live in the browser at  #/manage  (Photos & Prices).
 * - Pizza sizes: add `sizes: [{ label: '...', price: N }, ...]` once the real size names/prices are confirmed.
 * - Photos: drop  src/assets/menu/<id>.jpg  (extra photos: <id>-2.jpg) and rebuild — or upload at #/manage.
 * - The menu page shows each dish's photo + name (no description or price); prices appear on the dish page, cart, search and checkout.
 */
import { menuPhotos } from './menuPhotos.generated';

export type CatId = 'salads' | 'pasta' | 'pizza' | 'burgers' | 'chicken' | 'sides' | 'omelettes' | 'pies' | 'party';
export type Size = { label: string; price: number | null };
export type Product = {
  id: string;
  name: string;
  category: CatId;
  price: number | null;
  sizes?: Size[];
  description?: string;
  tags?: string[];
  images: string[];
  available: boolean;
  verify?: boolean;
  custom?: boolean;
};

export const categories: { id: CatId; label: string }[] = [
  { id: 'salads', label: 'Salads' },
  { id: 'pasta', label: 'Pasta' },
  { id: 'pizza', label: 'Pizza' },
  { id: 'burgers', label: 'Burgers' },
  { id: 'chicken', label: 'Chicken' },
  { id: 'sides', label: 'Sides' },
  { id: 'omelettes', label: 'Omelettes' },
  { id: 'pies', label: 'Pies' },
  { id: 'party', label: 'Mini Party' },
];

type Seed = [name: string, price?: number | null, extra?: Partial<Product>];
const make = (category: CatId, seeds: Seed[]): Product[] =>
  seeds.map(([name, price = null, extra]) => {
    const id = name.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    return { id, name, category, price, images: menuPhotos[id] || [], available: true, verify: true, ...extra };
  });

export const seedProducts: Product[] = [
  ...make('salads', [
    ['Lebanese Salad'], ['African Salad', 165], ['Fattoush Salad', 160], ['Tabbouleh Salad', 160],
    ['Grilled Chicken Salad', 210], ['Tuna Egg Salad', 210], ['Chicken Egg Salad', 210],
    ['Prawn Egg Salad', 220], ['Chicken Caesar', 220], ['Chicken Avocado', 230],
  ]),
  ...make('pasta', [['Chicken Pasta', 260], ['Shrimps Alfredo', 265], ['Pesto Chicken Pasta', 260]]),
  ...make('pizza', [
    ['Cheese Pizza'], ['Vegetarian Pizza', 145], ['Chicken Pizza', 320], ['Beef Pizza', 340],
    ['Shrimp Pizza'], ['Pepperoni Pizza', 350], ['Knockout Pizza', 420],
  ]),
  ...make('burgers', [
    ['Hamburger'], ['Cheeseburger'], ['Egg-Cheeseburger'], ['Double Cheeseburger'], ['Basha Special Burger'],
    ['Philly Cheeseburger'], ['Dynamite Chicken Burger'], ['Fish Burger'],
    ['Grilled Chicken Burger', 225], ['Chicken Zinger Burger', 230], ['The Veggie Delight', 195],
  ]),
  ...make('chicken', [
    ['Dynamite Strips', 170], ['Chicken Wings', 160, { description: '6 pcs' }], ['BBQ Wings', 190, { description: '6 pcs' }],
    ['Spicy Wings'], ['Chicken Strips'], ['Fried Chicken'],
  ]),
  ...make('sides', [
    ['Spring Rolls', 160, { description: '4 pcs' }], ['French Fries'], ['Loaded Fries'], ['Spicy Chips'],
    ['Spicy Potatoes'], ['Hummus & Sojok'], ['Fresh Vegetables'], ['Spicy Shrimp'], ['Fish Fingers'], ['Shrimps Scampi'],
  ]),
  ...make('omelettes', [
    ['Cheese Omelette'], ['Chicken Omelette'], ['Beef Omelette'], ['Shrimp Omelette'], ['Knockout Omelette'],
  ]),
  ...make('pies', [
    ['Cheese Pie'], ['Meat Pie'], ["Za'atar"], ["Vegetable Za'atar"], ['Cheese Pie & Sojok'],
  ]),
  ...make('party', [
    ['Mini Pizza'], ["Mini Za'atar"], ['Sausage Rolls'], ['Kebbeh'], ['Falafel'], ['Beef Sliders'], ['Chicken Sliders'],
  ]),
];

/** Dishes featured on the home page (ids from the list above). */
export const popularIds = ['grilled-chicken-burger', 'chicken-pasta', 'grilled-chicken-salad', 'beef-pizza'];
