import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#1e0a2d] text-white pt-2 mt-auto">
      {/* Back to top button */}
      <div 
        className="bg-[#2d1240] hover:bg-[#3d1a58] text-center py-4 cursor-pointer transition-colors"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        <span className="text-sm font-semibold">Back to top</span>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
        <div>
          <h3 className="font-bold text-base mb-4">Get to Know Us</h3>
          <ul className="space-y-2 text-sm text-gray-300">
            <li><Link to="/about" className="hover:underline">About Akshaya</Link></li>
            <li><Link to="#" className="hover:underline">Careers</Link></li>
            <li><Link to="#" className="hover:underline">Press Releases</Link></li>
            <li><Link to="#" className="hover:underline">Akshaya Science</Link></li>
          </ul>
        </div>
        
        <div>
          <h3 className="font-bold text-base mb-4">Connect with Us</h3>
          <ul className="space-y-2 text-sm text-gray-300">
            <li><a href="#" className="hover:underline">Facebook</a></li>
            <li><a href="#" className="hover:underline">Twitter</a></li>
            <li><a href="#" className="hover:underline">Instagram</a></li>
          </ul>
        </div>

        <div>
          <h3 className="font-bold text-base mb-4">Make Money with Us</h3>
          <ul className="space-y-2 text-sm text-gray-300">
            <li><Link to="#" className="hover:underline">Sell on Akshaya</Link></li>
            <li><Link to="#" className="hover:underline">Become an Affiliate</Link></li>
            <li><Link to="#" className="hover:underline">Advertise Your Products</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="font-bold text-base mb-4">Let Us Help You</h3>
          <ul className="space-y-2 text-sm text-gray-300">
            <li><Link to="/profile" className="hover:underline">Your Account</Link></li>
            <li><Link to="/orders" className="hover:underline">Returns Centre</Link></li>
            <li><Link to="#" className="hover:underline">Help</Link></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-[#3d1a58] py-8 mt-4">
        <div className="flex flex-col items-center justify-center gap-4">
          <Link to="/" className="text-2xl font-black uppercase italic tracking-tighter text-white hover:text-white">
            Akshaya<span className="text-[#a855f7]">Appliances</span>
          </Link>
          <div className="flex flex-wrap justify-center gap-4 text-xs text-gray-400 mt-2">
            <Link to="#" className="hover:underline">Conditions of Use & Sale</Link>
            <Link to="#" className="hover:underline">Privacy Notice</Link>
            <Link to="#" className="hover:underline">Interest-Based Ads</Link>
            <span>&copy; {currentYear}, Akshaya Appliances, Inc. or its affiliates</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;