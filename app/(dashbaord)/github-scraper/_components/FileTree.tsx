import { Folder, File, ChevronRight, ChevronDown } from "lucide-react";
import { useState } from "react";

interface FileItem {
  name: string;
  path: string;
  type: 'file' | 'dir';
  size?: number;
  children?: FileItem[];
}

interface FileTreeProps {
  items: FileItem[];
  level?: number;
}

export function FileTree({ items, level = 0 }: FileTreeProps) {
  return (
    <div className={level > 0 ? "ml-4" : ""}>
      {items.map((item, index) => (
        <FileTreeItem key={`${item.path}-${index}`} item={item} level={level} />
      ))}
    </div>
  );
}

function FileTreeItem({ item, level }: { item: FileItem; level: number }) {
  const [isExpanded, setIsExpanded] = useState(level < 2);
  const hasChildren = item.children && item.children.length > 0;

  return (
    <div>
      <div 
        className="flex items-center gap-2 py-1 hover:bg-muted/50 rounded cursor-pointer"
        onClick={() => hasChildren && setIsExpanded(!isExpanded)}
      >
        {hasChildren ? (
          isExpanded ? (
            <ChevronDown className="h-3 w-3" />
          ) : (
            <ChevronRight className="h-3 w-3" />
          )
        ) : (
          <div className="w-3" />
        )}
        
        {item.type === 'dir' ? (
          <Folder className="h-4 w-4 text-blue-600" />
        ) : (
          <File className="h-4 w-4 text-gray-600" />
        )}
        
        <span className="text-sm">{item.name}</span>
        
        {item.size && item.type === 'file' && (
          <span className="text-xs text-muted-foreground ml-auto">
            {(item.size / 1024).toFixed(1)}KB
          </span>
        )}
      </div>
      
      {hasChildren && isExpanded && (
        <FileTree items={item.children!} level={level + 1} />
      )}
    </div>
  );
}