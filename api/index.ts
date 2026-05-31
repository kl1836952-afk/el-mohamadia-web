import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

const PORT = 3000;

// Initialize Google Gen AI with safety and fallback
let ai: GoogleGenAI | null = null;
try {
    if (process.env.GEMINI_API_KEY) {
        ai = new GoogleGenAI({
            apiKey: process.env.GEMINI_API_KEY,
            httpOptions: {
                headers: {
                    'User-Agent': 'aistudio-build',
                }
            }
        });
        console.log("Gemini Gen AI successfully initialized on the server.");
    } else {
        console.warn("GEMINI_API_KEY is not set. Chatbot will run in simulated mode.");
    }
} catch (err) {
    console.error("Failed to initialize Google Gen AI:", err);
}

// System prompt instructing Gemini on Al-Muhammadiyah Customs and Egyptian customs procedures
const SYSTEM_INSTRUCTION = `
أنت المستشار الجمركي الذكي لـ "شركة المحمدية للتخليص الجمركي" (Al-Muhammadiyah Customs).
الشركة رائدة في مجال الاستخلاص والتخليص الجمركي لسيارات الأفراد والشركات والرسائل التجارية والواردات بميناء الإسكندرية البحري وكافة موانئ جمهورية مصر العربية.
مدير الشركة وصاحبها ورئيس مجلس الإدارة هو: أستاذ إسلام محمد (رقم الهاتف والواتساب: 01274833844، الإيميل: info@almuhammadiyah.com).

معلومات فنية هامة يجب الإلمام بها وإفادة العميل بها عند سؤاله:
1. الأنظمة الجمركية المتاحة في مصر للسيارات:
   - نظام التربيتيك (التربتك - الإفراج المؤقت): مخصص للسيارات المملوكة للمصريين المقيمين بالخارج أو السياح العرب والأجانب الراغبين في دخول سياراتهم مؤقتاً لقضاء فترة الإجازة (لا تزيد عن 6 أشهر عادة) دون دفع جمارك كاملة مقابل دفتر التربتك والبطاقة الجمركية وضمان نادي السيارات، مع تجديد الإفراج دورياً.
   - نظام مالك أول: يسمح للمصريين باستيراد سيارة شخصية شريطة أن تكون بشراء سنة الموديل (تكون جديدة تماماً "زيرو") وباسم المشتري مباشرة (مالك أول من المصنع/المعرض) وقت الشراء والتملك في نفس السنة.
   - مبادرة سيارات المصريين بالخارج (مبادرة المغتربين): تتيح للمغترب استيراد سيارة شخصية معفاة 100% من الضرائب والجمارك ومختلف الرسوم مقابل تحويل وديعة دولارية (بالعملة الأجنبية) لصالح وزارة المالية المصرية تستحق بعد 5 سنوات ويتم استردادها بالكامل بالجنيه المصري بسعر الصرف في وقت الاسترداد.
   - الإفراج الدبلوماسي: تخليص سيارات السفارات، القنصليات، الهيئات الدبلوماسية، والبعثات الدولية طبقاً للإعفاءات والاتفاقيات الدولية المقررة قانوناً.
   - البضائع العامة والرسائل التجارية: تخليص الحاويات الكاملة والمشتركة، المواد الخام، قطع الغيار، ومختلف الشحنات الاستيرادية مع فحص الأوراق الصحية، المنسوجات، الصادرات، وإصدار شهادات المنشأ والفواتير والاعتمادات.

قواعد الإجابة للعملاء:
- أجب باللهجة المصرية أو لغة عربية فصحى مبسطة وقريبة لقلوب عملائنا المصريين المغتربين والتجار، بطريقة مهذبة، مشجعة، ومهنية للغاية.
- طمئن العميل دائماً بأن شركة المحمدية للتخليص الجمركي وإدارة أ/ إسلام محمد لديهم خبرة واسعة وعلاقات وطيدة لإنهاء كافة الإجراءات بأقصى سرعة وأفضل تكلفة وتفادي الغرامات وتأخير الإفراج الجمركي.
- شجع المستخدم دائماً على إتمام طلب الاستشارة عبر التطبيق أو الضغط على زر "تواصل عبر واتساب" للتواصل المباشر مع أ/ إسلام محمد (01274833844) لإرسال صور المستندات والحصول على تسعيرة دقيقة فورية ومجانية، لأن القوانين والأسعار تتغير باستمرار وتحتاج لمعاينة دقيقة للمستندات مثل بوليصة الشحن، شهادة المنشأ، وفاتورة الشراء.
- لا تذكر تفاصيل تقنية مثل الـ API أو تفاصيل فنية برمجية أبداً. ركز تماماً على الجوانب الجمركية والإجرائية.
`;

// Consultation Endpoint with Gemini API
app.post("/api/consult", async (req, res) => {
    try {
        const { message, history } = req.body;
        if (!message) {
            return res.status(400).json({ error: "Message is required" });
        }

        // fallback if Gemini is not configured
        if (!ai) {
            // Return a professional simulated response if API key is not supplied yet
            return res.json({
                text: `أهلاً بك في شركة المحمدية للتخليص الجمركي! يبدو أن التطبيق لم يتم ربطه بمفتاح API لـ Gemini حتى الآن. 
أنا هنا لمساعدتك بشكل مؤقت. بخصوص استفسارك: فريق شركة المحمدية للتخليص الجمركي بقيادة أ/ إسلام محمد (01274833844) يسعده الرد على كافة استشاراتك بخصوص نظام التربيتيك، المالك الأول، مبادرة المغتربين، أو شحنات البضائع العامة بميناء الإسكندرية.
يمكنك استخدام حاسبة الجمارك التفاعلية بالتطبيق للحصول على تقديرات فورية، أو الضغط على زر تواصل معنا للتحدث مباشرة عبر الواتساب لإرسال أوراق سيارتك أو بضاعتك وسنقوم بتسجيل طلبك فوراً برقم تتبع جمركي خاص بك!`
            });
        }

        // Convert client-side custom history pattern to Gemini structure
        const contents: any[] = [];
        if (history && Array.isArray(history)) {
            history.forEach((h: any) => {
                contents.push({
                    role: h.role === "user" ? "user" : "model",
                    parts: [{ text: h.text || "" }]
                });
            });
        }

        // Push the current user prompt
        contents.push({
            role: "user",
            parts: [{ text: message }]
        });

        // Make the content generation call using gemini-3.5-flash
        const response = await ai.models.generateContent({
            model: "gemini-3.5-flash",
            contents: contents,
            config: {
                systemInstruction: SYSTEM_INSTRUCTION,
                temperature: 0.75,
            }
        });

        const replyText = response.text || "عذراً، لم أستطع معالجة الرد حالياً. يرجى التواصل مباشرة مع أ/ إسلام محمد على الرقم 01274833844.";
        return res.json({ text: replyText });

    } catch (error: any) {
        console.error("Error in /api/consult:", error);
        return res.status(500).json({
            error: "Someting went wrong with consultation chatbot",
            text: "عذراً، حدث خطأ أثناء تشغيل المساعد الذكي. يمكنك التواصل معنا مباشرة على واتساب أو الاتصال بالرقم 01274833844 للحصول على الاستشارة فوراً."
        });
    }
});

// Start our custom server
async function startServer() {
    // Vite integration
    if (process.env.NODE_ENV !== "production") {
        const vite = await createViteServer({
            server: { middlewareMode: true },
            appType: "spa",
        });
        app.use(vite.middlewares);
        console.log("Vite development server mounted in dev mode.");
    } else {
        // Production serving of static compiled files
        const distPath = path.join(process.cwd(), "dist");
        app.use(express.static(distPath));
        app.get("*", (req, res) => {
            res.sendFile(path.join(distPath, "index.html"));
        });
        console.log("Serving static production assets from dist/ folder.");
    }

    // app.listen(PORT, "0.0.0.0", () => {
    //   console.log(`Al-Muhammadiyah Customs fullstack app listening on http://localhost:${PORT}`);
    // });

}

startServer();

export default app;