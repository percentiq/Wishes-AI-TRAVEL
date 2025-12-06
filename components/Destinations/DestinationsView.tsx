import React, { useState, useEffect } from 'react';
import { Search, Map as MapIcon, Star, Navigation, ArrowRight, Heart, Share2, ChevronDown, ChevronLeft, ChevronRight, Menu } from 'lucide-react';
import MapComponent from './MapComponent';
import BookingModal from './BookingModal';
import { Destination, DestinationType } from '../../types';
import { getDestinations } from '../../services/destinationService';

interface DestinationsViewProps {
  onGoHome: () => void;
}

const DestinationsView: React.FC<DestinationsViewProps> = ({ onGoHome }) => {
  const [viewMode, setViewMode] = useState<'map' | 'list'>('list');
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDest, setSelectedDest] = useState<Destination | null>(null);
  const [showBooking, setShowBooking] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<DestinationType | 'all'>('all');
  const [selectedCity, setSelectedCity] = useState<string>('all');

  const iraqGovernorates = [
      { id: 'all', name: 'الكل' },
      { id: 'بغداد', name: 'بغداد' },
      { id: 'النجف', name: 'النجف' },
      { id: 'كربلاء', name: 'كربلاء' },
      { id: 'أربيل', name: 'أربيل' },
      { id: 'البصرة', name: 'البصرة' },
      { id: 'الناصرية', name: 'ذي قار' },
  ];

  useEffect(() => {
    loadDestinations();
  }, [searchQuery, selectedType, selectedCity]);

  const loadDestinations = async () => {
    setLoading(true);
    try {
        const data = await getDestinations({ 
            search: searchQuery, 
            type: selectedType,
            city: selectedCity
        });
        setDestinations(data);
    } catch (error) {
        console.error(error);
    } finally {
        setLoading(false);
    }
  };

  const handleRouteClick = () => {
      alert('جارٍ حساب أفضل مسار من موقعك الحالي...');
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
      e.currentTarget.src = 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&q=80';
  };

  return (
    <div className="fixed inset-0 bg-[#F4F3F0] flex flex-col md:flex-row overflow-hidden">
      
      {/* Sidebar / List Panel */}
      <aside className={`
        absolute md:relative z-20 w-full md:w-[450px] h-full bg-white shadow-xl flex flex-col transition-transform duration-300 ease-in-out
        ${viewMode === 'list' ? 'translate-x-0' : 'translate-x-full md:translate-x-0'}
        ${!isSidebarOpen && 'md:!w-0 md:!overflow-hidden md:!p-0'}
      `}>
         
         {/* Header */}
         <div className="p-5 border-b border-stone-100 flex items-center justify-between bg-white z-10">
             <div className="flex items-center gap-2">
                <button onClick={onGoHome} className="p-2 -mr-2 text-stone-400 hover:text-stone-800 transition-colors">
                    <ArrowRight className="w-5 h-5" />
                </button>
                <h1 className="text-xl font-bold text-stone-900">استكشف الوجهات</h1>
             </div>
             
             {/* Desktop Close Sidebar Button */}
             <button 
                onClick={() => setIsSidebarOpen(false)}
                className="hidden md:block p-2 text-stone-400 hover:text-stone-800 hover:bg-stone-100 rounded-full transition-colors"
                title="إخفاء القائمة"
             >
                 <ChevronRight className="w-5 h-5" />
             </button>

             <div className="md:hidden w-9" /> {/* Spacer for mobile */}
         </div>

         {/* Search & Filters */}
         <div className="p-5 space-y-4 bg-white z-10 shadow-sm">
             <div className="relative">
                 <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                 <input 
                   type="text" 
                   placeholder="ابحث عن مدينة، معلم، أو دولة..." 
                   value={searchQuery}
                   onChange={(e) => setSearchQuery(e.target.value)}
                   className="w-full bg-stone-50 border border-stone-200 rounded-xl pr-10 pl-4 py-3 text-sm focus:outline-none focus:border-stone-400 transition-all"
                 />
             </div>

             {/* Governorate Filter Dropdown/Chips */}
             <div>
                <label className="text-xs font-bold text-stone-500 mb-2 block">محافظات العراق</label>
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    {iraqGovernorates.map((gov) => (
                        <button
                        key={gov.id}
                        onClick={() => setSelectedCity(gov.id)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border
                            ${selectedCity === gov.id 
                                ? 'bg-stone-900 text-white border-stone-900 shadow-md' 
                                : 'bg-stone-50 text-stone-600 border-stone-100 hover:bg-stone-100'}
                        `}
                        >
                            {gov.name}
                        </button>
                    ))}
                </div>
             </div>
             
             <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide border-t border-stone-50 pt-4">
                 {['all', 'nature', 'history', 'urban', 'beach'].map((type) => (
                     <button
                       key={type}
                       onClick={() => setSelectedType(type as any)}
                       className={`px-3 py-1 rounded-lg text-[10px] font-bold whitespace-nowrap transition-colors border
                         ${selectedType === type 
                            ? 'bg-stone-200 text-stone-900 border-stone-300' 
                            : 'bg-white text-stone-400 border-stone-100 hover:border-stone-200'}
                       `}
                     >
                         {type === 'all' ? 'الكل' : type === 'nature' ? 'طبيعة' : type === 'history' ? 'تاريخ' : type === 'urban' ? 'مدن' : 'شاطئ'}
                     </button>
                 ))}
             </div>
         </div>

         {/* List Content OR Details View */}
         <div className="flex-1 overflow-y-auto bg-stone-50 custom-scrollbar">
             {selectedDest ? (
                 <div className="animate-fade-in">
                     <div className="relative h-64 w-full group cursor-pointer">
                         <img 
                            src={selectedDest.thumbnailUrl} 
                            className="w-full h-full object-cover" 
                            alt={selectedDest.name}
                            onError={handleImageError}
                         />
                         <button 
                           onClick={() => setSelectedDest(null)}
                           className="absolute top-4 right-4 bg-white/30 backdrop-blur-md p-2 rounded-full text-white hover:bg-white hover:text-stone-900 transition-all"
                         >
                             <ArrowRight className="w-5 h-5" />
                         </button>
                     </div>
                     
                     <div className="p-6 -mt-6 relative bg-white rounded-t-3xl min-h-[500px]">
                         <div className="flex items-start justify-between mb-4">
                             <div>
                                 <h2 className="text-2xl font-bold text-stone-900">{selectedDest.name}</h2>
                                 <div className="flex items-center gap-1.5 text-stone-500 mt-1">
                                     <MapIcon className="w-4 h-4" />
                                     <span className="text-sm">{selectedDest.city}، {selectedDest.country}</span>
                                 </div>
                             </div>
                             <div className="flex flex-col items-end">
                                 <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-lg border border-yellow-100">
                                     <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                     <span className="font-bold text-stone-900">{selectedDest.averageRating}</span>
                                 </div>
                                 <span className="text-[10px] text-stone-400 mt-1">{selectedDest.reviewsCount} تقييم</span>
                             </div>
                         </div>

                         <div className="flex gap-4 mb-6 border-b border-stone-100 pb-6">
                             <button onClick={handleRouteClick} className="flex-1 flex flex-col items-center gap-2 p-3 rounded-2xl bg-stone-50 hover:bg-stone-100 transition-colors group">
                                 <div className="w-10 h-10 bg-white rounded-full shadow-sm flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                                     <Navigation className="w-5 h-5" />
                                 </div>
                                 <span className="text-xs font-bold text-stone-600">المسار</span>
                             </button>
                             <button className="flex-1 flex flex-col items-center gap-2 p-3 rounded-2xl bg-stone-50 hover:bg-stone-100 transition-colors group">
                                 <div className="w-10 h-10 bg-white rounded-full shadow-sm flex items-center justify-center text-red-500 group-hover:scale-110 transition-transform">
                                     <Heart className="w-5 h-5" />
                                 </div>
                                 <span className="text-xs font-bold text-stone-600">حفظ</span>
                             </button>
                             <button className="flex-1 flex flex-col items-center gap-2 p-3 rounded-2xl bg-stone-50 hover:bg-stone-100 transition-colors group">
                                 <div className="w-10 h-10 bg-white rounded-full shadow-sm flex items-center justify-center text-stone-600 group-hover:scale-110 transition-transform">
                                     <Share2 className="w-5 h-5" />
                                 </div>
                                 <span className="text-xs font-bold text-stone-600">مشاركة</span>
                             </button>
                         </div>

                         <div className="space-y-4 mb-8">
                             <h3 className="font-bold text-stone-900">عن الوجهة</h3>
                             <p className="text-stone-600 leading-relaxed text-sm">
                                 {selectedDest.descriptionFull}
                             </p>
                             <div className="flex flex-wrap gap-2">
                                 {selectedDest.tags.map(tag => (
                                     <span key={tag} className="bg-stone-100 text-stone-600 px-3 py-1 rounded-full text-xs font-medium">#{tag}</span>
                                 ))}
                             </div>
                         </div>

                         {selectedDest.hasBooking && (
                             <div className="sticky bottom-4 left-0 right-0">
                                 <button 
                                   onClick={() => setShowBooking(true)}
                                   className="w-full bg-stone-900 text-white py-4 rounded-2xl font-bold shadow-xl hover:bg-black transition-transform hover:scale-[1.02]"
                                 >
                                     احجز الآن
                                 </button>
                             </div>
                         )}
                     </div>
                 </div>
             ) : (
                 <div className="p-5 space-y-4">
                     {loading ? (
                         <div className="space-y-4">
                             {[1,2,3].map(i => <div key={i} className="h-32 bg-stone-200 rounded-2xl animate-pulse" />)}
                         </div>
                     ) : (
                         destinations.length > 0 ? (
                            destinations.map(dest => (
                                <div 
                                  key={dest.id} 
                                  onClick={() => setSelectedDest(dest)}
                                  className="bg-white p-3 rounded-2xl shadow-sm border border-stone-100 flex gap-4 cursor-pointer hover:shadow-md transition-all group"
                                >
                                    <div className="w-24 h-24 rounded-xl overflow-hidden bg-stone-200 flex-shrink-0">
                                        <img 
                                           src={dest.thumbnailUrl} 
                                           alt={dest.name} 
                                           className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                           onError={handleImageError}
                                        />
                                    </div>
                                    <div className="flex-1 py-1">
                                        <div className="flex justify-between items-start mb-1">
                                            <h3 className="font-bold text-stone-900 group-hover:text-stone-600 transition-colors">{dest.name}</h3>
                                            <span className="text-xs font-bold text-stone-400">{dest.priceLevel}</span>
                                        </div>
                                        <p className="text-xs text-stone-500 mb-2 line-clamp-2">{dest.descriptionShort}</p>
                                        <div className="flex items-center gap-4 text-xs text-stone-400 mt-auto">
                                            <div className="flex items-center gap-1">
                                                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                                <span className="text-stone-700 font-bold">{dest.averageRating}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <MapIcon className="w-3 h-3" />
                                                <span>{dest.city}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                         ) : (
                             <div className="text-center py-12">
                                 <p className="text-stone-400">لا توجد وجهات تطابق بحثك.</p>
                             </div>
                         )
                     )}
                 </div>
             )}
         </div>

         {/* Mobile Toggle */}
         <div className="md:hidden absolute bottom-6 left-1/2 -translate-x-1/2 z-30 bg-stone-900 text-white p-1 rounded-full shadow-lg flex items-center">
             <button 
               onClick={() => setViewMode('map')}
               className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${viewMode === 'map' ? 'bg-white text-stone-900' : 'text-stone-400'}`}
             >
                 الخريطة
             </button>
             <button 
               onClick={() => setViewMode('list')}
               className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${viewMode === 'list' ? 'bg-white text-stone-900' : 'text-stone-400'}`}
             >
                 القائمة
             </button>
         </div>

      </aside>

      {/* Map Area */}
      <main className="flex-1 relative h-full transition-all duration-300">
         {/* Desktop Open Sidebar Button */}
         {!isSidebarOpen && (
             <button 
                onClick={() => setIsSidebarOpen(true)}
                className="hidden md:flex absolute top-4 right-4 z-[1000] bg-white shadow-lg p-3 rounded-xl text-stone-900 hover:bg-stone-50 transition-all items-center gap-2 font-bold text-sm border border-stone-200"
             >
                 <Menu className="w-5 h-5" />
                 <span>القائمة</span>
             </button>
         )}
         
         <MapComponent 
            destinations={destinations} 
            selectedDestination={selectedDest}
            onSelectDestination={(dest) => {
                setSelectedDest(dest);
                if (window.innerWidth < 768) setViewMode('list');
                if (!isSidebarOpen && window.innerWidth >= 768) setIsSidebarOpen(true);
            }}
         />
      </main>

      {/* Modals */}
      {selectedDest && (
          <BookingModal 
             destination={selectedDest} 
             isOpen={showBooking} 
             onClose={() => setShowBooking(false)} 
          />
      )}

    </div>
  );
};

export default DestinationsView;