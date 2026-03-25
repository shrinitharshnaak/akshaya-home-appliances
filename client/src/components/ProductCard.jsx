import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../slices/cartSlice';
import { Star } from 'lucide-react';

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const fastAddToCart = (e) => {
    e.preventDefault();
    dispatch(addToCart({ ...product, qty: 1 }));
  };

  return (
    <div className="bg-white p-4 h-full flex flex-col relative border border-transparent hover:border-gray-200 transition-colors shadow-sm rounded-sm">
      {/* IMAGE */}
      <Link to={`/product/${product._id}`} className="block relative w-full pt-[100%] bg-[#f8f8f8] mb-4">
        <img
          src={product.image}
          alt={product.name}
          className="absolute inset-0 w-full h-full object-contain p-4 mix-blend-multiply"
        />
        {product.countInStock === 0 && (
          <div className="absolute top-2 left-2 bg-red-600 text-white text-[10px] font-bold px-2 py-1 uppercase tracking-wider rounded-sm">
            Currently Unavailable
          </div>
        )}
      </Link>

      {/* INFORMATION */}
      <div className="flex flex-col flex-grow">
        {/* Title */}
        <Link to={`/product/${product._id}`}>
          <h3 className="text-[15px] font-medium text-[#0f1111] hover:text-[#c7511f] line-clamp-2 md:line-clamp-3 leading-snug mb-1">
            {product.name}
          </h3>
        </Link>
        <p className="text-xs text-gray-500 mb-2">{product.brand}</p>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-2">
          <div className="flex items-center text-[#ffa41c]">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                size={14} 
                fill={i < Math.floor(product.rating || 4.5) ? "currentColor" : "none"} 
                className={i < Math.floor(product.rating || 4.5) ? "text-[#ffa41c]" : "text-gray-300"} 
              />
            ))}
          </div>
          <span className="text-xs text-[#007185] hover:text-[#c7511f] hover:underline cursor-pointer">
            {product.numReviews || Math.floor(Math.random() * 500) + 50}
          </span>
        </div>

        {/* Price */}
        <div className="flex items-start mb-1">
          <span className="text-[13px] font-medium mt-1 mr-0.5 opacity-80">₹</span>
          <span className="text-[28px] font-medium text-[#0f1111] leading-none">
            {product.price?.toLocaleString('en-IN')}
          </span>
        </div>
        
        {/* Delivery / Shipping info */}
        <div className="text-xs text-gray-600 mb-4 flex-grow">
           <span className="text-[#007185] cursor-pointer hover:underline">FREE delivery</span> by Akshaya
        </div>

        {/* Add to Cart Button */}
        <div className="mt-auto pt-2">
          <button
            onClick={fastAddToCart}
            disabled={product.countInStock === 0}
            className={`w-full py-2 rounded-full text-sm font-medium shadow-sm transition-colors border ${product.countInStock === 0
                ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-[#ffd814] border-[#fcd200] hover:bg-[#f7ca00] text-black'
              }`}
          >
            {product.countInStock === 0 ? 'Out of Stock' : 'Add to cart'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;