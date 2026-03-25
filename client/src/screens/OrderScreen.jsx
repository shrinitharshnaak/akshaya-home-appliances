import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle, Clock } from 'lucide-react';
import API from '../services/api';

const OrderScreen = () => {
  const { id: orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const deliverHandler = async () => {
    try {
      setLoading(true);
      await API.put(`/orders/${orderId}/deliver`);
      const { data } = await API.get(`/orders/${orderId}`);
      setOrder(data);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      setLoading(false);
    }
  };

  const payHandler = async () => {
    try {
      setLoading(true);
      await API.put(`/orders/${orderId}/pay`, { id: 'manual_payment', status: 'COMPLETED', update_time: new Date().toISOString() });
      const { data } = await API.get(`/orders/${orderId}`);
      setOrder(data);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const { data } = await API.get(`/orders/${orderId}`);
        setOrder(data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-12 h-12 border-4 border-[#ff9900] border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex items-center justify-center bg-white p-10">
      <div className="bg-red-50 border border-red-200 p-8 rounded text-center">
        <p className="text-[#B12704] font-bold">Error: {error}</p>
        <Link to="/" className="mt-4 inline-block text-[#007185] hover:underline">Return to Home</Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white font-sans text-[#0f1111] py-6 px-4 sm:px-12">
      <div className="max-w-5xl mx-auto">
        <div className="mb-4">
          <Link to="/profile" className="text-sm text-[#007185] hover:underline">&lt; Back to Your Account</Link>
        </div>

        <h1 className="text-3xl font-normal mb-6 tracking-tight">Order Details</h1>
        
        <div className="flex justify-between items-center text-sm text-gray-600 mb-4 sm:mb-2 flex-wrap gap-2">
           <div>
             Ordered on {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })} <span className="hidden sm:inline">|</span> <span className="block sm:inline">Order# {order._id}</span>
           </div>
           {/* Admin actions could go here as buttons if needed, or we keep them below */}
        </div>

        <div className="border border-[#d5d9d9] rounded-lg p-4 sm:p-6 mb-6">
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             <div className="col-span-1">
               <h3 className="font-bold text-sm mb-2">Shipping Address</h3>
               <div className="text-sm">
                 {order.user.name}<br />
                 {order.shippingAddress.address}<br />
                 {order.shippingAddress.city}, {order.shippingAddress.postalCode}<br />
                 Phone: {order.shippingAddress.phone}
               </div>
             </div>
             <div className="col-span-1">
               <h3 className="font-bold text-sm mb-2">Payment Method</h3>
               <div className="text-sm">
                 {order.paymentMethod}<br />
                 {order.isPaid ? (
                   <span className="text-[#007600] font-bold"><CheckCircle size={14} className="inline mr-1" />Paid on {new Date(order.paidAt).toLocaleDateString()}</span>
                 ) : (
                   <span className="text-[#B12704] font-bold"><Clock size={14} className="inline mr-1" />Payment Pending</span>
                 )}
               </div>
             </div>
             <div className="col-span-1">
               <h3 className="font-bold text-sm mb-2">Order Summary</h3>
               <div className="text-sm space-y-1">
                 <div className="flex justify-between"><span>Item(s) Subtotal:</span><span>₹{order.itemsPrice.toLocaleString('en-IN')}</span></div>
                 <div className="flex justify-between"><span>Shipping:</span><span>₹{order.shippingPrice === 0 ? '0.00' : order.shippingPrice.toLocaleString('en-IN')}</span></div>
                 <div className="flex justify-between"><span>Tax:</span><span>₹{order.taxPrice.toLocaleString('en-IN')}</span></div>
                 <div className="flex justify-between font-bold mt-2 pt-2 border-t text-base">
                   <span>Grand Total:</span><span>₹{order.totalPrice.toLocaleString('en-IN')}</span>
                 </div>
               </div>
             </div>
           </div>
        </div>

        <div className="border border-[#d5d9d9] rounded-lg">
           <div className="p-4 sm:p-6">
             <h2 className="text-xl font-bold mb-1">
               {order.isDelivered ? (
                 <span className="text-[#007600]">Delivered on {new Date(order.deliveredAt).toLocaleDateString()}</span>
               ) : (
                 <span>Arriving soon</span>
               )}
             </h2>
             <p className="text-sm text-gray-500 mb-6">
               Your package {order.isDelivered ? 'was handed directly to a resident' : 'is currently being processed securely'}.
             </p>

             <div className="space-y-6">
               {order.orderItems.map((item, index) => (
                 <div key={index} className="flex gap-4">
                   <div className="w-24 h-24 flex-shrink-0 cursor-pointer">
                     <img src={item.image} alt={item.name} className="w-full h-full object-contain mix-blend-multiply" />
                   </div>
                   <div className="flex-grow">
                     <h4 className="font-bold text-sm text-[#007185] hover:text-[#c7511f] hover:underline cursor-pointer tracking-tight line-clamp-2">{item.name}</h4>
                     <p className="text-xs text-gray-500 mt-1 mb-1">Sold by: Akshaya Appliances</p>
                     <p className="font-bold text-sm text-[#B12704]">₹{(item.qty * item.price).toLocaleString('en-IN')}</p>
                     
                     <div className="mt-4 flex gap-2">
                       <button className="bg-[#ffd814] hover:bg-[#f7ca00] text-black text-xs font-medium px-4 py-1.5 rounded-full border border-[#fcd200] shadow-sm">
                         Buy it again
                       </button>
                       <Link to={`/product/${item.product}`} className="bg-white hover:bg-gray-50 text-black text-xs font-medium px-4 py-1.5 rounded-full border border-gray-300 shadow-sm">
                         View your item
                       </Link>
                     </div>
                   </div>
                 </div>
               ))}
             </div>
           </div>
        </div>

        {/* ADMIN ACTIONS */}
        {JSON.parse(localStorage.getItem('userInfo'))?.isAdmin && (
          <div className="mt-8 border border-purple-200 bg-purple-50 p-6 rounded-lg">
            <h3 className="text-lg font-bold text-purple-700 mb-4">Admin Controls</h3>
            <div className="flex gap-4">
              {!order.isPaid && (
                <button
                  onClick={payHandler}
                  className="bg-white hover:bg-purple-100 text-purple-700 font-bold py-2 px-4 rounded border border-purple-300 shadow-sm"
                >
                  Mark as Paid
                </button>
              )}
              {order.isPaid && !order.isDelivered && (
                <button
                  onClick={deliverHandler}
                  className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded shadow-sm"
                >
                  Mark as Delivered
                </button>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default OrderScreen;