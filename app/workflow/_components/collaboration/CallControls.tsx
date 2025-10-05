"use client";

import { Button } from "@/components/ui/button";
import { Video, VideoOff, Mic, MicOff, Phone, PhoneOff } from "lucide-react";

interface CallControlsProps {
  isInCall: boolean;
  callInProgress: boolean;
  callInitiator: string | null;
  currentUserId: string;
  isMuted: boolean;
  isVideoEnabled: boolean;
  onStartCall: (withVideo: boolean) => void;
  onJoinCall: (withVideo: boolean) => void;
  onLeaveCall: () => void;
  onToggleMute: () => void;
  onToggleVideo: () => void;
}

export function CallControls({
  isInCall,
  callInProgress,
  callInitiator,
  currentUserId,
  isMuted,
  isVideoEnabled,
  onStartCall,
  onJoinCall,
  onLeaveCall,
  onToggleMute,
  onToggleVideo
}: CallControlsProps) {
  return (
    <div className="flex gap-1">
      {!isInCall ? (
        callInProgress && callInitiator !== currentUserId ? (
          <>
            <Button size="sm" onClick={() => onJoinCall(true)} className="flex-1 h-7 text-xs" variant="default">
              <Video className="w-3 h-3 mr-1" />
              Join
            </Button>
            <Button size="sm" onClick={() => onJoinCall(false)} variant="outline" className="flex-1 h-7 text-xs">
              <Phone className="w-3 h-3 mr-1" />
              Audio
            </Button>
          </>
        ) : !callInProgress ? (
          <>
            <Button size="sm" onClick={() => onStartCall(true)} className="flex-1 h-7 text-xs">
              <Video className="w-3 h-3 mr-1" />
              Video
            </Button>
            <Button size="sm" onClick={() => onStartCall(false)} variant="outline" className="flex-1 h-7 text-xs">
              <Phone className="w-3 h-3 mr-1" />
              Voice
            </Button>
          </>
        ) : null
      ) : (
        <div className="flex gap-1 flex-1">
          <Button size="sm" variant="outline" onClick={onToggleMute} className="h-7">
            {isMuted ? <MicOff className="w-3 h-3 text-red-500" /> : <Mic className="w-3 h-3 text-green-500" />}
          </Button>
          <Button size="sm" variant="outline" onClick={onToggleVideo} className="h-7">
            {isVideoEnabled ? <Video className="w-3 h-3" /> : <VideoOff className="w-3 h-3" />}
          </Button>
          <Button size="sm" variant="destructive" onClick={onLeaveCall} className="h-7">
            <PhoneOff className="w-3 h-3" />
          </Button>
        </div>
      )}
    </div>
  );
}