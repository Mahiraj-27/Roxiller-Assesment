-- ==============================================================================
-- RateSphere — PostgreSQL Database Schema
-- ==============================================================================

-- Drop tables in reverse dependency order
DROP TABLE IF EXISTS ratings CASCADE;
DROP TABLE IF EXISTS stores CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TYPE IF EXISTS user_role CASCADE;

-- User roles enumeration
CREATE TYPE user_role AS ENUM ('admin', 'user', 'store_owner');

-- ── Users Table ─────────────────────────────────────────────────────────────
CREATE TABLE users (
  id          SERIAL PRIMARY KEY,
  name        VARCHAR(60)  NOT NULL,
  email       VARCHAR(255) NOT NULL UNIQUE,
  password    VARCHAR(255) NOT NULL,
  address     VARCHAR(400) NOT NULL DEFAULT '',
  role        user_role    NOT NULL DEFAULT 'user',
  created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- ── Stores Table ────────────────────────────────────────────────────────────
CREATE TABLE stores (
  id          SERIAL PRIMARY KEY,
  name        VARCHAR(60)  NOT NULL,
  email       VARCHAR(255) NOT NULL UNIQUE,
  address     VARCHAR(400) NOT NULL DEFAULT '',
  owner_id    INT          REFERENCES users(id) ON DELETE SET NULL,
  created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- ── Ratings Table ───────────────────────────────────────────────────────────
CREATE TABLE ratings (
  id          SERIAL PRIMARY KEY,
  user_id     INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  store_id    INT NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  rating      INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  UNIQUE (user_id, store_id)
);

-- ── Performance & Search Indexes ────────────────────────────────────────────
CREATE INDEX idx_users_name    ON users (name);
CREATE INDEX idx_users_email   ON users (email);
CREATE INDEX idx_users_role    ON users (role);

CREATE INDEX idx_stores_name   ON stores (name);
CREATE INDEX idx_stores_email  ON stores (email);

CREATE INDEX idx_ratings_user  ON ratings (user_id);
CREATE INDEX idx_ratings_store ON ratings (store_id);
