import { X } from 'lucide-react';
import ProductForm from './ProductForm';

export default function AddProductModal({ categories, onClose, onSubmit }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-base font-semibold text-gray-900">Add New Product</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="px-6 py-5">
          <ProductForm
            categories={categories}
            onSubmit={onSubmit}
            onCancel={onClose}
            submitLabel="Add Product"
          />
        </div>
      </div>
    </div>
  );
}
