export async function getGiantResponse(persona: string, userMessage: string, giantName: string, history: { role: string, content: string }[] = []) {
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
        messages: history, // 전체 대화 내역 전달
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
    throw error; // 에러를 상위로 던져서 컴포넌트에서 처리하게 함
  }
}
