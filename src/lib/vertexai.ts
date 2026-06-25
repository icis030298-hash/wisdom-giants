import { GoogleGenerativeAI } from "@google/generative-ai";

class GoogleGenerativeAIWrapper {
  private genAI: GoogleGenerativeAI;

  constructor(apiKey: string) {
    this.genAI = new GoogleGenerativeAI(apiKey);
  }

  getGenerativeModel(options: any) {
    let systemInstruction = options.systemInstruction;
    
    // Normalize systemInstruction from Vertex AI format if needed
    if (systemInstruction && typeof systemInstruction === "object") {
      if (
        systemInstruction.parts &&
        systemInstruction.parts[0] &&
        systemInstruction.parts[0].text
      ) {
        systemInstruction = systemInstruction.parts[0].text;
      }
    }

    const modelParams: any = {
      model: options.model
    };

    if (systemInstruction) {
      modelParams.systemInstruction = systemInstruction;
    }

    if (options.generationConfig) {
      modelParams.generationConfig = options.generationConfig;
    }

    return this.genAI.getGenerativeModel(modelParams);
  }
}

let vertexAIInstance: any = null;

export function getVertexAIInstance(): any {
  if (vertexAIInstance) return vertexAIInstance;
  const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY || "";
  vertexAIInstance = new GoogleGenerativeAIWrapper(apiKey);
  return vertexAIInstance;
}
