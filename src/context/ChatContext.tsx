import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ChatContextType {
  isOpen: boolean;
  resourceType: string | null;
  resourceData: any;
  openChat: (resourceType: string, resourceData: any) => void;
  closeChat: () => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within ChatProvider');
  }
  return context;
};

interface ChatProviderProps {
  children: ReactNode;
}

export const ChatProvider: React.FC<ChatProviderProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [resourceType, setResourceType] = useState<string | null>(null);
  const [resourceData, setResourceData] = useState<any>(null);

  const openChat = (type: string, data: any) => {
    setResourceType(type);
    setResourceData(data);
    setIsOpen(true);
  };

  const closeChat = () => {
    setIsOpen(false);
    setResourceType(null);
    setResourceData(null);
  };

  return (
    <ChatContext.Provider
      value={{
        isOpen,
        resourceType,
        resourceData,
        openChat,
        closeChat,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};