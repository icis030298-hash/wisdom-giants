import { VertexAI } from "@google-cloud/vertexai";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });
process.env.GOOGLE_APPLICATION_CREDENTIALS = path.resolve(process.cwd(), "google-service-account.json");

const content = fs.readFileSync(path.resolve(process.cwd(), 'src/data/blog-posts.ts'), 'utf8');
const posts = content.split('"slug": "');
posts.shift();

const requiredLocales = ['sv', 'cs', 'th', 'hi', 'ru', 'ar'];

async function translateMissing() {
  const vertexai = new VertexAI({ project: "giantswisdom-8dc26", location: "us-central1" });
  const model = vertexai.preview.getGenerativeModel({
    model: "gemini-2.5-flash",
    generationConfig: { temperature: 0.2 }
  });

  const patchFile = path.resolve(process.cwd(), 'scratch/blog-patch.json');
  let patchData: any = {};
  if (fs.existsSync(patchFile)) {
    patchData = JSON.parse(fs.readFileSync(patchFile, 'utf8'));
  }

  for (let i = 0; i < posts.length; i++) {
    const postStr = posts[i];
    const slugMatch = postStr.match(/^([^"]+)"/);
    if (!slugMatch) continue;
    const slug = slugMatch[1];
    
    // Extract English content to translate
    const enMatch = postStr.match(/"en":\s*\{\s*"title":\s*"([^"\\]*(?:\\.[^"\\]*)*)",\s*"description":\s*"([^"\\]*(?:\\.[^"\\]*)*)",\s*"content":\s*"([^"\\]*(?:\\.[^"\\]*)*)"/);
    if (!enMatch) {
      console.log(`Could not find English text for ${slug}, skipping.`);
      continue;
    }
    const [_, title, desc, cont] = enMatch;
    
    if (!patchData[slug]) patchData[slug] = {};

    for (const loc of requiredLocales) {
      if (postStr.indexOf(`"${loc}": {`) === -1 && !patchData[slug][loc]) {
        console.log(`Translating ${slug} to ${loc}...`);
        try {
          const prompt = `Translate the following blog post title, description, and content into the locale '${loc}'.
Return ONLY a valid JSON object with keys "title", "description", and "content".
Do not wrap in markdown blocks, just raw JSON.

Title: ${title}
Description: ${desc}
Content: ${cont}`;

          const result = await model.generateContent(prompt);
          let responseText = await result.response.text();
          responseText = responseText.replace(/^```json\n?/, '').replace(/```$/, '').trim();
          
          patchData[slug][loc] = JSON.parse(responseText);
          fs.writeFileSync(patchFile, JSON.stringify(patchData, null, 2));
          console.log(`Done ${slug} -> ${loc}`);
          
          // sleep 2s to avoid rate limits
          await new Promise(r => setTimeout(r, 2000));
        } catch (e: any) {
          console.error(`Error translating ${slug} to ${loc}:`, e.message);
        }
      }
    }
  }
  console.log("Translation generation complete.");
}

translateMissing();
