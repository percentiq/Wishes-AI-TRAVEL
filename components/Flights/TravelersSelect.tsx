
import React from 'react';
import { X, Minus, Plus } from 'lucide-react';

interface TravelersSelectProps {
  isOpen: boolean;
  onClose: () => void;
  adults: number;
  setAdults: (val: number) => void;
  childrenCount: number;
  setChildrenCount: (val: number) => void;
  infants: number;
  setInfants: (val: number) => void;
  cabinClass: string;
  setCabinClass: (val: string) => void;
}

const TravelersSelect: React.FC<TravelersSelectProps> = ({
  isOpen,
  onClose,
  adults,
  setAdults,
  childrenCount,
  setChildrenCount,
  infants,
  setInfants,
  cabinClass,
  setCabinClass
}) => {
  if (!isOpen) return null;

  return (
    <div className="absolute top-full right-0 mt-3 w-full md:w-80 bg-white rounded-3xl shadow-2xl border border-stone-100 p-6 z-50 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold text-stone-900">خيارات المسافرين</h3>
        <button onClick={onClose} className="text-stone-400 hover:text-stone-800">
           <X className="w-5 h-5" />
        </button>
      </div>
      
      {/* Counter Row: Adults */}
      <div className="flex items-center justify-between mb-4">
        <div>
           <span className="block font-bold text-sm text-stone-800">بالغ</span>
           <span className="text-[10px] text-stone-400 font-medium">أكبر من 12 سنة</span>
        </div>
        <div className="flex items-center gap-3">
           <button 
             onClick={() => setAdults(Math.max(1, adults - 1))}
             className="w-8 h-8 rounded-full border border-stone-200 hover:bg-stone-50 flex items-center justify-center text-stone-600 transition-colors"
           >
             <Minus className="w-3 h-3" />
           </button>
           <span className="font-bold text-stone-900 w-4 text-center">{adults}</span>
           <button 
             onClick={() => setAdults(adults + 1)}
             className="w-8 h-8 rounded-full border border-stone-200 hover:bg-stone-50 flex items-center justify-center text-stone-600 transition-colors"
           >
             <Plus className="w-3 h-3" />
           </button>
        </div>
      </div>

       {/* Counter Row: Children */}
       <div className="flex items-center justify-between mb-4">
        <div>
           <span className="block font-bold text-sm text-stone-800">طفل</span>
           <span className="text-[10px] text-stone-400 font-medium">من 2 إلى 12 سنة</span>
        </div>
        <div className="flex items-center gap-3">
           <button 
             onClick={() => setChildrenCount(Math.max(0, childrenCount - 1))}
             className="w-8 h-8 rounded-full border border-stone-200 hover:bg-stone-50 flex items-center justify-center text-stone-600 transition-colors"
           >
             <Minus className="w-3 h-3" />
           </button>
           <span className="font-bold text-stone-900 w-4 text-center">{childrenCount}</span>
           <button 
             onClick={() => setChildrenCount(childrenCount + 1)}
             className="w-8 h-8 rounded-full border border-stone-200 hover:bg-stone-50 flex items-center justify-center text-stone-600 transition-colors"
           >
             <Plus className="w-3 h-3" />
           </button>
        </div>
      </div>

       {/* Counter Row: Infants */}
       <div className="flex items-center justify-between mb-6">
        <div>
           <span className="block font-bold text-sm text-stone-800">رضيع</span>
           <span className="text-[10px] text-stone-400 font-medium">أقل من عامين</span>
        </div>
        <div className="flex items-center gap-3">
           <button 
             onClick={() => setInfants(Math.max(0, infants - 1))}
             className="w-8 h-8 rounded-full border border-stone-200 hover:bg-stone-50 flex items-center justify-center text-stone-600 transition-colors"
           >
             <Minus className="w-3 h-3" />
           </button>
           <span className="font-bold text-stone-900 w-4 text-center">{infants}</span>
           <button 
             onClick={() => setInfants(infants + 1)}
             className="w-8 h-8 rounded-full border border-stone-200 hover:bg-stone-50 flex items-center justify-center text-stone-600 transition-colors"
           >
             <Plus className="w-3 h-3" />
           </button>
        </div>
      </div>

      <div className="w-full h-px bg-stone-100 mb-6" />

      <h3 className="font-bold text-stone-900 mb-3 text-sm">درجة السفر</h3>
      <div className="space-y-1">
         {['الدرجة السياحية', 'درجة رجال الأعمال', 'الدرجة الأولى'].map((cls) => (
             <label key={cls} className="flex items-center gap-3 cursor-pointer group p-2 rounded-lg hover:bg-stone-50 transition-colors">
                 <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${cabinClass === cls ? 'border-stone-900' : 'border-stone-300 group-hover:border-stone-400'}`}>
                     {cabinClass === cls && <div className="w-2.5 h-2.5 bg-stone-900 rounded-full" />}
                 </div>
                 <input 
                   type="radio" 
                   name="cabin" 
                   className="hidden" 
                   checked={cabinClass === cls} 
                   onChange={() => setCabinClass(cls)} 
                 />
                 <span className="text-sm font-medium text-stone-700">{cls}</span>
             </label>
         ))}
      </div>

      <button 
        onClick={onClose}
        className="w-full mt-6 bg-stone-900 text-white py-3.5 rounded-xl font-bold text-sm hover:bg-black transition-colors"
      >
        تأكيد الاختيار
      </button>

    </div>
  );
};

export default TravelersSelect;
