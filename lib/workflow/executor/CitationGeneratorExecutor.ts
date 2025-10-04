import { ExecutionEnviornment } from "@/lib/types";
import { CitationGeneratorTask } from "../task/CitationGenerator";

export async function CitationGeneratorExecutor(
  environment: ExecutionEnviornment<typeof CitationGeneratorTask>
): Promise<boolean> {
  try {
    const url = environment.getInput("URL");
    const citationStyle = environment.getInput("Citation Style");
    const sourceType = environment.getInput("Source Type");

    // Fetch webpage metadata
    const response = await fetch(url);
    const html = await response.text();
    
    const metadata = extractMetadata(html, url);
    const citation = formatCitation(metadata, citationStyle, sourceType);
    const bibliography = formatBibliography(metadata, citationStyle, sourceType);

    environment.setOutput("Citation", citation);
    environment.setOutput("Bibliography Entry", bibliography);
    return true;
  } catch (error: any) {
    environment.log.error(`Citation Generator failed: ${error.message}`);
    return false;
  }
}

function extractMetadata(html: string, url: string) {
  const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  const authorMatch = html.match(/<meta[^>]*name="author"[^>]*content="([^"]+)"/i);
  const dateMatch = html.match(/<meta[^>]*name="date"[^>]*content="([^"]+)"/i);
  
  return {
    title: titleMatch?.[1] || "Untitled",
    author: authorMatch?.[1] || "Unknown Author",
    date: dateMatch?.[1] || new Date().toISOString().split('T')[0],
    url,
    accessDate: new Date().toISOString().split('T')[0]
  };
}

function formatCitation(metadata: any, style: string, sourceType: string): string {
  const { title, author, date, url } = metadata;
  
  switch (style.toLowerCase()) {
    case 'apa':
      return `${author} (${date}). ${title}. Retrieved from ${url}`;
    case 'mla':
      return `${author}. "${title}." Web. ${date}.`;
    case 'chicago':
      return `${author}. "${title}." Accessed ${date}. ${url}.`;
    default:
      return `${author}. "${title}." ${date}. ${url}`;
  }
}

function formatBibliography(metadata: any, style: string, sourceType: string): string {
  return formatCitation(metadata, style, sourceType);
}