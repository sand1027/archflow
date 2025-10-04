"use client";

import { CollaborationUser, ChatMessage } from "./types";

export class CollaborationSocket {
  private ws: WebSocket | null = null;
  private workflowId: string;
  private user: CollaborationUser;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  constructor(workflowId: string, user: CollaborationUser) {
    this.workflowId = workflowId;
    this.user = user;
    this.connect();
  }

  private connect() {
    try {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}/api/ws/collaboration`;
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
      user: this.user
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
      case 'cursor-move':
        this.onCursorMove?.(data.userId, data.position);
        break;
      case 'node-update':
        this.onNodeUpdate?.(data.nodeId, data.changes);
        break;
      case 'chat-message':
        this.onChatMessage?.(data.message);
        break;
      case 'video-call-start':
        this.onVideoCallStart?.(data.participants);
        break;
      case 'video-call-end':
        this.onVideoCallEnd?.();
        break;
    }
  }

  private send(data: any) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data));
    }
  }

  // Public methods
  sendCursorPosition(x: number, y: number) {
    this.send({
      type: 'cursor-move',
      workflowId: this.workflowId,
      position: { x, y }
    });
  }

  sendNodeUpdate(nodeId: string, changes: any) {
    this.send({
      type: 'node-update',
      workflowId: this.workflowId,
      nodeId,
      changes
    });
  }

  sendChatMessage(message: string) {
    const chatMessage: ChatMessage = {
      id: Date.now().toString(),
      userId: this.user.id,
      message,
      timestamp: new Date(),
      type: 'text'
    };

    this.send({
      type: 'chat-message',
      workflowId: this.workflowId,
      message: chatMessage
    });
  }

  startVideoCall() {
    this.send({
      type: 'video-call-start',
      workflowId: this.workflowId,
      userId: this.user.id
    });
  }

  endVideoCall() {
    this.send({
      type: 'video-call-end',
      workflowId: this.workflowId,
      userId: this.user.id
    });
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  // Event handlers (to be set by components)
  onUserJoined?: (user: CollaborationUser) => void;
  onUserLeft?: (userId: string) => void;
  onCursorMove?: (userId: string, position: { x: number; y: number }) => void;
  onNodeUpdate?: (nodeId: string, changes: any) => void;
  onChatMessage?: (message: ChatMessage) => void;
  onVideoCallStart?: (participants: string[]) => void;
  onVideoCallEnd?: () => void;
}