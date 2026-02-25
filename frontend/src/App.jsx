import { useState, useEffect, useCallback } from 'react';
import { Package, Plus, Search, Filter, X, Check, AlertCircle, Trash2 } from 'lucide-react';
import ProductCard from './components/ProductCard';
import AddProductModal from './components/AddProductModal';
import EditProductModal from './components/EditProductModal';
import StatsBar from './components/StatsBar';

const API_BASE = '/api';

function App() {
  const [products, setProducts] = useState([]);
  const [stats, setStats] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [notification, setNotification] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const showNotif = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3500);
  };

  const fetchProducts = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (selectedCategory !== 'all') params.append('category', selectedCategory);
      const res = await fetch(`${API_BASE}/products?${params}`);
      const data = await res.json();
      setProducts(data);
    } catch {
      showNotif('Failed to load products', 'error');
    }
  }, [search, selectedCategory]);

  const fetchStats = async () => {
    try {
      const res = await fetch(`${API_BASE}/stats`);
      const data = await res.json();
      setStats(data);
    } catch {}
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${API_BASE}/categories`);
      const data = await res.json();
      setCategories(data);
    } catch {}
  };

  useEffect(() => {
    Promise.all([fetchProducts(), fetchStats(), fetchCategories()])
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleAddProduct = async (productData) => {
    const res = await fetch(`${API_BASE}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    setShowAddModal(false);
    fetchProducts();
    fetchStats();
    fetchCategories();
    showNotif(`"${data.name}" added successfully!`);
  };

  const handleEditProduct = async (id, productData) => {
    const res = await fetch(`${API_BASE}/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    setEditProduct(null);
    fetchProducts();
    fetchStats();
    fetchCategories();
    showNotif(`"${data.name}" updated successfully!`);
  };

  const handleDeleteProduct = async (id) => {
    const res = await fetch(`${API_BASE}/products/${id}`, { method: 'DELETE' });
    if (!res.ok) {
      showNotif('Failed to delete product', 'error');
      return;
    }
    setDeleteConfirm(null);
    fetchProducts();
    fetchStats();
    fetchCategories();
    showNotif('Product deleted successfully');
  };

  const handleQuantityChange = async (id, newQty) => {
    const res = await fetch(`${API_BASE}/products/${id}/quantity`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ quantity: newQty }),
    });
    if (!res.ok) return;
    const updated = await res.json();
    setProducts(prev => prev.map(p => p.id === id ? updated : p));
    fetchStats();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-indigo-600 rounded-lg flex items-center justify-center">
                <Package className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">StockFlow</h1>
                <p className="text-xs text-gray-500 hidden sm:block">Inventory Manager</p>
              </div>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Add Product</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Stats Bar */}
        {stats && <StatsBar stats={stats} />}

        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, SKU, or description..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="pl-10 pr-8 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none min-w-[180px]"
            >
              <option value="all">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full" />
          </div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500">
            <Package className="w-12 h-12 mb-3 text-gray-300" />
            <p className="text-lg font-medium">No products found</p>
            <p className="text-sm">Try adjusting your search or filters</p>
          </div>
        ) : (
          <>
            <p className="text-sm text-gray-500 mb-4">
              Showing {products.length} product{products.length !== 1 ? 's' : ''}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {products.map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onEdit={() => setEditProduct(product)}
                  onDelete={() => setDeleteConfirm(product)}
                  onQuantityChange={handleQuantityChange}
                />
              ))}
            </div>
          </>
        )}
      </main>

      {/* Notification */}
      {notification && (
        <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg text-sm font-medium transition-all ${
          notification.type === 'error'
            ? 'bg-red-600 text-white'
            : 'bg-emerald-600 text-white'
        }`}>
          {notification.type === 'error'
            ? <AlertCircle className="w-4 h-4" />
            : <Check className="w-4 h-4" />
          }
          {notification.message}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-xl shadow-xl p-6 max-w-sm w-full">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <Trash2 className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Delete Product</h3>
                <p className="text-sm text-gray-500">This action cannot be undone</p>
              </div>
            </div>
            <p className="text-sm text-gray-700 mb-5">
              Are you sure you want to delete <strong>"{deleteConfirm.name}"</strong>?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteProduct(deleteConfirm.id)}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      {showAddModal && (
        <AddProductModal
          categories={categories}
          onClose={() => setShowAddModal(false)}
          onSubmit={handleAddProduct}
        />
      )}

      {editProduct && (
        <EditProductModal
          product={editProduct}
          categories={categories}
          onClose={() => setEditProduct(null)}
          onSubmit={handleEditProduct}
        />
      )}
    </div>
  );
}

export default App;
