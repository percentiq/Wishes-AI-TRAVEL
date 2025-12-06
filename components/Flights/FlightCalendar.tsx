
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, X, Info } from 'lucide-react';

interface FlightCalendarProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectDate: (date: string) => void;
  selectedDate: string;
}

const FlightCalendar: React.FC<FlightCalendarProps> = ({ isOpen, onClose, onSelectDate, selectedDate }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date()); 
  
  if (!isOpen) return null;

  // Helper to generate calendar days
  const generateDays = (year: number, month: number) => {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days = [];
    
    // Padding for start of week (Sunday start)
    for (let i = 0; i < firstDay.getDay(); i++) {
      days.push(null);
    }

    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(year, month, i));
    }
    return days;
  };

  const days = generateDays(currentMonth.getFullYear(), currentMonth.getMonth());
  
  const months = [
      "يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو",
      "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"
  ];

  // Mock price generator
  const getPrice = (day: number) => {
      const basePrice = 130;
      const deterministicRandom = (day * 9301 + 49297) % 233280;
      return basePrice + (deterministicRandom % 150);
  };

  const handlePrevMonth = () => {
      setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
      setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  return (
    <div className="absolute top-full left-0 mt-2 w-full md:min-w-[400px] bg-white rounded-3xl shadow-2xl border border-stone-100 p-6 z-50 animate-fade-in font-sans">
        <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-stone-900 text-lg">حدد تاريخ المغادرة</h3>
            <button onClick={onClose} className="text-stone-400 hover:text-stone-800">
                <X className="w-5 h-5" />
            </button>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between mb-6 px-2">
             <div className="flex items-center gap-3">
                 <div className="relative inline-block w-10 mr-2 align-middle select-none">
                    <input type="checkbox" name="toggle" id="nonstop" className="toggle-checkbox absolute block w-5 h-5 rounded-full bg-white border-4 appearance-none cursor-pointer border-stone-300 checked:right-0 checked:border-stone-900 checked:bg-stone-900 transition-all duration-300"/>
                    <label htmlFor="nonstop" className="toggle-label block overflow-hidden h-5 rounded-full bg-stone-200 cursor-pointer"></label>
                </div>
                <label htmlFor="nonstop" className="text-sm font-bold text-stone-700 cursor-pointer">بدون توقف</label>
             </div>
        </div>

        {/* Calendar Header */}
        <div className="flex items-center justify-between mb-4">
            <span className="font-bold text-xl text-stone-800">
                {months[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </span>
             <div className="flex gap-2">
                 <button onClick={handleNextMonth} className="p-1 hover:bg-stone-100 rounded-full transition-colors"><ChevronRight className="w-5 h-5 text-stone-600" /></button>
                 <button onClick={handlePrevMonth} className="p-1 hover:bg-stone-100 rounded-full transition-colors"><ChevronLeft className="w-5 h-5 text-stone-600" /></button>
             </div>
        </div>

        {/* Weekday Header */}
        <div className="grid grid-cols-7 text-center text-xs font-bold text-stone-400 mb-3">
            <div>الأحد</div>
            <div>الإثنين</div>
            <div>الثلاثاء</div>
            <div>الأربعاء</div>
            <div>الخميس</div>
            <div>الجمعة</div>
            <div>السبت</div>
        </div>

        {/* Days Grid */}
        <div className="grid grid-cols-7 text-center gap-1">
            {days.map((date, idx) => {
                if (!date) return <div key={`empty-${idx}`} />;
                const dayNum = date.getDate();
                const price = getPrice(dayNum);
                const isSelected = selectedDate === date.toISOString().split('T')[0];
                const isHighPrice = price > 220;
                const isLowPrice = price < 160;

                return (
                    <button 
                      key={idx}
                      onClick={() => {
                          onSelectDate(date.toISOString().split('T')[0]);
                          onClose();
                      }}
                      className={`flex flex-col items-center justify-center py-2 rounded-xl transition-all border border-transparent
                        ${isSelected 
                            ? 'bg-stone-900 text-white shadow-md' 
                            : 'hover:bg-stone-50 hover:border-stone-100 text-stone-700'}
                      `}
                    >
                        <span className="text-sm font-bold">{dayNum}</span>
                        <span className={`text-[9px] mt-0.5 font-medium ${isSelected ? 'text-stone-300' : isHighPrice ? 'text-red-500' : isLowPrice ? 'text-green-600' : 'text-stone-400'}`}>
                            {price}د.ع
                        </span>
                    </button>
                );
            })}
        </div>
        
        <div className="mt-6 pt-4 border-t border-stone-100 flex items-center justify-end gap-1 text-[10px] text-stone-400">
             <Info className="w-3 h-3" />
             <span>الأسعار بعملة IQD لراكب واحد.</span>
        </div>
    </div>
  );
};

export default FlightCalendar;
