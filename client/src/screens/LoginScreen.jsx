import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { LogIn, ShieldCheck, Mail, Lock, ArrowRight } from 'lucide-react';
import API from '../services/api';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  
  // Clean redirect logic: extract the path without double-slashing
  const searchParams = new URLSearchParams(location.search);
  const redirect = searchParams.get('redirect') || '/';

  useEffect(() => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect]);

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await API.post('/users/login', { email, password });
      localStorage.setItem('userInfo', JSON.stringify(data));
      navigate(redirect);
    } catch (err) {
      alert(err.response?.data?.message || 'Authentication Protocol Failed');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 p-6 font-sans">
      <div className="max-w-md w-full bg-white p-10 md:p-14 rounded-[3.5rem] shadow-2xl shadow-blue-900/5 border border-zinc-100 animate-in fade-in zoom-in-95 duration-700">
        
        {/* Branding & Header */}
        <div className="text-center mb-10">
          <div className="inline-flex p-4 bg-blue-50 text-blue-600 rounded-3xl mb-6">
            <ShieldCheck size={32} />
          </div>
          <h1 className="text-4xl font-black uppercase italic tracking-tighter leading-none">
            Secure <span className="text-blue-600 text-outline-dark">Access</span>
          </h1>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 mt-3">
            Akshaya Appliances • Cloud Portal
          </p>
        </div>

        <form onSubmit={submitHandler} className="space-y-5">
          {/* Email Input */}
          <div className="relative group">
            <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-300 group-focus-within:text-blue-600 transition-colors" size={18} />
            <input 
              type="email" 
              placeholder="Email Address" 
              className="w-full pl-16 pr-8 py-5 bg-zinc-50 border-2 border-transparent rounded-2xl outline-none focus:bg-white focus:border-blue-600/20 font-bold text-zinc-800 transition-all" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
          </div>

          {/* Password Input */}
          <div className="relative group">
            <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-300 group-focus-within:text-blue-600 transition-colors" size={18} />
            <input 
              type="password" 
              placeholder="Security Key" 
              className="w-full pl-16 pr-8 py-5 bg-zinc-50 border-2 border-transparent rounded-2xl outline-none focus:bg-white focus:border-blue-600/20 font-bold text-zinc-800 transition-all" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-black text-white p-6 rounded-2xl font-black uppercase text-[10px] tracking-[0.4em] hover:bg-blue-600 transition-all shadow-xl shadow-blue-600/10 flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
          >
            {loading ? 'Authenticating...' : (
              <>Authorize <ArrowRight size={16} /></>
            )}
          </button>
        </form>

        {/* Footer Link */}
        <div className="mt-10 text-center">
          <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2">New to the platform?</p>
          <Link 
            to={redirect !== '/' ? `/register?redirect=${redirect}` : '/register'} 
            className="text-xs font-bold text-zinc-800 hover:text-blue-600 underline underline-offset-4 transition-colors"
          >
            Create Executive Account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;