import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Search, Filter, SlidersHorizontal, MapPin, Calendar, Tag, AlertTriangle } from 'lucide-react';

interface Listing {
  id: number;
  title: string;
  description: string;
  price: number;
  category: string;
  condition: string;
  location: string;
  imageUrl: string | null;
  status: string;
  createdAt: string;
  seller: {
    name: string;
  };
}

const CATEGORIES = ['Furniture', 'Electronics', 'Books', 'Kitchen', 'Clothing', 'Home', 'Other'];
const CONDITIONS = ['New', 'Like New', 'Good', 'Fair', 'Poor'];
const STATUSES = ['Available', 'Sold'];

const Home: React.FC = () => {
  const navigate = useNavigate();

  // Listings state
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Filters state
  const [search, setSearch] = useState<string>('');
  const [category, setCategory] = useState<string>('');
  const [condition, setCondition] = useState<string>('');
  const [status, setStatus] = useState<string>('Available'); // Default to Available listings
  const [maxPrice, setMaxPrice] = useState<string>('');

  // Mobile filters toggle
  const [showMobileFilters, setShowMobileFilters] = useState<boolean>(false);

  // Fetch listings from backend
  const fetchListings = async () => {
    setLoading(true);
    setError(null);
    try {
      const params: any = {};
      if (search.trim()) params.search = search.trim();
      if (category) params.category = category;
      if (condition) params.condition = condition;
      if (status) params.status = status;
      if (maxPrice && !isNaN(Number(maxPrice))) params.maxPrice = maxPrice;

      const response = await api.get('/listings', { params });
      setListings(response.data);
    } catch (err: any) {
      console.error('Error fetching listings:', err);
      setError('Could not retrieve marketplace listings. Please check connection.');
    } finally {
      setLoading(false);
    }
  };

  // Trigger fetch when parameters update
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchListings();
    }, 300); // Debounce search changes

    return () => clearTimeout(delayDebounceFn);
  }, [search, category, condition, status, maxPrice]);

  // Image resolver
  const getImageUrl = (url: string | null) => {
    if (!url) return 'https://images.unsplash.com/photo-1584824486509-112e4181ff6b?w=500&auto=format&fit=crop&q=60';
    if (url.startsWith('http')) return url;
    // Resolve relative path against server URL
    const backendBaseUrl = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api').replace('/api', '');
    return `${backendBaseUrl}${url}`;
  };

  // Format posted date helper
  const formatPostedDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 1) return 'Today';
    if (diffDays === 2) return 'Yesterday';
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  };

  // Reset all filters
  const handleResetFilters = () => {
    setSearch('');
    setCategory('');
    setCondition('');
    setStatus('Available');
    setMaxPrice('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 fade-in">
      {/* Header section */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Campus Marketplace</h1>
        <p className="text-slate-500 mt-1">Buy and sell items within your campus community safely.</p>
      </div>

      {/* Main Grid: Filters + Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Desktop Sidebar Filters */}
        <div className="hidden lg:block bg-white p-6 rounded-2xl border border-slate-100 shadow-sm h-fit">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
            <h2 className="font-bold text-slate-800 flex items-center space-x-2">
              <Filter className="h-4 w-4 text-primary-600" />
              <span>Filters</span>
            </h2>
            <button
              onClick={handleResetFilters}
              className="text-xs font-semibold text-primary-600 hover:text-primary-700 focus:outline-none"
            >
              Reset All
            </button>
          </div>

          <div className="space-y-5">
            {/* Category Filter */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="block w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white"
              >
                <option value="">All Categories</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Condition Filter */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Condition</label>
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
                className="block w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white"
              >
                <option value="">All Conditions</option>
                {CONDITIONS.map((cond) => (
                  <option key={cond} value={cond}>{cond}</option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Availability</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="block w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white"
              >
                <option value="">All Items</option>
                {STATUSES.map((st) => (
                  <option key={st} value={st}>{st}</option>
                ))}
              </select>
            </div>

            {/* Max Price Filter */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Max Price ($)</label>
              <input
                type="number"
                placeholder="Budget limit"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="block w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white"
              />
            </div>
          </div>
        </div>

        {/* Listings Display Area */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* Search bar & Mobile Filters button */}
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Search className="h-4 w-4" />
              </div>
              <input
                type="text"
                placeholder="Search listings by title or description..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="block w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 shadow-sm"
              />
            </div>
            
            <button
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="lg:hidden inline-flex items-center justify-center space-x-1.5 px-4 py-2.5 border border-slate-200 rounded-2xl bg-white text-slate-600 font-semibold text-sm shadow-sm hover:bg-slate-50"
            >
              <SlidersHorizontal className="h-4 w-4 text-primary-600" />
              <span>Filters</span>
            </button>
          </div>

          {/* Mobile Filters Dropdown */}
          {showMobileFilters && (
            <div className="lg:hidden bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="font-bold text-slate-800">Filter Products</h3>
                <button
                  onClick={handleResetFilters}
                  className="text-xs font-semibold text-primary-600"
                >
                  Reset All
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="block w-full px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 text-xs"
                  >
                    <option value="">All Categories</option>
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Condition</label>
                  <select
                    value={condition}
                    onChange={(e) => setCondition(e.target.value)}
                    className="block w-full px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 text-xs"
                  >
                    <option value="">All Conditions</option>
                    {CONDITIONS.map((cond) => (
                      <option key={cond} value={cond}>{cond}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Availability</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="block w-full px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 text-xs"
                  >
                    <option value="">All Items</option>
                    {STATUSES.map((st) => (
                      <option key={st} value={st}>{st}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Max Price ($)</label>
                  <input
                    type="number"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="block w-full px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 text-xs"
                    placeholder="Limit"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Cards Display Grid */}
          {loading ? (
            // Skeleton loader for cards
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {[...Array(6)].map((_, idx) => (
                <div key={idx} className="bg-white rounded-2xl border border-slate-100 p-4 space-y-4 animate-pulse">
                  <div className="bg-slate-200 rounded-xl h-44 w-full"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-slate-200 rounded w-2/3"></div>
                    <div className="h-3 bg-slate-200 rounded w-1/2"></div>
                  </div>
                  <div className="flex justify-between items-center pt-2">
                    <div className="h-6 bg-slate-200 rounded w-1/4"></div>
                    <div className="h-4 bg-slate-200 rounded w-1/3"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="bg-red-50 border-l-4 border-red-500 p-5 rounded-r-2xl flex items-start space-x-3.5 shadow-sm">
              <AlertTriangle className="h-6 w-6 text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-red-800 font-bold text-sm">Failed to Load Listings</h3>
                <p className="text-red-700 text-xs mt-1">{error}</p>
                <button
                  onClick={fetchListings}
                  className="mt-3 px-3 py-1.5 bg-red-600 text-white rounded-lg text-xs font-semibold hover:bg-red-700"
                >
                  Retry Connection
                </button>
              </div>
            </div>
          ) : listings.length === 0 ? (
            // Empty state
            <div className="bg-white border border-slate-100 rounded-2xl p-16 text-center shadow-sm">
              <div className="bg-slate-50 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 border border-slate-100 text-slate-400">
                <Search className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-800">No Listings Found</h3>
              <p className="text-slate-500 text-sm mt-1 max-w-md mx-auto">
                We couldn't find any items matching your active search or filters. Try adjusting your selections or clearing search keywords.
              </p>
              <button
                onClick={handleResetFilters}
                className="mt-5 inline-flex items-center space-x-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            // Listings Grid
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {listings.map((item) => (
                <div
                  key={item.id}
                  onClick={() => navigate(`/listings/${item.id}`)}
                  className="bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-md hover:border-slate-200 transition-all duration-300 overflow-hidden cursor-pointer flex flex-col group"
                >
                  {/* Image container */}
                  <div className="relative h-48 bg-slate-100 overflow-hidden">
                    <img
                      src={getImageUrl(item.imageUrl)}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                      loading="lazy"
                    />
                    
                    {/* Status badge Overlay */}
                    <div className="absolute top-3 left-3">
                      <span className={`px-2.5 py-1 text-xs font-bold rounded-lg shadow-sm ${
                        item.status === 'Available'
                          ? 'bg-emerald-500 text-white'
                          : 'bg-slate-500 text-white'
                      }`}>
                        {item.status}
                      </span>
                    </div>

                    {/* Condition Badge Overlay */}
                    <div className="absolute top-3 right-3">
                      <span className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-white/90 backdrop-blur-xs text-slate-800 shadow-sm border border-slate-100">
                        {item.condition}
                      </span>
                    </div>
                  </div>

                  {/* Body details */}
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase flex items-center">
                          <Tag className="h-3 w-3 mr-1" />
                          {item.category}
                        </span>
                        <span className="text-xs font-medium text-slate-500 flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          {formatPostedDate(item.createdAt)}
                        </span>
                      </div>
                      
                      <h3 className="font-bold text-slate-800 text-base line-clamp-1 group-hover:text-primary-600 transition-colors">
                        {item.title}
                      </h3>
                      
                      <div className="flex items-center text-slate-500 text-xs mt-1.5">
                        <MapPin className="h-3.5 w-3.5 text-slate-400 mr-1 flex-shrink-0" />
                        <span className="truncate">{item.location}</span>
                      </div>
                    </div>

                    {/* Footer price / action */}
                    <div className="mt-4 pt-3 border-t border-slate-50 flex items-center justify-between">
                      <span className="text-lg font-extrabold text-slate-900">
                        ${item.price.toFixed(2)}
                      </span>
                      <span className="text-xs font-medium text-primary-600 hover:text-primary-700 transition-colors">
                        View Details &rarr;
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
