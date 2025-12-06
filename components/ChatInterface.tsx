
import React, { useState, useCallback, useEffect, useRef } from 'react';
import Sidebar from './Sidebar';
import InputArea from './InputArea';
import MessageList from './MessageList';
import BookingSidebar from './BookingSidebar';
import { Message, Role, Suggestion, BookingItem } from '../types';
import { streamChatResponse } from '../services/geminiService';
import { createChatSession, saveMessage, getSessionMessages, createBooking, getSessionBookings, deleteBooking } from '../services/chatService';
import { Plane, MapPin, Calendar, CreditCard, Briefcase } from 'lucide-react';

const SUGGESTIONS: Suggestion[] = [
  { id: '1', label: 'أرخص رحلات طيران', icon: <Plane className="w-4 h-4" />, prompt: "ابحث لي عن أرخص رحلات طيران إلى طوكيو للشهر القادم." },
  { id: '2', label: 'خطة عطلة نهاية الأسبوع', icon: <Calendar className="w-4 h-4" />, prompt: "خطط لعطلة نهاية أسبوع رومانسية في باريس بميزانية متوسطة." },
  { id: '3', label: 'وجهات شائعة', icon: <MapPin className="w-4 h-4" />, prompt: "ما هي وجهات السفر الرائجة لهذا الصيف؟" },
  { id: '4', label: 'نصائح الميزانية', icon: <CreditCard className="w-4 h-4" />, prompt: "كم يجب أن أخصص ميزانية لرحلة لمدة أسبوعين إلى تايلاند؟" },
];

interface ChatInterfaceProps {
  onGoHome: () => void;
  onGoDestinations: () => void;
  onGoFlights: () => void;
  onGoSettings?: () => void;
  onGoPayment: () => void; // New prop
  onGoTrips?: () => void; // New prop
  user: any;
  sessionId?: string | null;
  onNewChat: () => void;
  onSelectSession: (id: string) => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ 
  onGoHome, 
  onGoDestinations, 
  onGoFlights,
  onGoSettings, 
  onGoPayment,
  onGoTrips,
  user,
  sessionId,
  onNewChat,
  onSelectSession
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Booking State
  const [bookings, setBookings] = useState<BookingItem[]>([]);
  const [isBookingSidebarOpen, setIsBookingSidebarOpen] = useState(false);

  // Use a local ref to track the *active* session ID within this component
  const activeSessionIdRef = useRef<string | null>(sessionId || null);
  // Flag to prevent race condition when creating a new session
  const isCreatingSessionRef = useRef(false);

  // Load messages and bookings when sessionId changes
  useEffect(() => {
    activeSessionIdRef.current = sessionId || null;

    // If we are in the middle of creating a session in this component,
    // ignore the prop update to avoid wiping the state while streaming.
    if (isCreatingSessionRef.current) {
        return;
    }

    if (sessionId) {
      setIsLoading(true);
      // Fetch messages
      getSessionMessages(sessionId).then((msgs) => {
        setMessages(msgs);
        setIsLoading(false);
      });
      // Fetch bookings from DB
      getSessionBookings(sessionId).then((fetchedBookings) => {
        setBookings(fetchedBookings);
        if (fetchedBookings.length > 0) {
            setIsBookingSidebarOpen(true);
        }
      });
    } else {
      setMessages([]);
      setBookings([]); // Clear bookings on new chat
      setIsBookingSidebarOpen(false);
    }
  }, [sessionId]);

  const handleSend = useCallback(async (text: string = input) => {
    if (!text.trim() || isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: Role.USER,
      text: text,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      // 1. Create session if it doesn't exist (and user is logged in)
      if (!activeSessionIdRef.current && user) {
        isCreatingSessionRef.current = true; // Set flag to prevent useEffect from wiping state
        const session = await createChatSession(user.id, text);
        if (session) {
          activeSessionIdRef.current = session.id;
          // Update parent state so the URL/UI reflects the new session
          onSelectSession(session.id);
        }
      }

      // 2. Save User Message
      if (activeSessionIdRef.current) {
        await saveMessage(activeSessionIdRef.current, Role.USER, text);
      }

      // Create placeholder for model message
      const modelMsgId = (Date.now() + 1).toString();
      
      setMessages((prev) => [
        ...prev,
        { id: modelMsgId, role: Role.MODEL, text: '', isStreaming: true },
      ]);

      let fullResponseText = '';
      let finalOffer: BookingItem | undefined;

      await streamChatResponse(
        [...messages, userMsg], 
        text,
        (chunkText, metadata, offer) => {
           // Always update if we have text or metadata
           fullResponseText = chunkText; 
           if(offer) finalOffer = offer;
           
           setMessages((prev) => 
             prev.map(msg => 
               msg.id === modelMsgId 
                 ? { 
                     ...msg, 
                     text: fullResponseText, 
                     groundingMetadata: metadata || msg.groundingMetadata, 
                     offer: offer || msg.offer 
                   }
                 : msg
             )
           );
        }
      );

      // Final update to set isStreaming false
      setMessages((prev) => 
        prev.map(msg => 
          msg.id === modelMsgId 
            ? { ...msg, isStreaming: false }
            : msg
        )
      );

      // 3. Save Model Message (full text with JSON)
      let textToSave = fullResponseText;
      if (finalOffer) {
          const offerBlock = `\n\`\`\`json\n${JSON.stringify(finalOffer, null, 2)}\n\`\`\``;
          // Only append if not already there (stream logic might be complex)
          if (!textToSave.includes('```json')) {
              textToSave += offerBlock;
          }
      }

      if (activeSessionIdRef.current && textToSave) {
        await saveMessage(activeSessionIdRef.current, Role.MODEL, textToSave);
      }

    } catch (error) {
      console.error("Failed to send message", error);
      setMessages((prev) => [
        ...prev,
        { id: Date.now().toString(), role: Role.MODEL, text: "أواجه مشكلة بسيطة في الاتصال حالياً. يرجى المحاولة مرة أخرى." }
      ]);
    } finally {
      setIsLoading(false);
      // Reset flag after a short delay to allow state to settle
      setTimeout(() => {
          isCreatingSessionRef.current = false;
      }, 500);
    }
  }, [input, isLoading, messages, user, onSelectSession]);

  const handleSuggestionClick = (prompt: string) => {
    handleSend(prompt);
  };

  const handleDiscoverClick = () => {
    handleSend("أريد اكتشاف وجهة تناسبني. اسألني أسئلة لتحديد المكان الأفضل لي.");
  };

  const handleAcceptOffer = async (offer: BookingItem) => {
      // 1. Save to DB if session exists
      if (activeSessionIdRef.current) {
          try {
              // Remove ID from offer to create new booking entry
              const { id, ...bookingData } = offer;
              const savedBooking = await createBooking(activeSessionIdRef.current, bookingData);
              if (savedBooking) {
                  setBookings(prev => [...prev, savedBooking]);
              }
          } catch (error) {
              console.error("Failed to save booking", error);
              setBookings(prev => [...prev, offer]);
          }
      } else {
          // No session (guest?) - just local state
          setBookings(prev => [...prev, offer]);
      }
      
      setIsBookingSidebarOpen(true);

      // Determine next step based on current offer type
      let followUpPrompt = "";
      switch(offer.type) {
          case 'flight':
              followUpPrompt = "تم حجز الطيران بنجاح. أريد الآن حجز فندق مناسب في نفس الوجهة.";
              break;
          case 'hotel':
              followUpPrompt = "تم حجز الفندق. هل يمكنك اقتراح وسيلة نقل (تكسي) من المطار؟";
              break;
          case 'taxi':
              followUpPrompt = "ممتاز. أخيراً، هل يمكنك اقتراح مطعم جيد للعشاء؟";
              break;
          case 'restaurant':
              followUpPrompt = "شكراً لك! هل هناك أي أنشطة أخرى تقترحها؟";
              break;
          default:
              followUpPrompt = "تم الحجز. ماذا بعد؟";
      }

      handleSend(followUpPrompt);
  };

  const handleRejectOffer = (offer: BookingItem) => {
      handleSend("لا يناسبني هذا العرض. هل يمكنك البحث عن خيار آخر؟");
  };

  const handleRemoveBooking = async (id: string) => {
      // Optimistic remove from UI
      setBookings(prev => prev.filter(b => b.id !== id));
      
      // Remove from DB if we have a session
      if (activeSessionIdRef.current) {
          try {
              await deleteBooking(id);
          } catch (error) {
              console.error("Failed to delete booking", error);
              // Re-fetch to ensure sync
              const currentBookings = await getSessionBookings(activeSessionIdRef.current);
              setBookings(currentBookings);
          }
      }
  };

  const isHeroMode = messages.length === 0;

  return (
    <div className="fixed inset-0 flex h-full w-full bg-[#f9f8f6] overflow-hidden">
      
      {/* Booking Sidebar (Left Side) */}
      <BookingSidebar 
         isOpen={isBookingSidebarOpen}
         onClose={() => setIsBookingSidebarOpen(false)}
         bookings={bookings}
         onRemoveBooking={handleRemoveBooking}
         onCheckout={onGoPayment}
      />

      <Sidebar 
        onNewChat={onNewChat} 
        isOpen={sidebarOpen} 
        setIsOpen={setSidebarOpen}
        onGoHome={onGoHome}
        onGoDestinations={onGoDestinations}
        onGoFlights={onGoFlights}
        onGoSettings={onGoSettings}
        onGoTrips={onGoTrips}
        user={user}
        onSelectSession={onSelectSession}
      />

      <main className={`flex-1 flex flex-col h-full relative overflow-hidden transition-all duration-500 ${isBookingSidebarOpen ? 'md:ml-80' : ''}`}>
        {/* Top Bar */}
        <div className="absolute top-0 left-0 p-6 z-10 flex items-center gap-4">
             {/* Toggle Booking Sidebar Button */}
             <button
                onClick={() => setIsBookingSidebarOpen(!isBookingSidebarOpen)}
                className={`
                    h-10 px-4 rounded-full shadow-sm border transition-all duration-300 flex items-center gap-2
                    ${isBookingSidebarOpen 
                        ? 'bg-stone-900 text-white border-stone-900' 
                        : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50'}
                `}
                title="تفاصيل الرحلة"
            >
                <Briefcase className="w-4 h-4" />
                <span className="text-xs font-bold hidden md:inline">
                    {isBookingSidebarOpen ? 'إخفاء الرحلة' : 'حقيبة السفر'}
                </span>
                {bookings.length > 0 && (
                    <span className={`
                        w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold
                        ${isBookingSidebarOpen ? 'bg-white text-stone-900' : 'bg-stone-900 text-white'}
                    `}>
                        {bookings.length}
                    </span>
                )}
            </button>
        </div>

        {isHeroMode ? (
          <div className="flex-1 flex flex-col items-center justify-center p-6 animate-fade-in -mt-16">
            <h1 className="text-3xl md:text-4xl font-semibold text-stone-800 mb-8 text-center tracking-tight leading-normal">
              إلى أين وجهتك القادمة؟
            </h1>
            
            {/* Input Area in Flow */}
            <div className="w-full max-w-3xl mb-8 z-20 relative">
                 <InputArea 
                    input={input} 
                    setInput={setInput} 
                    onSend={() => handleSend()} 
                    isLoading={isLoading} 
                    onDiscover={handleDiscoverClick}
                 />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 w-full max-w-3xl mb-8 relative z-10">
              {SUGGESTIONS.map((suggestion) => (
                <button
                  key={suggestion.id}
                  onClick={() => handleSuggestionClick(suggestion.prompt)}
                  className="flex flex-col items-center justify-center gap-2 p-4 bg-white border border-stone-200 rounded-2xl hover:border-stone-400 hover:shadow-md transition-all duration-200 group"
                >
                  <div className="p-2 bg-stone-50 rounded-full text-stone-500 group-hover:text-stone-800 group-hover:bg-stone-200 transition-colors">
                    {suggestion.icon}
                  </div>
                  <span className="text-sm font-medium text-stone-600 group-hover:text-stone-900 text-center">
                    {suggestion.label}
                  </span>
                </button>
              ))}
            </div>

            {/* Footer Text for Hero Mode */}
            <div className="text-center animate-fade-in delay-200">
                 <div className="inline-block text-stone-500 text-[11px] px-3 py-1.5 rounded-lg mb-1 font-medium">
                   تم إنشاء بواسطة Percent
                </div>
                <p className="text-[11px] text-stone-400">
                    يمكن للذكاء الاصطناعي ارتكاب الأخطاء. يرجى التحقق من المعلومات.
                </p>
            </div>
          </div>
        ) : (
          <div className="flex-1 w-full overflow-hidden flex flex-col">
            <div className="h-16 flex-shrink-0" />
            <MessageList 
                messages={messages} 
                isLoading={isLoading} 
                onAcceptOffer={handleAcceptOffer}
                onRejectOffer={handleRejectOffer}
                bookings={bookings}
            />
            
            <div className="w-full px-4 md:px-6 pb-6 bg-gradient-to-t from-[#f9f8f6] via-[#f9f8f6] to-transparent pt-4">
                 <InputArea 
                    input={input} 
                    setInput={setInput} 
                    onSend={() => handleSend()} 
                    isLoading={isLoading}
                    onDiscover={handleDiscoverClick}
                 />
                 <div className="text-center mt-2">
                    <p className="text-[10px] text-stone-400">
                        يمكن للذكاء الاصطناعي ارتكاب الأخطاء. يرجى التحقق من المعلومات.
                    </p>
                 </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
};

export default ChatInterface;
