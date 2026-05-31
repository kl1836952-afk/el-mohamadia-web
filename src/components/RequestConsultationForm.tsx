import React, { useState, useRef } from "react";
import { CustomsService, TrackingRecord, StepStatus } from "../types";
import { generateTrackingSteps } from "../utils/customsData";
import { FileUp, ClipboardCheck, Phone, Mail, Send, CheckCircle2, X, File, Printer, MessageSquare, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import AuthInterface from "./AuthInterface";
import { doc, setDoc } from "firebase/firestore";
import { db, handleFirestoreError, OperationType } from "../lib/firebase";

interface Props {
  lang: "ar" | "en";
  prefilledData: any; // Data pulled from CustomsCalculator
  onNewRecordCreated: (rec: TrackingRecord) => void;
}

interface MockUploadedFile {
  name: string;
  size: string;
  type: string;
  progress: number;
}

export default function RequestConsultationForm({ lang, prefilledData, onNewRecordCreated }: Props) {
  const isAr = lang === "ar";
  const { user, profile, logout } = useAuth();

  // Form States
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [emailAddress, setEmailAddress] = useState(user?.email || "");
  const [service, setService] = useState<CustomsService>(prefilledData?.service || CustomsService.ExpatriateInitiative);
  const [cargoName, setCargoName] = useState("");
  const [cargoDetails, setCargoDetails] = useState("");

  // Prefill hook if user clicks "Apply with calculation"
  React.useEffect(() => {
    if (prefilledData) {
      if (prefilledData.service) setService(prefilledData.service);
      const cap = prefilledData.engineCc ? `${prefilledData.engineCc} CC` : "";
      const b = prefilledData.brand || "";
      const energy = prefilledData.engineType ? `(${prefilledData.engineType})` : "";
      setCargoName(`${b} ${prefilledData.yearModel || ""} ${cap} ${energy}`.trim());
      
      const calcStr = prefilledData.calculatedDetails
        ? `إجمالي الرسوم المقدرة: ${prefilledData.calculatedDetails.totalRequirements?.toLocaleString()} جنيه مصري`
        : "";
      setCargoDetails(calcStr);
    }
  }, [prefilledData]);

  // Upload simulation states
  const [uploadedFiles, setUploadedFiles] = useState<MockUploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Completed State
  const [submittedRecord, setSubmittedRecord] = useState<TrackingRecord | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  // Email Simulation States
  const [isSimulatingEmail, setIsSimulatingEmail] = useState(false);
  const [simulatedEmailStatus, setSimulatedEmailStatus] = useState<{
    sent: boolean;
    email: string;
    subject: string;
    body: string;
    timestamp: string;
  } | null>(null);

  // Mock File Drag & Drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const addMockFiles = (names: string[]) => {
    const newFiles = names.map((name) => ({
      name,
      size: `${(Math.random() * 2 + 0.5).toFixed(1)} MB`,
      type: name.endsWith(".pdf") ? "application/pdf" : "image/jpeg",
      progress: 0
    }));

    setUploadedFiles((prev) => [...prev, ...newFiles]);

    // Simulate progress bars increasing
    newFiles.forEach((f, idx) => {
      let currentProg = 0;
      const interval = setInterval(() => {
        currentProg += 20;
        setUploadedFiles((prev) => 
          prev.map((item) => item.name === f.name ? { ...item, progress: currentProg } : item)
        );
        if (currentProg >= 100) {
          clearInterval(interval);
        }
      }, 150);
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const fileNames = Array.from(e.dataTransfer.files).map((f: any) => f.name);
      addMockFiles(fileNames);
    }
  };

  const handleManualUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const fileNames = Array.from(e.target.files).map((f: any) => f.name);
      addMockFiles(fileNames);
    }
  };

  const removeFile = (name: string) => {
    setUploadedFiles((prev) => prev.filter(f => f.name !== name));
  };

  const triggerMockUpload = () => {
    // Inject realistic customs documents for the user to make it feel extremely interactive
    const presets = isAr 
      ? ["بوليصة_الشحن_المبدئية.pdf", "رخصة_تسيير_السيارة.jpg", "الفاتورة_التجارية.png"]
      : ["Draft_Bill_of_Lading.pdf", "Foreign_Car_Registration.jpg", "Commercial_Invoice_Receipt.png"];
    
    addMockFiles(presets);
  };

  // Submission handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phoneNumber) {
      alert(isAr ? "يرجى تعبئة الاسم ورقم الجوال للتواصل." : "Please fill in your name and phone number.");
      return;
    }

    if (!user) {
      alert(isAr ? "يرجى تسجيل الدخول أولاً." : "Please sign in first.");
      return;
    }

    setIsSubmitting(true);
    setSubmissionError(null);

    // Create a new tracking record in local state
    const randomId = `ALM-${Math.floor(1000 + Math.random() * 9000)}`;
    const todayStr = new Date().toISOString().split("T")[0];

    const newRecord: TrackingRecord = {
      id: randomId,
      clientId: user.uid,
      clientName: fullName,
      phone: phoneNumber,
      service: service,
      cargoDescription: cargoName || (isAr ? "طلب عام لتخليص شحنة بضائع" : "General commercial shipment clearance"),
      creationDate: todayStr,
      lastUpdated: todayStr,
      steps: generateTrackingSteps(StepStatus.DocumentReview, false), // Start at review status but with empty historical dates
      additionalNotesAr: `تم تسجيل طلبك الإلكتروني للتخليص مع المستندات بنجاح. رُفعت المعاملة لإدارة التثمين بمكتب أ/ إسلام محمد برمز تتبع: ${randomId}. جاري فحص المستندات المرفقة وتجهيز المطابقة الجمركية بميناء الإسكندرية.`,
      additionalNotesEn: `Your digital clearance query has been compiled successfully. Ticket created under record ${randomId}. Our experts under chief Eslam Mohamed are reviewing the uploaded papers for automotive guidelines.`,
      uploadedFiles: uploadedFiles.map(f => ({ name: f.name, size: f.size }))
    };

    try {
      // Save strictly to Firestore database
      await setDoc(doc(db, "requests", randomId), {
        ...newRecord,
        createdAt: new Date().toISOString()
      });

      // Determine target recipient mail (provide a nice fallback if empty)
      const recipientMail = emailAddress.trim() || `${fullName.replace(/\s+/g, "").toLowerCase() || "client"}@almuhammadiyah-cargo.eg`;
      const todayTimestamp = new Date().toLocaleString(isAr ? "ar-EG" : "en-US", {
        dateStyle: "medium",
        timeStyle: "medium"
      });

      const emailSubject = isAr 
        ? `📩 تأكيد استلام طلب التخليص الجمركي - رقم المعاملة ${randomId} | مكتب المحمدية`
        : `📩 Customs Clearance Request Receipt - Docket Verification Ticket #${randomId}`;

      const serviceDisplay = {
        [CustomsService.Triptyque]: isAr ? "تربيتيك إفراج مؤقت" : "Triptyque Temporary Entry",
        [CustomsService.FirstOwner]: isAr ? "مالك أول سيارة زيرو" : "First Owner Car Import",
        [CustomsService.ExpatriateInitiative]: isAr ? "مبادرة المغتربين سيارات" : "Expatriate Vehicle Scheme",
        [CustomsService.GeneralCargo]: isAr ? "بضائع عامة ورسائل تجارية" : "Commercial Cargo Clearance",
        [CustomsService.DiplomaticRelease]: isAr ? "إفراج دبلوماسي استثنائي" : "Diplomatic Cargo Releases"
      }[newRecord.service];

      const emailBody = isAr 
        ? `أهلاً بك يا ${fullName}،\n\nنشكرك على اختيار خدمات المحمدية للتخليص الجمركي بميناء الإسكندرية تحت إشراف أستاذ إسلام محمد.\n\nتفاصيل طلبك الإلكتروني المسجل لدينا:\n------------------------------------------------\n- كود المعاملة الجمركية: ${randomId}\n- نظام الإفراج: ${serviceDisplay}\n- الشحنة: ${newRecord.cargoDescription}\n- رقم الجوال المسجّل: ${phoneNumber}\n- تاريخ التسجيل: ${todayTimestamp}\n- الملفات المرفقة: ${uploadedFiles.length > 0 ? uploadedFiles.map(f => f.name).join(", ") : "بانتظار رفع الأوراق"}\n------------------------------------------------\n\nحالة الطلب الحالية: مراجعة المستندات والتثمين المبدئي (Document Review).\n\nيسعدنا تواصلك، وسنقوم بالاتصال بك قريباً لاستكمال المطابقة مع مصلحة الجمارك المصرية وترخيص السيارة.\n\nمع تحيات,\nشركة المحمدية للتخليص جمارك الإسكندرية\nأستاذ إسلام محمد - 01274833844`
        : `Dear ${fullName},\n\nThank you for choosing Al-Muhammadiyah Customs Agency at Alexandria Port under direct supervision of Mr. Eslam Mohamed.\n\nYour application details have been safely logged:\n------------------------------------------------\n- Transaction Ticket ID: ${randomId}\n- Clearance Scheme: ${serviceDisplay}\n- Cargo: ${newRecord.cargoDescription}\n- Mobile Number: ${phoneNumber}\n- Timestamp: ${todayTimestamp}\n- Uploaded Documents: ${uploadedFiles.length > 0 ? uploadedFiles.map(f => f.name).join(", ") : "No files specified yet"}\n------------------------------------------------\n\nCurrent Step: Initial Document Evaluation and Port Registration.\n\nWe will contact you shortly to review your invoice documents and streamline the import procedures.\n\nSincerely,\nAl-Muhammadiyah Customs Office Alexandria\nExecutive Chairman Eslam Mohamed - 01274833844`;

      // Start simulation state
      setIsSimulatingEmail(true);
      setSimulatedEmailStatus({
        sent: false,
        email: recipientMail,
        subject: emailSubject,
        body: emailBody,
        timestamp: todayTimestamp
      });

      setSubmittedRecord(newRecord);
      onNewRecordCreated(newRecord); // bubble up to register in global local list

      // Complete simulated email dispatch with elegant delayed feedback
      setTimeout(() => {
        setSimulatedEmailStatus((prev) => prev ? { ...prev, sent: true } : null);
        setIsSimulatingEmail(false);
      }, 1500);

    } catch (err: any) {
      console.error("Customs submission error:", err);
      // Try to repair user profile if Firestore access failed
      setSubmissionError(err.message || String(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetForm = () => {
    setFullName("");
    setPhoneNumber("");
    setEmailAddress("");
    setCargoName("");
    setCargoDetails("");
    setUploadedFiles([]);
    setSubmittedRecord(null);
    setSimulatedEmailStatus(null);
    setIsSimulatingEmail(false);
  };

  const handlePrint = () => {
    window.print();
  };

  // Generate WhatsApp Direct link
  const getWhatsAppLink = (rec: TrackingRecord) => {
    const defaultPhone = "201274833844"; // Eslam Mohamed port number with country code EGY
    const serviceLabel = {
      [CustomsService.Triptyque]: "تربيتيك إفراج مؤقت",
      [CustomsService.FirstOwner]: "مالك أول سيارة زيرو",
      [CustomsService.ExpatriateInitiative]: "مبادرة المغتربين سيارات",
      [CustomsService.GeneralCargo]: "بضائع عامة ورسائل تجارية",
      [CustomsService.DiplomaticRelease]: "إفراج دبلوماسي استثنائي"
    }[rec.service];

    const message = isAr
      ? `مرحباً أستاذ إسلام محمد، قمت بتقديم طلب تخليص جمركي عبر تطبيق المحمدية.\n\nرقم المعاملة: *${rec.id}*\nالاسم الكريم: *${rec.clientName}*\nجوال التواصل: *${rec.phone}*\nنوع الخدمة الجمركية: *${serviceLabel}*\nتفاصيل الشحنة: ${rec.cargoDescription}\n\nيرجى مراجعة المستندات المرفوعة والبدء بالإجراءات بالاسكندرية وشكراً لكم!`
      : `Hello Mr. Eslam Mohamed, I submitted a customs clearance request via Al-Muhammadiyah App.\n\nTransaction ID: *${rec.id}*\nName: *${rec.clientName}*\nPhone: *${rec.phone}*\nService: *${serviceLabel}*\nDescription: ${rec.cargoDescription}\n\nPlease review my documents and prepare clearances. Thank you!`;

    return `https://wa.me/${defaultPhone}?text=${encodeURIComponent(message)}`;
  };

  if (!user) {
    return (
      <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-emerald-50 p-8 text-center space-y-6" id="request-consult-container">
        <div className="max-w-md mx-auto space-y-3">
          <div className="p-3 bg-emerald-50 text-emerald-800 rounded-full w-14 h-14 flex items-center justify-center mx-auto text-lg font-bold">
            🔒
          </div>
          <h3 className="text-lg font-black text-gray-900 font-sans">
            {isAr ? "تسجيل الدخول أو الحساب مطلوب للتقديم" : "Secure Account Login Required"}
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed font-sans font-light">
            {isAr 
              ? "لتتمكن من مراجعة أوراق سيارتك بأمان ومتابعة شحنتك، يرجى تسجيل حساب كعميل بالبريد الإلكتروني لمواصلة التقديم والاتصال بـ أ/ إسلام محمد مباشرة." 
              : "To safely manage your car import licenses and track invoice clearances, please register or sign in as a client first."}
          </p>
        </div>
        <div className="max-w-md mx-auto">
          <AuthInterface lang={lang} defaultRole="client" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-emerald-50 overflow-hidden" id="request-consult-container">
      {!submittedRecord ? (
        // FORM DISPLAY
        <div>
          <div className="bg-gradient-to-r from-emerald-950 to-emerald-850 text-white p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/10 rounded-xl">
                <ClipboardCheck className="h-6 w-6 text-emerald-200" />
              </div>
              <div>
                <h2 className="text-xl font-bold font-sans">
                  {isAr ? "تقديم طلب تخليص وتواصل مباشر" : "Request Customs Representation"}
                </h2>
                <p className="text-xs text-emerald-100 mt-1">
                  {isAr ? "املأ البيانات وأرفق صور أوراق الشحنة للبدء فوراً بفحص أوراقك بميناء الإسكندرية" : "Supply cargo details, attach invoice copies and sync with our port delegate."}
                </p>
              </div>
            </div>
          </div>

          {/* Active Logged in User Bar */}
          <div className="bg-emerald-50 border-b border-emerald-100 px-6 py-3 flex flex-wrap items-center justify-between gap-3 text-xs font-semibold">
            <div className="flex items-center gap-2">
              <span className="text-emerald-950 font-bold">{isAr ? "مرحباً بجلسة الدخول الحالية:" : "Current login session:"}</span>
              <span className="font-mono text-emerald-800 font-black">{user.email}</span>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-full font-black">
                {profile?.role === "admin" ? (isAr ? "المشرف أ/ إسلام" : "Owner Admin") : (isAr ? "عميل موثق" : "Customs Client")}
              </span>
            </div>
            <button
              type="button"
              onClick={() => logout()}
              className="text-red-700 hover:text-white bg-red-100/60 hover:bg-red-750 font-extrabold flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-red-200 hover:border-red-700 transition-all text-xs cursor-pointer shadow-3xs"
            >
              <LogOut className="h-4 w-4" />
              <span>{isAr ? "تسجيل الخروج أو تبديل الحساب" : "Logout or Switch Account"}</span>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-semibold text-emerald-950 mb-1.5">
                  {isAr ? "الاسم الكريم ثلاثي" : "Your Full Name"} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder={isAr ? "مثال: م. أحمد عبد الرحمن" : "e.g., Engineer Ahmed"}
                  className="w-full bg-slate-50 border border-slate-350 rounded-lg px-3.5 py-2.5 text-sm focus:bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-sans"
                />
              </div>

              {/* Phone Num */}
              <div>
                <label className="block text-sm font-semibold text-emerald-950 mb-1.5">
                  {isAr ? "رقم الهاتف / الواتس اب للتواصل" : "Phone / WhatsApp Number"} <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder={isAr ? "مثال: 01274833844" : "e.g., +20 127 4833 844"}
                  className="w-full bg-slate-50 border border-slate-350 rounded-lg px-3.5 py-2.5 text-sm focus:bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-sans font-medium"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-emerald-950 mb-1.5">
                  {isAr ? "البريد الإلكتروني (اختياري)" : "Email Address (Optional)"}
                </label>
                <input
                  type="email"
                  value={emailAddress}
                  onChange={(e) => setEmailAddress(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-slate-50 border border-slate-350 rounded-lg px-3.5 py-2.5 text-sm focus:bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-sans"
                />
              </div>

              {/* Service selection */}
              <div>
                <label className="block text-sm font-semibold text-emerald-950 mb-1.5">
                  {isAr ? "نوع المعاملة والنظام الجمركي" : "Representation Type"}
                </label>
                <select
                  value={service}
                  onChange={(e) => setService(e.target.value as CustomsService)}
                  className="w-full bg-slate-50 border border-slate-350 rounded-lg px-3.5 py-2.5 text-sm focus:bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-sans"
                >
                  <option value={CustomsService.ExpatriateInitiative}>{isAr ? "مبادرة سيارات المصريين بالخارج" : "Expatriates Vehicle Initiative"}</option>
                  <option value={CustomsService.FirstOwner}>{isAr ? "نظام أول مالك (موديل السنة)" : "First Owner Year Model Import"}</option>
                  <option value={CustomsService.Triptyque}>{isAr ? "نظام التربيتيك (الإفراج المؤقت المحدود)" : "Triptyque Booklet entry"}</option>
                  <option value={CustomsService.GeneralCargo}>{isAr ? "بضائع عامة وشحنات كلي/مشترك تجاري" : "General Commercial Cargo (FCL/LCL)"}</option>
                  <option value={CustomsService.DiplomaticRelease}>{isAr ? "الجمارك الدبلوماسية والقنصلية" : "Diplomatic Missions Exemption Release"}</option>
                </select>
              </div>
            </div>

            {/* Cargo / Vehicle Description */}
            <div>
              <label className="block text-sm font-semibold text-emerald-950 mb-1.5">
                {isAr ? "طراز السيارة أو مواصفات الشحنة" : "Vehicle Make Model / Cargo Description"}
              </label>
              <input
                type="text"
                value={cargoName}
                onChange={(e) => setCargoName(e.target.value)}
                placeholder={isAr ? "مثال: مرسيدس C200 سنة 2024" : "e.g., Mercedes C200 2024"}
                className="w-full bg-slate-50 border border-slate-350 rounded-lg px-3.5 py-2.5 text-sm focus:bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-sans"
              />
            </div>

            {/* Custom Notes */}
            <div>
              <label className="block text-sm font-semibold text-emerald-950 mb-1.5">
                {isAr ? "رسالتك وملاحظات خاصة للأستاذ إسلام" : "Special Instructions / Calculation results"}
              </label>
              <textarea
                value={cargoDetails}
                onChange={(e) => setCargoDetails(e.target.value)}
                rows={3}
                placeholder={isAr ? "اكتب تفاصيل إضافية مثل ميناء الشحن، بلد التصدير أو أي استفسار للشركة..." : "Enter port of dispatch, country of origin, or extra guidance..."}
                className="w-full bg-slate-50 border border-slate-350 rounded-lg px-3.5 py-2.5 text-sm focus:bg-white text-gray-805 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-sans"
              />
            </div>

            {/* Drag Drop File upload Box */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-emerald-950">
                {isAr ? "المستندات وأوراق الشحنة والمطابقة (أرفق صور أو ملفات)" : "Upload Shipping Documents, Invoices or Registrations"}
              </label>

              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-xl p-6 text-center transition-all ${
                  isDragging
                    ? "border-emerald-600 bg-emerald-50/50"
                    : "border-gray-300 hover:border-emerald-500 bg-slate-50"
                }`}
              >
                <input
                  type="file"
                  multiple
                  ref={fileInputRef}
                  onChange={handleManualUpload}
                  className="hidden"
                />
                <FileUp className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-xs font-semibold text-gray-700">
                  {isAr ? "اسحب الملفات وأفلتها هنا، أو اضغط للتصفح من جهازك" : "Drag & Drop files here, or click to choose from system"}
                </p>
                <p className="text-[10px] text-gray-400 mt-1">
                  {isAr ? "بند الشحن، بوليصة المالك، رخصة السيارة، الفواتير المعتمدة (تنسيق PDF, PNG, JPG)" : "Bill of lading, purchase order, foreign license, passport drafts"}
                </p>

                {/* Simulated file loader button */}
                <button
                  type="button"
                  onClick={triggerMockUpload}
                  className="mt-3 inline-flex items-center gap-1.5 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 py-1.5 px-3 rounded-lg text-xs font-semibold transition-all cursor-pointer shadow-2xs"
                >
                  <span>{isAr ? "⚡ أرفق مستندات استيراد نموذجية تلقائياً" : "⚡ Attach Typical Mock Invoices Automatically"}</span>
                </button>
              </div>

              {/* Uploaded visual list representation */}
              {uploadedFiles.length > 0 && (
                <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 divide-y divide-gray-150">
                  {uploadedFiles.map((f, idx) => (
                    <div key={idx} className="flex items-center justify-between py-2 text-xs">
                      <div className="flex items-center gap-2.5 overflow-hidden">
                        <File className="h-4 w-4 text-emerald-700 shrink-0" />
                        <div className="truncate">
                          <span className="font-semibold text-gray-800 block truncate">{f.name}</span>
                          <span className="text-[10px] text-gray-400 font-mono">{f.size}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        {/* progress bar */}
                        {f.progress < 100 ? (
                          <div className="w-24 bg-gray-200 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-emerald-600 h-full transition-all duration-150" style={{ width: `${f.progress}%` }} />
                          </div>
                        ) : (
                          <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-sm">
                            {isAr ? "مكتمل" : "Ready"}
                          </span>
                        )}

                        <button
                          type="button"
                          onClick={() => removeFile(f.name)}
                          className="text-gray-400 hover:text-red-500 transition-colors p-1 cursor-pointer"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-2 border-t border-gray-150">
              {submissionError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-xs leading-relaxed mb-4 font-sans font-medium">
                  ⚠️ {isAr ? "فشل تقديم طلبك. يرجى مراجعة اتصال الشبكة وصلاحياتك: " : "Submission failed. Please check your network and rules: "} {submissionError}
                </div>
              )}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-emerald-750 hover:bg-emerald-850 text-white font-bold py-3.5 px-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-sm cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2 font-semibold">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    <span>{isAr ? "جاري تسجيل المعاملة الجمركية بالميناء..." : "Registering docket in port ledger..."}</span>
                  </span>
                ) : (
                  <>
                    <Send className="h-4.5 w-4.5" />
                    <span>{isAr ? "تقديم طلب الوكالة وتسجيل المعاملة بالميناء" : "Submit Port Customs Mandate Application"}</span>
                  </>
                )}
              </button>
              <p className="text-[10px] text-gray-400 text-center mt-2.5">
                {isAr 
                  ? "تسجيل هذا الطلب ينشئ كود تتبع فوري بمكتب أ/ إسلام محمد في ميناء الإسكندرية" 
                  : "Completing this creates a tracking invoice in Master Eslam Mohamed's desk at Alexandria Port system"}
              </p>
            </div>
          </form>
        </div>
      ) : (
        // COMPLETED STATE & RECEIPT TICKET EXCELLENCE
        <div className="p-6 md:p-8 space-y-6">
          <div className="text-center space-y-2 py-4">
            <div className="h-14 w-14 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mx-auto border border-emerald-200 shadow-xs animate-bounce">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-bold text-gray-950">
              {isAr ? "تم تسجيل معاملتك الجمركية بنجاح!" : "Port Customs Representation Registered!"}
            </h3>
            <p className="text-xs text-gray-500 leading-relaxed max-w-md mx-auto">
              {isAr 
                ? `تم تسجيل أوراقك بمكتب أ/ إسلام محمد وتوزيعها على الساحة الجمركية بميناء الإسكندرية.` 
                : `Your document file is registered under Master Eslam Mohamed's Alexandria seaport desk.`}
            </p>

            {/* LARGE TICKET CODE CALLOUT */}
            <div className="bg-emerald-950 text-white rounded-2xl p-5 max-w-sm mx-auto shadow-md border border-emerald-850 flex flex-col items-center justify-center space-y-2 mt-4">
              <span className="text-[10px] text-amber-400 font-extrabold tracking-wider uppercase">
                {isAr ? "رقم الطلب / كود التتبع جمركياً" : "CUSTOMS TRACKING TICKET ID"}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black font-mono tracking-widest text-amber-300">
                  {submittedRecord.id}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(submittedRecord.id);
                    alert(isAr ? "تم نسخ كود التتبع جمركياً!" : "Customs ticket code copied!");
                  }}
                  className="bg-emerald-800 hover:bg-emerald-700 text-amber-300 font-extrabold py-1 px-3 rounded-lg border border-emerald-700 text-[10px] cursor-pointer"
                  title={isAr ? "نسخ الكود" : "Copy Code"}
                >
                  {isAr ? "نسخ" : "Copy"}
                </button>
              </div>
              <p className="text-[10px] text-emerald-200 text-center font-medium">
                {isAr 
                  ? "احتفظ بهذا الكود لمتابعة حالة الشحنة بالمرور والساحة" 
                  : "Save this tracking key to search on state review timeline"}
              </p>
            </div>
          </div>

          {/* PRINTABLE RECEIPT TICKET */}
          <div 
            className="border-2 border-slate-200 bg-slate-50/50 rounded-2xl p-6 space-y-6 max-w-xl mx-auto shadow-sm print:border-transparent print:p-0 print:bg-white" 
            id="printable-customs-ticket"
          >
            {/* Ticket header */}
            <div className="flex justify-between items-start border-b border-slate-205 pb-4">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-emerald-800 block">{isAr ? "مكتب المحمدية للاستخلاص" : "AL-MUHAMMADIYAH CUSTOMS REPRESENTATIVE"}</span>
                <h4 className="font-bold text-sm text-gray-900">{isAr ? "بطاقة وكالة جمركية وتخليص" : "Official Customs Rep Ticket"}</h4>
                <p className="text-[9px] text-gray-400">{isAr ? "ميناء الإسكندرية - الساحة الجمركية" : "Alexandria Port Yard Terminal"}</p>
              </div>
              <div className="text-right">
                <span className="text-xs font-mono font-black text-white bg-emerald-950 px-3 py-1.5 rounded-lg border border-emerald-800">
                  {submittedRecord.id}
                </span>
                <p className="text-[9px] text-gray-400 mt-1">{submittedRecord.creationDate}</p>
              </div>
            </div>

            {/* Ticket parameters */}
            <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-xs text-gray-700">
              <div>
                <span className="block text-[9px] text-gray-400 uppercase font-bold">{isAr ? "اسم العميل" : "Client"}</span>
                <span className="font-bold text-gray-900">{submittedRecord.clientName}</span>
              </div>
              <div>
                <span className="block text-[9px] text-gray-400 uppercase font-bold">{isAr ? "جوال الواتس اب" : "WhatsApp Contacts"}</span>
                <span className="font-semibold text-gray-950">{submittedRecord.phone}</span>
              </div>
              <div className="col-span-2 border-t border-slate-150 pt-3">
                <span className="block text-[9px] text-gray-400 uppercase font-bold">{isAr ? "تفاصيل السيارة / الشحنة المودعة" : "Dockets Description"}</span>
                <span className="font-semibold text-gray-900 font-sans">{submittedRecord.cargoDescription}</span>
              </div>
              <div className="col-span-2 border-t border-slate-150 pt-3">
                <span className="block text-[9px] text-gray-400 uppercase font-bold">{isAr ? "نظام الإفراج الجمركي للمستندات" : "Customs System Framework"}</span>
                <span className="font-serif px-2.5 py-0.5 bg-emerald-100 text-emerald-950 rounded-full font-bold text-[10px] inline-block mt-0.5">
                  {isAr 
                    ? {
                        [CustomsService.Triptyque]: "تربيتيك (إفراج مؤقت)",
                        [CustomsService.FirstOwner]: "مالك أول (موديل السنة)",
                        [CustomsService.ExpatriateInitiative]: "مبادرة المغتربين المصرية",
                        [CustomsService.GeneralCargo]: "بضائع عامة ورسائل تجارية",
                        [CustomsService.DiplomaticRelease]: "الإفراج الدبلوماسي بالقنصلية"
                      }[submittedRecord.service]
                    : submittedRecord.service
                  }
                </span>
              </div>
            </div>

            {/* Ticket Disclaimer text inside printing */}
            <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 text-[10px] text-gray-500 leading-relaxed font-sans font-medium">
              <span className="block font-bold text-emerald-800 text-[11px] mb-1">
                {isAr ? "مذكرة التسجيل الجاري بميناء الإسكندرية:" : "Representation Desk Status Log:"}
              </span>
              {isAr ? submittedRecord.additionalNotesAr : submittedRecord.additionalNotesEn}
            </div>

            <div className="border-t border-dashed border-slate-300 pt-4 text-center">
              <span className="text-[10px] text-gray-400 block font-mono">
                {isAr ? "© شركة المحمدية للتخليص الجمركي - إدارة أ/ إسلام محمد 01274833844" : "© Al-Muhammadiyah Customs Office | Chief Eslam Mohamed 01274833844"}
              </span>
            </div>
          </div>

          {/* SIMULATED EMAIL RECEIPT LOG DISPLAY */}
          {simulatedEmailStatus && (
            <div className="max-w-xl mx-auto bg-amber-50/50 border border-amber-200 rounded-2xl p-5 space-y-3.5 shadow-xs transition-all duration-300">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`p-1.5 rounded-lg ${simulatedEmailStatus.sent ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800 animate-pulse"}`}>
                    <Mail className="h-4 w-4" />
                  </div>
                  <div>
                    <h5 className="font-bold text-xs text-gray-900">
                      {isAr ? "نظام البريد الإلكتروني (محاكاة جمركية)" : "Email Receipt System (Mock Simulated)"}
                    </h5>
                    <p className="text-[10px] text-gray-400">
                      {isAr ? "مستند إثبات إرسال جمركي للاستشارات" : "Real-time dispatch proof verification log"}
                    </p>
                  </div>
                </div>

                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${simulatedEmailStatus.sent ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800 animate-pulse"}`}>
                  {isSimulatingEmail 
                    ? (isAr ? "جاري كوريير الإرسال..." : "Dispatching email...") 
                    : (isAr ? "✓ تم الإرسال للعميل" : "✓ Sent Successfully")}
                </span>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden text-xs">
                {/* Headers */}
                <div className="bg-slate-50 p-3 border-b border-gray-150 space-y-1 font-sans">
                  <div>
                    <span className="text-gray-450 font-medium inline-block w-14">{isAr ? "من:" : "From:"}</span>
                    <span className="font-semibold text-gray-800">Al-Muhammadiyah Desk &lt;noreply@almuhammadiyah-cargo.eg&gt;</span>
                  </div>
                  <div>
                    <span className="text-gray-450 font-medium inline-block w-14">{isAr ? "إلى:" : "To:"}</span>
                    <span className="font-semibold text-emerald-800 font-mono break-all">{simulatedEmailStatus.email}</span>
                  </div>
                  <div>
                    <span className="text-gray-450 font-medium inline-block w-14">{isAr ? "العنوان:" : "Subject:"}</span>
                    <span className="font-bold text-gray-950">{simulatedEmailStatus.subject}</span>
                  </div>
                  <div>
                    <span className="text-gray-450 font-medium inline-block w-14">{isAr ? "الوقت:" : "Date:"}</span>
                    <span className="text-gray-600 font-mono">{simulatedEmailStatus.timestamp}</span>
                  </div>
                </div>

                {/* Body content */}
                <div className="p-4 bg-slate-50/20 max-h-48 overflow-y-auto font-mono text-[10.5px] text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {simulatedEmailStatus.body}
                </div>
              </div>

              <div className="text-[10px] text-amber-850 leading-normal flex items-start gap-1.5 bg-amber-100/40 p-3 rounded-lg border border-amber-200">
                <span className="font-bold">✨ {isAr ? "تنويه المحاكاة:" : "Simulation Guide:"}</span>
                <span>
                  {isAr 
                    ? "هذه محاكاة كاملة لتدفق البريد الإلكتروني. في النسخة الإنتاجية، يتم إرسال هذا الإشعار تلقائياً للعميل ولإدارة الأستاذ إسلام محمد لمتابعة المعاملة بالميناء." 
                    : "This block demonstrates the automated customer mailing protocol. In production, this transactional email fires through SES/Sendgrid API."}
                </span>
              </div>
            </div>
          )}

          {/* ACTIONS ROW FOR USER */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center max-w-xl mx-auto pt-4">
            {/* Print Ticket */}
            <button
              onClick={handlePrint}
              className="w-full sm:flex-1 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-3 px-4 rounded-xl text-xs transition-all flex items-center justify-center gap-1.5 border border-slate-300/80 cursor-pointer shadow-2xs"
            >
              <Printer className="h-4 w-4" />
              <span>{isAr ? "قاطعة وطباعة بطاقة المعاملة" : "Print clearance ticket"}</span>
            </button>

            {/* Sync to WhatsApp */}
            <a
              href={getWhatsAppLink(submittedRecord)}
              target="_blank"
              rel="noreferrer"
              className="w-full sm:flex-1 bg-[#25D366] hover:bg-[#20ba5a] text-white font-extrabold py-3 px-4 rounded-xl text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
            >
              <MessageSquare className="h-4 w-4" />
              <span>{isAr ? "إرسال الأوراق لـ أ/ إسلام على واتساب" : "Send files to Mr. Eslam via WhatsApp"}</span>
            </a>
          </div>

          <div className="text-center pt-2">
            <button
              onClick={handleResetForm}
              className="text-xs text-gray-400 hover:text-emerald-700 underline font-medium cursor-pointer"
            >
              {isAr ? "تقديم طلب جمركي جديد" : "Request another custom representative file"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
