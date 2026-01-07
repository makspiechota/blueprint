export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface ChatContext {
  resourceType: string;
  resourcePath: string;
  currentContent: any;
}

export interface ChatSession {
  id: string;
  context: ChatContext;
  messages: ChatMessage[];
  isOpen: boolean;
}