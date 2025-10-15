import type { ChatMessage } from '../types/chat';

export interface ChatbotResponse {
  message: string;
  diagnosis?: string | null;
}

/**
 * Send conversation messages to the Supabase Edge Function that proxies to the model.
 *
 * messages: array of { role, content }
 * apiKey: user-supplied model API key (optional)
 * features: optional numeric features array
 */
export const queryChatbot = async (
  messages: ChatMessage[],
  apiKey?: string | null,
  features: number[] = []
): Promise<ChatbotResponse> => {
  const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`;

  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
    },
    body: JSON.stringify({ messages, apiKey, features }),
  });

  const data = await response.json();

  if (data.error) {
    throw new Error(data.error);
  }

  return {
    message: data.message,
    diagnosis: data.diagnosis ?? null,
  };
};
