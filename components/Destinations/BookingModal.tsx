import React, { useState } from 'react';
import { X, Calendar, Users, CheckCircle, Loader2 } from 'lucide-react';
import { Destination } from '../../types';
import { bookDestination } from '../../services/destinationService';

interface BookingModalProps {
  destination: Destination;
  isOpen: boolean;
  onClose: () => void;
}

const BookingModal: React.FC<BookingModalProps> = ({ destination, isOpen, onClose }) => {
  const [step, setStep] = useState<'form' | 'success'>('form');
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState('');
  const [guests, setGuests] = useState(2);
  const [name, setName] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
        await bookDestination(destination.id, { date, guests, name });
        setStep('success');
    } catch (error) {
        console.error(error);
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm transition-opacity" onClick={onClose} />
      
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 animate-fade-in">
        <button onClick={onClose} className="absolute left-6 top-6 text-stone-400 hover:text-stone-800">
           <X className="w-6 h-6" />
        </button>

        {step === 'form' ? (
            <form onSubmit={handleSubmit} className="space-y-6 mt-4">
                <div className="text-center mb-6">
                    <h2 className="text-xl font-bold text-stone-900">حجز رحلة إلى {destination.name}</h2>
                    <p className="text-stone-500 text-sm mt-1">أكمل البيانات لتأكيد حجزك المبدئي</p>
                </div>

                <div className="space-y-4">
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-stone-700">الاسم الكامل</label>
                        <input 
                          type="text" 
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-stone-400"
                          placeholder="الاسم كما في الجواز"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-stone-700">تاريخ الوصول</label>
                            <div className="relative">
                                <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                                <input 
                                type="date" 
                                required
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className="w-full bg-stone-50 border border-stone-200 rounded-xl pr-10 pl-3 py-3 text-sm focus:outline-none focus:border-stone-400"
                                />
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-stone-700">الضيوف</label>
                            <div className="relative">
                                <Users className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                                <input 
                                type="number" 
                                min={1}
                                max={10}
                                required
                                value={guests}
                                onChange={(e) => setGuests(parseInt(e.target.value))}
                                className="w-full bg-stone-50 border border-stone-200 rounded-xl pr-10 pl-3 py-3 text-sm focus:outline-none focus:border-stone-400"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-stone-50 p-4 rounded-xl flex justify-between items-center text-sm border border-stone-100">
                    <span className="text-stone-500">السعر التقديري</span>
                    <span className="font-bold text-stone-900 text-lg">--- $</span>
                </div>

                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full bg-stone-900 text-white py-3.5 rounded-xl font-bold hover:bg-black transition-colors flex items-center justify-center gap-2"
                >
                    {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                    تأكيد الحجز
                </button>
            </form>
        ) : (
            <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-stone-900 mb-2">تم استلام طلبك!</h3>
                <p className="text-stone-500 text-sm max-w-xs mx-auto mb-6">
                    شكراً لك {name}، سنقوم بمراجعة طلب حجزك إلى {destination.name} وإرسال التأكيد عبر البريد الإلكتروني قريباً.
                </p>
                <button 
                  onClick={onClose}
                  className="bg-stone-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-black transition-colors"
                >
                    تم
                </button>
            </div>
        )}
      </div>
    </div>
  );
};

export default BookingModal;