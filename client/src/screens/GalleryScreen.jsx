import React from 'react';
import { Link } from 'react-router-dom';
import { Image, Maximize2, Camera } from 'lucide-react';

const galleryImages = [
  { id: 1, title: 'Smart Refrigerators', category: 'refrigerators', src: '/images/refrigerator.png' },
  { id: 2, title: 'Precision Laundry', category: 'washing-machines', src: '/images/dishwasher.png' },
  { id: 3, title: 'Convection Masters', category: 'microwaves', src: '/images/microwave.png' },
  { id: 4, title: 'Cooling Efficiency', category: 'air-conditioners', src: '/images/refrigerator.png' },
  { id: 5, title: 'Entertainment Visuals', category: 'televisions', src: '/images/microwave.png' },
  { id: 6, title: 'Kitchen Essentials', category: 'dishwashers', src: '/images/dishwasher.png' }
];

const GalleryScreen = () => {
  return (
    <div className="bg-white min-h-screen">
      {/* Hero Header */}
      <div className="bg-[#1e0a2d] text-white py-16 px-4">
        <div className="max-w-[1200px] mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter mb-4">
            Akshaya Showcase
          </h1>
          <p className="text-lg text-purple-200 max-w-2xl mx-auto font-light">
            Explore our premium collection of household appliances designed for modern Indian homes.
          </p>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 py-12">
        <div className="flex items-center gap-2 mb-8 text-gray-500 font-bold uppercase tracking-widest text-xs">
          <Camera size={16} /> Digital Catalog
        </div>

        {/* Masonry-style Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {galleryImages.map((item) => (
            <div key={item.id} className="group relative overflow-hidden rounded-xl bg-gray-50 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500">
              <div className="aspect-[4/3] w-full overflow-hidden">
                <img 
                  src={item.src} 
                  alt={item.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out" 
                />
              </div>
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                <div className="flex justify-between items-end">
                  <div>
                    <span className="text-[#a855f7] text-[10px] font-bold uppercase tracking-widest mb-1 block">{item.category}</span>
                    <h3 className="text-white text-xl font-bold">{item.title}</h3>
                  </div>
                  <Link 
                    to={`/search?category=${item.category}`}
                    className="bg-white/20 hover:bg-white/40 backdrop-blur-md p-3 rounded-full text-white transition-colors"
                  >
                    <Maximize2 size={20} />
                  </Link>
                </div>
              </div>

              {/* Static Content (visible when no hover) */}
              <div className="p-4 bg-white group-hover:translate-y-full transition-transform duration-300">
                <h3 className="font-bold text-gray-800">{item.title}</h3>
                <p className="text-xs text-gray-500 capitalize">{item.category}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Interactive Stats Section */}
        <div className="mt-24 grid grid-cols-1 md:grid-cols-4 gap-8 bg-[#1e0a2d] text-white p-12 rounded-3xl shadow-2xl relative overflow-hidden">
           <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/20 rounded-full blur-3xl -mr-32 -mt-32"></div>
           
           <StatItem value="500+" label="Premium Products" />
           <StatItem value="12" label="Global Brands" />
           <StatItem value="24/7" label="Support System" />
           <StatItem value="10k+" label="Happy Homes" />
        </div>
      </div>
    </div>
  );
};

const StatItem = ({ value, label }) => (
  <div className="flex flex-col items-center text-center">
    <span className="text-4xl font-black text-[#a855f7] mb-2">{value}</span>
    <span className="text-sm text-gray-400 font-medium uppercase tracking-widest">{label}</span>
  </div>
);

export default GalleryScreen;
