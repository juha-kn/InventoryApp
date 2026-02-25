# StockFlow — Inventory Manager

A modern web app for managing retail store inventory. Browse, add, edit, and delete products, and update quantities in real time.

![StockFlow Screenshot](https://github.com/user-attachments/assets/9dd789f1-0e3d-4199-8781-cc6f017a0551)

## Features

- 📦 Browse all products with search and category filtering
- ➕ Add new products with name, SKU, category, price, quantity and description
- ✏️ Edit any product's details
- 🗑️ Delete products with a confirmation prompt
- 🔢 Adjust quantity with ± buttons or direct input
- 📊 Live stats: total products, items in stock, inventory value, and category count
- 🟡 Low stock / out-of-stock badges
- 🗄️ Local JSON database pre-populated with 20 sample products

## Tech Stack

| Layer    | Technology                       |
|----------|----------------------------------|
| Frontend | React + Vite + Tailwind CSS v4   |
| Backend  | Node.js + Express                |
| Database | lowdb (file-based JSON store)    |
| Icons    | Lucide React                     |

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Installation

```bash
# Install all dependencies
npm run install:all
```

### Running the App

Open two terminals:

**Terminal 1 — Backend API (port 3001)**
```bash
npm run start:backend
```

**Terminal 2 — Frontend (port 5173)**
```bash
npm run start:frontend
```

Then open [http://localhost:5173](http://localhost:5173) in your browser.

> The backend will automatically seed the database with 20 products on first run.

## API Endpoints

| Method | Endpoint                       | Description                    |
|--------|--------------------------------|--------------------------------|
| GET    | /api/products                  | List products (search/filter)  |
| POST   | /api/products                  | Create a new product           |
| PUT    | /api/products/:id              | Update a product               |
| PATCH  | /api/products/:id/quantity     | Update quantity only           |
| DELETE | /api/products/:id              | Delete a product               |
| GET    | /api/categories                | List all categories            |
| GET    | /api/stats                     | Get inventory statistics       |

## Project Structure

```
InventoryApp/
├── backend/
│   ├── server.js       # Express API server
│   ├── database.js     # lowdb setup + seed data
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── components/
│   │   │   ├── ProductCard.jsx
│   │   │   ├── ProductForm.jsx
│   │   │   ├── AddProductModal.jsx
│   │   │   ├── EditProductModal.jsx
│   │   │   └── StatsBar.jsx
│   │   └── index.css
│   └── package.json
└── package.json        # Root scripts
```
