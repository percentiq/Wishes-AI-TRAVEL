
import React, { useEffect, useState } from 'react';
import { Plus, Settings, PanelRightClose, PanelRightOpen, Map, Compass, Ticket, Home, LogOut, User, MessageSquare, Trash2, Briefcase } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { getUserSessions, deleteChatSession } from '../services/chatService';
import { ChatSession } from '../types';

interface SidebarProps {
  onNewChat: () => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onGoHome: () => void;
  onGoDestinations: () => void;
  onGoFlights: () => void;
  onGoSettings?: () => void;
  onGoTrips?: () => void; // New prop
  user: any; 
  onSelectSession: (id: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  onNewChat, 
  isOpen, 
  setIsOpen, 
  onGoHome, 
  onGoDestinations, 
  onGoFlights, 
  onGoSettings,
  onGoTrips,
  user,
  onSelectSession
}) => {
  const [profile, setProfile] = useState<any>(null);
  const [recentSessions, setRecentSessions] = useState<ChatSession[]>([]);

  useEffect(() => {
    if (user) {
      // Fetch user profile
      const fetchProfile = async () => {
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        if (data) setProfile(data);
      };
      fetchProfile();

      // Subscribe to real-time changes for PROFILE
      const profileChannel = supabase
        .channel('profile-changes')
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'profiles',
            filter: `id=eq.${user.id}`,
          },
          (payload) => {
            // Update the local profile state immediately when the DB changes
            setProfile(payload.new);
          }
        )
        .subscribe();

      // Fetch chat sessions
      const fetchSessions = async () => {
        const sessions = await getUserSessions(user.id);
        setRecentSessions(sessions);
      };
      fetchSessions();

      // Subscribe to real-time changes for chat_sessions
      const sessionChannel = supabase
        .channel('schema-db-changes')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'chat_sessions',
            filter: `user_id=eq.${user.id}`,
          },
          (payload) => {
            setRecentSessions((prev) => [payload.new as ChatSession, ...prev]);
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(profileChannel);
        supabase.removeChannel(sessionChannel);
      };
    }
  }, [user]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    onGoHome(); // Redirect to landing page
  };

  const handleSettingsClick = () => {
    if (onGoSettings) {
        onGoSettings();
        if (window.innerWidth < 1024) setIsOpen(false);
    }
  };

  const handleTripsClick = () => {
      if (onGoTrips) {
          onGoTrips();
          if (window.innerWidth < 1024) setIsOpen(false);
      }
  };

  const handleDeleteSession = async (e: React.MouseEvent, sessionId: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (window.confirm('هل أنت متأكد من حذف هذه المحادثة؟')) {
        try {
            // Optimistic update
            setRecentSessions(prev => prev.filter(s => s.id !== sessionId));
            await deleteChatSession(sessionId);
        } catch (error) {
            console.error('Error deleting session', error);
            // Re-fetch if failed
            if (user) {
                const sessions = await getUserSessions(user.id);
                setRecentSessions(sessions);
            }
        }
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      <div 
        className={`fixed inset-0 bg-stone-900/20 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsOpen(false)}
      />

      {/* Sidebar Container */}
      <aside 
        className={`
          fixed lg:static top-0 right-0 z-50 h-full bg-[#F5F5F4] border-l border-stone-200 
          flex flex-col whitespace-nowrap overflow-hidden
          transition-all duration-300 ease-in-out shadow-xl lg:shadow-none
          ${isOpen 
            ? 'w-72 translate-x-0' 
            : 'w-72 translate-x-full lg:w-0 lg:translate-x-0 lg:border-none'
          }
        `}
      >
        <div className="flex flex-col h-full w-72 min-w-[18rem]">
          {/* Header */}
          <div className="h-16 flex items-center justify-between px-4 flex-shrink-0">
             <div className="flex items-center gap-2.5 text-stone-800 font-bold select-none cursor-pointer" onClick={onGoHome}>
                <div className="w-8 h-8 bg-stone-200 rounded-lg flex items-center justify-center">
                    <Compass className="w-5 h-5 text-stone-700" />
                </div>
                <span className="text-lg tracking-tight font-sans">Wanderlust</span>
             </div>
             <button 
               onClick={() => setIsOpen(false)} 
               className="p-2 text-stone-400 hover:text-stone-800 hover:bg-stone-200 rounded-lg transition-colors"
               title="إغلاق القائمة"
             >
               <PanelRightClose className="w-5 h-5" />
             </button>
          </div>

          {/* New Chat Button */}
          <div className="px-4 mb-6 mt-2 flex-shrink-0">
            <button 
              onClick={() => {
                onNewChat();
                if (window.innerWidth < 1024) setIsOpen(false);
              }}
              className="flex items-center justify-between w-full bg-white border border-stone-200 hover:border-stone-300 text-stone-700 px-4 py-3 rounded-xl shadow-[0_1px_2px_rgba(0,0,0,0.05)] hover:shadow transition-all group"
            >
              <div className="flex items-center gap-3">
                  <Plus className="w-5 h-5 text-stone-500 group-hover:text-stone-800" />
                  <span className="font-medium text-sm">مغامرة جديدة</span>
              </div>
            </button>
          </div>

          {/* Navigation Links */}
          <div className="flex-1 overflow-y-auto px-4 custom-scrollbar">
            <div className="space-y-1 mb-8">
              <div className="text-[11px] font-bold text-stone-400 uppercase tracking-wider px-3 mb-3">استكشف</div>
              <button onClick={onGoHome} className="flex items-center gap-3 w-full text-right px-3 py-2 rounded-lg hover:bg-stone-200 text-stone-600 transition-colors">
                <Home className="w-4 h-4" />
                <span className="text-sm font-medium">الرئيسية</span>
              </button>
              {user && (
                  <button onClick={handleTripsClick} className="flex items-center gap-3 w-full text-right px-3 py-2 rounded-lg hover:bg-stone-200 text-stone-600 transition-colors">
                    <Briefcase className="w-4 h-4" />
                    <span className="text-sm font-medium">رحلاتي</span>
                  </button>
              )}
              <button onClick={onGoDestinations} className="flex items-center gap-3 w-full text-right px-3 py-2 rounded-lg hover:bg-stone-200 text-stone-600 transition-colors">
                <Map className="w-4 h-4" />
                <span className="text-sm font-medium">الوجهات</span>
              </button>
              <button onClick={onGoFlights} className="flex items-center gap-3 w-full text-right px-3 py-2 rounded-lg hover:bg-stone-200 text-stone-600 transition-colors">
                <Ticket className="w-4 h-4" />
                <span className="text-sm font-medium">رحلات الطيران</span>
              </button>
            </div>

            {/* History */}
            <div>
              <div className="text-[11px] font-bold text-stone-400 uppercase tracking-wider px-3 mb-3">الأخيرة</div>
              <div className="space-y-1">
                {recentSessions.length > 0 ? (
                  recentSessions.map((session) => (
                    <div key={session.id} className="relative group">
                        <button 
                        onClick={() => {
                            onSelectSession(session.id);
                            if (window.innerWidth < 1024) setIsOpen(false);
                        }}
                        className="flex items-center gap-3 w-full text-right px-3 pl-9 py-2.5 rounded-lg hover:bg-white hover:shadow-sm text-stone-600 transition-all"
                        >
                        <MessageSquare className="w-4 h-4 text-stone-400 group-hover:text-stone-600 flex-shrink-0" />
                        <div className="overflow-hidden min-w-0 flex-1">
                            <p className="text-sm truncate text-stone-700 group-hover:text-stone-900 font-medium">{session.title}</p>
                            <p className="text-[10px] text-stone-400 truncate">
                            {new Date(session.created_at).toLocaleDateString('ar-EG')}
                            </p>
                        </div>
                        </button>
                        <button 
                            type="button"
                            onClick={(e) => handleDeleteSession(e, session.id)}
                            className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-md opacity-0 group-hover:opacity-100 transition-all z-20 bg-white/80 backdrop-blur-sm"
                            title="حذف المحادثة"
                        >
                            <Trash2 className="w-3.5 h-3.5" />
                        </button>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-stone-400 px-3 py-2">لا توجد محادثات سابقة</p>
                )}
              </div>
            </div>
          </div>

          {/* User Profile Section */}
          <div className="p-4 mt-auto flex-shrink-0 border-t border-stone-200/50 bg-[#F5F5F4]">
             {user ? (
               <div className="flex flex-col gap-2">
                   <div 
                     onClick={handleSettingsClick}
                     className="flex items-center justify-between gap-2 p-2 rounded-lg bg-stone-200/50 cursor-pointer hover:bg-stone-200 transition-colors"
                   >
                      <div className="flex items-center gap-2 min-w-0">
                          <div className="w-8 h-8 rounded-full bg-stone-300 flex items-center justify-center text-stone-600 overflow-hidden">
                              {profile?.avatar_url ? (
                                  <img src={profile.avatar_url} alt="User" className="w-full h-full object-cover" />
                              ) : (
                                  <User className="w-4 h-4" />
                              )}
                          </div>
                          <div className="flex flex-col min-w-0">
                              <span className="text-xs font-bold text-stone-800 truncate max-w-[100px]">
                                  {profile?.full_name || 'مستخدم'}
                              </span>
                              <span className="text-[10px] text-stone-500 truncate max-w-[100px]">
                                  {user.email}
                              </span>
                          </div>
                      </div>
                      <Settings className="w-4 h-4 text-stone-400" />
                   </div>
                   
                   <button 
                    onClick={handleLogout}
                    className="flex items-center justify-center gap-2 w-full p-2 text-stone-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors text-xs font-bold"
                  >
                      <LogOut className="w-3 h-3" />
                      تسجيل الخروج
                  </button>
               </div>
             ) : (
                 <button 
                    onClick={handleSettingsClick}
                    className="flex items-center gap-3 w-full text-right px-3 py-2.5 rounded-lg hover:bg-stone-200 text-stone-600 transition-colors"
                 >
                  <Settings className="w-4 h-4" />
                  <span className="text-sm font-medium">الإعدادات</span>
                </button>
             )}
          </div>
        </div>
      </aside>

      {/* Toggle Button */}
      <button 
          onClick={() => setIsOpen(true)}
          className={`fixed top-4 right-4 z-40 p-2.5 bg-[#F5F5F4]/90 hover:bg-white backdrop-blur-md border border-stone-200 rounded-xl shadow-sm text-stone-600 transition-all hover:text-stone-900 duration-300
            ${isOpen ? 'opacity-0 pointer-events-none translate-x-4 scale-90' : 'opacity-100 translate-x-0 scale-100'}
          `}
          title="فتح القائمة"
          aria-label="Open Sidebar"
        >
          <PanelRightOpen className="w-5 h-5" />
      </button>
    </>
  );
};

export default Sidebar;
