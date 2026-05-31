import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { PRELOADED_TRACKING, generateTrackingSteps } from "../utils/customsData";
import { TrackingRecord, StepStatus, CustomsService } from "../types";
import { 
  Search, 
  MapPin, 
  Calendar, 
  Clock, 
  Ship, 
  User, 
  FileText, 
  Check, 
  AlertCircle, 
  RefreshCw, 
  Phone, 
  Lock, 
  ShieldAlert, 
  Sliders, 
  FileCode, 
  Save, 
  CheckCircle,
  HelpCircle,
  FolderOpen
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { db, handleFirestoreError, OperationType } from "../lib/firebase";
import { collection, query, where, onSnapshot, doc, updateDoc } from "firebase/firestore";
import AuthInterface from "./AuthInterface";

interface Props {
  lang: "ar" | "en";
  localRecords?: TrackingRecord[];
  onRecordUpdated?: (rec: TrackingRecord) => void;
}

export default function TransactionTracker({ lang, localRecords = [], onRecordUpdated }: Props) {
  const isAr = lang === "ar";
  const { user, profile } = useAuth();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRecord, setSelectedRecord] = useState<TrackingRecord | null>(null);
  const [errorText, setErrorText] = useState("");
  
  // Real-time Firestore records
  const [firestoreRequests, setFirestoreRequests] = useState<TrackingRecord[]>([]);
  const [loadingDb, setLoadingDb] = useState(false);

  // Admin Editing States
  const [adminStatus, setAdminStatus] = useState<StepStatus>(StepStatus.DocumentReview);
  const [notesAr, setNotesAr] = useState("");
  const [notesEn, setNotesEn] = useState("");
  const [saveLoading, setSaveLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  // Combine static fallback/preloaded records with newly submitted local ones
  const staticRecords: Record<string, TrackingRecord> = {};
  
  Object.keys(PRELOADED_TRACKING).forEach((k) => {
    staticRecords[k] = PRELOADED_TRACKING[k];
  });
  localRecords.forEach((rec) => {
    staticRecords[rec.id] = rec;
  });

  // Intellectually merge Firestore database and local simulation entries
  const allClientRequests: TrackingRecord[] = [...firestoreRequests];
  localRecords.forEach((local) => {
    if (user && local.clientId === user.uid && !allClientRequests.some((f) => f.id === local.id)) {
      allClientRequests.push(local);
    }
  });

  const allAdminRequests: TrackingRecord[] = [...firestoreRequests];
  localRecords.forEach((local) => {
    if (!allAdminRequests.some((f) => f.id === local.id)) {
      allAdminRequests.push(local);
    }
  });

  const allAvailableRequests: TrackingRecord[] = [...allAdminRequests];
  Object.keys(staticRecords).forEach((key) => {
    if (!allAvailableRequests.some((f) => f.id === key)) {
      allAvailableRequests.push(staticRecords[key]);
    }
  });

  // 1. Fetch real-time records according to Role
  useEffect(() => {
    if (!user) {
      setFirestoreRequests([]);
      return;
    }

    setLoadingDb(true);
    let q = query(collection(db, "requests"));

    // If client, restrict query to items belonging to this UID
    if (profile?.role === "client") {
      q = query(collection(db, "requests"), where("clientId", "==", user.uid));
    }

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const fetched: TrackingRecord[] = [];
        snapshot.forEach((docSnap) => {
          fetched.push({ id: docSnap.id, ...docSnap.data() } as TrackingRecord);
        });
        setFirestoreRequests(fetched);
        setLoadingDb(false);
      },
      (err) => {
        console.error("Firestore listener error:", err);
        setLoadingDb(false);
      }
    );

    return () => unsubscribe();
  }, [user, profile]);

  // If a record is selected, populate admin edit states
  useEffect(() => {
    if (selectedRecord) {
      // Find the current active step in selected record
      const activeStep = selectedRecord.steps.find((s) => s.current);
      if (activeStep) {
        setAdminStatus(activeStep.status);
      }
      setNotesAr(selectedRecord.additionalNotesAr || "");
      setNotesEn(selectedRecord.additionalNotesEn || "");
    }
  }, [selectedRecord]);

  // Search logic
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanId = searchQuery.trim().toUpperCase();
    if (!cleanId) return;

    // Search in our unified master record array which contains all options
    const found = allAvailableRequests.find((r) => r.id === cleanId);
    if (found) {
      setSelectedRecord(found);
      setErrorText("");
    } else {
      setSelectedRecord(null);
      setErrorText(
        isAr 
          ? "لم نجد معاملة جمركية بهذا الرمز حالياً. تأكد من كتابته بشكل صحيح (مثل ALM-7301)" 
          : "Tracking ID not found in port records. Try 'ALM-7301'."
      );
    }
  };

  const selectCode = (rec: TrackingRecord) => {
    setSelectedRecord(rec);
    setSearchQuery(rec.id);
    setErrorText("");
  };

  // Submit edits to Firestore (Admin Only) or local backup simulations on the fly
  const handleUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRecord) return;

    setSaveLoading(true);
    setSaveStatus(null);

    const todayStr = new Date().toISOString().split("T")[0];
    const updatedSteps = generateTrackingSteps(adminStatus, true);

    const updatedRec: TrackingRecord = {
      ...selectedRecord,
      steps: updatedSteps,
      lastUpdated: todayStr,
      additionalNotesAr: notesAr,
      additionalNotesEn: notesEn
    };

    try {
      const docRef = doc(db, "requests", selectedRecord.id);
      await updateDoc(docRef, {
        steps: updatedSteps,
        lastUpdated: todayStr,
        additionalNotesAr: notesAr,
        additionalNotesEn: notesEn
      });
    } catch (err: any) {
      console.warn("Firestore update not applied (simulated record or permission offline). Saving locally:", err);
    } finally {
      // Propagate state update upward so parent can store it in local state
      if (onRecordUpdated) {
        onRecordUpdated(updatedRec);
      }

      setSelectedRecord(updatedRec);
      setSaveStatus(isAr ? "تم تحديث حالة المعاملة بنجاح!" : "Clearance updated successfully!");
      setSaveLoading(false);
      setTimeout(() => setSaveStatus(null), 3000);
    }
  };

  const serviceLabels: Record<CustomsService, { ar: string; en: string }> = {
    [CustomsService.Triptyque]: { ar: "تربيتيك إفراج مؤقت", en: "Triptyque Pass" },
    [CustomsService.FirstOwner]: { ar: "مالك أول سيارة زيرو", en: "First Owner Zero" },
    [CustomsService.ExpatriateInitiative]: { ar: "مبادرة المغتربين سيارات", en: "Expatriate Scheme" },
    [CustomsService.GeneralCargo]: { ar: "بضائع عامة ورسائل تجارية", en: "General Cargo" },
    [CustomsService.DiplomaticRelease]: { ar: "إفراج جمركي دبلوماسي", en: "Diplomatic Release" }
  };

  return (
    <div className="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl border border-emerald-50 overflow-hidden font-sans" id="transaction-tracker-container">
      
      {/* Title Header Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-emerald-950 text-white p-6 relative">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/10 rounded-2xl border border-white/15 shadow-sm">
              <Ship className="h-6 w-6 text-amber-400" />
            </div>
            <div>
              <h2 className="text-xl font-black font-sans tracking-tight">
                {isAr ? "بوابة تتبع المعاملات الجمركية" : "Al-Muhammadiyah Customs Tracker"}
              </h2>
              <p className="text-xs text-emerald-100/90 font-light mt-1">
                {isAr 
                  ? "تحقق من ملفاتك بميناء الإسكندرية وسير مطابقة رقم الشاسيه بمختلف الساحات" 
                  : "Track document review, physical inspection and gate passes in real-time."}
              </p>
            </div>
          </div>

          {/* User badge */}
          {user && (
            <div className="bg-black/20 border border-white/10 px-4 py-2 rounded-xl text-xs space-y-0.5 max-w-sm">
              <span className="block font-medium text-gray-300">
                {isAr ? "مرحباً بجلسة الدخول:" : "Logged in Session:"}
              </span>
              <span className="block font-extrabold text-amber-400 font-mono text-[11px]">
                {user.email} ({(profile?.role === "admin" ? (isAr ? "المشرف العام" : "Admin Director") : (isAr ? "عميل شحنة" : "Cargo Client"))})
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="p-6 md:p-8">
        
        {/* Step 1: Search Console (For everyone, reads Firestore or static demo records) */}
        <div className="space-y-4 max-w-2xl mx-auto mb-10 text-center">
          <form onSubmit={handleSearch} className="relative rounded-2xl shadow-sm">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isAr ? "أدخل رمز المعاملة (مثل: ALM-7301)..." : "Enter tracking ticket (e.g., ALM-7301)..."}
              className="w-full bg-slate-50 border border-slate-300 rounded-2xl pl-12 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white text-gray-800 transition-all text-center font-mono font-bold uppercase"
            />
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <button
              type="submit"
              className="absolute inset-y-1.5 right-1.5 bg-emerald-700 hover:bg-emerald-850 text-white px-5 rounded-xl text-xs font-black transition-all cursor-pointer"
            >
              {isAr ? "استعلام" : "Track"}
            </button>
          </form>

          {/* Quick Click Codes for visitors */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            <span className="text-xs text-gray-400 font-medium">
              {isAr ? "ملفات محاكاة سريعة:" : "Quick sample files:"}
            </span>
            {Object.keys(staticRecords).map((id) => (
              <button
                key={id}
                type="button"
                onClick={() => selectCode(staticRecords[id])}
                className={`text-xs px-2.5 py-1 rounded-lg font-mono font-bold transition-all border shrink-0 cursor-pointer ${
                  selectedRecord?.id === id
                    ? "bg-emerald-800 text-white border-emerald-700 shadow-sm"
                    : "bg-slate-50 hover:bg-slate-100 text-emerald-850 border-slate-200"
                }`}
              >
                {id}
              </button>
            ))}
          </div>

          {errorText && (
            <div className="bg-red-50 text-red-800 p-3 rounded-lg text-xs inline-flex items-center gap-2 mx-auto justify-center">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{errorText}</span>
            </div>
          )}
        </div>

        {/* Dynamic client shipment catalog list (Show if logged in and not admin) */}
        {user && profile?.role === "client" && (
          <div className="mb-10 p-5 bg-emerald-50/40 rounded-3xl border border-emerald-100">
            <h3 className="text-sm font-black text-emerald-950 mb-3 flex items-center gap-2">
              <FolderOpen className="h-4 w-4 text-emerald-705" />
              <span>{isAr ? "ملفات شحن واستخلاص مسجلة باسمك:" : "My Customs Dossier & Shipments"}</span>
            </h3>
            
            {loadingDb ? (
              <div className="text-center py-4 text-xs text-gray-400 flex items-center justify-center gap-1.5">
                <RefreshCw className="h-3.5 w-3.5 animate-spin text-emerald-600" />
                <span>{isAr ? "جاري جلب ملفاتك من قواعد البيانات..." : "Loading records..."}</span>
              </div>
            ) : allClientRequests.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {allClientRequests.map((req) => {
                  const currentStep = req.steps?.find((s) => s.current);
                  return (
                    <button
                      key={req.id}
                      onClick={() => selectCode(req)}
                      className={`p-4 rounded-xl border text-right transition-all cursor-pointer ${
                        selectedRecord?.id === req.id 
                          ? "bg-white border-emerald-700 shadow-sm ring-1 ring-emerald-700" 
                          : "bg-white border-slate-200 hover:border-slate-350"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-mono text-xs font-black text-emerald-800">{req.id}</span>
                        <span className="text-[10px] text-gray-400 font-medium">{req.creationDate}</span>
                      </div>
                      <span className="block text-xs font-black text-gray-900 truncate">{req.cargoDescription}</span>
                      <span className="block text-[11px] text-gray-400 mt-1 truncate">
                        {isAr ? "نظام المعاملة:" : "Clearance:"} {serviceLabels[req.service]?.[lang === "ar" ? "ar" : "en"] || req.service}
                      </span>
                      {currentStep && (
                        <span className="inline-block mt-2 text-[10px] font-black px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                          {isAr ? currentStep.labelAr : currentStep.labelEn}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            ) : (
              <p className="text-xs text-gray-400 text-center py-3">
                {isAr 
                  ? "لا توجد طلبات تخليص مسجلة باسمك حالياً. يمكنك ملء الطلب في صفحة 'تقديم طلب وكالة' لتظهر شحنتك هنا." 
                  : "No submissions are bound to your account profile yet. Fill a customs request in the apply tab to sync."}
              </p>
            )}
          </div>
        )}

        {/* DUAL MODE split panels based on user profile of "admin" */}
        {user && profile?.role === "admin" ? (
          /* =======================================
             ADMIN COMMAND CONTROLLER (EXECUTIVE CONTROL)
             ======================================= */
          <div className="border border-amber-250 bg-amber-50/15 rounded-3xl p-6 mb-10 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-gray-200/80 gap-3">
              <div className="flex items-center gap-2">
                <Sliders className="h-5 w-5 text-amber-500" />
                <div>
                  <h3 className="text-base font-black text-slate-950">
                    {isAr ? "لوحة الإشراف الجمركي وإدارة الملفات" : "Executive Owner Clearance Dashboard"}
                  </h3>
                  <p className="text-[11px] text-gray-500">
                    {isAr ? "تحرير حالة الشحنة ورفع المطابقة بميناء الإسكندرية مباشرة للعملاء" : "Authorize status transitions and audit client-uploaded invoices."}
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-black bg-amber-100 text-amber-900 px-3 py-1 rounded-full shrink-0">
                🔒 {isAr ? "صلاحيات المشرف الفني" : "Superuser Mode Active"}
              </span>
            </div>

            {/* List of submittals on database */}
            <div>
              <h4 className="text-xs font-extrabold text-gray-700 mb-3">
                {isAr ? "جميع الطلبات المرسلة من العملاء في الوقت الفعلي:" : "Inbound Client Clearances Requests Log:"}
              </h4>
              {loadingDb ? (
                <div className="text-center py-5 text-xs text-gray-400 flex items-center justify-center gap-1.5">
                  <RefreshCw className="h-4 w-4 animate-spin text-amber-500" />
                  <span>{isAr ? "جاري سحب المعاملات..." : "Polling databases..."}</span>
                </div>
              ) : allAdminRequests.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {allAdminRequests.map((req) => {
                    const currentStep = req.steps?.find((s) => s.current);
                    return (
                      <button
                        key={req.id}
                        onClick={() => selectCode(req)}
                        className={`p-4 rounded-xl border text-right transition-all cursor-pointer bg-white ${
                          selectedRecord?.id === req.id 
                            ? "border-amber-500 shadow-sm ring-1 ring-amber-500 bg-amber-50/10" 
                            : "border-slate-200 hover:border-amber-300"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-mono text-xs font-black text-amber-800">{req.id}</span>
                          <span className="text-[10px] text-gray-400 font-medium">{req.creationDate}</span>
                        </div>
                        <span className="block text-xs font-black text-gray-900 truncate">{req.cargoDescription}</span>
                        <div className="text-[10px] text-slate-500 mt-1 font-semibold space-y-0.5">
                          <div>👤 {req.clientName}</div>
                          <div>📞 {req.phone}</div>
                        </div>
                        {req.uploadedFiles && req.uploadedFiles.length > 0 && (
                          <div className="mt-2 text-[10px] text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md inline-block">
                            📂 {req.uploadedFiles.length} {isAr ? "ملفات مرفقة" : "Documents Attached"}
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <p className="text-xs text-gray-400 text-center py-4 bg-white/70 rounded-xl border border-dashed border-gray-200/85">
                  {isAr ? "لا توجد معاملات جمركية مسجلة باسم العملاء حتى الآن." : "No client submissions uploaded on Firebase yet."}
                </p>
              )}
            </div>

            {/* Status Editing form for selected record */}
            {selectedRecord && (
              <form onSubmit={handleUpdateStatus} className="bg-white border border-slate-200 rounded-2xl p-5 space-y-5">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <span className="text-xs font-bold text-gray-700">
                    {isAr ? `تحديث المعاملة الجمركية الجارية: ` : `Editing docket: `}
                    <span className="font-mono text-emerald-800 font-black">{selectedRecord.id}</span>
                  </span>
                  
                  {selectedRecord.uploadedFiles && selectedRecord.uploadedFiles.length > 0 && (
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block font-medium">{isAr ? "المستندات المرفوعة جمركياً:" : "Port invoices attached:"}</span>
                      <div className="flex flex-col gap-1 mt-1 text-left">
                        {selectedRecord.uploadedFiles.map((f, i) => (
                          <span key={i} className="inline-flex items-center gap-1 text-[10px] bg-indigo-50 text-indigo-800 py-0.5 px-2 rounded-md font-semibold font-sans">
                            📝 {f.name} ({f.size})
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Step Selector */}
                  <div className="space-y-1.5 text-right">
                    <label className="block text-xs font-bold text-gray-700">
                      {isAr ? "الخطوة الجمركية الحالية بالشاحنة:" : "Current Port Terminal Stage:"}
                    </label>
                    <select
                      value={adminStatus}
                      onChange={(e) => setAdminStatus(e.target.value as StepStatus)}
                      className="w-full bg-slate-50 border border-slate-350 rounded-xl px-3 py-2 text-xs text-gray-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 font-sans"
                    >
                      <option value={StepStatus.DocumentReview}>{isAr ? "مراجعة المستندات وتجهيز الملف" : "Document Review & Invoice-Prep"}</option>
                      <option value={StepStatus.ArrivalAtTerminal}>{isAr ? "وصول الشحنة لساحة الجمارك" : "Arrival at terminal yard"}</option>
                      <option value={StepStatus.PhysicalInspection}>{isAr ? "المعاينة الفنية والكشف الفيزيائي" : "Physical committee valuation"}</option>
                      <option value={StepStatus.CustomsDutyInvoice}>{isAr ? "إصدار كشف الرسوم والجمارك" : "Customs Invoice calculation"}</option>
                      <option value={StepStatus.PaymentVerified}>{isAr ? "تأكيد الدفع والتخليص الجمركي المالي" : "Financial check bank verify"}</option>
                      <option value={StepStatus.GateRelease}>{isAr ? "الإفراج النهائي وخروج البوابة" : "Gate Release Complete"}</option>
                    </select>
                  </div>

                  {/* Customer Info display */}
                  <div className="text-right text-xs leading-5 text-gray-600 bg-slate-50 p-3 rounded-xl border border-slate-150">
                    <div>👤 <strong>{isAr ? "صاحب الشحنة:" : "Cargo Principal:"}</strong> {selectedRecord.clientName}</div>
                    <div>📞 <strong>{isAr ? "جوال التواصل:" : "Mobile No:"}</strong> {selectedRecord.phone}</div>
                    <div>📂 <strong>{isAr ? "وصف البضائع:" : "Cargo Specs:"}</strong> {selectedRecord.cargoDescription}</div>
                  </div>
                </div>

                {/* Notes in Arabic and English */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-right">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-gray-700">
                      {isAr ? "مذكرة المعاينة والملاحظات الجارية (بالعربية):" : "Official Field Notes (Ar):"}
                    </label>
                    <textarea
                      value={notesAr}
                      onChange={(e) => setNotesAr(e.target.value)}
                      rows={3}
                      className="w-full bg-slate-50 border border-slate-350 rounded-xl px-3.5 py-2 text-xs text-gray-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 font-sans"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-gray-700">
                      {isAr ? "مذكرة المعاينة والملاحظات الجارية (بالإنجليزية):" : "Official Field Notes (En):"}
                    </label>
                    <textarea
                      value={notesEn}
                      onChange={(e) => setNotesEn(e.target.value)}
                      rows={3}
                      className="w-full bg-slate-50 border border-slate-350 rounded-xl px-3.5 py-2 text-xs text-gray-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 font-sans"
                    />
                  </div>
                </div>

                {/* Save actions */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  {saveStatus && (
                    <span className="text-xs font-bold text-emerald-800 flex items-center gap-1.5">
                      <CheckCircle className="h-4 w-4 text-emerald-600" />
                      {saveStatus}
                    </span>
                  )}
                  <div className="mr-auto">
                    <button
                      type="submit"
                      disabled={saveLoading}
                      className="bg-amber-500 hover:bg-amber-600 text-emerald-950 font-black px-5 py-2.5 rounded-xl text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md disabled:opacity-50"
                    >
                      <Save className="h-4 w-4" />
                      <span>{saveLoading ? "جاري الإرسال والمزامنة..." : "حفظ ومزامنة الحالة للعميل"}</span>
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>
        ) : null}

        {/* Selected Record Timeline Details */}
        {selectedRecord ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Box: Cargo Summary Details */}
            <div className="lg:col-span-5 bg-slate-50/75 rounded-3xl p-6 border border-slate-200/70 space-y-5">
              <div className="flex items-center justify-between border-b border-gray-200 pb-4">
                <span className="text-xs font-mono font-black text-emerald-800 bg-emerald-50 px-3.5 py-1.5 rounded-lg border border-emerald-100 shadow-3xs">
                  {selectedRecord.id}
                </span>
                <span className="text-xs text-gray-400 font-semibold">
                  {isAr ? "جمارك ميناء الإسكندرية" : "Alexandria Seaport Terminal"}
                </span>
              </div>

              {/* Data Grid info */}
              <div className="space-y-4 text-xs text-gray-750">
                <div className="flex gap-2.5 items-start">
                  <User className="h-4.5 w-4.5 text-emerald-700 shrink-0 mt-0.5" />
                  <div>
                    <span className="block text-gray-400 text-[10px] font-bold">{isAr ? "العميل المستورد" : "Client Representative"}</span>
                    <span className="font-extrabold text-gray-900 text-sm">{selectedRecord.clientName}</span>
                  </div>
                </div>

                <div className="flex gap-2.5 items-start">
                  <FileText className="h-4.5 w-4.5 text-emerald-700 shrink-0 mt-0.5" />
                  <div>
                    <span className="block text-gray-400 text-[10px] font-bold">{isAr ? "تفاصيل الشحنة والمستندات" : "Cargo Physical Details"}</span>
                    <span className="font-black text-gray-950 leading-relaxed text-xs">{selectedRecord.cargoDescription}</span>
                  </div>
                </div>

                <div className="flex gap-2.5 items-start">
                  <MapPin className="h-4.5 w-4.5 text-emerald-700 shrink-0 mt-0.5" />
                  <div>
                    <span className="block text-gray-400 text-[10px] font-bold">{isAr ? "الموقع الجغرافي والترميز" : "Terminal Point Location"}</span>
                    <span className="font-semibold text-gray-850">
                      {isAr 
                        ? "دائرة جمارك السيارات - المنطقة اللوجستية بميناء الإسكندرية" 
                        : "Alexandria Customs Port - Automotive Logistics Zone"}
                    </span>
                  </div>
                </div>

                {/* File attachments download list (Bilingual) */}
                {selectedRecord.uploadedFiles && selectedRecord.uploadedFiles.length > 0 && (
                  <div className="pt-3 border-t border-slate-150 space-y-2">
                    <span className="block text-[10px] font-extrabold text-indigo-805 tracking-wide uppercase">
                      📂 {isAr ? "الدوسيه الجمركي المرفق (الأوراق الرسمية):" : "Attached Custom Invoices & Certificates:"}
                    </span>
                    <div className="space-y-1.5">
                      {selectedRecord.uploadedFiles.map((f, idx) => (
                        <div key={idx} className="flex items-center justify-between p-2.5 bg-indigo-50/50 rounded-xl border border-indigo-100 text-[11px] font-bold text-slate-800">
                          <span className="truncate max-w-[190px]">📝 {f.name}</span>
                          <span className="text-[10px] font-mono font-medium text-slate-400 shrink-0">{f.size}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4 pt-3.5 border-t border-gray-150">
                  <div className="flex gap-2 items-center">
                    <Calendar className="h-4 w-4 text-gray-405 shrink-0" />
                    <div>
                      <span className="block text-gray-400 text-[9px] font-bold">{isAr ? "تاريخ التقديم" : "Filed Date"}</span>
                      <span className="font-bold text-[11px] text-gray-800 font-mono">{selectedRecord.creationDate}</span>
                    </div>
                  </div>
                  <div className="flex gap-2 items-center">
                    <Clock className="h-4 w-4 text-gray-405 shrink-0" />
                    <div>
                      <span className="block text-gray-400 text-[9px] font-bold">{isAr ? "آخر تحديث رسمي" : "Last Sweep"}</span>
                      <span className="font-bold text-[11px] text-gray-800 font-mono">{selectedRecord.lastUpdated}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Remarks/Status Details */}
              <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-100/60 shadow-3xs">
                <span className="text-[10px] uppercase font-bold text-emerald-800 tracking-wider block mb-1">
                  {isAr ? "مذكرة المعاينة والمطابقة الفنية بموجيتك:" : "OFFICIAL SWEEP REMARKS & AUDITS:"}
                </span>
                <p className="text-xs text-emerald-950 leading-relaxed font-sans font-medium">
                  {isAr ? selectedRecord.additionalNotesAr : selectedRecord.additionalNotesEn}
                </p>
              </div>

              {/* Direct call Eslam Mohamed */}
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-150 text-center space-y-2">
                <span className="text-[11px] text-gray-500 font-medium block">
                  {isAr ? "هل تود التحدث المباشر مع الأخصائي أستاذ إسلام؟" : "Want direct dispatch with administrator Eslam?"}
                </span>
                <a
                  href={`tel:01274833844`}
                  className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-2 px-4 rounded-xl text-xs transition-all w-full justify-center shadow-xs cursor-pointer"
                >
                  <Phone className="h-3.5 w-3.5 animate-bounce" />
                  <span>01274833844 - أ / إسلام محمد جمرك</span>
                </a>
              </div>
            </div>

            {/* Right Box: Vertical Progress Stepper */}
            <div className="lg:col-span-7 pl-2">
              <h3 className="text-sm font-black text-gray-805 mb-6 flex items-center gap-2">
                <RefreshCw className="h-4 w-4 text-emerald-600 animate-spin" style={{ animationDuration: "14s" }} />
                <span>{isAr ? "خط سير وتوقيت الإفراج الجمركي بميناء الإسكندرية" : "Compliance Clearances Progress Pipeline"}</span>
              </h3>

              {(() => {
                const currentStepIndex = selectedRecord.steps.findIndex((s) => s.current);
                const lastCompletedIndex = selectedRecord.steps.reduce((acc, step, index) => step.completed ? index : acc, -1);
                const progressIndex = currentStepIndex !== -1 ? currentStepIndex : lastCompletedIndex;
                const totalSteps = selectedRecord.steps.length;

                return (
                  <div className="relative mr-2 pr-6 space-y-8 pb-3 text-right">
                    {/* Background Progress Railway Line */}
                    <div className="absolute right-[-1px] top-3 bottom-6 w-[2px] bg-slate-200" />
                    
                    {/* Animated Emerald Progress Filler Line */}
                    <motion.div 
                      className="absolute right-[-1px] top-3 w-[2px] bg-emerald-600 origin-top"
                      style={{ bottom: "24px" }}
                      initial={{ scaleY: 0 }}
                      animate={{ scaleY: Math.max(0, progressIndex) / Math.max(1, totalSteps - 1) }}
                      transition={{ type: "spring", stiffness: 80, damping: 15, delay: 0.1 }}
                    />

                    {selectedRecord.steps && selectedRecord.steps.map((step, idx) => {
                      return (
                        <div key={idx} className="relative group">
                          {/* Step node indicator icon */}
                          <motion.span 
                            key={`${selectedRecord.id}-${idx}-${step.current}-${step.completed}`}
                            initial={{ scale: 0.7, opacity: 0 }}
                            animate={{ scale: step.current ? 1.25 : 1, opacity: 1 }}
                            transition={{ type: "spring", stiffness: 300, damping: 15 }}
                            className={`absolute -right-[33px] top-1.5 flex h-4.5 w-4.5 rounded-full items-center justify-center ring-4 ring-white ${
                              step.current 
                                ? "bg-emerald-600 ring-emerald-100 z-10" 
                                : step.completed 
                                ? "bg-emerald-800 text-white" 
                                : "bg-gray-200"
                            }`}
                          >
                            {step.completed && !step.current ? (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ duration: 0.25, ease: "easeOut" }}
                              >
                                <Check className="h-2.5 w-2.5 text-white stroke-[3px]" />
                              </motion.div>
                            ) : step.current ? (
                              <motion.div
                                animate={{ scale: [1, 1.2, 1], opacity: [0.8, 1, 0.8] }}
                                transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
                                className="h-2 w-2 bg-white rounded-full"
                              />
                            ) : null}
                          </motion.span>

                          {/* Step textual description */}
                          <motion.div 
                            initial={{ opacity: 0.7, x: 6 }}
                            animate={{ 
                              opacity: step.current ? 1 : step.completed ? 0.95 : 0.5,
                              x: 0,
                              scale: step.current ? 1.015 : 1
                            }}
                            transition={{ duration: 0.4 }}
                            className="space-y-1 pr-1.5 origin-right"
                          >
                            <div className="flex items-center justify-between gap-2">
                              <h4 className={`text-xs font-black transition-colors duration-300 ${
                                step.current 
                                  ? "text-emerald-700 text-sm" 
                                  : step.completed 
                                  ? "text-gray-900" 
                                  : "text-gray-400"
                              }`}>
                                {isAr ? step.labelAr : step.labelEn}
                              </h4>
                              {step.date && (
                                <motion.span 
                                  initial={{ opacity: 0, scale: 0.8 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  transition={{ delay: 0.15 }}
                                  className="text-[10px] text-emerald-800 font-mono bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 shrink-0 font-bold animate-fade-in"
                                >
                                  {step.date}
                                </motion.span>
                              )}
                            </div>
                            <p className={`text-xs leading-relaxed transition-colors duration-300 ${
                              step.current 
                                ? "text-emerald-950 font-semibold" 
                                : step.completed 
                                ? "text-gray-550" 
                                : "text-gray-400"
                            }`}>
                              {isAr ? step.descriptionAr : step.descriptionEn}
                            </p>
                          </motion.div>
                        </div>
                      );
                    })}
                  </div>
                );
              })()}
            </div>
          </div>
        ) : (
          <div className="p-10 text-center border-2 border-dashed border-gray-200 rounded-3xl bg-slate-50/50 max-w-lg mx-auto">
            <Search className="h-10 w-10 text-gray-300 mx-auto mb-3" />
            <h4 className="text-sm font-black text-gray-700">{isAr ? "بانتظار رقم الاستعلام" : "No Docket ID selected"}</h4>
            <p className="text-xs text-slate-400 mt-1 pb-4 leading-normal font-sans font-light">
              {isAr 
                ? "يرجى كتابة رمز التتبع، أو النقر على النماذج العلوية الجاهزة للمعاينة المباشرة وتجربة نظام المتابعة الجمركية." 
                : "Type your tracking ticket number, or use any of proposed samples to simulate the port clearance flow."}
            </p>

            {/* Login encouragement widget */}
            {!user && (
              <div className="pt-6 border-t border-slate-200 space-y-4">
                <span className="text-xs text-gray-500 font-bold block">
                  🔐 {isAr ? "ميزة خاصة: تابع شحنتك تلقائياً بربط حسابك:" : "Feature: Auto-track shipments bound to your account"}
                </span>
                <AuthInterface lang={lang} defaultRole="client" />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
