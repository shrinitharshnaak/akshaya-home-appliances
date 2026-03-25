import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Lock } from 'lucide-react';
import { saveShippingAddress } from '../slices/cartSlice';

const ShippingScreen = () => {
  const cart = useSelector((state) => state.cart);
  const { shippingAddress, cartItems } = cart;

  const [address, setAddress] = useState(shippingAddress?.address || '');
  const [city, setCity] = useState(shippingAddress?.city || '');
  const [postalCode, setPostalCode] = useState(shippingAddress?.postalCode || '');
  const [phone, setPhone] = useState(shippingAddress?.phone || '');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (cartItems.length === 0) {
      navigate('/cart');
    }
  }, [cartItems, navigate]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(saveShippingAddress({ address, city, postalCode, phone }));
    navigate('/placeorder');
  };

  return (
    <div className="min-h-screen bg-white font-sans text-[#0f1111]">
      {/* Super Simple Checkout Header */}
      <div className="border-b border-gray-300 bg-[#f8f8f8] py-4 px-6 flex justify-between items-center shadow-sm">
         <Link to="/" className="text-2xl font-bold tracking-tight text-[#0f1111] italic">Akshaya</Link>
         <h1 className="text-xl font-medium hidden sm:block">Checkout (1 item)</h1>
         <Lock size={20} className="text-gray-500" />
      </div>

      <div className="max-w-2xl mx-auto p-4 sm:p-8">
        <div className="mb-6 border-b pb-4">
          <h2 className="text-2xl font-bold mb-1 col-span-2">Select a delivering address</h2>
          <p className="text-sm text-gray-600">Please enter a delivery address for your order. We require a phone number in case of delivery issues.</p>
        </div>

        <form onSubmit={submitHandler} className="space-y-4">
          
          <div className="mb-4">
            <h3 className="font-bold text-lg mb-4">Add a new address</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold mb-1">Full name (First and Last name)</label>
                <input 
                  type="text" 
                  autoComplete="name"
                  required 
                  className="w-full bg-white border border-[#a6a6a6] border-t-[#949494] shadow-[0_1px_2px_rgba(15,17,17,.15)_inset] rounded-[3px] py-1 px-2 focus:ring-[#f97316] outline-none h-8 transition-shadow" 
                />
              </div>

              <div>
                <label className="block text-sm font-bold mb-1">Mobile number</label>
                <input 
                  type="tel" 
                  value={phone} 
                  onChange={(e) => setPhone(e.target.value)} 
                  required 
                  placeholder="10-digit mobile number"
                  className="w-full bg-white border border-[#a6a6a6] border-t-[#949494] shadow-[0_1px_2px_rgba(15,17,17,.15)_inset] rounded-[3px] py-1 px-2 focus:ring-[#f97316] outline-none h-8 transition-shadow" 
                />
                <p className="text-xs text-gray-500 mt-1">May be used to assist delivery</p>
              </div>

              <div>
                <label className="block text-sm font-bold mb-1">Pincode</label>
                <input 
                  type="text" 
                  value={postalCode} 
                  onChange={(e) => setPostalCode(e.target.value)} 
                  required 
                  placeholder="6 digits [0-9] PIN code"
                  className="w-full bg-white border border-[#a6a6a6] border-t-[#949494] shadow-[0_1px_2px_rgba(15,17,17,.15)_inset] rounded-[3px] py-1 px-2 focus:ring-[#f97316] outline-none h-8 transition-shadow" 
                />
              </div>

              <div>
                <label className="block text-sm font-bold mb-1">Flat, House no., Building, Company, Apartment</label>
                <input 
                  type="text" 
                  value={address} 
                  onChange={(e) => setAddress(e.target.value)} 
                  required 
                  className="w-full bg-white border border-[#a6a6a6] border-t-[#949494] shadow-[0_1px_2px_rgba(15,17,17,.15)_inset] rounded-[3px] py-1 px-2 focus:ring-[#f97316] outline-none h-8 transition-shadow" 
                />
              </div>

              <div>
                <label className="block text-sm font-bold mb-1">Town/City</label>
                <input 
                  type="text" 
                  value={city} 
                  onChange={(e) => setCity(e.target.value)} 
                  required 
                  className="w-full bg-white border border-[#a6a6a6] border-t-[#949494] shadow-[0_1px_2px_rgba(15,17,17,.15)_inset] rounded-[3px] py-1 px-2 focus:ring-[#f97316] outline-none h-8 transition-shadow" 
                />
              </div>

              <div className="flex items-center gap-2 mt-4 text-sm">
                <input type="checkbox" className="w-4 h-4 accent-[#007185]" />
                <label>Make this my default address</label>
              </div>

            </div>
          </div>

          <div className="bg-[#f3f3f3] p-4 rounded-md border border-[#d5d9d9] mt-6">
            <button 
              type="submit" 
              className="bg-[#ffd814] hover:bg-[#f7ca00] text-black w-full sm:w-auto px-6 py-2 rounded-lg text-sm font-medium shadow-sm transition-colors border border-[#fcd200]"
            >
              Use this address
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ShippingScreen;