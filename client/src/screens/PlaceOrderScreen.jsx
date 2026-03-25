import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Lock } from 'lucide-react';
import API from '../services/api';
import { clearCartItems } from '../slices/cartSlice';

const PlaceOrderScreen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);

  const totalItems = cart.cartItems.reduce((acc, item) => acc + item.qty, 0);

  const placeOrderHandler = async () => {
    try {
      const { data } = await API.post('/orders', {
        orderItems: cart.cartItems,
        shippingAddress: {
          address: cart.shippingAddress.address,
          city: cart.shippingAddress.city,
          postalCode: cart.shippingAddress.postalCode,
          phone: cart.shippingAddress.phone,
        },
        paymentMethod: 'Cash on Delivery',
        itemsPrice: Number(cart.itemsPrice),
        shippingPrice: Number(cart.shippingPrice),
        taxPrice: Number(cart.taxPrice),
        totalPrice: Number(cart.totalPrice),
      });

      dispatch(clearCartItems());
      navigate(`/order/${data._id}`);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Order Placement Failed');
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans text-[#0f1111]">
      {/* Super Simple Checkout Header */}
      <div className="border-b border-gray-300 bg-[#f8f8f8] py-4 px-6 flex justify-between items-center shadow-sm">
         <Link to="/" className="text-2xl font-bold tracking-tight text-[#0f1111] italic">Akshaya</Link>
         <h1 className="text-xl font-medium hidden sm:block">Checkout ({totalItems} items)</h1>
         <Lock size={20} className="text-gray-500" />
      </div>

      <div className="max-w-5xl mx-auto p-4 sm:p-8 grid grid-cols-1 md:grid-cols-12 gap-8">
        
        {/* Left Column: Review sections */}
        <div className="md:col-span-8 space-y-6">
           <h2 className="text-2xl font-bold mb-4">Review your order</h2>

           <div className="border border-[#d5d9d9] rounded-lg p-4">
             <div className="grid grid-cols-3 mb-4">
               <div className="col-span-1">
                 <h3 className="font-bold">Shipping address <Link to="/shipping" className="text-sm font-normal text-[#007185] ml-2 hover:underline">Change</Link></h3>
                 <div className="text-sm">
                   {cart.shippingAddress.address}<br />
                   {cart.shippingAddress.city}<br />
                   {cart.shippingAddress.postalCode}<br />
                   Phone: {cart.shippingAddress.phone}
                 </div>
               </div>
               <div className="col-span-1">
                 <h3 className="font-bold">Payment method <span className="text-sm font-normal text-[#007185] ml-2 hover:cursor-pointer hover:underline">Change</span></h3>
                 <div className="text-sm mb-2">Simulated Cash on Delivery</div>
                 <div className="text-[#007185] text-sm hover:underline hover:cursor-pointer flex items-center gap-1">Add a gift card or promo code</div>
               </div>
             </div>
           </div>

           <div className="border border-[#d5d9d9] rounded-lg p-6">
             <h3 className="font-bold text-lg mb-2 text-[#c45500]">Guaranteed delivery by Tomorrow</h3>
             <p className="text-sm text-gray-500 mb-6">If you order in the next 3 hours and 15 minutes</p>
             
             <div className="space-y-4">
               {cart.cartItems.map((item, index) => (
                 <div key={index} className="flex gap-4 mb-4">
                   <div className="w-24 flex-shrink-0">
                     <img src={item.image} alt={item.name} className="w-full h-auto object-contain mix-blend-multiply" />
                   </div>
                   <div>
                     <h4 className="font-bold text-[#007185] text-sm mb-1">{item.name}</h4>
                     <p className="text-[#B12704] font-bold text-sm mb-1">₹{item.price.toLocaleString('en-IN')}</p>
                     <p className="text-xs text-gray-500 mb-1">Quantity: {item.qty}</p>
                     <p className="text-xs text-green-700">Sold by: Akshaya Appliances</p>
                   </div>
                 </div>
               ))}
             </div>
           </div>

        </div>

        {/* Right Column: Place Order Panel */}
        <div className="md:col-span-4">
           <div className="border border-[#d5d9d9] rounded-lg p-5">
             <button
                onClick={placeOrderHandler}
                className="w-full bg-[#ffd814] hover:bg-[#f7ca00] text-black py-2 rounded-lg text-sm font-medium shadow-sm transition-colors border border-[#fcd200] mb-4"
              >
                Place your order
             </button>
             <p className="text-xs text-center text-gray-600 mb-4 border-b pb-4">
               By placing your order, you agree to Akshaya's <span className="text-[#007185] hover:underline cursor-pointer">privacy notice</span> and <span className="text-[#007185] hover:underline cursor-pointer">conditions of use</span>.
             </p>

             <h3 className="font-bold mb-2 text-lg">Order Summary</h3>
             <div className="text-sm space-y-2 mb-2 pb-2 border-b">
               <div className="flex justify-between">
                 <span>Items:</span>
                 <span>₹{cart.itemsPrice}</span>
               </div>
               <div className="flex justify-between">
                 <span>Delivery:</span>
                 <span>₹{cart.shippingPrice}</span>
               </div>
             </div>
             <div className="flex justify-between font-bold text-[#B12704] text-xl mb-4">
                <span>Order Total:</span>
                <span>₹{cart.totalPrice}</span>
             </div>

             <div className="bg-[#f0f2f2] p-3 text-xs -mx-5 -mb-5 rounded-b-lg border-t border-[#d5d9d9]">
                <a href="#" className="flex items-center text-[#007185] hover:underline">How are shipping costs calculated?</a>
             </div>
           </div>
        </div>

      </div>
    </div>
  );
};

export default PlaceOrderScreen;