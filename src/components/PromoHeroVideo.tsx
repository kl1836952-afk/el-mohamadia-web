import React, { useState, useRef, useEffect } from "react";
import { Ship, Plane, Truck, Film, Upload, Volume2, VolumeX, Maximize2, Sparkles, Phone, MessageSquare, Mail } from "lucide-react";

interface Props {
  lang: "ar" | "en";
  activeTab: string;
  setActiveTab: (tab: "home" | "calculator" | "chat" | "tracker" | "booking") => void;
}

export default function PromoHeroVideo({ lang, activeTab, setActiveTab }: Props) {
  const isAr = lang === "ar";
  const [videoSrc, setVideoSrc] = useState<string | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load sample or previously loaded video from state if any
  useEffect(() => {
    // Attempt to read if we have an item in session storage
    const stored = sessionStorage.getItem("al_muhammadiyah_promo_video");
    if (stored) {
      setVideoSrc(stored);
    }
  }, []);

  const handleVideoUpload = (file: File) => {
    if (file && file.type.startsWith("video/")) {
      const videoUrl = URL.createObjectURL(file);
      setVideoSrc(videoUrl);
      setIsPlaying(true);
      setIsMuted(false);

      // Attempt to save to sessionStorage (only works if url is valid, but objectUrls are session-bound)
      try {
        sessionStorage.setItem("al_muhammadiyah_promo_video", videoUrl);
      } catch (e) {
        console.log("Could not store object URL in session", e);
      }
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleVideoUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleVideoUpload(e.target.files[0]);
    }
  };

  const triggerSelectFile = () => {
    fileInputRef.current?.click();
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  const handleFullscreen = () => {
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      }
    }
  };

  return (
    <div className="w-full relative rounded-3xl overflow-hidden shadow-2xl border border-emerald-800/35 bg-emerald-950 mb-10">

      {/* Absolute Glow Background Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-900/40 via-emerald-950 to-neutral-950 pointer-events-none" />

      {/* Main Container Layout */}
      <div className="relative min-h-[460px] flex flex-col xl:flex-row items-stretch justify-between">

        {/* Left Side: Information & Branding (Dark Video Theme Mood) */}
        <div className="flex-1 p-8 md:p-12 flex flex-col justify-between z-10 space-y-8 xl:max-w-2xl text-white">

          <div className="space-y-4">
            <span className="inline-flex items-center gap-1.5 bg-gradient-to-l from-amber-500/25 to-emerald-500/25 border border-amber-400/40 text-amber-300 py-1.5 px-4 rounded-full text-xs font-bold font-sans tracking-wide">
              <Sparkles className="h-3.5 w-3.5 text-amber-400 animate-spin" />
              {isAr ? "الواجهة الإعلامية للمؤسسة الجمركية" : "Exclusive Customs Media Portal"}
            </span>

            <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight bg-gradient-to-r from-white via-emerald-100 to-amber-200 bg-clip-text text-transparent">
              {isAr ? "المحمدية للتخليص الجمركي" : "Al-Muhammadiyah Customs Agency"}
            </h1>

            <p className="text-emerald-250 text-sm md:text-base leading-relaxed font-sans font-light">
              {isAr
                ? "دقة، سرعة، وأمان مالي متكامل بميناء الإسكندرية. من بيتك، شاهد وتابع الإجراءات الجمركية لسيارتك خطوة بخطوة بالذكاء الاصطناعي مع طاقم أستاذ إسلام محمد."
                : "Alexandria port absolute leader in swift automotive & commercial container releases. Experience high-fidelity transparent customs clearing under Eslam Mohamed management."}
            </p>
          </div>

          {/* Quick Bullets direct from user's promotional video banner */}
          <div className="grid grid-cols-2 gap-4 bg-emerald-900/25 border border-emerald-850 p-4 rounded-2xl">
            <div className="flex items-center gap-2 text-xs md:text-sm font-semibold">
              <span className="h-6 w-6 bg-amber-400 text-emerald-950 rounded-lg flex items-center justify-center font-bold text-xs">🚢</span>
              <span>{isAr ? "تخليص بحري" : "Sea Freight Clearance"}</span>
            </div>
            <div className="flex items-center gap-2 text-xs md:text-sm font-semibold">
              <span className="h-6 w-6 bg-amber-400 text-emerald-950 rounded-lg flex items-center justify-center font-bold text-xs">✈️</span>
              <span>{isAr ? "شحن جوي متكامل" : "Air Cargo Clearing"}</span>
            </div>
            <div className="flex items-center gap-2 text-xs md:text-sm font-semibold">
              <span className="h-6 w-6 bg-amber-400 text-emerald-950 rounded-lg flex items-center justify-center font-bold text-xs">💼</span>
              <span>{isAr ? "استشارات وبحوث جمركية" : "Tariff & Code Advisory"}</span>
            </div>
            <div className="flex items-center gap-2 text-xs md:text-sm font-semibold">
              <span className="h-6 w-6 bg-amber-400 text-emerald-950 rounded-lg flex items-center justify-center font-bold text-xs">🚛</span>
              <span>{isAr ? "تخليص بري وتوزيع" : "Land freight / Trucking"}</span>
            </div>
          </div>

          {/* Contact Details strictly from Video Banner info board */}
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-mono text-emerald-300">
            <span className="flex items-center gap-1.5 hover:text-white transition-colors">
              <Phone className="h-3.5 w-3.5 text-amber-400" />
              <span>01274833844</span>
            </span>
            <span className="flex items-center gap-1.5 hover:text-white transition-colors">
              <Mail className="h-3.5 w-3.5 text-amber-400" />
              <span>eslamrezk80@gmail.com</span>
            </span>
            <span className="hidden md:flex items-center gap-1.5 hover:text-white transition-colors">
              <span className="h-1.5 w-1.5 bg-emerald-400 rounded-full" />
              <span>Alexandria Harbor, Gate 14</span>
            </span>
          </div>

          {/* CTA Row */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={() => setActiveTab("calculator")}
              className="bg-amber-400 hover:bg-amber-300 text-emerald-950 font-black py-3 px-5 rounded-xl transition-all flex items-center justify-center gap-2 text-sm shadow-md cursor-pointer"
            >
              <span>{isAr ? "📋 احسب جمرك سيارتك الآن" : "📋 Simulate Freight Customs"}</span>
            </button>
            <button
              onClick={() => setActiveTab("booking")}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-5 rounded-xl transition-all flex items-center justify-center gap-2 text-sm cursor-pointer border border-emerald-500/30"
            >
              <span>{isAr ? "✍️ تقديم طلب وكالة جمركية" : "✍️ Request Legal Operations"}</span>
            </button>
          </div>

        </div>

        {/* Right Side: High Fidelity Video Player & Interactive Visual Mockup */}
        <div
          className={`flex-1 min-h-[350px] md:min-h-[420px] relative p-6 flex flex-col justify-between overflow-hidden transition-all duration-300 ${dragActive ? "bg-emerald-900/30 border-2 border-dashed border-amber-400 m-2 rounded-2xl" : ""
            }`}
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
        >

          {videoSrc ? (
            /* ACTIVE VIDEO RENDERING */
            <div className="absolute inset-x-0 inset-y-0 w-full h-full p-4 rounded-3xl z-0">
              <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl border border-emerald-700/40 bg-zinc-950 group">
                <video
                  ref={videoRef}
                  src={videoSrc}
                  className="w-full h-full object-cover"
                  autoPlay
                  loop
                  muted={isMuted}
                  playsInline
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                />

                {/* Video controls overlays */}
                <div className="absolute bottom-4 inset-x-4 flex items-center justify-between bg-emerald-950/80 backdrop-blur-md border border-white/15 px-4 py-2.5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => {
                        if (videoRef.current) {
                          if (isPlaying) {
                            videoRef.current.pause();
                          } else {
                            videoRef.current.play();
                          }
                        }
                      }}
                      className="text-white hover:text-amber-400 font-bold text-xs"
                    >
                      {isPlaying ? (isAr ? "⏸ إيقاف" : "⏸ Pause") : (isAr ? "▶ تشغيل" : "▶ Play")}
                    </button>

                    <button
                      onClick={toggleMute}
                      className="text-white hover:text-amber-400 flex items-center gap-1.5"
                    >
                      {isMuted ? <VolumeX className="h-4 w-4 text-red-400" /> : <Volume2 className="h-4 w-4 text-emerald-400" />}
                      <span className="text-[11px] font-mono">{isMuted ? (isAr ? "كتم" : "Muted") : (isAr ? "صوت" : "Audible")}</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleFullscreen}
                      className="p-1 text-gray-300 hover:text-white"
                      title={isAr ? "كبير الشاشة" : "Fullscreen"}
                    >
                      <Maximize2 className="h-4 w-4" />
                    </button>

                    <button
                      onClick={() => {
                        setVideoSrc(null);
                        sessionStorage.removeItem("al_muhammadiyah_promo_video");
                      }}
                      className="text-[10px] bg-red-600 hover:bg-red-700 text-white font-bold px-2 py-1 rounded"
                    >
                      {isAr ? "حذف" : "Remove"}
                    </button>
                  </div>
                </div>

                {/* Overlaid Badge */}
                <div className="absolute top-4 left-4 bg-emerald-900/90 hover:bg-emerald-850 text-white text-[10px] font-bold px-3 py-1 rounded-full flex items-center gap-1.5 border border-emerald-700 shadow pointer-events-none">
                  <span className="h-2 w-2 bg-rose-500 rounded-full animate-ping" />
                  <span>{isAr ? "فيديو دعائي تفاعلي" : "Active Promo Player"}</span>
                </div>
              </div>
            </div>
          ) : (
            /* MOTION POSTER (SIMULATES USER'S INTRO VIDEO EXTREMELY HIGH FIDELITY) */
            <div className="absolute inset-0 w-full h-full z-0 flex flex-col justify-between p-6 overflow-hidden bg-gradient-to-b from-[#1c3028] via-[#0b1713] to-[#040907]">

              {/* Airplane Animation Layer */}
              <div className="absolute top-10 left-10 md:left-24 animate-[bounce_8s_infinite_ease-in-out] opacity-35 pointer-events-none z-0">
                <div className="transform rotate-12 flex items-center gap-2">
                  <Plane className="h-10 w-10 text-emerald-400" />
                  <div className="h-[2px] w-48 bg-gradient-to-r from-emerald-500/50 to-transparent" />
                </div>
              </div>

              {/* Glowing routing path curves */}
              <svg className="absolute inset-0 w-full h-full opacity-15 pointer-events-none z-0" xmlns="http://www.w3.org/2000/svg">
                <path d="M 50 350 Q 150 150 350 250 T 600 50" fill="none" stroke="#10b981" strokeWidth="2.5" strokeDasharray="5,5" className="animate-[dash_20s_linear_infinite]" />
                <path d="M 10 200 Q 250 80 400 350" fill="none" stroke="#fbbf24" strokeWidth="2" strokeDasharray="3,6" />
              </svg>

              {/* Huge Cargo Vessel Shadow Illustration rendering with light beam */}
              <div className="absolute -bottom-10 right-4 lg:right-10 w-96 opacity-30 pointer-events-none select-none z-0">
                <Ship size={250} className="text-emerald-500" />
              </div>

              {/* Glowing Spotlights of Harbor */}
              <div className="absolute right-10 bottom-24 h-40 w-40 bg-amber-400/15 rounded-full blur-3xl" />
              <div className="absolute left-10 top-10 h-48 w-48 bg-emerald-500/10 rounded-full blur-3xl" />

              {/* Simulated Promo Screen Title Card elements */}
              <div className="relative z-10 w-full h-full flex flex-col justify-between">

                {/* Simulated Screen Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 bg-emerald-950/80 backdrop-blur-xs border border-emerald-800/40 px-3 py-1 rounded-full">
                    <span className="h-1.5 w-1.5 bg-emerald-500 rounded-full animate-ping" />
                    <span className="text-[10px] font-bold text-emerald-300 tracking-wider">LIVE SYSTEM STREAM</span>
                  </div>

                  {/* Floating Action Button to let them upload their real video file immediately */}
                  <button
                    onClick={triggerSelectFile}
                    className="flex items-center gap-1.5 bg-amber-400 hover:bg-amber-300 text-emerald-950 font-bold text-xs px-3.5 py-1.5 rounded-lg transition-all shadow-md cursor-pointer"
                  >
                    <Upload className="h-3.5 w-3.5 animate-bounce" />
                    <span>{isAr ? "ارفعه هنا وتشغيله" : "Upload Video Here"}</span>
                  </button>
                </div>

                {/* Beautiful Mockups representing trucks, planes, and containers */}
                <div className="my-auto text-center space-y-4 max-w-sm mx-auto">

                  <div className="h-14 w-14 mx-auto bg-gradient-to-br from-amber-400 to-emerald-600 rounded-2xl flex items-center justify-center text-white shadow-lg border border-white/10 animate-[pulse_3s_infinite_ease-in-out]">
                    <Film className="h-7 w-7 text-emerald-950" />
                  </div>

                  <div className="space-y-1">
                    <h4 className="text-sm font-black text-amber-300">
                      {isAr ? "واجهة الفيديو الدعائي الذكية" : "Smart Video Dashboard Face"}
                    </h4>
                    <p className="text-[11px] text-emerald-200/80 leading-normal font-sans">
                      {isAr
                        ? "اسحب وأفلت فيديو الدعاية الجمركي المرفق (المحمدية للتخليص) هنا فورا للتشغيل المباشر دائم الخلفية في الصفحة الرئيسية."
                        : "Drag and drop the promo video attachment here to mount it as the interactive alive motion face of the app."}
                    </p>
                  </div>

                  {/* Browse Clickable Zone */}
                  <div className="inline-block">
                    <span
                      onClick={triggerSelectFile}
                      className="text-[10px] uppercase font-bold tracking-wider text-amber-200 border-b border-amber-300/40 hover:text-white hover:border-white transition-all cursor-pointer"
                    >
                      {isAr ? "تصفح من جهازك 💻" : "Browse computer files 💻"}
                    </span>
                  </div>
                </div>

                {/* Terminal visual status at lower frame */}
                <div className="border-t border-emerald-900/40 pt-3 flex items-center justify-between text-[9px] font-mono text-emerald-500">
                  <span>TERMINAL: Port of Alexandria, Gate 14</span>
                  <span className="flex items-center gap-1">
                    <span className="h-1.5 w-1.5 bg-emerald-500 rounded-full" />
                    AL-MUHAMMADIYAH DIGITAL DISPLAY
                  </span>
                </div>

              </div>

            </div>
          )}

          {/* Hidden HTML5 File Input */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="video/mp4, video/webm, video/ogg, video/quicktime"
            className="hidden"
          />

        </div>

      </div>

    </div>
  );
}
