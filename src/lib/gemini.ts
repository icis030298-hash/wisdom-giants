/**
 * Gemini API와 통신하여 거인의 응답을 가져오는 클라이언트 사이드 함수입니다.
 * 낡은 fetch 방식 대신 에러 핸들링이 보강된 최신 로직으로 관리합니다.
 */
export async function getGiantResponse(persona: string, userMessage: string, giantName: string, history: { role: string, content: string }[] = []) {
  try {
    // Gemini API 규칙: 첫 번째 메시지는 반드시 'user'여야 하므로, 
    // AI의 첫인사(assistant)가 배열 처음에 있다면 제외합니다.
    let filteredHistory = history;
    if (filteredHistory.length > 0 && filteredHistory[0].role !== 'user') {
      filteredHistory = filteredHistory.slice(1);
    }

    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: userMessage,
        giantName,
        persona,
        messages: filteredHistory,
      }),
    });

    // 상세 에러 처리
    if (!response.ok) {
      let errorMessage = 'API 요청 실패';
      try {
        const errorData = await response.json();
        errorMessage = errorData.details || errorData.error || errorMessage;
      } catch (e) {
        // JSON 파싱 실패 시 기본 메시지 유지
      }
      
      console.error(`[Gemini Client Error] ${errorMessage}`);
      throw new Error(errorMessage);
    }

    const data = await response.json();
    
    if (!data.message) {
      throw new Error('응답 데이터가 비어 있습니다.');
    }

    return data.message;
  } catch (error: any) {
    console.error("[Gemini API Request Error]", error);
    // 사용자에게 보여줄 친절한 메시지로 변환하여 던짐
    throw new Error(error.message || '알 수 없는 오류가 발생했습니다.');
  }
}
