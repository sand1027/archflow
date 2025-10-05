"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send } from "lucide-react";
import { CollaborationUser, ChatMessage } from "@/lib/types";

interface PrivateChatProps {
  selectedUser: CollaborationUser | null;
  privateMessages: ChatMessage[];
  users: CollaborationUser[];
  otherUsers: CollaborationUser[];
  onSelectUser: (user: CollaborationUser) => void;
  onSendMessage: (message: string) => void;
  onBackToUserList: () => void;
  messagesEndRef: React.RefObject<HTMLDivElement>;
}

export function PrivateChat({
  selectedUser,
  privateMessages,
  users,
  otherUsers,
  onSelectUser,
  onSendMessage,
  onBackToUserList,
  messagesEndRef
}: PrivateChatProps) {
  const [newMessage, setNewMessage] = useState("");

  const handleSend = () => {
    if (!newMessage.trim() || !selectedUser) return;
    onSendMessage(newMessage);
    setNewMessage("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };



  if (!selectedUser) {
    return (
      <div className="flex flex-col h-full">
        <div className="flex-1 overflow-y-auto px-2 py-2">
          {otherUsers.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-muted-foreground text-sm">No other users online</div>
            </div>
          ) : (
            <div className="space-y-2">
              {otherUsers.map((user) => (
                <button 
                  key={user.id} 
                  className="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-accent hover:text-accent-foreground border border-border/50 hover:border-border transition-all duration-200 text-left"
                  onClick={() => onSelectUser(user)}
                >
                  <Avatar className="w-6 h-6 shrink-0">
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback className="text-xs font-medium">
                      {user.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm truncate">{user.name}</div>
                    <div className="text-xs text-green-600 flex items-center gap-1 mt-0.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                      Online
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">→</div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Chat Header */}
      <div className="px-2 py-2 border-b shrink-0">
        <div className="flex items-center gap-2">
          <button 
            onClick={onBackToUserList} 
            className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded"
          >
            ←
          </button>
          <Avatar className="w-5 h-5">
            <AvatarImage src={selectedUser.avatar} />
            <AvatarFallback className="text-xs">
              {selectedUser.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="font-medium text-xs truncate">{selectedUser.name}</div>
            <div className="text-xs text-green-600 flex items-center gap-1">
              <div className="w-1 h-1 rounded-full bg-green-500" />
              Online
            </div>
          </div>
        </div>
      </div>
      
      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-2 max-h-[300px]">
        {privateMessages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-muted-foreground">
              <div className="text-sm">No messages yet</div>
              <div className="text-xs mt-1">Start the conversation!</div>
            </div>
          </div>
        ) : (
          privateMessages.map((message) => {
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
      
      {/* Message Input */}
      <div className="p-1 border-t bg-background">
        <div className="flex gap-1">
          <Input
            placeholder={`Message ${selectedUser.name}...`}
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