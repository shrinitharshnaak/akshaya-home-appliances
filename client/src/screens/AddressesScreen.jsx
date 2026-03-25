import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Plus, Trash2, Home, CheckCircle, ChevronRight, AlertCircle } from 'lucide-react';
import API from '../services/api';

const AddressesScreen = () => {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    address: '', city: '', postalCode: '', phone: '', country: 'India', isDefault: false
  });

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      const { data } = await API.get('/users/addresses');
      setAddresses(data);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      setLoading(false);
    }
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    try {
      await API.post('/users/addresses', formData);
      setShowAddForm(false);
      setFormData({ address: '', city: '', postalCode: '', phone: '', country: 'India', isDefault: false });
      fetchAddresses();
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to remove this address?')) {
      try {
        await API.delete(`/users/addresses/${id}`);
        fetchAddresses();
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      }
    }
  };

  const handleSetDefault = async (id) => {
    try {
      await API.put(`/users/addresses/${id}`, { isDefault: true });
      fetchAddresses();
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  return (
    <div className="bg-[#f0f2f2] min-h-screen pb-20">
      <div className="max-w-[1000px] mx-auto px-4 py-8">
         {/* Breadcrumbs */}
         <nav className="flex items-center gap-2 text-xs text-gray-600 mb-4">
          <Link to="/profile" className="hover:text-[#c7511f] hover:underline">Your Account</Link>
          <ChevronRight size={12} />
          <span className="text-[#c7511f]">Your Addresses</span>
        </nav>

        <h1 className="text-3xl font-medium text-[#0f1111] mb-8">Your Addresses</h1>

        {error && (
          <div className="bg-red-50 border border-red-200 p-4 rounded-md flex items-center gap-3 text-red-700 mb-6">
            <AlertCircle size={20} />
            <p>{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* ADD ADDRESS CARD */}
          <div 
            onClick={() => setShowAddForm(true)}
            className="border-2 border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center justify-center text-gray-500 hover:bg-gray-50 hover:border-gray-400 cursor-pointer transition-all aspect-[4/3] group"
          >
            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Plus size={32} strokeWidth={1.5} />
            </div>
            <span className="text-lg font-bold">Add Address</span>
          </div>

          {addresses.map((addr) => (
            <div key={addr._id} className={`bg-white rounded-xl border p-6 flex flex-col relative aspect-[4/3] shadow-sm transition-all ${addr.isDefault ? 'ring-2 ring-[#f97316] border-transparent' : 'border-gray-200'}`}>
              {addr.isDefault && (
                <div className="absolute top-0 right-0 bg-[#f97316] text-white text-[10px] font-black uppercase px-3 py-1 rounded-bl-lg rounded-tr-xl flex items-center gap-1">
                  <CheckCircle size={10} /> Default
                </div>
              )}
              
              <div className="flex items-center gap-2 text-gray-400 mb-4 font-bold text-xs uppercase tracking-widest">
                <MapPin size={14} /> {addr.city}
              </div>
              
              <div className="flex-grow space-y-1">
                <p className="text-[#0f1111] font-bold text-lg leading-tight">{addr.address}</p>
                <p className="text-gray-600 text-sm">{addr.city}, {addr.postalCode}</p>
                <p className="text-gray-600 text-sm">{addr.country}</p>
                <p className="text-gray-500 text-sm mt-3 flex items-center gap-2">
                  <span className="font-medium text-gray-400">Phone:</span> {addr.phone}
                </p>
              </div>

              <div className="mt-6 flex items-center gap-4 pt-4 border-t border-gray-100">
                <button className="text-sm text-[#007185] hover:text-[#c7511f] hover:underline font-medium">Edit</button>
                <div className="h-4 w-px bg-gray-200"></div>
                <button onClick={() => handleDelete(addr._id)} className="text-sm text-[#007185] hover:text-[#c7511f] hover:underline font-medium">Remove</button>
                {!addr.isDefault && (
                  <>
                    <div className="h-4 w-px bg-gray-200"></div>
                    <button onClick={() => handleSetDefault(addr._id)} className="text-sm text-[#007185] hover:text-[#c7511f] hover:underline font-medium">Set as Default</button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* MODAL FORM (Overlay) */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
               <div className="bg-[#1e0a2d] text-white p-6 flex justify-between items-center">
                  <h2 className="text-xl font-bold">Add a new address</h2>
                  <button onClick={() => setShowAddForm(false)} className="text-white/70 hover:text-white">✕</button>
               </div>
               
               <form onSubmit={handleAddAddress} className="p-8 space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Street address</label>
                    <input 
                      required
                      type="text" 
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f97316] outline-none transition-all"
                      value={formData.address}
                      onChange={(e) => setFormData({...formData, address: e.target.value})}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">City</label>
                      <input 
                        required
                        type="text" 
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f97316] outline-none"
                        value={formData.city}
                        onChange={(e) => setFormData({...formData, city: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">Postal Code</label>
                      <input 
                        required
                        type="text" 
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f97316] outline-none"
                        value={formData.postalCode}
                        onChange={(e) => setFormData({...formData, postalCode: e.target.value})}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Phone number</label>
                    <input 
                      required
                      type="text" 
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f97316] outline-none"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    />
                  </div>
                  <div className="flex items-center gap-2 pt-2">
                    <input 
                      type="checkbox" 
                      id="default-cb"
                      className="w-4 h-4 rounded border-gray-300 text-[#f97316] focus:ring-[#f97316]"
                      checked={formData.isDefault}
                      onChange={(e) => setFormData({...formData, isDefault: e.target.checked})}
                    />
                    <label htmlFor="default-cb" className="text-sm text-gray-600">Make this my default address</label>
                  </div>

                  <div className="pt-6 flex gap-3">
                    <button type="submit" className="flex-grow bg-[#ffd814] hover:bg-[#f7ca00] text-black py-3 rounded-xl font-bold border border-[#fcd200] shadow-sm">
                      Add address
                    </button>
                    <button type="button" onClick={() => setShowAddForm(false)} className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-colors">
                      Cancel
                    </button>
                  </div>
               </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddressesScreen;
