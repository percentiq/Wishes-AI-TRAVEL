

import React, { useState, useEffect } from 'react';
import { ArrowRight, CreditCard, Lock, CheckCircle, Plane, Hotel, Car, Utensils, Loader2 } from 'lucide-react';
import { BookingItem } from '../../types';
import { getSessionBookings, confirmSessionBookings } from '../../services/chatService';

interface PaymentViewProps {
  onGoBack: () => void;
  onPaymentSuccess: () => void;
  sessionId: string;
}

const PaymentView: React.FC<PaymentViewProps> = ({ onGoBack, onPaymentSuccess, sessionId }) => {
  const [bookings, setBookings] = useState<BookingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [step, setStep] = useState<'review' | 'success'>('review');

  // Card Form State
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [holderName, setHolderName] = useState('');

  useEffect(() => {
    const loadBookings = async () => {
      setLoading(true);
      if (sessionId) {
        const items = await getSessionBookings(sessionId);
        // Filter only pending items
        setBookings(items.filter(b => b.status !== 'confirmed'));
      }
      setLoading(false);
    };
    loadBookings();
  }, [sessionId]);

  const totalPrice = bookings.reduce((sum, item) => {
      const price = parseFloat(item.price.replace(/[^0-9.]/g, ''));
      return sum + (isNaN(price) ? 0 : price);
  }, 0);

  const handlePayment = async (e: React.FormEvent) => {
      e.preventDefault();
      setProcessing(true);

      // Simulate payment processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      try {
          // Update DB status to confirmed, create payment record and tracking entry
          await confirmSessionBookings(sessionId, totalPrice);
          setStep('success');
      } catch (error) {
          console.error("Payment failed", error);
          alert("حدث خطأ أثناء الدفع. يرجى المحاولة مرة أخرى.");
      } finally {
          setProcessing(false);
      }
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

  if (step === 'success') {
      return (
          <div className="fixed inset-0 bg-[#f9f8f6] flex items-center justify-center p-6 z-50 animate-fade-in">
              <div className="bg-white rounded-3xl p-10 shadow-xl text-center max-w-md w-full border border-stone-100">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600">
                      <CheckCircle className="w-10 h-10" />
                  </div>
                  <h2 className="text-2xl font-bold text-stone-900 mb-2">تم الدفع بنجاح!</h2>
                  <p className="text-stone-500 mb-8 text-sm">تم تأكيد حجوزاتك وإضافتها إلى قائمة رحلاتك. يمكنك الآن متابعة حالة الطلب.</p>
                  <button 
                    onClick={onPaymentSuccess}
                    className="w-full bg-stone-900 text-white py-4 rounded-2xl font-bold hover:bg-black transition-colors shadow-lg"
                  >
                      الذهاب إلى رحلاتي
                  </button>
              </div>
          </div>
      );
  }

  return (
    <div className="fixed inset-0 bg-[#f9f8f6] flex flex-col h-full w-full z-40 overflow-y-auto font-sans">
      {/* Header */}
      <div className="bg-white border-b border-stone-200 px-6 py-4 flex items-center gap-4 sticky top-0 z-10 shadow-sm">
          <button onClick={onGoBack} className="p-2 hover:bg-stone-100 rounded-full transition-colors text-stone-600">
              <ArrowRight className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-bold text-stone-900">إتمام الدفع</h1>
      </div>

      <div className="flex-1 max-w-6xl mx-auto w-full p-6 md:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Order Summary (Left on LTR, Right on RTL) */}
          <div className="lg:col-span-5 lg:order-2 space-y-6">
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-stone-100">
                  <h3 className="font-bold text-stone-900 mb-4 text-lg">ملخص الطلب</h3>
                  {loading ? (
                      <div className="py-10 text-center text-stone-400 flex items-center justify-center gap-2">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>جارٍ التحميل...</span>
                      </div>
                  ) : bookings.length === 0 ? (
                      <div className="py-10 text-center text-stone-400">لا توجد عناصر للدفع.</div>
                  ) : (
                      <div className="space-y-4">
                          {bookings.map(item => (
                              <div key={item.id} className="flex items-start gap-3 pb-4 border-b border-stone-50 last:border-0">
                                  <div className="w-10 h-10 bg-stone-50 rounded-xl flex items-center justify-center text-stone-500 flex-shrink-0">
                                      {getIcon(item.type)}
                                  </div>
                                  <div className="flex-1">
                                      <h4 className="font-bold text-stone-800 text-sm">{item.title}</h4>
                                      <p className="text-xs text-stone-500 line-clamp-1">{item.description}</p>
                                  </div>
                                  <div className="font-bold text-stone-900 text-sm whitespace-nowrap">
                                      {item.price} <span className="text-[10px] font-normal text-stone-500">{item.currency}</span>
                                  </div>
                              </div>
                          ))}
                      </div>
                  )}
                  
                  <div className="mt-6 pt-6 border-t border-stone-100">
                      <div className="flex justify-between items-center mb-2">
                          <span className="text-stone-500 text-sm">المجموع الفرعي</span>
                          <span className="font-bold text-stone-900">{totalPrice.toLocaleString()} $</span>
                      </div>
                      <div className="flex justify-between items-center mb-4">
                          <span className="text-stone-500 text-sm">الضريبة (0%)</span>
                          <span className="font-bold text-stone-900">0 $</span>
                      </div>
                      <div className="flex justify-between items-center pt-4 border-t border-stone-100">
                          <span className="text-lg font-bold text-stone-900">الإجمالي</span>
                          <span className="text-2xl font-bold text-stone-900">{totalPrice.toLocaleString()} $</span>
                      </div>
                  </div>
              </div>
              
              <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex items-start gap-3">
                  <Lock className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div className="text-sm text-blue-800">
                      <p className="font-bold">دفع آمن 100%</p>
                      <p className="opacity-80 text-xs">جميع بياناتك مشفرة ولا يتم تخزين معلومات بطاقتك.</p>
                  </div>
              </div>
          </div>

          {/* Payment Form */}
          <div className="lg:col-span-7 lg:order-1">
              <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-stone-100">
                  <h3 className="font-bold text-stone-900 mb-6 text-lg flex items-center gap-2">
                      <CreditCard className="w-5 h-5" />
                      بيانات الدفع
                  </h3>

                  <form onSubmit={handlePayment} className="space-y-6">
                      <div className="space-y-2">
                          <label className="text-xs font-bold text-stone-600">الاسم على البطاقة</label>
                          <input 
                            type="text" 
                            required
                            value={holderName}
                            onChange={e => setHolderName(e.target.value)}
                            placeholder="MOHAMMED ALI" 
                            className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3.5 text-stone-900 focus:outline-none focus:border-stone-400 transition-colors uppercase"
                          />
                      </div>

                      <div className="space-y-2">
                          <label className="text-xs font-bold text-stone-600">رقم البطاقة</label>
                          <div className="relative">
                              <CreditCard className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
                              <input 
                                type="text" 
                                required
                                value={cardNumber}
                                onChange={e => setCardNumber(e.target.value.replace(/\D/g, '').slice(0, 16))}
                                placeholder="0000 0000 0000 0000" 
                                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3.5 pr-12 text-stone-900 focus:outline-none focus:border-stone-400 transition-colors font-mono tracking-wider"
                              />
                          </div>
                      </div>

                      <div className="grid grid-cols-2 gap-6">
                          <div className="space-y-2">
                              <label className="text-xs font-bold text-stone-600">تاريخ الانتهاء</label>
                              <input 
                                type="text" 
                                required
                                value={expiry}
                                onChange={e => setExpiry(e.target.value)}
                                placeholder="MM/YY" 
                                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3.5 text-stone-900 focus:outline-none focus:border-stone-400 transition-colors text-center"
                              />
                          </div>
                          <div className="space-y-2">
                              <label className="text-xs font-bold text-stone-600">رمز الأمان (CVC)</label>
                              <input 
                                type="text" 
                                required
                                value={cvc}
                                onChange={e => setCvc(e.target.value.replace(/\D/g, '').slice(0, 3))}
                                placeholder="123" 
                                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3.5 text-stone-900 focus:outline-none focus:border-stone-400 transition-colors text-center"
                              />
                          </div>
                      </div>

                      <div className="pt-6">
                          <button 
                            type="submit" 
                            disabled={processing || bookings.length === 0}
                            className="w-full bg-stone-900 hover:bg-black text-white py-4 rounded-2xl font-bold text-lg shadow-lg transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                              {processing ? (
                                  <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    جارٍ المعالجة...
                                  </>
                              ) : (
                                  `دفع ${totalPrice.toLocaleString()} $`
                              )}
                          </button>
                          <div className="text-center mt-4 flex items-center justify-center gap-2 text-stone-400 grayscale opacity-70">
                               <span className="text-xs font-bold">مدعوم بواسطة</span>
                               {/* Mock Logos */}
                               <div className="font-serif font-bold italic text-lg">VISA</div>
                               <div className="font-sans font-bold text-lg">Mastercard</div>
                          </div>
                      </div>
                  </form>
              </div>
          </div>

      </div>
    </div>
  );
};

export default PaymentView;
