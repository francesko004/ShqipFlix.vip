# Deployment Guide

## Option 1: Vercel (Recommended)

The easiest way to deploy ShqipFlix is to use the [Vercel Platform](https://vercel.com/new).

### Prerequisites
- A Vercel Account
- A PostgreSQL Database (e.g., from [Vercel Storage](https://vercel.com/storage/postgres), [Neon](https://neon.tech), [Supabase](https://supabase.com), or [Railway](https://railway.app)).

### Steps

1. **Push your code to GitHub/GitLab/Bitbucket.**
2. **Import the project** into Vercel.
3. **Configure Environment Variables** in the Vercel dashboard:
    - `DATABASE_URL`: Your PostgreSQL connection string.
    - `NEXTAUTH_SECRET`: A random string (generate with `openssl rand -base64 32`).
    - `NEXTAUTH_URL`: Your Vercel deployment URL (e.g. `https://your-project.vercel.app`). *Note: Vercel automatically sets `VERCEL_URL`, but NextAuth often needs `NEXTAUTH_URL` explicitly set to the canonical URL.*
    - `NEXT_PUBLIC_TMDB_API_KEY`: Your TMDB API Key.
4. **Deploy**. Vercel will automatically detect `next.config.mjs` and build the project.

### Database Migration on Vercel
After deployment, strictly speaking, you should run migrations. Vercel automatically runs the build command, but you may need to run migrations either via the Vercel dashboard (Settings -> General -> Build & Development Settings -> Build Command) or manually from your local machine connecting to the remote DB.

**Recommended Build Command Override:**
```bash
npx prisma generate && npx prisma migrate deploy && next build
```
Adding this to your Vercel Build Command settings ensures migrations run on every deploy.

---

## Option 2: Virtualmin / VPS

This guide will walk you through deploying ShqipFlix to your Virtualmin server.

### Prerequisites

- Virtualmin server with Node.js 18+ installed
- PostgreSQL (Recommended) or MySQL database
- Domain name configured in Virtualmin
- SSH access to your server

### Step 1: Database Setup

#### PostgreSQL (Recommended)

```bash
# Create database and user
sudo -u postgres psql
CREATE DATABASE shqipflix;
CREATE USER shqipflix_user WITH ENCRYPTED PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE shqipflix TO shqipflix_user;
\q
```

### Step 2: Upload Application Files

1. **Via FTP/SFTP**: Upload all files to your domain's directory (e.g., `/home/yourdomain/public_html`)
2. **Via Git** (Recommended):
   ```bash
   cd /home/yourdomain/public_html
   git clone your-repository-url .
   ```

### Step 3: Install Dependencies

```bash
cd /home/yourdomain/public_html
npm install --production
```

### Step 4: Configure Environment Variables

Create a `.env.production.local` file in the root directory:

```bash
cp .env.example .env.production.local
nano .env.production.local
```

Update the following variables:

```env
# Database - Use your actual database credentials
DATABASE_URL="postgresql://shqipflix_user:your_secure_password@localhost:5432/shqipflix"

# NextAuth - CRITICAL: Generate a secure secret
NEXTAUTH_URL="https://yourdomain.com"
NEXTAUTH_SECRET="generate-with: openssl rand -base64 32"

# TMDB API
NEXT_PUBLIC_TMDB_API_KEY="your-tmdb-api-key"

# Production settings
NODE_ENV="production"
PORT=3000
```

**Generate NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```

### Step 5: Database Migration

Run Prisma migrations to set up your database schema:

```bash
npx prisma generate
npx prisma migrate deploy
```

### Step 6: Build the Application

```bash
npm run build
```

This will create an optimized production build in `.next/standalone`.

### Step 7: Install PM2 (Process Manager)

```bash
npm install -g pm2
```

### Step 8: Create Logs Directory

```bash
mkdir -p logs
```

### Step 9: Start the Application

```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

Follow the instructions from `pm2 startup` to enable PM2 to start on system boot.

### Step 10: Configure Nginx/Apache Reverse Proxy

#### For Nginx (in Virtualmin):

Add this to your Nginx configuration:

```nginx
location / {
    proxy_pass http://localhost:3000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```

#### For Apache (in Virtualmin):

Enable required modules:
```bash
sudo a2enmod proxy proxy_http
```

Add to your Apache configuration:
```apache
ProxyPreserveHost On
ProxyPass / http://localhost:3000/
ProxyPassReverse / http://localhost:3000/
```

### Step 11: SSL Certificate

Use Virtualmin's Let's Encrypt integration:
1. Go to Server Configuration → SSL Certificate
2. Click "Let's Encrypt" tab
3. Request certificate for your domain

### Verification

1. Visit your domain: `https://yourdomain.com`
2. Check PM2 status: `pm2 status`
3. View logs: `pm2 logs shqipflix`
