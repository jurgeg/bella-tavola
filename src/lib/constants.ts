export const RESTAURANT = {
  name: 'Bella Tavola',
  tagline: 'Authentic Italian, Reimagined',
  description:
    'Nestled in the heart of the city, Bella Tavola brings the soul of Italy to your table. Our chefs craft each dish with passion, using the finest ingredients sourced from Italian artisans and local farms. From handmade pasta to wood-fired pizza, every bite tells a story of tradition and innovation.',
  address: '42 Florence Street, London, EC2A 4BQ',
  phone: '+44 20 7946 0123',
  email: 'hello@bellatavola.co.uk',
  hours: {
    'Monday': 'Closed',
    'Tuesday – Thursday': '12:00 – 22:00',
    'Friday – Saturday': '12:00 – 23:00',
    'Sunday': '12:00 – 21:00',
  },
  socials: {
    instagram: 'https://instagram.com/bellatavola',
    facebook: 'https://facebook.com/bellatavola',
    tripadvisor: 'https://tripadvisor.com/bellatavola',
  },
};

export const IMAGES = {
  hero: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1920&q=80',
  about: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=1200&q=80',
  gallery: [
    'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&q=80',
    'https://images.unsplash.com/photo-1574894709920-11b28e7367e3?w=800&q=80',
    'https://images.unsplash.com/photo-1595295333158-4742f28fbd85?w=800&q=80',
    'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=800&q=80',
    'https://images.unsplash.com/photo-1546549032-9571cd6b27df?w=800&q=80',
    'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=800&q=80',
    'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80',
    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80',
  ],
  ctaBg: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=1920&q=80',
  bookingBg: 'https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=1920&q=80',
};

export const TIME_SLOTS = [
  '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
  '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30',
];

export const OCCASIONS = [
  'None',
  'Birthday',
  'Anniversary',
  'Date Night',
  'Business Dinner',
  'Celebration',
  'Other',
];

export const FALLBACK_MENU: import('./supabase').MenuItem[] = [
  { id: '1', name: 'Bruschetta al Pomodoro', description: 'Toasted sourdough, heirloom tomatoes, fresh basil, extra virgin olive oil', price: 9.5, category: 'Antipasti', dietary_tags: ['vegetarian', 'vegan'], featured: true },
  { id: '2', name: 'Burrata e Prosciutto', description: 'Creamy burrata, 24-month aged prosciutto di Parma, rocket, balsamic glaze', price: 14, category: 'Antipasti', dietary_tags: [], featured: false },
  { id: '3', name: 'Carpaccio di Manzo', description: 'Thinly sliced beef fillet, rocket, parmesan shavings, truffle oil', price: 15, category: 'Antipasti', dietary_tags: ['gluten-free'], featured: false },
  { id: '4', name: 'Calamari Fritti', description: 'Lightly fried squid rings, lemon aioli, marinara sauce', price: 12, category: 'Antipasti', dietary_tags: [], featured: false },

  { id: '5', name: 'Tagliatelle al Ragù', description: 'Hand-cut egg pasta, slow-cooked Bolognese ragù, parmigiano reggiano', price: 16, category: 'Primi', dietary_tags: [], featured: true },
  { id: '6', name: 'Risotto ai Funghi Porcini', description: 'Carnaroli rice, wild porcini mushrooms, white wine, truffle butter', price: 18, category: 'Primi', dietary_tags: ['vegetarian', 'gluten-free'], featured: true },
  { id: '7', name: 'Spaghetti alle Vongole', description: 'Bronze-die spaghetti, fresh clams, garlic, white wine, chilli', price: 17, category: 'Primi', dietary_tags: [], featured: false },
  { id: '8', name: 'Gnocchi al Gorgonzola', description: 'Potato gnocchi, gorgonzola cream, toasted walnuts, sage', price: 15, category: 'Primi', dietary_tags: ['vegetarian'], featured: false },

  { id: '9', name: 'Bistecca alla Fiorentina', description: '500g T-bone steak, rosemary, garlic, roasted potatoes, seasonal greens', price: 38, category: 'Secondi', dietary_tags: ['gluten-free'], featured: true },
  { id: '10', name: 'Branzino al Forno', description: 'Oven-roasted sea bass, cherry tomatoes, olives, capers, herb crust', price: 26, category: 'Secondi', dietary_tags: ['gluten-free'], featured: false },
  { id: '11', name: 'Pollo alla Milanese', description: 'Breaded chicken cutlet, rocket, cherry tomato salad, lemon', price: 22, category: 'Secondi', dietary_tags: [], featured: false },
  { id: '12', name: 'Ossobuco alla Milanese', description: 'Braised veal shank, saffron risotto, gremolata', price: 32, category: 'Secondi', dietary_tags: ['gluten-free'], featured: false },

  { id: '13', name: 'Margherita DOP', description: 'San Marzano tomatoes, fior di latte, fresh basil, extra virgin olive oil', price: 13, category: 'Pizza', dietary_tags: ['vegetarian'], featured: true },
  { id: '14', name: 'Diavola', description: 'Spicy nduja, mozzarella, Calabrian chilli, honey drizzle', price: 15, category: 'Pizza', dietary_tags: [], featured: false },
  { id: '15', name: 'Tartufo', description: 'Truffle cream, wild mushrooms, fontina, rocket, parmesan', price: 18, category: 'Pizza', dietary_tags: ['vegetarian'], featured: false },
  { id: '16', name: 'Quattro Formaggi', description: 'Mozzarella, gorgonzola, fontina, parmigiano reggiano', price: 16, category: 'Pizza', dietary_tags: ['vegetarian'], featured: false },

  { id: '17', name: 'Tiramisù', description: 'Classic mascarpone cream, espresso-soaked savoiardi, cocoa', price: 10, category: 'Dolci', dietary_tags: ['vegetarian'], featured: true },
  { id: '18', name: 'Panna Cotta', description: 'Vanilla bean cream, seasonal berry compote', price: 9, category: 'Dolci', dietary_tags: ['vegetarian', 'gluten-free'], featured: false },
  { id: '19', name: 'Affogato al Caffè', description: 'Vanilla gelato, hot espresso, amaretti crumble', price: 8, category: 'Dolci', dietary_tags: ['vegetarian'], featured: false },
  { id: '20', name: 'Cannoli Siciliani', description: 'Crisp pastry shells, ricotta cream, pistachio, candied orange', price: 10, category: 'Dolci', dietary_tags: ['vegetarian'], featured: false },
];

export const FALLBACK_TESTIMONIALS: import('./supabase').Testimonial[] = [
  { id: '1', name: 'Sophie & James', rating: 5, quote: 'The most incredible Italian dining experience we\'ve had in London. The homemade pasta was absolutely divine, and the atmosphere was perfect for our anniversary.', date: '2025-11-15' },
  { id: '2', name: 'Marco R.', rating: 5, quote: 'As an Italian living abroad, finding authentic food is hard. Bella Tavola genuinely transported me back to my nonna\'s kitchen. Bravissimi!', date: '2025-10-28' },
  { id: '3', name: 'Emily Chen', rating: 4, quote: 'Beautiful restaurant with impeccable service. The risotto ai funghi porcini was the highlight of our evening. Will definitely return.', date: '2025-12-03' },
  { id: '4', name: 'David & Partners', rating: 5, quote: 'We host all our client dinners here now. The private dining area is stunning and the staff always make our guests feel special.', date: '2026-01-10' },
  { id: '5', name: 'Sarah M.', rating: 5, quote: 'Booked for my birthday through the website — seamless experience! They even surprised me with a complimentary dessert. Truly special.', date: '2026-01-22' },
];
