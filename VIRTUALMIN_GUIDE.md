# Virtualmin Installation Guide for ShqipFlix

This guide covers the specific steps to host ShqipFlix on your Virtualmin server.

## Prerequisites

1.  **Virtualmin Server**: Ensure you have a virtual server created for your domain.
2.  **Node.js**: Install Node.js (v18 or higher).
3.  **MariaDB/MySQL**: Ensure MariaDB is installed and running on your server.
4.  **PM2**: Install PM2 globally: `npm install -g pm2`.
5.  **Upstash Redis**: An account and a database created at [upstash.com](https://upstash.com).

## Step 1: Database Setup in Virtualmin

1.  Go to **Virtualmin** -> **Edit Databases**.
2.  Click **Create a new database**.
3.  Choose **MySQL** as the type (which is used for MariaDB).
4.  Name it `shqipflix`.
5.  Virtualmin automatically creates a user with permissions for this database. Note down the credentials.

## Step 2: Upload and Install

1.  Upload your files to `/home/yourdomain/public_html`.
2.  SSH into your server and navigate to that directory.
3.  Install dependencies:
    ```bash
    npm install
    ```

## Step 3: Environment Variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
nano .env
```

Update the following variables:

```env
# Database
DATABASE_URL="mysql://username:password@localhost:3306/shqipflix"

# NextAuth
NEXTAUTH_URL="https://yourdomain.com"
NEXTAUTH_SECRET="your-secret-here" # Generate with: openssl rand -base64 32

# Upstash Redis
UPSTASH_REDIS_REST_URL="https://your-redisl-url.upstash.io"
UPSTASH_REDIS_REST_TOKEN="your_upstash_token"

# TMDB API
NEXT_PUBLIC_TMDB_API_KEY="your-tmdb-api-key"

NODE_ENV="production"
```

## Step 4: Build

Run the following commands to prepare the application:

```bash
npx prisma generate
npx prisma migrate deploy
npm run build
```

## Step 5: Start with PM2

The project includes an `ecosystem.config.js`. Use it to start the app:

```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

## Step 6: Proxy Configuration

You need to tell Virtualmin to forward traffic from the web server (Apache/Nginx) to your Node.js application (running on port 3000).

### For Nginx:
Navigate to **Server Configuration** -> **Nginx Website Configuration** -> **Edit Configuration File** and add:

```nginx
location / {
    proxy_pass http://localhost:3000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
}
```

### For Apache:
Navigate to **Server Configuration** -> **Edit Proxy Website** and set the proxy to `http://localhost:3000`.

## Step 7: SSL (Let's Encrypt)

1.  Go to **Server Configuration** -> **SSL Certificate**.
2.  Select the **Let's Encrypt** tab.
3.  Click **Request Certificate**.

---
**Verification**: Visit `https://yourdomain.com` to see your site live!
