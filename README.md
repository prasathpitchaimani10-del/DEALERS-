# The Curated Store

A full-stack e-commerce web application with separate User and Admin portals. Built with React.js, Tailwind CSS, Node.js, Express.js, and MongoDB.

## Tech Stack

| Layer      | Technology                     |
|------------|--------------------------------|
| Frontend   | React.js (Vite)                |
| Styling    | Tailwind CSS                   |
| Backend    | Node.js + Express.js           |
| Database   | MongoDB (Mongoose ODM)         |
| Auth       | JWT (JSON Web Tokens)          |
| Deployment | Vercel                         |

## Features

### User Portal
- Registration and Login with JWT authentication
- Browse products with search, category filters, and sorting
- Individual product detail pages
- Shopping cart with real-time updates
- Checkout with shipping address and Cash on Delivery
- Order confirmation with order tracking
- View order history with status timeline

### Admin Portal
- Dashboard with revenue, orders, customers, and product stats
- Add, edit, and delete products with image upload
- View and manage all orders with status updates
- View registered customer list

## Getting Started

### Prerequisites
- Node.js (v18 or later)
- MongoDB (local or MongoDB Atlas)

### 1. Clone and Install

```bash
# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

### 2. Configure Environment

Create a `.env` file in the `server/` directory:

```
MONGODB_URI=mongodb://localhost:27017/the-curated-store
JWT_SECRET=your_secret_key_here
NODE_ENV=development
PORT=5000
CLIENT_URL=http://localhost:5173
```

### 3. Seed the Database

```bash
cd server
npm run seed
```

This creates:
- **Admin:** admin@thecuratedstore.com / Admin@12345
- **User:** priya@example.com / User@12345
- **User:** rahul@example.com / User@12345
- 12 sample products across 6 categories

### 4. Run Development Servers

```bash
# Terminal 1 - Backend
cd server
npm run dev

# Terminal 2 - Frontend
cd client
npm run dev
```

The frontend runs on `http://localhost:5173` and proxies API calls to the backend on port 5000.

## Project Structure

```
the-curated-store/
  client/                     React frontend
    src/
      components/common/      Navbar, Footer, Loader, ProtectedRoute
      context/                AuthContext, CartContext
      layouts/                UserLayout, AdminLayout
      pages/user/             All user-facing pages
      pages/admin/            All admin-facing pages
      services/               Axios API service
      utils/                  Formatters, constants
  server/                     Express backend
    config/                   Database connection
    controllers/              Auth, Product, Cart, Order, User
    middleware/               JWT auth, error handler, file upload
    models/                   Mongoose schemas
    routes/                   API route definitions
    seed.js                   Database seeder
```

## Deployment on Vercel

1. Push the project to a GitHub repository
2. Import the repository on Vercel
3. Set the following environment variables in Vercel dashboard:
   - `MONGODB_URI` (use MongoDB Atlas connection string)
   - `JWT_SECRET`
   - `NODE_ENV=production`
   - `CLIENT_URL` (your Vercel deployment URL)
4. Deploy

## License

This project is for educational purposes.
