"use client";

export class WebRTCService {
  private localStream: MediaStream | null = null;
  private remoteStreams: Map<string, MediaStream> = new Map();
  private peerConnections: Map<string, RTCPeerConnection> = new Map();
  private ws: WebSocket | null = null;
  private workflowId: string;
  private userId: string;

  constructor(workflowId: string, userId: string) {
    this.workflowId = workflowId;
    this.userId = userId;
  }

  async initializeWebSocket() {
    // WebRTC signaling will be handled via SSE stream
    // No additional initialization needed
  }

  async startCall(videoEnabled: boolean = true, audioEnabled: boolean = true) {
    try {
      this.localStream = await navigator.mediaDevices.getUserMedia({
        video: videoEnabled,
        audio: audioEnabled
      });
      
      await this.initializeWebSocket();
      await this.sendSignalingMessage({ type: 'join-call', userId: this.userId });
      
      return this.localStream;
    } catch (error) {
      console.error('Error starting call:', error);
      throw error;
    }
  }

  async createPeerConnection(remoteUserId: string): Promise<RTCPeerConnection> {
    const pc = new RTCPeerConnection({
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' },
        { urls: 'stun:stun2.l.google.com:19302' }
      ]
    });

    if (this.localStream) {
      this.localStream.getTracks().forEach(track => {
        pc.addTrack(track, this.localStream!);
      });
    }

    pc.ontrack = (event) => {
      console.log('Received track from:', remoteUserId, 'streams:', event.streams.length, 'tracks:', event.streams[0]?.getTracks().length);
      if (event.streams && event.streams[0]) {
        const stream = event.streams[0];
        console.log('Stream details - video tracks:', stream.getVideoTracks().length, 'audio tracks:', stream.getAudioTracks().length);
        this.remoteStreams.set(remoteUserId, stream);
        this.onRemoteStream?.(remoteUserId, stream);
      } else {
        console.warn('No streams in track event from:', remoteUserId);
      }
    };

    pc.onicecandidate = async (event) => {
      if (event.candidate) {
        await this.sendSignalingMessage({
          type: 'ice-candidate',
          candidate: event.candidate,
          targetUserId: remoteUserId
        });
      }
    };

    this.peerConnections.set(remoteUserId, pc);
    return pc;
  }

  public async handleSignalingMessage(data: any) {
    console.log('Handling WebRTC signal:', data.type, 'from:', data.fromUserId || data.userId, 'to:', data.targetUserId);
    try {
      switch (data.type) {
        case 'join-call':
          if (data.userId !== this.userId) {
            console.log('Creating offer for new user:', data.userId);
            await this.createOffer(data.userId);
          }
          break;
        
        case 'offer':
          console.log('Received offer from:', data.fromUserId, 'target:', data.targetUserId);
          await this.handleOffer(data);
          break;
        
        case 'answer':
          if (data.targetUserId === this.userId) {
            console.log('Received answer from:', data.fromUserId);
            await this.handleAnswer(data);
          }
          break;
        
        case 'ice-candidate':
          console.log('Received ICE candidate from:', data.fromUserId, 'target:', data.targetUserId);
          await this.handleIceCandidate(data);
          break;
        
        case 'leave-call':
          if (data.userId !== this.userId) {
            console.log('User left call:', data.userId);
            this.handleUserLeft(data.userId);
          }
          break;
      }
    } catch (error) {
      console.error('Error handling WebRTC signaling:', error);
    }
  }

  private async createOffer(remoteUserId: string) {
    const pc = await this.createPeerConnection(remoteUserId);
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    
    await this.sendSignalingMessage({
      type: 'offer',
      offer,
      targetUserId: remoteUserId
    });
  }

  private async handleOffer(data: any) {
    if (data.targetUserId && data.targetUserId !== this.userId) {
      console.log('Offer not for us, ignoring');
      return; // This offer is not for us
    }
    
    console.log('Processing offer from:', data.fromUserId);
    const pc = await this.createPeerConnection(data.fromUserId);
    
    console.log('Setting remote description (offer)');
    await pc.setRemoteDescription(new RTCSessionDescription(data.offer));
    
    console.log('Creating answer');
    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);
    
    console.log('Sending answer to:', data.fromUserId);
    await this.sendSignalingMessage({
      type: 'answer',
      answer,
      targetUserId: data.fromUserId
    });
  }

  private async handleAnswer(data: any) {
    console.log('Processing answer from:', data.fromUserId);
    const pc = this.peerConnections.get(data.fromUserId);
    if (pc) {
      console.log('Peer connection state:', pc.signalingState);
      if (pc.signalingState === 'have-local-offer') {
        console.log('Setting remote description (answer)');
        await pc.setRemoteDescription(new RTCSessionDescription(data.answer));
      } else {
        console.warn('Unexpected signaling state for answer:', pc.signalingState);
      }
    } else {
      console.warn('No peer connection found for user:', data.fromUserId);
    }
  }

  private async handleIceCandidate(data: any) {
    if (data.targetUserId && data.targetUserId !== this.userId) {
      console.log('ICE candidate not for us, ignoring');
      return; // This candidate is not for us
    }
    
    console.log('Processing ICE candidate from:', data.fromUserId);
    const pc = this.peerConnections.get(data.fromUserId);
    if (pc) {
      console.log('Peer connection state:', pc.signalingState, 'has remote description:', !!pc.remoteDescription);
      if (pc.remoteDescription) {
        console.log('Adding ICE candidate');
        await pc.addIceCandidate(new RTCIceCandidate(data.candidate));
      } else {
        console.warn('No remote description set, cannot add ICE candidate');
      }
    } else {
      console.warn('No peer connection found for ICE candidate from:', data.fromUserId);
    }
  }

  private handleUserLeft(userId: string) {
    const pc = this.peerConnections.get(userId);
    if (pc) {
      pc.close();
      this.peerConnections.delete(userId);
    }
    this.remoteStreams.delete(userId);
    this.onUserLeft?.(userId);
  }

  toggleVideo(enabled: boolean) {
    if (this.localStream) {
      this.localStream.getVideoTracks().forEach(track => {
        track.enabled = enabled;
      });
    }
  }

  toggleAudio(enabled: boolean) {
    if (this.localStream) {
      this.localStream.getAudioTracks().forEach(track => {
        track.enabled = enabled;
      });
    }
  }

  endCall() {
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => track.stop());
      this.localStream = null;
    }
    
    this.peerConnections.forEach(pc => pc.close());
    this.peerConnections.clear();
    this.remoteStreams.clear();
    
    this.sendSignalingMessage({ type: 'leave-call', userId: this.userId });
  }

  private async sendSignalingMessage(message: any) {
    try {
      await fetch(`/api/collaboration/${this.workflowId}/webrtc-signal`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...message,
          fromUserId: this.userId,
          timestamp: Date.now()
        })
      });
    } catch (error) {
      console.error('Failed to send WebRTC signal:', error);
    }
  }

  // Event handlers
  onRemoteStream?: (userId: string, stream: MediaStream) => void;
  onUserLeft?: (userId: string) => void;
}