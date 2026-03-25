import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, MessageSquare, ChevronRight, AlertCircle, ShoppingBag } from 'lucide-react';
import API from '../services/api';

const MyReviewsScreen = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const { data } = await API.get('/users/reviews');
      setReviews(data);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#f0f2f2] min-h-screen pb-20">
      <div className="max-w-[1000px] mx-auto px-4 py-8">
         {/* Breadcrumbs */}
         <nav className="flex items-center gap-2 text-xs text-gray-600 mb-4">
          <Link to="/profile" className="hover:text-[#c7511f] hover:underline">Your Account</Link>
          <ChevronRight size={12} />
          <span className="text-[#c7511f]">Your Reviews</span>
        </nav>

        <h1 className="text-3xl font-medium text-[#0f1111] mb-8">Your Reviews</h1>

        {loading ? (
             <div className="space-y-6">
                {[1,2,3].map(n => <div key={n} className="h-40 bg-white animate-pulse rounded-xl border border-gray-200" />)}
             </div>
        ) : error ? (
           <div className="bg-red-50 border border-red-200 p-6 rounded-xl flex items-center gap-4 text-red-700">
             <AlertCircle size={24} />
             <p className="font-medium">{error}</p>
           </div>
        ) : reviews.length === 0 ? (
          <div className="bg-white p-16 rounded-2xl border border-gray-200 text-center shadow-sm">
             <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300">
                <MessageSquare size={32} />
             </div>
             <h2 className="text-2xl font-bold text-[#0f1111] mb-2">No reviews yet</h2>
             <p className="text-gray-500 mb-8 max-w-md mx-auto">Share your experience with others! You can review products you've purchased from your order history.</p>
             <Link to="/orders" className="inline-block bg-[#1e0a2d] hover:bg-[#2d1240] text-white px-8 py-3 rounded-full font-bold shadow-lg transition-transform hover:scale-105 flex items-center gap-2 mx-auto w-fit">
                <ShoppingBag size={18} /> Review your orders
             </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {reviews.map((rev) => (
              <div key={rev._id} className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="flex flex-col md:flex-row">
                   {/* Product Info Sidebar */}
                   <div className="bg-gray-50 p-6 md:w-64 flex-shrink-0 border-b md:border-b-0 md:border-r border-gray-100 flex flex-col items-center text-center">
                      <div className="w-24 h-24 bg-white rounded-xl shadow-inner p-2 mb-4">
                         <img src={rev.productImage} alt={rev.productName} className="w-full h-full object-contain" />
                      </div>
                      <Link to={`/product/${rev.productId}`} className="text-xs font-bold text-[#007185] hover:text-[#c7511f] hover:underline line-clamp-2">
                        {rev.productName}
                      </Link>
                   </div>

                   {/* Review Content */}
                   <div className="p-8 flex-grow">
                      <div className="flex items-center justify-between mb-4">
                         <div className="flex items-center gap-3">
                           <div className="flex text-[#ffa41c]">
                              {[...Array(5)].map((_, i) => <Star key={i} size={18} fill={i < rev.rating ? "currentColor" : "none"} className="text-[#ffa41c]" />)}
                           </div>
                           <span className="bg-green-100 text-green-700 text-[10px] font-black uppercase px-2 py-0.5 rounded-sm tracking-widest">Verified Purchase</span>
                         </div>
                         <span className="text-xs text-gray-400 font-medium">{new Date(rev.createdAt).toLocaleDateString()}</span>
                      </div>
                      
                      <div className="bg-purple-50/50 p-6 rounded-2xl border border-purple-100/50 relative">
                         <div className="absolute top-2 left-3 text-4xl text-purple-200 font-serif leading-none">“</div>
                         <p className="text-[#0f1111] text-lg leading-relaxed relative z-10 italic">
                           {rev.comment}
                         </p>
                         <div className="absolute bottom-2 right-3 text-4xl text-purple-200 font-serif leading-none rotate-180">“</div>
                      </div>

                      <div className="mt-8 flex items-center gap-6">
                         <button className="text-sm font-bold text-gray-500 hover:text-[#a855f7] flex items-center gap-2">
                           Edit Review
                         </button>
                         <button className="text-sm font-bold text-gray-500 hover:text-red-600 flex items-center gap-2">
                           Delete
                         </button>
                      </div>
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

export default MyReviewsScreen;
