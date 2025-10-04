"use client";

import { CollaborationUser, ChatMessage } from "./types";

export class CollaborationService {
  private ws: WebSocket | null = null;
  private workflowId: string;
  private currentUser: CollaborationUser;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  constructor(workflowId: string, currentUser: CollaborationUser) {
    this.workflowId = workflowId;
    this.currentUser = currentUser;
    this.connect();
  }

  private connect() {
    try {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}/api/ws/collaboration?workflowId=${this.workflowId}&userId=${this.currentUser.id}`;
      this.ws = new WebSocket(wsUrl);
      
      this.ws.onopen = () => {
        console.log("Connected to collaboration server");
        this.reconnectAttempts = 0;
        this.joinWorkflow();
      };

      this.ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        this.handleMessage(data);
      };

      this.ws.onclose = () => {
        console.log("Disconnected from collaboration server");
        this.attemptReconnect();
      };

      this.ws.onerror = (error) => {
        console.error("WebSocket error:", error);
      };
    } catch (error) {
      console.error("Failed to connect to collaboration server:", error);
    }
  }

  private attemptReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      setTimeout(() => {
        console.log(`Reconnecting... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
        this.connect();
      }, 2000 * this.reconnectAttempts);
    }
  }

  private joinWorkflow() {
    this.send({
      type: 'join',
      workflowId: this.workflowId,
      user: this.currentUser
    });
  }

  private handleMessage(data: any) {
    switch (data.type) {
      case 'user-joined':
        this.onUserJoined?.(data.user);
        break;
      case 'user-left':
        this.onUserLeft?.(data.userId);
        break;
      case 'users-list':
        this.onUsersUpdate?.(data.users);
        break;
      case 'chat-message':
        this.onChatMessage?.(data.message);
        break;
      case 'chat-history':
        this.onChatHistory?.(data.messages);
        break;
    }
  }

  private send(data: any) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data));
    }
  }

  sendChatMessage(message: string) {
    const chatMessage: ChatMessage = {
      id: Date.now().toString(),
      userId: this.currentUser.id,
      message,
      timestamp: new Date(),
      type: 'text'
    };

    this.send({
      type: 'chat-message',
      workflowId: this.workflowId,
      message: chatMessage
    });

    return chatMessage;
  }

  disconnect() {
    if (this.ws) {
      this.send({
        type: 'leave',
        workflowId: this.workflowId,
        userId: this.currentUser.id
      });
      this.ws.close();
      this.ws = null;
    }
  }

  // Event handlers
  onUserJoined?: (user: CollaborationUser) => void;
  onUserLeft?: (userId: string) => void;
  onUsersUpdate?: (users: CollaborationUser[]) => void;
  onChatMessage?: (message: ChatMessage) => void;
  onChatHistory?: (messages: ChatMessage[]) => void;
}