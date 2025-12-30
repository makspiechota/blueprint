import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ChatMessage, ChatContext } from '../types/chat';
import { aiService } from '../services/aiService';
import { useBusinessData } from '../context/BusinessDataContext';

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  resourceType: string;
  resourceData: any;
}

const ChatModal: React.FC<ChatModalProps> = ({
  isOpen,
  onClose,
  resourceType,
  resourceData
}) => {
  const { productName } = useBusinessData();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const getResourcePath = (resourceType: string): string => {
    // Map resource types to their corresponding blueprint files
    // Since we're running from the server at blueprint root, and files are in the subfolder
    if (resourceType.startsWith('north-star')) {
      return `src/data/${productName}/north-star.yaml`;
    }
    if (resourceType.startsWith('lean-canvas')) {
      return `src/data/${productName}/lean-canvas.yaml`;
    }
    if (resourceType.startsWith('architectural-scope')) {
      return `src/data/${productName}/architectural-scope.yaml`;
    }
    if (resourceType.startsWith('lean-viability')) {
      return `src/data/${productName}/lean-viability.yaml`;
    }
    if (resourceType.startsWith('aaarr-metrics') || resourceType.startsWith('customers-factory')) {
      return `src/data/${productName}/aaarr-metrics.yaml`;
    }
    if (resourceType.startsWith('policy-charter')) {
      return `src/data/${productName}/policy-charter.yaml`;
    }
    if (resourceType.startsWith('c4-model')) {
      // Extract filename from resourceType like "c4-model:blueprint.likec4"
      const fileName = resourceType.split(':')[1] || 'blueprint.likec4';
      return `src/data/${productName}/c4/${fileName}`;
    }
    // Default fallback
    return `src/data/${productName}/${resourceType}.yaml`;
  };

  const initializeSession = useCallback(async () => {
    if (isInitialized) {
      console.log('Session already initialized, skipping');
      return; // Prevent double initialization
    }

    console.log('Initializing session for:', resourceType);
    try {
      const resourcePath = getResourcePath(resourceType);

      await aiService.initializeSession(resourceType, resourcePath, resourceData);
      setIsInitialized(true);
      console.log('Session initialized successfully');
    } catch (error) {
      console.error('Failed to initialize chat session:', error);
      // Add error message to chat
      const errorMessage: ChatMessage = {
        id: Date.now().toString(),
        role: 'assistant',
        content: `Error initializing chat: ${error instanceof Error ? error.message : 'Unknown error'}`,
        timestamp: new Date()
      };
      setMessages([errorMessage]);
    }
  }, [resourceType, resourceData, isInitialized, productName]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && resourceData && !isInitialized) {
      initializeSession();
    } else if (!isOpen && isInitialized) {
      // Clean up session when modal closes
      aiService.closeSession();
      setIsInitialized(false);
      setMessages([]);
    }
  }, [isOpen, resourceData, isInitialized, initializeSession]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const resourcePath = getResourcePath(resourceType);
      const context: ChatContext = {
        resourceType,
        resourcePath,
        currentContent: resourceData
      };

      // Check if this is a modification request
      const modificationIntent = aiService.detectModificationIntent(inputValue);

      if (modificationIntent.isModification && modificationIntent.newContent) {
        // Handle modification
        const modifyResult = await aiService.requestModification(resourceType, context.resourcePath, modificationIntent.newContent);

        const aiMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: modifyResult.message,
          timestamp: new Date()
        };

        setMessages(prev => [...prev, aiMessage]);
      } else {
        // Regular chat
        const aiResponse = await aiService.sendMessage(inputValue, context);

        const aiMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: aiResponse.message,
          timestamp: new Date()
        };

        setMessages(prev => [...prev, aiMessage]);
      }
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className={`fixed top-0 right-0 h-full w-96 bg-white dark:bg-gray-800 shadow-xl z-50 transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center bg-blue-50 dark:bg-blue-900/20">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Chat about {resourceData.title || 'Resource'}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Resource type: {resourceType}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1"
          >
            ✕
          </button>
        </div>

        {/* Messages Area */}
        <div
          className="flex-1 overflow-y-auto p-4 space-y-4"
          role="log"
          aria-label="Message history"
        >
          {messages.length === 0 ? (
            <div className="text-center text-gray-500 dark:text-gray-400 py-8">
              <p>Start a conversation about this {resourceType} resource.</p>
              <p className="text-sm mt-2">You can ask for suggestions or request modifications.</p>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    message.role === 'user'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white'
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))
          )}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white px-4 py-2 rounded-lg">
                <p className="text-sm">AI is thinking...</p>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex space-x-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Type your message..."
              disabled={isLoading}
              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white disabled:opacity-50"
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-md transition-colors duration-200"
            >
              {isLoading ? '...' : 'Send'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatModal;