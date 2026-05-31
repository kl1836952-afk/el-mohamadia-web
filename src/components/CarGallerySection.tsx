import React from "react";
import { CustomsService, EngineType, OriginType } from "../types";
import { ArrowLeftRight, CheckCircle2, Heart, Scale, Sparkles } from "lucide-react";

// Precise paths to generated images in workspace
const EXPATRIATE_CAR_IMG = "/src/assets/images/expatriate_car_1779920809779.png";
const ELECTRIC_CAR_IMG = "/src/assets/images/electric_car_1779920827554.png";
const TRIPTYQUE_CAR_IMG = "/src/assets/images/triptyque_car_1779920849244.png";

interface Props {
  lang: "ar" | "en";
  onSelectCarForCalculation: (carParams: {
    service: CustomsService;
    engineCc: number;
    engineType: EngineType;
    origin: OriginType;
    carValueEgp: number;
    carNameAr: string;
    carNameEn: string;
  }) => void;
}

export default function CarGallerySection({ lang, onSelectCarForCalculation }: Props) {
  const isAr = lang === "ar";

  // Recommended popular import cars under Egyptian regulations
  const featuredCars = [
    {
      id: "expat-suv",
      nameAr: "تويوتا لاند كروزر / كيا سبورتاج (دفع رباعي)",
      nameEn: "Toyota Land Cruiser / Kia Sportage (SUV)",
      image: EXPATRIATE_CAR_IMG,
      service: CustomsService.ExpatriateInitiative,
      cc: 1600,
      engineType: EngineType.Petrol,
      origin: OriginType.Standard,
      valueEgp: 950000,
      tagsAr: ["مبادرة المغتربين", "وديعة مستردة"],
      tagsEn: ["Expatriate Scheme", "Refundable Deposit"],
      benefitAr: "إعفاء 100% من الضرائب والجمارك مقابل وديعة دولارية تسترد بالكامل بالجنيه بعد 5 سنوات.",
      benefitEn: "100% tax and duty waiver in exchange of a 5-year refundable dollar bank deposit.",
      highlightAr: "تحت المعالجة الجمركية الممتازة بموجب مبادرة المغتربين",
      highlightEn: "Processed under direct MoF Expatriate legal framework"
    },
    {
      id: "electric-ev",
      nameAr: "تسلا موديل 3 / فولكس فاجن ID4 (كهربائية بالكامل)",
      nameEn: "Tesla Model 3 / VW ID.4 (Premium EV)",
      image: ELECTRIC_CAR_IMG,
      service: CustomsService.FirstOwner,
      cc: 1400, // Electric has low base size simulation
      engineType: EngineType.Electric,
      origin: OriginType.European,
      valueEgp: 1400000,
      tagsAr: ["مالك أول زيرو", "0% جمارك"],
      tagsEn: ["First Owner Zero", "0% Customs Duty"],
      benefitAr: "تعتبر السيارات الكهربائية معفاة تماماً من الرسوم الجمركية في الجمارك المصرية وضريبتها مخفضة للثمن.",
      benefitEn: "Electric Vehicles enjoy total (0%) tariff customs holiday under active Egyptian port decrees.",
      highlightAr: "معفاة بالكامل من التعريفة - تدفع فقط ضريبة الجدول ورسم تنمية",
      highlightEn: "Fully custom-exempt. Subject only to VAT & minor development fee"
    },
    {
      id: "triptyque-mercedes",
      nameAr: "مرسيدس بنز سي كلاس C200 / بي إم دبليو الفئة الخامسة",
      nameEn: "Mercedes Benz C200 / BMW 5-Series",
      image: TRIPTYQUE_CAR_IMG,
      service: CustomsService.Triptyque,
      cc: 1500,
      engineType: EngineType.Petrol,
      origin: OriginType.European,
      valueEgp: 1800000,
      tagsAr: ["إفراج مؤقت", "دفتر تربيتيك الدولي"],
      tagsEn: ["Temporary Entry", "International Triptyque Book"],
      benefitAr: "دخول مؤقت للبلاد (عادة 3 إلى 6 أشهر) بسيارات ذات لوحات للمغتربين دون دفع جمارك كاملة.",
      benefitEn: "Enter Egypt temporarily (3-6 months) under international triptyque book, zero customs.",
      highlightAr: "تنزيل دفاتر المرور لنوادي السيارات الدولية بالتنسيق المباشر",
      highlightEn: "Structured international motor notebook clearances"
    }
  ];

  return (
    <div className="space-y-6">
      
      {/* Title block */}
      <div className="flex items-center justify-between border-b border-gray-200 pb-4">
        <div>
          <h3 className="text-xl md:text-2xl font-black text-gray-900 flex items-center gap-2">
            <span className="p-1.5 bg-emerald-100 text-emerald-800 rounded-lg">🚘</span>
            <span>{isAr ? "معرض نماذج السيارات الأكثر استيراداً" : "Most Imported Car Categories Showcase"}</span>
          </h3>
          <p className="text-xs text-gray-500 mt-1">
            {isAr 
              ? "تفقد تصنيفات السيارات الشهيرة في ميناء الإسكندرية، واحسب رسومها جمركياً أو قدم أوراقك بنقرة واحدة" 
              : "Discover prominent imported vehicles clearing Alexandria port. Click to auto-simulate their customs."}
          </p>
        </div>

        <span className="hidden md:inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 py-1.5 px-3 rounded-lg text-xs font-bold">
          <Sparkles className="h-3.5 w-3.5 animate-pulse" />
          {isAr ? "تحديث القرارات لعام 2026" : "Rules updated for 2026"}
        </span>
      </div>

      {/* Grid container */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {featuredCars.map((car) => {
          return (
            <div 
              key={car.id} 
              className="bg-white rounded-2xl border border-gray-150 hover:border-emerald-300 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group flex flex-col justify-between"
            >
              {/* Image preview with smooth hover effect */}
              <div className="relative h-56 w-full overflow-hidden bg-slate-100">
                <img 
                  src={car.image} 
                  alt={isAr ? car.nameAr : car.nameEn} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                
                {/* Visual badges over the image */}
                <div className="absolute top-3 inset-x-3 flex items-center justify-between pointer-events-none">
                  <div className="flex flex-wrap gap-1">
                    {(isAr ? car.tagsAr : car.tagsEn).map((tag, i) => (
                      <span key={i} className="bg-emerald-950/95 backdrop-blur-xs text-white text-[10px] font-black px-2.5 py-1 rounded-md border border-emerald-700">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-xs text-emerald-955 text-[10px] font-extrabold px-2.5 py-1 rounded-md shadow-sm">
                  {car.cc === 1400 ? "0 CC (Electric)" : `${car.cc} CC`}
                </div>
              </div>

              {/* Body Details */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                
                <div className="space-y-2">
                  <h4 className="font-extrabold text-sm text-gray-900 tracking-tight leading-tight group-hover:text-emerald-800 transition-colors">
                    {isAr ? car.nameAr : car.nameEn}
                  </h4>
                  
                  <div className="text-[11px] text-emerald-805 bg-emerald-50 border border-emerald-100 p-2.5 rounded-xl font-medium leading-relaxed">
                    {isAr ? car.highlightAr : car.highlightEn}
                  </div>

                  <p className="text-xs text-gray-500 leading-relaxed font-sans font-light">
                    {isAr ? car.benefitAr : car.benefitEn}
                  </p>
                </div>

                {/* Integration Controls */}
                <div className="space-y-2 pt-2 border-t border-gray-100">
                  <button
                    onClick={() => onSelectCarForCalculation({
                      service: car.service,
                      engineCc: car.cc,
                      engineType: car.engineType,
                      origin: car.origin,
                      carValueEgp: car.valueEgp,
                      carNameAr: car.nameAr,
                      carNameEn: car.nameEn
                    })}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-2.5 px-4 rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
                  >
                    <ArrowLeftRight className="h-3.5 w-3.5" />
                    <span>{isAr ? "احسب جمارك الفئة فورا" : "Calculate Customs Immediately"}</span>
                  </button>
                  
                  <div className="text-center">
                    <span className="text-[10px] font-mono text-gray-400">
                      {isAr ? "تخمين تقريبي استرشادي" : "Based on Egyptian harbor guidelines"}
                    </span>
                  </div>
                </div>

              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
