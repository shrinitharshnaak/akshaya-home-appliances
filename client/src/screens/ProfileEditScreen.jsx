import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Lock, ChevronLeft, Save, Camera, Sparkles } from 'lucide-react';
import API from '../services/api';

const ProfileEditScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [avatar, setAvatar] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(null);

  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  useEffect(() => {
    if (!userInfo) {
      navigate('/login');
    } else {
      setName(userInfo.name);
      setEmail(userInfo.email);
      setAvatar(userInfo.avatar || '');
    }
  }, [navigate]);

  // Handle Image Selection and Upload
  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Local Preview
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    reader.readAsDataURL(file);

    const formData = new FormData();
    formData.append('image', file);
    setUploading(true);

    try {
      const config = {
        headers: { 'Content-Type': 'multipart/form-data' },
      };
      const { data } = await API.post('/upload', formData, config);
      setAvatar(data.image); // Expected response: { image: "/uploads/image-xxx.jpg" }
      setUploading(false);
    } catch (error) {
      console.error('Transmission Error:', error);
      setUploading(false);
      alert('Asset upload failed. Please verify file type.');
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return alert('Security mismatch: Passwords do not correlate.');
    }

    try {
      const { data } = await API.put('/users/profile', { 
        id: userInfo._id, 
        name, 
        email, 
        password: password || undefined, // Only send if changed
        avatar 
      });
      
      localStorage.setItem('userInfo', JSON.stringify(data));
      alert('Profile successfully reconfigured.');
      navigate('/profile');
    } catch (err) {
      alert(err.response?.data?.message || 'Update failed: Protocol error.');
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-6 font-sans">
      <div className="max-w-xl w-full bg-white rounded-[4rem] shadow-2xl shadow-blue-900/5 p-10 md:p-14 border border-zinc-100 relative animate-in fade-in slide-in-from-bottom-4 duration-700">
        
        {/* Navigation */}
        <button 
          onClick={() => navigate('/profile')} 
          className="absolute top-10 left-10 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-blue-600 transition-all group"
        >
          <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back
        </button>

        <div className="text-center mb-10 mt-6">
          {/* AVATAR UPLOAD COMPONENT */}
          <div className="relative inline-block mb-6 group">
            <div className={`w-32 h-32 rounded-[2.5rem] bg-zinc-100 overflow-hidden border-4 border-white shadow-2xl mx-auto transition-all ${uploading ? 'opacity-50 scale-95' : 'group-hover:scale-105'}`}>
              <img 
                src={preview || avatar || `https://ui-avatars.com/api/?name=${name}&background=2563EB&color=fff&bold=true`} 
                alt="Identity" 
                className="w-full h-full object-cover"
              />
            </div>
            <label className="absolute -bottom-2 -right-2 bg-blue-600 p-3 rounded-2xl text-white shadow-xl cursor-pointer hover:bg-black transition-all hover:rotate-12 active:scale-90">
              <Camera size={20} />
              <input type="file" className="hidden" onChange={uploadFileHandler} accept="image/*" />
            </label>
            {uploading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
          </div>

          <h1 className="text-4xl font-black uppercase italic tracking-tighter leading-none mb-3">
            Modify <span className="text-blue-600">Identity</span>
          </h1>
          <p className="text-zinc-400 font-bold text-[10px] uppercase tracking-[0.3em]">
            {uploading ? 'Processing Data Stream...' : 'Personal Account Management'}
          </p>
        </div>

        <form onSubmit={submitHandler} className="space-y-6">
          {/* Identity Fields */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-4 flex items-center gap-2">
              <User size={12} /> Legal Name
            </label>
            <input 
              type="text" 
              className="w-full bg-zinc-50 p-5 rounded-2xl outline-none focus:ring-2 ring-blue-600/20 font-bold text-zinc-800 border border-transparent focus:bg-white transition-all" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-4 flex items-center gap-2">
              <Mail size={12} /> Verified Email
            </label>
            <input 
              type="email" 
              className="w-full bg-zinc-50 p-5 rounded-2xl outline-none focus:ring-2 ring-blue-600/20 font-bold text-zinc-800 border border-transparent focus:bg-white transition-all" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
            />
          </div>

          {/* Security Fields */}
          <div className="pt-6 border-t border-zinc-100">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-300 mb-6 text-center">Security Overrides</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-widest text-zinc-400 ml-4">New Secret</label>
                <input 
                  type="password" 
                  placeholder="••••••••" 
                  className="w-full bg-zinc-50 p-4 rounded-2xl outline-none focus:ring-2 ring-blue-600/20 font-bold" 
                  onChange={(e) => setPassword(e.target.value)} 
                />
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-widest text-zinc-400 ml-4">Verify Secret</label>
                <input 
                  type="password" 
                  placeholder="••••••••" 
                  className="w-full bg-zinc-50 p-4 rounded-2xl outline-none focus:ring-2 ring-blue-600/20 font-bold" 
                  onChange={(e) => setConfirmPassword(e.target.value)} 
                />
              </div>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={uploading}
            className="w-full bg-black text-white p-6 rounded-2xl font-black uppercase text-[10px] tracking-[0.5em] hover:bg-blue-600 transition-all shadow-xl shadow-blue-600/10 flex items-center justify-center gap-4 mt-8 disabled:opacity-50"
          >
            <Save size={18} /> Update Core Profile <Sparkles size={16} className="text-blue-400" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfileEditScreen;