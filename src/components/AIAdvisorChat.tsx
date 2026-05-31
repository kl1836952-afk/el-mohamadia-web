import { GoogleGenAI } from '@google/genai';
import React, { useState, useRef, useEffect } from "react";
import { ChatMessage } from "../types";
import { Send, MessageSquare, Bot, User, Trash2, HelpCircle, Phone, Sparkles } from "lucide-react";

const ai = new GoogleGenAI({ apiKey: 'AIzaSyA2MihDQLpRKYAFi0kKRJoBPFi82sZ3GIc' });


interface Props {
  lang: "ar" | "en";
}

const QUICK_QUESTIONS_AR = [
  "ما هي شروط مبادرة سيارات المغتربين؟",
  "ما هي الأوراق المطلوبة للإفراج بنظام مالك أول؟",
  "كيف يعمل نظام التربيتيك لإدخال سيارة مؤقتة؟",
  "ما هي خدمات التخليص التجاري بميناء الإسكندرية؟"
];

const QUICK_QUESTIONS_EN = [
  "What are the Expatriate Initiative requirements?",
  "What papers are needed for First Owner release?",
  "How does Triptyque temporary entry work?",
  "What commercial cargo services do you handle?"
];

export default function AIAdvisorChat({ lang }: Props) {
  const isAr = lang === "ar";

  // Welcome message based on language
  const getInitialMessages = (): ChatMessage[] => [
    {
      id: "welcome-1",
      role: "model",
      text: isAr
        ? "أهلاً بك في شركة المحمدية للتخليص الجمركي بميناء الإسكندرية وموانئ مصر! أنا مساعدك الجمركي الذكي المدعوم بالذكاء الاصطناعي 🧠✨ تحت إشراف أ/ إسلام محمد.\n\nكيف يمكنني مساعدتك اليوم بخصوص نظام التربيتيك، استيراد السيارات مبادرة المغتربين، سيارات المالك الأول، أو تخليص البضائع التجارية العامة؟"
        : "Welcome to Al-Muhammadiyah Customs Clearance at Alexandria Port! I am your AI intelligent customs advisor 🧠✨ under the direct guidance of Mr. Eslam Mohamed.\n\nHow can I support you today with Triptyque temporary entry, expatriate initiatives, first-owner car imports, or commercial general cargo clearance?",
      timestamp: new Date().toLocaleTimeString(isAr ? "ar-EG" : "en-US", { hour: "2-digit", minute: "2-digit" })
    }
  ];

  const [messages, setMessages] = useState<ChatMessage[]>(getInitialMessages());
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // Reset chat logic
  const handleResetChat = () => {
    if (window.confirm(isAr ? "هل تريد مسح المحادثة وبدء جلسة جديدة؟" : "Clear conversation and start fresh?")) {
      setMessages(getInitialMessages());
    }
  };

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      text: textToSend,
      timestamp: new Date().toLocaleTimeString(isAr ? "ar-EG" : "en-US", { hour: "2-digit", minute: "2-digit" })
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);
    const handleSendMessage = async (textToSend: string) => {
      if (!textToSend.trim() || isLoading) return;

      const userMessage: ChatMessage = {
        id: `user-${Date.now()}`,
        role: 'user',
        text: textToSend,
        timestamp: new Date().toLocaleTimeString(isAr ? 'ar-EG' : 'en-US', { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, userMessage]);
      setInputValue('');
      setIsLoading(true);

      try {
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: textToSend,
        });

        const replyText = response.text || '';

        setMessages((prev) => [
          ...prev,
          { id: `ai-${Date.now()}`, role: 'model', text: String(replyText), timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) },
        ]);
      } catch (error) {
        console.error('Error with Gemini AI:', error);
      } finally {
        setInputValue('');
        setIsLoading(false);
      }
    };


    try {
      // Map history for Gemini
      const conversationHistory = messages.slice(1).map((m) => ({
        role: m.role,
        text: m.text
      }));

      const response = await fetch("/api/consult", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: textToSend,
          history: conversationHistory
        })
      });

      const data = await response.json();

      const botMessage: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: "model",
        text: data.text || (isAr ? "عذراً، حدث خطأ أثناء الاتصال بالخادم." : "Apologies, could not reach custom services."),
        timestamp: new Date().toLocaleTimeString(isAr ? "ar-EG" : "en-US", { hour: "2-digit", minute: "2-digit" })
      };

      setMessages((prev) => [...prev, botMessage]);

    } catch (error) {
      console.error("Failed to connect to AI consultant api:", error);
      const errorMessage: ChatMessage = {
        id: `err-${Date.now()}`,
        role: "model",
        text: isAr
          ? "المعذرة، واجهت مشكلة في الوصول للمقاسات الجمركية لجميني. يمكنك دوماً الاتصال المباشر بأستاذ إسلام محمد 01274833844 للرد الفوري بخصوص أوراقك."
          : "Sorry, I had an issue connecting to the Gemini knowledge server. You can always contact Mr. Eslam Mohamed direct at 01274833844 for instant support.",
        timestamp: new Date().toLocaleTimeString(isAr ? "ar-EG" : "en-US", { hour: "2-digit", minute: "2-digit" })
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickQuestion = (question: string) => {
    handleSendMessage(question);
  };

  return (
    <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-emerald-50 overflow-hidden flex flex-col h-[650px]" id="ai-advisor-chat-container">
      {/* Chat header */}
      <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-emerald-950 p-4 text-white flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="h-10 w-10 bg-emerald-700 rounded-full border-2 border-emerald-400/40 flex items-center justify-center text-white">
              <Bot className="h-5 w-5 text-emerald-100" />
            </div>
            <div className="absolute bottom-0 right-0 h-3 w-3 bg-emerald-500 rounded-full border-2 border-white animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="font-bold text-sm leading-none">
                {isAr ? "مساعد المحمدية الجمركي الذكي" : "Al-Muhammadiyah Custom Assistant"}
              </h3>
              <Sparkles className="h-3.5 w-3.5 text-emerald-300 animate-spin" style={{ animationDuration: "6s" }} />
            </div>
            <p className="text-[10px] text-emerald-200 mt-1">
              {isAr ? "إجابات فورية ومعتمدة تحت إشراف أ/ إسلام محمد" : "AI powered with Mr. Eslam Mohamed insights"}
            </p>
          </div>
        </div>

        <button
          onClick={handleResetChat}
          title={isAr ? "مسح المحادثة" : "Clear conversation"}
          className="p-2 text-emerald-200 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
        >
          <Trash2 className="h-4.5 w-4.5" />
        </button>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 bg-slate-50 relative">
        {/* Subtle decorative watermark */}
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.02] select-none pointer-events-none">
          <MessageSquare size={240} className="text-emerald-950" />
        </div>

        {messages.map((msg) => {
          const isBot = msg.role === "model";
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 relative z-10 ${isBot ? "justify-start" : "justify-end"
                }`}
            >
              {/* Avatar on Left for Bot */}
              {isBot && (
                <div className="h-8 w-8 rounded-full bg-emerald-150 border border-emerald-200 text-emerald-800 flex items-center justify-center shrink-0">
                  <Bot className="h-4 w-4" />
                </div>
              )}

              {/* Message Bubble */}
              <div
                className={`max-w-[82%] rounded-2xl p-3.5 shadow-xs text-sm leading-relaxed whitespace-pre-wrap ${isBot
                    ? "bg-white text-gray-800 rounded-tl-none border border-slate-200/80 font-sans"
                    : "bg-emerald-750 text-white rounded-tr-none font-sans font-medium"
                  }`}
              >
                {msg.text}
                <span
                  className={`block text-[9px] mt-2 font-mono text-right ${isBot ? "text-gray-400" : "text-emerald-200"
                    }`}
                >
                  {msg.timestamp}
                </span>
              </div>

              {/* Avatar on Right for User */}
              {!isBot && (
                <div className="h-8 w-8 rounded-full bg-emerald-100 border border-emerald-200 text-emerald-800 flex items-center justify-center shrink-0">
                  <User className="h-4 w-4" />
                </div>
              )}
            </div>
          );
        })}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex items-start gap-3 justify-start relative z-10">
            <div className="h-8 w-8 rounded-full bg-emerald-150 border border-emerald-200 text-emerald-800 flex items-center justify-center shrink-0">
              <Bot className="h-4 w-4 animate-bounce" />
            </div>
            <div className="bg-white text-gray-800 rounded-2xl rounded-tl-none p-4 shadow-xs border border-slate-200/80">
              <div className="flex items-center gap-1.5 py-1">
                <div className="h-2 w-2 bg-emerald-600 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <div className="h-2 w-2 bg-emerald-600 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <div className="h-2 w-2 bg-emerald-600 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick suggestions footer */}
      <div className="bg-white px-4 py-2 border-t border-slate-100 flex flex-wrap gap-1.5 z-10 justify-end">
        {(isAr ? QUICK_QUESTIONS_AR : QUICK_QUESTIONS_EN).map((q, idx) => (
          <button
            key={idx}
            type="button"
            disabled={isLoading}
            onClick={() => handleQuickQuestion(q)}
            className="text-[10px] md:text-[11px] font-medium bg-emerald-50 text-emerald-900 border border-emerald-100 py-1 px-2.5 rounded-full hover:bg-emerald-100/70 transition-colors shrink-0 disabled:opacity-50 cursor-pointer"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Input container */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage(inputValue);
        }}
        className="p-3 bg-white border-t border-slate-200 flex items-center gap-2"
      >
        <input
          type="text"
          value={inputValue}
          disabled={isLoading}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder={
            isAr
              ? "اكتب استفسارك الجمركي هنا (مثال: جمارك سيارة مرسيدس)..."
              : "Type your customs question here..."
          }
          className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white text-gray-800 transition-all disabled:opacity-75"
        />
        <button
          type="submit"
          disabled={isLoading || !inputValue.trim()}
          className="h-10 w-10 bg-emerald-750 text-white rounded-xl flex items-center justify-center hover:bg-emerald-850 active:scale-95 transition-all disabled:opacity-40 shrink-0 cursor-pointer"
        >
          <Send className={`h-4.5 w-4.5 ${isAr ? "transform rotate-180" : ""}`} />
        </button>
      </form>
    </div>
  );
}
