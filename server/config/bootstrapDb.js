const fs = require('fs');
const path = require('path');
const { initDatabase, query } = require('./database');
const { seedDatabase } = require('./seedDatabase');

/**
 * Ensures schema exists and seeds initial demo data if tables are missing.
 * @param {boolean} force - Force re-creation and re-seeding
 */
async function bootstrapDb(force = false) {
  try {
    const db = await initDatabase();
    let tablesExist = false;

    if (!force) {
      try {
        const check = await query(`
          SELECT EXISTS (
            SELECT FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_name = 'users'
          );
        `);
        tablesExist = check.rows[0]?.exists === true || check.rows[0]?.exists === 't';
      } catch (e) {
        tablesExist = false;
      }
    }

    if (!tablesExist || force) {
      console.log('🔄 RateSphere: Bootstrapping database schema...');
      const schemaPath = path.resolve(__dirname, 'schema.sql');
      const schemaSql = fs.readFileSync(schemaPath, 'utf-8');

      if (db.isPgLite && db.pgliteInstance) {
        await db.pgliteInstance.exec(schemaSql);
      } else {
        await db.pool.query(schemaSql);
      }
      console.log('✅ RateSphere: Schema migrations applied successfully.');

      console.log('🌱 RateSphere: Seeding default accounts and stores...');
      await seedDatabase(db);
      console.log('✅ RateSphere: Database seeding completed.');

      return { status: 'bootstrapped', message: 'Schema and seed data initialized.' };
    }

    console.log('📦 RateSphere: Database tables exist. Ready.');
    return { status: 'ready', message: 'Database ready.' };
  } catch (error) {
    console.error('❌ RateSphere bootstrap error:', error.message);
    throw error;
  }
}

// Allow standalone execution: node config/bootstrapDb.js
if (require.main === module) {
  bootstrapDb(true)
    .then(() => {
      console.log('Manual bootstrap complete.');
      process.exit(0);
    })
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}

module.exports = bootstrapDb;
