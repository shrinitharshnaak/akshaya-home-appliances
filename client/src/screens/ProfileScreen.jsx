import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Package, User, LogOut, Search, MapPin, Heart, Star, ShieldCheck } from 'lucide-react';
import API from '../services/api';

const ProfileScreen = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  useEffect(() => {
    if (!userInfo) {
      navigate('/login');
      return;
    }

    const fetchMyOrders = async () => {
      try {
        setLoading(true);
        const { data } = await API.get('/orders/mine');
        setOrders(data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
        setLoading(false);
      }
    };

    fetchMyOrders();
  }, [navigate]);

  const logoutHandler = () => {
    localStorage.removeItem('userInfo');
    navigate('/login');
  };

  const navCards = [
    { title: 'Your Orders', desc: 'Track, return, or buy things again', icon: <Package size={32} className="text-[#e47911]" />, link: '/orders' },
    { title: 'Login & security', desc: 'Edit login, name, and mobile number', icon: <ShieldCheck size={32} className="text-[#e47911]" />, link: '/profile/edit' },
    { title: 'Your Addresses', desc: 'Edit addresses for orders and gifts', icon: <MapPin size={32} className="text-[#e47911]" />, link: '/addresses' },
    { title: 'Your Lists', desc: 'View, modify, and share your lists', icon: <Heart size={32} className="text-[#e47911]" />, link: '/wishlist' },
    { title: 'Your Reviews', desc: 'View and manage your product feedback', icon: <Star size={32} className="text-[#e47911]" />, link: '/reviews' },
  ];

  return (
    <div className="min-h-screen bg-white font-sans text-[#0f1111] py-8 px-4 sm:px-12">
      <div className="max-w-5xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10">
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-normal tracking-tight">Your Account</h1>
            <span className="text-xl font-light text-gray-300 hidden sm:block">|</span>
            <span className="text-xl font-light hidden sm:block text-gray-600">Hello, {userInfo?.name?.split(' ')[0]}</span>
          </div>
          <button 
            onClick={logoutHandler}
            className="mt-4 sm:mt-0 px-6 py-2 bg-white border border-[#d5d9d9] hover:bg-[#f3f4f4] rounded-xl shadow-sm font-bold text-sm transition-colors"
          >
            Sign Out
          </button>
        </div>

        {/* Grid of Navigation Cards (Amazon Style Hub) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
           {navCards.map((card, idx) => (
             <Link key={idx} to={card.link} className="flex gap-4 p-6 border border-[#d5d9d9] rounded-xl hover:bg-gray-50 transition-colors shadow-sm">
                <div className="flex-shrink-0 pt-1">
                   {card.icon}
                </div>
                <div>
                   <h2 className="text-lg font-bold leading-tight">{card.title}</h2>
                   <p className="text-sm text-gray-500 mt-1">{card.desc}</p>
                </div>
             </Link>
           ))}
        </div>

        <div className="border-t border-gray-200 pt-10">
           <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold tracking-tight">Recent Orders</h2>
              <Link to="/orders" className="text-sm font-bold text-[#007185] hover:text-[#c7511f] hover:underline">View All Orders</Link>
           </div>

           {loading ? (
             <div className="flex justify-center p-20">
               <div className="w-10 h-10 border-4 border-[#ff9900] border-t-transparent rounded-full animate-spin"></div>
             </div>
           ) : error ? (
             <div className="p-6 bg-red-50 text-[#B12704] border border-red-200 rounded-2xl flex items-center gap-3">
               <AlertCircle size={24} />
               <p className="font-bold">Error: {error}</p>
             </div>
           ) : orders.length === 0 ? (
             <div className="text-center p-20 bg-[#f0f2f2] border border-[#d5d9d9] rounded-2xl">
               <p className="text-xl font-bold text-gray-800">No orders recently.</p>
               <Link to="/" className="text-[#007185] hover:underline mt-4 inline-block font-bold">Start exploring our collections</Link>
             </div>
           ) : (
             <div className="space-y-6">
                {orders.slice(0, 3).map((order) => (
                  <div key={order._id} className="border border-[#d5d9d9] rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                    <div className="bg-[#f0f2f2] px-8 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest flex flex-wrap justify-between items-center gap-6">
                       <div className="flex gap-12">
                          <div>
                            <p className="mb-1">Order Placed</p>
                            <p className="text-[#0f1111] normal-case text-sm">{new Date(order.createdAt).toLocaleDateString()}</p>
                          </div>
                          <div>
                            <p className="mb-1">Total</p>
                            <p className="text-[#0f1111] normal-case text-sm font-black">₹{order.totalPrice.toLocaleString('en-IN')}</p>
                          </div>
                       </div>
                       <Link to={`/order/${order._id}`} className="text-[#007185] hover:underline normal-case text-sm font-bold">Order Details</Link>
                    </div>
                    <div className="p-8 bg-white flex gap-6 overflow-x-auto scrollbar-hide">
                       {order.orderItems.map((item, idx) => (
                         <div key={idx} className="w-24 h-24 flex-shrink-0 border border-gray-100 p-2 rounded-xl">
                            <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                         </div>
                       ))}
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

export default ProfileScreen;