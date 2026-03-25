import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';

const SearchBox = () => {
  const [keyword, setKeyword] = useState('');
  const [category, setCategory] = useState('All');
  const navigate = useNavigate();

  const submitHandler = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      navigate(`/search?q=${keyword}${category !== 'All' ? `&category=${category}` : ''}`);
    } else if (category !== 'All') {
      navigate(`/search?category=${category}`);
    } else {
      navigate('/search');
    }
  };

  return (
    <form onSubmit={submitHandler} className="flex flex-grow bg-white rounded-md overflow-hidden ring-2 ring-transparent focus-within:ring-[#f97316] h-10">
      {/* Category Dropdown (Simulated Amazon style) */}
      <select 
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="bg-gray-100 text-gray-700 text-xs px-2 border-r border-gray-300 outline-none cursor-pointer hover:bg-gray-200 hidden sm:block w-auto max-w-[50px] md:max-w-auto"
        style={{ WebkitAppearance: 'none', MozAppearance: 'none' }}
      >
        <option value="All">All</option>
        <option value="refrigerators">Refrigerators</option>
        <option value="washing-machines">Washing Machines</option>
        <option value="air-conditioners">ACs</option>
        <option value="microwaves">Microwaves</option>
        <option value="televisions">TVs</option>
      </select>

      <input
        type="text"
        name="q"
        onChange={(e) => setKeyword(e.target.value)}
        placeholder="Search Akshaya Appliances"
        className="flex-grow px-3 text-black text-sm outline-none w-full min-w-0"
      />
      
      <button 
        type="submit" 
        className="bg-[#facc15] hover:bg-[#eab308] px-3 md:px-5 flex items-center justify-center transition-colors text-black"
        aria-label="Search"
      >
        <Search size={20} strokeWidth={2.5} />
      </button>
    </form>
  );
};

export default SearchBox;