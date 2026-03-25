import { useEffect, useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import API from '../services/api';

const heroImages = [
  '/images/hero_banner_1_1773463632030.png',
  '/images/hero_banner_2_1773463650190.png'
];

const HomeScreen = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [userInfo, setUserInfo] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();
  const keyword = new URLSearchParams(location.search).get('q') || new URLSearchParams(location.search).get('search') || '';

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('userInfo'));
    if (user) setUserInfo(user);

    const fetchProducts = async () => {
      setLoading(true);
      try {
        const { data } = await API.get(`/products?keyword=${keyword}`);
        setProducts(data.products || data);
        setLoading(false);
      } catch (error) {
        console.error("Connectivity issue:", error);
        setLoading(false);
      }
    };
    fetchProducts();
  }, [keyword]);

  // Auto-advance carousel
  useEffect(() => {
    if (keyword) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev === heroImages.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, [keyword]);

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? heroImages.length - 1 : prev - 1));
  };
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === heroImages.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="bg-[#e3e6e6] min-h-screen font-sans">
      
      {!keyword && (
        <div className="relative w-full max-w-[1500px] mx-auto">
          {/* HERO CAROUSEL */}
          <div className="relative h-[250px] sm:h-[300px] md:h-[400px] lg:h-[600px] w-full overflow-hidden">
            {heroImages.map((img, index) => (
              <div 
                key={index}
                className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
              >
                {/* Gradient overlay at the bottom to blend with content below like Amazon does */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#e3e6e6] via-transparent to-transparent z-10 h-full w-full pointer-events-none" />
                <img src={img} alt={`Hero ${index}`} className="w-full h-full object-cover object-top" />
              </div>
            ))}
            
            {/* Carousel Controls */}
            <button onClick={prevSlide} className="absolute left-4 top-[20%] lg:top-[30%] z-20 p-2 bg-white/30 hover:bg-white/50 backdrop-blur-sm rounded-sm text-black">
              <ChevronLeft size={36} />
            </button>
            <button onClick={nextSlide} className="absolute right-4 top-[20%] lg:top-[30%] z-20 p-2 bg-white/30 hover:bg-white/50 backdrop-blur-sm rounded-sm text-black">
              <ChevronRight size={36} />
            </button>
          </div>

          {/* CATEGORY CARDS (Overlapping the hero slightly) */}
          <div className="relative z-20 max-w-[1460px] mx-auto px-4 -mt-20 md:-mt-40 xl:-mt-64 pb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              
              {/* Category Card 1 */}
              <div className="bg-white p-5 rounded-md shadow-sm flex flex-col h-full z-30 relative">
                <h2 className="text-xl font-bold mb-3">Upgrade your kitchen</h2>
                <div className="grid grid-cols-2 gap-x-3 gap-y-4 flex-grow mb-4">
                  <div className="flex flex-col gap-1 cursor-pointer group" onClick={() => navigate('/search?category=refrigerators')}>
                    <div className="bg-gray-50 aspect-square rounded-sm overflow-hidden group-hover:opacity-90 transition-opacity">
                      <img src="/images/refrigerator.png" alt="Refrigerators" className="w-full h-full object-cover" />
                    </div>
                    <span className="text-xs text-gray-800">Refrigerators</span>
                  </div>
                  <div className="flex flex-col gap-1 cursor-pointer group" onClick={() => navigate('/search?category=microwaves')}>
                    <div className="bg-gray-50 aspect-square rounded-sm overflow-hidden group-hover:opacity-90 transition-opacity">
                       <img src="/images/microwave.png" alt="Microwaves" className="w-full h-full object-cover" />
                    </div>
                    <span className="text-xs text-gray-800">Microwaves</span>
                  </div>
                   <div className="flex flex-col gap-1 cursor-pointer group" onClick={() => navigate('/search?category=dishwashers')}>
                    <div className="bg-gray-50 aspect-square rounded-sm overflow-hidden group-hover:opacity-90 transition-opacity">
                       <img src="/images/dishwasher.png" alt="Dishwashers" className="w-full h-full object-cover" />
                    </div>
                    <span className="text-xs text-gray-800">Dishwashers</span>
                  </div>
                  <div className="flex flex-col gap-1 cursor-pointer group" onClick={() => navigate('/search')}>
                    <div className="bg-gray-50 aspect-square rounded-sm overflow-hidden group-hover:opacity-90 transition-opacity">
                       <img src="/images/microwave.png" alt="Shop all" className="w-full h-full object-cover" />
                    </div>
                    <span className="text-xs text-gray-800">Shop all</span>
                  </div>
                </div>
                <Link to="/search" className="text-[#007185] hover:text-[#c7511f] hover:underline text-sm font-medium">See more</Link>
              </div>

               {/* Category Card 2 */}
              <div className="bg-white p-5 rounded-md shadow-sm flex flex-col h-full z-30 relative">
                <h2 className="text-xl font-bold mb-3">Laundry essentials</h2>
                <div className="bg-gray-50 flex-grow mb-4 rounded-sm cursor-pointer overflow-hidden group" onClick={() => navigate('/search?category=washing-machines')}>
                   <img src="/images/dishwasher.png" alt="Washing Machines" className="w-full h-full object-cover group-hover:opacity-90 transition-opacity" />
                </div>
                <Link to="/search?category=washing-machines" className="text-[#007185] hover:text-[#c7511f] hover:underline text-sm font-medium">Shop washing machines</Link>
              </div>

              {/* Category Card 3 */}
              <div className="bg-white p-5 rounded-md shadow-sm flex flex-col h-full z-30 relative">
                <h2 className="text-xl font-bold mb-3">Keep it cool</h2>
                <div className="bg-gray-50 flex-grow mb-4 rounded-sm cursor-pointer overflow-hidden group" onClick={() => navigate('/search?category=air-conditioners')}>
                   <img src="/images/refrigerator.png" alt="Air Conditioners" className="w-full h-full object-cover group-hover:opacity-90 transition-opacity" />
                </div>
                <Link to="/search?category=air-conditioners" className="text-[#007185] hover:text-[#c7511f] hover:underline text-sm font-medium">Shop air conditioners</Link>
              </div>

              {/* Sign In / Account Card */}
              <div className="bg-white p-5 rounded-md shadow-sm flex flex-col h-full z-30 relative">
                {userInfo ? (
                   <>
                    <h2 className="text-xl font-bold mb-3">Welcome back, {userInfo.name.split(' ')[0]}</h2>
                    <div className="bg-gradient-to-r from-purple-600 to-indigo-600 flex-grow mb-4 rounded-sm flex flex-col items-center justify-center p-4 text-center text-white shadow-inner">
                       <span className="font-bold text-lg">Exclusive Member Deals</span>
                       <p className="text-xs mt-1 text-purple-100">Check your personalized offers</p>
                    </div>
                    <Link to="/profile" className="text-[#007185] hover:text-[#c7511f] hover:underline text-sm font-medium">Go to your account</Link>
                   </>
                ) : (
                  <>
                    <h2 className="text-xl font-bold mb-3">Sign in for the best experience</h2>
                    <button onClick={() => navigate('/login')} className="w-full bg-[#ffd814] hover:bg-[#f7ca00] text-black py-2 rounded-lg text-sm mb-4 border border-[#fcd200] shadow-sm font-semibold">
                      Sign in securely
                    </button>
                    <div className="border-t border-gray-200 mt-auto pt-4 flex-grow flex items-center justify-center">
                      <div className="text-center text-sm text-gray-600">
                         New to Akshaya? <Link to="/register" className="text-[#007185] hover:text-[#c7511f] hover:underline">Start here.</Link>
                      </div>
                    </div>
                  </>
                )}
              </div>

            </div>
          </div>
        </div>
      )}

      {/* --- PRODUCT SHOWCASE --- */}
      <main className="max-w-[1460px] mx-auto px-4 py-8" id="catalog">
        {keyword && (
          <div className="mb-6 bg-white p-4 shadow-sm rounded-sm border-l-4 border-[#a855f7]">
            <h2 className="text-xl font-bold mb-1">Results for "{keyword}"</h2>
            <p className="text-sm text-gray-600">Check each product page for other buying options.</p>
          </div>
        )}
        
        {!keyword && (
           <h2 className="text-2xl font-bold mb-4 bg-white p-4 rounded-sm shadow-sm border-t-4 border-[#a855f7]">Best Sellers in Appliances</h2>
        )}

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
              <div key={n} className="aspect-[3/4] bg-white animate-pulse rounded-sm shadow-sm" />
            ))}
          </div>
        ) : (
          <>
            {products.length === 0 ? (
              <div className="py-20 bg-white rounded-sm text-center shadow-sm">
                <p className="text-gray-500 font-bold text-lg mb-4">No results for "{keyword}"</p>
                <p className="text-sm text-gray-500">Try checking your spelling or use more general terms</p>
                <div className="mt-6">
                  <Link to="/" className="text-[#007185] hover:text-[#c7511f] hover:underline font-medium">Clear search</Link>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            )}
          </>
        )}
      </main>

    </div>
  );
};

export default HomeScreen;
