"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageSquare, Lock } from "lucide-react";
import { CollaborationUser, ChatMessage } from "@/lib/types";
import { WebRTCService } from "@/lib/webrtc-service";
import { CollaborationHeader } from "./collaboration/CollaborationHeader";
import { VideoCallArea } from "./collaboration/VideoCallArea";
import { ActiveUsers } from "./collaboration/ActiveUsers";
import { TeamChat } from "./collaboration/TeamChat";
import { PrivateChat } from "./collaboration/PrivateChat";

interface CollaborationPanelProps {
  workflowId: string;
  currentUser: CollaborationUser;
}

export function CollaborationPanel({ workflowId, currentUser }: CollaborationPanelProps) {
  const [users, setUsers] = useState<CollaborationUser[]>([currentUser]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [privateMessages, setPrivateMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('team');
  const [selectedUser, setSelectedUser] = useState<CollaborationUser | null>(null);
  
  // Video/Voice call state
  const [isInCall, setIsInCall] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStreams, setRemoteStreams] = useState<Map<string, MediaStream>>(new Map());
  const [callInProgress, setCallInProgress] = useState(false);
  const [callInitiator, setCallInitiator] = useState<string | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const eventSourceRef = useRef<EventSource | null>(null);
  const webrtcService = useRef<WebRTCService | null>(null);
  
  const getPrivateChatId = (userId1: string, userId2: string) => {
    const sortedIds = [userId1, userId2].sort();
    return `private-${sortedIds[0]}-${sortedIds[1]}`;
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages.length, privateMessages.length]);

  // Load initial data and setup SSE
  useEffect(() => {
    const loadData = async () => {
      try {
        // Load from localStorage first
        const savedTeamMessages = localStorage.getItem(`team-messages-${workflowId}`);
        if (savedTeamMessages) {
          setMessages(JSON.parse(savedTeamMessages));
        }

        const [teamMessagesRes, usersRes] = await Promise.all([
          fetch(`/api/collaboration/${workflowId}/messages?type=team`),
          fetch(`/api/collaboration/${workflowId}/active-users`)
        ]);

        if (teamMessagesRes.ok) {
          const teamHistory = await teamMessagesRes.json();
          // Merge server data with local data
          const localMessages = savedTeamMessages ? JSON.parse(savedTeamMessages) : [];
          const mergedMessages = [...localMessages];
          
          teamHistory.forEach((serverMsg: ChatMessage) => {
            if (!mergedMessages.find(m => m.id === serverMsg.id)) {
              mergedMessages.push(serverMsg);
            }
          });
          
          mergedMessages.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
          setMessages(mergedMessages);
          localStorage.setItem(`team-messages-${workflowId}`, JSON.stringify(mergedMessages));
        }

        if (usersRes.ok) {
          const activeUsers = await usersRes.json();
          setUsers(activeUsers);
          localStorage.removeItem(`call-${workflowId}`);
        }

        setIsLoading(false);
      } catch (error) {
        console.error('Failed to load data:', error);
        const savedMessages = localStorage.getItem(`team-messages-${workflowId}`);
        if (savedMessages) {
          setMessages(JSON.parse(savedMessages));
        }
        setIsLoading(false);
      }
    };

    loadData();

    // Setup SSE connection
    const eventSource = new EventSource(`/api/collaboration/${workflowId}/stream`);
    eventSourceRef.current = eventSource;
    
    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        
        switch (data.type) {
          case 'user-joined':
            setUsers(prev => {
              const exists = prev.find(u => u.id === data.user.id);
              if (exists) return prev;
              return [...prev, data.user];
            });
            break;
            
          case 'user-left':
            setUsers(prev => prev.filter(u => u.id !== data.userId));
            break;
            
          case 'users-list':
            setUsers(data.users);
            break;
            
          case 'new-message':
            if (data.isPrivate) {
              if (data.targetUserId === currentUser.id || data.message.userId === currentUser.id) {
                const otherUserId = data.message.userId === currentUser.id ? data.targetUserId : data.message.userId;
                const chatId = getPrivateChatId(currentUser.id, otherUserId);
                
                // Update localStorage
                const saved = localStorage.getItem(`private-messages-${chatId}`);
                const existing = saved ? JSON.parse(saved) : [];
                if (!existing.find((m: ChatMessage) => m.id === data.message.id)) {
                  const updated = [...existing, data.message];
                  localStorage.setItem(`private-messages-${chatId}`, JSON.stringify(updated));
                  
                  // Update UI if viewing this chat
                  if (selectedUser?.id === otherUserId) {
                    setPrivateMessages(updated);
                  }
                }
              }
            } else {
              setMessages(prev => {
                if (prev.find(m => m.id === data.message.id)) return prev;
                const updated = [...prev, data.message];
                localStorage.setItem(`team-messages-${workflowId}`, JSON.stringify(updated));
                return updated;
              });
            }
            break;
            
          case 'call-started':
            setCallInProgress(true);
            setCallInitiator(data.userId);
            localStorage.setItem(`call-${workflowId}`, JSON.stringify({
              callInProgress: true,
              callInitiator: data.userId,
              participants: [data.userId]
            }));
            if (data.userId === currentUser.id) {
              setIsInCall(true);
            }
            break;
            
          case 'call-ended':
            setCallInProgress(false);
            setCallInitiator(null);
            setIsInCall(false);
            setLocalStream(null);
            setRemoteStreams(new Map());
            localStorage.removeItem(`call-${workflowId}`);
            break;
            
          case 'user-left-call':
            setRemoteStreams(prev => {
              const newMap = new Map(prev);
              newMap.delete(data.userId);
              return newMap;
            });
            // Update participants list
            const leftCallState = localStorage.getItem(`call-${workflowId}`);
            if (leftCallState) {
              try {
                const state = JSON.parse(leftCallState);
                const participants = (state.participants || []).filter((id: string) => id !== data.userId);
                localStorage.setItem(`call-${workflowId}`, JSON.stringify({
                  ...state,
                  participants
                }));
              } catch (e) {
                console.warn('Failed to update participants:', e);
              }
            }
            break;
            
          case 'user-joined-call':
            if (data.userId === currentUser.id) {
              setIsInCall(true);
            }
            // Update participants list
            const joinCallState = localStorage.getItem(`call-${workflowId}`);
            if (joinCallState) {
              try {
                const state = JSON.parse(joinCallState);
                const participants = state.participants || [];
                if (!participants.includes(data.userId)) {
                  participants.push(data.userId);
                  localStorage.setItem(`call-${workflowId}`, JSON.stringify({
                    ...state,
                    participants
                  }));
                }
              } catch (e) {
                console.warn('Failed to update participants:', e);
              }
            }
            break;
            
          case 'webrtc-signal':
            if (webrtcService.current) {
              webrtcService.current.handleSignalingMessage(data.signal);
            }
            break;
        }
      } catch (error) {
        console.error('SSE parsing error:', error);
      }
    };

    eventSource.onerror = (error) => {
      console.error('SSE connection error:', error);
      if (eventSource.readyState === EventSource.CLOSED) {
        setTimeout(() => {
          if (!eventSourceRef.current || eventSourceRef.current.readyState === EventSource.CLOSED) {
            const newEventSource = new EventSource(`/api/collaboration/${workflowId}/stream`);
            eventSourceRef.current = newEventSource;
            newEventSource.onmessage = eventSource.onmessage;
            newEventSource.onerror = eventSource.onerror;
          }
        }, 2000);
      }
    };

    return () => {
      eventSource.close();
    };
  }, [workflowId, currentUser.id, selectedUser?.id]);

  const sendMessage = async (messageText: string, isPrivate: boolean) => {
    if (!messageText.trim()) return;
    if (isPrivate && !selectedUser) return;

    const message: ChatMessage = {
      id: `${Date.now()}-${currentUser.id}`,
      userId: currentUser.id,
      message: messageText.trim(),
      timestamp: new Date(),
      type: 'text'
    };

    // Optimistic update
    if (isPrivate) {
      const newPrivateMessages = [...privateMessages, message];
      setPrivateMessages(newPrivateMessages);
      const chatId = getPrivateChatId(currentUser.id, selectedUser!.id);
      localStorage.setItem(`private-messages-${chatId}`, JSON.stringify(newPrivateMessages));
    } else {
      const newTeamMessages = [...messages, message];
      setMessages(newTeamMessages);
      localStorage.setItem(`team-messages-${workflowId}`, JSON.stringify(newTeamMessages));
    }

    try {
      await fetch(`/api/collaboration/${workflowId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message, 
          isPrivate,
          chatId: isPrivate ? getPrivateChatId(currentUser.id, selectedUser!.id) : `team-${workflowId}`,
          targetUserId: isPrivate ? selectedUser!.id : undefined,
          workflowId
        })
      });

      await fetch(`/api/collaboration/${workflowId}/broadcast`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          type: 'new-message',
          message,
          isPrivate,
          targetUserId: isPrivate ? selectedUser!.id : undefined
        })
      });
    } catch (error) {
      console.error('Failed to send message:', error);
      if (isPrivate) {
        setPrivateMessages(prev => prev.filter(m => m.id !== message.id));
      } else {
        setMessages(prev => prev.filter(m => m.id !== message.id));
      }
    }
  };

  const selectUserForPrivateChat = async (user: CollaborationUser) => {
    setSelectedUser(user);
    setActiveTab('private');
    
    const chatId = getPrivateChatId(currentUser.id, user.id);
    
    // Load from localStorage first
    const saved = localStorage.getItem(`private-messages-${chatId}`);
    if (saved) {
      setPrivateMessages(JSON.parse(saved));
    } else {
      setPrivateMessages([]);
    }
    
    // Then fetch from server and merge
    try {
      const response = await fetch(`/api/collaboration/${workflowId}/messages?type=private&chatId=${chatId}`);
      if (response.ok) {
        const serverHistory = await response.json();
        const localMessages = saved ? JSON.parse(saved) : [];
        const mergedMessages = [...localMessages];
        
        serverHistory.forEach((serverMsg: ChatMessage) => {
          if (!mergedMessages.find(m => m.id === serverMsg.id)) {
            mergedMessages.push(serverMsg);
          }
        });
        
        mergedMessages.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
        setPrivateMessages(mergedMessages);
        localStorage.setItem(`private-messages-${chatId}`, JSON.stringify(mergedMessages));
      }
    } catch (error) {
      console.error('Failed to load private messages:', error);
    }
  };

  const startCall = useCallback(async (withVideo: boolean) => {
    if (isInCall || callInProgress) return;
    
    try {
      webrtcService.current = new WebRTCService(workflowId, currentUser.id);
      
      webrtcService.current.onRemoteStream = (userId: string, stream: MediaStream) => {
        console.log('🎥 Received remote stream from:', userId, 'tracks:', stream.getTracks().length);
        setRemoteStreams(prev => {
          const newMap = new Map(prev);
          newMap.set(userId, stream);
          console.log('📺 Updated remote streams, total:', newMap.size);
          return newMap;
        });
      };
      
      webrtcService.current.onUserLeft = (userId: string) => {
        setRemoteStreams(prev => {
          const newMap = new Map(prev);
          newMap.delete(userId);
          return newMap;
        });
      };
      
      const stream = await webrtcService.current.startCall(withVideo, !isMuted);
      
      setLocalStream(stream);
      setIsInCall(true);
      setIsVideoEnabled(withVideo);
      setCallInProgress(true);
      setCallInitiator(currentUser.id);
      
      await fetch(`/api/collaboration/${workflowId}/broadcast`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          type: 'call-started',
          userId: currentUser.id,
          withVideo
        })
      });
    } catch (error) {
      console.error('Failed to start call:', error);
    }
  }, [workflowId, currentUser.id, isInCall, isMuted, callInProgress]);

  const joinCall = useCallback(async (withVideo: boolean = true) => {
    if (isInCall) return;
    
    try {
      webrtcService.current = new WebRTCService(workflowId, currentUser.id);
      
      webrtcService.current.onRemoteStream = (userId: string, stream: MediaStream) => {
        console.log('🎥 Received remote stream from:', userId, 'tracks:', stream.getTracks().length);
        setRemoteStreams(prev => {
          const newMap = new Map(prev);
          newMap.set(userId, stream);
          console.log('📺 Updated remote streams, total:', newMap.size);
          return newMap;
        });
      };
      
      webrtcService.current.onUserLeft = (userId: string) => {
        setRemoteStreams(prev => {
          const newMap = new Map(prev);
          newMap.delete(userId);
          return newMap;
        });
      };
      
      const stream = await webrtcService.current.startCall(withVideo, !isMuted);
      
      setLocalStream(stream);
      setIsInCall(true);
      setIsVideoEnabled(withVideo);
      
      await fetch(`/api/collaboration/${workflowId}/broadcast`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          type: 'user-joined-call',
          userId: currentUser.id,
          withVideo
        })
      });
      
      console.log('✅ Join call complete - isInCall:', true);
    } catch (error) {
      console.error('Failed to join call:', error);
      setIsInCall(false);
      setLocalStream(null);
    }
  }, [workflowId, currentUser.id, isInCall, isMuted]);

  const leaveCall = useCallback(async () => {
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
    }
    
    if (webrtcService.current) {
      webrtcService.current.endCall();
    }
    
    setLocalStream(null);
    setRemoteStreams(new Map());
    setIsInCall(false);
    
    // Get current participants
    const leaveCallState = localStorage.getItem(`call-${workflowId}`);
    let participants: string[] = [];
    if (leaveCallState) {
      try {
        const state = JSON.parse(leaveCallState);
        participants = (state.participants || []).filter((id: string) => id !== currentUser.id);
      } catch (e) {
        console.warn('Failed to parse call state:', e);
      }
    }
    
    // End call for everyone only if no participants remain
    if (participants.length === 0) {
      setCallInProgress(false);
      setCallInitiator(null);
      localStorage.removeItem(`call-${workflowId}`);
      
      await fetch(`/api/collaboration/${workflowId}/broadcast`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          type: 'call-ended',
          userId: currentUser.id
        })
      });
    } else {
      await fetch(`/api/collaboration/${workflowId}/broadcast`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          type: 'user-left-call',
          userId: currentUser.id
        })
      });
    }
  }, [workflowId, currentUser.id, localStream]);

  const toggleMute = () => {
    const newMutedState = !isMuted;
    setIsMuted(newMutedState);
    if (webrtcService.current) {
      webrtcService.current.toggleAudio(!newMutedState);
    }
  };

  const toggleVideo = () => {
    const newVideoState = !isVideoEnabled;
    setIsVideoEnabled(newVideoState);
    if (webrtcService.current) {
      webrtcService.current.toggleVideo(newVideoState);
    }
  };

  if (isLoading) {
    return (
      <aside className="w-[340px] min-w-[340px] max-w-[340px] border-l-2 border-separate h-full flex items-center justify-center">
        <div className="text-sm text-muted-foreground">Loading...</div>
      </aside>
    );
  }

  const otherUsers = users.filter(u => u.id !== currentUser.id);

  const handleTeamMessage = (message: string) => {
    sendMessage(message, false);
  };

  const handlePrivateMessage = (message: string) => {
    sendMessage(message, true);
  };

  return (
    <aside className="w-[340px] min-w-[340px] max-w-[340px] border-l-2 border-separate h-full overflow-hidden flex flex-col">
      <CollaborationHeader
        userCount={users.length}
        isInCall={isInCall}
        callInProgress={callInProgress}
        callInitiator={callInitiator}
        currentUserId={currentUser.id}
        isMuted={isMuted}
        isVideoEnabled={isVideoEnabled}
        onStartCall={startCall}
        onJoinCall={joinCall}
        onLeaveCall={leaveCall}
        onToggleMute={toggleMute}
        onToggleVideo={toggleVideo}
      />

      <VideoCallArea
        isInCall={isInCall}
        callInProgress={callInProgress}
        isVideoEnabled={isVideoEnabled}
        localStream={localStream}
        remoteStreams={remoteStreams}
        users={users}
      />

      {!isInCall && !callInProgress && <ActiveUsers users={users} />}

      <div className="flex flex-col flex-1 min-h-0">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col h-full">
          <TabsList className="grid w-full grid-cols-2 mx-2 mt-1 shrink-0">
            <TabsTrigger value="team" className="text-xs">
              <MessageSquare className="w-3 h-3 mr-1" />
              Team
            </TabsTrigger>
            <TabsTrigger value="private" className="text-xs">
              <Lock className="w-3 h-3 mr-1" />
              Private
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="team" className="flex-1 min-h-0 mt-1">
            <TeamChat
              messages={messages}
              users={users}
              onSendMessage={handleTeamMessage}
              messagesEndRef={messagesEndRef}
            />
          </TabsContent>
          
          <TabsContent value="private" className="flex-1 min-h-0 mt-1">
            <PrivateChat
              selectedUser={selectedUser}
              privateMessages={privateMessages}
              users={users}
              otherUsers={otherUsers}
              onSelectUser={selectUserForPrivateChat}
              onSendMessage={handlePrivateMessage}
              onBackToUserList={() => setSelectedUser(null)}
              messagesEndRef={messagesEndRef}
            />
          </TabsContent>
        </Tabs>
      </div>
    </aside>
  );
}