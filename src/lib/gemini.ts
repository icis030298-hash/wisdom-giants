export async function getGiantResponse(persona: string, userMessage: string, giantName: string) {
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: userMessage,
        giantName,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'API 요청 실패');
    }

    const data = await response.json();
    return data.message;
  } catch (error) {
    console.error("Gemini Client Error:", error);
    return "죄송합니다. 거인의 지혜를 빌려오는 도중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.";
  }
}
