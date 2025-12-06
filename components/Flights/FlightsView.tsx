
import React, { useState } from 'react';
import { Calendar, Users, Plane, ArrowLeftRight, ChevronDown, Search } from 'lucide-react';
import TravelersSelect from './TravelersSelect';
import FlightCalendar from './FlightCalendar';
import Sidebar from '../Sidebar';

interface FlightsViewProps {
  onGoHome: () => void;
  onGoDestinations: () => void;
  onGoFlights: () => void;
  onGoSettings?: () => void;
  user: any;
  onNewChat: () => void;
  onSelectSession: (id: string) => void;
}

type TripType = 'oneWay' | 'roundTrip' | 'multiCity';

const FlightsView: React.FC<FlightsViewProps> = ({ 
    onGoHome, 
    onGoDestinations, 
    onGoFlights, 
    onGoSettings, 
    user, 
    onNewChat, 
    onSelectSession 
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [tripType, setTripType] = useState<TripType>('oneWay');
  const [fromCity, setFromCity] = useState('');
  const [toCity, setToCity] = useState('');
  const [date, setDate] = useState('');
  
  // Travelers State
  const [isTravelersOpen, setIsTravelersOpen] = useState(false);
  const [adults, setAdults] = useState(1);
  const [childrenCount, setChildrenCount] = useState(0);
  const [infants, setInfants] = useState(0);
  const [cabinClass, setCabinClass] = useState('الدرجة السياحية');

  // Calendar State
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const handleSwapCities = () => {
      const temp = fromCity;
      setFromCity(toCity);
      setToCity(temp);
  };

  return (
    <div className="fixed inset-0 flex h-full w-full bg-[#f9f8f6] overflow-hidden">
       <Sidebar 
        onNewChat={onNewChat} 
        isOpen={sidebarOpen} 
        setIsOpen={setSidebarOpen}
        onGoHome={onGoHome}
        onGoDestinations={onGoDestinations}
        onGoFlights={onGoFlights}
        onGoSettings={onGoSettings}
        user={user}
        onSelectSession={onSelectSession}
      />

      <main className="flex-1 flex flex-col h-full relative overflow-y-auto transition-all">
          {/* Top Bar Background Element similar to ChatInterface */}
          <div className="absolute top-0 left-0 p-6 z-0 flex items-center gap-4">
             <div className="w-10 h-10 rounded-full bg-gradient-to-br from-stone-200 to-stone-400 shadow-inner" /> 
          </div>

           <div className="flex-1 flex flex-col items-center pt-20 md:pt-32 px-6 pb-12">
               
               <h1 className="text-3xl md:text-4xl font-semibold text-stone-800 mb-2 text-center tracking-tight">
                   رحلات الطيران
               </h1>
               <p className="text-stone-500 mb-10 text-center">خطط لرحلتك القادمة بأفضل الأسعار</p>

               <div className="bg-white rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-white p-6 md:p-8 relative z-10 w-full max-w-5xl animate-fade-in">
                   
                   {/* Trip Type Tabs */}
                   <div className="flex items-center gap-6 mb-8 border-b border-stone-100 pb-6 overflow-x-auto">
                       <label className="flex items-center gap-2 cursor-pointer group whitespace-nowrap">
                           <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${tripType === 'oneWay' ? 'border-stone-900' : 'border-stone-300 group-hover:border-stone-400'}`}>
                               {tripType === 'oneWay' && <div className="w-2.5 h-2.5 bg-stone-900 rounded-full" />}
                           </div>
                           <input type="radio" name="tripType" className="hidden" checked={tripType === 'oneWay'} onChange={() => setTripType('oneWay')} />
                           <span className={`text-sm font-bold ${tripType === 'oneWay' ? 'text-stone-900' : 'text-stone-500'}`}>ذهاب فقط</span>
                       </label>
                       <label className="flex items-center gap-2 cursor-pointer group whitespace-nowrap">
                           <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${tripType === 'roundTrip' ? 'border-stone-900' : 'border-stone-300 group-hover:border-stone-400'}`}>
                               {tripType === 'roundTrip' && <div className="w-2.5 h-2.5 bg-stone-900 rounded-full" />}
                           </div>
                           <input type="radio" name="tripType" className="hidden" checked={tripType === 'roundTrip'} onChange={() => setTripType('roundTrip')} />
                           <span className={`text-sm font-bold ${tripType === 'roundTrip' ? 'text-stone-900' : 'text-stone-500'}`}>ذهاب وعودة</span>
                       </label>
                       <label className="flex items-center gap-2 cursor-pointer group whitespace-nowrap">
                           <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${tripType === 'multiCity' ? 'border-stone-900' : 'border-stone-300 group-hover:border-stone-400'}`}>
                               {tripType === 'multiCity' && <div className="w-2.5 h-2.5 bg-stone-900 rounded-full" />}
                           </div>
                           <input type="radio" name="tripType" className="hidden" checked={tripType === 'multiCity'} onChange={() => setTripType('multiCity')} />
                           <span className={`text-sm font-bold ${tripType === 'multiCity' ? 'text-stone-900' : 'text-stone-500'}`}>وجهات متعددة</span>
                       </label>
                   </div>

                   {/* Search Inputs Grid */}
                   <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 relative">
                       
                       {/* Origin & Destination */}
                       <div className="lg:col-span-5 grid grid-cols-1 md:grid-cols-2 gap-4 relative">
                           <div className="relative group">
                               <div className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none">
                                   <Plane className="w-5 h-5 rotate-180" />
                               </div>
                               <input 
                                 type="text" 
                                 placeholder="من" 
                                 value={fromCity}
                                 onChange={(e) => setFromCity(e.target.value)}
                                 className="w-full bg-stone-50 border border-stone-200 rounded-2xl px-4 py-4 pr-12 text-stone-900 placeholder-stone-400 focus:outline-none focus:border-stone-400 focus:ring-4 focus:ring-stone-100 transition-all font-bold"
                               />
                               <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-stone-400 pointer-events-none uppercase tracking-wider">Origin</span>
                           </div>

                            {/* Swap Button */}
                           <button 
                             onClick={handleSwapCities}
                             className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white border border-stone-200 rounded-full flex items-center justify-center text-stone-500 hover:text-stone-900 hover:border-stone-400 shadow-sm transition-all hidden md:flex"
                           >
                               <ArrowLeftRight className="w-4 h-4" />
                           </button>

                           <div className="relative group">
                               <div className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none">
                                   <Plane className="w-5 h-5" />
                               </div>
                               <input 
                                 type="text" 
                                 placeholder="إلى" 
                                 value={toCity}
                                 onChange={(e) => setToCity(e.target.value)}
                                 className="w-full bg-stone-50 border border-stone-200 rounded-2xl px-4 py-4 pr-12 text-stone-900 placeholder-stone-400 focus:outline-none focus:border-stone-400 focus:ring-4 focus:ring-stone-100 transition-all font-bold"
                               />
                               <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-stone-400 pointer-events-none uppercase tracking-wider">Destination</span>
                           </div>
                       </div>

                       {/* Date */}
                       <div className="lg:col-span-3 relative">
                           <button 
                             onClick={() => setIsCalendarOpen(!isCalendarOpen)}
                             className="w-full h-full bg-stone-50 border border-stone-200 rounded-2xl px-4 py-4 flex items-center justify-between hover:border-stone-400 transition-all group"
                           >
                               <div className="flex items-center gap-3">
                                   <Calendar className="w-5 h-5 text-stone-400 group-hover:text-stone-600" />
                                   <div className="text-right">
                                       <span className={`block text-sm font-bold ${date ? 'text-stone-900' : 'text-stone-400'}`}>
                                           {date || 'تاريخ الرحلة'}
                                       </span>
                                   </div>
                               </div>
                           </button>
                           
                           {/* Calendar Dropdown */}
                           <FlightCalendar 
                             isOpen={isCalendarOpen} 
                             onClose={() => setIsCalendarOpen(false)} 
                             onSelectDate={(d) => setDate(d)}
                             selectedDate={date}
                           />
                       </div>

                       {/* Travelers & Class */}
                       <div className="lg:col-span-4 relative">
                           <button 
                             onClick={() => setIsTravelersOpen(!isTravelersOpen)}
                             className="w-full h-full bg-stone-50 border border-stone-200 rounded-2xl px-4 py-4 flex items-center justify-between hover:border-stone-400 transition-all group"
                           >
                               <div className="flex items-center gap-3">
                                   <Users className="w-5 h-5 text-stone-400 group-hover:text-stone-600" />
                                   <div className="text-right overflow-hidden">
                                       <span className="block text-[10px] text-stone-400 mb-0.5">المسافرين والدرجة</span>
                                       <span className="block text-sm font-bold text-stone-900 truncate">
                                           {adults + childrenCount + infants} مسافر • {cabinClass}
                                       </span>
                                   </div>
                               </div>
                               <ChevronDown className="w-4 h-4 text-stone-400" />
                           </button>
                           
                           {/* Travelers Dropdown */}
                           <TravelersSelect 
                             isOpen={isTravelersOpen} 
                             onClose={() => setIsTravelersOpen(false)}
                             adults={adults} setAdults={setAdults}
                             childrenCount={childrenCount} setChildrenCount={setChildrenCount}
                             infants={infants} setInfants={setInfants}
                             cabinClass={cabinClass} setCabinClass={setCabinClass}
                           />
                       </div>

                   </div>

                   {/* Search Button */}
                   <div className="mt-8">
                       <button className="w-full bg-stone-900 hover:bg-black text-white py-4 rounded-2xl font-bold text-lg shadow-xl transition-all transform active:scale-[0.99] flex items-center justify-center gap-2">
                           <Search className="w-5 h-5" />
                           <span>إبحث عن رحلات</span>
                       </button>
                   </div>

               </div>
               
               {/* Footer Text */}
               <div className="text-center mt-8">
                    <div className="inline-block text-stone-500 text-[11px] px-3 py-1.5 rounded-lg mb-1 font-medium">
                    تم إنشاء بواسطة Percent
                    </div>
                    <p className="text-[11px] text-stone-400">
                        يمكن للذكاء الاصطناعي ارتكاب الأخطاء. يرجى التحقق من المعلومات.
                    </p>
                </div>

           </div>
      </main>
    </div>
  );
};

export default FlightsView;
