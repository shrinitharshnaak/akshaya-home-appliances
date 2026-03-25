import React from 'react';
import { Mail, Phone, MapPin, Award, ShieldCheck, Truck } from 'lucide-react';

const AboutScreen = () => {
  return (
    <div className="bg-white min-h-screen">
      {/* Section 1: Brand Story */}
      <section className="bg-gradient-to-b from-[#1e0a2d] to-[#2d1240] text-white py-20 px-6">
        <div className="max-w-[800px] mx-auto text-center">
          <h1 className="text-5xl font-black italic uppercase tracking-tighter mb-8 animate-in fade-in slide-in-from-bottom-4">
            Akshaya <span className="text-[#a855f7]">Story</span>
          </h1>
          <p className="text-xl text-purple-100 font-light leading-relaxed mb-6">
            Founded in 2026, Akshaya Appliances has quickly become India's leading destination for premium household technology. We believe every home deserves the best in efficiency, style, and reliability.
          </p>
          <div className="flex flex-wrap justify-center gap-6 mt-12">
            <FeatureBadge icon={<Award size={20} />} text="Quality Certified" />
            <FeatureBadge icon={<ShieldCheck size={20} />} text="Trusted Warranty" />
            <FeatureBadge icon={<Truck size={20} />} text="Pan-India Delivery" />
          </div>
        </div>
      </section>

      {/* Section 2: Values */}
      <section className="py-20 px-6 max-w-[1200px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-6 text-gray-900">Why Choose Akshaya?</h2>
            <div className="flex flex-col gap-8">
              <ValueItem 
                title="Customer Centricity" 
                desc="Our service doesn't end at the checkout. We provide 24/7 technical support and installation assistance for every product we sell." 
              />
              <ValueItem 
                title="Curated Selection" 
                desc="We only partner with brands that meet our rigorous standards for energy efficiency and long-term durability." 
              />
              <ValueItem 
                title="Transparent Pricing" 
                desc="No hidden costs. What you see is what you pay, inclusive of standard shipping and taxes across major cities." 
              />
            </div>
          </div>
          <div className="bg-[#f8f6fb] p-8 rounded-3xl border border-purple-100 shadow-inner">
             <img src="/images/hero_banner_1_1773463632030.png" alt="Office" className="rounded-2xl shadow-lg mb-6 w-full object-cover" />
             <div className="bg-white p-6 rounded-xl shadow-sm italic text-gray-600 border-l-4 border-[#a855f7]">
               "Our mission is to modernize Indian households with technology that is both sophisticated and accessible."
               <footer className="mt-2 font-bold text-[#1e0a2d]">— Founder, Akshaya Appliances</footer>
             </div>
          </div>
        </div>
      </section>

      {/* Section 3: Contact */}
      <section className="bg-gray-50 py-20 px-6">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Connect With Our Team</h2>
            <p className="text-gray-600">Have a query? We're here to help you upgrade your life.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <ContactCard 
              icon={<Phone className="text-purple-600" />} 
              label="Sales & Support" 
              value="+91 1800-AKSHAYA" 
              link="tel:+911800123456" 
            />
            <ContactCard 
              icon={<Mail className="text-purple-600" />} 
              label="General Inquiries" 
              value="contact@akshaya.com" 
              link="mailto:contact@akshaya.com" 
            />
            <ContactCard 
              icon={<MapPin className="text-purple-600" />} 
              label="Headquarters" 
              value="Bengaluru, Karnataka, IN" 
              link="#" 
            />
          </div>
        </div>
      </section>
    </div>
  );
};

const FeatureBadge = ({ icon, text }) => (
  <div className="bg-white/10 backdrop-blur-md px-5 py-2 rounded-full border border-white/20 flex items-center gap-2 text-sm font-medium">
    {icon} {text}
  </div>
);

const ValueItem = ({ title, desc }) => (
  <div className="flex flex-col gap-2">
    <h3 className="text-xl font-bold text-[#1e0a2d]">{title}</h3>
    <p className="text-gray-600 leading-relaxed">{desc}</p>
  </div>
);

const ContactCard = ({ icon, label, value, link }) => (
  <a href={link} className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow flex flex-col items-center text-center border border-gray-100">
    <div className="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center mb-4">
      {icon}
    </div>
    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">{label}</span>
    <span className="text-lg font-bold text-gray-900">{value}</span>
  </a>
);

export default AboutScreen;
