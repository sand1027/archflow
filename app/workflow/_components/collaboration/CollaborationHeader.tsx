"use client";

import { Badge } from "@/components/ui/badge";
import { Users } from "lucide-react";
import { CallControls } from "./CallControls";

interface CollaborationHeaderProps {
  userCount: number;
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

export function CollaborationHeader({
  userCount,
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
}: CollaborationHeaderProps) {
  return (
    <div className="p-2 border-b">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-medium flex items-center gap-1 text-sm">
          <Users className="w-3 h-3" />
          Collaboration
        </h3>
        <Badge variant="secondary" className="text-xs px-1 py-0">{userCount} online</Badge>
      </div>
      
      <CallControls
        isInCall={isInCall}
        callInProgress={callInProgress}
        callInitiator={callInitiator}
        currentUserId={currentUserId}
        isMuted={isMuted}
        isVideoEnabled={isVideoEnabled}
        onStartCall={onStartCall}
        onJoinCall={onJoinCall}
        onLeaveCall={onLeaveCall}
        onToggleMute={onToggleMute}
        onToggleVideo={onToggleVideo}
      />
    </div>
  );
}