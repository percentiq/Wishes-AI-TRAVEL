import React, { useState, useEffect, useRef } from 'react';
import { User, CreditCard, FileText, Bell, Shield, Camera, Plus, Trash2, Check, ChevronLeft, Loader2 } from 'lucide-react';
import { getUserProfile, updateUserProfile, getUserPassport, upsertUserPassport, uploadUserAvatar } from '../../services/userService';

interface SettingsViewProps {
  onGoHome: () => void;
  user: any;
}

type Tab = 'profile' | 'passport' | 'payment' | 'preferences';

const SettingsView: React.FC<SettingsViewProps> = ({ onGoHome, user }) => {
  const [activeTab, setActiveTab] = useState<Tab>('profile');
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [profileData, setProfileData] = useState({
    fullName: '',
    email: '',
    phone: '',
    avatarUrl: ''
  });

  const [passportData, setPassportData] = useState({
    passport_number: '',
    full_name: '',
    expiry_date: '',
    issuing_country: 'العراق',
    nationality: 'عراقي'
  });

  const [cards, setCards] = useState([
    { id: 1, last4: '4242', brand: 'Visa', expiry: '12/24' }
  ]);

  useEffect(() => {
    if (user) {
      loadUserData();
    }
  }, [user]);

  const loadUserData = async () => {
    setLoading(true);
    try {
        const profile = await getUserProfile(user.id);
        if (profile) {
            setProfileData({
                fullName: profile.full_name || '',
                email: profile.email || user.email || '',
                phone: profile.phone || '',
                avatarUrl: profile.avatar_url || ''
            });
        } else {
            // Initialize with basic auth data if profile doesn't exist yet
            setProfileData(prev => ({
                ...prev,
                email: user.email || ''
            }));
        }

        const passport = await getUserPassport(user.id);
        if (passport) {
            setPassportData({
                passport_number: passport.passport_number || '',
                full_name: passport.full_name || '',
                expiry_date: passport.expiry_date || '',
                issuing_country: passport.issuing_country || 'العراق',
                nationality: passport.nationality || 'عراقي'
            });
        }
    } catch (error) {
        console.error("Failed to load user data", error);
    } finally {
        setLoading(false);
    }
  };

  const showNotification = (message: string) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
        await updateUserProfile(user.id, {
            full_name: profileData.fullName,
            phone: profileData.phone,
            avatar_url: profileData.avatarUrl,
            email: profileData.email
        });
        showNotification('تم حفظ معلومات الملف الشخصي بنجاح');
    } catch (error: any) {
        console.error("Failed to save profile", error);
        showNotification(error.message || 'حدث خطأ أثناء الحفظ');
    } finally {
        setLoading(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    setUploading(true);
    try {
      const publicUrl = await uploadUserAvatar(user.id, file);
      if (publicUrl) {
        // Update local state
        setProfileData(prev => ({ ...prev, avatarUrl: publicUrl }));
        // Save to DB immediately
        await updateUserProfile(user.id, { avatar_url: publicUrl });
        showNotification('تم تحديث الصورة الشخصية بنجاح');
      }
    } catch (error: any) {
      console.error("Avatar upload failed", error);
      showNotification(error.message || 'فشل رفع الصورة، يرجى المحاولة مرة أخرى');
    } finally {
      setUploading(false);
      // Reset input
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSavePassport = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
        await upsertUserPassport(user.id, passportData);
        showNotification('تم تحديث بيانات جواز السفر');
    } catch (error: any) {
        console.error("Failed to save passport", error);
        showNotification(error.message || 'حدث خطأ أثناء الحفظ');
    } finally {
        setLoading(false);
    }
  };

  const tabs = [
    { id: 'profile', label: 'الملف الشخصي', icon: User },
    { id: 'passport', label: 'جواز السفر', icon: FileText },
    { id: 'payment', label: 'طرق الدفع', icon: CreditCard },
    { id: 'preferences', label: 'التفضيلات', icon: Bell },
  ];

  return (
    <div className="fixed inset-0 bg-[#F4F3F0] flex flex-col md:flex-row overflow-hidden font-sans">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-72 bg-white border-l border-stone-200 flex flex-col h-full z-10">
        <div className="p-6 border-b border-stone-100 flex items-center gap-3">
          <button onClick={onGoHome} className="p-2 -mr-2 hover:bg-stone-100 rounded-full transition-colors text-stone-500">
            <ChevronLeft className="w-5 h-5 rotate-180" />
          </button>
          <h1 className="text-xl font-bold text-stone-900">الإعدادات</h1>
        </div>
        
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as Tab)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-stone-900 text-white shadow-md'
                    : 'text-stone-600 hover:bg-stone-50'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium text-sm">{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="max-w-3xl mx-auto">
          
          {/* Notification Toast */}
          {notification && (
            <div className="fixed top-6 left-1/2 -translate-x-1/2 bg-stone-900 text-white px-6 py-3 rounded-full shadow-lg z-50 flex items-center gap-2 animate-fade-in">
              <Check className="w-4 h-4 text-green-400" />
              <span className="text-sm font-medium">{notification}</span>
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="space-y-6 animate-fade-in">
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-stone-100">
                <h2 className="text-lg font-bold text-stone-900 mb-6">الصورة الشخصية</h2>
                <div className="flex items-center gap-6">
                  <div className="relative group">
                    <div className="w-24 h-24 rounded-full overflow-hidden bg-stone-200 border-4 border-white shadow-sm flex items-center justify-center text-stone-400">
                      {uploading ? (
                        <Loader2 className="w-8 h-8 animate-spin text-stone-500" />
                      ) : profileData.avatarUrl ? (
                          <img src={profileData.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                      ) : (
                          <User className="w-10 h-10" />
                      )}
                    </div>
                    <input 
                        type="file" 
                        ref={fileInputRef}
                        onChange={handleAvatarUpload}
                        className="hidden"
                        accept="image/*"
                    />
                    <button 
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading}
                        className="absolute bottom-0 right-0 bg-stone-900 text-white p-2 rounded-full shadow-lg hover:scale-110 transition-transform disabled:opacity-70"
                    >
                      <Camera className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-stone-900">{profileData.fullName || 'مستخدم جديد'}</h3>
                    <p className="text-xs text-stone-500 mt-1">يمكنك وضع رابط صورة مباشرة في حقل "رابط الصورة" أو رفع صورة.</p>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSaveProfile} className="bg-white rounded-3xl p-6 shadow-sm border border-stone-100">
                <h2 className="text-lg font-bold text-stone-900 mb-6">المعلومات الشخصية</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-stone-600">الاسم الكامل</label>
                    <input 
                      type="text" 
                      value={profileData.fullName}
                      onChange={(e) => setProfileData({...profileData, fullName: e.target.value})}
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-stone-400"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-stone-600">البريد الإلكتروني</label>
                    <input 
                      type="email" 
                      value={profileData.email}
                      disabled
                      className="w-full bg-stone-100 border border-stone-200 rounded-xl px-4 py-3 text-sm text-stone-500 cursor-not-allowed"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-stone-600">رقم الهاتف</label>
                    <input 
                      type="tel" 
                      value={profileData.phone}
                      onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-stone-400"
                    />
                  </div>
                   <div className="space-y-2">
                    <label className="text-xs font-bold text-stone-600">رابط الصورة (URL)</label>
                    <input 
                      type="text" 
                      value={profileData.avatarUrl}
                      onChange={(e) => setProfileData({...profileData, avatarUrl: e.target.value})}
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-stone-400"
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                </div>
                <div className="mt-8 flex justify-end">
                  <button type="submit" disabled={loading} className="bg-stone-900 text-white px-8 py-3 rounded-xl font-bold text-sm hover:bg-black transition-colors flex items-center gap-2">
                    {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                    {loading ? 'جارٍ الحفظ...' : 'حفظ التغييرات'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeTab === 'passport' && (
            <div className="space-y-6 animate-fade-in">
              <div className="bg-orange-50 border border-orange-100 rounded-2xl p-4 flex items-start gap-3">
                <Shield className="w-5 h-5 text-orange-600 mt-0.5" />
                <div className="text-sm text-orange-800">
                  <p className="font-bold mb-1">بيانات آمنة ومشفرة</p>
                  <p className="opacity-80">يتم استخدام بيانات جواز السفر فقط لتسهيل عمليات الحجز وإصدار التذاكر.</p>
                </div>
              </div>

              <form onSubmit={handleSavePassport} className="bg-white rounded-3xl p-6 shadow-sm border border-stone-100">
                <h2 className="text-lg font-bold text-stone-900 mb-6">تفاصيل جواز السفر</h2>
                <div className="grid grid-cols-1 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-stone-600">الاسم الكامل (كما في الجواز)</label>
                    <input 
                      type="text" 
                      value={passportData.full_name}
                      onChange={(e) => setPassportData({...passportData, full_name: e.target.value})}
                      placeholder="JOHN DOE"
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-stone-400 uppercase"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-stone-600">رقم الجواز</label>
                        <input 
                        type="text" 
                        value={passportData.passport_number}
                        onChange={(e) => setPassportData({...passportData, passport_number: e.target.value})}
                        placeholder="A12345678"
                        className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-stone-400 uppercase"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-stone-600">تاريخ الانتهاء</label>
                        <input 
                        type="date" 
                        value={passportData.expiry_date}
                        onChange={(e) => setPassportData({...passportData, expiry_date: e.target.value})}
                        className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-stone-400"
                        />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-stone-600">الدولة المصدرة</label>
                        <select 
                            value={passportData.issuing_country}
                            onChange={(e) => setPassportData({...passportData, issuing_country: e.target.value})}
                            className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-stone-400"
                        >
                            <option value="العراق">العراق</option>
                            <option value="الإمارات">الإمارات</option>
                            <option value="السعودية">السعودية</option>
                            <option value="الولايات المتحدة">الولايات المتحدة</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-stone-600">الجنسية</label>
                        <select 
                            value={passportData.nationality}
                            onChange={(e) => setPassportData({...passportData, nationality: e.target.value})}
                            className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-stone-400"
                        >
                            <option value="عراقي">عراقي</option>
                            <option value="إماراتي">إماراتي</option>
                            <option value="سعودي">سعودي</option>
                            <option value="أمريكي">أمريكي</option>
                        </select>
                    </div>
                  </div>
                </div>
                <div className="mt-8 flex justify-end">
                  <button type="submit" disabled={loading} className="bg-stone-900 text-white px-8 py-3 rounded-xl font-bold text-sm hover:bg-black transition-colors flex items-center gap-2">
                    {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                    {loading ? 'جارٍ الحفظ...' : 'حفظ البيانات'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeTab === 'payment' && (
            <div className="space-y-6 animate-fade-in">
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-stone-100">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-bold text-stone-900">البطاقات المحفوظة</h2>
                    <button className="flex items-center gap-2 text-xs font-bold text-stone-900 bg-stone-100 hover:bg-stone-200 px-4 py-2 rounded-lg transition-colors">
                        <Plus className="w-4 h-4" />
                        <span>إضافة بطاقة</span>
                    </button>
                </div>
                
                <div className="space-y-4">
                    {cards.map(card => (
                        <div key={card.id} className="flex items-center justify-between p-4 border border-stone-100 rounded-2xl bg-stone-50 group hover:border-stone-300 transition-colors">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-8 bg-white rounded flex items-center justify-center border border-stone-200">
                                    <span className="text-[10px] font-bold text-blue-800 tracking-tighter uppercase italic">{card.brand}</span>
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-stone-800">•••• •••• •••• {card.last4}</p>
                                    <p className="text-xs text-stone-500">تنتهي في {card.expiry}</p>
                                </div>
                            </div>
                            <button className="p-2 text-stone-400 hover:text-red-500 hover:bg-white rounded-full transition-colors opacity-0 group-hover:opacity-100">
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'preferences' && (
            <div className="space-y-6 animate-fade-in">
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-stone-100">
                    <h2 className="text-lg font-bold text-stone-900 mb-6">التفضيلات العامة</h2>
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-sm font-bold text-stone-800">اللغة</h3>
                                <p className="text-xs text-stone-500 mt-1">لغة واجهة التطبيق والمحادثة</p>
                            </div>
                            <select className="bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none">
                                <option>العربية</option>
                                <option>English</option>
                            </select>
                        </div>
                        <div className="w-full h-px bg-stone-100" />
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-sm font-bold text-stone-800">العملة</h3>
                                <p className="text-xs text-stone-500 mt-1">العملة الافتراضية لعرض الأسعار</p>
                            </div>
                            <select className="bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none">
                                <option>USD ($)</option>
                                <option>IQD (ع.د)</option>
                                <option>EUR (€)</option>
                            </select>
                        </div>
                        <div className="w-full h-px bg-stone-100" />
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-sm font-bold text-stone-800">الإشعارات</h3>
                                <p className="text-xs text-stone-500 mt-1">تلقي تنبيهات عن العروض والرحلات</p>
                            </div>
                            <div className="relative inline-block w-12 mr-2 align-middle select-none transition duration-200 ease-in">
                                <input type="checkbox" name="toggle" id="toggle" className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer border-stone-300 checked:right-0 checked:border-green-400 checked:bg-green-400 transition-all duration-300" />
                                <label htmlFor="toggle" className="toggle-label block overflow-hidden h-6 rounded-full bg-stone-200 cursor-pointer"></label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
};

export default SettingsView;