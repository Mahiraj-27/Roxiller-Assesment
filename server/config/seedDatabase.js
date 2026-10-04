const bcrypt = require('bcryptjs');

/**
 * Seed database with test users, sample stores, and demo ratings.
 * @param {object} poolOrDb - PostgreSQL pool or PGlite instance
 */
async function seedDatabase(poolOrDb) {
  try {
    // Clear existing data respecting foreign keys
    await poolOrDb.query('DELETE FROM ratings');
    await poolOrDb.query('DELETE FROM stores');
    await poolOrDb.query('DELETE FROM users');

    const hashPassword = async (pwd) => bcrypt.hash(pwd, 10);

    const adminHash = await hashPassword('Admin@123');
    const owner1Hash = await hashPassword('Owner@123');
    const owner2Hash = await hashPassword('Owner@123');
    const user1Hash = await hashPassword('User@1234');
    const user2Hash = await hashPassword('User@1234');

    // Insert Default Accounts
    const usersResult = await poolOrDb.query(
      `INSERT INTO users (name, email, password, address, role) VALUES
        ('System Administrator Account', 'admin@storerating.com', $1, '123 Admin Plaza, Silicon Valley, CA', 'admin'),
        ('Store Owner One Account', 'owner@store1.com', $2, '456 Retail Boulevard, Commerce District, NY', 'store_owner'),
        ('Store Owner Two Account', 'owner@store2.com', $3, '789 Marketplace Way, Downtown Hub, WA', 'store_owner'),
        ('Regular User One Account', 'user@example.com', $4, '321 Residential Court, Metro City, IL', 'user'),
        ('Regular User Two Account', 'user2@example.com', $5, '654 Consumer Avenue, Innovation Park, TX', 'user')
      RETURNING id, name, email, role`,
      [adminHash, owner1Hash, owner2Hash, user1Hash, user2Hash]
    );

    const users = usersResult.rows;
    console.log(`✅ RateSphere: Seeded ${users.length} default users`);

    const owner1 = users.find((u) => u.email === 'owner@store1.com');
    const owner2 = users.find((u) => u.email === 'owner@store2.com');
    const user1 = users.find((u) => u.email === 'user@example.com');
    const user2 = users.find((u) => u.email === 'user2@example.com');

    // Insert Default Stores
    const storesResult = await poolOrDb.query(
      `INSERT INTO stores (name, email, address, owner_id) VALUES
        ('TechMart Electronics Store', 'contact@techmart.com', '100 Tech Park, Silicon Valley, CA', $1),
        ('Fresh Grocers Supermarket', 'hello@freshgrocers.com', '200 Organic Way, Commerce District, NY', $2),
        ('City Books And Stationery', 'info@citybooks.com', '300 Literature Lane, Academic Circle, MA', NULL)
      RETURNING id, name`,
      [owner1.id, owner2.id]
    );

    const stores = storesResult.rows;
    console.log(`✅ RateSphere: Seeded ${stores.length} default stores`);

    // Insert Sample Ratings
    const ratingsResult = await poolOrDb.query(
      `INSERT INTO ratings (user_id, store_id, rating) VALUES
        ($1, $3, 4),
        ($1, $4, 5),
        ($1, $5, 3),
        ($2, $3, 5),
        ($2, $4, 4)
      RETURNING id`,
      [user1.id, user2.id, stores[0].id, stores[1].id, stores[2].id]
    );

    console.log(`✅ RateSphere: Seeded ${ratingsResult.rowCount || ratingsResult.rows.length} sample ratings`);
    return { users, stores, ratingsCount: ratingsResult.rowCount || ratingsResult.rows.length };
  } catch (error) {
    console.error('❌ Error seeding database:', error.message);
    throw error;
  }
}

// Allow direct execution: node config/seedDatabase.js
if (require.main === module) {
  const { pool } = require('./database');
  seedDatabase(pool)
    .then(() => {
      console.log('Database seeding complete.');
      process.exit(0);
    })
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}

module.exports = { seedDatabase };
