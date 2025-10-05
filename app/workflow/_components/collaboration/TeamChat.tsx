"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send } from "lucide-react";
import { CollaborationUser, ChatMessage } from "@/lib/types";

interface TeamChatProps {
  messages: ChatMessage[];
  users: CollaborationUser[];
  onSendMessage: (message: string) => void;
  messagesEndRef: React.RefObject<HTMLDivElement>;
}

export function TeamChat({ messages, users, onSendMessage, messagesEndRef }: TeamChatProps) {
  const [newMessage, setNewMessage] = useState("");

  const handleSend = () => {
    if (!newMessage.trim()) return;
    onSendMessage(newMessage);
    setNewMessage("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-2 min-h-[280px] max-h-[280px]">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-muted-foreground">
              <div className="text-sm">No messages yet</div>
              <div className="text-xs mt-1">Start the conversation!</div>
            </div>
          </div>
        ) : (
          messages.map((message) => {
            const user = users.find(u => u.id === message.userId) || { name: 'Unknown', avatar: '' };
            return (
              <div key={message.id} className="flex gap-2 hover:bg-muted/50 -mx-1 px-1 py-1 rounded">
                <Avatar className="w-7 h-7 shrink-0">
                  <AvatarImage src={user.avatar} />
                  <AvatarFallback className="text-xs">
                    {user.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2">
                    <span className="text-sm font-medium">{user.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-sm mt-0.5 break-words">{message.message}</p>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="p-1 border-t mt-auto shrink-0 bg-background">
        <div className="flex gap-1">
          <Input
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1 h-8"
          />
          <Button 
            size="sm" 
            onClick={handleSend} 
            disabled={!newMessage.trim()}
            className="h-8 px-2"
          >
            <Send className="w-3 h-3" />
          </Button>
        </div>
      </div>
    </div>
  );
}