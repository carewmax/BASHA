/**
 * Editable website copy + gallery. Keep claims you can stand behind — nothing here states
 * a founding date, award, sourcing claim, or history.
 */
import g1 from '../assets/g1.jpg';
import g2 from '../assets/g2.jpg';
import g3 from '../assets/g3.jpg';
import g4 from '../assets/g4.jpg';
import g5 from '../assets/g5.jpg';
import g6 from '../assets/g6.jpg';
import g7 from '../assets/g7.jpg';
import g8 from '../assets/g8.jpg';
import g9 from '../assets/g9.jpg';
import aboutPizza from '../assets/about_pizza.jpg';
import aboutBurger from '../assets/about_burger.jpg';
import heroFood from '../assets/hero_food.jpg';
import logo from '../assets/logo.png';

export const images = { logo, heroFood, aboutPizza, aboutBurger, g7, g8, g9 };

export const hero = {
  line1: 'Fresh Food.',
  line2: 'Better Mood.',
  sub: 'Delicious meals · Fresh ingredients · Baked with love',
};

export const benefits = [
  { icon: 'leaf', title: 'Fresh Food', text: 'Made with care, served with a smile' },
  { icon: 'heart', title: 'Great Taste', text: 'Favourites worth coming back for' },
  { icon: 'smile', title: 'Warm Welcome', text: 'Good vibes for everyone' },
] as const;

export const about = {
  tagline: 'Good Food. Great People.',
  intro:
    "Basha Bakery & Restaurant is more than just a place to eat — it's a place to feel at home. Burgers, pizzas, pasta, salads and baked treats, served in a warm and welcoming atmosphere. Our passion is bringing people together through great food.",
  values: [
    { icon: 'leaf', title: 'Fresh Food', text: 'A menu of favourites, made with care.' },
    { icon: 'chef', title: 'Made With Care', text: 'Every dish served the Basha way.' },
    { icon: 'home', title: 'Cozy Atmosphere', text: 'A comfortable space for family, friends and everyone.' },
  ],
};

export type GalleryItem = { src: string; alt: string; kind: 'food' | 'interior' };
export const gallery: GalleryItem[] = [
  { src: g1, alt: 'Cheeseburger with lettuce and tomato', kind: 'food' },
  { src: g2, alt: 'Pepperoni pizza', kind: 'food' },
  { src: g3, alt: 'Pasta with fresh herbs', kind: 'food' },
  { src: g4, alt: 'Grilled chicken with salad', kind: 'food' },
  { src: g5, alt: 'Fresh mixed salad bowl', kind: 'food' },
  { src: g6, alt: 'Chocolate layer cake slice', kind: 'food' },
  { src: g7, alt: 'Restaurant dining room', kind: 'interior' },
  { src: g8, alt: 'Bakery display counter', kind: 'interior' },
  { src: g9, alt: 'Restaurant tables by the window', kind: 'interior' },
];
