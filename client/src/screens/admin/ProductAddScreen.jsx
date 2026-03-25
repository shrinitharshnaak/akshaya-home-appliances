import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, Loader2, PackagePlus, ChevronLeft } from 'lucide-react';
import API from '../../services/api';

const ProductAddScreen = () => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState(''); // This stores the final string path
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState('');
  const [countInStock, setCountInStock] = useState(0);
  const [description, setDescription] = useState('');
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  /**
   * FILE UPLOAD HANDLER
   * Intercepts the file, sends it to the server, and retrieves the URL.
   */
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

      setImage(data.image); // This sets the path (e.g., /uploads/image-123.jpg)
      setUploading(false);
    } catch (error) {
      console.error(error);
      setUploading(false);
      alert('Security Protocol: Image sync failed. Ensure file is under 5MB.');
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.post('/products', {
        name,
        price,
        image,
        brand,
        category,
        countInStock,
        description,
      });
      setLoading(false);
      navigate('/admin');
    } catch (err) {
      alert(err.response?.data?.message || 'Product creation failed.');
      setLoading(false);
    }
  };

  return (
    <div className="p-6 md:p-12 bg-white min-h-screen">
      <div className="max-w-4xl mx-auto">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-zinc-400 hover:text-black mb-8 transition-colors">
          <ChevronLeft size={20} /> <span className="text-[10px] font-black uppercase tracking-widest">Back to Assets</span>
        </button>

        <h1 className="text-5xl font-black uppercase italic tracking-tighter mb-12">
          New <span className="text-purple-600">Inventory</span> Item
        </h1>

        <form onSubmit={submitHandler} className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* IMAGE UPLOAD SECTION */}
          <div className="md:col-span-2 bg-zinc-50 border-2 border-dashed border-zinc-200 rounded-[2rem] p-8 flex flex-col items-center justify-center transition-all hover:border-purple-300">
            {image ? (
              <img src={image} alt="Preview" className="w-48 h-48 object-cover rounded-2xl mb-4 shadow-lg" />
            ) : (
              <div className="w-20 h-20 bg-zinc-200 rounded-2xl flex items-center justify-center mb-4 text-zinc-400">
                <Upload size={32} />
              </div>
            )}

            <label className="bg-black text-white px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest cursor-pointer hover:bg-purple-600 transition-colors">
              {uploading ? <Loader2 className="animate-spin" /> : 'Select Image Asset'}
              <input type="file" className="hidden" onChange={uploadFileHandler} />
            </label>
            <p className="mt-2 text-[8px] text-zinc-400 uppercase tracking-widest">JPG, PNG or WebP accepted</p>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Product Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="bg-zinc-100 p-4 rounded-2xl focus:ring-2 focus:ring-purple-500 outline-none font-bold" required />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Retail Price (₹)</label>
            <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} className="bg-zinc-100 p-4 rounded-2xl focus:ring-2 focus:ring-purple-500 outline-none font-bold" required />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Brand</label>
            <input type="text" value={brand} onChange={(e) => setBrand(e.target.value)} className="bg-zinc-100 p-4 rounded-2xl focus:ring-2 focus:ring-purple-500 outline-none font-bold" required />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Category</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="bg-zinc-100 p-4 rounded-2xl focus:ring-2 focus:ring-purple-500 outline-none font-bold appearance-none cursor-pointer" required>
              <option value="" disabled>Select a Category</option>
              <option value="Refrigerators">Refrigerators</option>
              <option value="Washing Machines">Washing Machines</option>
              <option value="Air Conditioners">Air Conditioners</option>
              <option value="Televisions">Televisions</option>
              <option value="Microwaves">Microwaves</option>
              <option value="Small Appliances">Small Appliances</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Count In Stock</label>
            <input type="number" value={countInStock} onChange={(e) => setCountInStock(e.target.value)} className="bg-zinc-100 p-4 rounded-2xl focus:ring-2 focus:ring-purple-500 outline-none font-bold" required />
          </div>

          <div className="md:col-span-2 flex flex-col gap-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Technical Description</label>
            <textarea rows="4" value={description} onChange={(e) => setDescription(e.target.value)} className="bg-zinc-100 p-4 rounded-2xl focus:ring-2 focus:ring-purple-500 outline-none font-bold resize-none" required></textarea>
          </div>

          <button type="submit" disabled={loading || uploading} className="md:col-span-2 bg-purple-600 hover:bg-black text-white p-6 rounded-[2rem] flex items-center justify-center gap-4 transition-all group">
            {loading ? <Loader2 className="animate-spin" /> : (
              <>
                <span className="font-black uppercase tracking-widest italic">Initialize Asset</span>
                <PackagePlus className="group-hover:translate-x-2 transition-transform" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProductAddScreen;