const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const adapter = new FileSync(path.join(__dirname, 'inventory.json'));
const db = low(adapter);
const startupTime = new Date().toISOString();

const buildSeedProducts = () => {
  const now = new Date().toISOString();
  return [
    { id: '1', name: 'Apple iPhone 15 Pro', sku: 'ELEC-001', category: 'Electronics', quantity: 12, price: 999.99, description: 'Latest iPhone with titanium design and A17 Pro chip', created_at: now, updated_at: now },
    { id: '2', name: 'Samsung 4K Smart TV 55"', sku: 'ELEC-002', category: 'Electronics', quantity: 8, price: 649.99, description: '55-inch QLED display with smart features', created_at: now, updated_at: now },
    { id: '3', name: 'Sony WH-1000XM5 Headphones', sku: 'ELEC-003', category: 'Electronics', quantity: 25, price: 349.99, description: 'Industry-leading noise canceling wireless headphones', created_at: now, updated_at: now },
    { id: '4', name: 'Dell XPS 15 Laptop', sku: 'ELEC-004', category: 'Electronics', quantity: 6, price: 1499.99, description: 'High-performance laptop with OLED display', created_at: now, updated_at: now },
    { id: '5', name: 'Nike Air Max 270', sku: 'SHOE-001', category: 'Footwear', quantity: 40, price: 129.99, description: 'Comfortable running shoes with Air Max cushioning', created_at: now, updated_at: now },
    { id: '6', name: 'Adidas Ultraboost 23', sku: 'SHOE-002', category: 'Footwear', quantity: 35, price: 189.99, description: 'Premium running shoes with Boost midsole', created_at: now, updated_at: now },
    { id: '7', name: "Levi's 501 Original Jeans", sku: 'CLTH-001', category: 'Clothing', quantity: 60, price: 69.99, description: 'Classic straight fit jeans in medium wash', created_at: now, updated_at: now },
    { id: '8', name: 'North Face Puffer Jacket', sku: 'CLTH-002', category: 'Clothing', quantity: 20, price: 249.99, description: 'Warm and lightweight winter jacket', created_at: now, updated_at: now },
    { id: '9', name: 'Instant Pot Duo 7-in-1', sku: 'KITC-001', category: 'Kitchen', quantity: 15, price: 89.99, description: 'Multi-use pressure cooker for fast meals', created_at: now, updated_at: now },
    { id: '10', name: 'Vitamix Professional Blender', sku: 'KITC-002', category: 'Kitchen', quantity: 10, price: 449.99, description: 'High-performance blender for smoothies and soups', created_at: now, updated_at: now },
    { id: '11', name: 'LEGO Star Wars Millennium Falcon', sku: 'TOYS-001', category: 'Toys', quantity: 5, price: 849.99, description: '7,541-piece Ultimate Collector Series set', created_at: now, updated_at: now },
    { id: '12', name: 'Kindle Paperwhite', sku: 'BOOK-001', category: 'Books & Media', quantity: 30, price: 139.99, description: 'Waterproof e-reader with 6.8" display', created_at: now, updated_at: now },
    { id: '13', name: 'Dyson V15 Detect Vacuum', sku: 'HOME-001', category: 'Home & Garden', quantity: 9, price: 749.99, description: 'Cordless vacuum with laser dust detection', created_at: now, updated_at: now },
    { id: '14', name: 'Weber Spirit II Gas Grill', sku: 'HOME-002', category: 'Home & Garden', quantity: 7, price: 499.99, description: '3-burner propane grill for outdoor cooking', created_at: now, updated_at: now },
    { id: '15', name: 'Patagonia Better Sweater Fleece', sku: 'CLTH-003', category: 'Clothing', quantity: 28, price: 139.99, description: 'Versatile fleece jacket for outdoor activities', created_at: now, updated_at: now },
    { id: '16', name: 'Canon EOS R50 Camera', sku: 'ELEC-005', category: 'Electronics', quantity: 11, price: 679.99, description: 'Mirrorless camera with 24.2MP APS-C sensor', created_at: now, updated_at: now },
    { id: '17', name: 'Fitbit Charge 6', sku: 'ELEC-006', category: 'Electronics', quantity: 22, price: 159.99, description: 'Advanced fitness tracker with GPS and health metrics', created_at: now, updated_at: now },
    { id: '18', name: 'The Ordinary Skincare Set', sku: 'BEAU-001', category: 'Beauty', quantity: 50, price: 49.99, description: 'Complete skincare routine with serums and moisturizers', created_at: now, updated_at: now },
    { id: '19', name: 'Yeti Rambler 30oz Tumbler', sku: 'HOME-003', category: 'Home & Garden', quantity: 45, price: 44.99, description: 'Vacuum insulated stainless steel tumbler', created_at: now, updated_at: now },
    { id: '20', name: 'Moleskine Classic Notebook', sku: 'STAT-001', category: 'Stationery', quantity: 80, price: 24.99, description: 'Hard cover ruled notebook, A5 size', created_at: now, updated_at: now }
  ];
};

// Default data with 20 pre-populated products
db.defaults({
  products: buildSeedProducts(),
  nextId: 21
}).write();

const startupHealth = {
  startupTime,
  reseededProducts: false,
  nextIdRepaired: false,
};

const products = db.get('products').value();
if (!Array.isArray(products) || products.length === 0) {
  const seedProducts = buildSeedProducts();
  db.set('products', seedProducts).write();
  db.set('nextId', seedProducts.length + 1).write();
  startupHealth.reseededProducts = true;
  startupHealth.nextIdRepaired = true;
} else {
  const maxId = products.reduce((max, product) => {
    const numericId = Number(product.id);
    return Number.isFinite(numericId) ? Math.max(max, numericId) : max;
  }, 0);
  const nextId = db.get('nextId').value();
  const safeNextId = Math.max(maxId + 1, Number(nextId) || 1);
  if (Number(nextId) !== safeNextId) {
    db.set('nextId', safeNextId).write();
    startupHealth.nextIdRepaired = true;
  }
}

const getDbHealth = () => {
  const currentProducts = db.get('products').value();
  return {
    ...startupHealth,
    productCount: Array.isArray(currentProducts) ? currentProducts.length : 0,
    nextId: Number(db.get('nextId').value()) || 1,
  };
};

module.exports = { db, uuidv4, getDbHealth };
