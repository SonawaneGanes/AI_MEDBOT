import { useState, useEffect, useRef } from 'react';
import { MessageSquare, Trash2, Loader2 } from 'lucide-react';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { ApiKeyModal } from './ApiKeyModal';
import { supabase } from '../lib/supabase';
import { queryChatbot } from '../lib/chatbot';
import type { ChatMessage as ChatMessageType } from '../types/chat';

export function Chat() {
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [sessionId] = useState(() => `session_${Date.now()}`);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const storedApiKey = localStorage.getItem('openrouter_api_key');
    if (storedApiKey) {
      setApiKey(storedApiKey);
    }
  }, []);

  useEffect(() => {
    if (apiKey) {
      loadMessages();
    }
  }, [apiKey]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadMessages = async () => {
    const { data, error } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true });

    if (!error && data) {
      setMessages(data.map(msg => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content
      })));
    }
  };

  const saveMessage = async (role: 'user' | 'assistant', content: string) => {
    await supabase.from('chat_messages').insert({
      role,
      content,
      session_id: sessionId
    });
  };

  const handleApiKeySubmit = (key: string) => {
    localStorage.setItem('openrouter_api_key', key);
    setApiKey(key);
  };

  const handleSendMessage = async (content: string) => {
    if (!apiKey) return;

    const userMessage: ChatMessageType = { role: 'user', content };
    setMessages(prev => [...prev, userMessage]);
    await saveMessage('user', content);

    setIsLoading(true);

    try {
      const conversationHistory = [...messages, userMessage].map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      const data = await queryChatbot(conversationHistory, apiKey, []);

      const assistantMessage: ChatMessageType = {
        role: 'assistant',
        content: data.message
      };

      setMessages(prev => [...prev, assistantMessage]);
      await saveMessage('assistant', data.message);

    } catch (error) {
      const errorMessage: ChatMessageType = {
        role: 'assistant',
        content: `Error: ${error instanceof Error ? error.message : 'Something went wrong. Please try again.'}`
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = async () => {
    setMessages([]);
    await supabase
      .from('chat_messages')
      .delete()
      .eq('session_id', sessionId);
  };

  const handleResetApiKey = () => {
    localStorage.removeItem('openrouter_api_key');
    setApiKey(null);
    setMessages([]);
  };

  if (!apiKey) {
    return <ApiKeyModal onSubmit={handleApiKeySubmit} />;
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <header className="bg-white border-b shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">AI Chatbot</h1>
              <p className="text-xs text-gray-500">Powered by OpenRouter</p>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleClearChat}
              className="px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-2"
              title="Clear chat"
            >
              <Trash2 className="w-4 h-4" />
              <span className="text-sm hidden sm:inline">Clear</span>
            </button>
            <button
              onClick={handleResetApiKey}
              className="px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors text-sm"
              title="Change API key"
            >
              Change Key
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4 py-6">
          {messages.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Start a conversation</h2>
              <p className="text-gray-600">Ask me anything, just like ChatGPT!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((message, index) => (
                <ChatMessage key={index} message={message} />
              ))}
              {isLoading && (
                <div className="flex gap-3 justify-start">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                    <Loader2 className="w-5 h-5 text-white animate-spin" />
                  </div>
                  <div className="bg-gray-200 text-gray-900 rounded-2xl rounded-bl-none px-4 py-2">
                    <p className="text-sm">Thinking...</p>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      </main>

      <ChatInput onSendMessage={handleSendMessage} disabled={isLoading} />
    </div>
  );
}
