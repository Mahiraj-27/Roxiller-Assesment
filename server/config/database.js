const { Pool } = require('pg');
const { PGlite } = require('@electric-sql/pglite');
const fs = require('fs');
const path = require('path');
const environment = require('./environment');

let activeEngine = null;
let activePool = null;
let isPgLite = false;

// Initialize the active database connection
const initDatabase = async () => {
  if (activeEngine) return activeEngine;

  // 1. If DATABASE_URL is provided (Render / Supabase / Neon / Cloud PG)
  if (environment.databaseUrl) {
    try {
      console.log('🔗 Connecting to remote PostgreSQL via DATABASE_URL...');
      const pool = new Pool({
        connectionString: environment.databaseUrl,
        ssl: environment.databaseUrl.includes('localhost') ? false : { rejectUnauthorized: false },
      });

      // Quick test query to verify connectivity
      await pool.query('SELECT 1');
      console.log('📦 Connected to PostgreSQL successfully (Pool mode)');
      activePool = pool;
      activeEngine = {
        query: (text, params) => pool.query(text, params),
        pool,
        isPgLite: false,
      };
      return activeEngine;
    } catch (err) {
      console.warn('⚠️ Remote PostgreSQL connection failed:', err.message);
    }
  }

  // 2. Try local PostgreSQL if host & port specified
  if (environment.nodeEnv === 'development') {
    try {
      const localPool = new Pool({
        host: environment.db.host,
        port: environment.db.port,
        database: environment.db.name,
        user: environment.db.user,
        password: environment.db.password,
        connectionTimeoutMillis: 1500,
      });

      await localPool.query('SELECT 1');
      console.log('📦 Connected to local PostgreSQL on port ' + environment.db.port);
      activePool = localPool;
      activeEngine = {
        query: (text, params) => localPool.query(text, params),
        pool: localPool,
        isPgLite: false,
      };
      return activeEngine;
    } catch (err) {
      // Local PG not running, proceed to fallback
    }
  }

  // 3. Fallback: WebAssembly PostgreSQL (PGlite)
  console.log('⚡ Initializing embedded PostgreSQL (PGlite engine) for zero-dependency execution...');
  const pglite = new PGlite();
  isPgLite = true;

  // Wrap query to return standard pg response shape: { rows, rowCount }
  const pgliteQuery = async (text, params = []) => {
    const res = await pglite.query(text, params);
    return {
      rows: res.rows || [],
      rowCount: res.affectedRows !== undefined ? res.affectedRows : (res.rows ? res.rows.length : 0),
    };
  };

  const poolAdapter = {
    query: pgliteQuery,
    on: () => {},
    end: async () => {},
  };

  activePool = poolAdapter;
  activeEngine = {
    query: pgliteQuery,
    pool: poolAdapter,
    isPgLite: true,
    pgliteInstance: pglite,
  };

  return activeEngine;
};

// Export synchronous proxy functions so callers can simply require('./database')
const query = async (text, params) => {
  const db = await initDatabase();
  return db.query(text, params);
};

const getPool = async () => {
  const db = await initDatabase();
  return db.pool;
};

module.exports = {
  initDatabase,
  query,
  get pool() {
    return activePool || {
      query: (text, params) => query(text, params),
    };
  },
  get isPgLite() {
    return isPgLite;
  },
};
