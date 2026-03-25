import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, Mail, Lock, User, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import API from '../services/api';

const RegisterScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const navigate = useNavigate();
  const userInfo = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : null;

  // Redirect if already authenticated
  useEffect(() => {
    if (userInfo) {
      navigate('/');
    }
  }, [navigate, userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert('Security Mismatch: Passwords do not correlate.');
      return;
    }
    
    try {
      const { data } = await API.post('/users', { name, email, password });
      localStorage.setItem('userInfo', JSON.stringify(data));
      
      // Navigate to homepage - the App level should handle state refresh
      navigate('/');
      window.location.reload(); 
    } catch (error) {
      alert(error.response?.data?.message || 'Protocol Failure: Registration Denied');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-6 font-sans">
      <div className="max-w-md w-full space-y-10 p-12 bg-white border border-zinc-100 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.08)] rounded-[4rem] animate-in fade-in zoom-in duration-700">
        
        <div className="text-center space-y-4">
          <div className="inline-flex p-5 bg-purple-50 rounded-[2rem] text-purple-600 mb-2 rotate-3 hover:rotate-0 transition-transform duration-500">
            <UserPlus size={36} />
          </div>
          <h2 className="text-4xl font-black text-black uppercase italic tracking-tighter leading-none">
            Join the <span className="text-purple-600">Vault</span>
          </h2>
          <p className="text-zinc-400 font-bold text-[10px] uppercase tracking-[0.3em]">
            Establish your Akshaya Credentials
          </p>
        </div>

        <form onSubmit={submitHandler} className="space-y-4">
          {/* Name Input */}
          <div className="group relative">
            <User className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-purple-600 transition-colors" size={18} />
            <input
              type="text"
              placeholder="FULL NAME"
              className="w-full bg-zinc-50 border-2 border-transparent py-5 pl-14 pr-5 rounded-[1.5rem] outline-none focus:bg-white focus:border-purple-600/10 transition-all font-black text-[11px] tracking-widest uppercase"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          {/* Email Input */}
          <div className="group relative">
            <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-purple-600 transition-colors" size={18} />
            <input
              type="email"
              placeholder="EMAIL ADDRESS"
              className="w-full bg-zinc-50 border-2 border-transparent py-5 pl-14 pr-5 rounded-[1.5rem] outline-none focus:bg-white focus:border-purple-600/10 transition-all font-black text-[11px] tracking-widest uppercase"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password Input */}
          <div className="group relative">
            <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-purple-600 transition-colors" size={18} />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="SECRET PASSWORD"
              className="w-full bg-zinc-50 border-2 border-transparent py-5 pl-14 pr-12 rounded-[1.5rem] outline-none focus:bg-white focus:border-purple-600/10 transition-all font-black text-[11px] tracking-widest uppercase"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button 
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-black transition-colors"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* Confirm Password */}
          <div className="group relative">
            <ShieldCheck className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-purple-600 transition-colors" size={18} />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="VERIFY PASSWORD"
              className="w-full bg-zinc-50 border-2 border-transparent py-5 pl-14 pr-5 rounded-[1.5rem] outline-none focus:bg-white focus:border-purple-600/10 transition-all font-black text-[11px] tracking-widest uppercase"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <button 
            type="submit" 
            className="w-full bg-black text-white py-6 rounded-[2rem] font-black uppercase tracking-[0.4em] text-[10px] hover:bg-purple-600 transition-all shadow-xl shadow-purple-600/10 active:scale-[0.98] mt-4"
          >
            Initialize Account
          </button>
        </form>

        <div className="pt-6 border-t border-zinc-50 text-center">
          <p className="text-zinc-400 font-bold text-[10px] uppercase tracking-widest">
            Already in the network?{' '}
            <Link to="/login" className="text-purple-600 hover:underline underline-offset-4">
              Access Terminal
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterScreen;