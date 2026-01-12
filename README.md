# ShqipFlix

![ShqipFlix Banner](https://via.placeholder.com/1200x400?text=ShqipFlix+Banner)

A premium movie and TV streaming website built with Next.js 14, Tailwind CSS, and integrated with TMDB for metadata.

## 🚀 Features

- 🎬 **Comprehensive Library**: Access thousands of movies and TV shows via TMDB integration.
- 🔍 **Smart Search**: Real-time search with instant results.
- 📱 **Fully Responsive**: Optimized for desktop, tablet, and mobile devices.
- 🎨 **Modern UI**: Dark-themed, glassmorphic design with smooth animations.
- ⚡ **High Performance**: Built on Next.js 14 with server-side rendering.
- 🔒 **User Accounts**: Watchlists, viewing history, and personalization (requires authentication).

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS, Lucide React
- **Database**: PostgreSQL (via Prisma ORM)
- **Authentication**: NextAuth.js
- **Data Source**: TMDB API

## 📦 Installation

### Prerequisites

- Node.js 18+
- PostgreSQL Database
- TMDB API Key (Get it [here](https://www.themoviedb.org/settings/api))

### Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/shqipflix.git
   cd shqipflix
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment**
   Renamed `.env.example` to `.env` and fill in your details:
   ```bash
   cp .env.example .env
   ```
   
   Update `.env` with your credentials:
   - `DATABASE_URL`: Your PostgreSQL connection string.
   - `NEXTAUTH_SECRET`: Generate using `openssl rand -base64 32`.
   - `NEXT_PUBLIC_TMDB_API_KEY`: Your TMDB API Key.

4. **Setup Database**
   ```bash
   npx prisma generate
   npx prisma migrate deploy
   ```

5. **Run Development Server**
   ```bash
   npm run dev
   ```

   Visit `http://localhost:3000` to view the app.

## 🚀 Deployment

### Deploy on Vercel

The easiest way to deploy ShqipFlix is to use the [Vercel Platform](https://vercel.com/new).

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fyourusername%2Fshqipflix&env=DATABASE_URL,NEXTAUTH_SECRET,NEXTAUTH_URL,NEXT_PUBLIC_TMDB_API_KEY)

1. Click the button above to clone and deploy.
2. Enter your environment variables when prompted.
3. Your app will be live in minutes!

### Manual Deployment (VPS)

For deploying on a Virtual Private Server (VPS), please refer to our [Deployment Guide](DEPLOYMENT.md).

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
