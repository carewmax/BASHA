/**
 * BASHA — business settings. Edit this file; nothing here is invented.
 * Anything left empty ('' / false / null) is simply NOT shown on the site
 * (or shown as "to be confirmed"), so no fake phone numbers, hours or fees appear.
 */
export const config = {
  name: 'Basha Bakery & Restaurant',
  short: 'Basha',
  tagline: 'Good Food. Great Vibes.',

  /** Prefix for prices, e.g. 'NLe ' — leave '' until the currency is confirmed. */
  currency: '',

  contact: {
    phone: '',        // e.g. '+232 76 000000'  (shows a Call button)
    whatsapp: '',     // digits only with country code, e.g. '23276000000' (enables WhatsApp buttons + "send order via WhatsApp")
    email: '',        // e.g. 'hello@yourdomain.com' (contact form opens the visitor's email app addressed to this)
    address: '',      // e.g. '12 Example Street, Freetown'
    hours: '',        // e.g. 'Mon – Sun: 8:00 AM – 10:00 PM'
    mapEmbedUrl: '',  // Google Maps "Embed a map" src URL
    mapLink: '',      // link that opens the location in Maps
  },

  social: { instagram: '', facebook: '', tiktok: '' }, // full profile URLs

  /** Only turn these on once Basha confirms the service. They control what checkout offers. */
  services: { delivery: false, pickup: false, dineIn: false },

  /** Number, or null if not confirmed. Shown in cart/checkout only when set. */
  deliveryFee: null as number | null,

  /** Future: POST orders here once a backend exists. Empty = checkout stays a demonstration. */
  orderEndpoint: '',
};
