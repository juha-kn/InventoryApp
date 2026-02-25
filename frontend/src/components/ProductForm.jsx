import { useState } from 'react';

const PRESET_CATEGORIES = [
  'Electronics', 'Footwear', 'Clothing', 'Kitchen', 'Toys',
  'Books & Media', 'Home & Garden', 'Beauty', 'Stationery', 'Sports', 'Other'
];

export default function ProductForm({ initial, categories, onSubmit, onCancel, submitLabel }) {
  const allCategories = [...new Set([...PRESET_CATEGORIES, ...categories])].sort();

  const [form, setForm] = useState({
    name: initial?.name || '',
    sku: initial?.sku || '',
    category: initial?.category || '',
    quantity: initial?.quantity ?? 0,
    price: initial?.price || '',
    description: initial?.description || '',
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.name.trim()) { setError('Product name is required'); return; }
    if (!form.sku.trim()) { setError('SKU is required'); return; }
    if (!form.category) { setError('Category is required'); return; }
    if (form.price === '' || isNaN(Number(form.price)) || Number(form.price) < 0) {
      setError('Valid price is required');
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit({
        ...form,
        quantity: Number(form.quantity),
        price: Number(form.price),
      });
    } catch (err) {
      setError(err.message || 'An error occurred');
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass = "w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent";
  const labelClass = "block text-xs font-medium text-gray-700 mb-1";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-3 py-2 rounded-lg">
          {error}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <label className={labelClass}>Product Name *</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="e.g. Apple iPhone 15 Pro"
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>SKU *</label>
          <input
            name="sku"
            value={form.sku}
            onChange={handleChange}
            placeholder="e.g. ELEC-001"
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>Category *</label>
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className={inputClass}
          >
            <option value="">Select category</option>
            {allCategories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelClass}>Price ($) *</label>
          <input
            name="price"
            type="number"
            min="0"
            step="0.01"
            value={form.price}
            onChange={handleChange}
            placeholder="0.00"
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>Quantity *</label>
          <input
            name="quantity"
            type="number"
            min="0"
            value={form.quantity}
            onChange={handleChange}
            className={inputClass}
          />
        </div>

        <div className="col-span-2">
          <label className={labelClass}>Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={3}
            placeholder="Optional product description..."
            className={`${inputClass} resize-none`}
          />
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white rounded-lg text-sm font-medium transition-colors"
        >
          {submitting ? 'Saving...' : submitLabel}
        </button>
      </div>
    </form>
  );
}
