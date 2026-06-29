import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Details from './pages/Details';
import CreateListing from './pages/CreateListing';
import EditListing from './pages/EditListing';
import MyListings from './pages/MyListings';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-slate-50 flex flex-col">
          <Navbar />
          
          <main className="flex-grow">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/listings/:id" element={<Details />} />

              {/* Protected Routes */}
              <Route element={<ProtectedRoute />}>
                <Route path="/create" element={<CreateListing />} />
                <Route path="/edit/:id" element={<EditListing />} />
                <Route path="/my-listings" element={<MyListings />} />
              </Route>

              {/* Fallback to Home */}
              <Route path="*" element={<Home />} />
            </Routes>
          </main>

          <footer className="bg-white border-t border-slate-200 py-6 text-center">
            <p className="text-xs text-slate-400 font-medium">
              &copy; {new Date().getFullYear()} CampusCart. Built for campus students.
            </p>
          </footer>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
