import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit, Trash2, Plus, Box, Loader2, AlertCircle } from 'lucide-react';
import API from '../../services/api';

const ProductListScreen = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchProducts = async () => {
    try {
      const { data } = await API.get('/products');
      setProducts(data.products || data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const deleteHandler = async (id) => {
    if (window.confirm('Exterminate this asset from inventory? This action is irreversible.')) {
      try {
        await API.delete(`/products/${id}`);
        fetchProducts(); // Refresh list after deletion
      } catch (err) {
        alert(err.response?.data?.message || "Deletion Protocol Failed");
      }
    }
  };

  return (
    <div className="p-6 md:p-10 bg-white min-h-screen font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400 mb-2">Internal Logistics</p>
            <h1 className="text-5xl md:text-6xl font-black uppercase italic tracking-tighter leading-none">
              Global <span className="text-purple-600 text-outline-dark">Inventory</span>
            </h1>
          </div>
          <button 
            onClick={() => navigate('/admin/product/add')}
            className="bg-black text-white px-8 py-5 rounded-2xl font-black uppercase italic text-xs hover:bg-purple-600 transition-all flex items-center gap-3 shadow-2xl shadow-purple-200 group"
          >
            <Plus size={20} className="group-hover:rotate-90 transition-transform" /> 
            Add New Asset
          </button>
        </div>

        {/* Table Container */}
        <div className="bg-black rounded-[2.5rem] md:rounded-[3.5rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.2)]">
          {loading ? (
            <div className="p-20 flex flex-col items-center justify-center text-zinc-500 gap-4">
              <Loader2 className="animate-spin text-purple-600" size={40} />
              <p className="text-[10px] font-black uppercase tracking-widest">Accessing Secure Database...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-white border-collapse">
                <thead className="bg-zinc-900/80 text-zinc-500 text-[10px] font-black uppercase tracking-widest border-b border-zinc-800">
                  <tr>
                    <th className="p-8">Appliance Specification</th>
                    <th className="p-8">Category</th>
                    <th className="p-8">Market Valuation</th>
                    <th className="p-8 text-right">Operational Control</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-900">
                  {products.map((p) => (
                    <tr key={p._id} className="hover:bg-zinc-900/40 transition-all group">
                      <td className="p-8">
                        <div className="flex items-center gap-5">
                          <div className="bg-zinc-800 p-4 rounded-2xl group-hover:bg-purple-600 transition-colors duration-500">
                            <Box className="text-white" size={20} />
                          </div>
                          <div>
                            <p className="font-black text-lg group-hover:text-purple-400 transition-colors uppercase tracking-tight">{p.name}</p>
                            <p className="text-[10px] text-zinc-500 uppercase font-black tracking-widest mt-1">{p.brand || 'Akshaya'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-8">
                        <span className="text-xs font-black text-zinc-400 uppercase tracking-widest bg-zinc-900 px-4 py-2 rounded-full border border-zinc-800">
                          {p.category}
                        </span>
                      </td>
                      <td className="p-8 font-black text-2xl italic text-white tracking-tighter">
                        ₹{p.price?.toLocaleString('en-IN')}
                      </td>
                      <td className="p-8 text-right">
                        <div className="flex justify-end gap-3 opacity-80 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => navigate(`/admin/product/${p._id}/edit`)}
                            className="p-4 bg-zinc-800 rounded-2xl hover:bg-white hover:text-black transition-all transform hover:-translate-y-1"
                            title="Edit Asset"
                          >
                            <Edit size={18} />
                          </button>
                          <button 
                            onClick={() => deleteHandler(p._id)}
                            className="p-4 bg-zinc-800 rounded-2xl hover:bg-red-600 text-red-500 hover:text-white transition-all transform hover:-translate-y-1"
                            title="Delete Asset"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {products.length === 0 && (
                <div className="p-20 text-center flex flex-col items-center gap-4">
                  <AlertCircle size={48} className="text-zinc-800" />
                  <p className="text-zinc-600 font-black uppercase italic tracking-widest text-xs">Inventory Core Empty</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductListScreen;