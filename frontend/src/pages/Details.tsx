import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { MapPin, Calendar, Tag, ShieldAlert, Mail, Edit3, Trash2, CheckCircle2, ArrowLeft, AlertCircle } from 'lucide-react';

interface Listing {
  id: number;
  sellerId: number;
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
    email: string;
  };
}

const Details: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Fetch listing data
  const fetchListing = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`/listings/${id}`);
      setListing(response.data);
    } catch (err: any) {
      console.error('Error fetching listing details:', err);
      setError(err.response?.data?.error || 'Listing not found or connection lost.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListing();
  }, [id]);

  // Actions
  const handleMarkAsSold = async () => {
    if (!listing) return;
    setActionLoading(true);
    try {
      const response = await api.patch(`/listings/${listing.id}/sold`);
      setListing(response.data);
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to update listing status');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!listing) return;
    if (!window.confirm('Are you sure you want to permanently delete this listing?')) return;
    
    setActionLoading(true);
    try {
      await api.delete(`/listings/${listing.id}`);
      navigate('/');
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to delete listing');
      setActionLoading(false);
    }
  };

  // Image resolver
  const getImageUrl = (url: string | null) => {
    if (!url) return 'https://images.unsplash.com/photo-1584824486509-112e4181ff6b?w=800&auto=format&fit=crop&q=60';
    if (url.startsWith('http')) return url;
    const backendBaseUrl = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api').replace('/api', '');
    return `${backendBaseUrl}${url}`;
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-primary-600 border-solid border-slate-200"></div>
          <p className="text-slate-500 font-medium animate-pulse text-sm">Loading listing details...</p>
        </div>
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center fade-in">
        <div className="bg-red-50 border border-red-100 rounded-2xl p-8 max-w-lg mx-auto">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-red-800">Error Loading Product</h3>
          <p className="text-red-700 text-sm mt-2">{error || 'The requested listing does not exist.'}</p>
          <button
            onClick={() => navigate('/')}
            className="mt-6 inline-flex items-center space-x-1.5 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-semibold transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Marketplace</span>
          </button>
        </div>
      </div>
    );
  }

  // Check ownership
  const isOwner = user && user.id === listing.sellerId;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 fade-in">
      {/* Back navigation */}
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center space-x-1 text-slate-500 hover:text-slate-900 transition-colors text-sm font-medium mb-6 focus:outline-none"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back to listings</span>
      </button>

      {/* Main split details grid */}
      <div className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 p-6 md:p-8">
        
        {/* Left: Product Image */}
        <div className="relative rounded-2xl overflow-hidden bg-slate-50 border border-slate-100 h-80 sm:h-96 md:h-full min-h-[300px] md:min-h-[450px]">
          <img
            src={getImageUrl(listing.imageUrl)}
            alt={listing.title}
            className="w-full h-full object-cover"
          />
          {/* Status Badge overlay */}
          <div className="absolute top-4 left-4">
            <span className={`px-3 py-1.5 text-xs font-extrabold rounded-xl shadow-md ${
              listing.status === 'Available'
                ? 'bg-emerald-500 text-white'
                : 'bg-slate-500 text-white'
            }`}>
              {listing.status}
            </span>
          </div>
        </div>

        {/* Right: Product Details Info */}
        <div className="flex flex-col justify-between">
          <div className="space-y-6">
            
            {/* Meta Tags / Category / Date */}
            <div className="flex items-center space-x-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-primary-50 text-primary-700 text-xs font-semibold border border-primary-100">
                <Tag className="h-3 w-3 mr-1.5" />
                {listing.category}
              </span>
              <span className="inline-flex items-center text-slate-400 text-xs">
                <Calendar className="h-3.5 w-3.5 mr-1" />
                Listed on {new Date(listing.createdAt).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
              </span>
            </div>

            {/* Title / Price */}
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
                {listing.title}
              </h1>
              <p className="text-3xl font-extrabold text-slate-900 mt-2">
                ${listing.price.toFixed(2)}
              </p>
            </div>

            {/* Description */}
            <div className="border-t border-slate-100 pt-5">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Description</h3>
              <p className="text-slate-600 text-sm whitespace-pre-line leading-relaxed">
                {listing.description}
              </p>
            </div>

            {/* Product Attributes (Condition / Location) */}
            <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-5">
              <div>
                <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Condition</span>
                <span className="inline-block px-3 py-1 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-sm font-semibold">
                  {listing.condition}
                </span>
              </div>
              <div>
                <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Meetup Location</span>
                <div className="flex items-center text-slate-600 text-sm mt-1 font-medium">
                  <MapPin className="h-4 w-4 text-slate-400 mr-1.5 flex-shrink-0" />
                  <span>{listing.location}</span>
                </div>
              </div>
            </div>

            {/* Seller profile box */}
            <div className="border-t border-slate-100 pt-5 bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">About the Seller</span>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-sm uppercase">
                  {listing.seller.name.charAt(0)}
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-800">{listing.seller.name}</div>
                  <div className="text-xs text-slate-500 font-medium">{listing.seller.email}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Actions section */}
          <div className="mt-8 border-t border-slate-100 pt-6 space-y-4">
            {isOwner ? (
              // Owner Actions Dashboard controls
              <div className="flex flex-col sm:flex-row gap-3">
                {listing.status === 'Available' && (
                  <button
                    onClick={handleMarkAsSold}
                    disabled={actionLoading}
                    className="flex-1 inline-flex justify-center items-center space-x-2 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-bold shadow-sm transition-all focus:outline-none"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Mark as Sold</span>
                  </button>
                )}
                <Link
                  to={`/edit/${listing.id}`}
                  className="flex-1 inline-flex justify-center items-center space-x-2 py-3 px-4 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-sm font-bold transition-colors focus:outline-none"
                >
                  <Edit3 className="h-4 w-4 text-slate-400" />
                  <span>Edit Listing</span>
                </Link>
                <button
                  onClick={handleDelete}
                  disabled={actionLoading}
                  className="inline-flex justify-center items-center p-3 border border-red-200 hover:bg-red-50 text-red-600 rounded-xl transition-colors focus:outline-none"
                  title="Delete Listing"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ) : (
              // Buyer Actions contact button
              <div>
                <a
                  href={`mailto:${listing.seller.email}?subject=CampusCart Inquiry: ${encodeURIComponent(listing.title)}&body=Hi ${listing.seller.name},%0D%0A%0D%0AI saw your listing for "${encodeURIComponent(listing.title)}" on CampusCart and I'm interested in buying it.%0D%0A%0D%0APlease let me know if it is still available and when/where you would like to meet on campus.%0D%0A%0D%0AThanks!`}
                  className="w-full inline-flex justify-center items-center space-x-2 py-3.5 px-4 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-sm font-bold shadow-md hover:shadow-lg transition-all focus:outline-none"
                >
                  <Mail className="h-4.5 w-4.5" />
                  <span>Contact Seller</span>
                </a>
              </div>
            )}

            {/* Safety Disclaimer note */}
            <div className="bg-amber-50/70 border border-amber-100 rounded-xl p-3.5 flex items-start space-x-2.5">
              <ShieldAlert className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="text-xs text-amber-800 leading-relaxed font-medium">
                <span className="font-bold block mb-0.5">Safety Warning</span>
                Meet in a public campus location (e.g., Student Union, Library) during daylight hours. Do not share sensitive personal details or transfer money prior to meeting and verifying the item.
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

export default Details;
