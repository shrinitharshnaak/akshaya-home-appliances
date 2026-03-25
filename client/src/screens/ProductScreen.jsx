import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ChevronLeft, ShoppingCart, Heart, Star, MapPin, ShieldCheck, Undo2, Lock } from 'lucide-react';
import { addToCart } from '../slices/cartSlice';
import API from '../services/api';

const ProductScreen = () => {
  const { id: productId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [product, setProduct] = useState({ reviews: [] });
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);
  
  // Review state
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewMessage, setReviewMessage] = useState('');

  const { userInfo } = useSelector((state) => state.auth || { userInfo: JSON.parse(localStorage.getItem('userInfo')) });

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const { data } = await API.get(`/products/${productId}`);
      setProduct(data);
      setLoading(false);
    } catch (error) {
      console.error('Vault Access Error:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [productId]);

  const addToCartHandler = () => {
    dispatch(addToCart({ ...product, qty }));
    navigate('/cart');
  };

  const addToWishlistHandler = async () => {
    if (!userInfo) {
      navigate('/login');
      return;
    }
    try {
      await API.post('/users/wishlist', { productId: product._id });
      alert('Added to Wish List!');
    } catch (err) {
      alert(err.response?.data?.message || 'Error adding to wishlist');
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setReviewLoading(true);
    setReviewMessage('');
    try {
      await API.post(`/products/${productId}/reviews`, { rating, comment });
      setReviewMessage('Review submitted successfully');
      setRating(0);
      setComment('');
      fetchProduct(); // Refresh reviews
    } catch (error) {
      setReviewMessage(error.response?.data?.message || 'Error submitting review');
    } finally {
      setReviewLoading(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white gap-4">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#c7511f]"></div>
      <p className="text-sm font-bold text-gray-500">Loading Product Details...</p>
    </div>
  );

  return (
    <div className="bg-white min-h-screen font-sans text-[#0f1111]">
      <div className="border-b bg-[#f5f5f5] py-2 px-4 text-sm text-gray-500 flex items-center gap-2">
        <Link to="/" className="hover:underline hover:text-[#c7511f]">Home</Link>
        <span>›</span>
        <Link to={`/search?category=${product.category?.toLowerCase()}`} className="hover:underline hover:text-[#c7511f] capitalize">{product.category}</Link>
        <span>›</span>
        <span className="text-gray-900 truncate max-w-xs">{product.name}</span>
      </div>

      <div className="max-w-[1500px] mx-auto p-4 lg:p-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Images */}
        <div className="lg:col-span-5 flex flex-col md:flex-row gap-4">
          <div className="hidden md:flex flex-col gap-2 w-16">
            <div className="w-12 h-12 border-2 border-[#1196ab] rounded-sm p-1 cursor-pointer">
              <img src={product.image} alt={product.name} className="w-full h-full object-contain" />
            </div>
            {/* Additional thumbnails would go here */}
          </div>
          <div className="flex-1 bg-white border border-transparent flex items-center justify-center p-8 sticky top-24 h-auto md:h-[500px]">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full max-h-[500px] object-contain cursor-zoom-in"
            />
          </div>
        </div>

        {/* Middle Column: Details */}
        <div className="lg:col-span-4 flex flex-col pt-2">
          <h1 className="text-2xl font-medium leading-tight mb-1">
            {product.name}
          </h1>
          <p className="text-sm text-[#007185] hover:underline cursor-pointer mb-2">Brand: {product.brand}</p>
          
          <div className="flex items-center gap-4 mb-2 border-b pb-2">
            <div className="flex items-center text-[#ffa41c]">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={18} fill={i < (product.rating || 0) ? "currentColor" : "none"} className={i < (product.rating || 0) ? "text-[#ffa41c]" : "text-gray-300"} />
              ))}
              <span className="text-[#007185] hover:text-[#c7511f] hover:underline cursor-pointer ml-2 text-sm">
                {product.numReviews} ratings
              </span>
            </div>
          </div>

          <div className="mb-4 pt-2">
            <div className="flex items-end mb-1">
              <span className="text-sm rounded-sm bg-[#cc0c39] text-white px-2 py-1 mr-2 font-bold mb-1">-20%</span>
              <span className="text-sm font-medium mt-1 mr-0.5 opacity-80 mb-1">₹</span>
              <span className="text-3xl font-medium leading-none">
                {product.price?.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="text-sm text-gray-500">
               M.R.P.: <span className="line-through">₹{(product.price * 1.2).toLocaleString('en-IN')}</span>
            </div>
            <div className="text-sm mt-2">Inclusive of all taxes</div>
            <div className="text-sm mt-1 mb-4 flex items-center font-bold">
               <span className="text-[#007185] border-b border-dotted border-[#007185]">EMI</span>&nbsp;starts at ₹{(product.price / 6).toFixed(0)}. No Cost EMI available <span className="text-[#007185] cursor-pointer hover:underline hover:text-[#c7511f] ml-1">EMI options</span>
            </div>
          </div>

          {/* Features / Icons */}
          <div className="flex gap-4 border-b border-t py-4 mb-4 overflow-x-auto">
            <div className="flex flex-col items-center flex-1 text-center min-w-[70px]">
              <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center mb-1 text-blue-600">
                <Undo2 size={24} strokeWidth={1.5} />
              </div>
              <span className="text-xs text-[#007185]">10 Days Replacement</span>
            </div>
            <div className="flex flex-col items-center flex-1 text-center min-w-[70px]">
              <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center mb-1 text-blue-600">
                <ShieldCheck size={24} strokeWidth={1.5} />
              </div>
              <span className="text-xs text-[#007185]">1 Year Warranty</span>
            </div>
            <div className="flex flex-col items-center flex-1 text-center min-w-[70px]">
              <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center mb-1 text-blue-600">
                <Lock size={24} strokeWidth={1.5} />
              </div>
              <span className="text-xs text-[#007185]">Secure Transaction</span>
            </div>
          </div>

          <h3 className="font-bold text-base mb-2">About this item</h3>
          <ul className="list-disc pl-5 text-sm space-y-1 mb-6 text-[#0f1111]">
            <li>{product.description}</li>
            <li>Energy efficient and highly durable.</li>
            <li>Comes with standard warranty and guaranteed support.</li>
            <li>Premium build quality specifically for modern homes.</li>
          </ul>
        </div>

        {/* Right Column: Checkout Box */}
        <div className="lg:col-span-3">
          <div className="border border-[#d5d9d9] rounded-lg p-4 bg-white sticky top-24 shadow-sm">
            <div className="text-2xl font-medium mb-2">
               <span className="text-sm top-[-0.5em] relative">₹</span>{product.price?.toLocaleString('en-IN')}
            </div>
            <div className="text-sm text-[#007185] mb-2 hover:underline cursor-pointer">FREE delivery <span className="text-[#0f1111] font-bold">Tomorrow, {new Date(new Date().getTime() + 24*60*60*1000).toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric'})}</span></div>
            <div className="text-sm mb-4">
              Or fastest delivery <span className="font-bold">Today</span>. Order within <span className="text-[#008a00]">3 hrs 5 mins</span>
            </div>

            <div className="flex items-center text-sm gap-2 mb-4 cursor-pointer">
               <MapPin size={16} /> 
               <span className="text-[#007185] hover:underline">Select delivery location</span>
            </div>

            <h3 className={`text-lg font-medium mb-4 ${product.countInStock > 0 ? "text-[#007600]" : "text-[#B12704]"}`}>
              {product.countInStock > 0 ? 'In stock' : 'Out of stock'}
            </h3>

            {product.countInStock > 0 && (
              <div className="mb-4">
                <label className="text-sm font-bold mr-2">Quantity:</label>
                <select 
                  value={qty} 
                  onChange={(e) => setQty(Number(e.target.value))}
                  className="bg-[#f0f2f2] border border-[#d5d9d9] rounded-md py-1 px-2 text-sm shadow-[0_2px_5px_rgba(15,17,17,.15)] focus:ring-[#f97316] outline-none"
                >
                  {[...Array(Math.min(product.countInStock, 10)).keys()].map((x) => (
                    <option key={x + 1} value={x + 1}>{x + 1}</option>
                  ))}
                </select>
              </div>
            )}

            <button
               onClick={addToCartHandler}
               disabled={product.countInStock === 0}
               className={`w-full py-2 mb-2 rounded-full text-sm font-medium shadow-sm transition-colors border ${product.countInStock === 0
                   ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
                   : 'bg-[#ffd814] border-[#fcd200] hover:bg-[#f7ca00] text-black'
                 }`}
             >
               Add to Cart
            </button>
            <button
               className={`w-full py-2 mb-4 rounded-full text-sm font-medium shadow-sm transition-colors border ${product.countInStock === 0
                   ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed hidden'
                   : 'bg-[#ffa41c] border-[#ff8f00] hover:bg-[#fa8900] text-black'
                 }`}
             >
               Buy Now
            </button>

            <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
              <span>Ships from</span>
              <span>Akshaya</span>
            </div>
            <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
              <span>Sold by</span>
              <span className="text-[#007185]">Akshaya Appliances</span>
            </div>

            <button 
              onClick={addToWishlistHandler}
              className="w-full text-left py-2 px-3 text-sm bg-white border border-[#d5d9d9] rounded-md hover:bg-[#f7fafa] shadow-sm mt-4 flex items-center justify-center gap-2"
            >
              <Heart size={16} /> Add to Wish List
            </button>
          </div>
        </div>
      </div>

      {/* REVIEWS SECTION */}
      <div className="max-w-[1500px] mx-auto p-4 lg:p-6 border-t mt-8 grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-4">
          <h2 className="text-2xl font-bold mb-4 text-[#0f1111]">Customer reviews</h2>
          <div className="flex items-center gap-2 mb-2">
            <div className="flex items-center text-[#ffa41c]">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={24} fill={i < (product.rating || 0) ? "currentColor" : "none"} className={i < (product.rating || 0) ? "text-[#ffa41c]" : "text-gray-300"} />
              ))}
            </div>
            <span className="text-lg font-bold">{product.rating} out of 5</span>
          </div>
          <p className="text-sm text-gray-500 mb-8">{product.numReviews} global ratings</p>

          {!userInfo ? (
            <div className="bg-gray-50 p-4 border rounded-md">
              <h3 className="font-bold mb-2">Review this product</h3>
              <p className="text-sm mb-4">Share your thoughts with other customers</p>
              <Link to="/login" className="block text-center w-full py-1 rounded-full text-sm shadow-sm border bg-white border-[#d5d9d9] hover:bg-[#f7fafa]">
                Sign in to write a review
              </Link>
            </div>
          ) : (
            <div className="border border-gray-200 rounded-lg p-6 bg-[#f8f8f8]">
              <h3 className="text-lg font-bold mb-4">Write a product review</h3>
              {reviewMessage && <div className="mb-4 text-sm font-bold text-red-600">{reviewMessage}</div>}
              <form onSubmit={submitHandler}>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Overall rating</label>
                  <select
                    required
                    value={rating}
                    onChange={(e) => setRating(e.target.value)}
                    className="w-full bg-white border border-[#d5d9d9] rounded-md py-2 px-3 text-sm focus:ring-1 focus:ring-[#f97316] outline-none"
                  >
                    <option value="">Select...</option>
                    <option value="1">1 - Poor</option>
                    <option value="2">2 - Fair</option>
                    <option value="3">3 - Good</option>
                    <option value="4">4 - Very Good</option>
                    <option value="5">5 - Excellent</option>
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Add a written review</label>
                  <textarea
                    required
                    rows="4"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="What did you like or dislike? What did you use this product for?"
                    className="w-full bg-white border border-[#d5d9d9] rounded-md py-2 px-3 text-sm focus:ring-1 focus:ring-[#f97316] outline-none resize-y"
                  ></textarea>
                </div>
                <button
                  disabled={reviewLoading}
                  type="submit"
                  className="w-full bg-white border border-gray-300 shadow-sm py-2 rounded-md font-medium text-sm hover:bg-gray-50 flex justify-center items-center"
                >
                  {reviewLoading ? <div className="animate-spin h-5 w-5 border-2 border-black border-t-transparent rounded-full"></div> : 'Submit Review'}
                </button>
              </form>
            </div>
          )}
        </div>

        <div className="lg:col-span-8">
          <h2 className="text-lg font-bold mb-6 text-[#0f1111]">Top reviews from India</h2>
          {product.reviews.length === 0 ? (
            <p className="text-gray-500 text-sm">No reviews yet. Be the first to review this product!</p>
          ) : (
             <div className="space-y-6">
               {product.reviews.map((review) => (
                 <div key={review._id} className="border-b pb-6">
                   <div className="flex items-center gap-2 mb-2">
                     <div className="w-8 h-8 rounded-full bg-gray-200 flex justify-center items-center text-gray-500 font-bold">
                       {review.name.charAt(0)}
                     </div>
                     <span className="text-sm font-medium">{review.name}</span>
                   </div>
                   <div className="flex items-center gap-2 mb-1">
                     <div className="flex text-[#ffa41c]">
                       {[...Array(5)].map((_, i) => (
                         <Star key={i} size={14} fill={i < review.rating ? "currentColor" : "none"} className={i < review.rating ? "text-[#ffa41c]" : "text-gray-300"} />
                       ))}
                     </div>
                     <span className="text-sm font-bold">{review.rating} / 5</span>
                   </div>
                   <p className="text-xs text-gray-500 mb-3">Reviewed on {new Date(review.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                   <p className="text-sm">{review.comment}</p>
                   <div className="mt-3 text-xs text-gray-500 flex items-center gap-4">
                     <button className="border border-gray-300 px-3 py-1 rounded-md hover:bg-gray-50">Helpful</button>
                     <span className="border-l pl-4 border-gray-300 cursor-pointer hover:underline text-[#007185]">Report abuse</span>
                   </div>
                 </div>
               ))}
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductScreen;