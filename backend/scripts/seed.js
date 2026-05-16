require('dotenv').config({ path: require('path').join(__dirname, '../.env') })
const { pool } = require('../config/db')

const restaurants = [
  {
    name: 'Sushi Street',
    cuisine_type: 'Japanese',
    rating: 4.8,
    image_url: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=800&h=600&fit=crop&q=80',
    owner_name: 'Kenji Tanaka',
    owner_email: 'kenji@sushistreet.com',
    owner_phone: '+1 212-555-0101',
    address: '142 E 49th St, New York, NY 10017',
    description: 'Authentic Japanese sushi and sashimi in the heart of Midtown.',
    store_type: 'restaurant',
    delivery_fee: 2.99,
    delivery_time: '25-35 min',
  },
  {
    name: 'La Placita Boricua',
    cuisine_type: 'Puerto Rican',
    rating: 4.7,
    image_url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=600&fit=crop&q=80',
    owner_name: 'Carmen Rivera',
    owner_email: 'carmen@laplacitaboricua.com',
    owner_phone: '+1 212-555-0102',
    address: '1678 Madison Ave, New York, NY 10029',
    description: 'Authentic Puerto Rican comfort food — mofongo, pernil, tostones, and more, straight from the island.',
    store_type: 'restaurant',
    delivery_fee: 1.99,
    delivery_time: '25-35 min',
  },
  {
    name: 'Burger Hub',
    cuisine_type: 'American',
    rating: 4.6,
    image_url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&h=600&fit=crop&q=80',
    owner_name: 'Mike Johnson',
    owner_email: 'mike@burgerhub.com',
    owner_phone: '+1 212-555-0103',
    address: '310 W 34th St, New York, NY 10001',
    description: 'Smash burgers, crispy fries, and thick shakes.',
    store_type: 'restaurant',
    delivery_fee: 2.49,
    delivery_time: '20-30 min',
  },
  {
    name: 'Shawarma Station',
    cuisine_type: 'Middle Eastern',
    rating: 4.5,
    image_url: 'https://images.unsplash.com/photo-1561651823-34feb02250e4?w=800&h=600&fit=crop&q=80',
    owner_name: 'Omar Al-Rashid',
    owner_email: 'omar@shawarmastation.com',
    owner_phone: '+1 212-555-0104',
    address: '55 W 125th St, New York, NY 10027',
    description: 'Slow-roasted chicken and beef shawarma wraps.',
    store_type: 'restaurant',
    delivery_fee: 1.99,
    delivery_time: '15-25 min',
  },
  {
    name: 'Pasta Palace',
    cuisine_type: 'Italian',
    rating: 4.4,
    image_url: 'https://images.unsplash.com/photo-1473093226555-0e4d2c6d57f3?w=800&h=600&fit=crop&q=80',
    owner_name: 'Marco Rossi',
    owner_email: 'marco@pastapalace.com',
    owner_phone: '+1 212-555-0105',
    address: '212 Mulberry St, New York, NY 10012',
    description: 'Hand-made pasta, wood-fired pizza, and Italian classics.',
    store_type: 'restaurant',
    delivery_fee: 3.49,
    delivery_time: '30-45 min',
  },
  {
    name: 'Green Bowl',
    cuisine_type: 'Healthy',
    rating: 4.3,
    image_url: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=600&fit=crop&q=80',
    owner_name: 'Sarah Green',
    owner_email: 'sarah@greenbowl.com',
    owner_phone: '+1 212-555-0106',
    address: '400 Park Ave S, New York, NY 10016',
    description: 'Acai bowls, salads, and cold-pressed juices.',
    store_type: 'restaurant',
    delivery_fee: 2.99,
    delivery_time: '20-30 min',
  },
  {
    name: 'Fresh Mart',
    cuisine_type: 'Fresh Food, Dairy & Eggs, Beverages',
    rating: 4.6,
    image_url: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&h=600&fit=crop&q=80',
    owner_name: 'Lisa Chen',
    owner_email: 'lisa@freshmart.com',
    owner_phone: '+1 212-555-0201',
    address: '900 Amsterdam Ave, New York, NY 10025',
    description: 'Local produce, organic dairy, and pantry essentials delivered fast.',
    store_type: 'grocery',
    delivery_fee: 1.99,
    delivery_time: '30-50 min',
  },
  {
    name: 'HealthPlus Pharmacy',
    cuisine_type: 'Pharmacy, Beauty',
    rating: 4.5,
    image_url: 'https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=800&h=600&fit=crop&q=80',
    owner_name: 'Dr. Priya Patel',
    owner_email: 'priya@healthplus.com',
    owner_phone: '+1 212-555-0301',
    address: '180 Lexington Ave, New York, NY 10016',
    description: 'Prescriptions, OTC medicine, vitamins, and beauty products.',
    store_type: 'pharmacy',
    delivery_fee: 0.99,
    delivery_time: '20-35 min',
  },
]

const menuItems = {
  'Sushi Street': [
    { name: 'Salmon Nigiri (2pc)', description: 'Fresh Atlantic salmon over seasoned rice', price: 8.50, category: 'Nigiri', image_url: 'https://images.unsplash.com/photo-1617196034183-421b4040ed20?w=400&h=300&fit=crop&q=80' },
    { name: 'Dragon Roll', description: 'Shrimp tempura, avocado, cucumber, topped with avocado', price: 16.00, category: 'Rolls', image_url: 'https://images.unsplash.com/photo-1617196034738-26c5c9f9cc27?w=400&h=300&fit=crop&q=80' },
    { name: 'Spicy Tuna Roll', description: 'Fresh tuna, sriracha mayo, cucumber', price: 14.00, category: 'Rolls', image_url: 'https://images.unsplash.com/photo-1617196034183-421b4040ed20?w=400&h=300&fit=crop&q=80' },
    { name: 'Miso Soup', description: 'Classic dashi broth with tofu and wakame', price: 3.50, category: 'Sides', image_url: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&h=300&fit=crop&q=80' },
    { name: 'Edamame', description: 'Steamed salted soybeans', price: 4.00, category: 'Sides', image_url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop&q=80' },
  ],
  'La Placita Boricua': [
    { name: 'Mofongo con Pollo', description: 'Mashed fried plantains with garlic and olive oil, topped with stewed chicken', price: 14.99, category: 'Main', image_url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=300&fit=crop&q=80' },
    { name: 'Pernil (Slow-Roasted Pork)', description: 'Marinated and slow-roasted pork shoulder with crispy skin, served with rice and beans', price: 16.99, category: 'Main', image_url: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=300&fit=crop&q=80' },
    { name: 'Tostones with Garlic Dip', description: 'Twice-fried green plantain slices, golden and crispy, served with mojo garlic sauce', price: 6.99, category: 'Sides', image_url: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400&h=300&fit=crop&q=80' },
    { name: 'Arroz con Pollo', description: 'Saffron rice cooked with seasoned chicken, sofrito, olives, and peppers', price: 13.99, category: 'Main', image_url: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=400&h=300&fit=crop&q=80' },
    { name: 'Tembleque', description: 'Creamy Puerto Rican coconut milk pudding dusted with cinnamon', price: 5.49, category: 'Desserts', image_url: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400&h=300&fit=crop&q=80' },
  ],
  'Burger Hub': [
    { name: 'Classic Smash Burger', description: 'Double smash patty, American cheese, pickles, special sauce', price: 12.99, category: 'Burgers', image_url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop&q=80' },
    { name: 'BBQ Bacon Burger', description: 'Beef patty, crispy bacon, BBQ sauce, onion rings', price: 14.99, category: 'Burgers', image_url: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=400&h=300&fit=crop&q=80' },
    { name: 'Crispy Chicken Sandwich', description: 'Buttermilk fried chicken, coleslaw, pickles', price: 13.49, category: 'Sandwiches', image_url: 'https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=400&h=300&fit=crop&q=80' },
    { name: 'Loaded Fries', description: 'Crispy fries, cheese sauce, jalapenos, bacon bits', price: 7.99, category: 'Sides', image_url: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400&h=300&fit=crop&q=80' },
    { name: 'Vanilla Milkshake', description: 'Thick creamy vanilla shake with whipped cream', price: 5.99, category: 'Drinks', image_url: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400&h=300&fit=crop&q=80' },
  ],
  'Shawarma Station': [
    { name: 'Chicken Shawarma Wrap', description: 'Juicy rotisserie chicken, garlic sauce, pickles in flatbread', price: 11.99, category: 'Wraps', image_url: 'https://images.unsplash.com/photo-1561651823-34feb02250e4?w=400&h=300&fit=crop&q=80' },
    { name: 'Mixed Grill Plate', description: 'Chicken and beef shawarma over rice with salad', price: 16.99, category: 'Plates', image_url: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=300&fit=crop&q=80' },
    { name: 'Hummus & Pita', description: 'Creamy chickpea hummus with warm pita bread', price: 5.99, category: 'Sides', image_url: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=300&fit=crop&q=80' },
    { name: 'Fattoush Salad', description: 'Crispy bread, tomatoes, cucumber, radish, sumac dressing', price: 7.49, category: 'Salads', image_url: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop&q=80' },
  ],
  'Pasta Palace': [
    { name: 'Spaghetti Carbonara', description: 'Pancetta, egg yolk, pecorino, black pepper', price: 17.99, category: 'Pasta', image_url: 'https://images.unsplash.com/photo-1473093226555-0e4d2c6d57f3?w=400&h=300&fit=crop&q=80' },
    { name: 'Margherita Pizza', description: 'San Marzano tomato, fresh mozzarella, basil', price: 15.99, category: 'Pizza', image_url: 'https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=400&h=300&fit=crop&q=80' },
    { name: 'Penne Arrabbiata', description: 'Spicy tomato sauce, garlic, chili flakes', price: 14.99, category: 'Pasta', image_url: 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=400&h=300&fit=crop&q=80' },
    { name: 'Tiramisu', description: 'Classic Italian dessert with mascarpone and espresso', price: 8.99, category: 'Desserts', image_url: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&h=300&fit=crop&q=80' },
  ],
  'Green Bowl': [
    { name: 'Acai Power Bowl', description: 'Acai blend, granola, banana, blueberries, honey', price: 13.99, category: 'Bowls', image_url: 'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=400&h=300&fit=crop&q=80' },
    { name: 'Grilled Chicken Salad', description: 'Mixed greens, grilled chicken, avocado, lemon vinaigrette', price: 14.99, category: 'Salads', image_url: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop&q=80' },
    { name: 'Green Detox Juice', description: 'Spinach, cucumber, apple, ginger, lemon', price: 6.99, category: 'Drinks', image_url: 'https://images.unsplash.com/photo-1610970881699-44a5587cabec?w=400&h=300&fit=crop&q=80' },
    { name: 'Avocado Toast', description: 'Sourdough, smashed avocado, cherry tomatoes, everything bagel spice', price: 11.99, category: 'Breakfast', image_url: 'https://images.unsplash.com/photo-1541519227354-08fa5d50c820?w=400&h=300&fit=crop&q=80' },
  ],
  'Fresh Mart': [
    { name: 'Organic Eggs (12pk)', description: 'Free-range certified organic eggs', price: 6.99, category: 'Dairy & Eggs', image_url: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=400&h=300&fit=crop&q=80' },
    { name: 'Whole Milk (1L)', description: 'Fresh full-fat whole milk', price: 2.49, category: 'Dairy & Eggs', image_url: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&h=300&fit=crop&q=80' },
    { name: 'Mixed Salad Pack', description: 'Pre-washed baby spinach, arugula, and romaine', price: 4.99, category: 'Fresh Food', image_url: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop&q=80' },
    { name: 'Orange Juice (1L)', description: 'Freshly squeezed 100% natural orange juice', price: 4.49, category: 'Beverages', image_url: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400&h=300&fit=crop&q=80' },
    { name: 'Sourdough Bread', description: 'Artisan baked sourdough loaf', price: 5.49, category: 'Bakery & Snacks', image_url: 'https://images.unsplash.com/photo-1585478259715-876acc5be8eb?w=400&h=300&fit=crop&q=80' },
  ],
  'HealthPlus Pharmacy': [
    { name: 'Vitamin C 1000mg (60 tabs)', description: 'High-strength immune support supplement', price: 12.99, category: 'Vitamins', image_url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=300&fit=crop&q=80' },
    { name: 'Pain Relief Tablets (24pk)', description: 'Fast-acting ibuprofen 200mg tablets', price: 6.49, category: 'Pharmacy', image_url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=300&fit=crop&q=80' },
    { name: 'Sunscreen SPF 50', description: 'Broad spectrum UVA/UVB protection, 100ml', price: 14.99, category: 'Beauty', image_url: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400&h=300&fit=crop&q=80' },
    { name: 'Hand Sanitizer 250ml', description: '70% alcohol antibacterial gel', price: 3.99, category: 'Pharmacy', image_url: 'https://images.unsplash.com/photo-1584483766114-2cea6facdf57?w=400&h=300&fit=crop&q=80' },
  ],
}

async function seed() {
  const client = await pool.connect()
  try {
    console.log('Seeding database...')

    // Clear existing data in correct order (FK constraints)
    await client.query('DELETE FROM order_items')
    await client.query('DELETE FROM orders')
    await client.query('DELETE FROM menu_items')
    await client.query('DELETE FROM restaurants')
    console.log('Cleared existing data.')

    // Insert restaurants and their menu items
    for (const r of restaurants) {
      const result = await client.query(
        `INSERT INTO restaurants
           (name, cuisine_type, rating, image_url, owner_name, owner_email,
            owner_phone, address, description, store_type, delivery_fee, delivery_time)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
         RETURNING id`,
        [r.name, r.cuisine_type, r.rating, r.image_url, r.owner_name, r.owner_email,
         r.owner_phone, r.address, r.description, r.store_type, r.delivery_fee, r.delivery_time]
      )
      const restaurantId = result.rows[0].id
      console.log(`  Inserted restaurant: ${r.name} (id: ${restaurantId})`)

      const items = menuItems[r.name] || []
      for (const item of items) {
        await client.query(
          `INSERT INTO menu_items (restaurant_id, name, description, price, category, image_url)
           VALUES ($1,$2,$3,$4,$5,$6)`,
          [restaurantId, item.name, item.description, item.price, item.category, item.image_url]
        )
      }
      console.log(`    Inserted ${items.length} menu items.`)
    }

    // Seed 3 sample orders
    const allRestaurants = await client.query('SELECT id FROM restaurants LIMIT 3')
    const restIds = allRestaurants.rows.map(r => r.id)

    const sampleOrders = [
      {
        restaurant_id: restIds[0],
        customer_name: 'John Smith',
        customer_email: 'john@example.com',
        customer_phone: '+1 555-111-2222',
        delivery_address: '350 5th Ave, New York, NY 10118',
        total_amount: 29.48,
        status: 'delivered',
      },
      {
        restaurant_id: restIds[1],
        customer_name: 'Emily Davis',
        customer_email: 'emily@example.com',
        customer_phone: '+1 555-333-4444',
        delivery_address: '20 W 34th St, New York, NY 10001',
        total_amount: 18.97,
        status: 'on_the_way',
      },
      {
        restaurant_id: restIds[2],
        customer_name: 'Carlos Rivera',
        customer_email: 'carlos@example.com',
        customer_phone: '+1 555-555-6666',
        delivery_address: '1 World Trade Center, New York, NY 10007',
        total_amount: 42.46,
        status: 'preparing',
      },
    ]

    for (const order of sampleOrders) {
      const orderResult = await client.query(
        `INSERT INTO orders
           (customer_name, customer_email, customer_phone, delivery_address, total_amount, status)
         VALUES ($1,$2,$3,$4,$5,$6)
         RETURNING id`,
        [order.customer_name, order.customer_email, order.customer_phone,
         order.delivery_address, order.total_amount, order.status]
      )
      const orderId = orderResult.rows[0].id

      // Get first menu item from the restaurant for the order
      const menuResult = await client.query(
        'SELECT id, name, price FROM menu_items WHERE restaurant_id = $1 LIMIT 2',
        [order.restaurant_id]
      )
      for (const item of menuResult.rows) {
        await client.query(
          `INSERT INTO order_items (order_id, menu_item_id, item_name, quantity, price)
           VALUES ($1,$2,$3,$4,$5)`,
          [orderId, item.id, item.name, 1, item.price]
        )
      }
      console.log(`  Inserted order for ${order.customer_name} (${order.status})`)
    }

    console.log('\nSeed complete.')
  } catch (err) {
    console.error('Seed error:', err.message)
    process.exit(1)
  } finally {
    client.release()
    pool.end()
  }
}

seed()
