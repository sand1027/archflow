"use client";

import { addCreditsToUser } from "@/actions/addCredits";
import { checkAndAddCredits } from "@/actions/debugCredits";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";

export default function AddCreditsPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleAddCredits = async () => {
    setLoading(true);
    try {
      const result = await checkAndAddCredits();
      setMessage(`${result.message} (User: ${result.userId})`);
    } catch (error) {
      setMessage(`Error: ${error}`);
    }
    setLoading(false);
  };

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Add Credits</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            onClick={handleAddCredits} 
            disabled={loading}
            className="w-full"
          >
            {loading ? "Adding..." : "Add 50,000 Credits & Debug"}
          </Button>
          {message && (
            <p className="text-center text-green-600">{message}</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}