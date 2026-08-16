/**
 * The handful of strings an API route sends back when something fails.
 *
 * These were Korean literals, so every locale saw Korean at the exact moment
 * something had already gone wrong — the worst point to hand someone a script
 * they cannot read. There are only six of them, which is why they are handled
 * here rather than waiting for the wider UI extraction.
 *
 * One of them named the vendor: "제미나이 응답을 가져오는 중 오류가 발생했습니다".
 * Which model sits behind the feature is an implementation detail, and a user
 * who cannot get a reply is not helped by learning it is Gemini's fault.
 *
 * Locales fall back to English rather than Korean, for the same reason the
 * response-language map does.
 */

type ErrorKey = 'generationFailed' | 'missingPrompt' | 'missingTopic' | 'missingParams'

const MESSAGES: Record<ErrorKey, Record<string, string>> = {
  generationFailed: {
    en: 'Could not fetch a reply. Please try again in a moment.',
    ko: '응답을 가져오지 못했습니다. 잠시 후 다시 시도해 주세요.',
    ja: '応答を取得できませんでした。しばらくしてからもう一度お試しください。',
    zh: '未能获取回复，请稍后再试。',
    es: 'No se pudo obtener una respuesta. Inténtalo de nuevo en un momento.',
    de: 'Die Antwort konnte nicht abgerufen werden. Bitte versuche es gleich noch einmal.',
    fr: "Impossible d'obtenir une réponse. Veuillez réessayer dans un instant.",
    it: 'Non è stato possibile ottenere una risposta. Riprova tra poco.',
    pt: 'Não foi possível obter uma resposta. Tente novamente em instantes.',
    ru: 'Не удалось получить ответ. Повторите попытку через некоторое время.',
    ar: 'تعذّر الحصول على رد. يرجى المحاولة مرة أخرى بعد قليل.',
    hi: 'उत्तर प्राप्त नहीं हो सका। कृपया कुछ देर बाद पुनः प्रयास करें।',
    th: 'ไม่สามารถรับคำตอบได้ กรุณาลองใหม่อีกครั้งในภายหลัง',
    vi: 'Không thể nhận phản hồi. Vui lòng thử lại sau giây lát.',
    id: 'Tidak dapat memperoleh balasan. Silakan coba lagi sebentar lagi.',
    tr: 'Yanıt alınamadı. Lütfen birazdan tekrar deneyin.',
    pl: 'Nie udało się pobrać odpowiedzi. Spróbuj ponownie za chwilę.',
    nl: 'Kon geen antwoord ophalen. Probeer het zo meteen opnieuw.',
    uk: 'Не вдалося отримати відповідь. Спробуйте ще раз за мить.',
    el: 'Δεν ήταν δυνατή η λήψη απάντησης. Δοκιμάστε ξανά σε λίγο.',
    he: 'לא ניתן היה לקבל תשובה. נסו שוב בעוד רגע.',
    fa: 'دریافت پاسخ ممکن نشد. لطفاً کمی بعد دوباره تلاش کنید.',
    sw: 'Imeshindwa kupata jibu. Tafadhali jaribu tena baada ya muda mfupi.',
    ha: 'An kasa samun amsa. Da fatan za a sake gwadawa nan da kadan.',
  },
  missingPrompt: {
    en: 'No question was provided.',
    ko: '질문 내용이 없습니다.',
    ja: '質問内容がありません。',
    zh: '未提供问题内容。',
    es: 'No se ha proporcionado ninguna pregunta.',
    de: 'Es wurde keine Frage übermittelt.',
    fr: "Aucune question n'a été fournie.",
    it: 'Nessuna domanda è stata fornita.',
    pt: 'Nenhuma pergunta foi fornecida.',
    ru: 'Вопрос не был передан.',
    ar: 'لم يتم تقديم أي سؤال.',
    hi: 'कोई प्रश्न नहीं दिया गया।',
    th: 'ไม่มีคำถามที่ส่งมา',
    vi: 'Chưa có câu hỏi nào được gửi.',
    id: 'Tidak ada pertanyaan yang dikirim.',
    tr: 'Herhangi bir soru iletilmedi.',
    pl: 'Nie przekazano żadnego pytania.',
    nl: 'Er is geen vraag opgegeven.',
    uk: 'Питання не було надано.',
    el: 'Δεν δόθηκε ερώτηση.',
    he: 'לא סופקה שאלה.',
    fa: 'هیچ پرسشی ارائه نشد.',
    sw: 'Hakuna swali lililotolewa.',
    ha: 'Ba a bayar da wata tambaya ba.',
  },
  missingTopic: {
    en: 'The debate topic is empty.',
    ko: '토론 주제가 비어있습니다.',
    ja: '討論のテーマが空です。',
    zh: '辩论主题为空。',
    es: 'El tema del debate está vacío.',
    de: 'Das Debattenthema ist leer.',
    fr: 'Le sujet du débat est vide.',
    it: "L'argomento del dibattito è vuoto.",
    pt: 'O tema do debate está vazio.',
    ru: 'Тема дискуссии не указана.',
    ar: 'موضوع النقاش فارغ.',
    hi: 'बहस का विषय रिक्त है।',
    th: 'หัวข้อการโต้วาทีว่างเปล่า',
    vi: 'Chủ đề tranh luận đang để trống.',
    id: 'Topik debat masih kosong.',
    tr: 'Tartışma konusu boş.',
    pl: 'Temat debaty jest pusty.',
    nl: 'Het debatonderwerp is leeg.',
    uk: 'Тема дискусії порожня.',
    el: 'Το θέμα της συζήτησης είναι κενό.',
    he: 'נושא הדיון ריק.',
    fa: 'موضوع مناظره خالی است.',
    sw: 'Mada ya mjadala haijajazwa.',
    ha: 'Batun muhawara babu komai.',
  },
  missingParams: {
    en: 'A required parameter is missing.',
    ko: '필수 파라미터가 누락되었습니다.',
    ja: '必須パラメータが不足しています。',
    zh: '缺少必要参数。',
    es: 'Falta un parámetro obligatorio.',
    de: 'Ein erforderlicher Parameter fehlt.',
    fr: 'Un paramètre obligatoire est manquant.',
    it: 'Manca un parametro obbligatorio.',
    pt: 'Falta um parâmetro obrigatório.',
    ru: 'Отсутствует обязательный параметр.',
    ar: 'هناك معامل مطلوب مفقود.',
    hi: 'एक आवश्यक पैरामीटर अनुपस्थित है।',
    th: 'ขาดพารามิเตอร์ที่จำเป็น',
    vi: 'Thiếu một tham số bắt buộc.',
    id: 'Ada parameter wajib yang hilang.',
    tr: 'Zorunlu bir parametre eksik.',
    pl: 'Brakuje wymaganego parametru.',
    nl: 'Een vereiste parameter ontbreekt.',
    uk: 'Відсутній обовʼязковий параметр.',
    el: 'Λείπει μια απαιτούμενη παράμετρος.',
    he: 'חסר פרמטר נדרש.',
    fa: 'یک پارامتر الزامی وجود ندارد.',
    sw: 'Kigezo kinachohitajika hakipo.',
    ha: 'An rasa sigar da ake buƙata.',
  },
}

export function apiError(key: ErrorKey, locale: string | undefined | null): string {
  const table = MESSAGES[key]
  return (locale && table[locale]) || table.en
}
