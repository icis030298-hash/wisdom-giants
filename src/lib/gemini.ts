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
        persona,
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
    return `오류 발생: ${error instanceof Error ? error.message : '알 수 없는 오류'}`;
  }
}
