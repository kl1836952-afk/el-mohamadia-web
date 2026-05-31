import React, { useState } from "react";
import { Ship, ArrowDownCircle, ArrowUpCircle, FileCheck, FileCode, CheckCircle2, ShieldCheck, HelpCircle, FileText, ArrowRightCircle, Anchor } from "lucide-react";

interface Props {
  lang: "ar" | "en";
  setActiveTab: (tab: "home" | "calculator" | "chat" | "tracker" | "booking") => void;
}

export default function ImportExportSection({ lang, setActiveTab }: Props) {
  const isAr = lang === "ar";
  const [activeSubTab, setActiveSubTab] = useState<"import" | "export">("import");

  const importDocs = [
    { titleAr: "بوليصة الشحن الأصلية (B/L)", titleEn: "Original Bill of Lading (B/L)", required: true },
    { titleAr: "الفاتورة التجارية التفصيلية الموثقة", titleEn: "Commercial Invoice (Attested)", required: true },
    { titleAr: "شهادة المنشأ الرسمية (يورو 1 أو جـ1)", titleEn: "Certificate of Origin (Euro-1 / CO)", required: true },
    { titleAr: "كشف التعبئة المفصل للبضائع", titleEn: "Detailed Packing List", required: true },
    { titleAr: "موافقة الاستيراد أو الرقم الإحصائي (ACID)", titleEn: "ACID Cargo Registration (Nafeza)", required: true },
    { titleAr: "التوكيل الملاحي الإلكتروني الموجه لشركتنا", titleEn: "Delivery Order (D/O) Delegation via Nafeza", required: true }
  ];

  const exportDocs = [
    { titleAr: "الفاتورة التصديرية الرسمية المعتمدة", titleEn: "Commercial Export Invoice", required: true },
    { titleAr: "كشف بيان التعبئة والأوزان", titleEn: "Weight & Packing List", required: true },
    { titleAr: "شهادة المنشأ الصادرة من الغرفة التجارية", titleEn: "Chamber of Commerce Origin Certificate", required: true },
    { titleAr: "الشهادات الصحية أو الزراعية (للمنتجات الغذائية)", titleEn: "Phytosanitary/Health Certificate (Agri)", required: false },
    { titleAr: "موافقة الهيئة العامة للرقابة على الصادرات والواردات", titleEn: "GOEIC Export Control Authorization", required: true },
    { titleAr: "شهادة اليورو 1 للتصدير للاتحاد الأوروبي", titleEn: "Euro-1 Export Certificate Setup", required: false }
  ];

  const importSteps = [
    {
      num: "01",
      titleAr: "التسجيل المسبق على منصة نافذة (ACID)",
      titleEn: "Pre-arrival ACID Code Generation",
      descAr: "يقوم المستورد الأجنبي أو المصري برفع بيانات الشحن قبل تحركها بـ 48 ساعة للحصول على كود الشحنة الموحد لمنع ركود الموانئ.",
      descEn: "Submitting preliminary commercial drafts via Egypt's Nafeza single window network."
    },
    {
      num: "02",
      titleAr: "مراجعة المستندات مع مندوب المحمدية",
      titleEn: "Document Audit with Al-Muhammadiyah",
      descAr: "نفحص بدقة جميع الفواتير ومطابقة شهادات اليورو 1 لضمان زيرو جمارك وتجنب أي غرامات تأخير أو تعديل للوائح بالمرفق.",
      descEn: "We thoroughly audit origin letters to secure zero-customs EU exemptions and prevent delays."
    },
    {
      num: "03",
      titleAr: "الحاويات بالفحص الجمركي والمعاينة الفنية",
      titleEn: "Physical Committee Assessment",
      descAr: "حضور طاقم التخليص بالتنسيق مع مهندس المعاينة لمطابقة الشاسيه، المقاسات، والوزن وتنزيل القيمة المقدرة بدقة.",
      descEn: "Accompanying official customs inspectors to matches weights, specifications and values."
    },
    {
      num: "04",
      titleAr: "توريد الرسوم وإصدار إذن التسليم والخروج",
      titleEn: "Duty Settlement & Port Gating Release",
      descAr: "توريد الضرائب (أو إيصال الوديعة للمغتربين) بالبنك، وتفقد الحاويات واستخراج تصاريح البوابة وخروج آمن للوجهة.",
      descEn: "Settling official duties, printing official release logs and shipping to the final destination safely."
    }
  ];

  const exportSteps = [
    {
      num: "01",
      titleAr: "تجهيز الشحنة وحجز الحاوية الفارغة",
      titleEn: "Booking Containers & Pre-Carriage",
      descAr: "نقوم بحجز الحاويات المناسبة (ريفر مبرد للحاصلات، جاف للبضائع) من الخطوط الملاحية بميناء الإسكندرية وسحبها للمصنع فوراً.",
      descEn: "Requesting empty containers (reefers/dry) directly from Maersk, MSC, etc., and inland transport."
    },
    {
      num: "02",
      titleAr: "التبخير ومطابقة المواصفات الدولية",
      titleEn: "Fumigation & Custom Quality Checks",
      descAr: "للحاصلات والأخشاب، نشرف على عمليات التبخير والشهادة الفنية الزراعية لضمان مطابقة الشحنة للمواصفات الصحية للبلد المستورد.",
      descEn: "Managing professional container fumigation, health passes to ensure frictionless foreign harbor entry."
    },
    {
      num: "03",
      titleAr: "إنشاء الشهادة الجمركية الموحدة للتصدير",
      titleEn: "Export Customs Declaration Setup",
      descAr: "تنسيق فواتير الصادرات وإقرار التصدير، والمطابقة بساحة شحن الصادر وتسهيل خروج الحاويات من رصيف الشحن البحري.",
      descEn: "Finalizing custom books, export declaration values, and loading containers securely onto transit vessels."
    },
    {
      num: "04",
      titleAr: "الشحن وإرسال بوالص الشحن والأوراق للعميل",
      titleEn: "Sailing & Docs Despatch",
      descAr: "إصدار بوالص الشحن الأصلية وسرعة إرسالها إلكترونياً وبطرق آمنة لتسهيل استعلام واستلام الطرف المستورد الأجنبي للشحنة.",
      descEn: "Issuing original B/L sheets, sending them safely to buyers overseas to allow painless release."
    }
  ];

  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-150 shadow-md space-y-6">
      
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-gray-150">
        <div>
          <span className="text-xs font-black uppercase text-emerald-700 tracking-wider flex items-center gap-1">
            <Anchor className="h-4.5 w-4.5 text-amber-500" />
            {isAr ? "دائرة الاستيراد والتصدير العالمية" : "Global Import/Export Logistics Division"}
          </span>
          <h2 className="text-xl md:text-2xl font-black text-gray-950 mt-1 font-sans">
            {isAr ? "قسم عمليات الوارد والصادر الموحد" : "Unified Inbound & Outbound Customs Division"}
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            {isAr 
              ? "نعمل على مدار الساعة بموانئ مصر (البحرية، الجوية، والبرية) لتيسير تدفق تجارتكم وإنهاء المعاملات الاستيرادية والتصديرية" 
              : "Working round the clock inside all Egyptian sea, air, and dry ports protecting your commerce."}
          </p>
        </div>

        {/* Sub-tabs buttons */}
        <div className="flex items-center gap-1 bg-slate-100 p-1.5 rounded-xl border border-gray-200">
          <button
            onClick={() => setActiveSubTab("import")}
            className={`px-4 py-2 rounded-lg cursor-pointer text-xs font-extrabold flex items-center gap-2 transition-all ${
              activeSubTab === "import" 
                ? "bg-emerald-950 text-amber-300 shadow-sm" 
                : "text-gray-600 hover:text-emerald-900"
            }`}
          >
            <ArrowDownCircle className="h-4 w-4" />
            <span>{isAr ? "قسم الشحنات الواردة" : "Inbound Imports"}</span>
          </button>
          
          <button
            onClick={() => setActiveSubTab("export")}
            className={`px-4 py-2 rounded-lg cursor-pointer text-xs font-extrabold flex items-center gap-2 transition-all ${
              activeSubTab === "export" 
                ? "bg-emerald-950 text-amber-300 shadow-sm" 
                : "text-gray-600 hover:text-emerald-900"
            }`}
          >
            <ArrowUpCircle className="h-4 w-4" />
            <span>{isAr ? "قسم الشحنات الصادرة" : "Outbound Exports"}</span>
          </button>
        </div>
      </div>

      {/* Dynamic Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Left Col: Step by step operational guide (8 cols) */}
        <div className="lg:col-span-8 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <h3 className="font-extrabold text-sm text-gray-900 flex items-center gap-1.5 uppercase">
              <span className="h-2 w-2 rounded-full bg-emerald-600" />
              {activeSubTab === "import" 
                ? (isAr ? "دليل ومراحل التخليص الجمركي للوارد بالميناء" : "Inbound Port Custom Clearance Steps")
                : (isAr ? "دليل ومراحل تجهيز وتصدير الشحنات والبضائع" : "Outbound Cargo Prep & Export Flow")
              }
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {(activeSubTab === "import" ? importSteps : exportSteps).map((step, idx) => (
                <div key={idx} className="bg-slate-50 border border-slate-150 p-5 rounded-2xl hover:border-emerald-300 transition-all flex items-start gap-4">
                  <div className="h-10 w-10 font-mono font-black text-sm bg-emerald-950 text-amber-300 rounded-xl flex items-center justify-center shrink-0 shadow-sm">
                    {step.num}
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-bold text-xs text-gray-900 leading-tight">
                      {isAr ? step.titleAr : step.titleEn}
                    </h4>
                    <p className="text-[11px] text-gray-500 leading-relaxed font-sans">
                      {isAr ? step.descAr : step.descEn}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick CTA banner */}
          <div className="bg-emerald-950 text-white rounded-2xl p-5 border border-emerald-900 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-right">
              <h4 className="font-bold text-xs text-amber-300">
                {activeSubTab === "import"
                  ? (isAr ? "هل لديك بضائع أو سيارة تريد استيرادها؟" : "Incoming vehicle or industrial cargo waiting?")
                  : (isAr ? "ترغب في حجز حاويات وتصديـر منتجاتك؟" : "Planning outbound shipping to global ports?")
                }
              </h4>
              <p className="text-[10px] text-emerald-200">
                {isAr 
                  ? "تواصل لإرسال الفواتير وأوراق الفحص للشاسيه مجاناً لنطابق لك الأكواد فوراً."
                  : "We offer zero-tariff audits on agricultural/textile certificates. Secure your quota now."}
              </p>
            </div>

            <button
              onClick={() => setActiveTab("booking")}
              className="bg-amber-400 hover:bg-amber-300 text-emerald-955 font-black text-xs py-2.5 px-4 rounded-xl transition-all whitespace-nowrap cursor-pointer shadow-xs"
            >
              {isAr ? "تقديم مستندات التخليص 📞" : "Apply representation files 📞"}
            </button>
          </div>
        </div>

        {/* Right Col: Required Documents Checklist (4 cols) */}
        <div className="lg:col-span-4 bg-slate-50 border border-slate-150 p-6 rounded-3xl flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="space-y-1">
              <h4 className="font-extrabold text-xs text-gray-950 flex items-center gap-1.5 uppercase">
                <FileText className="h-4.5 w-4.5 text-emerald-700" />
                {isAr ? "المستندات الجمركية المطلوبة" : "Required Port Documents"}
              </h4>
              <p className="text-[10px] text-gray-400 leading-normal">
                {isAr 
                  ? "تأمين هذه المستندات يسرع التخليص ويحميك من غرامة الأرضيات بميناء الإسكندرية." 
                  : "Keep these safe to bypass port penalty. Attestation ensures maximum safety."}
              </p>
            </div>

            <div className="space-y-2.5">
              {(activeSubTab === "import" ? importDocs : exportDocs).map((doc, idx) => (
                <div key={idx} className="flex items-start gap-2.5 bg-white p-3 rounded-xl border border-gray-100 shadow-2xs">
                  <span className="h-5 w-5 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-750 font-bold shrink-0 text-[10px]">
                    ✓
                  </span>
                  <div>
                    <span className="block font-bold text-[11px] text-gray-900 leading-tight">
                      {isAr ? doc.titleAr : doc.titleEn}
                    </span>
                    <span className="text-[9px] text-gray-400 uppercase font-black tracking-wider">
                      {doc.required ? (isAr ? "إلزامي أساسي" : "Mandatory") : (isAr ? "إذا توفر" : "Optional Entry")}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Guarantee stamp */}
          <div className="bg-emerald-50 border border-emerald-100 p-3 rounded-xl flex items-center gap-3">
            <ShieldCheck className="h-8 w-8 text-emerald-700 shrink-0" />
            <div className="space-y-0.5">
              <h5 className="font-bold text-[10.5px] text-emerald-950 leading-tight">
                {isAr ? "ضمان المحمدية الكامل" : "Al-Muhammadiyah Security"}
              </h5>
              <p className="text-[9px] text-emerald-750">
                {isAr 
                  ? "نضمن سرية مستنداتك وتجنيبك رسوم الاحتكار الموانئ بنسبة 100%."
                  : "We safeguard client proprietary lists and avoid demurrage fines."}
              </p>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
