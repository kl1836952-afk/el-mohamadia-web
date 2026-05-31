export interface TariffItem {
  id: string; // e.g. "8703.10"
  hsCode: string; // Harmonized System Code
  nameAr: string;
  nameEn: string;
  chapterAr: string;
  chapterEn: string;
  dutyRateAr: string;
  dutyRateEn: string;
  vatRate: number; // e.g. 14 for 14%
  devFee: number; // e.g. 3 for 3%
  tableTax?: number; // optional table tax
  agencyRequirementsAr: string;
  agencyRequirementsEn: string;
  descriptionAr: string;
  descriptionEn: string;
}

export interface CustomsExemptionRule {
  titleAr: string;
  titleEn: string;
  category: string;
  detailsAr: string[];
  detailsEn: string[];
}

export const CUSTOMS_EXEMPTIONS: CustomsExemptionRule[] = [
  {
    category: "expatriate",
    titleAr: "إعفاءات مبادرة سيارات المصريين بالخارج",
    titleEn: "Expatriate Car Initiative Benefits",
    detailsAr: [
      "معافاة بنسبة 100% من كافة الضرائب والرسوم الجمركية ورسم التنمية وضريبة القيمة المضافة.",
      "يشترط سداد وديعة دولارية بكامل قيمة الضرائب المستحقة لصالح وزارة المالية المصرية، وتسترد بالكامل بعد 5 سنوات بالجنيه المصري بسعر الصرف وقتها.",
      "يشترط وجود إقامة سارية في بلد الشحن وحساب مصرفي مفتوح مسبقاً قبل 3 أشهر."
    ],
    detailsEn: [
      "100% exemption from all customs duties, development fees, table tax, and VAT.",
      "Requires transfer of a dollar deposit equal to 100% of foreign taxes into Ministry of Finance accounts, refundable after 5 years in EGP.",
      "Requires valid overseas residency and a bank account active for at least 3 months in the source country."
    ]
  },
  {
    category: "commercial",
    titleAr: "البنود المعفاة ومطابقة اتفاقية الشراكة المصرية الأوروبية (يورو 1)",
    titleEn: "Egyptian-EU Association (Euro-1) Exemptions",
    detailsAr: [
      "السيارات ذات المنشأ الأوروبي بالكامل تعفى بنسبة 100% من الفئة الجمركية الأساسية بموجب شهادة يورو 1 (EUR.1).",
      "لا تزال تخضع لضريبة القيمة المضافة 14% ورسم التنمية وضريبة الجدول حسب سعة المحرك الـ CC.",
      "يشترط شحن الشحنة مباشرة من دولة بالاتحاد الأوروبي ومرفق معها شهادة المنشأ الرسمية مصدقة إلكترونياً."
    ],
    detailsEn: [
      "Vehicles with verified European manufacturing origin are 100% exempt from base customs tariffs via EUR.1 certifications.",
      "Still subject to standard 14% VAT, development fees, and table tax proportional to engine displacement CC.",
      "Requires direct transport from an EU seaport to Alexandria, accompanied by standard audited origin papers."
    ]
  },
  {
    category: "disability",
    titleAr: "إعفاءات سيارات ذوي الهمم (المستفيدين طبيًا)",
    titleEn: "Differently-Abled (Disability Plan) Exemptions",
    detailsAr: [
      "إعفاء كامل من الضريبة الجمركية المقررة على السيارة بكافة سعات المحرك لغاية 1600CC.",
      "تعفى أيضاً من ضريبة القيمة المضافة أو تفرض بنسب رمزية مخفضة.",
      "يشترط صدور تقرير القومسيون الطبي العام للمستفيد يوضح أحقيته بقيادة تجهيز طبي خاص بمرافق أو بنفسه.",
      "حظر بيع أو التصرف بالسيارة قانوناً لمدة 5 سنوات من تاريخ الإفراج ما لم يتم دفع فروق الضرائب والجمارك."
    ],
    detailsEn: [
      "Total waiver of calculated customs duties for specialized adaptive layout vehicles under 1600CC.",
      "Partial and sometimes full relief from 14% VAT based on standard MoF decrees.",
      "Mandatory issuance of the Medical Commission's Certificate justifying physical compliance needs.",
      "Strict legal embargo on transferring ownership or selling the vehicle for 5 years unless customs differences are cleared."
    ]
  },
  {
    category: "commercial",
    titleAr: "إعفاءات الآلات الزراعية والسلع الاستراتيجية",
    titleEn: "Strategic Agritech & Essential waived commodities",
    detailsAr: [
      "معافاة تامة للجرارات والآلات الزراعية الحديثة بموجب قرارات تشجيع التصنيع والأمن الغذائي.",
      "القمح، دقيق الخبز، فول الصويا، واللحوم المجمدة غير المصنعة تتمتع برسوم جمركية 0% لدعم سلة الغذاء القومية.",
      "تخضع الأدوية الحيوية لرسم رمزي قدره 2% كضريبة جمركية موحدة تشجيعاً للمنظومة العلاجية لمصر."
    ],
    detailsEn: [
      "Fully waived customs for modern agricultural machinery and tractors to boost local farm yields.",
      "Strategic imports like wheat, grains, raw flour, and unprocessed frozen meat carry 0% tariffs to safeguard food storage security.",
      "Vital medicines and pharmacy items pay a uniform flat discount tier of 2% customs tax maximum."
    ]
  }
];

export const CUSTOMS_TARIFF_DATA: TariffItem[] = [
  // --- VEHICLES & TRANSPORTATION (Chapter 87) ---
  {
    id: "8703.11",
    hsCode: "8703.21.90",
    nameAr: "سيارات الركوب بمحرك بنزين سعة أقل من 1000 سي سي",
    nameEn: "Passenger motor cars, petrol engine < 1000 cc",
    chapterAr: "سيارات الركوب والنقل - فصل 87",
    chapterEn: "Vehicles & Transportation - Ch 87",
    dutyRateAr: "40%",
    dutyRateEn: "40%",
    vatRate: 14,
    devFee: 3,
    tableTax: 1,
    agencyRequirementsAr: "موافقة إدارة المرور بميناء الإسكندرية ومطابقة كشف الشاسيه، وشرط المالك الأول بالنسبة للمستعمل.",
    agencyRequirementsEn: "Alexandria Port Traffic authority clearance, chassis model validation, and strict primary owner proof for used cars.",
    descriptionAr: "سيارات المدينة الصغيرة جداً والموفرة للطاقة. تخضع لتعريفة جمركية أساسية 40% وضريبة جدول منخفضة 1%.",
    descriptionEn: "Highly fuel efficient micro-city cars. Subject to basic 40% tariff and 1% table tax."
  },
  {
    id: "8703.12",
    hsCode: "8703.22.90",
    nameAr: "سيارات الركوب بمحرك بنزين سعة من 1000 حتى 1600 سي سي",
    nameEn: "Passenger motor cars, petrol engine 1000cc - 1600cc",
    chapterAr: "سيارات الركوب والنقل - فصل 87",
    chapterEn: "Vehicles & Transportation - Ch 87",
    dutyRateAr: "40% (تُلغى بالكامل 0% للمنشأ الأوروبي EUR1)",
    dutyRateEn: "40% (Zero tariff if European origin EUR.1 is active)",
    vatRate: 14,
    devFee: 3,
    tableTax: 1,
    agencyRequirementsAr: "مطابقة رخص وسنة الصنع ومعاينة الكشف الجمركي بمجمع 40 سيارات بميناء الإسكندرية.",
    agencyRequirementsEn: "Compliance certificate matching year of model, physical inspection in Complex 40 at Alexandria harbor.",
    descriptionAr: "الفئة الأكثر شيوعاً واستخداماً في مصر مثل الكيا سيراو، هيونداي إلنترا وتويوتا كورولا. معفاة تماماً من الجمارك إذا شُحنت مباشرة من مصنع أوروبي وبمستند يورو 1.",
    descriptionEn: "The most widely imported vehicle class in Egypt (e.g. Kia, Hyundai, Toyota). Fully exempt from base customs with an authentic EUR.1 certificate."
  },
  {
    id: "8703.13",
    hsCode: "8703.23.90",
    nameAr: "سيارات الركوب بمحرك بنزين سعة من 1600 حتى 2000 سي سي",
    nameEn: "Passenger motor cars, petrol engine 1601cc - 2000cc",
    chapterAr: "سيارات الركوب والنقل - فصل 87",
    chapterEn: "Vehicles & Transportation - Ch 87",
    dutyRateAr: "135% (تُعفى للمنشأ الأوروبي EUR1)",
    dutyRateEn: "135% (Zero base tariff for European origin with EUR.1)",
    vatRate: 14,
    devFee: 5,
    tableTax: 15,
    agencyRequirementsAr: "لائحة الفحص الفني، مطابقة المحرك والسعة، وموافقة مصلحة غسيل الأموال للمستوردين التجاريين.",
    agencyRequirementsEn: "Displacement audits, motor displacement validation, AML compliance files for corporate trade licenses.",
    descriptionAr: "السيارات متوسطة وصالونات النخبة والرياضية الـ SUV. تبلغ التعريفة العادية 135% وضريبة الجدول ترتفع لغاية 15%، بينما يظل الجمرك الأساسي ملغياً للأوروبي.",
    descriptionEn: "Medium SUVs and performance luxury sedans. Standard duty is 135% with peak table tax at 15%. Base customs are fully waived under EU Partnership treaty."
  },
  {
    id: "8703.14",
    hsCode: "8703.24.90",
    nameAr: "سيارات الركوب بمحرك بنزين سعة تفوق 2000 سي سي",
    nameEn: "Passenger motor cars, petrol engine > 2000 cc",
    chapterAr: "سيارات الركوب والنقل - فصل 87",
    chapterEn: "Vehicles & Transportation - Ch 87",
    dutyRateAr: "135% (تُعفى للأوروبي EUR1)",
    dutyRateEn: "135% (Zero customs tariff for European origin EUR.1)",
    vatRate: 14,
    devFee: 8.5,
    tableTax: 30,
    agencyRequirementsAr: "موافقات أمنية وتدقيق رسم تنمية الموارد المرتفع 8.5%، واعتماد من اللجنة الفنية للمرور بميناء الدخول.",
    agencyRequirementsEn: "Security clearances, high resource development fee (8.5%) compliance checks, Port Traffic Technical Committee authorization.",
    descriptionAr: "سيارات الدفع كلي ضخمة، السيارات الرياضية الفارهة ومحركات V6/V8. يترتب عليها ضريبة جدول تبلغ 30% ورسم تنمية 8.5%، وتتمتع أيضاً بالإعفاء للأوروبي الأصلي كجمارك.",
    descriptionEn: "Top tier mega 4x4s, sport supercars and V6/V8 drivetrains. Subject to 30% table tax, 8.5% development fee, and Euro origin basic exemption."
  },
  {
    id: "8703.20",
    hsCode: "8703.80.00",
    nameAr: "السيارات الكهربائية بالكامل (صديقة للبيئة)",
    nameEn: "Fully Electric Passenger Vehicles (Green Tech)",
    chapterAr: "سيارات الركوب والنقل - فصل 87",
    chapterEn: "Vehicles & Transportation - Ch 87",
    dutyRateAr: "معفاة 100% (0% جمارك لكافة المولدات والمنشأ)",
    dutyRateEn: "0% Duty Rate (Fully customs free worldwide origin)",
    vatRate: 14,
    devFee: 0,
    tableTax: 0,
    agencyRequirementsAr: "شرط توفر شهادة فحص فني دولية، وتسمح اللائحة المصرية باستيرادها مستعملة بحد أقصى ٣ سنوات تالية لسنة الموديل.",
    agencyRequirementsEn: "International technical inspection checks, local decree tolerates importing used electric cars up to 3 models older.",
    descriptionAr: "سيارات الطاقة النظيفة مثل تسلا وبي واي دي الكهربائية المعفاة كلياً من الجمارك، ورغبة من الدولة في تعزيز استخدامها تم إعفاؤها من الجمارك ورسم التنمية وضريبة الجدول بالكامل.",
    descriptionEn: "Zero emission vehicles (e.g. Tesla, BYD EV). Fully exempt from primary customs, table tax, and development fees worldwide to boost green transit."
  },
  {
    id: "8703.30",
    hsCode: "8703.60.00",
    nameAr: "السيارات الهجينة (هايبرد - بنزين وكهرباء)",
    nameEn: "Hybrid Vehicles (Gasoline + Electric)",
    chapterAr: "سيارات الركوب والنقل - فصل 87",
    chapterEn: "Vehicles & Transportation - Ch 87",
    dutyRateAr: "تخضع لخصم جمركي يتراوح بين 30% لغاية 50% حسب فئة المحرك",
    dutyRateEn: "Entitled to 30% - 50% customs rate discounts based on engine tier",
    vatRate: 14,
    devFee: 3,
    tableTax: 10,
    agencyRequirementsAr: "إجراءات معاينة البطارية واحتساب سعة المحركين المشتركة، وتقديم فاتورة بيع وصنع معتمدة وموثقة.",
    agencyRequirementsEn: "Battery performance assessment, combined combustion and hybrid capacity audits, certified sales invoices and origin certificates.",
    descriptionAr: "السيارات التي تجمع بين البنزين ومحرك كهربائي مساعد. تخضع لفئة رسوم مخفضة نسبياً بالمقارنة مع فئة البنزين العادي لدعم البيئة.",
    descriptionEn: "Vehicles housing both an internal combustion engine and an electric drive. Subject to discounted intermediate rates relative to raw petrol models."
  },
  {
    id: "8708.10",
    hsCode: "8708.29.90",
    nameAr: "قطع غيار السيارات ومحركاتها والكماليات تفصيليًا",
    nameEn: "Automotive replacement spare parts, engines & accessories",
    chapterAr: "سيارات الركوب والنقل - فصل 87",
    chapterEn: "Vehicles & Transportation - Ch 87",
    dutyRateAr: "5% إلى 12% جمارك عادية برسم الوارد",
    dutyRateEn: "5% to 12% standard import duty",
    vatRate: 14,
    devFee: 1,
    agencyRequirementsAr: "موافقة مصلحة الرقابة الصناعية وهيئة الرقابة على الصادرات والواردات للتأكد من مواصفات الجودة المصرية والأمان للفلاتر والفرامل والسيور.",
    agencyRequirementsEn: "Egyptian Industrial Control Authority and GOEIC certifications to verify safety parameters for filter, brake paddings, and utility belts.",
    descriptionAr: "قطع غيار ميكانيكية وكهربائية مثل أجزاء الفرامل، المساعدين، والفلاتر. بعض أجزاء المحركات تخضع لرسم 5%، وبعض قطع التعليق والهياكل والكماليات تبلغ 12%.",
    descriptionEn: "Mechanical and electrical car parts like brakes, shock absorbers, and filters. Selected engine blocks pay 5%, while styling bodykits pay up to 12%."
  },

  // --- ELECTRONICS & COMPUTERS (Chapter 85) ---
  {
    id: "8517.11",
    hsCode: "8517.13.00",
    nameAr: "الهواتف المحمولة الذكية (موبايل وصنع يدوي)",
    nameEn: "Smart Mobile Phones & Cellular Gadgets",
    chapterAr: "أجهزة الاتصالات والصوتيات - فصل 85",
    chapterEn: "Telecoms, Sound & Electronics - Ch 85",
    dutyRateAr: "معفاة 0% من الجمرك الأساسي (بأمر مصلحة الجمارك المصرية)",
    dutyRateEn: "0% Basic Customs Duty (By decree of Egyptian Customs Authority)",
    vatRate: 14,
    devFee: 5,
    tableTax: 10,
    agencyRequirementsAr: "موافقة الجهاز القومي لتنظيم الاتصالات (NTRA) لاستيراد الأجهزة للتأكد من توافق نطاقات الموجات والشبكات المتاحة بمصر.",
    agencyRequirementsEn: "Mandatory approval from Egypt National Telecom Regulatory Authority (NTRA) to audit radio bands and compliance.",
    descriptionAr: "الهواتف الذكية معفاة حالياً من الضريبة الجمركية الواردة بنسبة 0% كشحنة أساسية، ولكن يُفرض عليها ضريبة جدول 10% ورسم تنمية بقيمة 5% ومصاريف موافقات الاتصالات الرقابية.",
    descriptionEn: "Smartphones are exempt from primary customs tariff (0%), but subject to 10% table tax, 5% development fee, and regulatory NTRA inspection costs."
  },
  {
    id: "8471.30",
    hsCode: "8471.30.00",
    nameAr: "أجهزة اللابتوب، الكمبيوتر المكتبي والآلات اللوحية التابلت",
    nameEn: "Laptops, Desktop Computers & Processing Tablets",
    chapterAr: "الآلات والأجهزة الآلية - فصل 84",
    chapterEn: "Processors & Computing Equipment - Ch 84",
    dutyRateAr: "معفاة 100% (0% جمرك تشجيعاً لنقل التكنولوجيا للمواطنين)",
    dutyRateEn: "0% Duty Rate (Waiver to promote technical literacy)",
    vatRate: 14,
    devFee: 0,
    agencyRequirementsAr: "إعفاء كلي من الجمرك ورسم التنمية، وتخضع لموافقة الجهاز القومي لتنظيم الاتصالات إذا كانت مزودة بمدخل شريحة اتصال خلوي 4G/5G.",
    agencyRequirementsEn: "Fully exempt from import customs & development fees; triggers NTRA regulatory check if it contains built-in 4G/5G SIM card slots.",
    descriptionAr: "الكمبيوتر المحمول والتابلت والأجهزة اللوحية. معفاة تماماً من الجمارك 0% لتعزيز الثقافة الرقمية بمصر. تدفع فقط ضريبة القيمة المضافة 14%.",
    descriptionEn: "Portable computation tablets and standard laptops. Exempt from customs to boost local learning curves, only paying the base 14% VAT."
  },
  {
    id: "8528.72",
    hsCode: "8528.72.00",
    nameAr: "شاشات التليفزيون وأجهزة العرض المسرحي",
    nameEn: "Television screens, smart monitors & theater projectors",
    chapterAr: "أجهزة الاتصالات والصوتيات - فصل 85",
    chapterEn: "Telecoms, Sound & Electronics - Ch 85",
    dutyRateAr: "40% جمارك فئة الوارد العامة",
    dutyRateEn: "40% General Import Customs Duty",
    vatRate: 14,
    devFee: 3,
    agencyRequirementsAr: "معاينة مطابقة المواصفات وموافقات مصلحة الرقابة الصناعية للتأكد من مطابقة كفاءة استهلاك الطاقة والأمان للأجهزة الكهروميكانيكية.",
    agencyRequirementsEn: "Industrial Control Authority audit to certify energy consumption indexes and electromechanical hardware standards.",
    descriptionAr: "الشاشات الذكية بكافة مقاساتها. تدفع جمارك مرتفعة نسبياً 40% حماية وتدعيمًا لصناعة التجميع المحلية بمصر.",
    descriptionEn: "Smart flat displays of all dimensions. Duties are set at a peak of 40% to protect and prompt local electronics assembly brands in Egypt."
  },

  // --- INDUSTRIAL MACHINERY & EQUIPMENT (Chapter 84) ---
  {
    id: "8408.10",
    hsCode: "8408.90.00",
    nameAr: "المولدات الكهربائية ووحدات توليد الطاقة ومحركات الديزل",
    nameEn: "Electric Generators, Power Units & Diesel Combustion Engines",
    chapterAr: "الآلات والأجهزة الآلية - فصل 84",
    chapterEn: "Processors & Computing Equipment - Ch 84",
    dutyRateAr: "2% لغاية 5% جمارك صناعية مخفضة",
    dutyRateEn: "2% to 5% Industry-encouraging duty rates",
    vatRate: 14,
    devFee: 1,
    agencyRequirementsAr: "موافقة وزارة الكهرباء والطاقة المتجددة المصرية، وتأكيد الفاتورة جمركياً وتقديم رخصة النشاط الصناعي والمصنع.",
    agencyRequirementsEn: "Waiver endorsement from Ministry of Electricity & Renewable Energy, active factory profile or industrial trade permit.",
    descriptionAr: "مولدات كهرباء ميكانيكية تعمل بالديزل والوقود. تفرض عليها الدولة رسوم جمركية رمزية ومنخفضة للغاية (٢-٥٪) لدعم الإنتاج والطاقة والإنشاءات بالمواقع المختلفة.",
    descriptionEn: "Mechanical diesel generator units. Standardized with small duties (2-5%) to foster national development site expansions."
  },
  {
    id: "8701.91",
    hsCode: "8701.91.10",
    nameAr: "الجرارات الزراعية، الحصادات وآلات حراثة التربة",
    nameEn: "Agricultural tractors, harvesters & soil tillers",
    chapterAr: "سيارات الركوب والنقل - فصل 87",
    chapterEn: "Vehicles & Transportation - Ch 87",
    dutyRateAr: "معفاة 100% (جمارك 2% مخفضة للأنواع الاستثنائية)",
    dutyRateEn: "0% to 2% Reduced Agricultural encouraging tax",
    vatRate: 5, // Reduced VAT for farmers
    devFee: 0,
    agencyRequirementsAr: "موافقة وزارة الزراعة واستصلاح الأراضي وهيئة الحجر الزراعي وتقديم بطاقة حيازة زراعية أو سند سجل تجاري زراعي.",
    agencyRequirementsEn: "Ministry of Agriculture approval, Agricultural Quarantine checks, verified farming register or agronomy trade license.",
    descriptionAr: "الجرارات ومركبات الحراثة وتصفية المحاصيل لتنمية الأمن الغذائي للبلاد. تُعفى من ضريبة التنمية وضريبة القيمة المضافة مخفضة لـ 5% فقط.",
    descriptionEn: "Tractors and harvest combines meant for local agrarian stability. Exempt from development fees; reduced VAT is applied at just 5.0%."
  },

  // --- FOODSTUFF & ESSENTIALS (Chapters 2 & 10) ---
  {
    id: "0202.30",
    hsCode: "0202.30.00",
    nameAr: "اللحوم البقرية المجمدة والطازجة والدواجن (سلع استراتيجية)",
    nameEn: "Frozen or Fresh Halal Beef & Poultry (Strategic Meat)",
    chapterAr: "اللحوم والأغذية - فصل 2",
    chapterEn: "Foodstuffs & Agriculture - Ch 1-24",
    dutyRateAr: "معفاة 100% (0% جمارك لدعم غذاء الأسرة)",
    dutyRateEn: "0% Duty Rate (Waiver to support consumer base food security)",
    vatRate: 0, // Fully exempt from VAT as index essential foodstuff
    devFee: 0,
    agencyRequirementsAr: "سرعة الإفراج مع شهادة ذبح حلال معتمدة دولياً وموافقة هيئة الحجر البيطري والهيئة القومية لسلامة الغذاء (NFSA) بمنافذ الإسكندرية.",
    agencyRequirementsEn: "Express priority customs release, certified International Halal Slaughter documentation, Veterinary Quarantine and NFSA approval.",
    descriptionAr: "اللحوم الحمراء البقرية المجمدة والمستوردة لدعم سلة الغذاء المصرية. معفاة تماماً من الرسام والضرائب الجمركية لضمان ثبات أسعار السوق الاستهلاكي.",
    descriptionEn: "Imported frozen beef blocks meant for domestic consumption. Fully exempt from both import tariffs and standard VAT to curb inflation."
  },
  {
    id: "1001.99",
    hsCode: "1001.99.00",
    nameAr: "القمح الاستراتيجي السائب والحبوب الأساسية",
    nameEn: "Strategic Bulk Wheat & Primary Grains for Bread production",
    chapterAr: "اللحوم والأغذية - فصل 10",
    chapterEn: "Foodstuffs & Agriculture - Ch 1-24",
    dutyRateAr: "معفاة 100% (0% جمرك وصفر جباية)",
    dutyRateEn: "0% Duty (No customs tax applied onto bread cereals)",
    vatRate: 0,
    devFee: 0,
    agencyRequirementsAr: "تحليل عينات الرطوبة والفحص الكيميائي الفوري من الهيئة العامة للرقابة على الصادرات والواردات، والحجر الزراعي بميناء الدخول لبيان السلامة من الآفات.",
    agencyRequirementsEn: "Immediate chemical humidity sampling by GOEIC, Agricultural Quarantine verification to check seed health and prevent contamination.",
    descriptionAr: "صوامع القمح والحبوب الاستراتيجية لإنتاج الخبز البلدي المدعم. يحظى بأعلى درجات رعاية الدولة عبر الإعفاء الكامل من الرسوم الجمركية.",
    descriptionEn: "Bulk wheat and cereal raw grains for countrywide bread flour mills. Receives priority unloading and zero taxation to protect consumers."
  },

  // --- TEXTILES & APPAREL (Chapter 61 & 62) ---
  {
    id: "6109.10",
    hsCode: "6109.10.00",
    nameAr: "الملابس الجاهزة والمنسوجات القطنية والصوفية المصنعة",
    nameEn: "Ready-made garments, cotton wear & fashion apparels",
    chapterAr: "الملابس المنسوجة - فصل 61-62",
    chapterEn: "Textiles & Apparel - Ch 50-63",
    dutyRateAr: "40% جمارك حماية للمنسوجات المحلية",
    dutyRateEn: "40% Protective Import Duty Rate",
    vatRate: 14,
    devFee: 3,
    agencyRequirementsAr: "مطابقة فحص سحب العينات للألياف من الهيئة العامة لرقابة الصادرات والواردات (GOEIC) والتأكد من عدم وجود صبغات محظورة.",
    agencyRequirementsEn: "Visual/chemical fabric sampling by GOEIC to verify local fiber health compliance and confirm no banned textile dyes.",
    descriptionAr: "الملابس والقمصان الجاهزة القطنية والمستوردة. جمارك مرتفعة لحماية ريادة قطاع الغزل والنسيج العريق في الأراضي المصرية (المحلة الكبرى).",
    descriptionEn: "Imported shirts and garments. Subject to a high 40% protective tariff to promote and safeguard Egypt's local textile manufacturers."
  },

  // --- MEDICAL SUPPLIES (Chapter 90) ---
  {
    id: "9018.90",
    hsCode: "9018.90.00",
    nameAr: "الأجهزة والمعدات الجراحية والطبية وأجهزة الأشعة التشخيصية",
    nameEn: "Surgical, medical diagnostic instruments & CT scans",
    chapterAr: "المعدات الطبية الدقيقة - فصل 90",
    chapterEn: "Medical Supplies & Optics - Ch 90",
    dutyRateAr: "معفاة أو 2% ضريبة جمركية رمزية هادفة لصحة المرضى",
    dutyRateEn: "0% to 2% Special Flat Tariff for vital healthcare tools",
    vatRate: 5, // Reduced healthcare VAT
    devFee: 0,
    agencyRequirementsAr: "موافقة واعتماد حصرى من هيئة الدواء المصرية (EDA) أو هيئة الشراء الموحد للتأكد من مواصفات جودة المعدات والمناشئ المعقمة.",
    agencyRequirementsEn: "Prior administrative approval from Egypt Drug Authority (EDA) or Unified Procurement Authority (UPA) for hygiene standards.",
    descriptionAr: "أجهزة كشف القلب، التنفس الصناعي، ومعدات الطوارئ التشخيصية. معفاة من الجمرك الأساسي كجزء من قرارات تسهيل الرعاية الصحية للمستشفيات بمصر.",
    descriptionEn: "Echocardiogram arrays, respiratory units, and surgical kits. Exempt or restricted to 2% maximum import fees with dynamic agricultural and health waivers."
  }
];

export const GENERAL_CUSTOMS_FAQ = [
  {
    qAr: "ما هو الـ HS Code الجمركي وكيف يؤثر على بضائع الشحن؟",
    qEn: "What is an HS Code and how does it determine shipping rates?",
    aAr: "هو نظام دولي للتسجيل الرقمي الموحد (Harmonized System) يصنف كل سلعة برقم مكون من 6 إلى 8 خانات. تحدد مصلحة الجمارك تبعا لهذا الرقم مبالغ الرسوم الأساسية والضرائب الإضافية والموافقات الرقابية المطلوبة للإفراج.",
    aEn: "The Harmonized System (HS) is an internationally standardized system of names and numbers to classify traded products. Customs authorities use this 6-to-8 digit code to identify exact import rates and calculate calculated liabilities."
  },
  {
    qAr: "هل يمكن للمستورد الفرد استيراد سيارة مستعملة بدون موافقة 'مالك أول'؟",
    qEn: "Can an individual import a used car without 'First Owner' proof?",
    aAr: "لا، تمنع القوانين الجمركية المصرية الصارمة استيراد السيارات المستعملة بمحرك بنزين إلا تحت مبادرة المغتربين أو كونه المالك الأول للسيارة في سنة الصنع ومصدقاً عليها من القنصلية، عدا السيارات الكهربائية بالكامل فيسمح بخصم واستيراد مستعمل بحد أقصى ٣ سنوات.",
    aEn: "No, strict Egyptian regulations forbid importing used petrol passenger cars unless registered under the Official Expatriate Scheme or under certified first-owner records. Fully electric vehicles are exempted, allowing backdated model shipments up to 3 years."
  },
  {
    qAr: "ما هي شهادة اليورو 1 (EUR.1) ومن أين تأتي؟",
    qEn: "What is a EUR.1 certificate and where is it acquired?",
    aAr: "هي شهادة لإثبات المنشأ الأوروبي للشحنة يتم إصدارها وتوطينها من الغرفة التجارية بدولة الصنع بالاتحاد الأوروبي ومصادقة إلكترونياً. تمنحك إعفاءً فورياً جمركياً 100% من الرسوم الأساسية للعديد من البضائع والسيارات بميناء الإسكندرية.",
    aEn: "A EUR.1 is an official movement certificate issued by European chamber of commerce units to establish authentic EU origin. It yields immediate 100% tariff waivers upon customs review under the Egypt-EU development bilateral treaties."
  },
  {
    qAr: "كيف يتم تقدير قيمة البضائع لفرض الرسوم في حال عدم وجود فاتورة؟",
    qEn: "How are goods valued for duty calculation if no invoice exists?",
    aAr: "تقوم لجان البحث والتثمين بمصلحة الجمارك بالرجوع لمراجعة قوائم الأسعار المرجعية المحدثة بالبلاد والأسعار السابقة لنفس البضائع (البنود المماثلة)، مع مراجعة وزن الحاويات لمصادقتها بشكل عادل.",
    aEn: "The Estimation Committee reviews international benchmark retail/wholesale lists & matching local transactions to infer a reasonable, fair custom evaluation base for calculating duties."
  }
];
