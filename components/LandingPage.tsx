

import React from 'react';
import { MapPin, Compass, Search, Play, CreditCard, Star, Calendar, Users, ArrowRight, CheckCircle } from 'lucide-react';

interface LandingPageProps {
  onStartChat: () => void;
  onOpenAuth: () => void;
  user: any;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStartChat, onOpenAuth, user }) => {
  const handleMainAction = () => {
    if (user) {
      onStartChat();
    } else {
      onOpenAuth();
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F3F0] flex flex-col overflow-x-hidden font-sans text-stone-800">
      <header className="flex items-center justify-between px-6 py-5 md:px-12 max-w-7xl mx-auto w-full z-20 relative">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-stone-900 rounded-xl flex items-center justify-center text-white shadow-lg shadow-stone-900/20">
            <Compass className="w-6 h-6" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold tracking-tight leading-none">Wishes</span>
            <span className="text-[10px] text-stone-500 font-medium tracking-wider">AI TRAVEL</span>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-stone-600 bg-white/50 backdrop-blur-sm px-6 py-2.5 rounded-full border border-stone-200/50">
          <a href="#" className="text-stone-900 font-bold">الرئيسية</a>
          <a href="#" className="hover:text-stone-900 transition-colors">الفنادق</a>
          <a href="#" className="hover:text-stone-900 transition-colors">الطيران</a>
          <a href="#" className="hover:text-stone-900 transition-colors">الباقات</a>
          <a href="#" className="hover:text-stone-900 transition-colors">من نحن</a>
        </nav>

        <div className="flex items-center gap-3">
          {!user && (
            <button onClick={onOpenAuth} className="hidden md:block text-sm font-medium text-stone-600 hover:text-stone-900">
              تسجيل الدخول
            </button>
          )}
          <button 
            onClick={handleMainAction} 
            className="bg-stone-900 hover:bg-black text-white px-5 py-2.5 rounded-full text-sm font-semibold transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
          >
            {user ? 'تابع التخطيط' : 'ابدأ التخطيط'}
          </button>
        </div>
      </header>

      <div className="relative w-full max-w-[95%] mx-auto mt-2">
        {/* Hero Section with Large Image */}
        <div className="relative w-full rounded-[3rem] overflow-hidden min-h-[600px] md:min-h-[700px] shadow-2xl group z-0">
          <img 
            src="https://c.top4top.io/p_3626yvpbj1.png" 
            alt="Hot Air Balloons" 
            referrerPolicy="no-referrer"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-[10s] group-hover:scale-105 ease-linear"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/40" />
          
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-4 pb-32">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-1.5 rounded-full mb-6 animate-fade-in">
              <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
              <span className="text-xs font-medium tracking-wide">المنصة الأولى للسفر الذكي</span>
            </div>
            
            <h1 className="text-5xl md:text-8xl font-bold mb-6 drop-shadow-xl tracking-tight leading-tight">
              اكتشف وجهات <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-200 to-white">أحلامك</span>
            </h1>
            
            <p className="text-lg md:text-xl text-white/90 font-light mb-10 max-w-xl drop-shadow-sm leading-relaxed">
              استمتع بتجارب سفر لا تُنسى. دع الذكاء الاصطناعي يخطط لرحلتك المثالية من الألف إلى الياء.
            </p>

            <div className="w-20 h-20 rounded-full border border-white/30 flex items-center justify-center backdrop-blur-sm cursor-pointer hover:scale-110 transition-transform duration-300 group/play">
              <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-lg shadow-white/20 group-hover/play:bg-stone-100 transition-colors">
                <Play className="w-5 h-5 text-stone-900 fill-stone-900 ml-1" />
              </div>
            </div>
          </div>
        </div>

        {/* Search Bar Overlay */}
        <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 w-full max-w-5xl px-6 z-20">
          <div className="bg-white/95 backdrop-blur-md rounded-3xl p-4 shadow-[0_20px_50px_rgba(0,0,0,0.2)] flex flex-col md:flex-row items-center gap-4 border border-white/50">
            <div className="flex-1 w-full px-4 py-2 border-b md:border-b-0 md:border-l border-stone-100 hover:bg-stone-50 rounded-2xl transition-colors cursor-pointer group">
              <label className="flex items-center gap-2 text-xs font-bold text-stone-900 uppercase tracking-wide mb-1 group-hover:text-orange-600 transition-colors">
                الموقع <span className="text-stone-300"><ArrowRight className="w-3 h-3 rotate-90 md:rotate-0" /></span>
              </label>
              <div className="flex items-center justify-between">
                <input type="text" placeholder="إلى أين وجهتك؟" className="w-full text-base font-medium text-stone-800 placeholder-stone-400 outline-none bg-transparent" />
                <MapPin className="w-4 h-4 text-stone-400" />
              </div>
            </div>
            
            <div className="flex-1 w-full px-4 py-2 border-b md:border-b-0 md:border-l border-stone-100 hover:bg-stone-50 rounded-2xl transition-colors cursor-pointer group">
              <label className="flex items-center gap-2 text-xs font-bold text-stone-900 uppercase tracking-wide mb-1 group-hover:text-orange-600 transition-colors">
                التاريخ <span className="text-stone-300"><ArrowRight className="w-3 h-3 rotate-90 md:rotate-0" /></span>
              </label>
              <input type="text" placeholder="اختر التاريخ" className="w-full text-base font-medium text-stone-800 placeholder-stone-400 outline-none bg-transparent" />
            </div>

            <div className="flex-1 w-full px-4 py-2 hover:bg-stone-50 rounded-2xl transition-colors cursor-pointer group">
              <label className="flex items-center gap-2 text-xs font-bold text-stone-900 uppercase tracking-wide mb-1 group-hover:text-orange-600 transition-colors">
                الضيوف <span className="text-stone-300"><ArrowRight className="w-3 h-3 rotate-90 md:rotate-0" /></span>
              </label>
              <input type="text" placeholder="2 بالغين، 1 طفل" className="w-full text-base font-medium text-stone-800 placeholder-stone-400 outline-none bg-transparent" />
            </div>

            <button onClick={handleMainAction} className="bg-stone-900 hover:bg-stone-800 text-white px-8 py-5 rounded-2xl flex items-center justify-center gap-3 transition-all shadow-lg hover:shadow-xl hover:scale-[1.02] w-full md:w-auto">
              <Search className="w-5 h-5" />
              <span className="font-bold text-lg">بحث</span>
            </button>
          </div>
        </div>
      </div>

      {/* Partners / Logos */}
      <div className="max-w-7xl mx-auto w-full px-6 pt-16 pb-12">
        <p className="text-center text-sm font-medium text-stone-400 mb-8">نعمل مع أفضل شركات الطيران والفنادق حول العالم</p>
        <div className="flex flex-wrap justify-center md:justify-between items-center gap-8 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
           {['Qatar Airways', 'Emirates', 'Marriott', 'Airbnb', 'Booking.com', 'Hilton'].map((logo) => (
             <span key={logo} className="text-xl md:text-2xl font-bold font-serif text-stone-800 cursor-default">{logo}</span>
           ))}
        </div>
      </div>

      {/* Featured Destinations Grid */}
      <div className="max-w-7xl mx-auto w-full px-6 py-12 grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Left Column (Text & Filters) */}
        <div className="lg:col-span-3 space-y-8">
           <div className="bg-white p-6 rounded-3xl shadow-sm border border-stone-100">
              <h3 className="text-xl font-bold text-stone-900 mb-6">عروض الباقات</h3>
              <div className="space-y-2">
                 <button className="w-full flex items-center justify-between p-3 bg-blue-50 text-blue-900 rounded-xl font-medium transition-colors">
                    <span>أفضل الصفقات</span>
                    <ArrowRight className="w-4 h-4 rotate-180" />
                 </button>
                 <button className="w-full flex items-center justify-between p-3 hover:bg-stone-50 text-stone-600 rounded-xl font-medium transition-colors">
                    <span>آسيا</span>
                 </button>
                 <button className="w-full flex items-center justify-between p-3 hover:bg-stone-50 text-stone-600 rounded-xl font-medium transition-colors">
                    <span>أوروبا</span>
                 </button>
                 <button className="w-full flex items-center justify-between p-3 hover:bg-stone-50 text-stone-600 rounded-xl font-medium transition-colors">
                    <span>الشرق الأوسط</span>
                 </button>
                 <button className="w-full flex items-center justify-between p-3 hover:bg-stone-50 text-stone-600 rounded-xl font-medium transition-colors">
                    <span>أمريكا الشمالية</span>
                 </button>
              </div>
           </div>

           <div className="bg-stone-900 text-white p-6 rounded-3xl shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10" />
              <h3 className="text-lg font-bold mb-2">هل تحتاج مساعدة؟</h3>
              <p className="text-stone-300 text-sm mb-4">تحدث مع مساعدنا الذكي لتخطيط رحلتك في ثوانٍ.</p>
              <button onClick={handleMainAction} className="w-full bg-white text-stone-900 py-3 rounded-xl font-bold text-sm hover:bg-stone-100 transition-colors">
                تحدث الآن
              </button>
           </div>
        </div>

        {/* Right Column (Grid of Images) */}
        <div className="lg:col-span-9">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
              {/* NYC Card */}
              <div className="md:col-span-2 relative h-80 bg-stone-200 rounded-[2rem] overflow-hidden group cursor-pointer shadow-sm hover:shadow-xl transition-all duration-500">
                 <img 
                   referrerPolicy="no-referrer"
                   src="https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&q=80" 
                   className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                   alt="NYC" 
                 />
                 <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-transparent opacity-60" />
                 <div className="absolute top-8 left-8 bg-white/90 backdrop-blur-sm px-6 py-4 rounded-2xl shadow-lg transform group-hover:-translate-y-2 transition-transform duration-500">
                    <h4 className="text-lg font-bold text-stone-900">مدينة نيويورك</h4>
                    <div className="flex items-center gap-1 text-stone-500 text-xs mt-1">
                       <MapPin className="w-3 h-3" />
                       <span>الولايات المتحدة</span>
                    </div>
                    <button onClick={handleMainAction} className="mt-3 flex items-center gap-2 text-xs font-bold text-stone-900 bg-stone-100 px-3 py-2 rounded-lg hover:bg-stone-200 transition-colors">
                       <Calendar className="w-3 h-3" />
                       <span>احجز الآن</span>
                    </button>
                 </div>
              </div>

              {/* Bangladesh / Cox's Bazar Card (Bottom Left) */}
              <div className="relative h-64 bg-white rounded-[2rem] p-4 flex gap-4 shadow-sm border border-stone-100 hover:shadow-lg transition-all duration-300 group cursor-pointer">
                <div className="flex-1 flex flex-col justify-center pl-2">
                  <h4 className="text-lg font-bold text-stone-900 mb-1">بنغلاديش</h4>
                  <div className="flex items-center gap-1 text-stone-500 text-xs mb-4">
                    <MapPin className="w-3 h-3" />
                    <span>كوكس بازار</span>
                  </div>
                  <button onClick={handleMainAction} className="w-fit bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold px-4 py-2 rounded-lg transition-colors">
                    استكشف
                  </button>
                </div>
                <div className="w-1/2 h-full bg-stone-200 rounded-2xl overflow-hidden relative">
                  <img referrerPolicy="no-referrer" src="https://images.unsplash.com/photo-1598556776374-2795c73919f1?q=80&w=800&auto=format&fit=crop" className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="Cox's Bazar" />
                </div>
              </div>

              {/* Mountains / Nepal (Bottom Right) */}
              <div className="row-span-2 relative h-[34rem] bg-stone-200 rounded-[2rem] overflow-hidden group cursor-pointer shadow-sm hover:shadow-xl transition-all duration-500 -mt-[6.5rem] md:mt-0">
                 <img 
                   referrerPolicy="no-referrer"
                   src="https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&q=80" 
                   className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                   alt="Mountains" 
                 />
                 <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-80" />
                 <div className="absolute top-6 right-6 bg-white/30 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-medium border border-white/20">
                    نيبال
                 </div>
                 <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[90%] bg-[#FDF8F0] p-4 rounded-2xl text-center transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300 shadow-xl">
                    <h4 className="font-bold text-stone-900 mb-1">جبال الهيمالايا</h4>
                    <div className="flex justify-center gap-0.5 text-yellow-500 mb-3">
                       {[1,2,3,4,5].map(i => <Star key={i} className="w-3 h-3 fill-current" />)}
                    </div>
                    <button onClick={handleMainAction} className="w-full border border-stone-200 text-stone-600 text-xs font-bold py-2.5 rounded-xl hover:bg-stone-900 hover:text-white transition-colors">
                       احجز مغامرتك
                    </button>
                 </div>
              </div>

              {/* Dubai Card */}
              <div className="row-span-2 relative h-[34rem] bg-stone-200 rounded-[2rem] overflow-hidden group cursor-pointer shadow-sm hover:shadow-xl transition-all duration-500 -mt-[6.5rem] md:mt-0">
                 <img 
                   referrerPolicy="no-referrer"
                   src="https://images.unsplash.com/photo-1518684079-3c830dcef090?q=80&w=800&auto=format&fit=crop" 
                   className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                   alt="Dubai" 
                 />
                 <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-80" />
                 <div className="absolute top-6 right-6 bg-white/30 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-medium border border-white/20">
                    الإمارات
                 </div>
                 <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[90%] bg-[#FDF8F0] p-4 rounded-2xl text-center transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300 shadow-xl">
                    <h4 className="font-bold text-stone-900 mb-1">دبي</h4>
                    <div className="flex justify-center gap-0.5 text-yellow-500 mb-3">
                       {[1,2,3,4,5].map(i => <Star key={i} className="w-3 h-3 fill-current" />)}
                    </div>
                    <button onClick={handleMainAction} className="w-full border border-stone-200 text-stone-600 text-xs font-bold py-2.5 rounded-xl hover:bg-stone-900 hover:text-white transition-colors">
                       احجز إقامتك
                    </button>
                 </div>
              </div>

           </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-20 px-6 mt-12">
         <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
               <h2 className="text-3xl font-bold text-stone-900 mb-4">لماذا تختار Wishes؟</h2>
               <p className="text-stone-500 max-w-2xl mx-auto">نجمع بين قوة الذكاء الاصطناعي وخبرة السفر لنقدم لك تجربة تخطيط لا مثيل لها.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
               <div className="flex flex-col items-center text-center p-6 rounded-3xl hover:bg-stone-50 transition-colors">
                  <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
                     <CreditCard className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-stone-900 mb-3">تخطيط فوري بالذكاء الاصطناعي</h3>
                  <p className="text-stone-500 text-sm leading-relaxed">احصل على خطط سفر كاملة ومفصلة في ثوانٍ معدودة، مخصصة بالكامل حسب تفضيلاتك.</p>
               </div>
               <div className="flex flex-col items-center text-center p-6 rounded-3xl hover:bg-stone-50 transition-colors">
                  <div className="w-16 h-16 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center mb-6">
                     <CheckCircle className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-stone-900 mb-3">موثوقية وأمان</h3>
                  <p className="text-stone-500 text-sm leading-relaxed">نقدم لك معلومات دقيقة ومحدثة عن الوجهات، مع ضمان أفضل الأسعار وخيارات حجز آمنة.</p>
               </div>
               <div className="flex flex-col items-center text-center p-6 rounded-3xl hover:bg-stone-50 transition-colors">
                  <div className="w-16 h-16 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center mb-6">
                     <Users className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-stone-900 mb-3">دعم متواصل</h3>
                  <p className="text-stone-500 text-sm leading-relaxed">مساعدنا الذكي متاح 24/7 للإجابة على استفساراتك ومساعدتك في أي وقت أثناء رحلتك.</p>
               </div>
            </div>
         </div>
      </div>

      {/* Footer */}
      <footer className="bg-stone-900 text-stone-300 py-16 mt-auto">
         <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="space-y-6">
               <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-stone-900">
                     <Compass className="w-5 h-5" />
                  </div>
                  <span className="text-xl font-bold text-white">Wishes</span>
               </div>
               <p className="text-sm text-stone-400 leading-relaxed">
                  رفيقك الذكي لاستكشاف العالم. نخطط، نحجز، ونرشدك في كل خطوة من رحلتك.
               </p>
               {/* Social Icons Placeholder */}
               <div className="flex gap-4">
                  <a href="#" className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors">
                     {/* Instagram Icon */}
                     <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
                  </a>
                  <a href="#" className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors">
                     {/* Twitter Icon */}
                     <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
                  </a>
                  <a href="#" className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors">
                     {/* Facebook Icon */}
                     <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                  </a>
               </div>
            </div>
            
            <div>
               <h4 className="text-white font-bold mb-6">الشركة</h4>
               <ul className="space-y-4 text-sm">
                  <li><a href="#" className="hover:text-white transition-colors">من نحن</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">الوظائف</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">المدونة</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">الصحافة</a></li>
               </ul>
            </div>

            <div>
               <h4 className="text-white font-bold mb-6">الدعم</h4>
               <ul className="space-y-4 text-sm">
                  <li><a href="#" className="hover:text-white transition-colors">مركز المساعدة</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">شروط الخدمة</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">سياسة الخصوصية</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">اتصل بنا</a></li>
               </ul>
            </div>

            <div>
               <h4 className="text-white font-bold mb-6">اشترك في النشرة</h4>
               <p className="text-sm text-stone-400 mb-4">احصل على أحدث عروض السفر ونصائح التخطيط مباشرة في بريدك.</p>
               <div className="flex gap-2">
                  <input type="email" placeholder="بريدك الإلكتروني" className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-white/30 flex-1" />
                  <button className="bg-white text-stone-900 px-4 py-2 rounded-lg font-bold text-sm hover:bg-stone-200 transition-colors">
                     <ArrowRight className="w-5 h-5" />
                  </button>
               </div>
            </div>
         </div>
         
         <div className="max-w-7xl mx-auto px-6 mt-16 pt-8 border-t border-white/10 flex flex-col items-center justify-center gap-4">
            <div className="flex items-center gap-3">
               <span className="text-sm text-stone-500 font-medium">تم إنشاء بواسطة Percent</span>
               {/* Small logo or icon if needed */}
               <svg width="180" height="180" viewBox="0 0 180 180" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-5 w-auto opacity-80 hover:opacity-100 transition-opacity">
                  <g clipPath="url(#clip0_601_9)">
                  <path d="M136.83 93.264C129.834 94.068 125.832 95.136 121.05 97.482C109.728 103.038 101.562 113.424 98.67 125.964C97.824 129.618 97.512 136.446 98.016 139.992C99.798 152.364 106.236 162.624 116.466 169.392C120.588 172.116 125.346 174.066 130.722 175.224C134.886 176.118 142.554 176.202 146.418 175.392C154.878 173.616 161.85 169.89 167.862 163.932C176.052 155.82 179.964 146.52 180 135.084C180.024 127.56 178.734 122.25 175.248 115.536C169.446 104.37 158.22 96.006 146.232 93.924C143.268 93.408 138.486 93.072 136.83 93.264ZM143.922 114.12C154.974 117.162 161.688 129.438 158.484 140.754C155.994 149.574 147.96 155.664 138.792 155.694C135.408 155.706 133.194 155.196 129.894 153.648C123.012 150.414 118.638 143.724 118.254 135.852C117.786 126.048 123.648 117.312 132.666 114.402C136.386 113.196 140.226 113.1 143.922 114.12Z" fill="url(#paint0_linear_601_9)"/>
                  <path d="M141.3 12.564C140.664 12.69 139.806 13.002 139.404 13.26C138.996 13.512 134.838 18.708 130.158 24.798C125.484 30.888 120.54 37.272 119.166 38.97C117.798 40.674 112.86 47.052 108.192 53.148C103.53 59.238 97.3922 67.224 94.5482 70.902C91.7102 74.574 84.1082 84.468 77.6522 92.886C71.2022 101.31 63.5222 111.276 60.5942 115.038C57.6722 118.8 48.3002 131.04 39.7742 142.242C31.2482 153.438 22.6262 164.724 20.6162 167.322C14.2502 175.548 13.2422 177.048 13.2422 178.278C13.2422 179.196 13.4042 179.454 14.1482 179.736C15.5042 180.24 33.2222 179.964 34.6202 179.406C35.4542 179.082 37.9142 176.184 45.3482 166.776C50.6522 160.062 57.2222 151.68 59.9462 148.146C62.6642 144.618 66.3062 139.974 68.0282 137.826C69.7562 135.678 74.9882 128.94 79.6562 122.856C84.3242 116.766 91.2122 107.826 94.9562 102.99C98.7002 98.148 103.554 91.848 105.744 88.98C111.102 81.978 120.678 69.564 129.744 57.87C139.8 44.898 158.544 20.316 160.704 17.256C162.054 15.348 162.432 14.55 162.354 13.782C162.282 13.032 162.048 12.72 161.43 12.552C160.35 12.258 142.794 12.27 141.3 12.564Z" fill="url(#paint1_linear_601_9)"/>
                  <path d="M39.0534 0.0546695C32.0574 0.85867 28.0554 1.93267 23.2794 4.27267C11.9514 9.82867 3.7914 20.2207 0.893399 32.7547C0.0533994 36.4087 -0.264601 43.2367 0.245399 46.7827C2.0214 59.1547 8.4594 69.4207 18.6894 76.1827C22.8114 78.9127 27.5694 80.8567 32.9454 82.0147C37.1154 82.9147 44.7774 82.9927 48.6474 82.1827C57.1014 80.4067 64.0734 76.6807 70.0854 70.7287C78.2814 62.6107 82.1934 53.3107 82.2234 41.8747C82.2474 34.3507 80.9574 29.0467 77.4714 22.3327C71.6754 11.1607 60.4434 2.79667 48.4614 0.71467C45.4914 0.19867 40.7154 -0.13733 39.0534 0.0546695ZM46.1514 20.9107C57.1974 23.9527 63.9114 36.2347 60.7134 47.5507C58.2174 56.3647 50.1894 62.4547 41.0214 62.4907C37.6314 62.5027 35.4234 61.9927 32.1174 60.4387C25.2354 57.2107 20.8614 50.5207 20.4834 42.6487C20.0094 32.8387 25.8774 24.1087 34.8894 21.1927C38.6154 19.9927 42.4554 19.8967 46.1514 20.9107Z" fill="url(#paint2_linear_601_9)"/>
                  <defs>
                  <linearGradient id="paint0_linear_601_9" x1="138.487" y1="93.2094" x2="139.297" y2="175.95" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#787878"/>
                  <stop offset="1" stopColor="#808080" stopOpacity="0.81"/>
                  </linearGradient>
                  <linearGradient id="paint1_linear_601_9" x1="87.4321" y1="12.3374" x2="88.3699" y2="179.999" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#787878"/>
                  <stop offset="1" stopColor="#595959"/>
                  </linearGradient>
                  <linearGradient id="paint2_linear_601_9" x1="40.9073" y1="2.20733e-09" x2="41.3216" y2="82.7432" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#787878"/>
                  <stop offset="1" stopColor="#595959"/>
                  </linearGradient>
                  <clipPath id="clip0_601_9">
                  <rect width="180" height="180" fill="white"/>
                  </clipPath>
                  </defs>
                  </g>
               </svg>
            </div>
         </div>
      </footer>
    </div>
  );
};

export default LandingPage;
