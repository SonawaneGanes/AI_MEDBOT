/*
  # Create chat messages table

  1. New Tables
    - `chat_messages`
      - `id` (uuid, primary key) - Unique identifier for each message
      - `role` (text) - Role of the message sender ('user' or 'assistant')
      - `content` (text) - The actual message content
      - `session_id` (text) - Session identifier to group related messages
      - `created_at` (timestamptz) - Timestamp when message was created
  
  2. Security
    - Enable RLS on `chat_messages` table
    - Add policy for anyone to insert messages (for demo purposes)
    - Add policy for anyone to read messages (for demo purposes)
  
  3. Performance
    - Add index on session_id for efficient message retrieval
    - Add index on created_at for chronological ordering
*/

CREATE TABLE IF NOT EXISTS chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  role text NOT NULL CHECK (role IN ('user', 'assistant')),
  content text NOT NULL,
  session_id text NOT NULL DEFAULT 'default',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert messages"
  ON chat_messages
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Anyone can read messages"
  ON chat_messages
  FOR SELECT
  TO anon
  USING (true);

CREATE INDEX IF NOT EXISTS idx_chat_messages_session_id ON chat_messages(session_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at ON chat_messages(created_at);