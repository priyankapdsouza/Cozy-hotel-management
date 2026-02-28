require('dotenv').config();
const bcrypt = require('bcryptjs');
const db = require('../models');

async function seed() {
  try {
    await db.sequelize.sync({ force: true });

    const adminPassword = await bcrypt.hash('Admin@123', 10);
    await db.User.create({
      name: 'Admin',
      email: 'admin@cozytable.com',
      password: adminPassword,
      role: 'admin'
    });

    const customerPassword = await bcrypt.hash('Customer@1', 10);
    await db.User.create({
      name: 'Test Customer',
      email: 'customer@test.com',
      phone: '9876543210',
      password: customerPassword,
      role: 'customer'
    });

    const categories = await db.Category.bulkCreate([
      { name: 'Appetizers', description: 'Starters and light bites' },
      { name: 'Main Course', description: 'Hearty main dishes' },
      { name: 'Desserts', description: 'Sweet treats' },
      { name: 'Drinks', description: 'Beverages' }
    ]);

    await db.MenuItem.bulkCreate([
      { name: 'Spring Rolls', description: 'Crispy vegetable rolls', price: 150, categoryId: 1 },
      { name: 'Soup of the Day', description: 'Chef special soup', price: 120, categoryId: 1 },
      { name: 'Grilled Chicken', description: 'Herb marinated chicken', price: 350, categoryId: 2 },
      { name: 'Paneer Butter Masala', description: 'Cottage cheese in tomato gravy', price: 280, categoryId: 2 },
      { name: 'Chocolate Brownie', description: 'Warm chocolate dessert', price: 180, categoryId: 3 },
      { name: 'Ice Cream', description: 'Vanilla, chocolate or strawberry', price: 100, categoryId: 3 },
      { name: 'Fresh Juice', description: 'Seasonal fruit juice', price: 80, categoryId: 4 },
      { name: 'Cappuccino', description: 'Espresso with steamed milk', price: 120, categoryId: 4 }
    ]);

    await db.Table.bulkCreate([
      { tableNumber: 'T1', capacity: 2, location: 'Window' },
      { tableNumber: 'T2', capacity: 2, location: 'Window' },
      { tableNumber: 'T3', capacity: 4, location: 'Center' },
      { tableNumber: 'T4', capacity: 4, location: 'Center' },
      { tableNumber: 'T5', capacity: 6, location: 'Private' }
    ]);

    console.log('Seed completed. Admin: admin@cozytable.com / Admin@123');
    console.log('Customer: customer@test.com / Customer@1');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seed();
