"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { Star, Eye, GitFork, Calendar, FileText, Code, Folder, File } from "lucide-react";
import Image from "next/image";
import { FileTree } from "./_components/FileTree";

interface GitHubData {
  name: string;
  description: string;
  stars: number;
  forks: number;
  watchers: number;
  language: string;
  created_at: string;
  updated_at: string;
  owner: {
    login: string;
    avatar_url: string;
  };
  topics: string[];
  license?: {
    name: string;
  };
  readme?: string;
  languages: Record<string, number>;
  fileStructure?: any[];
  packageJson?: any;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  scripts?: Record<string, string>;
  projectType?: string;
  framework?: string;
  size: number;
  default_branch: string;
  open_issues: number;
  contributors?: any[];
  projectAnalysis?: string;
  architectureAnalysis?: string;
  fullFileStructure?: any;
  keyFiles?: any[];
}

export default function GitHubScraperPage() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<GitHubData | null>(null);
  const [error, setError] = useState("");

  const handleScrape = async () => {
    if (!url.trim()) return;
    
    setLoading(true);
    setError("");
    setData(null);

    try {
      const response = await fetch("/api/github-scraper", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        throw new Error("Failed to scrape repository");
      }

      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code className="h-5 w-5" />
            GitHub Repository Scraper
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="github-url">GitHub Repository URL</Label>
            <div className="flex gap-2 mt-2">
              <Input
                id="github-url"
                placeholder="https://github.com/username/repository"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="flex-1"
              />
              <Button onClick={handleScrape} disabled={loading}>
                {loading ? "Scraping..." : "Scrape"}
              </Button>
            </div>
          </div>

          {error && (
            <div className="text-red-500 text-sm">{error}</div>
          )}
        </CardContent>
      </Card>

      {data && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Image src={data.owner.avatar_url} alt={data.owner.login} width={32} height={32} className="w-8 h-8 rounded-full" />
              <div>
                <div className="flex items-center gap-2">
                  <span>{data.name}</span>
                  {data.language && <Badge variant="secondary">{data.language}</Badge>}
                </div>
                <div className="text-sm text-muted-foreground">by {data.owner.login}</div>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {data.description && (
              <p className="text-muted-foreground">{data.description}</p>
            )}

            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4" />
                <span>{data.stars.toLocaleString()} stars</span>
              </div>
              <div className="flex items-center gap-1">
                <GitFork className="h-4 w-4" />
                <span>{data.forks.toLocaleString()} forks</span>
              </div>
              <div className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                <span>{data.watchers.toLocaleString()} watchers</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="flex items-center gap-1 mb-2">
                  <Calendar className="h-4 w-4" />
                  <span className="font-medium">Created</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {new Date(data.created_at).toLocaleDateString()}
                </p>
              </div>
              <div>
                <div className="flex items-center gap-1 mb-2">
                  <Calendar className="h-4 w-4" />
                  <span className="font-medium">Last Updated</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {new Date(data.updated_at).toLocaleDateString()}
                </p>
              </div>
            </div>

            {data.topics.length > 0 && (
              <div>
                <h3 className="font-medium mb-2">Topics</h3>
                <div className="flex flex-wrap gap-2">
                  {data.topics.map((topic) => (
                    <Badge key={topic} variant="outline">{topic}</Badge>
                  ))}
                </div>
              </div>
            )}

            {data.license && (
              <div>
                <h3 className="font-medium mb-2">License</h3>
                <Badge variant="outline">{data.license.name}</Badge>
              </div>
            )}

            {Object.keys(data.languages).length > 0 && (
              <div>
                <h3 className="font-medium mb-2">Languages</h3>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(data.languages).map(([lang, bytes]) => (
                    <Badge key={lang} variant="secondary">
                      {lang}: {((bytes / Object.values(data.languages).reduce((a, b) => a + b, 0)) * 100).toFixed(1)}%
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium mb-2">Repository Stats</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Size:</span>
                    <span>{(data.size / 1024).toFixed(1)} KB</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Default Branch:</span>
                    <span>{data.default_branch}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Open Issues:</span>
                    <span>{data.open_issues}</span>
                  </div>
                </div>
              </div>
              {data.projectType && (
                <div>
                  <h3 className="font-medium mb-2">Project Analysis</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Type:</span>
                      <Badge variant="outline">{data.projectType}</Badge>
                    </div>
                    {data.framework && (
                      <div className="flex justify-between">
                        <span>Framework:</span>
                        <Badge variant="secondary">{data.framework}</Badge>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {data.scripts && Object.keys(data.scripts).length > 0 && (
              <div>
                <h3 className="font-medium mb-2">Available Scripts</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {Object.entries(data.scripts).map(([script, command]) => (
                    <div key={script} className="bg-muted p-2 rounded text-sm">
                      <div className="font-medium">{script}</div>
                      <div className="text-muted-foreground text-xs">{command}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {data.dependencies && Object.keys(data.dependencies).length > 0 && (
              <div>
                <h3 className="font-medium mb-2">Dependencies ({Object.keys(data.dependencies).length})</h3>
                <div className="flex flex-wrap gap-1 max-h-32 overflow-y-auto">
                  {Object.entries(data.dependencies).slice(0, 20).map(([dep, version]) => (
                    <Badge key={dep} variant="outline" className="text-xs">
                      {dep}@{version}
                    </Badge>
                  ))}
                  {Object.keys(data.dependencies).length > 20 && (
                    <Badge variant="secondary">+{Object.keys(data.dependencies).length - 20} more</Badge>
                  )}
                </div>
              </div>
            )}

            {data.fileStructure && data.fileStructure.length > 0 && (
              <div>
                <h3 className="font-medium mb-2">File Structure</h3>
                <div className="bg-muted p-4 rounded-md max-h-64 overflow-y-auto">
                  <div className="text-sm font-mono">
                    {data.fileStructure.map((file: any, index: number) => (
                      <div key={index} className="flex items-center gap-2 py-1">
                        {file.type === 'dir' ? (
                          <Folder className="h-4 w-4 text-blue-600" />
                        ) : (
                          <File className="h-4 w-4 text-gray-600" />
                        )}
                        <span>{file.name}</span>
                        {file.size && (
                          <span className="text-xs text-muted-foreground ml-auto">
                            {(file.size / 1024).toFixed(1)}KB
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {data.contributors && data.contributors.length > 0 && (
              <div>
                <h3 className="font-medium mb-2">Top Contributors</h3>
                <div className="flex flex-wrap gap-2">
                  {data.contributors.slice(0, 10).map((contributor: any) => (
                    <div key={contributor.login} className="flex items-center gap-2 bg-muted p-2 rounded">
                      <Image src={contributor.avatar_url} alt={contributor.login} width={24} height={24} className="w-6 h-6 rounded-full" />
                      <span className="text-sm">{contributor.login}</span>
                      <Badge variant="outline" className="text-xs">{contributor.contributions}</Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {data.projectAnalysis && (
              <div>
                <h3 className="font-medium mb-2">AI Project Analysis</h3>
                <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-md">
                  <p className="text-sm whitespace-pre-wrap">{data.projectAnalysis}</p>
                </div>
              </div>
            )}

            {data.architectureAnalysis && (
              <div>
                <h3 className="font-medium mb-2">Architecture Analysis</h3>
                <div className="bg-green-50 dark:bg-green-950 p-4 rounded-md">
                  <p className="text-sm whitespace-pre-wrap">{data.architectureAnalysis}</p>
                </div>
              </div>
            )}

            {data.keyFiles && data.keyFiles.length > 0 && (
              <div>
                <h3 className="font-medium mb-2">Key Files Analysis</h3>
                <div className="space-y-3">
                  {data.keyFiles.map((file: any, index: number) => (
                    <div key={index} className="bg-muted p-3 rounded">
                      <div className="font-medium text-sm flex items-center gap-2">
                        <span>[FILE]</span>
                        <span>{file.name}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">{file.purpose}</p>
                      {file.content && (
                        <div className="mt-2 bg-background p-2 rounded text-xs font-mono max-h-32 overflow-y-auto">
                          {file.content.substring(0, 500)}...
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {data.fullFileStructure && data.fullFileStructure.length > 0 && (
              <div>
                <h3 className="font-medium mb-2">Complete Directory Structure</h3>
                <div className="bg-muted p-4 rounded-md max-h-96 overflow-y-auto">
                  <FileTree items={data.fullFileStructure} />
                </div>
              </div>
            )}

            {data.readme && (
              <div>
                <h3 className="font-medium mb-2 flex items-center gap-1">
                  <FileText className="h-4 w-4" />
                  README Preview
                </h3>
                <div className="bg-muted p-4 rounded-md max-h-96 overflow-y-auto">
                  <pre className="whitespace-pre-wrap text-sm">{data.readme.substring(0, 3000)}...</pre>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}