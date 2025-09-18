"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cleanupOldWorkflows } from "@/actions/cleanupWorkflows";
import { useState } from "react";

export default function CleanupPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleCleanup = async () => {
    setLoading(true);
    try {
      await cleanupOldWorkflows();
      setMessage("Successfully cleaned up old workflows!");
    } catch (error) {
      setMessage("Error cleaning up workflows: " + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Cleanup Old Workflows</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            This will remove workflows that contain old task types that are no longer supported.
          </p>
          <Button onClick={handleCleanup} disabled={loading}>
            {loading ? "Cleaning up..." : "Clean Up Old Workflows"}
          </Button>
          {message && (
            <p className={message.includes("Error") ? "text-red-500" : "text-green-500"}>
              {message}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}