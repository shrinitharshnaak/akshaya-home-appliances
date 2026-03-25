import React, { useEffect, useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { ShoppingCart, LogOut, Settings, Menu, X, ChevronDown, Heart, MapPin, Star } from 'lucide-react';
import { useSelector } from 'react-redux';
import SearchBox from './SearchBox';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  const { cartItems } = useSelector((state) => state.cart || { cartItems: [] });

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const logoutHandler = () => {
    localStorage.removeItem('userInfo');
    window.location.href = '/login';
  };

  return (
    <header className="w-full relative z-[100]">
      {/* Top Main Navigation */}
      <div className="bg-[#1e0a2d] text-white py-3 px-4 flex items-center justify-between gap-4">
        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="lg:hidden p-2 hover:border hover:border-white rounded-sm transition-all"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* LOGO */}
        <Link to="/" className="flex items-center px-2 py-1 hover:border hover:border-white rounded-sm transition-all focus:outline-none flex-shrink-0">
          <span className="text-xl md:text-2xl font-black uppercase italic tracking-tighter">
            Akshaya<span className="text-[#a855f7]">Appliances</span>
          </span>
        </Link>

        {/* DESKTOP SEARCH */}
        <div className="hidden lg:flex flex-grow max-w-[800px]">
          <SearchBox />
        </div>

        {/* ACTIONS & ACCOUNT */}
        <div className="flex items-center gap-1 md:gap-3 flex-shrink-0">
          {userInfo ? (
            <div className="group relative flex flex-col justify-center px-2 py-1 hover:border hover:border-white rounded-sm cursor-pointer h-full">
              <span className="text-[11px] md:text-xs text-gray-300">Hello, {userInfo.name.split(' ')[0]}</span>
              <span className="text-sm md:text-sm font-bold flex items-center gap-1">
                Account & Lists <ChevronDown size={14} className="text-gray-400 group-hover:text-white" />
              </span>
              
              {/* Dropdown Menu */}
              <div className="absolute top-12 right-0 bg-white text-black shadow-2xl border border-gray-200 rounded-xl w-72 hidden group-hover:flex flex-col p-6 animate-in fade-in slide-in-from-top-2">
                <div className="font-bold text-lg mb-4 border-b pb-2 text-[#1e0a2d]">Your Account</div>
                <div className="grid grid-cols-1 gap-1">
                   <DropdownLink to="/profile" label="Your Profile" />
                   <DropdownLink to="/orders" label="Your Orders" />
                   <DropdownLink to="/wishlist" label="Your Wish List" icon={<Heart size={14} />} />
                   <DropdownLink to="/addresses" label="Your Addresses" icon={<MapPin size={14} />} />
                   <DropdownLink to="/reviews" label="Your Reviews" icon={<Star size={14} />} />
                </div>

                {userInfo.isAdmin && (
                  <>
                    <div className="font-bold text-[10px] mt-6 mb-2 border-b pb-1 text-gray-400 uppercase tracking-widest">Administrative</div>
                    <Link to="/admin" className="py-2 text-sm hover:text-[#a855f7] flex items-center gap-2 font-bold">
                      <Settings size={16} /> Admin Dashboard
                    </Link>
                  </>
                )}
                
                <div className="border-t mt-4 pt-4">
                  <button onClick={logoutHandler} className="py-2 w-full text-left text-sm text-red-600 hover:text-red-700 font-bold flex items-center gap-2">
                    <LogOut size={16} /> Sign Out
                  </button>
                </div>
              </div>
            </div>
          ) : (
             <Link to="/login" className="flex flex-col justify-center px-2 py-1 hover:border hover:border-white rounded-sm cursor-pointer">
              <span className="text-[11px] md:text-xs text-gray-300">Hello, sign in</span>
              <span className="text-sm md:text-sm font-bold">Account & Lists</span>
            </Link>
          )}

          <Link to="/orders" className="hidden md:flex flex-col justify-center px-2 py-1 hover:border hover:border-white rounded-sm cursor-pointer">
            <span className="text-[11px] text-gray-300">Returns</span>
            <span className="text-sm font-bold">& Orders</span>
          </Link>

          <Link to="/cart" className="relative flex items-center px-2 py-1 hover:border hover:border-white rounded-sm">
            <div className="relative">
              <ShoppingCart size={32} />
              <span className="absolute -top-1 -right-1 bg-[#f97316] text-[#0f0418] text-[11px] font-black w-5 h-5 flex items-center justify-center rounded-full border-2 border-[#1e0a2d]">
                {cartItems.reduce((a, c) => a + c.qty, 0)}
              </span>
            </div>
            <span className="hidden md:block text-sm font-bold mt-3 ml-1">Cart</span>
          </Link>
        </div>
      </div>

      {/* Mobile Search Bar */}
      <div className="bg-[#1e0a2d] px-4 pb-3 lg:hidden flex">
        <div className="w-full">
          <SearchBox />
        </div>
      </div>

      {/* Secondary Navigation Bar (Bottom) */}
      <div className="bg-[#2d1240] text-gray-200 text-sm py-2 px-4 flex items-center gap-4 overflow-x-auto whitespace-nowrap scrollbar-hide">
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="flex items-center gap-1 font-bold hover:border hover:border-white px-2 py-1 rounded-sm">
          <Menu size={18} /> All
        </button>
        <SecondaryNavLink to="/search?category=refrigerators" label="Refrigerators" />
        <SecondaryNavLink to="/search?category=washing-machines" label="Washing Machines" />
        <SecondaryNavLink to="/search?category=air-conditioners" label="Air Conditioners" />
        <SecondaryNavLink to="/search?category=microwaves" label="Microwaves" />
        <SecondaryNavLink to="/search?category=televisions" label="Televisions" />
        <SecondaryNavLink to="/gallery" label="Showroom Offers" special />
      </div>

      {/* MOBILE SIDEBAR MENU */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[110] lg:hidden">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
          <div className="absolute top-0 left-0 bottom-0 w-[80%] max-w-[320px] bg-white text-black shadow-2xl flex flex-col overflow-y-auto transform transition-transform duration-300">
            <div className="bg-[#1e0a2d] text-white p-5 flex items-center gap-3">
              {userInfo ? (
                <>
                  <div className="w-10 h-10 bg-[#a855f7] rounded-full flex items-center justify-center font-black text-lg">
                    {userInfo.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="font-bold text-lg">Hello, {userInfo.name.split(' ')[0]}</div>
                </>
              ) : (
                <div className="font-bold text-lg">Hello, sign in</div>
              )}
              <button onClick={() => setIsMobileMenuOpen(false)} className="ml-auto p-1 hover:bg-white/10 rounded-full">
                <X size={24} />
              </button>
            </div>
            
            <div className="p-4 flex flex-col gap-1">
              <div className="font-black text-lg mb-2 text-gray-800">Trending Areas</div>
              <MobileNavLink to="/" label="Best Sellers" />
              <MobileNavLink to="/gallery" label="Showroom Offers" />
              <MobileNavLink to="/search?category=deals" label="Today's Deals" />
              
              <div className="border-t my-2 pt-2"></div>
              <div className="font-black text-lg mb-2 text-gray-800">Your Account</div>
              <MobileNavLink to="/profile" label="Your Account Hub" />
              <MobileNavLink to="/orders" label="Your Orders" />
              <MobileNavLink to="/wishlist" label="Your Lists" />
              <MobileNavLink to="/addresses" label="Your Addresses" />
              
              <div className="border-t my-2 pt-2"></div>
              <div className="font-black text-lg mb-2 text-gray-800">Customer Service</div>
              <MobileNavLink to="/about" label="About Akshaya" />
              <MobileNavLink to="/about" label="Help Center" />
              {userInfo ? (
                <button onClick={logoutHandler} className="text-left px-2 py-3 text-red-600 font-bold hover:bg-red-50 rounded-md mt-1">
                  Sign Out
                </button>
              ) : (
                <MobileNavLink to="/login" label="Sign In" />
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

const DropdownLink = ({ to, label, icon }) => (
  <Link to={to} className="py-2 text-sm text-gray-600 hover:text-[#a855f7] hover:underline flex items-center gap-2">
    {icon} {label}
  </Link>
);

const SecondaryNavLink = ({ to, label, special }) => (
  <Link 
    to={to} 
    className={`px-2 py-1 hover:border hover:border-gray-200 rounded-sm hover:text-white transition-colors flex items-center gap-1 ${special ? 'font-bold text-[#fbcfe8]' : ''}`}
  >
    {label}
  </Link>
);

const MobileNavLink = ({ to, label }) => (
  <Link to={to} className="px-2 py-3 text-gray-700 hover:bg-gray-100 hover:text-[#7e22ce] rounded-md transition-colors font-medium">
    {label}
  </Link>
);

export default Header;
