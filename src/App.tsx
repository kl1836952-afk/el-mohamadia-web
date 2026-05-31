import { Network } from '@capacitor/network';
import React, { useState, useEffect } from "react";
import { TrackingRecord, CustomsService } from "./types";
import CustomsCalculator from "./components/CustomsCalculator";
import AIAdvisorChat from "./components/AIAdvisorChat";
import TransactionTracker from "./components/TransactionTracker";
import RequestConsultationForm from "./components/RequestConsultationForm";
import PromoHeroVideo from "./components/PromoHeroVideo";
import CarGallerySection from "./components/CarGallerySection";
import ImportExportSection from "./components/ImportExportSection";
import CustomsEncyclopedia from "./components/CustomsEncyclopedia";
import { AuthProvider, useAuth } from "./context/AuthContext";
import {
  Globe,
  Phone,
  MessageSquare,
  Mail,
  MapPin,
  Ship,
  ShieldCheck,
  Calculator,
  Bot,
  Clock,
  ClipboardCheck,
  ArrowUpRight,
  Navigation,
  Car,
  FileCheck2,
  CalendarDays,
  User,
  LogOut
} from "lucide-react";

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

function AppContent() {
  useEffect(() => {
    Network.getStatus().then(status => {
      if (status.connected) {
        console.log('الجهاز متصل بالإنترنت');
      } else {
        console.log('الجهاز غير متصل');
      }
    });
  }, []);


  const [lang, setLang] = useState<"ar" | "en">("ar");
  const [activeTab, setActiveTab] = useState<"home" | "calculator" | "chat" | "tracker" | "booking" | "encyclopedia">("home");

  const { user, profile, logout: signOut } = useAuth();

  // Storage for newly generated user booking records to track them in real-time
  const [localRecords, setLocalRecords] = useState<TrackingRecord[]>(() => {
    try {
      const saved = localStorage.getItem("local_customs_records");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  // Prefilled calculator data transferred to booking form
  const [prefilledCalc, setPrefilledCalc] = useState<any>(null);

  const isAr = lang === "ar";

  const handleApplyCalcToForm = (calcData: any) => {
    setPrefilledCalc(calcData);
    setActiveTab("booking");
  };

  const handleSelectCarForCalculation = (carParams: any) => {
    setPrefilledCalc(carParams);
    setActiveTab("calculator");
  };

  const handleNewRecordCreated = (newRecord: TrackingRecord) => {
    setLocalRecords((prev) => {
      const updated = [newRecord, ...prev];
      localStorage.setItem("local_customs_records", JSON.stringify(updated));
      return updated;
    });
    // Optionally focus the tracking tab so they witness its creation
    setTimeout(() => {
      setActiveTab("tracker");
    }, 2000);
  };

  const handleRecordUpdated = (updatedRecord: TrackingRecord) => {
    setLocalRecords((prev) => {
      const updated = prev.map(rec => rec.id === updatedRecord.id ? updatedRecord : rec);
      localStorage.setItem("local_customs_records", JSON.stringify(updated));
      return updated;
    });
  };

  const contactOptions = [
    {
      icon: <Phone className="h-5 w-5 text-emerald-600" />,
      labelAr: "اتصل بنا مباشرة",
      labelEn: "Direct Call Office",
      value: "01274833844",
      href: "tel:01274833844"
    },
    {
      icon: <MessageSquare className="h-5 w-5 text-[#25D366]" />,
      labelAr: "واتساب متاح 24 ساعة",
      labelEn: "WhatsApp (24/7 Support)",
      value: "01274833844",
      href: "https://wa.me/201274833844"
    },
    {
      icon: <Mail className="h-5 w-5 text-emerald-600" />,
      labelAr: "البريد الإلكتروني",
      labelEn: "Email Inquiry Desk",
      value: "info@almuhammadiyah.com",
      href: "mailto:info@almuhammadiyah.com"
    }
  ];

  const systemsSpecs = [
    {
      icon: <Clock className="h-6 w-6 text-emerald-600" />,
      titleAr: "نظام التربيتيك (الإفراج المؤقت)",
      titleEn: "Triptyque Temporary Entry",
      descAr: "دخول مؤقت لسيارات المصريين المقيمين بالخارج والأجانب بدون رسوم جمركية كاملة وفقاً للقرارات والقوانين لنادي السيارات الدولي.",
      descEn: "Temporary entry for Egyptians abroad or foreigners, exempt from customs duties for a periodic legal stay."
    },
    {
      icon: <FileCheck2 className="h-6 w-6 text-emerald-600" />,
      titleAr: "استيراد مالك أول",
      titleEn: "First Owner Guidelines",
      descAr: "استيراد السيارات في نفس سنة الموديل (جديدة تماماً) شريطة شرائها باسم صاحب الشحنة مباشرة للترخيص بالبلاد.",
      descEn: "Standard direct vehicle importing restricted to current year models, bought brand new under primary owner names."
    },
    {
      icon: <ShieldCheck className="h-6 w-6 text-emerald-600" />,
      titleAr: "مبادرة المغتربين المصرية",
      titleEn: "Expatriate Vehicle Scheme",
      descAr: "استيراد سيارة شخصية معفاة 100% من الرسوم والجمارك والضرائب مقابل وديعة دولارية مستردة بعد 5 سنوات بالجنيه المصري.",
      descEn: "Import a personal car 100% tax and customs-free in return of a refundable dollar bank deposit held for 5 years."
    },
    {
      icon: <Ship className="h-6 w-6 text-emerald-600" />,
      titleAr: "تخليص البضائع العامة والرسائل",
      titleEn: "Commercial Cargo Clearance",
      descAr: "إنهاء أجرءات الرسائل الاستيرادية والتجارية، المواد الخام، الحاويات المشتركة، والطرود بميناء الإسكندرية ومختلف الموانئ.",
      descEn: "Full logistics, documentation, and release of industrial commodities, full or shared containers (FCL/LCL)."
    },
    {
      icon: <Navigation className="h-6 w-6 text-emerald-600" />,
      titleAr: "الإفراج الجمركي الدبلوماسي",
      titleEn: "Diplomatic Cargo Releases",
      descAr: "إجراءات حصرية وتسريع فوري وتخليص معافى لسيارات ومقتنيات القنصليات والبعثات الدبلوماسية الدولية والهيئات.",
      descEn: "Exceptional speed, specialized file representation and complete tariff waivers for embassies and consulate cargo."
    }
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-between font-sans selection:bg-emerald-600 selection:text-white" dir={isAr ? "rtl" : "ltr"}>

      {/* Visual Top Accent bar */}
      <div className="h-1.5 bg-gradient-to-r from-emerald-800 via-amber-500 to-emerald-900" />

      {/* Main Navigation Header */}
      <header className="bg-emerald-950 text-white sticky top-0 z-50 shadow-md">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between">

          {/* Logo Brand Brand */}
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 bg-gradient-to-br from-emerald-600 to-emerald-850 rounded-xl flex items-center justify-center border border-emerald-400/30 shadow-md">
              <Ship className="h-6 w-6 text-white" />
            </div>
            <div>
              <span className="block text-[10px] tracking-wider text-amber-400 font-bold uppercase leading-none">
                {isAr ? "التخليص والاستخلاص الجمركي" : "Alex Customs Clearance"}
              </span>
              <h1 className="text-lg font-black font-sans leading-tight mt-1">
                {isAr ? "المحمدية للتخليص الجمركي" : "Al-Muhammadiyah"}
              </h1>
            </div>
          </div>

          {/* Desktop Tab Links */}
          <nav className="hidden lg:flex items-center gap-1.5 text-sm font-semibold">
            <button
              onClick={() => setActiveTab("home")}
              className={`px-3 py-2 rounded-xl transition-all cursor-pointer ${activeTab === "home" ? "bg-white/10 text-amber-300" : "text-emerald-100 hover:bg-white/5"
                }`}
            >
              {isAr ? "الرئيسية والأنظمة" : "Home & Services"}
            </button>
            <button
              onClick={() => setActiveTab("encyclopedia")}
              className={`px-3 py-2 rounded-xl transition-all cursor-pointer ${activeTab === "encyclopedia" ? "bg-white/10 text-amber-300" : "text-emerald-100 hover:bg-white/5"
                }`}
            >
              {isAr ? "الموسوعة الجمركية" : "Customs Encyclopedia"}
            </button>
            <button
              onClick={() => setActiveTab("calculator")}
              className={`px-3 py-2 rounded-xl transition-all cursor-pointer ${activeTab === "calculator" ? "bg-white/10 text-amber-300" : "text-emerald-100 hover:bg-white/5"
                }`}
            >
              {isAr ? "حاسبة الجمارك التفاعلية" : "Interactive Calculator"}
            </button>
            <button
              onClick={() => setActiveTab("chat")}
              className={`px-3 py-2 rounded-xl transition-all cursor-pointer ${activeTab === "chat" ? "bg-white/10 text-amber-300" : "text-emerald-100 hover:bg-white/5"
                }`}
            >
              {isAr ? "المساعد الجمركي الذكي" : "AI Custom Advisor"}
            </button>
            <button
              onClick={() => setActiveTab("tracker")}
              className={`px-3 py-2 rounded-xl transition-all cursor-pointer ${activeTab === "tracker" ? "bg-white/10 text-amber-300" : "text-emerald-100 hover:bg-white/5"
                }`}
            >
              {isAr ? "تتبع المعاملة جمركياً" : "Track Shipment"}
            </button>
            <button
              onClick={() => setActiveTab("booking")}
              className={`px-3 py-2 rounded-xl transition-all cursor-pointer ${activeTab === "booking" ? "bg-white/10 text-amber-300" : "text-emerald-100 hover:bg-white/5"
                }`}
            >
              {isAr ? "طلب وكالة وتخليص" : "Apply representation"}
            </button>
          </nav>

          {/* Controls: Language Toggler & User Info */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setLang(lang === "ar" ? "en" : "ar")}
              className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-white/20 transition-all cursor-pointer text-emerald-100"
            >
              <Globe className="h-4 w-4 text-emerald-200" />
              <span>{lang === "ar" ? "English" : "عربي"}</span>
            </button>

            {user ? (
              <div className="flex items-center gap-2.5 bg-white/5 border border-white/10 p-1.5 rounded-xl text-xs shrink-0 max-w-[210px]">
                <div className="text-right">
                  <span className="block font-medium text-slate-100 truncate text-[11px] max-w-[110px]">{user.email}</span>
                  <span className="text-[9px] text-amber-400 font-extrabold block">
                    {profile?.role === "admin"
                      ? (isAr ? "المشرف أ/ إسلام" : "Owner Admin")
                      : (isAr ? "عميل موثق" : "Customs Client")
                    }
                  </span>
                </div>
                <button
                  onClick={() => signOut()}
                  title={isAr ? "تسجيل الخروج" : "Logout"}
                  className="bg-red-950/40 hover:bg-red-900 text-red-100 p-1.5 rounded-lg border border-red-800/60 cursor-pointer transition-all shrink-0"
                >
                  <LogOut className="h-3.5 w-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setActiveTab("tracker")}
                className="bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-emerald-950 font-black px-3 py-1.5 rounded-lg text-xs cursor-pointer shadow-md transition-all shrink-0"
              >
                {isAr ? "تسجيل الدخول" : "Portal Login"}
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Tablet/Mobile sticky navigation bar */}
      <div className="lg:hidden bg-white border-b border-gray-200 sticky top-[71px] z-40 px-3 py-2 flex items-center justify-between shadow-xs overflow-x-auto gap-1">
        <button
          onClick={() => setActiveTab("home")}
          className={`text-xs px-2.5 py-2 font-bold rounded-lg shrink-0 cursor-pointer ${activeTab === "home" ? "bg-emerald-50 text-emerald-800" : "text-gray-600"
            }`}
        >
          {isAr ? "الرئيسية" : "Home"}
        </button>
        <button
          onClick={() => setActiveTab("encyclopedia")}
          className={`text-xs px-2.5 py-2 font-bold rounded-lg shrink-0 cursor-pointer ${activeTab === "encyclopedia" ? "bg-emerald-50 text-emerald-800" : "text-gray-600"
            }`}
        >
          {isAr ? "الموسوعة" : "Tariff"}
        </button>
        <button
          onClick={() => setActiveTab("calculator")}
          className={`text-xs px-2.5 py-2 font-bold rounded-lg shrink-0 cursor-pointer ${activeTab === "calculator" ? "bg-emerald-50 text-emerald-800" : "text-gray-600"
            }`}
        >
          {isAr ? "الحاسبة" : "Calc"}
        </button>
        <button
          onClick={() => setActiveTab("chat")}
          className={`text-xs px-2.5 py-2 font-bold rounded-lg shrink-0 cursor-pointer ${activeTab === "chat" ? "bg-emerald-50 text-emerald-800" : "text-gray-600"
            }`}
        >
          {isAr ? "المساعد" : "AI"}
        </button>
        <button
          onClick={() => setActiveTab("tracker")}
          className={`text-xs px-2.5 py-2 font-bold rounded-lg shrink-0 cursor-pointer ${activeTab === "tracker" ? "bg-emerald-50 text-emerald-800" : "text-gray-600"
            }`}
        >
          {isAr ? "التتبع" : "Track"}
        </button>
        <button
          onClick={() => setActiveTab("booking")}
          className={`text-xs px-2.5 py-2 font-bold rounded-lg shrink-0 cursor-pointer ${activeTab === "booking" ? "bg-emerald-50 text-emerald-800" : "text-gray-600"
            }`}
        >
          {isAr ? "تقديم طلب" : "Apply"}
        </button>
      </div>

      {/* Mobile user state & logout strip */}
      {user && (
        <div className="lg:hidden bg-slate-50 border-b border-slate-200 px-4 py-2 flex items-center justify-between text-xs font-semibold">
          <div className="flex items-center gap-1.5 text-gray-800">
            <User className="h-4 w-4 text-emerald-700" />
            <span className="truncate max-w-[155px] font-mono font-medium text-[11px]">{user.email}</span>
            <span className="text-[9px] bg-emerald-50 text-emerald-800 border border-emerald-200 px-1.5 py-0.5 rounded font-black shrink-0">
              {profile?.role === "admin" ? (isAr ? "المشرف" : "Admin") : (isAr ? "عميل" : "Client")}
            </span>
          </div>
          <button
            onClick={() => signOut()}
            className="text-red-700 hover:text-white bg-red-50 hover:bg-red-700 font-extrabold flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-red-200 hover:border-red-700 transition-all text-xs cursor-pointer shadow-3xs"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>{isAr ? "تسجيل الخروج" : "Logout"}</span>
          </button>
        </div>
      )}

      {/* Main Content Areas inside layout container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-8 py-8">

        {activeTab === "home" && (
          // LANDING INFORMATION MODULES
          <div className="space-y-12">

            {/* Promo Video Header Face */}
            <PromoHeroVideo
              lang={lang}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />

            {/* Inbound & Outbound Divisions Section */}
            <ImportExportSection
              lang={lang}
              setActiveTab={setActiveTab}
            />

            {/* Automotive Showcase Section with interactive calculation triggers */}
            <CarGallerySection
              lang={lang}
              onSelectCarForCalculation={handleSelectCarForCalculation}
            />

            {/* Why choose Al-Muhammadiyah section info grid */}
            <div className="bg-white rounded-3xl border border-gray-150 p-6 md:p-8 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center shadow-xs">
              <div className="space-y-4">
                <span className="text-xs uppercase tracking-wider text-emerald-700 font-bold">
                  {isAr ? "ريادة واستخلاص احترافي" : "Why choose Al-Muhammadiyah"}
                </span>
                <h3 className="text-xl md:text-2xl font-black text-gray-950 leading-tight font-sans">
                  {isAr ? "دقة متناهية وإلمام متكامل بالقوانين الجمركية" : "Sourcing maximum precision within Egypt harbor codes."}
                </h3>
                <p className="text-xs md:text-sm text-gray-550 leading-relaxed font-sans font-light">
                  {isAr
                    ? "مجال الجمارك وتخليص السيارات يتمتع بمتغيرات قرارات ولوائح جمركية يومية وبنود تعسفية (تراخيص، ودائع المغتربين، معاينة الكشف، تحديد سعة المحرك بالـ CC، واتفاقيات المنشأ). فريقنا يتابع اللوائح لحظة بلحظة بمصلحة الجمارك المصرية لضمان معاملة قانونية دقيقة وسرعة إنهاء أوراق شاسيه ومطابقة المحركات."
                    : "Egyptian customs is subjective to daily amendments regarding international certificates of origin, import license drafts, and Expat schedules. Our agency works direct inside Alexandria port docks to ensure maximum efficiency."}
                </p>

                <div className="flex flex-col gap-2.5 pt-2 text-xs font-semibold text-gray-800">
                  <div className="flex items-center gap-2">
                    <div className="h-5 w-5 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-750 font-bold text-[10px]">✓</div>
                    <span>{isAr ? "نظام استعلام دولي لودائع المغتربين" : "Active simulator of expatriate MoF deposits."}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-5 w-5 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-750 font-bold text-[10px]">✓</div>
                    <span>{isAr ? "معاينة مطابقة الكشف الفيزيائي برقم الشاسيه مع المرور" : "Chassis & Engine serial matching with port authority."}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-5 w-5 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-750 font-bold text-[10px]">✓</div>
                    <span>{isAr ? "تجهيز فوري لورقة شهادة المنشأ يورو 1 (بشعار الاتحاد الأوروبي)" : "Validation profiles for Euro-1 certificates drops."}</span>
                  </div>
                </div>
              </div>

              {/* Contacts Grid */}
              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200/80 space-y-4">
                <h4 className="font-bold text-sm text-gray-950">
                  {isAr ? "تواصل مباشرة مع إدارة أ/ إسلام محمد" : "Connect Directly with CEO Eslam Mohamed"}
                </h4>
                <p className="text-xs text-gray-500">
                  {isAr
                    ? "يسعدنا الرد على مكالماتكم ورسائلكم لمراجعة فواتيرك وتخمين الجمارك قبل شحن سيارتك"
                    : "Direct consultation portal to audit your invoices before shipping outbound."}
                </p>

                <div className="space-y-3.5">
                  {contactOptions.map((opt, idx) => (
                    <a
                      key={idx}
                      href={opt.href}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-between p-3.5 bg-white rounded-xl border border-gray-250 hover:border-emerald-350 hover:shadow-xs transition-all text-xs"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-slate-50 rounded-lg">
                          {opt.icon}
                        </div>
                        <div>
                          <span className="block font-semibold text-gray-900">{isAr ? opt.labelAr : opt.labelEn}</span>
                          <span className="text-[10px] text-gray-400 mt-0.5">{opt.value}</span>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-805 uppercase">
                        {isAr ? "تواصل" : "Link"} →
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            </div>

          </div>
        )}

        {activeTab === "encyclopedia" && (
          // CUSTOMS ENCYCLOPEDIA VIEW WITH DIRECT PREFILL HOOK
          <CustomsEncyclopedia
            lang={lang}
            onApplyCalculationLink={(item) => {
              // Extract prefilled params back to interactive calculator directly
              let suggestedCc = 1600;
              if (item.id === "8703.11") suggestedCc = 999;
              else if (item.id === "8703.12") suggestedCc = 1500;
              else if (item.id === "8703.13") suggestedCc = 1990;
              else if (item.id === "8703.14") suggestedCc = 2200;

              setPrefilledCalc({
                carCc: suggestedCc,
                electric: item.id === "8703.20",
                hybrid: item.id === "8703.30",
                origin: item.id.includes("EUR1") || item.dutyRateAr.includes("الأوروبي") ? "EUROPEAN" : "STANDARD"
              });
              setActiveTab("calculator");
            }}
          />
        )}

        {activeTab === "calculator" && (
          // CALCULATOR VIEW
          <CustomsCalculator
            lang={lang}
            onApplyToForm={handleApplyCalcToForm}
          />
        )}

        {activeTab === "chat" && (
          // AI CONSULTANT VIEW
          <AIAdvisorChat
            lang={lang}
          />
        )}

        {activeTab === "tracker" && (
          // TRACKER VIEW
          <TransactionTracker
            lang={lang}
            localRecords={localRecords}
            onRecordUpdated={handleRecordUpdated}
          />
        )}

        {activeTab === "booking" && (
          // CONSULTATION / DELEGATION COMPILING FORM
          <RequestConsultationForm
            lang={lang}
            prefilledData={prefilledCalc}
            onNewRecordCreated={handleNewRecordCreated}
          />
        )}

      </main>

      {/* Persistent WhatsApp Floating support widget */}
      <div className="fixed bottom-6 right-6 z-55 print:hidden">
        <a
          href="https://wa.me/201274833844"
          target="_blank"
          rel="noreferrer"
          title={isAr ? "دردشة واتساب مباشرة مع أ/ إسلام محمد" : "Direct WhatsApp Support with Eslam"}
          className="h-14 w-14 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-all relative group"
        >
          <MessageSquare className="h-6 w-6" />
          <span className="absolute right-16 bg-emerald-950 text-white text-xs font-bold py-1.5 px-3 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-md border border-emerald-800">
            {isAr ? "أ/ إسلام محمد جمرك" : "Call Mr. Eslam Mohamed"}
          </span>
          <span className="absolute top-0 right-0 h-3 w-3 bg-red-500 rounded-full border-2 border-white animate-ping" />
        </a>
      </div>

      {/* Styled Footer */}
      <footer className="bg-emerald-950 text-emerald-100 mt-16 py-8 border-t border-emerald-900 z-10">
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="space-y-1.5 text-center md:text-right">
            <h4 className="font-extrabold text-sm text-white">
              {isAr ? "شركة المحمدية للتخليص جمارك الإسكندرية" : "Al-Muhammadiyah Customs Agency Alexandria"}
            </h4>
            <p className="text-xs text-emerald-300">
              {isAr
                ? "إشراف وإدارة أستاذ إسلام محمد - إنهاء إجراءات سيارات المغتربين والتربيتيك ورخص المرور"
                : "Managed by Eslam Mohamed - Automotive releases, first owner agreements and temporary passes"}
            </p>
          </div>

          <div className="flex flex-col items-center md:items-end gap-1 font-mono text-[11px] text-emerald-300">
            <p>Phone: 01274833844</p>
            <p>Email: info@almuhammadiyah.com</p>
            <p className="mt-1 text-[10px] text-emerald-450">
              © {new Date().getFullYear()} {isAr ? "جميع الحقوق محفوظة." : "All rights reserved."}
            </p>
          </div>
        </div>
      </footer>

    </div>
  );
}
