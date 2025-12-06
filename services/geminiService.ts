
import { GoogleGenAI } from "@google/genai";
import { Message, Role, GroundingMetadata, BookingItem } from "../types";

const apiKey = process.env.API_KEY;
const ai = new GoogleGenAI({ apiKey: apiKey || '' });

const SYSTEM_INSTRUCTION = `
تصرف كمساعد سفر بشري حقيقي، مو كنظام آلي. اسمك "مصطفى".
إياك أن تطلق على نفسك اسم "واندرلست" (Wanderlust) أو أي اسم آخر. أنت "مصطفى" فقط.
رد على المستخدم بشكل مختصر وواضح جداً وبنبرة طبيعية وسهلة كأنك صديق يساعده بالحجز.
لا تستخدم لغة رسمية أو تقنية أو جمل طويلة. رد فقط حسب السؤال بدون تعقيد.

وظيفتك:
• تفهم نية المستخدم فوراً حتى لو كلامه ناقص أو عامي.
• تساعده يحجز: طيران، فنادق، مطاعم، تكسي، فعاليات.
• تقترح الخيارات الأنسب لميزانيته ووقته.
• تجيب أسعار واقعية ومحدثة عبر الإنترنت (Cheap flights, Booking, Google Flights, Kayak...). استخدم Google Search لجلب الأسعار الحقيقية.
• دائماً قدم أرخص سعر ممكن + بدائل أفضل.
• إذا المستخدم ما عيّن تواريخ أو عدد أشخاص أو مكان، اسأله فقط الأسئلة الضرورية وباختصار.
• تجنب الفلسفة، تجنب الشرح الزائد، تجنب النصوص الطويلة.
• فكّر مثل إنسان فعلي عنده خبرة بالسفر، واقترح خيارات ذكية (ترانزيت أفضل، فندق نظيف بسعر معقول، مطعم قريب...).

طريقة الرد:
1. رد مختصر.
2. اعطِ أفضل خيار + السعر.
3. اعطِ خيارين بديلة أرخص أو أفضل.
4. إذا لازم، اسأل سؤال واحد فقط لتكمل المعلومات.

---
### تعليمات تقنية هامة (مخفية عن المستخدم):
لكي تظهر أزرار الحجز في التطبيق، عندما تقترح خياراً محدداً للعميل (رحلة، فندق، تكسي، مطعم) وتعرض سعره، يجب **دائماً** وضع كائن JSON في نهاية ردك يحتوي على تفاصيل هذا العرض الرئيسي.

صيغة الـ JSON المطلوبة (يجب أن تكون في آخر الرد تماماً ومحاطة بـ \`\`\`json):
\`\`\`json
{
  "type": "flight", // أو "hotel", "taxi", "restaurant"
  "title": "عنوان العرض (مثال: طيران الإمارات إلى دبي)",
  "description": "وصف قصير (مثال: مباشر - 15 ديسمبر - 5 ساعات)",
  "price": "450",
  "currency": "$"
}
\`\`\`
`;

export const streamChatResponse = async (
  history: Message[],
  message: string,
  onUpdate: (text: string, metadata?: GroundingMetadata, offer?: BookingItem) => void
) => {
  if (!apiKey) {
    onUpdate("عذراً، لم يتم العثور على مفتاح API. يرجى التأكد من إعداد البيئة بشكل صحيح.", undefined);
    return;
  }

  try {
    const model = 'gemini-2.5-flash';
    
    const chatHistory = history
      .filter(msg => !msg.isStreaming)
      .map(msg => ({
        role: msg.role === Role.USER ? 'user' : 'model',
        parts: [{ text: msg.text }],
      }));

    const chat = ai.chats.create({
      model: model,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        tools: [{ googleSearch: {} }],
      },
      history: chatHistory,
    });

    const result = await chat.sendMessageStream({ message });

    let fullText = '';
    let metadata: GroundingMetadata | undefined;
    let extractedOffer: BookingItem | undefined;

    for await (const chunk of result) {
      const text = chunk.text;
      
      if (text) {
        fullText += text;
      }
      
      if (chunk.candidates?.[0]?.groundingMetadata) {
         metadata = chunk.candidates[0].groundingMetadata;
      }
      
      // Attempt to extract JSON offer from the accumulating text
      // We look for the last occurrence of ```json ... ```
      const jsonMatch = fullText.match(/```json\s*(\{[\s\S]*?\})\s*```/);
      if (jsonMatch) {
          try {
              const offerData = JSON.parse(jsonMatch[1]);
              if (offerData.type && offerData.title && offerData.price) {
                  extractedOffer = {
                      id: Date.now().toString(),
                      ...offerData
                  };
                  // Clean the text shown to user (remove the JSON block)
                  // We only remove it from the display text passed to callback
                  const cleanText = fullText.replace(jsonMatch[0], '').trim();
                  onUpdate(cleanText, metadata, extractedOffer);
                  continue; // Skip standard update to avoid flickering
              }
          } catch (e) {
              // Ignore parsing errors until full JSON is received
          }
      }

      // Prepare display text
      let displayText = fullText;
      if (jsonMatch) {
           displayText = fullText.replace(jsonMatch[0], '').trim();
      }
      
      // Ensure we don't send empty updates effectively unless it's the start
      if (displayText || metadata || extractedOffer) {
          onUpdate(displayText, metadata, extractedOffer);
      }
    }
  } catch (error) {
    console.error("Error in streamChatResponse:", error);
    onUpdate("حدث خطأ أثناء الاتصال بالخادم. يرجى المحاولة مرة أخرى.", undefined);
  }
};
