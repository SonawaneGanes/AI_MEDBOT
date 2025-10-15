export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  session_id: string;
  created_at: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}
