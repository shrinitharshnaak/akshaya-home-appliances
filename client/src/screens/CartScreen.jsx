import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Trash2, ShieldCheck, Info } from 'lucide-react';
import { addToCart, removeFromCart } from '../slices/cartSlice';

const CartScreen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart);
  const { cartItems, itemsPrice } = cart;

  const updateQtyHandler = (item, qty) => {
    if (qty > 0 && qty <= item.countInStock) {
      dispatch(addToCart({ ...item, qty }));
    }
  };

  const checkoutHandler = () => {
    navigate('/login?redirect=/shipping');
  };

  const totalItems = cartItems.reduce((acc, item) => acc + item.qty, 0);

  return (
    <div className="bg-[#eaeded] min-h-screen py-6 font-sans text-[#0f1111]">
      <div className="max-w-[1500px] mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Cart Items */}
        <div className="lg:col-span-9 bg-white p-6 shadow-sm">
          <div className="flex justify-between items-end border-b pb-4 mb-4">
            <h1 className="text-3xl font-medium">Shopping Cart</h1>
            <span className="text-sm text-gray-500 hidden sm:block">Price</span>
          </div>

          {cartItems.length === 0 ? (
            <div className="py-8">
              <h2 className="text-xl font-medium mb-4">Your Akshaya Cart is empty.</h2>
              <Link to="/" className="text-[#007185] hover:text-[#c7511f] hover:underline">
                Shop today's deals
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {cartItems.map((item) => (
                <div key={item._id} className="flex flex-col sm:flex-row gap-6 border-b pb-6">
                  {/* Image */}
                  <div className="sm:w-48 flex-shrink-0 cursor-pointer" onClick={() => navigate(`/product/${item._id}`)}>
                    <img src={item.image} alt={item.name} className="w-full h-auto object-contain mix-blend-multiply max-h-48" />
                  </div>

                  {/* Details */}
                  <div className="flex-grow flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between">
                        <h3 
                          className="text-lg font-medium text-[#007185] hover:text-[#c7511f] cursor-pointer hover:underline line-clamp-2 pr-4"
                          onClick={() => navigate(`/product/${item._id}`)}
                        >
                          {item.name}
                        </h3>
                        <p className="text-xl font-bold whitespace-nowrap hidden sm:block">
                          ₹{item.price.toLocaleString('en-IN')}
                        </p>
                      </div>
                      
                      <p className="text-xs text-[#007600] mt-1 mb-1">In stock</p>
                      <p className="text-xs text-gray-500 mb-1">Eligible for FREE Shipping</p>
                      <img src="https://m.media-amazon.com/images/G/31/marketing/fba/fba-badge_18px-2x._CB485936079_.png" alt="Fulfilled by Akshaya" className="h-[18px] mb-2 hidden md:block" />
                      
                      <div className="flex items-center gap-2 text-xs mb-3">
                        <input type="checkbox" className="w-3 h-3 accent-[#007185]" /> 
                        <span>This will be a gift <span className="text-[#007185] hover:underline cursor-pointer">Learn more</span></span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-4 text-sm mt-2">
                       <select 
                         value={item.qty} 
                         onChange={(e) => updateQtyHandler(item, Number(e.target.value))}
                         className="bg-[#f0f2f2] border border-[#d5d9d9] rounded-md py-1 px-2 text-sm shadow-[0_2px_5px_rgba(15,17,17,.15)] focus:ring-[#f97316] outline-none w-16"
                       >
                         {[...Array(Math.min(item.countInStock, 10)).keys()].map(x => (
                           <option key={x + 1} value={x + 1}>Qty: {x + 1}</option>
                         ))}
                       </select>
                       
                       <div className="h-4 border-l border-gray-300"></div>
                       
                       <button 
                         onClick={() => dispatch(removeFromCart(item._id))}
                         className="text-[#007185] hover:underline"
                       >
                         Delete
                       </button>

                       <div className="h-4 border-l border-gray-300"></div>

                       <button className="text-[#007185] hover:underline">
                         Save for later
                       </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {cartItems.length > 0 && (
            <div className="text-right mt-4">
              <span className="text-lg">Subtotal ({totalItems} items): </span>
              <span className="text-lg font-bold">₹{Number(itemsPrice).toLocaleString('en-IN')}</span>
            </div>
          )}
        </div>

        {/* Right Column: Checkout Summary */}
        <div className="lg:col-span-3">
          {cartItems.length > 0 && (
            <div className="bg-white p-6 shadow-sm mb-4">
              <div className="flex items-center gap-2 text-sm text-[#007600] mb-4">
                <ShieldCheck size={20} />
                <span>Your order is eligible for FREE Delivery.</span>
              </div>
              
              <div className="text-lg mb-6 text-center">
                Subtotal ({totalItems} items): <span className="font-bold">₹{Number(itemsPrice).toLocaleString('en-IN')}</span>
              </div>
              
              <div className="flex items-center gap-2 text-sm mb-4">
                <input type="checkbox" className="w-4 h-4 accent-[#007185]" /> 
                <span>This order contains a gift</span>
              </div>

              <button
                onClick={checkoutHandler}
                className="w-full bg-[#ffd814] hover:bg-[#f7ca00] text-black py-2 rounded-full text-sm font-medium shadow-sm transition-colors border border-[#fcd200] mb-4"
              >
                Proceed to Buy
              </button>

              <div className="border border-gray-200 rounded-md p-3 text-xs bg-gray-50 flex gap-2 items-start mt-4">
                 <Info size={16} className="text-gray-400 mt-0.5" />
                 <span>EMI Available. Secure payments with Akshaya guarantees.</span>
              </div>
            </div>
          )}
          
          <div className="bg-white p-4 shadow-sm border border-gray-200 rounded-md">
             <h3 className="font-bold text-sm mb-2">Akshaya's Recommendations</h3>
             <p className="text-xs text-gray-600">Based on your shopping trends, explore related high-end appliances to pair perfectly with your cart items.</p>
             <Link to="/search" className="text-xs text-[#007185] hover:underline mt-2 block">Explore more</Link>
          </div>
        </div>

      </div>
    </div>
  );
};

export default CartScreen;
