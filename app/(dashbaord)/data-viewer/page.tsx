"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DataViewer() {
  const [credentialId, setCredentialId] = useState("");
  const [collection, setCollection] = useState("");
  const [query, setQuery] = useState("{}");
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [count, setCount] = useState(0);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/data/view", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          credentialId,
          collection,
          query: JSON.parse(query),
          limit: 100
        })
      });
      
      const result = await response.json();
      if (response.ok) {
        setData(result.data);
        setCount(result.count);
      } else {
        alert(result.error);
      }
    } catch (error) {
      alert("Error fetching data");
    }
    setLoading(false);
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Data Viewer</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Query Data</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>MongoDB Credential ID</Label>
            <Input 
              value={credentialId}
              onChange={(e) => setCredentialId(e.target.value)}
              placeholder="Enter credential ID"
            />
          </div>
          
          <div>
            <Label>Collection</Label>
            <Input 
              value={collection}
              onChange={(e) => setCollection(e.target.value)}
              placeholder="e.g., employees, products"
            />
          </div>
          
          <div>
            <Label>Query (JSON)</Label>
            <Textarea 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder='{"department": "Engineering"}'
              rows={3}
            />
          </div>
          
          <Button onClick={fetchData} disabled={loading}>
            {loading ? "Loading..." : "Fetch Data"}
          </Button>
        </CardContent>
      </Card>

      {data.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Results ({count} total)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <pre className="bg-gray-100 p-4 rounded text-sm">
                {JSON.stringify(data, null, 2)}
              </pre>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}