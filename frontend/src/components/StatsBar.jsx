import { Package2, DollarSign, Layers, Tag } from 'lucide-react';

const formatCurrency = (value) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);

export default function StatsBar({ stats }) {
  const cards = [
    {
      label: 'Total Products',
      value: stats.total_products,
      icon: Package2,
      color: 'bg-indigo-50 text-indigo-600',
    },
    {
      label: 'Total Items in Stock',
      value: stats.total_items.toLocaleString(),
      icon: Layers,
      color: 'bg-emerald-50 text-emerald-600',
    },
    {
      label: 'Inventory Value',
      value: formatCurrency(stats.total_value),
      icon: DollarSign,
      color: 'bg-amber-50 text-amber-600',
    },
    {
      label: 'Categories',
      value: stats.total_categories,
      icon: Tag,
      color: 'bg-purple-50 text-purple-600',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {cards.map(({ label, value, icon: Icon, color }) => (
        <div key={label} className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-4">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${color}`}>
            <Icon className="w-5 h-5" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            <p className="text-xs text-gray-500">{label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
