"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Video, VideoOff, Mic, MicOff, Phone, Send, Users, MessageSquare } from "lucide-react";
import { CollaborationUser, ChatMessage } from "@/lib/types";
import { WebRTCService } from "@/lib/webrtc-service";

interface CollaborationPanelProps {
  workflowId: string;
  currentUser: CollaborationUser;
}

export function CollaborationPanel({ workflowId, currentUser }: CollaborationPanelProps) {
  const [users, setUsers] = useState<CollaborationUser[]>([currentUser]);
  
  useEffect(() => {
    // Load chat history and active users
    const loadData = async () => {
      try {
        const [messagesResponse, usersResponse] = await Promise.all([
          fetch(`/api/collaboration/${workflowId}/messages`),
          fetch(`/api/collaboration/${workflowId}/active-users`)
        ]);
        
        if (messagesResponse.ok) {
          const history = await messagesResponse.json();
          setMessages(history);
        }
        
        if (usersResponse.ok) {
          const activeUsers = await usersResponse.json();
          setUsers(prev => {
            const hasCurrentUser = prev.find(u => u.id === currentUser.id);
            if (!hasCurrentUser) {
              return [currentUser, ...activeUsers.filter((u: any) => u.id !== currentUser.id)];
            }
            return [...prev, ...activeUsers.filter((u: any) => !prev.find(p => p.id === u.id))];
          });
        }
      } catch (error) {
        console.error('Failed to load data:', error);
      }
    };
    
    loadData();
    
    // Connect to SSE stream for real-time updates
    const eventSource = new EventSource(`/api/collaboration/${workflowId}/stream`);
    

    
    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        
        if (data.type === 'user-joined') {
          console.log('👤 User joined:', data.user.name, 'ID:', data.user.id);
          setUsers(prev => {
            const exists = prev.find(u => u.id === data.user.id);
            if (exists) return prev;
            return [...prev, data.user];
          });
        } else if (data.type === 'user-left') {
          console.log('👤 User left:', data.userId);
          setUsers(prev => prev.filter(u => u.id !== data.userId));
        } else if (data.type === 'users-list') {
          console.log('👥 Users list received:', data.users.length, 'users');
          setUsers(prev => {
            const hasCurrentUser = prev.find(u => u.id === currentUser.id);
            if (!hasCurrentUser) {
              return [currentUser, ...data.users.filter((u: any) => u.id !== currentUser.id)];
            }
            return prev;
          });
        } else if (data.type === 'new-message') {
          setMessages(prev => [...prev, data.message]);
        } else if (data.type === 'webrtc-signal') {
          // Handle WebRTC signaling for video calls
          console.log('Received WebRTC signal:', data.signal);
          console.log('Current WebRTC service exists:', !!webrtcService.current);
          console.log('Is video call active:', isVideoCallActive);
          
          // Auto-join call if someone else starts it (only once)
          if (data.signal.type === 'join-call' && data.signal.userId !== currentUser.id && !isVideoCallActive && !isJoiningCall.current && currentUser.id !== 'anonymous') {
            console.log('Auto-joining call started by:', data.signal.userId, 'Current user:', currentUser.id);
            console.log('Current users list:', users.map(u => ({ id: u.id, name: u.name })));
            isJoiningCall.current = true;
            startVideoCall().then(() => {
              // Handle the join-call signal after WebRTC service is initialized
              if (webrtcService.current) {
                webrtcService.current.handleSignalingMessage(data.signal);
              }
            }).finally(() => {
              isJoiningCall.current = false;
            });
          } else if (webrtcService.current) {
            console.log('🔄 Handling WebRTC signal:', data.signal.type, 'from:', data.signal.fromUserId);
            webrtcService.current.handleSignalingMessage(data.signal);
          } else {
            console.warn('❌ WebRTC service not initialized, ignoring signal:', data.signal.type);
          }
        }
      } catch (error) {
        console.error('Error parsing SSE data:', error);
      }
    };
    
    return () => {
      eventSource.close();
      if (webrtcService.current) {
        webrtcService.current.endCall();
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workflowId, currentUser.id]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isVideoCallActive, setIsVideoCallActive] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStreams, setRemoteStreams] = useState<Map<string, MediaStream>>(new Map());
  const webrtcService = useRef<WebRTCService | null>(null);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideosRef = useRef<Map<string, HTMLVideoElement>>(new Map());
  const isJoiningCall = useRef(false);

  const sendMessage = async () => {
    if (!newMessage.trim()) return;
    
    const message: ChatMessage = {
      id: Date.now().toString(),
      userId: currentUser.id,
      message: newMessage,
      timestamp: new Date(),
      type: 'text'
    };
    
    // Save to database and broadcast
    try {
      await fetch(`/api/collaboration/${workflowId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message })
      });
      
      // Broadcast to other users via SSE (don't add locally, SSE will handle it)
      await fetch(`/api/collaboration/${workflowId}/broadcast`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message })
      });
      setNewMessage("");
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const startVideoCall = useCallback(async (): Promise<void> => {
    if (isVideoCallActive || isJoiningCall.current) {
      console.log('Call already active or joining, ignoring');
      return;
    }
    
    if (currentUser.id === 'anonymous') {
      console.warn('Anonymous users cannot start video calls');
      return;
    }
    
    try {
      console.log('Initializing WebRTC service for user:', currentUser.id);
      webrtcService.current = new WebRTCService(workflowId, currentUser.id);
      
      webrtcService.current.onRemoteStream = (userId: string, stream: MediaStream) => {
        console.log('🎥 RECEIVED REMOTE STREAM from:', userId, 'Stream tracks:', stream.getTracks().length);
        console.log('Stream video tracks:', stream.getVideoTracks().length, 'audio tracks:', stream.getAudioTracks().length);
        console.log('Stream active:', stream.active, 'Stream ID:', stream.id);
        setRemoteStreams(prev => {
          const newMap = new Map(prev.set(userId, stream));
          console.log('✅ Updated remote streams map size:', newMap.size);
          console.log('All remote stream users:', Array.from(newMap.keys()));
          return newMap;
        });
        
        // Force video element update after React renders
        setTimeout(() => {
          const videoElement = remoteVideosRef.current.get(userId);
          if (videoElement && stream) {
            console.log('📺 Setting remote video stream for user:', userId);
            videoElement.srcObject = stream;
            // Don't call play here - let the video element handle it with autoPlay
          } else {
            console.warn('❌ Remote video element not found for user:', userId);
          }
        }, 200);
      };
      
      webrtcService.current.onUserLeft = (userId: string) => {
        setRemoteStreams(prev => {
          const newMap = new Map(prev);
          newMap.delete(userId);
          return newMap;
        });
      };
      
      const stream = await webrtcService.current.startCall(isVideoEnabled, !isMuted);
      setLocalStream(stream);
      setIsVideoCallActive(true);
      
      // Set video stream after state update
      setTimeout(() => {
        if (localVideoRef.current && stream) {
          console.log('Setting local video stream, tracks:', stream.getTracks().length);
          localVideoRef.current.srcObject = stream;
          localVideoRef.current.play().catch(e => console.error('Failed to play local video:', e));
        } else {
          console.warn('Local video ref or stream not available');
        }
      }, 100);
    } catch (error) {
      console.error('Failed to start video call:', error);
    }
  }, [workflowId, currentUser.id, isVideoEnabled, isMuted, isVideoCallActive]);

  const endVideoCall = () => {
    if (webrtcService.current) {
      webrtcService.current.endCall();
      webrtcService.current = null;
    }
    setLocalStream(null);
    setRemoteStreams(new Map());
    setIsVideoCallActive(false);
    isJoiningCall.current = false;
  };

  const toggleMute = () => {
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    if (webrtcService.current) {
      webrtcService.current.toggleAudio(!newMuted);
    }
  };

  const toggleVideo = () => {
    const newVideoEnabled = !isVideoEnabled;
    setIsVideoEnabled(newVideoEnabled);
    if (webrtcService.current) {
      webrtcService.current.toggleVideo(newVideoEnabled);
    }
  };

  return (
    <aside className="w-[340px] min-w-[340px] max-w-[340px] border-l-2 border-separate h-full overflow-hidden flex flex-col">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold flex items-center gap-2">
            <Users className="w-4 h-4" />
            Collaboration
          </h3>
          <Badge variant="secondary">{users.length} online</Badge>
        </div>
        
        {/* Video Call Controls */}
        <div className="flex gap-2">
          {!isVideoCallActive ? (
            <Button size="sm" onClick={startVideoCall} className="flex-1">
              <Video className="w-4 h-4 mr-2" />
              Start Call
            </Button>
          ) : (
            <div className="flex gap-1 flex-1">
              <Button size="sm" variant="outline" onClick={toggleMute}>
                {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </Button>
              <Button size="sm" variant="outline" onClick={toggleVideo}>
                {isVideoEnabled ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
              </Button>
              <Button size="sm" variant="destructive" onClick={endVideoCall}>
                <Phone className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Online Users */}
      <div className="p-2 border-b">
        <h4 className="text-sm font-medium mb-1">Online Users</h4>
        <div className="space-y-1">
          {users.map((user) => (
            <div key={user.id} className="flex items-center gap-2">
              <Avatar className="w-5 h-5">
                <AvatarImage src={user.avatar} />
                <AvatarFallback className="text-xs">
                  {user.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="text-xs flex-1">{user.name}</span>
              <div className={`w-2 h-2 rounded-full ${user.isOnline ? 'bg-green-500' : 'bg-gray-300'}`} />
            </div>
          ))}
        </div>
      </div>

      {/* Video Call Area */}
      {isVideoCallActive && (
        <div className="p-2 border-b bg-gray-900 text-white">
          {/* Local Video */}
          <div className="relative mb-2">
            <video
              ref={localVideoRef}
              autoPlay
              muted
              playsInline
              className="w-full h-24 bg-gray-800 rounded object-cover"
              onLoadedMetadata={() => {
                console.log('Local video metadata loaded');
                if (localVideoRef.current) {
                  localVideoRef.current.play().catch(e => console.error('Local video play error:', e));
                }
              }}
              onCanPlay={() => {
                console.log('Local video can play');
              }}
              onError={(e) => {
                console.error('Local video error:', e);
              }}
            />
            <div className="absolute bottom-1 left-1 text-xs bg-black/50 px-1 rounded">
              You {!isVideoEnabled && '(Video Off)'}
            </div>
          </div>
          
          {/* Remote Videos */}
          {(() => {
            console.log('🎬 Rendering remote videos section, count:', remoteStreams.size, 'users:', Array.from(remoteStreams.keys()));
            return null;
          })()}
          {remoteStreams.size === 0 && (
            <div className="text-xs text-center text-gray-400 mb-2">
              Waiting for other participants... ({users.length} users online)
            </div>
          )}
          {Array.from(remoteStreams.entries()).map(([userId, stream]) => {
            const user = users.find(u => u.id === userId);
            console.log('🎥 Rendering remote video for user:', userId, 'stream active:', stream.active, 'tracks:', stream.getTracks().length);
            return (
              <div key={userId} className="relative mb-2">
                <video
                  ref={(el) => {
                    if (el) {
                      console.log('Setting up remote video element for user:', userId);
                      remoteVideosRef.current.set(userId, el);
                      if (stream && el.srcObject !== stream) {
                        console.log('Setting srcObject for remote video:', userId);
                        el.srcObject = stream;
                      }
                    }
                  }}
                  autoPlay
                  playsInline
                  muted={false}
                  className="w-full h-24 bg-gray-800 rounded object-cover"
                  onCanPlay={(e) => {
                    console.log('Remote video can play for user:', userId);
                    const video = e.target as HTMLVideoElement;
                    video.play().catch(e => console.error('Failed to play on canPlay:', e));
                  }}
                  onLoadedData={(e) => {
                    console.log('Remote video data loaded for user:', userId);
                  }}
                  onError={(e) => {
                    console.error('Remote video error for user:', userId, e);
                  }}
                />
                <div className="absolute bottom-1 left-1 text-xs bg-black/50 px-1 rounded">
                  {user?.name || 'Unknown User'}
                </div>
              </div>
            );
          })}
          
          <div className="text-xs text-center">
            {users.filter(u => u.isOnline).length} participant{users.filter(u => u.isOnline).length !== 1 ? 's' : ''} online
          </div>
        </div>
      )}

      <div className="flex flex-col flex-1 overflow-hidden">
        <div className="p-2 border-b">
          <h4 className="text-xs font-medium flex items-center gap-2">
            <MessageSquare className="w-3 h-3" />
            Chat
          </h4>
        </div>
        
        <ScrollArea className="flex-1 p-2 max-h-[400px]">
          <div className="space-y-3 pr-2">
            {messages.map((message, index) => {
              const user = users.find(u => u.id === message.userId) || 
                          (message.userId === 'system' ? { name: 'System', avatar: '' } : null);
              return (
                <div key={message.id || `message-${index}`} className="flex gap-2">
                  <Avatar className="w-6 h-6">
                    <AvatarImage src={user?.avatar} />
                    <AvatarFallback className="text-xs">
                      {user?.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-medium">{user?.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {message.timestamp ? new Date(message.timestamp).toLocaleTimeString() : 'Now'}
                      </span>
                    </div>
                    <p className="text-sm">{message.message}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
        
        <div className="p-2 border-t bg-background">
          <div className="flex gap-2">
            <Input
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              className="flex-1 bg-background"
            />
            <Button size="sm" onClick={sendMessage} disabled={!newMessage.trim()}>
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </aside>
  );
}