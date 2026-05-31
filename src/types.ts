export enum EngineType {
  Petrol = "PETROL",
  Electric = "ELECTRIC",
  Hybrid = "HYBRID"
}

export enum OriginType {
  European = "EUROPEAN", // Eligible for European partnership zero-tariff agreements
  Standard = "STANDARD"  // Non-European origin with standard base tariff
}

export enum CustomsService {
  Triptyque = "TRIPTYQUE",
  FirstOwner = "FIRST_OWNER",
  ExpatriateInitiative = "EXPATRIATE_INITIATIVE",
  GeneralCargo = "GENERAL_CARGO",
  DiplomaticRelease = "DIPLOMATIC_RELEASE"
}

export enum StepStatus {
  DocumentReview = "DOCUMENT_REVIEW",
  ArrivalAtTerminal = "ARRIVAL_AT_TERMINAL",
  PhysicalInspection = "PHYSICAL_INSPECTION",
  CustomsDutyInvoice = "CUSTOMS_DUTY_INVOICE",
  PaymentVerified = "PAYMENT_VERIFIED",
  GateRelease = "GATE_RELEASE"
}

export interface TrackingStep {
  status: StepStatus;
  labelAr: string;
  labelEn: string;
  descriptionAr: string;
  descriptionEn: string;
  date?: string;
  completed: boolean;
  current: boolean;
}

export interface TrackingRecord {
  id: string; // e.g. ALM-1025
  clientId?: string; // Optional or mapped to user uid
  clientName: string;
  phone: string;
  service: CustomsService;
  cargoDescription: string;
  creationDate: string;
  lastUpdated: string;
  steps: TrackingStep[];
  additionalNotesAr?: string;
  additionalNotesEn?: string;
  uploadedFiles?: { name: string; size: string }[];
}

export interface ChatMessage {
  id: string;
  role: "user" | "model";
  text: string;
  timestamp: string;
}

export interface CalculationResult {
  estimatedCustomsTax: number; // الرسوم الجمركية الأساسية
  estimatedVat: number; // ضريبة القيمة المضافة 14%
  estimatedDevelopmentFee: number; // رسم تنمية الموارد
  estimatedTableTax: number; // ضريبة الجدول
  estimatedClearanceCosts: number; // خدمات التخليص والمناولة الإجمالية المقدرة
  totalRequirements: number; // المجموع الكلي بالجنيه المصري
  usdEquivalent?: number; // ما يعادل بالدولار للبنوك
  depositValueUsd?: number; // قيمة الوديعة في مبادرة المغتربين بالدولار
  notesAr: string[];
  notesEn: string[];
}
