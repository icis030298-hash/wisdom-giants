const fs = require('fs');

let content = fs.readFileSync('src/components/consult-client.tsx', 'utf8');

const errorMap = {
  ko: 'error: "매칭 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.",\n    customResultDesc',
  en: 'error: "An error occurred during matching. Please try again later.",\n    customResultDesc',
  de: 'error: "Beim Abgleich ist ein Fehler aufgetreten. Bitte versuchen Sie es später erneut.",\n    customResultDesc',
  ja: 'error: "マッチング中にエラーが発生しました。後でもう一度お試しください。",\n    customResultDesc',
  es: 'error: "Ocurrió un error durante la coincidencia. Por favor, inténtelo de nuevo más tarde.",\n    customResultDesc',
  fr: 'error: "Une erreur s\'est produite lors de la correspondance. Veuillez réessayer plus tard.",\n    customResultDesc',
  it: 'error: "Si è verificato un errore durante l\'abbinamento. Riprova più tardi.",\n    customResultDesc',
  pt: 'error: "Ocorreu um erro durante a correspondência. Por favor, tente novamente mais tarde.",\n    customResultDesc'
};

for (const [lang, errorStr] of Object.entries(errorMap)) {
  // We look for 'customResultDesc' in that language block and insert 'error: ...,' before it
  // But wait, it's safer to use regex to find the block for each language
  const regex = new RegExp(`(${lang}: \\{[\\s\\S]*?)customResultDesc`, 'g');
  content = content.replace(regex, `$1${errorStr}`);
}

content = content.replace(/alert\("매칭 중 오류가 발생했습니다\. 잠시 후 다시 시도해 주세요\."\);/g, "alert(labels.error || 'An error occurred during matching.');");

fs.writeFileSync('src/components/consult-client.tsx', content);
console.log('Fixed i18n alerts in consult-client.tsx');
