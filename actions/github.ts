"use server";

import { GitHubScrapedData } from "@/lib/types";

export async function scrapeGitHubRepository(url: string): Promise<GitHubScrapedData> {
  const match = url.match(/github\.com\/([^\/]+)\/([^\/]+)/);
  if (!match) throw new Error('Invalid GitHub URL');
  
  const [, owner, repo] = match;
  const cleanRepo = repo.replace(/\.git$/, '');

  const headers: Record<string, string> = {
    'Accept': 'application/vnd.github.v3+json',
    'User-Agent': 'WorkFlex-GitHub-Scraper'
  };
  
  if (process.env.GITHUB_TOKEN) {
    headers['Authorization'] = `token ${process.env.GITHUB_TOKEN}`;
  }

  const [repoData, languages, fileStructure, readme] = await Promise.all([
    fetchRepository(owner, cleanRepo, headers),
    fetchLanguages(owner, cleanRepo, headers),
    fetchContents(owner, cleanRepo, headers),
    fetchReadme(owner, cleanRepo, headers)
  ]);

  // Get complete folder structure
  const fullFileStructure = await fetchCompleteStructure(owner, cleanRepo, headers);

  let packageJson = null;
  try {
    const packageData = await fetchContents(owner, cleanRepo, headers, 'package.json');
    if (packageData.download_url) {
      const content = await fetch(packageData.download_url);
      packageJson = await content.json();
    }
  } catch {}

  const { projectAnalysis, architectureAnalysis } = await analyzeWithAI(
    repoData, packageJson, fileStructure, readme
  );

  return {
    name: repoData.name,
    description: repoData.description,
    stars: repoData.stargazers_count,
    forks: repoData.forks_count,
    watchers: repoData.watchers_count,
    language: repoData.language,
    created_at: repoData.created_at,
    updated_at: repoData.updated_at,
    size: repoData.size,
    default_branch: repoData.default_branch,
    open_issues: repoData.open_issues_count,
    owner: {
      login: repoData.owner.login,
      avatar_url: repoData.owner.avatar_url,
    },
    topics: repoData.topics || [],
    license: repoData.license,
    readme: readme.substring(0, 3000),
    languages,
    fileStructure: fileStructure.slice(0, 30),
    fullFileStructure,
    packageJson,
    dependencies: packageJson?.dependencies || {},
    devDependencies: packageJson?.devDependencies || {},
    scripts: packageJson?.scripts || {},
    projectAnalysis,
    architectureAnalysis,
  };
}

async function fetchRepository(owner: string, repo: string, headers: Record<string, string>) {
  const response = await fetch(`https://api.github.com/repos/${owner}/${repo}`, { headers });
  if (!response.ok) {
    if (response.status === 403) {
      throw new Error('GitHub API rate limit exceeded. Please add a GITHUB_TOKEN to your .env.local file.');
    }
    throw new Error('Repository not found');
  }
  return response.json();
}

async function fetchLanguages(owner: string, repo: string, headers: Record<string, string>) {
  const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/languages`, { headers });
  return response.ok ? response.json() : {};
}

async function fetchContents(owner: string, repo: string, headers: Record<string, string>, path = '') {
  try {
    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`, { headers });
    return response.ok ? response.json() : [];
  } catch {
    return [];
  }
}

async function fetchReadme(owner: string, repo: string, headers: Record<string, string>) {
  try {
    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/readme`, { headers });
    if (response.ok) {
      const data = await response.json();
      const content = await fetch(data.download_url);
      return content.text();
    }
  } catch {}
  return '';
}

async function fetchCompleteStructure(owner: string, repo: string, headers: Record<string, string>, path = '', depth = 0): Promise<any[]> {
  if (depth > 3) return []; // Limit depth to avoid too many API calls
  
  try {
    const contents = await fetchContents(owner, repo, headers, path);
    const structure: any[] = [];
    
    for (const item of contents.slice(0, 50)) { // Limit items per directory
      const structureItem: any = {
        name: item.name,
        path: item.path,
        type: item.type,
        size: item.size,
        children: [] as any[]
      };
      
      if (item.type === 'dir' && depth < 2) {
        structureItem.children = await fetchCompleteStructure(owner, repo, headers, item.path, depth + 1);
      }
      
      structure.push(structureItem);
    }
    
    return structure;
  } catch {
    return [];
  }
}

async function analyzeWithAI(repoData: any, packageJson: any, fileStructure: any[], readme: string) {
  if (!process.env.OPENAI_API_KEY) {
    return getFallbackAnalysis(repoData, packageJson, fileStructure);
  }

  try {
    const projectContext = `Analyze this GitHub repository:

Project: ${repoData.name}
Description: ${repoData.description || 'No description'}
Language: ${repoData.language}
Stars: ${repoData.stargazers_count}
Dependencies: ${packageJson ? Object.keys(packageJson.dependencies || {}).slice(0, 10).join(', ') : 'None'}
Files: ${fileStructure.slice(0, 15).map((f: any) => f.name).join(', ')}
README: ${readme.substring(0, 1000)}`;

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
        'X-Title': 'WorkFlex GitHub Scraper',
      },
      body: JSON.stringify({
        model: 'google/gemma-2-9b-it:free',
        messages: [
          {
            role: 'system',
            content: 'You are a software architect. Analyze GitHub repositories and explain what they do and their architecture in detail.'
          },
          {
            role: 'user',
            content: `${projectContext}\n\nProvide analysis in two parts:\n1. PROJECT ANALYSIS: What this project does, its purpose, and key features\n2. ARCHITECTURE ANALYSIS: Technical architecture and how it works`
          }
        ],
        temperature: 0.7,
        max_tokens: 1000
      })
    });

    if (response.ok) {
      const data = await response.json();
      const fullAnalysis = data.choices[0]?.message?.content || '';
      
      if (fullAnalysis.length > 0) {
        const midPoint = Math.floor(fullAnalysis.length / 2);
        const projectAnalysis = fullAnalysis.substring(0, midPoint).trim();
        let architectureAnalysis = fullAnalysis.substring(midPoint).trim();
        
        if (!architectureAnalysis || architectureAnalysis.length < 10) {
          architectureAnalysis = `Technical stack: ${repoData.language}. Framework: ${packageJson?.dependencies?.react ? 'React' : packageJson?.dependencies?.next ? 'Next.js' : 'Standard'}. Structure: ${fileStructure.length} files analyzed.`;
        }
        
        return { projectAnalysis, architectureAnalysis };
      }
    }
  } catch (error) {
    console.error('AI analysis failed:', error);
  }

  return getFallbackAnalysis(repoData, packageJson, fileStructure);
}

function getFallbackAnalysis(repoData: any, packageJson: any, fileStructure: any[]) {
  const projectAnalysis = `**Project Analysis:**\n\n**What this project does:**\n${repoData.description || 'This project is a software application'} built in ${repoData.language}.\n\n**Technology Stack:**\n- Primary language: ${repoData.language}\n- ${repoData.stargazers_count} stars, ${repoData.forks_count} forks`;
  
  const architectureAnalysis = `**Architecture Analysis:**\n\n**Framework & Tools:**\n${packageJson?.dependencies?.react ? '- React frontend\n' : ''}${packageJson?.dependencies?.next ? '- Next.js framework\n' : ''}${packageJson?.dependencies?.express ? '- Express.js backend\n' : ''}**Project Structure:**\n${fileStructure.some((f: any) => f.name === 'src') ? '- src/ - Source code\n' : ''}${fileStructure.some((f: any) => f.name === 'components') ? '- components/ - UI components\n' : ''}`;
  
  return { projectAnalysis, architectureAnalysis };
}