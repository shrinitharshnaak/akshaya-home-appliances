import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import API from '../../services/api';

const OrderListScreen = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data } = await API.get('/orders');
      setOrders(data);
      setLoading(false);
    } catch (err) {
      console.error("Order Sync Error:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const filteredOrders = orders.filter(o => 
    o._id.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (o.user && o.user.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="p-6 md:p-10 bg-gray-50 min-h-screen font-sans text-[#0f1111]">
      <div className="max-w-7xl mx-auto">
        {/* HEADER SECTION */}
        <div className="mb-6">
          <h1 className="text-3xl font-normal tracking-tight">Manage Orders</h1>
          <p className="text-sm text-gray-500 mt-1">View and process customer orders</p>
        </div>

        {/* DATA TABLE */}
        <div className="bg-white rounded-xl border border-[#d5d9d9] shadow-sm overflow-hidden">
          
          {/* Table Controls */}
          <div className="p-4 border-b border-[#d5d9d9] bg-[#f0f2f2] flex flex-wrap gap-4 justify-between items-center">
             <div className="flex gap-4 text-sm font-bold w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0">
                <span className="border-b-2 border-[#e47911] pb-1 cursor-pointer">All Orders</span>
                <span className="text-[#007185] hover:text-[#c7511f] hover:underline pb-1 cursor-pointer">Pending</span>
                <span className="text-[#007185] hover:text-[#c7511f] hover:underline pb-1 cursor-pointer">Shipped</span>
                <span className="text-[#007185] hover:text-[#c7511f] hover:underline pb-1 cursor-pointer">Cancelled</span>
             </div>
             <div className="relative flex-grow max-w-sm">
               <input 
                 type="text" 
                 placeholder="Search Order ID or Customer" 
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
                 className="pl-8 pr-3 py-1.5 border border-[#a6a6a6] rounded shadow-[0_1px_2px_rgba(15,17,17,.15)_inset] outline-none focus:border-[#e77600] focus:shadow-[0_0_3px_2px_rgba(228,121,17,.5)] text-sm w-full" 
               />
               <Search size={16} className="absolute left-2.5 top-2 text-gray-500" />
             </div>
          </div>

          {loading ? (
            <div className="p-20 flex justify-center">
              <div className="w-10 h-10 border-4 border-[#ff9900] border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-[#f0f2f2] border-b border-[#d5d9d9]">
                  <tr>
                    <th className="px-6 py-3 font-bold text-gray-700">Order ID</th>
                    <th className="px-6 py-3 font-bold text-gray-700">Order Date</th>
                    <th className="px-6 py-3 font-bold text-gray-700">Customer</th>
                    <th className="px-6 py-3 font-bold text-gray-700 text-right">Total</th>
                    <th className="px-6 py-3 font-bold text-gray-700">Order Status</th>
                    <th className="px-6 py-3 font-bold text-gray-700 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#d5d9d9]">
                  {filteredOrders.map((order) => (
                    <tr key={order._id} className="hover:bg-[#f3f4f4] transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-mono text-xs text-gray-600 mb-1">{order._id}</div>
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-bold">{order.user ? order.user.name : 'Guest'}</div>
                      </td>
                      <td className="px-6 py-4 text-right font-bold">
                        ₹{order.totalPrice.toLocaleString('en-IN')}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1">
                          <span className={order.isPaid ? 'text-[#007600] text-xs font-bold' : 'text-[#c45500] text-xs font-bold'}>
                            {order.isPaid ? 'Paid' : 'Payment Pending'}
                          </span>
                          <span className={order.isDelivered ? 'bg-[#007600] text-white px-2 py-0.5 rounded text-[10px] w-fit font-bold uppercase tracking-wide' : 'bg-gray-200 text-gray-800 px-2 py-0.5 rounded text-[10px] w-fit font-bold uppercase tracking-wide'}>
                            {order.isDelivered ? 'Shipped' : 'Unshipped'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => navigate(`/order/${order._id}`)}
                          className="bg-white border border-[#d5d9d9] hover:bg-gray-50 rounded-lg shadow-sm py-1 px-3 font-normal text-xs"
                        >
                          View Order
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredOrders.length === 0 && (
                     <tr>
                       <td colSpan="6" className="px-6 py-10 text-center text-gray-500">
                         No orders matching search criteria.
                       </td>
                     </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderListScreen;