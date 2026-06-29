import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Upload, MapPin, Tag, DollarSign, List, ArrowLeft, AlertCircle } from 'lucide-react';

const CATEGORIES = ['Furniture', 'Electronics', 'Books', 'Kitchen', 'Clothing', 'Home', 'Other'];
const CONDITIONS = ['New', 'Like New', 'Good', 'Fair', 'Poor'];
const STATUSES = ['Available', 'Sold'];

const EditListing: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [condition, setCondition] = useState('');
  const [location, setLocation] = useState('');
  const [status, setStatus] = useState('Available');
  
  // Image states
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [existingImageUrl, setExistingImageUrl] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load existing details
  useEffect(() => {
    const fetchListingDetails = async () => {
      try {
        const response = await api.get(`/listings/${id}`);
        const data = response.data;
        
        // Ownership check
        if (user && data.sellerId !== user.id) {
          navigate('/');
          return;
        }

        setTitle(data.title);
        setDescription(data.description);
        setPrice(data.price.toString());
        setCategory(data.category);
        setCondition(data.condition);
        setLocation(data.location);
        setStatus(data.status);
        setExistingImageUrl(data.imageUrl);
      } catch (err: any) {
        console.error('Error fetching listing details for editing:', err);
        setError('Could not fetch listing details. Make sure it exists.');
      } finally {
        setLoading(false);
      }
    };

    fetchListingDetails();
  }, [id, user, navigate]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      if (!file.type.startsWith('image/')) {
        setError('Please upload a valid image file (PNG, JPG, WEBP)');
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        setError('Image file is too large. Maximum size is 5MB.');
        return;
      }

      setImageFile(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim() || !description.trim() || !price || !category || !condition || !location.trim() || !status) {
      setError('Please fill in all required fields');
      return;
    }

    const priceNum = Number(price);
    if (isNaN(priceNum) || priceNum < 0) {
      setError('Please enter a valid positive price');
      return;
    }

    setIsUpdating(true);

    try {
      const formData = new FormData();
      formData.append('title', title.trim());
      formData.append('description', description.trim());
      formData.append('price', price);
      formData.append('category', category);
      formData.append('condition', condition);
      formData.append('location', location.trim());
      formData.append('status', status);
      
      if (imageFile) {
        formData.append('image', imageFile);
      }

      await api.put(`/listings/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Navigate back to details page
      navigate(`/listings/${id}`);
    } catch (err: any) {
      console.error('Error updating listing:', err);
      setError(err.response?.data?.error || 'Failed to update listing. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  const getImageUrl = (url: string | null) => {
    if (!url) return null;
    if (url.startsWith('http')) return url;
    const backendBaseUrl = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api').replace('/api', '');
    return `${backendBaseUrl}${url}`;
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-primary-600 border-solid border-slate-200"></div>
          <p className="text-slate-500 font-medium animate-pulse text-sm">Retrieving product record...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 fade-in">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center space-x-1 text-slate-500 hover:text-slate-900 transition-colors text-sm font-medium mb-6 focus:outline-none"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Cancel and go back</span>
      </button>

      <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-sm">
        <div className="mb-6 pb-5 border-b border-slate-100">
          <h1 className="text-2xl font-bold text-slate-900">Edit Listing</h1>
          <p className="text-slate-500 text-sm mt-1">Modify your item details or replacement images.</p>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-xl flex items-start space-x-2.5 mb-6">
            <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div className="text-sm font-medium text-red-800">{error}</div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Title */}
            <div className="sm:col-span-2">
              <label htmlFor="title" className="block text-sm font-semibold text-slate-700 mb-1.5">
                Item Title <span className="text-red-500">*</span>
              </label>
              <input
                id="title"
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="block w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all text-sm"
              />
            </div>

            {/* Price */}
            <div>
              <label htmlFor="price" className="block text-sm font-semibold text-slate-700 mb-1.5">
                Price ($) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <DollarSign className="h-4 w-4" />
                </div>
                <input
                  id="price"
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="block w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all text-sm"
                />
              </div>
            </div>

            {/* Location */}
            <div>
              <label htmlFor="location" className="block text-sm font-semibold text-slate-700 mb-1.5">
                Meetup Location <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <MapPin className="h-4 w-4" />
                </div>
                <input
                  id="location"
                  type="text"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="block w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all text-sm"
                />
              </div>
            </div>

            {/* Category */}
            <div>
              <label htmlFor="category" className="block text-sm font-semibold text-slate-700 mb-1.5">
                Category <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Tag className="h-4 w-4" />
                </div>
                <select
                  id="category"
                  required
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="block w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-950 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all text-sm"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Condition */}
            <div>
              <label htmlFor="condition" className="block text-sm font-semibold text-slate-700 mb-1.5">
                Condition <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <List className="h-4 w-4" />
                </div>
                <select
                  id="condition"
                  required
                  value={condition}
                  onChange={(e) => setCondition(e.target.value)}
                  className="block w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-950 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all text-sm"
                >
                  {CONDITIONS.map((cond) => (
                    <option key={cond} value={cond}>{cond}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Availability Status */}
            <div>
              <label htmlFor="status" className="block text-sm font-semibold text-slate-700 mb-1.5">
                Item Status <span className="text-red-500">*</span>
              </label>
              <select
                id="status"
                required
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="block w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-950 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all text-sm"
              >
                {STATUSES.map((st) => (
                  <option key={st} value={st}>{st}</option>
                ))}
              </select>
            </div>

            {/* Description */}
            <div className="sm:col-span-2">
              <label htmlFor="description" className="block text-sm font-semibold text-slate-700 mb-1.5">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                required
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="block w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all text-sm resize-y"
              />
            </div>

            {/* Image update Section */}
            <div className="sm:col-span-2">
              <span className="block text-sm font-semibold text-slate-700 mb-1.5">Update Image</span>
              
              <div className="flex flex-col sm:flex-row items-center gap-5 mt-2">
                {/* Upload Trigger */}
                <label className="flex-1 w-full flex flex-col items-center justify-center border-2 border-dashed border-slate-200 hover:border-primary-500 hover:bg-slate-50 rounded-2xl p-6 cursor-pointer transition-all">
                  <Upload className="h-8 w-8 text-slate-400 mb-2" />
                  <span className="text-sm font-semibold text-slate-600">Choose replacement image</span>
                  <span className="text-xs text-slate-400 mt-1">PNG, JPG, WEBP up to 5MB</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>

                {/* Previews (Either new upload, or existing database image) */}
                {(imagePreview || existingImageUrl) && (
                  <div className="relative w-full sm:w-36 h-36 border border-slate-100 rounded-2xl overflow-hidden bg-slate-50 flex-shrink-0 shadow-sm">
                    <img
                      src={imagePreview || getImageUrl(existingImageUrl) || ''}
                      alt="Upload Preview"
                      className="w-full h-full object-cover"
                    />
                    {imagePreview && (
                      <button
                        type="button"
                        onClick={() => {
                          setImageFile(null);
                          setImagePreview(null);
                        }}
                        className="absolute top-1.5 right-1.5 p-1 bg-red-600 text-white rounded-full hover:bg-red-700 focus:outline-none transition-colors"
                        title="Discard replacement image"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>

          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-5 py-2.5 border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl text-sm font-semibold transition-colors focus:outline-none"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isUpdating}
              className="px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl text-sm shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none"
            >
              {isUpdating ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditListing;
