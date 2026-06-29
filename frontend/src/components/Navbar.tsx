import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShoppingCart, PlusCircle, User, LogOut, Menu, X, Tag } from 'lucide-react';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors ${
      isActive
        ? 'border-primary-600 text-slate-900'
        : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700'
    }`;

  const mobileNavLinkClass = ({ isActive }: { isActive: boolean }) =>
    `block pl-3 pr-4 py-2 border-l-4 text-base font-medium transition-colors ${
      isActive
        ? 'bg-primary-50 border-primary-600 text-primary-700'
        : 'border-transparent text-slate-600 hover:bg-slate-50 hover:border-slate-300 hover:text-slate-800'
    }`;

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-45">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            {/* Logo */}
            <Link to="/" className="flex-shrink-0 flex items-center space-x-2">
              <div className="bg-primary-600 text-white p-2 rounded-xl">
                <ShoppingCart className="h-5 w-5" />
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-900">
                Campus<span className="text-primary-600">Cart</span>
              </span>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden sm:ml-8 sm:flex sm:space-x-8">
              <NavLink to="/" className={navLinkClass}>
                <Tag className="h-4 w-4 mr-1.5" />
                Marketplace
              </NavLink>
              {user && (
                <>
                  <NavLink to="/create" className={navLinkClass}>
                    <PlusCircle className="h-4 w-4 mr-1.5" />
                    Create Listing
                  </NavLink>
                  <NavLink to="/my-listings" className={navLinkClass}>
                    <User className="h-4 w-4 mr-1.5" />
                    My Listings
                  </NavLink>
                </>
              )}
            </div>
          </div>

          {/* Desktop Right items */}
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {user ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 text-slate-700 font-medium text-sm bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">
                  <div className="w-6 h-6 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-xs uppercase">
                    {user.name.charAt(0)}
                  </div>
                  <span>{user.name}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center space-x-1.5 text-slate-500 hover:text-red-600 transition-colors text-sm font-medium focus:outline-none"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="text-slate-600 hover:text-slate-900 px-3 py-2 rounded-xl text-sm font-medium transition-colors"
                >
                  Log in
                </Link>
                <Link
                  to="/signup"
                  className="bg-primary-600 text-white hover:bg-primary-700 px-4 py-2 rounded-xl text-sm font-medium shadow-sm hover:shadow transition-all duration-200"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-xl text-slate-400 hover:text-slate-500 hover:bg-slate-100 focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="sm:hidden border-b border-slate-200 bg-white">
          <div className="pt-2 pb-3 space-y-1">
            <NavLink
              to="/"
              onClick={() => setIsOpen(false)}
              className={mobileNavLinkClass}
            >
              Marketplace
            </NavLink>
            {user && (
              <>
                <NavLink
                  to="/create"
                  onClick={() => setIsOpen(false)}
                  className={mobileNavLinkClass}
                >
                  Create Listing
                </NavLink>
                <NavLink
                  to="/my-listings"
                  onClick={() => setIsOpen(false)}
                  className={mobileNavLinkClass}
                >
                  My Listings
                </NavLink>
              </>
            )}
          </div>
          <div className="pt-4 pb-4 border-t border-slate-200 px-4">
            {user ? (
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-sm uppercase">
                    {user.name.charAt(0)}
                  </div>
                  <div>
                    <div className="text-base font-semibold text-slate-800">{user.name}</div>
                    <div className="text-sm font-medium text-slate-500">{user.email}</div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    handleLogout();
                  }}
                  className="w-full inline-flex justify-center items-center space-x-2 border border-slate-200 px-4 py-2.5 rounded-xl text-slate-600 hover:bg-red-50 hover:text-red-600 hover:border-red-100 transition-colors text-sm font-medium"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex flex-col space-y-2">
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="w-full inline-flex justify-center items-center px-4 py-2.5 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 text-sm font-medium"
                >
                  Log in
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setIsOpen(false)}
                  className="w-full inline-flex justify-center items-center px-4 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-sm font-medium shadow-sm"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
