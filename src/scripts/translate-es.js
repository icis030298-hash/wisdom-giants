const fs = require('fs');
const path = require('path');
const https = require('https');

// Load API Key from .env.local
const envLocalPath = path.join(__dirname, '..', '..', '.env.local');
let apiKey = '';
if (fs.existsSync(envLocalPath)) {
  const content = fs.readFileSync(envLocalPath, 'utf8');
  const match = content.match(/NEXT_PUBLIC_GEMINI_API_KEY\s*=\s*(.+)/);
  if (match) {
    apiKey = match[1].trim();
  }
}

if (!apiKey) {
  console.error("Error: NEXT_PUBLIC_GEMINI_API_KEY not found in .env.local");
  process.exit(1);
}

const enPath = path.join(__dirname, '..', '..', 'messages', 'en.json');
const esPath = path.join(__dirname, '..', '..', 'messages', 'es.json');

const enData = JSON.parse(fs.readFileSync(enPath, 'utf8'));

// High-fidelity UI Translations for Spanish
const esUiData = {
  "Navigation": {
    "hallOfGems": "Salón de Mentes",
    "wisdomArchive": "Archivo de Sabiduría",
    "chatList": "Mis Conversaciones",
    "about": "Acerca de",
    "startExploring": "Comenzar Viaje",
    "title": "Giants Wisdom",
    "subtitle": "El Salón de las Grandes Mentes",
    "login": "Iniciar sesión",
    "logout": "Cerrar sesión",
    "myProfile": "Mi Perfil",
    "signInRequired": "Iniciar sesión para ver tus conversaciones."
  },
  "Auth": {
    "loginModalTitle": "Bienvenido al Salón de los Gigantes",
    "loginModalDescription": "Conserva tus diálogos con los gigantes y administra el legado de sabiduría grabado en tu alma.",
    "continueWithGoogle": "Continuar con Google",
    "loginSuccess": "Bienvenido al Salón de las Grandes Mentes.",
    "logout": "Cerrar sesión",
    "chatList": "Mis Conversaciones",
    "signInRequired": "Iniciar sesión requerido"
  },
  "Test": {
    "title": "Descubre el gran legado que fluye en tu alma",
    "subtitle": "Prueba de Análisis del Temperamento Histórico",
    "start": "Comenzar Test",
    "back": "Atrás",
    "banner": {
      "new": "NUEVO CONTENIDO",
      "title": "¿Qué gigante histórico\nse parece más a ti?",
      "desc": "Descubre tu doble histórico con 15 preguntas",
      "button": "Comenzar Test"
    },
    "stages": {
      "stage1": "Etapa 1: Despertar",
      "stage2": "Etapa 2: La Prueba",
      "stage3": "Etapa 3: El Destino",
      "cleared": "¡Etapa {stage} completada!",
      "ready": "¿Listo para la siguiente etapa?",
      "next": "Avanzar a la siguiente etapa"
    },
    "analysis": {
      "loading": "Analizando los ecos de tu alma...",
      "sub": "Buscando tus pilares en el gran flujo de la historia."
    },
    "result": {
      "matchFound": "Has encontrado tu destino histórico",
      "archetype": "Tu Persona de Legado",
      "matchedGiant": "El gigante más parecido a ti",
      "readEpic": "Leer Epos",
      "chatNow": "Conversar Ahora"
    }
  },
  "Chats": {
    "title": "Mis Conversaciones",
    "subtitle": "Diálogos con Grandes Mentes",
    "description": "Experimenta reflexiones y consejos de los más grandes gigantes de la historia. Puedes continuar cualquier conversación en cualquier momento.",
    "emptyTitle": "Aún no hay conversaciones",
    "emptyDescription": "Los gigantes están listos para escucharte. ¡Comienza tu primer diálogo ahora!",
    "startFirstChat": "Iniciar primera conversación",
    "messages": "mensajes",
    "lastChat": "Último chat"
  },
  "Hero": {
    "badge": "El Salón de las Grandes Mentes",
    "quote": "Si he visto más lejos, es porque estaba sobre los hombros de gigantes.",
    "quoteAuthor": "Isaac Newton",
    "startJourney": "Comenzar Viaje",
    "startTest": "🧬 Iniciar Test de ADN Histórico",
    "exploreHall": "🏛️ Explorar el Salón",
    "stats": {
      "minds": "Grandes Mentes",
      "questions": "Test de 15 Preguntas",
      "free": "Completamente Gratis",
      "freeValue": "Gratis"
    },
    "guide": {
      "title": "Guía del Salón de la Sabiduría",
      "selectGiant": "Elige un Gigante",
      "selectGiantDesc": "Encuentra figuras inspiradoras entre más de 95 leyendas históricas.",
      "epic": "Narrativas Épicas",
      "epicDesc": "Lee relatos de vida como si los gigantes los contaran ellos mismos.",
      "chat": "Chat en Tiempo Real",
      "chatDesc": "Comparte tus inquietudes con gigantes renacidos mediante IA avanzada.",
      "startNow": "Comenzar Ahora"
    }
  },
  "Featured": {
    "title": "El Salón de las Grandes Mentes",
    "description": "Explora la sabiduría de figuras que cambiaron la historia. Selecciona una persona para iniciar una conversación que trasciende el tiempo y el espacio.",
    "viewAll": "Ver Todos los Gigantes",
    "bestPick": "Mejor Opción",
    "todaysPick": "Recomendación del Día",
    "chatNow": "Conversar Ahora"
  },
  "GiantsGrid": {
    "title": "Gigantes Históricos",
    "description": "Explora la sabiduría de las figuras que cambiaron el curso de la humanidad. Elige un gigante para iniciar un diálogo que trasciende el tiempo y el espacio.",
    "searchPlaceholder": "Buscar por nombre o campo de estudio...",
    "allGiants": "Todos los Gigantes",
    "categories": {
      "achievement": "Logro",
      "adversity": "Adversidad",
      "wisdom": "Sabiduría",
      "creativity": "Creatividad"
    },
    "resultsCount": "Encontradas {filtered} de {total} grandes mentes",
    "readEpic": "Leer Epos ✨",
    "noResults": "No se encontraron resultados",
    "era": "Gigante Histórico",
    "pagination": {
      "first": "Primero",
      "prev": "Anterior",
      "next": "Siguiente",
      "last": "Último"
    }
  },
  "GiantDetail": {
    "returnToSquare": "Volver al Salón",
    "chatWith": "Conversar con {name}",
    "theLifeStory": "La Historia de Vida",
    "thePain": "La Lucha",
    "theRecovery": "La Recuperación",
    "wisdomLessons": "Lecciones de Sabiduría",
    "famousQuote": "Frase Célebre",
    "era": "Época",
    "field": "Área",
    "askForAdvice": "Pedir Consejo",
    "notFound": "Gigante no encontrado.",
    "goHome": "Volver al Inicio"
  },
  "Chat": {
    "famousQuote": "Frase Célebre",
    "description": "Descripción",
    "suggestedQuestions": "Preguntas Sugeridas",
    "inputPlaceholder": "Pregúntale a {name} lo que quieras...",
    "contemplating": "{name} está contemplando...",
    "wisdomActive": "Sabiduría Activa",
    "historyEra": "Historia y Época",
    "fieldOfWisdom": "Campo de Sabiduría",
    "error": "Lo siento, ocurrió un error al recuperar mi sabiduría. ¿Podrías intentarlo de nuevo en un momento?",
    "retry": "Recuperar Sabiduría de Nuevo"
  },
  "Stats": {
    "title": "Por qué Giants Wisdom",
    "description": "Experimenta un viaje innovador a través de miles de años para encontrarte con la sabiduría humana.",
    "features": [
      {
        "title": "Chat en Tiempo Real con Gigantes Históricos",
        "description": "Entabla conversaciones profundas que trascienden el tiempo y el espacio con figuras históricas mediante IA avanzada."
      },
      {
        "title": "2,500 Años de Sabiduría Humana",
        "description": "Encuentra en un solo lugar los 2,500 años de historia, logros y perspectivas construidos por la humanidad."
      },
      {
        "title": "Conocimiento Directo de los Maestros",
        "description": "Entregamos el valor del aprendizaje vívido como si escucharas directamente a los maestros de la filosofía, la ciencia y el arte."
      },
      {
        "title": "Perspectivas Personalizadas para Ti",
        "description": "Haz preguntas, explora ideas y recibe la orientación personalizada que necesitas para tu vida."
      }
    ],
    "stats": {
      "minds": "Grandes Mentes",
      "history": "Años de Sabiduría",
      "fields": "Campos de Estudio",
      "inspiration": "Inspiraciones"
    }
  },
  "QuoteSection": {
    "label": "Sabiduría Diaria"
  },
  "Privacy": {
    "title": "Política de Privacidad",
    "lastUpdated": "Última actualización: 18 de mayo de 2026",
    "summaryTitle": "1. Resumen Clave",
    "summaryDesc": "En Giants Wisdom, nunca vendemos ni compartimos inapropiadamente tus datos personales. Esta política detalla cómo protegemos y procesamos los datos recopilados mientras realizas pruebas de personalidad y conversas con gigantes históricos.",
    "collectionTitle": "2. Datos que Recopilamos y Cómo los Recopilamos",
    "collectionDesc": "Nuestro sitio web puede explorarse de forma completamente anónima sin crear una cuenta. Sin embargo, durante tus interacciones, se pueden procesar los siguientes datos:\n- Datos proporcionados voluntariamente: Respuestas del Test de ADN de Legado, textos de entrada ingresados en los chats de IA y direcciones de correo electrónico (solo al suscribirte a nuestro boletín).\n- Datos registrados automáticamente: Tipo de dispositivo, especificaciones del navegador, dirección IP e historial de interacción registrados de forma segura mediante Cookies.",
    "purposeTitle": "3. Cómo Utilizamos la Información",
    "purposeDesc": "Los datos recopilados se utilizan estrictamente para los siguientes objetivos:\n- Compilar los resultados del test de 15 preguntas para determinar tu arquetipo de gigante histórico más cercano.\n- Generar respuestas de chat históricas dinámicas en tiempo real impulsadas limpiamente por la API Gemini 2.5 Flash.\n- Análisis estadísticos no identificables para mejorar nuestras métricas de arquetipos de personalidad.\n- Mostrar banners personalizados seguros a través de Google AdSense.",
    "adsenseTitle": "4. Google AdSense y Política de Cookies de Terceros",
    "adsenseDesc": "Este sitio web muestra anuncios integrados a través de Google AdSense. Google y proveedores externos utilizan cookies para publicar anuncios dirigidos según tus visitas a este y otros sitios web en Internet. Puedes optar por no recibir seguimiento personalizado en cualquier momento configurando tus preferencias directamente en la Configuración de Anuncios de Google ([https://www.google.com/settings/ads](https://www.google.com/settings/ads)).",
    "retentionTitle": "5. Retención y Destrucción de Datos",
    "retentionDesc": "Los resultados de pruebas anónimas y las entradas de chat se eliminan al cerrar la sesión o se desvinculan completamente de marcadores de identidad (anonimizados) para estudios globales permanentes. Cualquier dato personal como correos electrónicos se elimina permanentemente a petición tuya.",
    "rightsTitle": "6. Tus Derechos e Información de Contacto",
    "rightsDesc": "Reservas la total autoridad para ver, modificar o eliminar permanentemente cualquier fragmento de datos vinculado a tu identidad. Para cualquier consulta sobre privacidad, ponte en contacto con nuestro equipo oficial."
  },
  "Footer": {
    "brand": {
      "subtitle": "El Salón de las Grandes Mentes",
      "description": "Únete al viaje de las grandes mentes que cambiaron la historia. Experimenta la sabiduría más allá del tiempo y el espacio."
    },
    "sections": {
      "explore": "Explorar",
      "info": "Información"
    },
    "links": {
      "allGiants": "Todos los Gigantes",
      "wisdomArchive": "Archivo de Sabiduría",
      "about": "Acerca de Nosotros",
      "privacy": "Política de Privacidad",
      "terms": "Términos de Servicio",
      "contact": "Contacto",
      "dnaTest": "Test de ADN Histórico"
    }
  },
  "About": {
    "intro": "A todos aquellos perdidos en el\nflujo de información interminable.",
    "subIntro": "Un espacio para alejarse del ruido y encontrarse con la verdadera sabiduría.",
    "visionTitle": "Sobre Hombros de Gigantes",
    "visionDesc": "“Si he visto más lejos, es porque he estado sobre los hombros de gigantes.” - Isaac Newton. Comenzamos con la creencia de que las respuestas a nuestros complejos problemas modernos ya podrían estar entretejidas en la vida de los más grandes gigantes de la historia.",
    "epicTitle": "Las Grandes Epopeyas de 95 Gigantes",
    "epicDesc": "Ve más allá de los simples datos históricos. Experimenta la gran saga de gigantes que superaron la adversidad para remodelar la historia humana.",
    "chatTitle": "Diálogo entre Épocas",
    "chatDesc": "Entabla conversaciones en tiempo real con firmas restauradas de gigantes impulsadas por IA avanzada (Gemini 2.5 Flash) para buscar ideas agudas ante tus dilemas modernos.",
    "testTitle": "Encuentra tu Gemelo Histórico",
    "testDesc": "Descubre el ADN del gigante que fluye en lo profundo de tu alma a través de un cuestionario de situación inmersivo de 3 etapas establecido en momentos históricos clave.",
    "outroTitle": "Bienvenido al Salón de los Gigantes",
    "outroDesc": "Sobre sus hombros, finalmente verás más lejos. Comienza tu viaje hoy."
  },
  "Terms": {
    "title": "Términos de Servicio",
    "lastUpdated": "Última actualización: 18 de mayo de 2026",
    "intro": "Bienvenido a Giants Wisdom. Estos Términos de Servicio rigen el acuerdo legal y los límites de usuario entre tú y nuestra plataforma con respecto a tu participación en nuestras métricas de personalidad y simulaciones conversacionales originales.",
    "eligibilityTitle": "Artículo 1 (Elegibilidad y Protección de Menores)",
    "eligibilityDesc": "Este servicio está destinado estrictamente a usuarios que tengan al menos 13 años de edad. Los usuarios menores de 13 años que interactúen con nuestras plataformas declaran que han obtenido el consentimiento verificado de sus padres de acuerdo con los mandatos globales de privacidad infantil. La plataforma se exime de cualquier responsabilidad derivada del acceso no autorizado de menores.",
    "aiTitle": "Artículo 2 (Infraestructura de IA y Descargo de Responsabilidad)",
    "aiDesc": "1. Todos los diálogos con figuras históricas que se muestran en esta plataforma son simulaciones interactivas generadas limpiamente por modelos avanzados de IA (Gemini 2.5 suite).\n2. Los resultados proporcionados se diseñan estrictamente con fines educativos y de entretenimiento. No constituyen registros históricos certificados, evaluaciones psicológicas profesionales, asesoramiento médico ni asesoría legal.\n3. Giants Wisdom no asume ninguna responsabilidad por alucinaciones de IA o decisiones tomadas por los usuarios basadas en las respuestas del sistema.",
    "intellectualTitle": "Artículo 3 (Propiedad Intelectual y Protección Antirrascado)",
    "intellectualDesc": "1. Todas las arquitecturas de diseño, marcas registradas, métricas del 'Test de 4 Pilares de la Grandeza', 15 preguntas situacionales e ilustraciones vectoriales premium siguen siendo propiedad exclusiva de Giants Wisdom.\n2. Los usuarios tienen estrictamente prohibido realizar copias no autorizadas, sindicación comercial o extracción maliciosa de datos (scraping) a través de bots automatizados, scripts o rastreadores de red.",
    "userDutyTitle": "Artículo 4 (Deberes del Usuario y Consentimiento de Monetización)",
    "userDutyDesc": "1. Los usuarios aceptan navegar por nuestra aplicación sin introducir secuencias de ingeniería inversa o vectores maliciosos de sobrecarga del servidor.\n2. En consideración al acceso gratuito, los usuarios otorgan expresamente su consentimiento irrevocable para que Google AdSense y los intermediarios publicitarios presenten diseños de banners automatizados en la aplicación.",
    "disputeTitle": "Artículo 5 (Ley Aplicable y Jurisdicción Competente)",
    "disputeDesc": "Estos Términos y cualquier acción legal derivada del uso del sistema se regirán e interpretarán de acuerdo con las leyes de la República de Corea. Cualquier disputa se someterá exclusivamente al tribunal competente que rija la ubicación del operador de la plataforma."
  },
  "Cookie": {
    "title": "Configuración de Cookies",
    "description": "Utilizamos cookies para personalizar anuncios (Google AdSense) y analizar el tráfico. Al aceptar, consientes nuestro uso de cookies.",
    "acceptAll": "Aceptar Todo",
    "rejectAll": "Rechazar Todo",
    "customize": "Personalizar",
    "savePreferences": "Guardar Preferencias",
    "necessary": "Cookies Necesarias",
    "necessaryDesc": "Requeridas para que el sitio web funcione correctamente. (Siempre Activas)",
    "analytics": "Cookies de Análisis",
    "analyticsDesc": "Utilizadas para analizar las visitas y patrones de uso para mejorar nuestro servicio.",
    "advertising": "Cookies de Publicidad",
    "advertisingDesc": "Utilizadas para servir anuncios personalizados a través de Google AdSense."
  },
  "Contact": {
    "title": "Contacto",
    "name": "Nombre",
    "email": "Correo Electrónico",
    "subject": "Asunto (opcional)",
    "message": "Mensaje",
    "send": "Enviar Mensaje",
    "sending": "Enviando...",
    "success": "¡Mensaje enviado con éxito! Gracias.",
    "error": "Error al enviar. Inténtalo de nuevo.",
    "namePlaceholder": "Ingresa tu nombre",
    "emailPlaceholder": "Ingresa tu correo",
    "subjectPlaceholder": "Ingresa el asunto",
    "messagePlaceholder": "Ingresa tu mensaje"
  }
};

// Function to call Gemini API for translating a batch of giants
function translateBatch(batch) {
  return new Promise((resolve, reject) => {
    const prompt = `You are an expert translator. Translate the following JSON object containing multiple historical figure definitions into professional, inspiring Spanish (Latin American).
For each figure in the object, translate these fields:
- name: Keep historical name in standard Spanish format (e.g. use 'Sejong el Grande' for Sejong the Great, 'Alejandro Magno' for Alexander the Great, 'Juana de Arco' for Joan of Arc, 'Confucio' for Confucius, 'Aristóteles' for Aristotle, 'Platón' for Plato, 'Sócrates' for Socrates, 'Buda' for Buddha, 'Lao Tsé' for Lao Tzu, 'Julio César' for Julius Caesar, etc., otherwise keep original like Steve Jobs).
- headline: Inspiring Spanish headline.
- shortDescription: Inspiring Spanish description.
- quote: Famous Spanish quote translation (if the historical quote has a standard Spanish version, use it).
- chatGreeting: An inspiring greeting in Spanish, keeping the style.
- suggestedQuestions: Translate the 3 questions into natural Spanish.

Input JSON of figures:
${JSON.stringify(batch, null, 2)}

Return ONLY the valid translated JSON block matching the input structure with identical keys. Do not wrap in markdown \`\`\`json block. Just the raw JSON content:`;

    const requestData = JSON.stringify({
      contents: [{
        parts: [{ text: prompt }]
      }],
      generationConfig: {
        responseMimeType: "application/json"
      }
    });

    const options = {
      hostname: 'generativelanguage.googleapis.com',
      path: `/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(requestData)
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          if (json.candidates && json.candidates[0] && json.candidates[0].content && json.candidates[0].content.parts[0]) {
            const rawText = json.candidates[0].content.parts[0].text.trim();
            const translatedObj = JSON.parse(rawText);
            resolve(translatedObj);
          } else {
            const errMsg = json.error ? `API Error Code ${json.error.code}: ${json.error.message}` : `Empty candidates response. Raw response: ${data.slice(0, 300)}`;
            reject(new Error(errMsg));
          }
        } catch (err) {
          reject(new Error(`Failed to parse API response: ${err.message}. Raw response: ${data.slice(0, 300)}`));
        }
      });
    });

    req.on('error', (err) => { reject(err); });
    req.write(requestData);
    req.end();
  });
}

// Helper to run batch translation with retries and backoff
async function translateBatchWithRetry(batch, retries = 5, delay = 5000) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const result = await translateBatch(batch);
      return result;
    } catch (err) {
      console.warn(`[Batch of ${Object.keys(batch).length}] Attempt ${attempt}/${retries} failed: ${err.message}`);
      
      // Auto-recovery for Rate Limits (429 Quota Exceeded)
      if (err.message.includes('429') || err.message.includes('quota') || err.message.includes('Quota exceeded')) {
        console.warn(`⚠️ Rate limit hit! Sleeping for 65 seconds to fully cool down and clear the quota...`);
        await new Promise(r => setTimeout(r, 65000));
        attempt--;
        continue;
      }
      
      if (attempt === retries) throw err;
      await new Promise(r => setTimeout(r, delay * attempt)); // Exponential backoff
    }
  }
}

// Main execution block
async function run() {
  console.log("Starting Incremental Spanish Translations Generation (Batch Mode)...");
  
  // Read existing es.json if it exists to preserve already translated giants
  let existingEsData = null;
  if (fs.existsSync(esPath)) {
    try {
      existingEsData = JSON.parse(fs.readFileSync(esPath, 'utf8'));
      console.log("Loaded existing es.json to perform self-healing incremental translation!");
    } catch (e) {
      console.warn("Could not parse existing es.json, will generate from scratch.", e.message);
    }
  }

  const esData = { ...esUiData };
  esData.Giants = existingEsData && existingEsData.Giants ? existingEsData.Giants : {};

  const slugs = Object.keys(enData.Giants);
  console.log(`Found ${slugs.length} giants in total.`);

  // Filter giants that still have English values (name, headline, shortDescription, or quote is identical) or are missing
  const giantsToTranslate = slugs.filter(slug => {
    const original = enData.Giants[slug];
    const existing = esData.Giants[slug];
    
    if (!existing) return true; // Missing entirely
    
    // Check if name, headline, shortDescription, or quote matches English perfectly (indicates fallback was used)
    const isHeadlineFallback = existing.headline === original.headline;
    const isDescFallback = existing.shortDescription === original.shortDescription;
    const isQuoteFallback = existing.quote === original.quote;
    
    if (isHeadlineFallback || isDescFallback || isQuoteFallback) {
      return true; // Needs translation/re-translation
    }
    
    return false; // Already translated successfully!
  });

  console.log(`Of these, ${giantsToTranslate.length} giants need translation/healing.`);

  if (giantsToTranslate.length === 0) {
    console.log("🎉 All giants are already translated successfully!");
    process.exit(0);
  }

  // Batch translate in groups of 10
  const batchSize = 10;
  for (let i = 0; i < giantsToTranslate.length; i += batchSize) {
    const batchSlugs = giantsToTranslate.slice(i, i + batchSize);
    console.log(`[Batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(giantsToTranslate.length / batchSize)}] Translating ${batchSlugs.length} giants: ${batchSlugs.join(', ')}`);
    
    const batchToTranslate = {};
    for (const slug of batchSlugs) {
      batchToTranslate[slug] = enData.Giants[slug];
    }

    try {
      const translatedBatch = await translateBatchWithRetry(batchToTranslate);
      for (const slug of batchSlugs) {
        if (translatedBatch[slug]) {
          esData.Giants[slug] = translatedBatch[slug];
          console.log(`  ✓ Translated: ${slug}`);
        } else {
          console.warn(`  ⚠️ Missing translation in response for: ${slug}. Keeping English fallback.`);
          esData.Giants[slug] = enData.Giants[slug];
        }
      }

      // Save progress after each batch
      fs.writeFileSync(esPath, JSON.stringify(esData, null, 2), 'utf8');
      console.log(`[Progress Saved] Generated es.json with ${Object.keys(esData.Giants).length} translated giants.`);

    } catch (err) {
      console.error(`✗ CRITICAL BATCH FAIL: Could not translate batch [${batchSlugs.join(', ')}]. Kept fallback.`);
      for (const slug of batchSlugs) {
        esData.Giants[slug] = enData.Giants[slug];
      }
    }

    // Add a 6-second delay between batches to stay safely under 15 RPM
    if (i + batchSize < giantsToTranslate.length) {
      await new Promise(r => setTimeout(r, 6000));
    }
  }

  // Final Write
  fs.writeFileSync(esPath, JSON.stringify(esData, null, 2), 'utf8');
  console.log(`\n🎉 Success! Spanish locale file is fully healed and generated at: ${esPath}`);
}

run().catch(err => {
  console.error("Critical Execution Error:", err);
});
