"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { ReactFlowProvider } from "@xyflow/react";
import { FlowValidationContextProvider } from "@/components/context/FlowValidationContext";
import FlowEditor from "../../_components/FlowEditor";
import TaskMenu from "../../_components/TaskMenu";
import { CollaborationPanel } from "../../_components/CollaborationPanel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Shield, Users, Clock, LogIn, UserPlus } from "lucide-react";
import { CollaborationUser } from "@/lib/types";
import SharedSaveButton from "../../_components/topbar/SharedSaveButton";

export default function SharedWorkflowPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session, status } = useSession();
  const [shareData, setShareData] = useState<any>(null);
  const [workflow, setWorkflow] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  const currentUser: CollaborationUser = {
    id: session?.user?.id || "anonymous",
    name: session?.user?.name || "Anonymous User",
    email: session?.user?.email || "",
    isOnline: true,
    lastSeen: new Date(),
  };

  useEffect(() => {
    const validateShare = async () => {
      try {
        const response = await fetch(`/api/workflows/share?token=${params.token}`);
        const data = await response.json();
        
        if (!response.ok) {
          setError(data.error || "Invalid share link");
          return;
        }
        
        setShareData(data);
        
        // Only fetch workflow data if user is authenticated
        if (session) {
          const workflowResponse = await fetch(`/api/workflows/${data.workflowId}`);
          const workflowData = await workflowResponse.json();
          
          if (workflowResponse.ok) {
            console.log('Loaded workflow:', workflowData);
            setWorkflow(workflowData);
          } else {
            console.error('Failed to load workflow:', workflowData);
          }
        }
      } catch (err) {
        setError("Failed to load shared workflow");
      } finally {
        setLoading(false);
      }
    };

    if (params.token && status !== "loading") {
      validateShare();
    }
  }, [params.token, session, status]);

  if (loading || status === "loading") {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading shared workflow...</p>
        </div>
      </div>
    );
  }

  // Show authentication required screen if user is not logged in
  if (!session && shareData) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted">
        <div className="max-w-md w-full mx-4">
          <div className="bg-card border rounded-lg p-8 shadow-lg text-center">
            <div className="mb-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-primary" />
              </div>
              <h1 className="text-2xl font-bold mb-2">Authentication Required</h1>
              <p className="text-muted-foreground mb-6">
                This shared workflow requires you to sign in to access it. 
                Please log in or create an account to continue.
              </p>
            </div>
            
            <div className="space-y-3">
              <Button 
                onClick={() => router.push(`/auth/signin?callbackUrl=${encodeURIComponent(window.location.href)}`)}
                className="w-full"
                size="lg"
              >
                <LogIn className="w-4 h-4 mr-2" />
                Sign In
              </Button>
              
              <Button 
                onClick={() => router.push(`/sign-up?callbackUrl=${encodeURIComponent(window.location.href)}`)}
                variant="outline"
                className="w-full"
                size="lg"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Create Account
              </Button>
            </div>
            
            <div className="mt-6 pt-6 border-t">
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <Badge variant="secondary">
                  <Shield className="w-3 h-3 mr-1" />
                  {shareData.permissions === "view" ? "View Only" : 
                   shareData.permissions === "edit" ? "Can Edit" : "Admin"}
                </Badge>
                {shareData.expiresAt && (
                  <Badge variant="outline">
                    <Clock className="w-3 h-3 mr-1" />
                    Expires {new Date(shareData.expiresAt).toLocaleDateString()}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
          <p className="text-muted-foreground mb-4">{error}</p>
          <button 
            onClick={() => router.push("/")}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full w-full overflow-hidden">
      <div className="border-b p-4 bg-background">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-lg font-semibold">Shared Workflow</h1>
            <div className="flex gap-2">
              <Badge variant="secondary">
                <Users className="w-3 h-3 mr-1" />
                Collaborative
              </Badge>
              <Badge variant="outline">
                <Shield className="w-3 h-3 mr-1" />
                {shareData.permissions === "view" ? "View Only" : 
                 shareData.permissions === "edit" ? "Can Edit" : "Admin"}
              </Badge>
              {shareData.expiresAt && (
                <Badge variant="destructive">
                  <Clock className="w-3 h-3 mr-1" />
                  Expires {new Date(shareData.expiresAt).toLocaleDateString()}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>

      <FlowValidationContextProvider>
        <ReactFlowProvider>
          <div className="flex flex-col h-full overflow-hidden">
            {shareData.permissions !== "view" && (
              <div className="border-b p-2 bg-background flex justify-end">
                <SharedSaveButton workflowId={shareData.workflowId} />
              </div>
            )}
            <section className="flex h-full overflow-auto">
              <TaskMenu />
              <div className="flex-1">
                <FlowEditor 
                  workflow={workflow}
                  workflowId={shareData.workflowId}
                  isReadOnly={shareData.permissions === "view"}
                  isCollaborative={true}
                />
              </div>
              {session && (
                <CollaborationPanel 
                  workflowId={shareData.workflowId}
                  currentUser={currentUser}
                />
              )}
            </section>
          </div>
        </ReactFlowProvider>
      </FlowValidationContextProvider>
    </div>
  );
}