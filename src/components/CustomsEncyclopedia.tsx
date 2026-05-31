import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  CUSTOMS_TARIFF_DATA, 
  CUSTOMS_EXEMPTIONS, 
  TariffItem,
  GENERAL_CUSTOMS_FAQ
} from "../data/customsTariffData";
import { 
  BookOpen, 
  Search, 
  Scale, 
  HelpCircle, 
  CheckCircle, 
  FileText, 
  Calculator, 
  ChevronDown, 
  ChevronUp, 
  Info, 
  ShieldAlert, 
  Sparkles,
  ArrowUpRight,
  Sparkle
} from "lucide-react";

interface Props {
  lang: "ar" | "en";
  onApplyCalculationLink?: (tariff: any) => void;
}

export default function CustomsEncyclopedia({ lang, onApplyCalculationLink }: Props) {
  const isAr = lang === "ar";
  
  // Tab states: "tariff" (البنود والتعريفة), "exemptions" (قواعد الإعفاءات), "faq" (الأسئلة الشائعة)
  const [activeSubTab, setActiveSubTab] = useState<"tariff" | "exemptions" | "faq">("tariff");
  
  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedChapter, setSelectedChapter] = useState<string>("all");
  
  // Expanded card state
  const [expandedItemId, setExpandedItemId] = useState<string | null>(null);

  // Active exemption category filter
  const [exemptionCategory, setExemptionCategory] = useState<string>("all");

  // Chapter categories extraction
  const chapters = useMemo(() => {
    const set = new Set<string>();
    CUSTOMS_TARIFF_DATA.forEach(item => {
      set.add(isAr ? item.chapterAr : item.chapterEn);
    });
    return ["all", ...Array.from(set)];
  }, [isAr]);

  // Filter tariff items
  const filteredTariff = useMemo(() => {
    return CUSTOMS_TARIFF_DATA.filter(item => {
      const matchChapter = selectedChapter === "all" || 
        (isAr ? item.chapterAr === selectedChapter : item.chapterEn === selectedChapter);
      
      const query = searchQuery.toLowerCase().trim();
      const matchSearch = !query || 
        item.hsCode.toLowerCase().includes(query) ||
        item.nameAr.toLowerCase().includes(query) ||
        item.nameEn.toLowerCase().includes(query) ||
        item.descriptionAr.toLowerCase().includes(query) ||
        item.descriptionEn.toLowerCase().includes(query);

      return matchChapter && matchSearch;
    });
  }, [selectedChapter, searchQuery, isAr]);

  const toggleExpandItem = (id: string) => {
    setExpandedItemId(prev => prev === id ? null : id);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.4 }}
      className="space-y-8"
    >
      {/* Title & Banner Badge */}
      <div className="bg-gradient-to-br from-emerald-950 via-emerald-900 to-emerald-950 text-white rounded-3xl p-6 md:p-8 shadow-md border border-emerald-800 text-right overflow-hidden relative">
        {/* Abstract Background Visuals */}
        <div className="absolute top-0 left-0 w-80 h-80 bg-emerald-800/20 rounded-full blur-3xl -translate-x-12 -translate-y-12 pointer-events-none" />
        <div className="absolute bottom-0 right-1/3 w-60 h-60 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10" dir={isAr ? "rtl" : "ltr"}>
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 bg-amber-400/20 text-amber-300 font-extrabold px-3 py-1 rounded-full text-[10px] tracking-wide uppercase border border-amber-400/30">
              <Sparkles className="h-3 w-3 text-amber-400" />
              <span>{isAr ? "الدليل الجمركي الرسمي لموانئ مصر" : "Official Egyptian Ports Tariff Guidebook"}</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-black tracking-tight leading-tight">
              {isAr ? "الموسوعة الجمركية المصرية الشاملة" : "Consolidated Customs Encyclopedia"}
            </h2>
            <p className="text-xs md:text-sm text-emerald-100 font-light leading-relaxed">
              {isAr 
                ? "دليلك الكامل للبند والتعريفة الموحدة (HS Code) وقواعد مصلحة الجمارك بميناء الإسكندرية. ابحث في أبواب التعريفة، وتعرف على موافقات الجهات الرقابية، وشروط الإعفاءات المنظمة للمغتربين والمنشأ الأوروبي." 
                : "Your extensive handbook of harmonized tariff systems (HS Codes) and port authority regulations. Search structured clauses, required agencies, and Expat or European EUR-1 waiver frameworks."}
            </p>
          </div>

          <div className="h-16 w-16 md:h-20 md:w-20 bg-gradient-to-br from-amber-400 to-amber-500 text-emerald-950 rounded-2xl flex items-center justify-center border border-amber-300 shadow-lg self-start md:self-center shrink-0">
            <BookOpen className="h-8 w-8 md:h-10 md:w-10 stroke-[1.8]" />
          </div>
        </div>

        {/* Tab Selection */}
        <div className="flex flex-wrap gap-2.5 mt-8 border-t border-emerald-850 pt-5 justify-start" dir={isAr ? "rtl" : "ltr"}>
          <button
            onClick={() => setActiveSubTab("tariff")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
              activeSubTab === "tariff" 
                ? "bg-amber-400 text-emerald-950 shadow-sm font-black" 
                : "bg-emerald-900/50 text-emerald-100 hover:bg-emerald-850 border border-emerald-800"
            }`}
          >
            <FileText className="h-4 w-4" />
            <span>{isAr ? "كتاب البنود والتعريفة الجمركية" : "HS Code Tariff Database"}</span>
          </button>

          <button
            onClick={() => setActiveSubTab("exemptions")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
              activeSubTab === "exemptions" 
                ? "bg-amber-400 text-emerald-950 shadow-sm font-black" 
                : "bg-emerald-900/50 text-emerald-100 hover:bg-emerald-850 border border-emerald-800"
            }`}
          >
            <Scale className="h-4 w-4" />
            <span>{isAr ? "قواعد وإعفاءات الجمارك" : "Customs Exemption Rules"}</span>
          </button>

          <button
            onClick={() => setActiveSubTab("faq")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
              activeSubTab === "faq" 
                ? "bg-amber-400 text-emerald-950 shadow-sm font-black" 
                : "bg-emerald-900/50 text-emerald-100 hover:bg-emerald-850 border border-emerald-800"
            }`}
          >
            <HelpCircle className="h-4 w-4" />
            <span>{isAr ? "الأحكام والتعليمات التفسيرية" : "Interpretative Port FAQ"}</span>
          </button>
        </div>
      </div>

      {/* INNER VIEW CONTENT */}
      {activeSubTab === "tariff" && (
        <div className="space-y-6" dir={isAr ? "rtl" : "ltr"}>
          {/* Live search filters block */}
          <div className="bg-white rounded-2xl border border-gray-150 p-5 shadow-3xs space-y-4">
            <div className="flex flex-col md:flex-row gap-3.5">
              {/* Search input */}
              <div className="flex-1 relative">
                <Search className="absolute right-3.5 top-3.5 h-4 w-4 text-gray-450" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={isAr ? "ابحث بالبند الجمركي، اسم السلعة، الكود الرمزى HS أو الوصف..." : "Search by product keyword, HS Code or description..."}
                  className="w-full pr-10 pl-4 py-3 bg-slate-50 border border-gray-250 focus:border-emerald-500 focus:bg-white focus:ring-1 focus:ring-emerald-500 rounded-xl text-xs font-semibold text-gray-900 placeholder:text-gray-400 transition-all outline-none"
                />
              </div>

              {/* Clear search query helper */}
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery("")}
                  className="bg-slate-100 text-gray-700 font-bold px-4 py-3 rounded-xl hover:bg-slate-200 transition-all text-xs shrink-0 cursor-pointer"
                >
                  {isAr ? "مسح البحث" : "Clear Search"}
                </button>
              )}
            </div>

            {/* Structured chapter categories selector */}
            <div className="space-y-2">
              <span className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wider block">
                {isAr ? "تصفية حسب الأبواب والفصول الجمركية:" : "Filter by Customs Chapters:"}
              </span>
              <div className="flex flex-wrap gap-1.5">
                {chapters.map((ch, idx) => {
                  const displayLabel = ch === "all" ? (isAr ? "كل الأبواب الفقهية" : "All Chapters") : ch;
                  return (
                    <button
                      key={idx}
                      onClick={() => setSelectedChapter(ch)}
                      className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all border cursor-pointer ${
                        selectedChapter === ch 
                          ? "bg-slate-900 text-white border-slate-900" 
                          : "bg-slate-50 text-gray-700 border-gray-200 hover:bg-slate-100 hover:border-gray-350"
                      }`}
                    >
                      {displayLabel}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Results Display Area */}
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs font-bold text-gray-500 px-1">
              <span>
                {isAr 
                  ? `تم العثور على ${filteredTariff.length} بند جمركي مسجل` 
                  : `Found ${filteredTariff.length} registered tariff clauses`
                }
              </span>
              <span>{isAr ? "*خاضعة لإشراف مكتب أ/ إسلام محمد" : "*Reviewed under Master Eslam Desk"}</span>
            </div>

            {filteredTariff.length === 0 ? (
              <div className="bg-white rounded-2xl border border-dashed border-gray-300 p-12 text-center text-gray-500 space-y-3">
                <ShieldAlert className="h-10 w-10 text-amber-500 mx-auto" />
                <h4 className="font-bold text-sm text-gray-900">
                  {isAr ? "لم نجد بنود جمركية مطابقة لبحثك" : "No matching tariff items encountered"}
                </h4>
                <p className="text-xs text-gray-400 max-w-md mx-auto">
                  {isAr 
                    ? "حاول استخدام كلمات أبسط مثل (سيارات، لابتوب، قمح، قطع غيار) أو اسأل المستشار الذكي للتخمين المباشر." 
                    : "Try searching simple phrases (e.g. cars, laptop, wheat, active spare parts) or consult our AI chat bot."}
                </p>
                <button 
                  onClick={() => { setSearchQuery(""); setSelectedChapter("all"); }}
                  className="bg-emerald-50 text-emerald-800 font-bold text-xs py-2 px-4 rounded-xl border border-emerald-200 hover:bg-emerald-100/80 transition-all cursor-pointer inline-flex items-center gap-1.5"
                >
                  {isAr ? "إعادة تعيين مرشحات البحث" : "Reset Active Filters"}
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3.5">
                {filteredTariff.map((item) => {
                  const isExpanded = expandedItemId === item.id;
                  return (
                    <div 
                      key={item.id}
                      className={`bg-white rounded-2xl border transition-all overflow-hidden ${
                        isExpanded 
                          ? "border-emerald-500 shadow-sm ring-1 ring-emerald-100" 
                          : "border-gray-150 hover:border-gray-250 hover:shadow-3xs"
                      }`}
                    >
                      {/* Accordion Trigger Head Line */}
                      <button
                        onClick={() => toggleExpandItem(item.id)}
                        className="w-full text-right p-4 md:p-5 flex items-start md:items-center justify-between gap-4 cursor-pointer text-xs"
                      >
                        <div className="space-y-1.5 text-right flex-1">
                          {/* HS Code Badge & Chapter Tag */}
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-mono text-[11px] font-black text-emerald-950 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-100 uppercase tracking-widest">
                              HS {item.hsCode}
                            </span>
                            <span className="text-[10px] text-gray-400 font-bold bg-slate-50 px-2 py-1 rounded border border-gray-150">
                              {isAr ? item.chapterAr : item.chapterEn}
                            </span>
                          </div>

                          {/* Item Primary Name */}
                          <h4 className="text-sm md:text-base font-black text-gray-950 leading-tight">
                            {isAr ? item.nameAr : item.nameEn}
                          </h4>
                        </div>

                        {/* Duty Rate Summary & Chevron */}
                        <div className="flex items-center gap-3.5 mr-auto pl-1 shrink-0">
                          <div className="text-left md:text-right hidden sm:block">
                            <span className="block text-[9px] text-gray-400 font-extrabold uppercase tracking-wider">{isAr ? "الجمارك الأساسية" : "Base Duty Rate"}</span>
                            <span className="text-xs font-extrabold text-emerald-800 font-serif">
                              {isAr ? item.dutyRateAr : item.dutyRateEn}
                            </span>
                          </div>

                          <div className="p-1.5 bg-slate-50 rounded-lg text-gray-500 border border-gray-100 group-hover:bg-slate-100">
                            {isExpanded ? <ChevronUp className="h-4 w-4 text-emerald-700" /> : <ChevronDown className="h-4 w-4" />}
                          </div>
                        </div>
                      </button>

                      {/* Dropdown details content */}
                      <AnimatePresence initial={false}>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: "auto" }}
                            exit={{ height: 0 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                            className="border-t border-gray-100 bg-slate-50/50"
                          >
                            <div className="p-4 md:p-6 space-y-5 text-right text-xs">
                              {/* Descriptive Paragraph */}
                              <div className="space-y-1 bg-white p-3.5 rounded-xl border border-gray-150 shadow-3xs">
                                <span className="text-[10px] text-gray-450 font-black flex items-center gap-1">
                                  <Info className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                                  <span>{isAr ? "الوصف الجمركي والتنظيمي" : "Customs Regulatory Remarks"}</span>
                                </span>
                                <p className="text-xs text-gray-600 leading-relaxed pt-1 font-sans">
                                  {isAr ? item.descriptionAr : item.descriptionEn}
                                </p>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Duty calculations sheet */}
                                <div className="bg-white p-4 rounded-xl border border-gray-150 space-y-3 shadow-3xs">
                                  <h5 className="font-bold text-gray-950 border-b border-gray-100 pb-2 text-[11px] uppercase tracking-wider text-emerald-950 flex items-center gap-1.5">
                                    <Scale className="h-3.5 w-3.5 text-emerald-600" />
                                    <span>{isAr ? "جدول الرسوم والضرائب الهيكلية" : "Tax & Duty Structure Schedule"}</span>
                                  </h5>

                                  <div className="space-y-2 text-xs font-semibold text-gray-800">
                                    <div className="flex items-center justify-between border-b border-dashed border-gray-100 pb-1.5">
                                      <span className="text-gray-450 font-medium">{isAr ? "الضريبة الجمركية الواردة:" : "Incoming customs duty:"}</span>
                                      <span className="font-black text-amber-700">{isAr ? item.dutyRateAr : item.dutyRateEn}</span>
                                    </div>
                                    <div className="flex items-center justify-between border-b border-dashed border-gray-100 pb-1.5">
                                      <span className="text-gray-450 font-medium">{isAr ? "ضريبة القيمة المضافة (VAT):" : "Value Added Tax (VAT):"}</span>
                                      <span className="font-mono text-gray-900">{item.vatRate}%</span>
                                    </div>
                                    <div className="flex items-center justify-between border-b border-dashed border-gray-100 pb-1.5">
                                      <span className="text-gray-450 font-medium">{isAr ? "رسم تنمية موارد المالي:" : "Resource Development Fee:"}</span>
                                      <span className="font-mono text-gray-900">{item.devFee}%</span>
                                    </div>
                                    {item.tableTax !== undefined && (
                                      <div className="flex items-center justify-between border-b border-dashed border-gray-100 pb-1.5">
                                        <span className="text-gray-450 font-medium">{isAr ? "ضريبة الجدول الاستهلاكية:" : "Surtax / Table Tax:"}</span>
                                        <span className="font-mono text-gray-900">{item.tableTax}%</span>
                                      </div>
                                    )}
                                  </div>
                                </div>

                                {/* Food / Drug / Telecom Agency approvals needed in Egypt seaports */}
                                <div className="bg-white p-4 rounded-xl border border-gray-150 space-y-3 shadow-3xs">
                                  <h5 className="font-bold text-gray-950 border-b border-gray-100 pb-2 text-[11px] uppercase tracking-wider text-red-950 flex items-center gap-1.5">
                                    <ShieldAlert className="h-3.5 w-3.5 text-amber-600" />
                                    <span>{isAr ? "موافقات الجهات الرقابية المصرية" : "Required GOEIC & Authority Approvals"}</span>
                                  </h5>
                                  
                                  <div className="space-y-2">
                                    <p className="text-xs text-slate-700 leading-relaxed font-sans">
                                      {isAr ? item.agencyRequirementsAr : item.agencyRequirementsEn}
                                    </p>
                                    <div className="bg-amber-50 rounded-lg p-2.5 border border-amber-100 text-[10px] text-amber-900 leading-relaxed font-semibold">
                                      ⚠️ {isAr 
                                        ? "عدم تقديم موافقات هذه الجهات مصلحياً يترتب عليه حظر الإفراج وتحويل الحاوية للمهمل بميناء الإسكندرية." 
                                        : "Failure to produce these certifications at port prompts cargo quarantine or return clauses."
                                      }
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Interactive Action: apply to calculator/form */}
                              {onApplyCalculationLink && (
                                <div className="flex justify-end pt-2">
                                  <button
                                    onClick={() => {
                                      if (onApplyCalculationLink) {
                                        onApplyCalculationLink(item);
                                      }
                                    }}
                                    className="bg-emerald-800 hover:bg-emerald-700 font-extrabold text-white px-4 py-2.5 rounded-xl border border-emerald-700 hover:border-emerald-600 flex items-center gap-2 cursor-pointer transition-all text-xs"
                                  >
                                    <Calculator className="h-4 w-4" />
                                    <span>{isAr ? "احسب الرسوم الإجمالية لهذه السلعة" : "Simulate total clearance cost"}</span>
                                    <ArrowUpRight className="h-3.5 w-3.5 text-emerald-200" />
                                  </button>
                                </div>
                              )}

                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {activeSubTab === "exemptions" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" dir={isAr ? "rtl" : "ltr"}>
          {/* Informative Side Rules Checklist */}
          <div className="lg:col-span-8 space-y-5">
            {CUSTOMS_EXEMPTIONS.map((ex, idx) => {
              return (
                <div key={idx} className="bg-white rounded-2xl border border-gray-150 p-6 space-y-4 shadow-3xs">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-800 shrink-0">
                      <Scale className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-sm text-gray-950">
                        {isAr ? ex.titleAr : ex.titleEn}
                      </h4>
                      <span className="text-[10px] uppercase font-bold text-amber-600 tracking-wider">
                        {ex.category === "expatriate" ? (isAr ? "سيارات مغتربين" : "Expat scheme") : ex.category === "disability" ? (isAr ? "ذوي الهمم" : "Heallth waiver") : (isAr ? "شراكة دولية وتجارية" : "Trade Treaty")}
                      </span>
                    </div>
                  </div>

                  <div className="border-t border-gray-100 pt-3.5 space-y-3">
                    {isAr ? ex.detailsAr.map((det, dIdx) => (
                      <div key={dIdx} className="flex items-start gap-2.5 text-xs text-gray-700 leading-relaxed font-medium">
                        <CheckCircle className="h-4 w-4 text-emerald-600 stroke-[3] mt-0.5 shrink-0" />
                        <span>{det}</span>
                      </div>
                    )) : ex.detailsEn.map((det, dIdx) => (
                      <div key={dIdx} className="flex items-start gap-2.5 text-xs text-gray-700 leading-relaxed">
                        <CheckCircle className="h-4 w-4 text-emerald-600 stroke-[3] mt-0.5 shrink-0" />
                        <span>{det}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Guidelines Sidebar summary card */}
          <div className="lg:col-span-4 space-y-5">
            <div className="bg-gradient-to-br from-slate-900 to-slate-950 text-white rounded-2xl p-5 border border-slate-800 shadow-sm space-y-3.5">
              <div className="font-black text-xs text-amber-400 flex items-center gap-1.5 uppercase tracking-wider">
                <Sparkle className="h-4 w-4 text-amber-400 shrink-0 animate-pulse" />
                <span>{isAr ? "توجيهات الإفراج الجمركي بميناء الإسكندرية" : "Alex Customs Compliance Policy"}</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed font-light font-sans">
                {isAr 
                  ? "تخضع الإعفاءات لتدقيق مزدوج ورصين بساحة المعاينة. نوصي بتجهيز كافة شهادات الإقامة وجوازات السفر وفواتير شراء بلد المولد مصادقاً عليها من سفارة مصر بتلك الدولة لضمان تسيير المعاملة فوراً."
                  : "All customs exemption quotas undergo dual audits in the quarantine dock. Clients must ensure consulate seals are present over basic bills of lading and purchase certificates physically."}
              </p>
              <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/80 text-[10px] text-amber-300 font-semibold leading-relaxed">
                👉 {isAr 
                  ? "مكتب أ/ إسلام محمد يوفر تمثيلاً رسمياً أمام لجان التفتيش والنزاعات وتثمين الطرود لتلافي الغرامات جماركياً." 
                  : "We offer professional representation fronting dispute boards and weight assessment bodies to avoid fines."
                }
              </div>
            </div>
          </div>
        </div>
      )}

      {activeSubTab === "faq" && (
        <div className="space-y-4" dir={isAr ? "rtl" : "ltr"}>
          <div className="bg-white rounded-2xl border border-gray-150 p-5 shadow-3xs grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            
            <div className="md:col-span-8 space-y-2">
              <h3 className="font-black text-sm text-gray-950">
                {isAr ? "هل تحتاج لمساعدة في تحديد البند والشريحة المناسبة؟" : "Struggling to find the right HS Code tariff category?"}
              </h3>
              <p className="text-xs text-gray-550 leading-relaxed">
                {isAr 
                  ? "بعض السلع مجهولة ومؤلفة جمركياً من مواد متعددة (كالزجاج مع البلاستيك) ويسمى ذلك بمشكلة التعارض في التبويب. مستشارك الجمركي بميناء الإسكندرية جاهز للرد وحل الإشكالية فوراً."
                  : "Complex commodities composed of mixed elements (e.g. glassware with polymer moldings) face classification issues. Our port expert handles representational duties dynamically."}
              </p>
            </div>

            <div className="md:col-span-4 flex justify-end">
              <a 
                href="https://wa.me/201274833844" 
                target="_blank" 
                rel="noreferrer"
                className="bg-[#25D366] hover:bg-[#20ba5a] text-white font-extrabold text-xs px-4 py-3 rounded-xl flex items-center gap-2 cursor-pointer shadow-3xs w-full justify-center md:w-auto transition-all"
              >
                <HelpCircle className="h-4 w-4" />
                <span>{isAr ? "اسأل أستاذ إسلام جمرك" : "Consult Mr. Eslam Directly"}</span>
              </a>
            </div>

          </div>

          {/* General customs FAQ database */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {GENERAL_CUSTOMS_FAQ.map((faq, idx) => {
              return (
                <div key={idx} className="bg-white rounded-2xl border border-gray-150 p-5 space-y-3 hover:border-emerald-300 transition-colors shadow-3xs">
                  <div className="flex items-start gap-2.5">
                    <HelpCircle className="h-4 w-4 text-emerald-600 mt-0.5 shrink-0" />
                    <h4 className="font-black text-xs md:text-sm text-gray-950 leading-snug">
                      {isAr ? faq.qAr : faq.qEn}
                    </h4>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed pl-6 font-sans font-light">
                    {isAr ? faq.aAr : faq.aEn}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

    </motion.div>
  );
}
