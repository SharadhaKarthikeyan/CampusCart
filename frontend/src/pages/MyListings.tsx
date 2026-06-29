import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { Package, CheckCircle2, DollarSign, Calendar, MapPin, Tag, Edit3, Trash2, AlertCircle, ShoppingBag } from 'lucide-react';

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
}

const MyListings: React.FC = () => {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Fetch listings
  const fetchMyListings = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/users/me/listings');
      setListings(response.data);
    } catch (err: any) {
      console.error('Error fetching user listings:', err);
      setError('Could not retrieve your listings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyListings();
  }, []);

  // Actions
  const handleMarkAsSold = async (id: number) => {
    setActionLoading(true);
    try {
      await api.patch(`/listings/${id}/sold`);
      // Update local state without full reload
      setListings((prevListings) =>
        prevListings.map((item) =>
          item.id === id ? { ...item, status: 'Sold' } : item
        )
      );
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to update listing');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to permanently delete this listing?')) return;
    setActionLoading(true);
    try {
      await api.delete(`/listings/${id}`);
      // Remove from local state
      setListings((prevListings) => prevListings.filter((item) => item.id !== id));
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to delete listing');
    } finally {
      setActionLoading(false);
    }
  };

  // Metrics calculations
  const totalListings = listings.length;
  const availableItems = listings.filter((item) => item.status === 'Available').length;
  const soldItems = listings.filter((item) => item.status === 'Sold').length;
  const estimatedEarnings = listings
    .filter((item) => item.status === 'Sold')
    .reduce((sum, item) => sum + item.price, 0);

  // Image resolver
  const getImageUrl = (url: string | null) => {
    if (!url) return 'https://images.unsplash.com/photo-1584824486509-112e4181ff6b?w=500&auto=format&fit=crop&q=60';
    if (url.startsWith('http')) return url;
    const backendBaseUrl = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api').replace('/api', '');
    return `${backendBaseUrl}${url}`;
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-primary-600 border-solid border-slate-200"></div>
          <p className="text-slate-500 font-medium animate-pulse text-sm">Loading seller dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 fade-in">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight font-sans">Seller Dashboard</h1>
        <p className="text-slate-500 mt-1">Manage your active posts, sales metrics, and item status.</p>
      </div>

      {/* Dashboard Stats Panel */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-10">
        {/* Total Listings Card */}
        <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm flex items-center space-x-4">
          <div className="p-3.5 bg-blue-50 text-blue-600 rounded-xl">
            <Package className="h-6 w-6" />
          </div>
          <div>
            <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Total Listed</span>
            <span className="text-2xl font-extrabold text-slate-900 leading-none mt-1 inline-block">
              {totalListings}
            </span>
          </div>
        </div>

        {/* Available Items Card */}
        <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm flex items-center space-x-4">
          <div className="p-3.5 bg-emerald-50 text-emerald-600 rounded-xl">
            <ShoppingBag className="h-6 w-6" />
          </div>
          <div>
            <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Active Items</span>
            <span className="text-2xl font-extrabold text-slate-900 leading-none mt-1 inline-block">
              {availableItems}
            </span>
          </div>
        </div>

        {/* Sold Items Card */}
        <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm flex items-center space-x-4">
          <div className="p-3.5 bg-amber-50 text-amber-600 rounded-xl">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <div>
            <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Items Sold</span>
            <span className="text-2xl font-extrabold text-slate-900 leading-none mt-1 inline-block">
              {soldItems}
            </span>
          </div>
        </div>

        {/* Earnings Card */}
        <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm flex items-center space-x-4">
          <div className="p-3.5 bg-indigo-50 text-indigo-600 rounded-xl">
            <DollarSign className="h-6 w-6" />
          </div>
          <div>
            <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Total Earnings</span>
            <span className="text-2xl font-extrabold text-indigo-600 leading-none mt-1 inline-block">
              ${estimatedEarnings.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* Main listings list */}
      <h2 className="text-xl font-bold text-slate-800 mb-5">Your Product Postings</h2>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-xl flex items-start space-x-2.5 mb-6">
          <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
          <div className="text-sm font-medium text-red-800">{error}</div>
        </div>
      )}

      {listings.length === 0 ? (
        // Empty state for dashboard
        <div className="bg-white border border-slate-100 rounded-3xl p-16 text-center shadow-sm max-w-2xl mx-auto">
          <div className="bg-slate-50 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 border border-slate-100 text-slate-400">
            <Package className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-800">You haven't listed anything yet</h3>
          <p className="text-slate-500 text-sm mt-1 max-w-sm mx-auto">
            Got textbook materials, electronics, furniture, or clothes you don't need? Sell them to campus peers!
          </p>
          <Link
            to="/create"
            className="mt-6 inline-flex items-center space-x-2 bg-primary-600 hover:bg-primary-700 text-white px-5 py-3 rounded-xl text-sm font-semibold transition-all shadow-sm"
          >
            <Package className="h-4.5 w-4.5" />
            <span>Create First Listing</span>
          </Link>
        </div>
      ) : (
        // User postings grid
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {listings.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-md hover:border-slate-200 transition-all duration-300 overflow-hidden flex flex-col sm:flex-row"
            >
              {/* Product Thumbnail image */}
              <div className="relative w-full sm:w-44 h-44 bg-slate-100 flex-shrink-0">
                <img
                  src={getImageUrl(item.imageUrl)}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
                
                {/* Status Badge */}
                <div className="absolute top-3 left-3">
                  <span className={`px-2.5 py-1 text-[10px] font-bold rounded-lg shadow-sm ${
                    item.status === 'Available'
                      ? 'bg-emerald-500 text-white'
                      : 'bg-slate-500 text-white'
                  }`}>
                    {item.status}
                  </span>
                </div>
              </div>

              {/* Body summary details */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase flex items-center">
                      <Tag className="h-3 w-3 mr-1" />
                      {item.category}
                    </span>
                    <span className="text-[10px] font-medium text-slate-400 flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      {new Date(item.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                  
                  <Link to={`/listings/${item.id}`} className="font-bold text-slate-800 text-base line-clamp-1 hover:text-primary-600 transition-colors">
                    {item.title}
                  </Link>
                  
                  <div className="text-base font-extrabold text-slate-900 mt-1">
                    ${item.price.toFixed(2)}
                  </div>

                  <div className="flex items-center text-slate-500 text-xs mt-2">
                    <MapPin className="h-3.5 w-3.5 text-slate-400 mr-1 flex-shrink-0" />
                    <span className="truncate">{item.location}</span>
                  </div>
                </div>

                {/* Dashboard inline actions */}
                <div className="mt-4 pt-3 border-t border-slate-50 flex items-center justify-between gap-3">
                  <Link
                    to={`/listings/${item.id}`}
                    className="text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
                  >
                    View Details
                  </Link>

                  <div className="flex items-center space-x-2">
                    {item.status === 'Available' && (
                      <button
                        onClick={() => handleMarkAsSold(item.id)}
                        disabled={actionLoading}
                        className="inline-flex items-center space-x-1 px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg text-xs font-semibold transition-colors focus:outline-none"
                        title="Mark as Sold"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        <span>Sold</span>
                      </button>
                    )}
                    <Link
                      to={`/edit/${item.id}`}
                      className="inline-flex items-center p-1.5 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-lg border border-slate-200 transition-colors"
                      title="Edit"
                    >
                      <Edit3 className="h-3.5 w-3.5" />
                    </Link>
                    <button
                      onClick={() => handleDelete(item.id)}
                      disabled={actionLoading}
                      className="inline-flex items-center p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg border border-red-100 transition-colors focus:outline-none"
                      title="Delete"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyListings;
