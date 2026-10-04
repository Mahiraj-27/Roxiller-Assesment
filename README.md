# 🌐 RateSphere — Store Ratings & Business Intelligence Platform

> Built for the **Roxiler Systems Full Stack Developer Intern Assessment**.  
> **RateSphere** is a production-ready, full-stack web application designed for transparent store ratings, merchant performance tracking, and role-governed administrative management.

---

## 📋 Table of Contents
1. [Platform Overview & Features](#-platform-overview--features)
2. [Architecture & Technology Stack](#-architecture--technology-stack)
3. [Repository Folder Structure](#-repository-folder-structure)
4. [Role-Based Access Control & Demo Accounts](#-role-based-access-control--demo-accounts)
5. [Local Development Setup](#-local-development-setup)
6. [Environment Variables Reference](#-environment-variables-reference)
7. [REST API Endpoints Specification](#-rest-api-endpoints-specification)
8. [Cloud Deployment Guide (Render & Vercel)](#-cloud-deployment-guide)
9. [CORS & Security Configuration](#-cors--security-configuration)
10. [Troubleshooting & FAQ](#-troubleshooting--faq)

---

## 🌟 Platform Overview & Features

RateSphere unifies consumers, retail merchants, and system administrators into a single intuitive ecosystem:

### 👑 1. System Administrator
- **KPI Analytics Dashboard**: Live metrics tracking Total Users, Total Stores, and Total Submitted Ratings.
- **User Management Directory**: Search users by name, email, or address; filter by role (`admin`, `store_owner`, `user`); sort by table columns; inspect full user profiles (including assigned store and average rating for store owners); register new users directly.
- **Store Catalog Management**: Search and sort store records; inspect community rating averages and total reviews; register new retail stores and assign verified store owners.

### 👤 2. Normal Consumer
- **Store Exploration**: Browse all registered stores with instant search by store name or address.
- **Dynamic Sorting**: Order stores alphabetically (A–Z, Z–A) or by rating score (Highest to Lowest, Lowest to Highest).
- **Interactive Rating Engine**: Submit or update 1-to-5 star ratings with live star hover preview, instant PostgreSQL upsert, and immediate feedback.
- **Rating Visibility**: View both community average rating and individual personal submitted rating.

### 🏬 3. Store Owner
- **Merchant Hero Overview**: Inspect overall average star rating badge, review count, and physical store entity ID.
- **Customer Ratings Ledger**: View detailed customer review history with customer name, contact email, submitted star rating, and timestamp with sorting and pagination.

### 🔒 4. All Users
- **Change Password**: Update credentials securely with password complexity enforcement.
- **Dual-Token Security**: Short-lived JWT access tokens in memory and secure httpOnly refresh tokens.

---

## 🛠️ Architecture & Technology Stack

| Layer | Technology | Key Capabilities |
|---|---|---|
| **Backend API** | Node.js, Express.js | REST architecture, modular routing, rate limiting, helmet security |
| **Database** | PostgreSQL (`pg`), PGlite WASM | Dual-engine: standard cloud PostgreSQL with zero-dependency embedded PGlite fallback |
| **Validation** | Zod | Strict schema validation for body payloads with structured field errors |
| **Authentication** | JWT, bcryptjs | In-memory Bearer token + httpOnly refresh token cookie |
| **Frontend SPA** | React 19, Vite 6, React Router v7 | Modern component architecture, declarative client-side routing |
| **State Management** | Redux Toolkit | Centralized authentication slice with persistent session cache |
| **Styling & UI** | CSS3 Design Tokens, React Icons | High-contrast black typography, restrained palette, mobile-responsive |
| **Notifications** | React Hot Toast | Real-time interactive toast feedback |

---

## 📁 Repository Folder Structure

```
RateSphere/
├── client/                     # Frontend Single Page Application (React + Vite)
│   ├── public/                 # Static assets & SVG favicon
│   ├── src/
│   │   ├── components/         # Reusable UI components (Navbar, Footer, RatingStars, Modals)
│   │   ├── pages/              # Route view pages
│   │   │   ├── admin/          # AdminDashboard, AdminUsersPage, AdminStoresPage
│   │   │   ├── owner/          # OwnerDashboard
│   │   │   └── user/           # UserDashboard
│   │   ├── services/           # Axios API client modules
│   │   ├── store/              # Redux Toolkit store & auth slice
│   │   ├── App.jsx             # Router definition & route guards
│   │   ├── index.css           # Modern editorial design system stylesheet
│   │   └── main.jsx            # React root bootstrap
│   ├── package.json
│   ├── vercel.json             # Vercel SPA rewrite configuration
│   └── vite.config.js
│
├── server/                     # Backend REST API (Express + PostgreSQL)
│   ├── config/
│   │   ├── database.js         # Dual-engine connection manager (pg.Pool / PGlite)
│   │   ├── environment.js      # Environment variable parser
│   │   ├── schema.sql          # PostgreSQL DDL migrations
│   │   ├── seedDatabase.js     # Test account and catalog seed script
│   │   └── bootstrapDb.js      # Automatic initialization and seed runner
│   ├── controllers/            # Request handlers (auth, admin, user, owner)
│   ├── middleware/             # Auth JWT guard, role checker, validation, error handler
│   ├── queries/                # Parameterized SQL query abstractions
│   ├── routes/                 # Express route definitions
│   ├── services/               # Business logic layer
│   ├── tests/                  # Automated integration tests (Jest + Supertest)
│   ├── utils/                  # ApiError and JWT token utilities
│   ├── validators/             # Zod validation schemas
│   ├── index.js                # Express app entry point
│   └── package.json
│
├── .env.example                # Sample backend environment configuration
├── .gitignore                  # Git exclusions (.env, node_modules, dist, logs)
└── README.md                   # Project documentation & deployment manual
```

---

## 🔑 Role-Based Access Control & Demo Accounts

The database comes pre-seeded with ready-to-test reviewer credentials:

| Role | Email | Password | Scope & Permissions |
|---|---|---|---|
| 👑 **System Admin** | `admin@storerating.com` | `Admin@123` | System metrics, user directory, store catalog, add user/store |
| 🏬 **Store Owner 1** | `owner@store1.com` | `Owner@123` | Owns *TechMart Electronics Store*, customer ratings ledger |
| 🏬 **Store Owner 2** | `owner@store2.com` | `Owner@123` | Owns *Fresh Grocers Supermarket*, customer ratings ledger |
| 👤 **Normal Consumer 1**| `user@example.com` | `User@1234` | Browse stores, submit & modify star ratings |
| 👤 **Normal Consumer 2**| `user2@example.com` | `User@1234` | Browse stores, submit & modify star ratings |

*(Note: The login page includes 1-click quick-fill buttons to test any role instantly)*

---

## 🚀 Local Development Setup

### Prerequisites
- **Node.js**: v18 or later (v20+ recommended)
- **npm**: v9 or later
- *(Optional)* **PostgreSQL**: If running an external database. If PostgreSQL is not installed locally, RateSphere automatically activates its built-in embedded WebAssembly PostgreSQL engine (`PGlite`) with zero configuration!

---

### Step 1: Clone the Repository
```bash
git clone https://github.com/Mahiraj-27/Roxiller-Assesment.git
cd Roxiller-Assesment
```

---

### Step 2: Configure Environment Variables

1. Copy `.env.example` to `server/.env`:
```bash
cp .env.example server/.env
```
*(On Windows PowerShell: `Copy-Item .env.example server/.env`)*

2. Copy `client/.env.example` to `client/.env`:
```bash
cp client/.env.example client/.env
```
*(On Windows PowerShell: `Copy-Item client/.env.example client/.env`)*

---

### Step 3: Install & Start Backend Server
```bash
cd server
npm install

# Run automated tests
npm test

# Start the server (auto-bootstraps schema and seeds demo accounts)
npm run dev
# Or: npm start
```
The backend API is now running at `http://localhost:5000`.  
Verify health: `http://localhost:5000/api/health`

---

### Step 4: Install & Start Frontend Client
Open a second terminal window:
```bash
cd client
npm install
npm run dev
```
The client application is now live at `http://localhost:5173`.

---

## ⚙️ Environment Variables Reference

### Backend (`server/.env`)
| Variable | Description | Default / Example |
|---|---|---|
| `PORT` | Port number for the Express server | `5000` |
| `NODE_ENV` | Application environment (`development` / `production`) | `development` |
| `DATABASE_URL` | Full PostgreSQL connection string (Render / Supabase / Neon) | `postgresql://user:pass@host:5432/dbname` |
| `DB_HOST` | Local PostgreSQL host (used when `DATABASE_URL` is omitted) | `localhost` |
| `DB_PORT` | Local PostgreSQL port | `5432` |
| `DB_NAME` | Database name | `ratesphere_db` |
| `DB_USER` | PostgreSQL user | `postgres` |
| `DB_PASSWORD` | PostgreSQL user password | `postgres` |
| `JWT_SECRET` | Secret key used to sign access tokens | Secure random string (min 32 chars) |
| `JWT_EXPIRES_IN` | Access token lifespan | `15m` |
| `JWT_REFRESH_SECRET` | Secret key used to sign refresh tokens | Secure random string (min 32 chars) |
| `JWT_REFRESH_EXPIRES_IN` | Refresh token lifespan | `7d` |
| `CLIENT_URL` | Allowed frontend origin for CORS | `http://localhost:5173` |

### Frontend (`client/.env`)
| Variable | Description | Example |
|---|---|---|
| `VITE_API_URL` | Base endpoint URL for the backend API | `http://localhost:5000/api` |

---

## 📡 REST API Endpoints Specification

### 1. System Health
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/api/health` | Service uptime & database connectivity check | Public |

### 2. Authentication
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `POST` | `/api/auth/signup` | Register a new consumer account | Public |
| `POST` | `/api/auth/login` | Unified authentication for all roles | Public |
| `PUT` | `/api/auth/change-password` | Update current user password | Authenticated |
| `POST` | `/api/auth/logout` | Clear refresh token cookie | Authenticated |

### 3. Administrator (`role: admin`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/api/admin/dashboard` | Real-time counts (users, stores, ratings) | Admin |
| `GET` | `/api/admin/users` | List users with search, role filter, sort, pagination | Admin |
| `POST` | `/api/admin/users` | Register a new user with assigned role | Admin |
| `GET` | `/api/admin/users/:id` | Detailed profile (+ store rating if owner) | Admin |
| `GET` | `/api/admin/stores` | Store catalog with search, sort, pagination | Admin |
| `POST` | `/api/admin/stores` | Register new store with optional owner assignment | Admin |

### 4. Consumer (`role: user`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/api/user/stores` | List stores with average rating & user's submitted rating | Consumer |
| `PUT` | `/api/user/stores/:storeId/rating` | Submit or update store rating (1–5 stars) | Consumer |

### 5. Store Owner (`role: store_owner`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/api/store-owner/dashboard` | Store summary with average rating & total reviews | Store Owner |
| `GET` | `/api/store-owner/ratings` | List of customers who rated the store | Store Owner |

---

## 🌐 Cloud Deployment Guide

Follow these exact steps to deploy **RateSphere** live to production:

### Phase 1: Deploy Backend to Render

1. **Create a Managed PostgreSQL Database on Render**:
   - Log in to your [Render Dashboard](https://dashboard.render.com/).
   - Click **New +** → **PostgreSQL**.
   - Set **Name** to `ratesphere-db`.
   - Select the Free Tier (or preferred tier) and click **Create Database**.
   - Once provisioned, locate the **Internal Database URL** (or **External Database URL** if deploying outside Render). Copy this connection string.

2. **Deploy the Express Web Service**:
   - In Render, click **New +** → **Web Service**.
   - Connect your GitHub repository (`Roxiller-Assesment`).
   - Configure the service settings:
     - **Name**: `ratesphere-api`
     - **Region**: Same region as your PostgreSQL instance
     - **Branch**: `main`
     - **Root Directory**: `server`
     - **Runtime**: `Node`
     - **Build Command**: `npm install`
     - **Start Command**: `npm start`
   - Add the following **Environment Variables**:
     - `DATABASE_URL`: *(Paste your Render PostgreSQL connection string)*
     - `NODE_ENV`: `production`
     - `PORT`: `5000`
     - `JWT_SECRET`: *(A secure 32+ character random string)*
     - `JWT_REFRESH_SECRET`: *(A secure 32+ character random string)*
     - `CLIENT_URL`: `https://<your-app-name>.vercel.app` *(update once frontend is deployed)*
   - Click **Deploy Web Service**.

3. **Verify Database Bootstrapping**:
   - RateSphere automatically detects empty tables on initial boot, applies `schema.sql`, and seeds test accounts!
   - Verify deployment by opening: `https://<your-render-app>.onrender.com/api/health`
   - You should see `{ "success": true, "data": { "status": "healthy", "database": "connected" } }`.

> **Free Tier Note**: Render free-tier web services spin down after 15 minutes of inactivity. When accessed again, the first request may take ~30–50 seconds while the instance spins back up.

---

### Phase 2: Deploy Frontend to Vercel

1. **Import Project to Vercel**:
   - Log in to your [Vercel Dashboard](https://vercel.com/).
   - Click **Add New...** → **Project**.
   - Select your repository (`Roxiller-Assesment`).

2. **Configure Build Settings**:
   - **Framework Preset**: `Vite`
   - **Root Directory**: Click *Edit* and choose `client`.
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

3. **Set Environment Variables**:
   - Add `VITE_API_URL`: `https://<your-render-app>.onrender.com/api`

4. **Deploy**:
   - Click **Deploy**. Vercel will bundle the Vite React application.
   - SPA route rewrites (`client/vercel.json`) ensure direct links such as `/admin`, `/user`, and `/owner` work without 404 errors.

5. **Update Render CORS**:
   - Return to your Render Web Service settings, update `CLIENT_URL` to match your newly generated Vercel domain (e.g. `https://your-project.vercel.app`), and redeploy the backend.

---

## 🔐 CORS & Security Configuration

The Express server implements dynamic CORS origin matching in `server/index.js`:
- Allowed local development URLs: `http://localhost:5173`, `http://localhost:3000`
- Any sub-domain matching `*.vercel.app` is automatically permitted in staging and production.
- Cookie credentials (`credentials: true`) and Bearer Authorization headers are fully supported.
- HTTP security headers are enabled via `helmet()`.
- Express rate limiting prevents brute-force attempts on sensitive endpoints.

---

## 🛠️ Troubleshooting & FAQ

1. **Vercel route refresh shows 404**:
   - Ensure `client/vercel.json` contains the rewrite rule pointing all paths to `/index.html`. This is already configured in the repository.

2. **CORS errors when calling the API from Vercel**:
   - Ensure your backend `CLIENT_URL` variable in Render is set to your exact Vercel URL (e.g., `https://your-app.vercel.app`), without a trailing slash.
   - Note that our backend CORS middleware also permits all `*.vercel.app` domains out of the box.

3. **Signup fails with validation error**:
   - The assessment specification requires strict form validation:
     - **Name**: Must be between 20 and 60 characters long.
     - **Address**: Maximum 400 characters.
     - **Password**: 8 to 16 characters, containing at least 1 uppercase letter and 1 special character.

4. **Testing locally without PostgreSQL installed**:
   - RateSphere includes an automatic fallback to embedded WebAssembly PostgreSQL (`PGlite`). Simply run `npm run dev` in `server` and the database boots in memory instantly!

---

## 📄 License
This project is submitted as an assessment project and is licensed under the ISC License.
