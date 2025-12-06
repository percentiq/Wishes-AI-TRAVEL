
import React from 'react';
import { BookingItem } from '../types';
import { Plane, Hotel, Car, Utensils, X, Trash2, CreditCard } from 'lucide-react';

interface BookingSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  bookings: BookingItem[];
  onRemoveBooking: (id: string) => void;
  onCheckout: () => void; // New prop
}

const BookingSidebar: React.FC<BookingSidebarProps> = ({ isOpen, onClose, bookings, onRemoveBooking, onCheckout }) => {
  
  const getTotalPrice = () => {
    return bookings.reduce((total, item) => {
      const price = parseFloat(item.price.replace(/[^0-9.]/g, ''));
      return total + (isNaN(price) ? 0 : price);
    }, 0);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'flight': return <Plane className="w-5 h-5" />;
      case 'hotel': return <Hotel className="w-5 h-5" />;
      case 'taxi': return <Car className="w-5 h-5" />;
      case 'restaurant': return <Utensils className="w-5 h-5" />;
      default: return <CreditCard className="w-5 h-5" />;
    }
  };

  return (
    <aside 
      className={`
        fixed top-0 left-0 z-40 h-full bg-white border-r border-stone-200 
        flex flex-col shadow-2xl transition-all duration-500 ease-in-out
        ${isOpen ? 'w-80 translate-x-0' : 'w-80 -translate-x-full'}
      `}
    >
      {/* Header */}
      <div className="h-16 flex items-center justify-between px-6 border-b border-stone-100 bg-stone-50/50">
        <h2 className="text-lg font-bold text-stone-900">مسار الرحلة</h2>
        <button 
          onClick={onClose}
          className="p-2 -ml-2 text-stone-400 hover:text-stone-800 rounded-full hover:bg-stone-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
        {bookings.length === 0 ? (
          <div className="text-center py-12 opacity-50">
            <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-4 text-stone-400">
               <Plane className="w-8 h-8" />
            </div>
            <p className="text-sm text-stone-500">لا توجد حجوزات حتى الآن.<br/> ابدأ المحادثة لإضافة رحلات.</p>
          </div>
        ) : (
          bookings.map((item) => (
            <div key={item.id} className="bg-white border border-stone-200 rounded-2xl p-4 shadow-sm group relative hover:border-stone-300 transition-all animate-fade-in">
               <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0
                    ${item.type === 'flight' ? 'bg-blue-50 text-blue-600' : 
                      item.type === 'hotel' ? 'bg-purple-50 text-purple-600' :
                      item.type === 'restaurant' ? 'bg-orange-50 text-orange-600' : 'bg-stone-100 text-stone-600'}
                  `}>
                    {getIcon(item.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-stone-900 truncate">{item.title}</h4>
                    <p className="text-[11px] text-stone-500 mt-0.5 line-clamp-2">{item.description}</p>
                    <div className="mt-2 flex items-center justify-between">
                       <span className="font-bold text-stone-900 text-sm">{item.price} {item.currency}</span>
                       {item.status === 'confirmed' && (
                           <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full">مدفوع</span>
                       )}
                    </div>
                  </div>
               </div>
               <button 
                 onClick={() => onRemoveBooking(item.id)}
                 className="absolute top-2 left-2 p-1.5 text-stone-300 hover:text-red-500 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                 title="إزالة"
               >
                 <Trash2 className="w-4 h-4" />
               </button>
            </div>
          ))
        )}
      </div>

      {/* Footer / Total */}
      <div className="p-6 border-t border-stone-100 bg-stone-50/50">
        <div className="flex items-center justify-between mb-4">
           <span className="text-sm font-medium text-stone-500">المجموع التقديري</span>
           <span className="text-xl font-bold text-stone-900">{getTotalPrice().toLocaleString()} $</span>
        </div>
        <button 
            className="w-full bg-stone-900 text-white py-3.5 rounded-xl font-bold hover:bg-black transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed" 
            disabled={bookings.length === 0}
            onClick={onCheckout}
        >
          إتمام الحجز
        </button>
      </div>
    </aside>
  );
};

export default BookingSidebar;
