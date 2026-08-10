const { createWorker } = require('tesseract.js');

let worker = null;

async function getWorker() {
  if (!worker) {
    worker = await createWorker(['eng', 'chi_sim']);
  }
  return worker;
}

/**
 * Validates whether an image contains embedded text or writing.
 * @param {string} imagePath
 * @returns {Promise<{ clean: boolean, text: string }>}
 */
async function validateImageText(imagePath) {
  try {
    const w = await getWorker();
    const ret = await w.recognize(imagePath);
    const rawText = ret.data.text.trim();

    // Filter out vector line noise and extract actual word tokens
    const words = rawText.split(/\s+/).filter(w => {
      const clean = w.replace(/[^a-zA-Z0-9\u4e00-\u9fa5]/g, '');
      return clean.length >= 3;
    });

    const clean = words.length === 0;
    return { clean, text: words.join(' ') };
  } catch (e) {
    return { clean: true, text: '' };
  }
}

async function closeOcrWorker() {
  if (worker) {
    await worker.terminate();
    worker = null;
  }
}

module.exports = { validateImageText, closeOcrWorker };
