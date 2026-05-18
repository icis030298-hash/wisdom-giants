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
const dePath = path.join(__dirname, '..', '..', 'messages', 'de.json');

const enData = JSON.parse(fs.readFileSync(enPath, 'utf8'));

// High-fidelity UI Translations for German
const deUiData = {
  "Navigation": {
    "hallOfGems": "Halle der Geister",
    "wisdomArchive": "Weisheitsarchiv",
    "chatList": "Gesprächsliste",
    "about": "Über uns",
    "startExploring": "Reise beginnen",
    "title": "Giants Wisdom",
    "subtitle": "Die Halle der großen Geister",
    "login": "Anmelden",
    "logout": "Abmelden",
    "myProfile": "Mein Profil",
    "signInRequired": "Anmeldung erforderlich, um den Gesprächsverlauf anzuzeigen."
  },
  "Auth": {
    "loginModalTitle": "Willkommen in der Halle der Riesen",
    "loginModalDescription": "Bewahre deine Dialoge mit den Riesen und verwalte das Erbe der Weisheit, das in deine Seele eingraviert ist.",
    "continueWithGoogle": "Mit Google fortfahren",
    "loginSuccess": "Willkommen in der Halle der großen Geister.",
    "logout": "Abmelden",
    "chatList": "Meine Gespräche",
    "signInRequired": "Anmeldung erforderlich"
  },
  "Test": {
    "title": "Finde das große Erbe, das in deiner Seele fließt",
    "subtitle": "Historischer Temperament-Analyse-Test",
    "start": "Test starten",
    "back": "Zurück",
    "banner": {
      "new": "NEUER INHALT",
      "title": "Welcher historische Riese\nähnelt dir am meisten?",
      "desc": "Analysiere deine 'Heritage-DNA' durch 30 Situationsfragen und finde den perfekten Partner für deine Seele.",
      "button": "Test starten"
    },
    "stages": {
      "stage1": "Stufe 1: Erwachen",
      "stage2": "Stufe 2: Die Prüfung",
      "stage3": "Stufe 3: Das Schicksal",
      "cleared": "Stufe {stage} abgeschlossen!",
      "ready": "Bereit für die nächste Stufe?",
      "next": "Weiter zur nächsten Stufe"
    },
    "analysis": {
      "loading": "Die Echos deiner Seele werden analysiert...",
      "sub": "Suche nach deinen Säulen im großen Fluss der Geschichte."
    },
    "result": {
      "matchFound": "Du hast dein historisches Schicksal getroffen",
      "archetype": "Deine Heritage-Persona",
      "matchedGiant": "Der Riese, der dir am ähnlichsten ist",
      "readEpic": "Epos lesen",
      "chatNow": "Jetzt chatten"
    }
  },
  "Chats": {
    "title": "Meine Gespräche",
    "subtitle": "Dialoge mit großen Geistern",
    "description": "Erlebe tiefe Einblicke und Ratschläge von den größten Riesen der Geschichte. Du kannst jedes Gespräch jederzeit fortsetzen.",
    "emptyTitle": "Noch keine Gespräche",
    "emptyDescription": "Die Riesen sind bereit, dir zuzuhören. Starte jetzt deinen ersten Dialog!",
    "startFirstChat": "Erstes Gespräch starten",
    "messages": "Nachrichten",
    "lastChat": "Letzter Chat"
  },
  "Hero": {
    "badge": "Die Halle der großen Geister",
    "quote": "Wenn ich weitergesehen habe, so deshalb, weil ich auf den Schultern von Riesen stand.",
    "quoteAuthor": "Isaac Newton",
    "startJourney": "Reise beginnen",
    "startTest": "🧬 Heritage-DNA-Test starten",
    "exploreHall": "🏛️ Die Halle erkunden",
    "stats": {
      "minds": "Große Geister",
      "questions": "Testfragen",
      "free": "Völlig kostenlos",
      "freeValue": "Kostenlos"
    },
    "guide": {
      "title": "Reiseführer durch die Halle der Weisheit",
      "selectGiant": "Wähle einen Riesen",
      "selectGiantDesc": "Finde inspirierende Persönlichkeiten unter 95+ historischen Legenden.",
      "epic": "Epische Erzählungen",
      "epicDesc": "Lese Lebensberichte, als ob die Riesen sie selbst erzählen würden.",
      "chat": "Echtzeit-Chat",
      "chatDesc": "Teile deine Sorgen mit Riesen, die durch modernste KI wiedergeboren wurden.",
      "startNow": "Jetzt starten"
    }
  },
  "Featured": {
    "title": "Die Halle der großen Riesen",
    "description": "Erforsche die Weisheit von Persönlichkeiten, die die Geschichte verändert haben. Wähle eine Person aus, um ein Gespräch zu beginnen, das Zeit und Raum überschreitet.",
    "viewAll": "Alle Riesen anzeigen",
    "bestPick": "Beste Wahl",
    "todaysPick": "Empfehlung des Tages",
    "chatNow": "Jetzt chatten"
  },
  "GiantsGrid": {
    "title": "Historische Riesen",
    "description": "Erforsche die Weisheit von Persönlichkeiten, die den Lauf der Menschheit verändert haben. Wähle einen Riesen aus, um ein Gespräch zu beginnen, das Zeit und Raum überschreitet.",
    "searchPlaceholder": "Suche nach Name oder Bereich...",
    "allGiants": "Alle Riesen",
    "categories": {
      "achievement": "Leistung",
      "adversity": "Widrigkeiten",
      "wisdom": "Weisheit",
      "creativity": "Kreativität"
    },
    "resultsCount": "{filtered} von {total} großen Geistern gefunden",
    "readEpic": "Epos lesen ✨",
    "noResults": "Keine Ergebnisse gefunden",
    "noResultsDesc": "Versuche deinen Suchbegriff oder Filter zu ändern.",
    "era": "Historischer Riese"
  },
  "GiantDetail": {
    "returnToSquare": "Zurück zum Platz",
    "chatWith": "Mit {name} chatten",
    "theLifeStory": "Die Lebensgeschichte",
    "thePain": "Der Kampf",
    "theRecovery": "Die Erholung",
    "wisdomLessons": "Lektionen der Weisheit",
    "famousQuote": "Berühmtes Zitat",
    "era": "Epoche",
    "field": "Bereich",
    "askForAdvice": "Um Rat fragen",
    "notFound": "Riese nicht gefunden.",
    "goHome": "Zurück zur Startseite"
  },
  "Chat": {
    "error": "Es gab einen Fehler beim Abrufen meiner Weisheit aus der Engine.",
    "retry": "Wiederholen",
    "contemplating": "{name} denkt nach...",
    "suggestedQuestions": "Empfohlene Fragen",
    "inputPlaceholder": "Frage {name} um Rat...",
    "wisdomActive": "WEISHEIT AKTIV",
    "historyEra": "Epoche",
    "fieldOfWisdom": "Bereich",
    "famousQuote": "Berühmtes Zitat",
    "description": "Beschreibung"
  },
  "Cookie": {
    "consentTitle": "Cookie-Einstellungen",
    "consentDesc": "Wir verwenden Cookies, um Ihre Erfahrung zu verbessern, personalisierte Anzeigen bereitzustellen und den Datenverkehr zu analysieren. Weitere Informationen finden Sie in unserer",
    "privacyPolicy": "Datenschutzerklärung",
    "acceptAll": "Alle akzeptieren",
    "rejectAll": "Alle ablehnen",
    "customize": "Anpassen",
    "preferencesTitle": "Cookie-Präferenzen",
    "necessaryTitle": "Notwendige Cookies",
    "necessaryDesc": "Diese Cookies sind für das Funktionieren der Website erforderlich und können in unseren Systemen nicht abgeschaltet werden.",
    "analyticsTitle": "Analytische Cookies",
    "analyticsDesc": "Diese Cookies ermöglichen es uns, Besuche und Verkehrsquellen zu zählen, damit wir die Leistung unserer Website messen und verbessern können.",
    "advertisingTitle": "Werbe-Cookies",
    "advertisingDesc": "Diese Cookies werden verwendet, um Anzeigen bereitzustellen, die für Sie und Ihre Interessen relevanter sind.",
    "savePreferences": "Einstellungen speichern"
  },
  "Privacy": {
    "title": "Datenschutzerklärung",
    "lastUpdated": "Zuletzt aktualisiert: 18. Mai 2026",
    "summaryTitle": "Datenschutzübersicht",
    "summaryDesc": "Bei Giants Wisdom steht Ihr Datenschutz an erster Stelle. Wir erfassen nur minimale Daten, die zur Bereitstellung unserer KI-gestützten historischen Dialogdienste erforderlich sind, und halten uns strikt an die Datenschutzgesetze.",
    "collectionTitle": "Datenerfassung",
    "collectionDesc": "• Kontodaten: Wenn Sie sich über Google anmelden, speichern wir Ihre Benutzer-ID, E-Mail-Adresse und Profilbild-URL.\n• Chat-Verlauf: Dialoge mit historischen Persönlichkeiten werden in einer sicheren Firestore-Datenbank gespeichert, damit Sie Ihre Unterhaltungen fortsetzen können.\n• Analysen & Cookies: Wir verwenden standardisierte Analysetools und Werbe-Cookies zur Reichweitenmessung.",
    "purposeTitle": "Datennutzung & Weitergabe",
    "purposeDesc": "• Dienstbereitstellung: Speicherung Ihres Chat-Verlaufs, um fortlaufende Dialoge mit den KI-Mentoren zu ermöglichen.\n• Keine Weitergabe: Ihre persönlichen Daten werden niemals an Dritte verkauft oder zu Marketingzwecken weitergegeben.\n• KI-Verarbeitung: Anfragen werden anonymisiert an die Gemini API gesendet. Es werden keine personenbezogenen Daten an das KI-Modell übermittelt.",
    "adsenseTitle": "Google AdSense & Cookies",
    "adsenseDesc": "Wir nutzen Google AdSense, um Anzeigen auf unserer Plattform zu schalten. Google verwendet Cookies (wie das DART-Cookie), um Anzeigen basierend auf Ihren Besuen auf dieser und anderen Websites im Internet zu schalten. Sie können personalisierte Werbung in den Google-Anzeigeneinstellungen deaktivieren. Weitere Informationen finden Sie in den Datenschutz- und Nutzungsbedingungen von Google.",
    "retentionTitle": "Datenaufbewahrung & Löschung",
    "retentionDesc": "Wir bewahren Ihre Daten so lange auf, wie Ihr Konto aktiv ist. Sie können die Löschung Ihres Kontos und aller zugehörigen Chat-Verläufe jederzeit beantragen, indem Sie uns unter privacy@wisdomgiants.com kontaktieren. Nach der Beantragung werden Ihre Daten innerhalb von 30 Tagen unwiderruflich gelöscht.",
    "rightsTitle": "Ihre Rechte & DSGVO-Konformität",
    "rightsDesc": "Gemäß der DSGVO (Datenschutz-Grundverordnung) haben Sie das Recht auf Auskunft, Berichtigung, Löschung und Übertragbarkeit Ihrer bei uns gespeicherten personenbezogenen Daten. Wenn Sie in der Europäischen Union ansässig sind und diese Rechte ausüben möchten, kontaktieren Sie uns bitte. Unser Datenschutzbeauftragter wird Ihre Anfrage umgehend bearbeiten.",
    "contactTitle": "Kontaktieren Sie uns",
    "contactDesc": "Wenn Sie Fragen zu dieser Richtlinie haben, kontaktieren Sie uns bitte unter privacy@wisdomgiants.com."
  },
  "Terms": {
    "title": "Nutzungsbedingungen",
    "lastUpdated": "Zuletzt aktualisiert: 18. Mai 2026",
    "acceptanceTitle": "1. Zustimmung zu den Bedingungen",
    "acceptanceDesc": "Durch den Zugriff auf und die Nutzung von Giants Wisdom erklären Sie sich mit diesen Nutzungsbedingungen einverstanden. Wenn Sie nicht mit allen Bedingungen einverstanden sind, ist Ihnen die Nutzung des Dienstes untersagt.",
    "conductTitle": "2. Nutzerverhalten",
    "conductDesc": "Sie verpflichten sich, die Plattform nur für rechtmäßige Zwecke zu nutzen. Sie dürfen keine anstößigen, schädlichen oder beleidigenden Nachrichten an die KI-Mentoren senden oder versuchen, die Sicherheitsvorkehrungen des Dienstes zu umgehen.",
    "intellectualTitle": "3. Geistiges Eigentum",
    "intellectualDesc": "Alle KI-generierten Antworten, Lebensgeschichten und das Design von Giants Wisdom sind für Ihre persönliche Inspiration und Ihren Bildungsgebrauch bestimmt. Die kommerzielle Verbreitung oder Vervielfältigung der Inhalte ist ohne vorherige Genehmigung untersagt.",
    "limitationTitle": "4. Haftungsbeschränkung",
    "limitationDesc": "Giants Wisdom stellt KI-generierte historische Simulationen zu Bildungs- und Unterhaltungszwecken zur Verfügung. Die Ratschläge der KI-Mentoren stellen keine professionelle, medizinische, finanzielle oder rechtliche Beratung dar. Wir haften nicht für Entscheidungen, die auf Basis dieser Dialoge getroffen werden.",
    "terminationTitle": "5. Kündigung",
    "terminationDesc": "Wir behalten uns das Recht vor, Ihren Zugriff auf den Dienst jederzeit und ohne Vorankündigung zu sperren oder zu kündigen, wenn Sie gegen diese Nutzungsbedingungen verstoßen.",
    "contactTitle": "6. Kontakt",
    "contactDesc": "Bei Fragen zu diesen Bedingungen kontaktieren Sie uns bitte unter support@wisdomgiants.com."
  },
  "Footer": {
    "brand": {
      "subtitle": "Die Halle der großen Geister",
      "description": "Ein KI-gestütztes Tor, um die Weisheit, Kämpfe und Triumphe der größten Persönlichkeiten der Geschichte noch einmal zu erleben."
    },
    "navigation": {
      "title": "Navigation",
      "hall": "Die Halle",
      "test": "Heritage-DNA-Test",
      "chats": "Meine Gespräche",
      "about": "Über uns"
    },
    "legal": {
      "title": "Rechtliches",
      "privacy": "Datenschutzerklärung",
      "terms": "Nutzungsbedingungen"
    },
    "contact": {
      "title": "Kontakt",
      "email": "support@wisdomgiants.com",
      "github": "Giants Wisdom Team"
    },
    "copyright": "© {year} Giants Wisdom. Alle Rechte vorbehalten."
  }
};

// Function to call Gemini API for translating whole giant payload
function translateGiant(slug, original) {
  return new Promise((resolve, reject) => {
    const prompt = `You are an expert translator. Translate the following JSON object fields into professional, inspiring German.
Fields to translate:
- name: Keep historical name in German format (e.g. Sejong der Große, etc. if standard in German, otherwise keep original like Steve Jobs).
- headline: Inspiring German headline.
- shortDescription: Inspiring German description.
- quote: Famous German quote translation (if historical quote has standard German version, use it).
- chatGreeting: An inspiring greeting in German, keeping the style.
- suggestedQuestions: Translate the 3 questions into natural German.

Input JSON:
${JSON.stringify(original, null, 2)}

Return ONLY the valid translated JSON block. Do not wrap in markdown \`\`\`json block. Just the raw JSON content:`;

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
      path: `/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`,
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

// Helper to run with retries and backoff
async function translateWithRetry(slug, original, retries = 5, delay = 5000) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const result = await translateGiant(slug, original);
      return result;
    } catch (err) {
      console.warn(`[${slug}] Attempt ${attempt}/${retries} failed: ${err.message}`);
      
      // Auto-recovery for Rate Limits (429 Quota Exceeded)
      if (err.message.includes('429') || err.message.includes('quota') || err.message.includes('Quota exceeded')) {
        console.warn(`⚠️ Rate limit hit! Sleeping for 65 seconds to fully cool down and clear the quota...`);
        await new Promise(r => setTimeout(r, 65000));
        // Reset the loop index to retry the same attempt after cooling down
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
  console.log("Starting Incremental German Translations Generation...");
  
  // Read existing de.json if it exists to preserve already translated giants
  let existingDeData = null;
  if (fs.existsSync(dePath)) {
    try {
      existingDeData = JSON.parse(fs.readFileSync(dePath, 'utf8'));
      console.log("Loaded existing de.json to perform self-healing incremental translation!");
    } catch (e) {
      console.warn("Could not parse existing de.json, will generate from scratch.", e.message);
    }
  }

  const deData = { ...deUiData };
  deData.Giants = existingDeData && existingDeData.Giants ? existingDeData.Giants : {};

  const slugs = Object.keys(enData.Giants);
  console.log(`Found ${slugs.length} giants in total.`);

  // Filter giants that still have English values (name, headline, shortDescription, or quote is identical) or are missing
  const giantsToTranslate = slugs.filter(slug => {
    const original = enData.Giants[slug];
    const existing = deData.Giants[slug];
    
    if (!existing) return true; // Missing entirely
    
    // Check if name, headline, shortDescription, or quote matches English perfectly (indicates fallback was used)
    const isHeadlineFallback = existing.headline === original.headline;
    const isDescFallback = existing.shortDescription === original.shortDescription;
    const isQuoteFallback = existing.quote === original.quote;
    
    // For non-English specific entities like "Steve Jobs", the name will be identical, so we check description and headline
    if (isHeadlineFallback || isDescFallback || isQuoteFallback) {
      return true; // Needs translation/re-translation
    }
    
    return false; // Already translated successfully!
  });

  console.log(`Of these, ${giantsToTranslate.length} giants need translation/healing.`);

  // Process completely sequentially with generous delay to avoid rate limits
  for (let i = 0; i < giantsToTranslate.length; i++) {
    const slug = giantsToTranslate[i];
    console.log(`[${i + 1}/${giantsToTranslate.length}] Healing translation for: ${slug}`);
    
    const original = enData.Giants[slug];
    try {
      const translated = await translateWithRetry(slug, original);
      deData.Giants[slug] = translated;
      console.log(`✓ Successfully translated and healed: ${slug}`);
      
      // Periodically save progress in case script gets interrupted
      if ((i + 1) % 5 === 0 || i === giantsToTranslate.length - 1) {
        fs.writeFileSync(dePath, JSON.stringify(deData, null, 2), 'utf8');
        console.log(`[Progress Saved] Generated de.json with ${Object.keys(deData.Giants).length} translated giants.`);
      }
    } catch (err) {
      console.error(`✗ CRITICAL FAIL: Could not translate [${slug}] after all retries. Kept fallback.`);
      deData.Giants[slug] = original; // Fallback
    }

    // Add a 4.5 second delay between requests to stay safely under the 15 RPM limit
    if (i < giantsToTranslate.length - 1) {
      await new Promise(r => setTimeout(r, 4500));
    }
  }

  // Final Write
  fs.writeFileSync(dePath, JSON.stringify(deData, null, 2), 'utf8');
  console.log(`\n🎉 Success! German locale file is fully healed and generated at: ${dePath}`);
}

run().catch(err => {
  console.error("Critical Execution Error:", err);
});
