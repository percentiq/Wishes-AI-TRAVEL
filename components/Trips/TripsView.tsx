
import React, { useEffect, useState } from 'react';
import { getUserConfirmedBookings } from '../../services/chatService';
import { BookingItem } from '../../types';
import { ArrowRight, Plane, Hotel, Car, Utensils, MapPin, Calendar, Clock, Ticket } from 'lucide-react';

interface TripsViewProps {
  onGoHome: () => void;
  user: any;
}

const TripsView: React.FC<TripsViewProps> = ({ onGoHome, user }) => {
  const [bookings, setBookings] = useState<BookingItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadTrips();
    }
  }, [user]);

  const loadTrips = async () => {
    setLoading(true);
    try {
      const data = await getUserConfirmedBookings(user.id);
      setBookings(data);
    } catch (error) {
      console.error("Failed to load trips", error);
    } finally {
      setLoading(false);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'flight': return <Plane className="w-5 h-5" />;
      case 'hotel': return <Hotel className="w-5 h-5" />;
      case 'taxi': return <Car className="w-5 h-5" />;
      case 'restaurant': return <Utensils className="w-5 h-5" />;
      default: return <Ticket className="w-5 h-5" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
        case 'flight': return 'تذكرة طيران';
        case 'hotel': return 'حجز فندق';
        case 'taxi': return 'نقل / تاكسي';
        case 'restaurant': return 'حجز مطعم';
        default: return 'حجز';
    }
  };

  return (
    <div className="fixed inset-0 bg-[#f9f8f6] flex flex-col h-full w-full z-30 overflow-y-auto font-sans">
      {/* Header */}
      <div className="bg-white border-b border-stone-200 px-6 py-4 flex items-center gap-4 sticky top-0 z-10 shadow-sm">
          <button onClick={onGoHome} className="p-2 hover:bg-stone-100 rounded-full transition-colors text-stone-600">
              <ArrowRight className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-bold text-stone-900">رحلاتي وطلباتي</h1>
      </div>

      <div className="flex-1 max-w-4xl mx-auto w-full p-6">
        
        {loading ? (
           <div className="space-y-4">
              {[1, 2, 3].map(i => <div key={i} className="h-32 bg-stone-200 rounded-3xl animate-pulse" />)}
           </div>
        ) : bookings.length === 0 ? (
            <div className="text-center py-20">
                <div className="w-20 h-20 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-6 text-stone-400">
                    <Plane className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-stone-800 mb-2">لا توجد رحلات قادمة</h3>
                <p className="text-stone-500">لم تقم بحجز أي رحلة بعد. ابدأ التخطيط لمغامرتك القادمة الآن!</p>
                <button onClick={onGoHome} className="mt-6 bg-stone-900 text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-black transition-colors">
                    بدء مغامرة جديدة
                </button>
            </div>
        ) : (
            <div className="space-y-6">
                {bookings.map((booking) => (
                    <div key={booking.id} className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
                        {/* Status Badge */}
                        <div className="absolute top-6 left-6">
                            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">
                                مؤكد
                            </span>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm
                                ${booking.type === 'flight' ? 'bg-blue-50 text-blue-600' : 
                                  booking.type === 'hotel' ? 'bg-purple-50 text-purple-600' :
                                  booking.type === 'restaurant' ? 'bg-orange-50 text-orange-600' : 'bg-stone-100 text-stone-600'}
                            `}>
                                {getIcon(booking.type)}
                            </div>
                            
                            <div className="flex-1">
                                <div className="mb-1">
                                    <span className="text-xs font-bold text-stone-400 uppercase tracking-wider">{getTypeLabel(booking.type)}</span>
                                </div>
                                <h3 className="text-lg font-bold text-stone-900 mb-2">{booking.title}</h3>
                                <p className="text-stone-600 text-sm mb-4 max-w-lg">{booking.description}</p>
                                
                                <div className="flex flex-wrap gap-4 text-xs font-medium text-stone-500">
                                    <div className="flex items-center gap-1.5 bg-stone-50 px-3 py-1.5 rounded-lg">
                                        <Calendar className="w-3.5 h-3.5" />
                                        <span>{booking.created_at ? new Date(booking.created_at).toLocaleDateString('ar-EG') : 'تاريخ غير محدد'}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 bg-stone-50 px-3 py-1.5 rounded-lg">
                                        <Clock className="w-3.5 h-3.5" />
                                        <span>تتبع الرحلة</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 bg-stone-50 px-3 py-1.5 rounded-lg">
                                        <MapPin className="w-3.5 h-3.5" />
                                        <span>عرض على الخريطة</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Dashed Line */}
                        <div className="my-5 border-t border-dashed border-stone-200" />

                        <div className="flex items-center justify-between">
                             <div className="text-sm text-stone-500">
                                 الرقم المرجعي: <span className="font-mono text-stone-900 font-bold">#{booking.id.slice(0, 8).toUpperCase()}</span>
                             </div>
                             <div className="text-lg font-bold text-stone-900">
                                 {booking.price} {booking.currency}
                             </div>
                        </div>
                    </div>
                ))}
            </div>
        )}

      </div>
    </div>
  );
};

export default TripsView;
