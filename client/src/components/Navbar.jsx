import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, LogOut, LayoutDashboard } from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();
  // Get user data to show Admin/Customer labels
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  const logoutHandler = () => {
    localStorage.removeItem('userInfo');
    navigate('/login');
    window.location.reload(); 
  };

  return (
    <nav className="bg-white border-b border-gray-100 py-4 px-6 sticky top-0 z-[999] shadow-sm">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* BRAND LOGO */}
        <Link to="/" className="text-2xl font-black italic uppercase tracking-tighter">
          Akshaya<span className="text-blue-600">.</span>
        </Link>

        {/* NAVIGATION LINKS */}
        <div className="flex items-center gap-4 md:gap-8">
          <Link to="/cart" className="relative p-2 hover:bg-gray-50 rounded-full transition-all group">
            <ShoppingCart size={22} className="group-hover:text-blue-600" />
          </Link>

          {userInfo ? (
            <div className="flex items-center gap-4">
              <div className="flex flex-col items-end">
                <span className="text-[10px] font-black uppercase tracking-widest text-black">
                  {userInfo.name}
                </span>
                {userInfo.isAdmin && (
                  <span className="text-[8px] font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-2 rounded-full">
                    Admin Mode
                  </span>
                )}
              </div>
              
              <button 
                onClick={logoutHandler} 
                className="bg-gray-50 p-2 rounded-xl hover:bg-red-50 hover:text-red-600 transition-all"
                title="Logout"
              >
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <Link 
              to="/login" 
              className="bg-black text-white px-6 py-2 rounded-xl font-black text-[11px] uppercase tracking-widest hover:bg-blue-600 transition-all"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;