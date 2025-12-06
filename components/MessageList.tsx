
import React, { useEffect, useRef, useState } from 'react';
import { Message, Role, BookingItem } from '../types';
import ReactMarkdown from 'react-markdown';
import { Compass, User, Link as LinkIcon, ExternalLink, Image as ImageIcon, ImageOff, Check, X, Edit2, CheckCircle } from 'lucide-react';

interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
  onAcceptOffer?: (offer: BookingItem) => void;
  onRejectOffer?: (offer: BookingItem) => void;
  bookings?: BookingItem[];
}

// Custom Image Component
const MarkdownImage = ({ src, alt }: { src?: string; alt?: string }) => {
  const [status, setStatus] = useState<'loading' | 'loaded' | 'error'>('loading');

  useEffect(() => {
    if (!src) {
        setStatus('error');
        return;
    }
    const img = new Image();
    img.referrerPolicy = "no-referrer";
    img.src = src;
    img.onload = () => setStatus('loaded');
    img.onerror = () => setStatus('error');
  }, [src]);

  if (status === 'error') {
      return (
        <div className="w-full h-28 bg-stone-50 rounded-xl flex items-center justify-center text-stone-400 my-4 border border-stone-200 border-dashed">
            <div className="flex flex-col items-center gap-1.5">
                <ImageOff className="w-5 h-5 opacity-40" />
                <span className="text-[10px] opacity-60">تعذر تحميل الصورة</span>
            </div>
        </div>
      );
  }

  return (
    <div className={`relative w-full my-5 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-500 group
        ${status === 'loaded' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
    `}>
      {status === 'loading' && (
          <div className="absolute inset-0 bg-stone-200 animate-pulse z-10" />
      )}
      <img
        src={src}
        alt={alt || 'Travel Image'}
        referrerPolicy="no-referrer"
        className="w-full h-auto object-cover max-h-[400px] min-h-[200px] transition-transform duration-700 group-hover:scale-105"
      />
      {status === 'loaded' && alt && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 pt-16 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
             <p className="text-white text-sm font-medium leading-snug drop-shadow-sm">{alt}</p>
          </div>
      )}
    </div>
  );
};

// Offer Card Component
const OfferCard: React.FC<{ 
  offer: BookingItem; 
  onAccept: () => void; 
  onReject: () => void;
  isBooked?: boolean;
}> = ({ offer, onAccept, onReject, isBooked = false }) => {
  const [status, setStatus] = useState<'pending' | 'accepted' | 'rejected'>(isBooked ? 'accepted' : 'pending');

  // Update local status if prop changes (e.g. when reloaded from DB)
  useEffect(() => {
      if (isBooked) setStatus('accepted');
  }, [isBooked]);

  const handleAccept = () => {
    setStatus('accepted');
    onAccept();
  };

  const handleReject = () => {
    setStatus('rejected');
    onReject();
  };

  if (status === 'rejected') return null; 

  return (
    <div className={`mt-4 bg-white rounded-2xl border ${status === 'accepted' ? 'border-green-200 bg-green-50/30' : 'border-stone-200'} shadow-sm overflow-hidden transition-all duration-500`}>
       <div className="p-4 border-b border-stone-50">
          <div className="flex justify-between items-start">
              <div>
                  <span className="inline-block px-2 py-0.5 rounded-md bg-stone-100 text-[10px] font-bold text-stone-500 mb-1 uppercase tracking-wider">
                    {offer.type}
                  </span>
                  <h3 className="font-bold text-stone-900 text-lg leading-tight">{offer.title}</h3>
              </div>
              <div className="text-right">
                  <span className="block font-bold text-xl text-stone-900">{offer.price}<span className="text-sm font-normal text-stone-500">{offer.currency}</span></span>
              </div>
          </div>
          <p className="text-sm text-stone-500 mt-2 leading-relaxed">{offer.description}</p>
       </div>
       
       {status === 'accepted' ? (
           <div className="p-3 flex items-center justify-center gap-2 text-green-600 font-bold text-sm">
               <CheckCircle className="w-5 h-5" />
               <span>تم الحجز</span>
           </div>
       ) : (
           <div className="p-3 bg-stone-50 flex gap-3">
                <button 
                    onClick={handleAccept}
                    className="flex-1 bg-stone-900 text-white py-2.5 rounded-xl text-sm font-bold hover:bg-black transition-colors flex items-center justify-center gap-2 shadow-sm hover:shadow-md"
                >
                    <Check className="w-4 h-4" />
                    نعم، احجز
                </button>
                <button 
                    onClick={handleReject}
                    className="flex-1 bg-white border border-stone-200 text-stone-700 py-2.5 rounded-xl text-sm font-bold hover:bg-stone-50 transition-colors flex items-center justify-center gap-2"
                >
                    <X className="w-4 h-4" />
                    لا
                </button>
                <button className="px-3 bg-white border border-stone-200 text-stone-500 rounded-xl hover:text-stone-900 transition-colors">
                    <Edit2 className="w-4 h-4" />
                </button>
            </div>
       )}
    </div>
  );
};

const MessageList: React.FC<MessageListProps> = ({ messages, isLoading, onAcceptOffer, onRejectOffer, bookings = [] }) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Helper to check if an offer is booked
  const isOfferBooked = (offer: BookingItem) => {
      return bookings.some(b => 
          b.title === offer.title && 
          b.type === offer.type && 
          b.price === offer.price
      );
  };

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6 space-y-8 scroll-smooth pb-32">
      {messages.map((msg) => {
        // Determine if this message is in a "thinking" state
        // It's thinking if it's a model message, empty, and either explicitly streaming OR the system is loading
        const isThinking = msg.role === Role.MODEL && !msg.text && (msg.isStreaming || isLoading);
        const isUser = msg.role === Role.USER;

        return (
          <div 
            key={msg.id} 
            // In RTL: flex-row aligns to Start (Right), flex-row-reverse aligns to End (Left).
            // User: Right aligned -> flex-row. Model: Left aligned -> flex-row-reverse.
            className={`flex gap-4 max-w-3xl mx-auto animate-slide-up ${isUser ? 'flex-row' : 'flex-row-reverse'}`}
          >
              {/* Avatar (Unified Position: First in DOM for Edge Alignment) */}
              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mt-1 shadow-sm ${isUser ? 'bg-stone-900 text-white' : 'bg-stone-200 text-stone-600'}`}>
                  {isUser ? (
                      <User className="w-5 h-5" />
                  ) : (
                      isThinking ? (
                          <Compass className="w-5 h-5 animate-spin-slow" />
                      ) : (
                          <Compass className="w-5 h-5" />
                      )
                  )}
              </div>

              {/* Message Content Wrapper */}
              {/* In RTL: items-start aligns to Right, items-end aligns to Left. */}
              <div className={`flex flex-col gap-2 max-w-[95%] sm:max-w-[85%] ${isUser ? 'items-start' : 'items-end'}`}>
                  <div 
                      className={`leading-relaxed text-[15px] sm:text-[16px] w-full shadow-sm relative min-h-[40px]
                      ${isUser 
                          ? 'bg-stone-100 text-stone-800 px-5 py-3 rounded-2xl rounded-tr-sm font-medium' 
                          : 'bg-white border border-stone-100 px-6 py-5 rounded-2xl rounded-tl-sm text-stone-800 prose prose-stone prose-p:my-2 prose-ul:my-2 prose-li:my-0.5 max-w-none prose-img:m-0'
                      }`}
                  >
                      {isThinking ? (
                          <div className="flex items-center gap-1.5 h-6">
                              <div className="w-2 h-2 bg-stone-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                              <div className="w-2 h-2 bg-stone-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                              <div className="w-2 h-2 bg-stone-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                          </div>
                      ) : (
                        isUser ? (
                            msg.text
                        ) : (
                            <ReactMarkdown
                              components={{
                                img: (props: any) => <MarkdownImage src={props.src} alt={props.alt} />
                              }}
                            >
                              {msg.text}
                            </ReactMarkdown>
                        )
                      )}

                      {/* Render Offer Card if present */}
                      {msg.offer && !msg.isStreaming && onAcceptOffer && onRejectOffer && (
                          <OfferCard 
                            offer={msg.offer} 
                            onAccept={() => onAcceptOffer(msg.offer!)}
                            onReject={() => onRejectOffer(msg.offer!)}
                            isBooked={isOfferBooked(msg.offer)}
                          />
                      )}
                  </div>

                  {/* Grounding Sources (Search Results) */}
                  {msg.role === Role.MODEL && msg.groundingMetadata?.groundingChunks && msg.groundingMetadata.groundingChunks.length > 0 && (
                      <div className="mt-2 w-full animate-fade-in max-w-2xl">
                          <div className="text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-2 flex items-center gap-1.5 px-1">
                            <LinkIcon className="w-3 h-3" />
                            المصادر والمراجع
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                            {msg.groundingMetadata.groundingChunks.map((chunk, idx) => {
                                if (!chunk.web?.uri || !chunk.web?.title) return null;
                                return (
                                    <a 
                                      key={idx}
                                      href={chunk.web.uri}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="flex items-start gap-3 p-3 bg-white border border-stone-200/80 rounded-xl hover:bg-stone-50 hover:border-stone-300 hover:shadow-sm transition-all group"
                                    >
                                        <div className="w-8 h-8 rounded-lg bg-stone-100 flex-shrink-0 flex items-center justify-center text-stone-400 group-hover:text-stone-600 transition-colors">
                                              <ExternalLink className="w-4 h-4" />
                                        </div>
                                        <div className="flex-1 min-w-0 flex flex-col justify-center h-full">
                                              <p className="text-xs font-semibold text-stone-700 truncate group-hover:text-stone-900 group-hover:underline decoration-stone-400/50 underline-offset-2">
                                                  {chunk.web.title}
                                              </p>
                                              <p className="text-[10px] text-stone-400 truncate mt-0.5">
                                                  {new URL(chunk.web.uri).hostname}
                                              </p>
                                        </div>
                                    </a>
                                );
                            })}
                          </div>
                      </div>
                  )}
              </div>
          </div>
        );
      })}
      
      {/* 
        Only show standalone loading if there are NO messages (initial load) 
        This prevents the "double loading" effect where we have an empty bubble + bottom spinner.
      */}
      {isLoading && messages.length === 0 && (
         <div className="flex gap-4 max-w-3xl mx-auto justify-start animate-fade-in">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-stone-200 flex items-center justify-center text-stone-600 mt-1 shadow-sm">
                <Compass className="w-5 h-5 animate-spin-slow" />
            </div>
            <div className="bg-white border border-stone-100 px-5 py-4 rounded-2xl rounded-tr-sm shadow-sm flex items-center gap-1.5">
                <div className="w-2 h-2 bg-stone-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-stone-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-stone-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
         </div>
      )}
      
      <div ref={bottomRef} />
    </div>
  );
};

export default MessageList;
