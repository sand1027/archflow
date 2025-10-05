"use client";

import { CollaborationUser } from "@/lib/types";

interface VideoCallAreaProps {
  isInCall: boolean;
  callInProgress: boolean;
  isVideoEnabled: boolean;
  localStream: MediaStream | null;
  remoteStreams: Map<string, MediaStream>;
  users: CollaborationUser[];
}

export function VideoCallArea({
  isInCall,
  callInProgress,
  isVideoEnabled,
  localStream,
  remoteStreams,
  users
}: VideoCallAreaProps) {
  if (!isInCall && !callInProgress) return null;

  const hasVideoTracks = (stream: MediaStream) => {
    return stream.getVideoTracks().length > 0 && stream.getVideoTracks().some(track => track.enabled);
  };

  const hasAudioTracks = (stream: MediaStream) => {
    return stream.getAudioTracks().length > 0 && stream.getAudioTracks().some(track => track.enabled);
  };

  const allStreams = [];
  if (localStream) {
    allStreams.push({ userId: 'local', stream: localStream, isLocal: true });
  }
  remoteStreams.forEach((stream, userId) => {
    allStreams.push({ userId, stream, isLocal: false });
  });

  return (
    <div className="p-2 border-b bg-gray-900 text-white">
      {remoteStreams.size === 0 && callInProgress && !localStream && (
        <div className="text-xs text-yellow-400 mb-2 p-2 text-center">
          {isInCall ? 'Connecting...' : 'Call in progress - Join to participate'}
        </div>
      )}
      
      <div className="grid grid-cols-2 gap-2">
        {allStreams.map(({ userId, stream, isLocal }) => {
          const user = isLocal ? { name: 'You' } : users.find(u => u.id === userId);
          return (
            <div key={`${userId}-${stream.id}`} className="relative aspect-square">
              {hasVideoTracks(stream) ? (
                <video
                  ref={(el) => {
                    if (el && stream) {
                      if (el.srcObject !== stream) {
                        el.srcObject = stream;
                        console.log('📺 Setting video source for:', isLocal ? 'local' : userId);
                      }
                      el.onloadedmetadata = () => {
                        console.log('🎥 Video metadata loaded for:', isLocal ? 'local' : userId);
                        el.play().catch(e => console.error('Video play error:', e));
                      };
                      el.oncanplay = () => {
                        console.log('▶️ Video can play for:', isLocal ? 'local' : userId);
                      };
                    }
                  }}
                  autoPlay
                  muted={isLocal}
                  playsInline
                  className="w-full h-full bg-gray-800 rounded object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-800 rounded flex items-center justify-center">
                  <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium">
                      {isLocal ? 'You' : user?.name?.charAt(0)?.toUpperCase() || '?'}
                    </span>
                  </div>
                </div>
              )}
              {!isLocal && hasAudioTracks(stream) && (
                <audio
                  ref={(el) => {
                    if (el && stream) {
                      if (el.srcObject !== stream) {
                        el.srcObject = stream;
                        console.log('🔊 Setting audio source for:', userId);
                      }
                      el.onloadedmetadata = () => {
                        console.log('🎧 Audio metadata loaded for:', userId);
                        el.play().catch(e => console.error('Audio play error:', e));
                      };
                    }
                  }}
                  autoPlay
                  playsInline
                />
              )}
              <div className="absolute bottom-1 left-1 text-xs bg-black/50 px-1 rounded flex items-center gap-1">
                {user?.name || 'Unknown'}
                {hasAudioTracks(stream) && (
                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full" />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}