import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, ChevronRight, AlertCircle, Clock, XCircle, ShoppingCart } from 'lucide-react';
import API from '../services/api';
import { useDispatch } from 'react-redux';
import { addToCart } from '../slices/cartSlice';
import { useSearchParams } from 'react-router-dom';

const MyOrdersScreen = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'orders';
  
  const dispatch = useDispatch();

  const setActiveTab = (tab) => {
    setSearchParams({ tab });
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data } = await API.get('/orders/mine');
      setOrders(data);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      setLoading(false);
    }
  };

  const cancelOrderHandler = async (id) => {
    if (window.confirm('Are you sure you want to cancel this order?')) {
      try {
        await API.put(`/orders/${id}/cancel`);
        fetchOrders();
      } catch (err) {
        alert(err.response?.data?.message || err.message);
      }
    }
  };

  const buyAgainHandler = (item) => {
    dispatch(addToCart({ ...item, _id: item.product, qty: 1 }));
  };

  // Filtering Logic
  const filteredOrders = orders.filter(order => {
    if (activeTab === 'orders') return !order.isCancelled;
    if (activeTab === 'not-shipped') return order.isPaid && !order.isDelivered && !order.isCancelled;
    if (activeTab === 'cancelled') return order.isCancelled;
    return true;
  });

  // Unique products for "Buy Again"
  const buyAgainProducts = [];
  if (activeTab === 'buy-again') {
    const productIds = new Set();
    orders.forEach(order => {
      if (order.isPaid && !order.isCancelled) {
        order.orderItems.forEach(item => {
          if (!productIds.has(item.product)) {
            productIds.add(item.product);
            buyAgainProducts.push(item);
          }
        });
      }
    });
  }

  return (
    <div className="bg-[#f0f2f2] min-h-screen pb-20">
      <div className="max-w-[1000px] mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-xs text-gray-600 mb-4">
          <Link to="/profile" className="hover:text-[#c7511f] hover:underline">Your Account</Link>
          <ChevronRight size={12} />
          <span className="text-[#c7511f]">Your Orders</span>
        </nav>

        <h1 className="text-3xl font-medium text-[#0f1111] mb-6">Your Orders</h1>

        {/* Tabs style navigation */}
        <div className="flex border-b border-gray-300 mb-6 gap-8 text-sm font-medium overflow-x-auto whitespace-nowrap scrollbar-hide">
          <button 
            onClick={() => setActiveTab('orders')}
            className={`pb-2 transition-all ${activeTab === 'orders' ? 'border-b-2 border-[#f97316] text-[#0f1111]' : 'text-gray-600 hover:text-gray-800'}`}
          >
            Orders
          </button>
          <button 
            onClick={() => setActiveTab('buy-again')}
            className={`pb-2 transition-all ${activeTab === 'buy-again' ? 'border-b-2 border-[#f97316] text-[#0f1111]' : 'text-gray-600 hover:text-gray-800'}`}
          >
            Buy Again
          </button>
          <button 
            onClick={() => setActiveTab('not-shipped')}
            className={`pb-2 transition-all ${activeTab === 'not-shipped' ? 'border-b-2 border-[#f97316] text-[#0f1111]' : 'text-gray-600 hover:text-gray-800'}`}
          >
            Not Yet Shipped
          </button>
          <button 
            onClick={() => setActiveTab('cancelled')}
            className={`pb-2 transition-all ${activeTab === 'cancelled' ? 'border-b-2 border-[#f97316] text-[#0f1111]' : 'text-gray-600 hover:text-gray-800'}`}
          >
            Cancelled
          </button>
        </div>

        {loading ? (
          <div className="flex flex-col gap-4">
            {[1, 2, 3].map(n => (
              <div key={n} className="h-44 bg-white animate-pulse rounded-xl border border-gray-200" />
            ))}
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 p-6 rounded-xl flex items-center gap-3 text-red-700 shadow-sm">
            <AlertCircle size={24} />
            <p className="font-medium">{error}</p>
          </div>
        ) : (activeTab === 'buy-again' ? buyAgainProducts : filteredOrders).length === 0 ? (
          <div className="bg-white p-16 text-center rounded-2xl border border-gray-200 shadow-sm flex flex-col items-center">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6 text-gray-300">
               <Package size={40} />
            </div>
            <p className="text-xl font-bold text-gray-800 mb-2">No orders match this filter.</p>
            <p className="text-gray-500 mb-8 max-w-sm">When you buy item, they'll show up here for tracking and re-ordering.</p>
            <Link to="/" className="inline-block bg-[#ffd814] hover:bg-[#f7ca00] text-black px-10 py-3 rounded-full font-bold border border-[#fcd200] shadow-sm transition-transform hover:scale-105">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-8">
            {activeTab === 'buy-again' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                 {buyAgainProducts.map((item, idx) => (
                    <div key={idx} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex gap-4 hover:shadow-md transition-shadow">
                       <div className="w-24 h-24 bg-gray-50 rounded-xl flex-shrink-0">
                          <img src={item.image} alt={item.name} className="w-full h-full object-contain p-2" />
                       </div>
                       <div className="flex flex-col justify-between py-1">
                          <div>
                            <Link to={`/product/${item.product}`} className="text-sm font-bold text-[#007185] hover:text-[#c7511f] line-clamp-2 leading-tight mb-2">
                               {item.name}
                            </Link>
                            <p className="text-lg font-black text-[#0f1111]">₹{item.price?.toLocaleString('en-IN')}</p>
                          </div>
                          <button 
                            onClick={() => buyAgainHandler(item)}
                            className="bg-[#ffd814] hover:bg-[#f7ca00] text-black text-xs px-6 py-2 rounded-full border border-[#fcd200] shadow-sm font-black flex items-center justify-center gap-2 w-fit transition-all active:scale-95"
                          >
                             <ShoppingCart size={14} /> Buy it again
                          </button>
                       </div>
                    </div>
                 ))}
              </div>
            ) : filteredOrders.map((order) => (
              <div key={order._id} className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:ring-1 hover:ring-purple-100 transition-all">
                {/* Order Header */}
                <div className="bg-[#f0f2f2] px-8 py-4 border-b border-gray-200 flex flex-wrap justify-between items-center gap-6 text-[11px] text-gray-500 uppercase font-black tracking-widest">
                  <div className="flex gap-12">
                    <div className="flex flex-col gap-1">
                      <span>Order Placed</span>
                      <span className="text-[#0f1111] normal-case font-bold text-sm">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span>Total Price</span>
                      <span className="text-[#0f1111] normal-case font-black text-sm">₹{order.totalPrice?.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span>Ship To</span>
                      <span className="text-[#007185] hover:text-[#c7511f] hover:underline cursor-pointer normal-case font-bold text-sm">{order.shippingAddress?.city}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1 ml-auto">
                    <span className="flex items-center gap-1">Reference ID <span className="normal-case">{order._id.slice(-8).toUpperCase()}</span></span>
                    <Link to={`/order/${order._id}`} className="text-[#007185] hover:underline normal-case font-bold">Manage Order</Link>
                  </div>
                </div>

                {/* Order Body */}
                <div className="p-8">
                  <div className="flex flex-col lg:flex-row justify-between gap-10">
                    <div className="flex-grow">
                      <div className="flex items-center gap-3 font-black text-xl mb-6">
                        {order.isCancelled ? (
                          <div className="flex items-center gap-2 text-red-600">
                             <XCircle size={24} /> Cancelled {new Date(order.cancelledAt).toLocaleDateString()}
                          </div>
                        ) : order.isDelivered ? (
                          <div className="flex items-center gap-2 text-green-700">
                             <Package size={24} /> Delivered {new Date(order.deliveredAt).toLocaleDateString()}
                          </div>
                        ) : order.isPaid ? (
                          <div className="flex items-center gap-2 text-blue-700">
                             <Clock size={24} className="animate-pulse" /> Preparing for Shipping
                          </div>
                        ) : (
                          <div className="text-amber-600">Waiting for Payment</div>
                        )}
                      </div>

                      <div className="grid grid-cols-1 gap-6">
                        {order.orderItems.map((item, idx) => (
                          <div key={idx} className="flex gap-6 items-start group">
                            <Link to={`/product/${item.product}`} className="w-24 h-24 bg-gray-50 rounded-xl overflow-hidden flex-shrink-0 border border-gray-100 p-2 flex items-center justify-center">
                              <img src={item.image} alt={item.name} className="max-w-full max-h-full object-contain transform group-hover:scale-110 transition-transform" />
                            </Link>
                            <div className="flex flex-col gap-2 pt-1">
                              <Link to={`/product/${item.product}`} className="text-[#007185] hover:text-[#c7511f] hover:underline font-bold text-sm line-clamp-2 leading-snug max-w-lg">
                                {item.name}
                              </Link>
                              <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Quantity: {item.qty}</p>
                              {!order.isCancelled && (
                                <button 
                                  onClick={() => buyAgainHandler(item)}
                                  className="mt-2 bg-[#ffd814] hover:bg-[#f7ca00] text-black text-[11px] px-5 py-1.5 rounded-full border border-[#fcd200] shadow-sm font-black w-fit"
                                >
                                  Buy it again
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-3 min-w-[240px]">
                      <button className="w-full text-xs font-bold border border-gray-300 py-3 rounded-xl hover:bg-gray-50 shadow-sm transition-colors uppercase tracking-widest">Track package</button>
                      <Link to={`/order/${order._id}`} className="w-full text-center text-xs font-bold border border-gray-300 py-3 rounded-xl hover:bg-gray-50 shadow-sm transition-colors uppercase tracking-widest">Order Details</Link>
                      
                      {!order.isCancelled && !order.isDelivered && (
                        <button 
                          onClick={() => cancelOrderHandler(order._id)}
                          className="w-full text-xs font-black text-white bg-red-500 hover:bg-red-600 py-3 rounded-xl shadow-lg shadow-red-100 transition-all uppercase tracking-widest mt-2"
                        >
                          Cancel Order
                        </button>
                      )}
                      
                      {order.isDelivered && (
                        <button className="w-full text-xs font-bold border border-gray-300 py-3 rounded-xl hover:bg-gray-50 shadow-sm transition-colors uppercase tracking-widest">Write a Review</button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Footer status link */}
                {order.isPaid && !order.isCancelled && (
                  <div className="bg-gray-50 border-t border-gray-200 px-8 py-3 text-[10px] text-gray-400 font-bold uppercase tracking-widest flex items-center gap-2">
                     <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span> Your package is on its way to the delivery facility.
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrdersScreen;
