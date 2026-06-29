import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Upload, MapPin, Tag, DollarSign, List, ArrowLeft, AlertCircle } from 'lucide-react';

const CATEGORIES = ['Furniture', 'Electronics', 'Books', 'Kitchen', 'Clothing', 'Home', 'Other'];
const CONDITIONS = ['New', 'Like New', 'Good', 'Fair', 'Poor'];

const CreateListing: React.FC = () => {
  const navigate = useNavigate();

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [condition, setCondition] = useState('');
  const [location, setLocation] = useState('');
  
  // Image upload states
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Basic client-side check for image type and size
      if (!file.type.startsWith('image/')) {
        setError('Please upload a valid image file (PNG, JPG, WEBP)');
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        setError('Image file is too large. Maximum size is 5MB.');
        return;
      }

      setImageFile(file);
      
      // Generate object URL for preview
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Final checks
    if (!title.trim() || !description.trim() || !price || !category || !condition || !location.trim()) {
      setError('Please fill in all required fields');
      return;
    }

    const priceNum = Number(price);
    if (isNaN(priceNum) || priceNum < 0) {
      setError('Please enter a valid positive price');
      return;
    }

    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append('title', title.trim());
      formData.append('description', description.trim());
      formData.append('price', price);
      formData.append('category', category);
      formData.append('condition', condition);
      formData.append('location', location.trim());
      
      if (imageFile) {
        formData.append('image', imageFile);
      }

      await api.post('/listings', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Navigate to marketplace homepage on success
      navigate('/');
    } catch (err: any) {
      console.error('Error creating listing:', err);
      setError(err.response?.data?.error || 'Failed to create listing. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

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
          <h1 className="text-2xl font-bold text-slate-900">Create New Listing</h1>
          <p className="text-slate-500 text-sm mt-1">Post your used items for sale on campus.</p>
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
                placeholder="e.g. Calculus 10th Edition, Swivel Office Chair"
                className="block w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all text-sm"
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
                  placeholder="0.00"
                  className="block w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all text-sm"
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
                  placeholder="e.g. Student Union, Main Library, Quad"
                  className="block w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all text-sm"
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
                  <option value="" disabled>Select Category</option>
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
                  <option value="" disabled>Select Condition</option>
                  {CONDITIONS.map((cond) => (
                    <option key={cond} value={cond}>{cond}</option>
                  ))}
                </select>
              </div>
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
                placeholder="Describe your item's condition, features, sizing, reasons for selling, and meetup preferences."
                className="block w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all text-sm resize-y"
              />
            </div>

            {/* Image upload box */}
            <div className="sm:col-span-2">
              <span className="block text-sm font-semibold text-slate-700 mb-1.5">Upload Image</span>
              
              <div className="flex flex-col sm:flex-row items-center gap-5 mt-2">
                {/* Upload Trigger Dropzone */}
                <label className="flex-1 w-full flex flex-col items-center justify-center border-2 border-dashed border-slate-200 hover:border-primary-500 hover:bg-slate-50 rounded-2xl p-6 cursor-pointer transition-all">
                  <Upload className="h-8 w-8 text-slate-400 mb-2 group-hover:text-primary-500" />
                  <span className="text-sm font-semibold text-slate-600">Choose an image</span>
                  <span className="text-xs text-slate-400 mt-1">PNG, JPG, WEBP up to 5MB</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>

                {/* Upload Preview window */}
                {imagePreview && (
                  <div className="relative w-full sm:w-36 h-36 border border-slate-100 rounded-2xl overflow-hidden bg-slate-50 flex-shrink-0 shadow-inner">
                    <img
                      src={imagePreview}
                      alt="Upload Preview"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setImageFile(null);
                        setImagePreview(null);
                      }}
                      className="absolute top-1.5 right-1.5 p-1 bg-red-600/90 text-white rounded-full hover:bg-red-700 focus:outline-none transition-colors"
                      title="Remove image"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
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
              disabled={isLoading}
              className="px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl text-sm shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none"
            >
              {isLoading ? 'Creating...' : 'Post Listing'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateListing;
