"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, Loader2, Table as TableIcon, List, Code2, Database } from "lucide-react";

interface DataViewerParamProps {
  credentialId: string;
  collection: string;
}

export default function DataViewerParam({ credentialId, collection }: DataViewerParamProps) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("{}");
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const viewData = async () => {
    console.log('viewData called with:', { credentialId, collection });
    
    if (!credentialId || !collection) {
      setError(`Missing: ${!credentialId ? 'Credentials' : ''} ${!collection ? 'Collection' : ''}`);
      return;
    }
    
    setLoading(true);
    setError(null);
    try {
      let parsedQuery;
      try {
        parsedQuery = JSON.parse(query);
      } catch (jsonError) {
        setError(`Invalid JSON query: ${query}\n\nExample: {"name": "John Doe"}`);
        setLoading(false);
        return;
      }
      
      console.log('Making API request with:', { credentialId, collection, query: parsedQuery });
      
      const response = await fetch("/api/data/view", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          credentialId,
          collection,
          query: parsedQuery,
          limit: 50
        })
      });
      
      const result = await response.json();
      console.log('API response:', result);
      
      if (response.ok) {
        setData(result.data || []);
        if (!result.data || result.data.length === 0) {
          setError('No data found in the collection');
        }
      } else {
        setError(`Database error: ${result.error}`);
      }
    } catch (error) {
      console.error('Network error:', error);
      setError(`Network error: ${error}`);
    }
    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full mt-2 bg-background hover:bg-accent hover:text-accent-foreground border-border"
        >
          <Database className="w-4 h-4 mr-2 text-green-600" />
          View Data
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-6xl w-[95vw] h-[85vh] flex flex-col p-0">
        <DialogHeader className="flex-shrink-0 p-6 pb-4 border-b border-border">
          <DialogTitle className="flex items-center gap-2 text-lg">
            <Database className="w-5 h-5 text-green-600" />
            {collection}
          </DialogTitle>
          
          <div className="flex gap-3 mt-4">
            <div className="flex-1">
              <Label htmlFor="query" className="text-sm font-medium mb-2 block">Filter Query</Label>
              <Input 
                id="query"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder='{"department": "Engineering"}'
                className="font-mono text-sm bg-background border-border"
              />
            </div>
            <div className="flex items-end">
              <Button onClick={viewData} disabled={loading} className="flex-shrink-0">
                {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
                {loading ? "Loading..." : "Query"}
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 flex flex-col min-h-0 p-6">
          {error && (
            <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-md">
              <p className="text-sm text-destructive font-medium">Error</p>
              <p className="text-sm text-destructive/80 mt-1 whitespace-pre-wrap">{error}</p>
            </div>
          )}
          
          {!loading && !error && data.length === 0 && (
            <div className="flex items-center justify-center h-32 text-muted-foreground">
              <p>Click &quot;Query&quot; to fetch data from your MongoDB collection</p>
            </div>
          )}
          
          {data.length > 0 && (
            <>
              <div className="flex items-center justify-between mb-4">
                <Badge variant="secondary" className="text-sm">
                  {data.length} records found
                </Badge>
              </div>

              <Tabs defaultValue="cards" className="flex-1 flex flex-col overflow-hidden">
                <TabsList className="grid w-full grid-cols-3 mb-4">
                  <TabsTrigger value="cards" className="flex items-center gap-2">
                    <List className="w-4 h-4" />
                    Cards
                  </TabsTrigger>
                  <TabsTrigger value="table" className="flex items-center gap-2">
                    <TableIcon className="w-4 h-4" />
                    Table
                  </TabsTrigger>
                  <TabsTrigger value="json" className="flex items-center gap-2">
                    <Code2 className="w-4 h-4" />
                    JSON
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="cards" className="flex-1 overflow-hidden">
                  <div className="h-full overflow-y-auto space-y-4">
                    {data.map((item, index) => (
                      <Card key={index} className="shadow-sm border-border">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm text-muted-foreground">
                            Record #{index + 1}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {Object.entries(item).map(([key, value]) => (
                              <div key={key} className="space-y-2">
                                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                                  {key}
                                </div>
                                <div className="font-mono text-sm p-3 bg-muted/50 rounded-md border border-border min-h-[2.5rem] flex items-center">
                                  {typeof value === 'object' ? 
                                    JSON.stringify(value, null, 2) : 
                                    String(value)
                                  }
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="table" className="flex-1 overflow-hidden">
                  <div className="w-full h-full border border-border rounded-lg">
                    <div className="w-full h-full overflow-auto">
                      <table className="w-full border-collapse">
                        <thead className="sticky top-0 bg-muted/50">
                          <tr>
                            {data.length > 0 && Object.keys(data[0]).map((key) => (
                              <th key={key} className="text-left font-semibold px-4 py-3 border-b border-border whitespace-nowrap min-w-[200px]">
                                {key}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {data.map((item, index) => (
                            <tr key={index} className="hover:bg-muted/30 border-b border-border">
                              {Object.entries(item).map(([key, value]) => (
                                <td key={key} className="font-mono text-sm px-4 py-3 whitespace-nowrap">
                                  <div className="max-w-[300px] truncate" title={String(value)}>
                                    {typeof value === 'object' ? 
                                      JSON.stringify(value) : 
                                      String(value)
                                    }
                                  </div>
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="json" className="flex-1 overflow-hidden">
                  <div className="h-full border border-border rounded-lg bg-muted/20 overflow-auto">
                    <pre className="p-4 text-sm font-mono leading-relaxed whitespace-pre text-foreground">
                      {JSON.stringify(data, null, 2)}
                    </pre>
                  </div>
                </TabsContent>
              </Tabs>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}