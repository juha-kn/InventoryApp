import { useState } from 'react';
import {
  Edit2,
  Trash2,
  ChevronUp,
  ChevronDown,
  Smartphone,
  Monitor,
  Headphones,
  Laptop,
  ShoppingBag,
  Shirt,
  UtensilsCrossed,
  Utensils,
  Package,
} from 'lucide-react';

const CATEGORY_COLORS = {
  Electronics: 'bg-blue-100 text-blue-700',
  Footwear: 'bg-orange-100 text-orange-700',
  Clothing: 'bg-pink-100 text-pink-700',
  Kitchen: 'bg-yellow-100 text-yellow-700',
  Toys: 'bg-red-100 text-red-700',
  'Books & Media': 'bg-cyan-100 text-cyan-700',
  'Home & Garden': 'bg-green-100 text-green-700',
  Beauty: 'bg-rose-100 text-rose-700',
  Stationery: 'bg-violet-100 text-violet-700',
};

const formatCurrency = (value) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);

const FIRST_TEN_PRODUCT_ICONS = {
  1: Smartphone,
  2: Monitor,
  3: Headphones,
  4: Laptop,
  5: ShoppingBag,
  6: ShoppingBag,
  7: Shirt,
  8: Shirt,
  9: UtensilsCrossed,
  10: Utensils,
};

const getProductIcon = (product) => {
  const numericId = Number(product.id);
  return FIRST_TEN_PRODUCT_ICONS[numericId] || Package;
};

export default function ProductCard({ product, onEdit, onDelete, onQuantityChange }) {
  const [localQty, setLocalQty] = useState(product.quantity);
  const [saving, setSaving] = useState(false);
  const Icon = getProductIcon(product);

  const handleIncrement = async () => {
    const newQty = localQty + 1;
    setLocalQty(newQty);
    setSaving(true);
    await onQuantityChange(product.id, newQty);
    setSaving(false);
  };

  const handleDecrement = async () => {
    if (localQty <= 0) return;
    const newQty = localQty - 1;
    setLocalQty(newQty);
    setSaving(true);
    await onQuantityChange(product.id, newQty);
    setSaving(false);
  };

  const handleDirectInput = (e) => {
    const val = parseInt(e.target.value, 10);
    if (!isNaN(val) && val >= 0) setLocalQty(val);
  };

  const handleInputBlur = async () => {
    if (localQty === product.quantity) return;
    setSaving(true);
    await onQuantityChange(product.id, localQty);
    setSaving(false);
  };

  const categoryColor = CATEGORY_COLORS[product.category] || 'bg-gray-100 text-gray-600';
  const isLowStock = localQty > 0 && localQty <= 5;
  const isOutOfStock = localQty === 0;

  return (
    <div className="bg-white rounded-xl border border-gray-200 hover:border-indigo-300 hover:shadow-md transition-all duration-200 flex flex-col overflow-hidden">
      {/* Category banner */}
      <div className="px-4 pt-4 pb-2">
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <Icon className="w-4 h-4" />
          </div>
          <span className={`text-xs font-medium px-2 py-1 rounded-full ${categoryColor}`}>
            {product.category}
          </span>
          {isOutOfStock && (
            <span className="text-xs font-medium px-2 py-1 rounded-full bg-red-100 text-red-700">Out of Stock</span>
          )}
          {isLowStock && !isOutOfStock && (
            <span className="text-xs font-medium px-2 py-1 rounded-full bg-amber-100 text-amber-700">Low Stock</span>
          )}
        </div>
        <h3 className="font-semibold text-gray-900 text-sm leading-snug mb-1 line-clamp-2">
          {product.name}
        </h3>
        <p className="text-xs text-gray-400 font-mono mb-2">SKU: {product.sku}</p>
        {product.description && (
          <p className="text-xs text-gray-500 line-clamp-2 mb-3">{product.description}</p>
        )}
        <p className="text-lg font-bold text-indigo-600">{formatCurrency(product.price)}</p>
      </div>

      <div className="mt-auto px-4 pb-4 pt-2 border-t border-gray-100">
        {/* Quantity Controls */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs text-gray-500 font-medium">Quantity</span>
          <div className="flex items-center gap-1">
            <button
              onClick={handleDecrement}
              disabled={localQty <= 0 || saving}
              className="w-7 h-7 flex items-center justify-center rounded-md bg-gray-100 hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronDown className="w-4 h-4 text-gray-600" />
            </button>
            <input
              type="number"
              min="0"
              value={localQty}
              onChange={handleDirectInput}
              onBlur={handleInputBlur}
              className="w-14 text-center text-sm font-semibold border border-gray-200 rounded-md py-1 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
            <button
              onClick={handleIncrement}
              disabled={saving}
              className="w-7 h-7 flex items-center justify-center rounded-md bg-gray-100 hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronUp className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={onEdit}
            className="flex-1 flex items-center justify-center gap-1.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-xs font-medium transition-colors"
          >
            <Edit2 className="w-3.5 h-3.5" />
            Edit
          </button>
          <button
            onClick={onDelete}
            className="flex-1 flex items-center justify-center gap-1.5 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg text-xs font-medium transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
