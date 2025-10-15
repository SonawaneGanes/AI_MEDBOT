import { useState, FormEvent } from 'react';
import { Key } from 'lucide-react';

interface ApiKeyModalProps {
  onSubmit: (apiKey: string) => void;
}

export function ApiKeyModal({ onSubmit }: ApiKeyModalProps) {
  const [apiKey, setApiKey] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (apiKey.trim()) {
      onSubmit(apiKey.trim());
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
            <Key className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900">OpenRouter API Key</h2>
        </div>

        <p className="text-gray-600 mb-4 text-sm">
          Enter your OpenRouter API key to start chatting. Get your key at{' '}
          <a
            href="https://openrouter.ai/keys"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            openrouter.ai/keys
          </a>
        </p>

        <form onSubmit={handleSubmit}>
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="sk-or-v1-..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
            autoFocus
          />

          <button
            type="submit"
            disabled={!apiKey.trim()}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Start Chatting
          </button>
        </form>

        <p className="text-xs text-gray-500 mt-4">
          Your API key is stored locally and never sent to our servers. It's only used to communicate with OpenRouter.
        </p>
      </div>
    </div>
  );
}
