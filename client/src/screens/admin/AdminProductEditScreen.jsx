import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Save, IndianRupee, Box, Tag, Layers, FileText } from 'lucide-react';
import API from '../../services/api';

const ProductEditScreen = () => {
  const { id: productId } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState('');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState('');
  const [countInStock, setCountInStock] = useState(0);
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await API.get(`/products/${productId}`);
        setName(data.name);
        setPrice(data.price);
        setImage(data.image);
        setBrand(data.brand);
        setCategory(data.category);
        setCountInStock(data.countInStock);
        setDescription(data.description);
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };
    fetchProduct();
  }, [productId]);

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.put(`/products/${productId}`, {
        name, price, image, brand, category, countInStock, description
      });
      setLoading(false);
      navigate('/admin/productlist');
    } catch (error) {
      alert(error.response?.data?.message || error.message);
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      {/* HEADER NAV */}
      <div className="flex items-center justify-between mb-12">
        <Link to="/admin/productlist" className="group flex items-center text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-primary transition-all">
          <ArrowLeft size={16} className="mr-2 group-hover:-translate-x-1 transition-transform" /> Back to Inventory
        </Link>
        <span className="text-[10px] font-mono text-gray-300 bg-gray-50 px-4 py-2 rounded-full border border-gray-100">
          REF_ID: {productId}
        </span>
      </div>

      <div className="mb-12">
        <h1 className="text-5xl font-black text-black uppercase tracking-tighter italic">
          Edit <span className="text-primary text-outline-dark">Appliance</span>
        </h1>
      </div>

      <form onSubmit={submitHandler} className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* MAIN DETAILS (LEFT) */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white border border-gray-100 rounded-[2.5rem] p-10 shadow-sm space-y-8">
            <div className="space-y-2">
              <label className="flex items-center text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">
                <Tag size={12} className="mr-2 text-primary" /> Product Title
              </label>
              <input
                type="text"
                className="w-full bg-gray-50 border-2 border-transparent py-5 px-8 rounded-3xl outline-none focus:bg-white focus:border-primary/20 font-bold text-lg text-black transition-all"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. LG ThinQ Refrigerator 500L"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">
                <FileText size={12} className="mr-2 text-primary" /> Description & Specs
              </label>
              <textarea
                rows="6"
                className="w-full bg-gray-50 border-2 border-transparent py-5 px-8 rounded-3xl outline-none focus:bg-white focus:border-primary/20 font-medium text-black transition-all"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Detail the technical specifications, warranty, and features..."
                required
              />
            </div>
          </div>

          <div className="bg-black rounded-[2.5rem] p-10 text-white flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center space-x-4">
               <div className="p-4 bg-primary/20 rounded-2xl text-primary"><Save size={24}/></div>
               <div>
                 <h4 className="font-black uppercase italic tracking-tight text-xl">Confirm Changes</h4>
                 <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">Update store inventory instantly</p>
               </div>
            </div>
            <button 
              type="submit" 
              disabled={loading}
              className="w-full md:w-auto bg-primary text-white px-12 py-5 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-white hover:text-black transition-all disabled:opacity-50 shadow-xl shadow-primary/20"
            >
              {loading ? 'Processing...' : 'Save Appliance Data'}
            </button>
          </div>
        </div>

        {/* SPECS & INVENTORY (RIGHT) */}
        <div className="space-y-8">
          <div className="bg-gray-50 border border-gray-100 rounded-[2.5rem] p-8 space-y-8">
            
            {/* PRICE */}
            <div className="relative">
              <label className="flex items-center text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2 mb-2">
                <IndianRupee size={12} className="mr-2 text-primary" /> Market Price
              </label>
              <input
                type="number"
                className="w-full bg-white border-2 border-transparent py-5 px-8 rounded-3xl outline-none focus:border-primary/20 font-black text-2xl text-black transition-all shadow-sm"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>

            {/* STOCK */}
            <div className="relative">
              <label className="flex items-center text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2 mb-2">
                <Box size={12} className="mr-2 text-primary" /> Units in Stock
              </label>
              <input
                type="number"
                className="w-full bg-white border-2 border-transparent py-5 px-8 rounded-3xl outline-none focus:border-primary/20 font-black text-xl text-black transition-all shadow-sm"
                value={countInStock}
                onChange={(e) => setCountInStock(e.target.value)}
              />
            </div>

            {/* CATEGORY & BRAND */}
            <div className="space-y-4 pt-4 border-t border-gray-200">
               <div className="relative">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Brand</label>
                  <input
                    type="text"
                    className="w-full bg-white border border-gray-200 py-3 px-6 rounded-xl mt-1 font-bold text-sm text-black outline-none focus:border-primary"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                  />
               </div>
               <div className="relative">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Category</label>
                  <input
                    type="text"
                    className="w-full bg-white border border-gray-200 py-3 px-6 rounded-xl mt-1 font-bold text-sm text-black outline-none focus:border-primary"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  />
               </div>
            </div>

          </div>
        </div>
      </form>
    </div>
  );
};

export default ProductEditScreen;