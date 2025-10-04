"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Share2, Copy, Users, Clock, Shield } from "lucide-react";
import { toast } from "sonner";

interface ShareButtonProps {
  workflowId: string;
}

export function ShareButton({ workflowId }: ShareButtonProps) {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [shareLink, setShareLink] = useState("");
  const [permissions, setPermissions] = useState<"view" | "edit" | "admin">("edit");
  const [expiresIn, setExpiresIn] = useState<string>("never");
  const [isGenerating, setIsGenerating] = useState(false);

  const generateShareLink = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch("/api/workflows/share", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          workflowId,
          permissions,
          expiresIn: expiresIn === "never" ? null : expiresIn,
          userId: session?.user?.id || "anonymous",
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        toast.error(data.error || "Failed to generate share link");
        return;
      }
      if (data.shareToken) {
        const link = `${window.location.origin}/workflow/shared/${data.shareToken}`;
        setShareLink(link);
        toast.success("Share link generated!");
      }
    } catch (error) {
      toast.error("Failed to generate share link");
    }
    setIsGenerating(false);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareLink);
    toast.success("Link copied to clipboard!");
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Share2 className="w-4 h-4 mr-2" />
          Share
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Share Workflow
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Permissions</label>
            <Select value={permissions} onValueChange={(value: any) => setPermissions(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="view">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    View Only
                  </div>
                </SelectItem>
                <SelectItem value="edit">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Can Edit
                  </div>
                </SelectItem>
                <SelectItem value="admin">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    Admin Access
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Expires</label>
            <Select value={expiresIn} onValueChange={setExpiresIn}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1h">1 Hour</SelectItem>
                <SelectItem value="24h">24 Hours</SelectItem>
                <SelectItem value="7d">7 Days</SelectItem>
                <SelectItem value="30d">30 Days</SelectItem>
                <SelectItem value="never">Never</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {!shareLink ? (
            <Button onClick={generateShareLink} disabled={isGenerating} className="w-full">
              {isGenerating ? "Generating..." : "Generate Share Link"}
            </Button>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center gap-2 p-2 bg-muted rounded">
                <Input value={shareLink} readOnly className="flex-1" />
                <Button size="sm" onClick={copyToClipboard}>
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="flex gap-2">
                <Badge variant="secondary">
                  <Clock className="w-3 h-3 mr-1" />
                  {expiresIn === "never" ? "No expiry" : `Expires in ${expiresIn}`}
                </Badge>
                <Badge variant="outline">
                  {permissions === "view" ? "View Only" : permissions === "edit" ? "Can Edit" : "Admin"}
                </Badge>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}