import dotenv from 'dotenv';
import path from 'path';

// Load .env.local
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

async function testDebate() {
  console.log("=== STARTING VERTEX DEBATE API TEST ===");
  
  const payload = {
    giants: ["seneca", "friedrich-nietzsche", "aristotle"],
    topic: "인간의 진정한 행복과 고유한 영혼의 목적에 대하여",
    history: [
      { speaker: "friedrich-nietzsche", speakerName: "프리드리히 니체", content: "행복이란 나약한 자들의 평온함이 아닙니다! 힘의 의지가 고양되고, 저항을 극복할 때 느끼는 극도의 환희가 진짜 행복이오." }
    ],
    currentSpeaker: "seneca",
    locale: "ko",
    userMessage: "현대인들은 늘 번아웃에 시달립니다. 이에 대해 어떻게 생각하시나요?"
  };

  try {
    // We will directly import and run the POST handler logic by mocking the Request object
    // Or simpler, let's call our local server if it is running,
    // Or even simpler: let's test by importing the debate route handler logic directly.
    // However, route handlers use NextRequest/NextResponse.
    // Let's call the API via fetch since we don't have local server running,
    // wait, we can run a quick mock test or mock the route handler.
    // Let's construct a mock Request and call POST directly.
    const { POST } = require('../src/app/api/debate/route');
    const mockRequest = {
      json: async () => payload
    };
    
    console.log("Calling Debate POST route directly...");
    const response = await POST(mockRequest);
    const resJson = await response.json();
    
    console.log("\n=== DEBATE API RESPONSE SUCCESS ===");
    console.log("Speaker:", resJson.speaker);
    console.log("Response Content:\n", resJson.content);
  } catch (err: any) {
    console.error("\n❌ DEBATE API TEST FAILED:", err.message || err);
  }
}

testDebate();
