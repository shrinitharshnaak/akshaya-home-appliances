import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Star } from 'lucide-react';
import API from '../services/api';
import ProductCard from '../components/ProductCard';

const SearchScreen = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Parse Query Params
  const searchParams = new URLSearchParams(location.search);
  const keyword = searchParams.get('q') || searchParams.get('keyword') || '';
  const category = searchParams.get('category') || 'All';
  const price = searchParams.get('price') || 'All';
  const rating = searchParams.get('rating') || '0';
  const sortOrder = searchParams.get('sortOrder') || 'newest';
  const pageNumber = searchParams.get('pageNumber') || 1;

  const [pages, setPages] = useState(1);
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const { data } = await API.get(
          `/products?keyword=${keyword}&category=${category}&price=${price}&rating=${rating}&sortOrder=${sortOrder}&pageNumber=${pageNumber}`
        );
        setProducts(data.products || []);
        setPage(data.page || 1);
        setPages(data.pages || 1);
        setCount(data.count || 0);
        setLoading(false);
      } catch (error) {
        console.error("Filter connectivity issue:", error);
        setLoading(false);
      }
    };
    fetchProducts();
  }, [keyword, category, price, rating, sortOrder, pageNumber]);

  const getFilterUrl = (filter) => {
    const filterPage = filter.page || pageNumber;
    const filterCategory = filter.category || category;
    const filterKeyword = filter.keyword || keyword;
    const filterRating = filter.rating || rating;
    const filterPrice = filter.price || price;
    const sort = filter.sortOrder || sortOrder;
    return `/search?category=${filterCategory}&keyword=${filterKeyword}&price=${filterPrice}&rating=${filterRating}&sortOrder=${sort}&pageNumber=${filterPage}`;
  };

  return (
    <div className="bg-white min-h-screen py-6 font-sans border-t border-gray-200">
      <div className="max-w-[1500px] mx-auto px-4 flex flex-col md:flex-row gap-6">
        
        {/* SIDEBAR */}
        <div className="w-full md:w-64 flex-shrink-0">
          <div className="sticky top-24">
            <h3 className="font-bold text-sm mb-3">Department</h3>
            <ul className="text-sm space-y-2 mb-6">
              <li>
                <Link to={getFilterUrl({ category: 'All' })} className={category === 'All' ? 'font-bold text-[#c7511f]' : 'text-[#0f1111] hover:text-[#c7511f]'}>Any Department</Link>
              </li>
              {['Refrigerators', 'Washing Machines', 'Air Conditioners', 'Microwaves', 'Televisions', 'Dishwashers'].map((c) => (
                <li key={c}>
                  <Link to={getFilterUrl({ category: c.toLowerCase() })} className={category === c.toLowerCase() ? 'font-bold text-[#c7511f]' : 'text-[#0f1111] hover:text-[#c7511f]'}>
                    {c}
                  </Link>
                </li>
              ))}
            </ul>

            <h3 className="font-bold text-sm mb-3">Customer Reviews</h3>
            <ul className="text-sm space-y-2 mb-6">
              {[4, 3, 2, 1].map((r) => (
                <li key={r}>
                  <Link to={getFilterUrl({ rating: r })} className="flex items-center gap-1 group">
                    <div className="flex text-[#ffa41c]">
                       {[...Array(5)].map((_, i) => (
                         <Star key={i} size={16} fill={i < r ? "currentColor" : "none"} className={i < r ? "text-[#ffa41c]" : "text-gray-300"} />
                       ))}
                    </div>
                    <span className={`text-sm ${Number(rating) === r ? 'font-bold text-[#c7511f]' : 'text-[#0f1111] group-hover:text-[#c7511f]'}`}>
                      & Up
                    </span>
                  </Link>
                </li>
              ))}
              <li>
                <Link to={getFilterUrl({ rating: '0' })} className={rating === '0' ? 'font-bold text-[#c7511f]' : 'text-[#0f1111] hover:text-[#c7511f]'}>All Reviews</Link>
              </li>
            </ul>

            <h3 className="font-bold text-sm mb-3">Price</h3>
            <ul className="text-sm space-y-2 mb-6">
              <li><Link to={getFilterUrl({ price: 'All' })} className={price === 'All' ? 'font-bold text-[#c7511f]' : 'text-[#0f1111] hover:text-[#c7511f]'}>Any Price</Link></li>
              <li><Link to={getFilterUrl({ price: '1-10000' })} className={price === '1-10000' ? 'font-bold text-[#c7511f]' : 'text-[#0f1111] hover:text-[#c7511f]'}>Under ₹10,000</Link></li>
              <li><Link to={getFilterUrl({ price: '10000-20000' })} className={price === '10000-20000' ? 'font-bold text-[#c7511f]' : 'text-[#0f1111] hover:text-[#c7511f]'}>₹10,000 - ₹20,000</Link></li>
              <li><Link to={getFilterUrl({ price: '20000-50000' })} className={price === '20000-50000' ? 'font-bold text-[#c7511f]' : 'text-[#0f1111] hover:text-[#c7511f]'}>₹20,000 - ₹50,000</Link></li>
              <li><Link to={getFilterUrl({ price: '50000-' })} className={price === '50000-' ? 'font-bold text-[#c7511f]' : 'text-[#0f1111] hover:text-[#c7511f]'}>Over ₹50,000</Link></li>
            </ul>
          </div>
        </div>

        {/* RESULTS AREA */}
        <div className="flex-1">
          {/* Top Bar for Results count and Sort */}
          <div className="bg-white border rounded-sm p-2 mb-4 flex flex-col sm:flex-row justify-between items-center text-sm shadow-sm gap-4">
            <div>
              {count > 0 ? (
                <span>1-{Math.min(products.length, count)} of over {count} results for <span className="font-bold text-[#c7511f]">"{keyword || category}"</span></span>
              ) : (
                <span>No results for <span className="font-bold text-[#c7511f]">"{keyword || category}"</span></span>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-gray-600">Sort by:</span>
              <select 
                value={sortOrder} 
                onChange={(e) => navigate(getFilterUrl({ sortOrder: e.target.value }))}
                className="bg-[#f0f2f2] border border-[#d5d9d9] rounded-[8px] py-1 px-2 text-sm shadow-[0_2px_5px_rgba(15,17,17,.15)] focus:ring-[#f97316] outline-none"
              >
                <option value="newest">Newest Arrivals</option>
                <option value="lowest">Price: Low to High</option>
                <option value="highest">Price: High to Low</option>
                <option value="toprated">Avg. Customer Review</option>
              </select>
            </div>
          </div>

          {/* Product Grid */}
          {loading ? (
            <div className="p-10 text-center text-gray-500">Loading products...</div>
          ) : (
             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
             </div>
          )}
          
          {/* Pagination Component */}
          {pages > 1 && (
            <div className="flex justify-center items-center mt-8 gap-2">
              {[...Array(pages).keys()].map(x => (
                <Link 
                  key={x + 1}
                  to={getFilterUrl({ page: x + 1 })}
                  className={`px-4 py-2 border rounded-md text-sm ${x + 1 === page ? 'bg-white border-black font-bold shadow-sm' : 'bg-white border-gray-300 hover:bg-gray-100'}`}
                >
                  {x + 1}
                </Link>
              ))}
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default SearchScreen;
