import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import API from '../../services/api';

const AdminProductListScreen = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const getProducts = async () => {
      try {
        const { data } = await API.get('/products');
        setProducts(data.products || data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    getProducts();
  }, []);

  const deleteHandler = async (id) => {
    if (window.confirm('Are you sure you want to delete this appliance?')) {
      try {
        await API.delete(`/products/${id}`);
        setProducts(products.filter(p => p._id !== id));
      } catch (err) {
        alert('Error deleting product');
      }
    }
  };

  const filteredProducts = products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.category.toLowerCase().includes(searchTerm.toLowerCase()));

  if (loading) return (
    <div className="flex justify-center p-20 min-h-screen bg-gray-50">
      <div className="w-10 h-10 border-4 border-[#ff9900] border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="p-6 md:p-10 bg-gray-50 min-h-screen font-sans text-[#0f1111]">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-normal tracking-tight">Manage Inventory</h1>
            <p className="text-sm text-gray-500 mt-1">Review, update, and add new products to your catalog</p>
          </div>
          <button 
            onClick={() => navigate('/admin/product/create')}
            className="bg-[#ffd814] hover:bg-[#f7ca00] text-black px-6 py-2 rounded-lg text-sm font-medium shadow-sm transition-colors border border-[#fcd200] flex items-center gap-2"
          >
            <Plus size={16} /> Add a Product
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-[#d5d9d9] overflow-hidden">
          {/* Table Controls */}
          <div className="p-4 border-b border-[#d5d9d9] bg-[#f0f2f2] flex justify-between items-center">
             <div className="relative">
               <input 
                 type="text" 
                 placeholder="Search SKU, Title, ASIN" 
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
                 className="pl-8 pr-3 py-1.5 border border-[#a6a6a6] rounded shadow-[0_1px_2px_rgba(15,17,17,.15)_inset] outline-none focus:border-[#e77600] focus:shadow-[0_0_3px_2px_rgba(228,121,17,.5)] text-sm w-full sm:w-64" 
               />
               <Search size={16} className="absolute left-2.5 top-2 text-gray-500" />
             </div>
             <div className="text-sm text-gray-600">
               {filteredProducts.length} items
             </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-[#f0f2f2] border-b border-[#d5d9d9]">
                <tr>
                  <th className="px-6 py-3 font-bold text-gray-700">Image</th>
                  <th className="px-6 py-3 font-bold text-gray-700">Product Name</th>
                  <th className="px-6 py-3 font-bold text-gray-700">Category</th>
                  <th className="px-6 py-3 font-bold text-gray-700 text-right">Price</th>
                  <th className="px-6 py-3 font-bold text-gray-700 text-center">Available</th>
                  <th className="px-6 py-3 font-bold text-gray-700 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#d5d9d9]">
                {filteredProducts.map((product) => (
                  <tr key={product._id} className="hover:bg-[#f3f4f4] transition-colors">
                    <td className="px-6 py-3">
                       <img src={product.image} alt={product.name} className="w-12 h-12 object-contain bg-white border border-gray-200 p-1" />
                    </td>
                    <td className="px-6 py-3">
                      <div className="font-bold text-[#007185] hover:underline cursor-pointer hover:text-[#c7511f] line-clamp-2 white-space-normal max-w-xs" onClick={() => navigate(`/product/${product._id}`)}>
                        {product.name}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">ID: {product._id}</div>
                    </td>
                    <td className="px-6 py-3 text-gray-600">{product.category}</td>
                    <td className="px-6 py-3 text-right">
                       <span className="font-bold">₹{product.price.toLocaleString('en-IN')}</span>
                    </td>
                    <td className="px-6 py-3 text-center">
                       {product.countInStock > 0 ? (
                         <span className={product.countInStock <= 5 ? 'text-[#B12704] font-bold' : 'text-[#007600]'}>
                           {product.countInStock}
                         </span>
                       ) : (
                         <span className="text-[#B12704] font-bold">Out of stock</span>
                       )}
                    </td>
                    <td className="px-6 py-3">
                      <div className="flex justify-center flex-col gap-2 w-24 mx-auto">
                        <button 
                          onClick={() => navigate(`/admin/product/${product._id}/edit`)}
                          className="bg-white border border-[#d5d9d9] hover:bg-gray-50 py-1 px-2 rounded-lg shadow-sm font-normal text-xs text-center"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => deleteHandler(product._id)}
                          className="bg-white border border-[#d5d9d9] hover:bg-red-50 hover:text-[#B12704] py-1 px-2 rounded-lg shadow-sm font-normal text-xs text-center transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredProducts.length === 0 && (
                  <tr>
                    <td colSpan="6" className="px-6 py-10 text-center text-gray-500">
                      No matching products found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProductListScreen;