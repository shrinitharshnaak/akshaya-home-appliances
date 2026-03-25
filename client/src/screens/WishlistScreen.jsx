import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Trash2, ChevronRight, ShoppingCart, Star } from 'lucide-react';
import API from '../services/api';
import { useDispatch } from 'react-redux';
import { addToCart } from '../slices/cartSlice';

const WishlistScreen = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const dispatch = useDispatch();

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      const { data } = await API.get('/users/wishlist');
      setWishlist(data);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      setLoading(false);
    }
  };

  const handleRemove = async (id) => {
    try {
      await API.delete(`/users/wishlist/${id}`);
      setWishlist(wishlist.filter(item => item._id !== id));
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  const handleAddToCart = (product) => {
    dispatch(addToCart({ ...product, qty: 1 }));
  };

  return (
    <div className="bg-[#f0f2f2] min-h-screen pb-20">
      <div className="max-w-[1200px] mx-auto px-4 py-8">
         {/* Breadcrumbs */}
         <nav className="flex items-center gap-2 text-xs text-gray-600 mb-4">
          <Link to="/profile" className="hover:text-[#c7511f] hover:underline">Your Account</Link>
          <ChevronRight size={12} />
          <span className="text-[#c7511f]">Your Lists</span>
        </nav>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
           <h1 className="text-3xl font-medium text-[#0f1111]">Your Wish List</h1>
           <div className="flex items-center gap-2 text-sm text-gray-600">
             <span className="bg-white px-3 py-1 rounded-full border border-gray-300 shadow-sm font-bold">Default List</span>
             <span className="text-gray-400">|</span>
             <button className="text-[#007185] hover:underline">Create a List</button>
           </div>
        </div>

        {loading ? (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[1,2,3,4].map(n => <div key={n} className="aspect-[3/4] bg-white animate-pulse rounded-xl border border-gray-200 shadow-sm" />)}
             </div>
        ) : error ? (
          <div className="bg-white p-8 rounded-xl border border-gray-200 text-center shadow-sm">
             <AlertCircle className="mx-auto text-red-500 mb-4" size={32} />
             <p className="text-lg font-bold text-gray-800">{error}</p>
          </div>
        ) : wishlist.length === 0 ? (
          <div className="bg-white p-16 rounded-2xl border border-gray-200 text-center shadow-sm max-w-2xl mx-auto">
             <div className="w-20 h-20 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-6 text-[#a855f7]">
                <Heart size={40} strokeWidth={1.5} />
             </div>
             <h2 className="text-2xl font-bold text-[#0f1111] mb-2">Build your dream setup</h2>
             <p className="text-gray-600 mb-8">Save items you love here and keep track of price drops!</p>
             <Link to="/" className="inline-block bg-[#ffd814] hover:bg-[#f7ca00] text-black px-10 py-3 rounded-full font-bold border border-[#fcd200] shadow-sm transition-transform hover:scale-105">
                Go back to shopping
             </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlist.map((item) => (
              <div key={item._id} className="bg-white rounded-2xl border border-gray-200 p-5 flex flex-col relative group hover:shadow-xl transition-all duration-300">
                {/* Remove button (Amazon style top right) */}
                <button 
                  onClick={() => handleRemove(item._id)}
                  className="absolute top-3 right-3 p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors z-10"
                >
                   <Trash2 size={18} />
                </button>

                <Link to={`/product/${item._id}`} className="block relative aspect-square bg-gray-50 rounded-xl overflow-hidden mb-4">
                  <img src={item.image} alt={item.name} className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-500" />
                </Link>

                <div className="flex flex-col flex-grow">
                   <Link to={`/product/${item._id}`} className="text-sm font-bold text-[#0f1111] hover:text-[#c7511f] line-clamp-2 mb-2 leading-tight">
                     {item.name}
                   </Link>
                   
                   <div className="flex items-center gap-1 mb-3">
                      <div className="flex text-[#ffa41c]">
                        {[...Array(5)].map((_, i) => <Star key={i} size={12} fill={i < Math.floor(item.rating) ? "currentColor" : "none"} className="text-[#ffa41c]" />)}
                      </div>
                      <span className="text-[10px] font-bold text-[#007185]">{item.numReviews}</span>
                   </div>

                   <div className="flex items-baseline gap-0.5 mb-4">
                     <span className="text-xs font-bold -mt-2">₹</span>
                     <span className="text-2xl font-black text-[#0f1111]">{item.price?.toLocaleString('en-IN')}</span>
                   </div>

                   <div className="mt-auto flex flex-col gap-2">
                      <button 
                        onClick={() => handleAddToCart(item)}
                        disabled={item.countInStock === 0}
                        className={`w-full py-2.5 rounded-full text-xs font-black shadow-sm flex items-center justify-center gap-2 border transition-all ${item.countInStock === 0 ? 'bg-gray-100 border-gray-200 text-gray-400' : 'bg-[#ffd814] border-[#fcd200] hover:bg-[#f7ca00] text-black'}`}
                      >
                         <ShoppingCart size={14} /> {item.countInStock === 0 ? 'Out of Stock' : 'Add to Cart'}
                      </button>
                      <button className="w-full py-2 text-xs font-bold text-[#007185] hover:text-[#c7511f] hover:underline">
                        Move to another list
                      </button>
                   </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WishlistScreen;
