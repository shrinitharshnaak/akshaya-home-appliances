import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Save, IndianRupee, Box, Tag, FileText, ImageIcon, CheckCircle, AlertTriangle, Upload, Loader2 } from 'lucide-react';
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
  const [uploading, setUploading] = useState(false);

  const CATEGORIES = ['Refrigerators', 'Washing Machines', 'Air Conditioners', 'Televisions', 'Microwaves', 'Small Appliances', 'Other'];

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('image', file);
    setUploading(true);

    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      };

      const { data } = await API.post('/upload', formData, config);

      setImage(data.image);
      setUploading(false);
    } catch (error) {
      console.error(error);
      setUploading(false);
      alert('Image upload failed. Ensure file is under 5MB.');
    }
  };

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
        console.error("Critical Sync Error:", error);
      }
    };
    fetchProduct();
  }, [productId]);

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.put(`/products/${productId}`, {
        name, 
        price: Number(price), // Ensure numeric type
        image, 
        brand, 
        category, 
        countInStock: Number(countInStock), // Ensure numeric type
        description
      });
      setLoading(false);
      navigate('/admin/productlist');
    } catch (error) {
      alert(error.response?.data?.message || "Internal Server Error");
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 bg-white min-h-screen">
      {/* HEADER NAV */}
      <div className="flex items-center justify-between mb-12">
        <Link to="/admin/productlist" className="group flex items-center text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-purple-600 transition-all">
          <ArrowLeft size={16} className="mr-2 group-hover:-translate-x-1 transition-transform" /> Back to Inventory
        </Link>
        <span className="text-[10px] font-mono text-gray-400 bg-gray-50 px-4 py-2 rounded-full border border-gray-100 italic">
          SYS_ID: {productId}
        </span>
      </div>

      <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-6xl font-black text-black uppercase tracking-tighter italic leading-none">
            Update <span className="text-purple-600">Assets</span>
          </h1>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em] mt-2">Inventory Management Protocol v2.0</p>
        </div>
        
        <div className={`flex items-center gap-3 px-6 py-3 rounded-2xl border-2 transition-all duration-500 ${countInStock > 0 ? 'bg-green-50 border-green-100 text-green-600' : 'bg-red-50 border-red-100 text-red-600'}`}>
          {countInStock > 0 ? <CheckCircle size={18}/> : <AlertTriangle size={18}/>}
          <span className="text-xs font-black uppercase tracking-widest">
            {countInStock > 0 ? 'Asset Active' : 'Depleted'}
          </span>
        </div>
      </div>

      <form onSubmit={submitHandler} className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white border border-gray-100 rounded-[2.5rem] p-10 shadow-xl shadow-gray-100/50 space-y-8">
            <InputField label="Appliance Model Name" icon={<Tag size={12}/>} value={name} onChange={(e) => setName(e.target.value)} placeholder="Product Title" />
            
            <div className="space-y-2">
              <label className="flex items-center text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">
                <FileText size={12} className="mr-2 text-purple-600" /> Engineering Specs
              </label>
              <textarea
                rows="6"
                className="w-full bg-gray-50 border-2 border-transparent py-5 px-8 rounded-3xl outline-none focus:bg-white focus:border-purple-600/20 font-medium text-black transition-all"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">
                <ImageIcon size={12} className="mr-2 text-purple-600" /> Image Asset
              </label>
              <div className="w-full bg-gray-50 border-2 border-dashed border-gray-200 py-6 px-8 rounded-3xl flex flex-col items-center justify-center transition-all hover:border-purple-300">
                {image ? (
                  <img src={image} alt="Preview" className="w-40 h-40 object-cover rounded-2xl mb-4 shadow-md bg-white border border-gray-100 p-1" />
                ) : (
                  <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-4 shadow-sm text-gray-300">
                    <Upload size={24} />
                  </div>
                )}
                <label className="bg-white border text-black px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest cursor-pointer hover:border-purple-600 hover:text-purple-600 transition-colors shadow-sm">
                  {uploading ? <Loader2 className="animate-spin inline mr-2 h-3 w-3" /> : null}
                  {uploading ? 'Uploading...' : 'Change Asset'}
                  <input type="file" className="hidden" onChange={uploadFileHandler} />
                </label>
              </div>
            </div>
          </div>

          <div className="bg-black rounded-[2.5rem] p-10 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
            <div className="flex items-center space-x-4">
               <div className="p-4 bg-purple-600/20 rounded-2xl text-purple-500"><Save size={24}/></div>
               <div>
                 <h4 className="font-black uppercase italic tracking-tight text-xl">Commit Changes</h4>
                 <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">Update Cloud Inventory</p>
               </div>
            </div>
            <button 
              type="submit" 
              disabled={loading}
              className="w-full md:w-auto bg-purple-600 text-white px-12 py-5 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-white hover:text-black transition-all disabled:opacity-50"
            >
              {loading ? 'SYNCING...' : 'Update Appliance'}
            </button>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-gray-50 border border-gray-100 rounded-[3rem] p-8 space-y-8">
            <StatInput label="List Price" icon={<IndianRupee size={12}/>} value={price} onChange={(e) => setPrice(e.target.value)} />
            <StatInput label="Units Available" icon={<Box size={12}/>} value={countInStock} onChange={(e) => setCountInStock(e.target.value)} />

            <div className="space-y-4 pt-4 border-t border-gray-200">
               <SmallInput label="Brand" value={brand} onChange={(e) => setBrand(e.target.value)} />
               <SmallSelect label="Category" value={category} onChange={(e) => setCategory(e.target.value)} options={CATEGORIES} />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

// Reusable Sub-Components for Clean Code
const InputField = ({ label, icon, value, onChange, placeholder, isMono }) => (
  <div className="space-y-2">
    <label className="flex items-center text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">
      <span className="text-purple-600 mr-2">{icon}</span> {label}
    </label>
    <input
      type="text"
      className={`w-full bg-gray-50 border-2 border-transparent py-5 px-8 rounded-3xl outline-none focus:bg-white focus:border-purple-600/20 font-bold text-black transition-all ${isMono ? 'font-mono text-sm' : 'text-lg'}`}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required
    />
  </div>
);

const StatInput = ({ label, icon, value, onChange }) => (
  <div className="relative">
    <label className="flex items-center text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2 mb-2">
      <span className="text-purple-600 mr-2">{icon}</span> {label}
    </label>
    <input
      type="number"
      className="w-full bg-white border-2 border-transparent py-6 px-8 rounded-[2rem] outline-none focus:border-purple-600/20 font-black text-3xl text-black transition-all shadow-sm"
      value={value}
      onChange={onChange}
    />
  </div>
);

const SmallInput = ({ label, value, onChange }) => (
  <div className="relative">
    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">{label}</label>
    <input
      type="text"
      className="w-full bg-white border border-gray-200 py-4 px-6 rounded-2xl mt-1 font-bold text-sm text-black outline-none focus:border-purple-600 transition-colors"
      value={value}
      onChange={onChange}
    />
  </div>
);

const SmallSelect = ({ label, value, onChange, options }) => (
  <div className="relative">
    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">{label}</label>
    <select
      className="w-full bg-white border border-gray-200 py-4 px-6 rounded-2xl mt-1 font-bold text-sm text-black outline-none focus:border-purple-600 transition-colors appearance-none cursor-pointer"
      value={value}
      onChange={onChange}
      required
    >
      <option value="" disabled>Select {label}</option>
      {options.map((opt) => (
        <option key={opt} value={opt}>{opt}</option>
      ))}
    </select>
  </div>
);

export default ProductEditScreen;