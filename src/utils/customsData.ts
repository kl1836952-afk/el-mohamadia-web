import { 
  EngineType, 
  OriginType, 
  CustomsService, 
  StepStatus, 
  TrackingRecord, 
  CalculationResult 
} from "../types";

// Generates steps for tracking
export const generateTrackingSteps = (currentStatus: StepStatus, withDates: boolean = true): any[] => {
  const stepsDef = [
    {
      status: StepStatus.DocumentReview,
      labelAr: "مراجعة المستندات وتجهيز الملف",
      labelEn: "Document Review & File Prep",
      descriptionAr: "فحص الفواتير، بوليصة الشحن، شهادة المنشأ وصحة التوكيلات وتعبئة نموذج المعاينة جمركياً.",
      descriptionEn: "Reviewing invoices, bill of lading, certificate of origin and prepping cargo manifest papers."
    },
    {
      status: StepStatus.ArrivalAtTerminal,
      labelAr: "وصول الشحنة لساحة الجمارك",
      labelEn: "Cargo Arrival at Terminal",
      descriptionAr: "دخول السيارة أو الحاوية وتوزيعها على ساحة شركة الإسكندرية لتداول الحاويات للبدء بالكشف.",
      descriptionEn: "Vehicle or container entered customs terminal and assigned to inspection yard."
    },
    {
      status: StepStatus.PhysicalInspection,
      labelAr: "المعاينة الفنية والكشف الفيزيائي",
      labelEn: "Physical Inspection & Valuation",
      descriptionAr: "كشف الصادر والوارد مع لجنة فحص المرور للمطابقة برقم الشاسيه والموتور والمواصفات.",
      descriptionEn: "Physical inspection of cargo/chassis, engine size matching and customs valuation committee."
    },
    {
      status: StepStatus.CustomsDutyInvoice,
      labelAr: "إصدار كشف الرسوم والجمارك (العرض)",
      labelEn: "Customs Duty Valuation Invoice",
      descriptionAr: "تحديد القيمة الجمركية المقبولة وربط الضرائب والرسوم وإصدار معاملة السداد البنكي.",
      descriptionEn: "Determining customs base value, setting taxes, and emitting the formal government payment invoice."
    },
    {
      status: StepStatus.PaymentVerified,
      labelAr: "تأكيد الدفع والتخليص المالي",
      labelEn: "Payment Verified & Financial Clearance",
      descriptionAr: "تاكيد التحويل وصرف الوديعة أو توريد الرسوم بالخزانة الجمركية واستلام إشعار الدفع النهائي.",
      descriptionEn: "Verifying payment of customs invoice/refundable USD deposit at Central Bank and issuing clearance."
    },
    {
      status: StepStatus.GateRelease,
      labelAr: "الإفراج النهائي وخروج البوابة",
      labelEn: "Gate Release & Delivery",
      descriptionAr: "إنهاء أوراق الخروج، وتجاوز بوابة ميناء الإسكندرية والتسليم النهائي للمالك أو النقل.",
      descriptionEn: "Completing final port pass, crossing the exit gates and heading safely for delivery to client."
    }
  ];

  let currentFound = false;
  return stepsDef.map((step, idx) => {
    // Determine state
    let completed = false;
    let current = false;

    if (step.status === currentStatus) {
      completed = true;
      current = true;
      currentFound = true;
    } else if (!currentFound) {
      completed = true;
    }

    // Set mock historical dates relative to past days
    let date = "";
    if (withDates && completed) {
      const daysAgo = stepsDef.length - 1 - idx;
      const d = new Date();
      d.setDate(d.getDate() - (daysAgo * 2) - 1);
      date = d.toLocaleDateString("ar-EG", { year: "numeric", month: "short", day: "numeric" });
    }

    return {
      ...step,
      completed,
      current,
      date
    };
  });
};

// Demo Tracking Databases preloaded for Alexandria Port clients
export const PRELOADED_TRACKING: Record<string, TrackingRecord> = {
  "ALM-7301": {
    id: "ALM-7301",
    clientName: "أحمد عبد الله الجابري",
    phone: "01023456789",
    service: CustomsService.ExpatriateInitiative,
    cargoDescription: "سيارة مرسيدس Mercedes C200 موديل 2023 - وارد ألمانيا",
    creationDate: "2026-05-18",
    lastUpdated: "2026-05-25",
    steps: generateTrackingSteps(StepStatus.PaymentVerified),
    additionalNotesAr: "المبادرة معفاة جمركياً بالكامل بموجب قرار وزارة المالية. الوديعة الدولارية تم إيداعها بالبنك المركزي وتأكيد الإيصال بنجاح. يجرى استلام إفراج غرامة الهيئة والطباعة.",
    additionalNotesEn: "Highly exempt initiative under MoF guidelines. Dollar deposit is fully submitted at the Central Bank and verified. Currently printing the final authority clearance report."
  },
  "ALM-5490": {
    id: "ALM-5490",
    clientName: "م. محمد حاتم السالم",
    phone: "01238491024",
    service: CustomsService.Triptyque,
    cargoDescription: "سيارة تويوتا لاندكروزر Toyota Land Cruiser 2021 - تربتك السعودية",
    creationDate: "2026-05-22",
    lastUpdated: "2026-05-26",
    steps: generateTrackingSteps(StepStatus.ArrivalAtTerminal),
    additionalNotesAr: "تم دخول الميناء واستلام الدفتر الجمركي للتربيتك. بانتظار إشعار ساحة الفحص للمطابقة الأمنية للشاسيه والموتور وصرف رخص القيادة المؤقتة.",
    additionalNotesEn: "Entered Alexandria port and triptyque booklet inspected. Waiting for the physical security matching for chassis/engine to dispatch temporary driving tags."
  },
  "ALM-9224": {
    id: "ALM-9224",
    clientName: "الشركة المصرية للمحركات والمعدات",
    phone: "01149830200",
    service: CustomsService.GeneralCargo,
    cargoDescription: "حاوية كاملة 40 قدم - قطع غيار محركات وسيارات كهربائية وارد إيطاليا",
    creationDate: "2026-05-26",
    lastUpdated: "2026-05-27",
    steps: generateTrackingSteps(StepStatus.DocumentReview),
    additionalNotesAr: "تم سحب إذن الشحن ومراجعة الفاتورة التجارية الموثقة مصنعياً وشهادة اليورو 1. جاري الرفع لرمز الفحص الموحد للمطابقة الصناعية الصادرة.",
    additionalNotesEn: "Verified validated manufacturer bills and Euro-1 document. Prepping unified regulatory upload with technical authorities."
  },
  "ALM-1340": {
    id: "ALM-1340",
    clientName: "الملحق الدبلوماسي بالقنصلية الإيطالية",
    phone: "01284920485",
    service: CustomsService.DiplomaticRelease,
    cargoDescription: "سيارة رينج روفر Range Rover Hybrid 2024 - إيقاف دبلوماسي",
    creationDate: "2026-05-10",
    lastUpdated: "2026-05-24",
    steps: generateTrackingSteps(StepStatus.GateRelease),
    additionalNotesAr: "تم إتمام الإفراج الدبلوماسي المعفى بنسبة 100% واللوحات مخرجة. تسلم المندوب الخرائط الجغرافية والسيارة جاهزة في ساحة الخروج تماماً.",
    additionalNotesEn: "Completed all diplomat exemptions. Car released, keys and licenses handed to embassy delegate, gated and cleared outbound."
  }
};

// Advanced calculation mechanism matching Egyptian regulations
export const calculateCustoms = (params: {
  service: CustomsService;
  engineCc: number;
  engineType: EngineType;
  origin: OriginType;
  carValueEgp: number; // For standard calculations
  isExpatriateDiscount: boolean; // 30% or European zero custom
}): CalculationResult => {
  let estimatedCustomsTax = 0;
  let estimatedVat = 0;
  let estimatedDevelopmentFee = 0;
  let estimatedTableTax = 0;
  let estimatedClearanceCosts = 7500; // Base professional fee including cargo storage, validation, stamps

  const baseValue = params.carValueEgp || 800000; // default 800k Egp if not set ($16k USD roughly)

  if (params.service === CustomsService.ExpatriateInitiative) {
    // Under Expat initiative, the user deposits the cash into a 5-year USD deposit
    // Calculations for the deposit amount based on CC and Agreement:
    let depositValueUsd = 0;
    
    // Categorize by CC class
    if (params.engineCc <= 1600) {
      depositValueUsd = params.origin === OriginType.European ? 1200 : 3800;
      if (params.engineType === EngineType.Hybrid) depositValueUsd *= 0.8;
      if (params.engineType === EngineType.Electric) depositValueUsd *= 0.5;
    } else if (params.engineCc <= 2000) {
      depositValueUsd = params.origin === OriginType.European ? 3500 : 12500;
      if (params.engineType === EngineType.Hybrid) depositValueUsd *= 0.85;
      if (params.engineType === EngineType.Electric) depositValueUsd *= 0.6;
    } else {
      depositValueUsd = params.origin === OriginType.European ? 8500 : 32000;
      if (params.engineType === EngineType.Hybrid) depositValueUsd *= 0.85;
      if (params.engineType === EngineType.Electric) depositValueUsd *= 0.7;
    }

    const exchangeRate = 48.0; // Standard USD to EGP
    const estimatedDepositEgp = depositValueUsd * exchangeRate;
    
    return {
      estimatedCustomsTax: params.origin === OriginType.European ? 0 : estimatedDepositEgp * 0.5,
      estimatedVat: estimatedDepositEgp * 0.14,
      estimatedDevelopmentFee: estimatedDepositEgp * 0.03,
      estimatedTableTax: estimatedDepositEgp * 0.05,
      estimatedClearanceCosts: params.engineCc > 2000 ? 12000 : 8500,
      totalRequirements: estimatedDepositEgp,
      usdEquivalent: depositValueUsd,
      depositValueUsd: depositValueUsd,
      notesAr: [
        `سيارة معافاة تماماً من الضرائب والجمارك بموجب مبادرة المغتربين مقابل وديعة دولارية قيمتها $${depositValueUsd.toLocaleString()} دولار أمريكي تودع بالبنك المركزي المصري لمستحق المبادرة.`,
        "الوديعة مستردة بالكامل بعد 5 سنوات بالجنيه المصري بسعر الصرف الرسمي المعلن وقت رد الوديعة.",
        "الرسوم الإدارية لشركة التخليص تشمل كافة الإقرارات وتخليص المستندات وسحب السيارة من ساحة الفحص بميناء الإسكندرية."
      ],
      notesEn: [
        `Completely tax-free under expatriate scheme in return of a refundable deposit of $${depositValueUsd.toLocaleString()} USD into the Central Bank of Egypt.`,
        "The deposit is fully returned after 5 years in Egyptian Pounds matching the official exchange rate at date of refund.",
        "Customs clearance agency files prep and logistics inside Alexandria Port are managed in full package."
      ]
    };
  }

  // 1. Determine base customs rate based on Engine capacity & Origin for standard imports
  let customsRate = 0.40; // Default under 1600cc (40% customs)
  let tableTaxRate = 0.01; // 1% table tax
  let developmentRate = 0.03; // 3% development

  if (params.engineCc <= 1600) {
    customsRate = 0.40;
    tableTaxRate = 0.01;
    developmentRate = 0.03;
  } else if (params.engineCc <= 2000) {
    customsRate = 1.35;
    tableTaxRate = 0.15;
    developmentRate = 0.05;
  } else {
    customsRate = 1.35;
    tableTaxRate = 0.30;
    developmentRate = 0.085;
  }

  // Apply zero customs for European origin
  if (params.origin === OriginType.European) {
    customsRate = 0.0; // European Partnership gets 0% customs!
  }

  // Exemptions for electric vehicles
  if (params.engineType === EngineType.Electric) {
    customsRate = 0.0;
    tableTaxRate = 0.0;
    developmentRate = 0.02; // Very low development fee
  }

  // Exemptions for hybrid vehicles
  if (params.engineType === EngineType.Hybrid) {
    customsRate *= 0.70; // 30% reduction on customs tariff
  }

  // Calculate fees sequentially
  estimatedCustomsTax = baseValue * customsRate;
  
  // Table tax applies to base value + customs duty
  estimatedTableTax = (baseValue + estimatedCustomsTax) * tableTaxRate;
  
  // VAT applies to (base value + customs duty + table tax)
  estimatedVat = (baseValue + estimatedCustomsTax + estimatedTableTax) * 0.14;
  
  // Development fee applies to (base value + customs + table tax + VAT) * developmentRate
  estimatedDevelopmentFee = (baseValue + estimatedCustomsTax) * developmentRate;

  // Add premium/logistical variables based on CC
  if (params.engineCc > 2000) {
    estimatedClearanceCosts = 16000;
  } else if (params.engineCc > 1600) {
    estimatedClearanceCosts = 11000;
  }

  const totalRequirements = estimatedCustomsTax + estimatedVat + estimatedDevelopmentFee + estimatedTableTax + estimatedClearanceCosts;

  const notesAr: string[] = [];
  const notesEn: string[] = [];

  if (params.origin === OriginType.European) {
    notesAr.push("تخفيض اتفاقية الشراكة الأوروبية (زيرو جمارك) مطبق ومحسوب حالياً في تقديراتك.");
    notesEn.push("European Partnership agreement tariff discount (Zero customs) is applied in your values.");
  }
  if (params.engineType === EngineType.Electric) {
    notesAr.push("السيارات الكهربائية تتمتع بإعفاء جمركي كامل (0%) وتخضع فقط لضريبة القيمة المضافة.");
    notesEn.push("Electric Vehicles enjoy full customs waiver (0%) and only pay general VAT and minimal fees.");
  }
  notesAr.push("هذه القيمة الجمركية تقديرية وقابلة للتغيير طبقاً لتقرير لجنة تثمين السيارات جمركياً وقت صولها للميناء.");
  notesEn.push("This valuation calculation is estimated and subjective to the official evaluation committee at arrival day.");

  return {
    estimatedCustomsTax,
    estimatedVat,
    estimatedDevelopmentFee,
    estimatedTableTax,
    estimatedClearanceCosts,
    totalRequirements,
    notesAr,
    notesEn
  };
};
