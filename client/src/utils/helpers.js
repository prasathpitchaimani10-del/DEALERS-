// Format price in Indian Rupees
export function formatPrice(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

// Format date to readable format
export function formatDate(dateString) {
  return new Intl.DateTimeFormat('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(dateString));
}

// Format date with time
export function formatDateTime(dateString) {
  return new Intl.DateTimeFormat('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(dateString));
}

// Get status badge class
export function getStatusBadge(status) {
  const map = {
    placed: 'badge-placed',
    confirmed: 'badge-confirmed',
    shipped: 'badge-shipped',
    delivered: 'badge-delivered',
    cancelled: 'badge-cancelled',
    pending: 'badge-pending',
    completed: 'badge-completed',
  };
  return map[status] || 'badge-placed';
}

// Capitalize first letter
export function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Calculate discount percentage
export function getDiscount(price, originalPrice) {
  if (!originalPrice || originalPrice <= price) return 0;
  return Math.round(((originalPrice - price) / originalPrice) * 100);
}

// Indian states for address dropdowns
export const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya',
  'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim',
  'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand',
  'West Bengal', 'Delhi', 'Jammu & Kashmir', 'Ladakh',
  'Andaman & Nicobar Islands', 'Chandigarh', 'Dadra & Nagar Haveli and Daman & Diu',
  'Lakshadweep', 'Puducherry'
];

// Product categories
export const CATEGORIES = [
  'Electronics',
  'Fashion',
  'Home & Kitchen',
  'Books',
  'Sports',
  'Beauty',
  'Footwear',
  'Toys & Games',
  'Health & Personal Care',
  'Jewelry & Accessories',
  'Home Decor',
  'Automotive',
  'Groceries & Food',
  'Office & Stationery'
];

// Category icon names (mapped to Lucide React icons)
export const CATEGORY_ICONS = {
  'Electronics': 'Smartphone',
  'Fashion': 'Shirt',
  'Home & Kitchen': 'ChefHat',
  'Books': 'BookOpen',
  'Sports': 'Dumbbell',
  'Beauty': 'Sparkles',
  'Footwear': 'Footprints',
  'Toys & Games': 'Gamepad2',
  'Health & Personal Care': 'HeartPulse',
  'Jewelry & Accessories': 'Gem',
  'Home Decor': 'Lamp',
  'Automotive': 'Car',
  'Groceries & Food': 'ShoppingBag',
  'Office & Stationery': 'Briefcase'
};

// Category gradient colors
export const CATEGORY_COLORS = {
  'Electronics': 'from-blue-50 to-indigo-100 border-blue-200',
  'Fashion': 'from-rose-50 to-pink-100 border-rose-200',
  'Home & Kitchen': 'from-amber-50 to-orange-100 border-amber-200',
  'Books': 'from-emerald-50 to-green-100 border-emerald-200',
  'Sports': 'from-violet-50 to-purple-100 border-violet-200',
  'Beauty': 'from-fuchsia-50 to-pink-100 border-fuchsia-200',
  'Footwear': 'from-cyan-50 to-sky-100 border-cyan-200',
  'Toys & Games': 'from-yellow-50 to-amber-100 border-yellow-200',
  'Health & Personal Care': 'from-red-50 to-rose-100 border-red-200',
  'Jewelry & Accessories': 'from-purple-50 to-indigo-100 border-purple-200',
  'Home Decor': 'from-teal-50 to-emerald-100 border-teal-200',
  'Automotive': 'from-slate-100 to-gray-200 border-slate-300',
  'Groceries & Food': 'from-lime-50 to-green-100 border-lime-200',
  'Office & Stationery': 'from-stone-100 to-amber-100 border-stone-300'
};

// Category icon accent colors
export const CATEGORY_ICON_COLORS = {
  'Electronics': 'text-blue-600',
  'Fashion': 'text-rose-600',
  'Home & Kitchen': 'text-amber-600',
  'Books': 'text-emerald-600',
  'Sports': 'text-violet-600',
  'Beauty': 'text-fuchsia-600',
  'Footwear': 'text-cyan-600',
  'Toys & Games': 'text-yellow-600',
  'Health & Personal Care': 'text-red-600',
  'Jewelry & Accessories': 'text-purple-600',
  'Home Decor': 'text-teal-600',
  'Automotive': 'text-slate-700',
  'Groceries & Food': 'text-lime-600',
  'Office & Stationery': 'text-stone-700'
};
