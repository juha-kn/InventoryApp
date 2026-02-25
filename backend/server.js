const express = require('express');
const cors = require('cors');
const { db } = require('./database');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// GET all products (with optional search/filter)
app.get('/api/products', (req, res) => {
  try {
    const { search, category } = req.query;
    let products = db.get('products').value();

    if (search) {
      const term = search.toLowerCase();
      products = products.filter(p =>
        p.name.toLowerCase().includes(term) ||
        p.sku.toLowerCase().includes(term) ||
        (p.description && p.description.toLowerCase().includes(term))
      );
    }
    if (category && category !== 'all') {
      products = products.filter(p => p.category === category);
    }

    products = products.slice().sort((a, b) => a.name.localeCompare(b.name));
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET a single product
app.get('/api/products/:id', (req, res) => {
  try {
    const product = db.get('products').find({ id: req.params.id }).value();
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET all categories
app.get('/api/categories', (req, res) => {
  try {
    const products = db.get('products').value();
    const categories = [...new Set(products.map(p => p.category))].sort();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create a new product
app.post('/api/products', (req, res) => {
  try {
    const { name, sku, category, quantity, price, description } = req.body;
    if (!name || !sku || !category || quantity === undefined || price === undefined) {
      return res.status(400).json({ error: 'name, sku, category, quantity, and price are required' });
    }

    // Check for duplicate SKU
    const existing = db.get('products').find({ sku }).value();
    if (existing) {
      return res.status(409).json({ error: 'A product with this SKU already exists' });
    }

    const nextId = db.get('nextId').value();
    const now = new Date().toISOString();
    const product = {
      id: String(nextId),
      name,
      sku,
      category,
      quantity: Number(quantity),
      price: Number(price),
      description: description || '',
      created_at: now,
      updated_at: now
    };

    db.get('products').push(product).write();
    db.set('nextId', nextId + 1).write();

    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH update product quantity
app.patch('/api/products/:id/quantity', (req, res) => {
  try {
    const { quantity } = req.body;
    if (quantity === undefined || Number(quantity) < 0) {
      return res.status(400).json({ error: 'quantity must be a non-negative number' });
    }

    const product = db.get('products').find({ id: req.params.id }).value();
    if (!product) return res.status(404).json({ error: 'Product not found' });

    db.get('products')
      .find({ id: req.params.id })
      .assign({ quantity: Number(quantity), updated_at: new Date().toISOString() })
      .write();

    const updated = db.get('products').find({ id: req.params.id }).value();
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT update a product
app.put('/api/products/:id', (req, res) => {
  try {
    const { name, sku, category, quantity, price, description } = req.body;
    if (!name || !sku || !category || quantity === undefined || price === undefined) {
      return res.status(400).json({ error: 'name, sku, category, quantity, and price are required' });
    }

    const product = db.get('products').find({ id: req.params.id }).value();
    if (!product) return res.status(404).json({ error: 'Product not found' });

    // Check for duplicate SKU (excluding current product)
    const skuConflict = db.get('products').find(p => p.sku === sku && p.id !== req.params.id).value();
    if (skuConflict) {
      return res.status(409).json({ error: 'A product with this SKU already exists' });
    }

    db.get('products')
      .find({ id: req.params.id })
      .assign({ name, sku, category, quantity: Number(quantity), price: Number(price), description: description || '', updated_at: new Date().toISOString() })
      .write();

    const updated = db.get('products').find({ id: req.params.id }).value();
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE a product
app.delete('/api/products/:id', (req, res) => {
  try {
    const product = db.get('products').find({ id: req.params.id }).value();
    if (!product) return res.status(404).json({ error: 'Product not found' });

    db.get('products').remove({ id: req.params.id }).write();
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET stats
app.get('/api/stats', (req, res) => {
  try {
    const products = db.get('products').value();
    const stats = {
      total_products: products.length,
      total_items: products.reduce((sum, p) => sum + p.quantity, 0),
      total_value: products.reduce((sum, p) => sum + p.quantity * p.price, 0),
      total_categories: new Set(products.map(p => p.category)).size
    };
    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Inventory API running on http://localhost:${PORT}`);
});
