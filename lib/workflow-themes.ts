export interface WorkflowTheme {
  id: string;
  name: string;
  colors: {
    primary: string;
    secondary: string;
    background: string;
    nodeBackground: string;
    nodeBorder: string;
    connectionLine: string;
  };
  nodeStyles: {
    borderRadius: number;
    shadow: string;
    fontSize: number;
  };
}

export const workflowThemes: WorkflowTheme[] = [
  {
    id: "default",
    name: "Default",
    colors: {
      primary: "#3b82f6",
      secondary: "#64748b",
      background: "#ffffff",
      nodeBackground: "#f8fafc",
      nodeBorder: "#e2e8f0",
      connectionLine: "#94a3b8"
    },
    nodeStyles: {
      borderRadius: 8,
      shadow: "0 1px 3px rgba(0,0,0,0.1)",
      fontSize: 14
    }
  },
  {
    id: "dark",
    name: "Dark Mode",
    colors: {
      primary: "#60a5fa",
      secondary: "#94a3b8",
      background: "#0f172a",
      nodeBackground: "#1e293b",
      nodeBorder: "#334155",
      connectionLine: "#64748b"
    },
    nodeStyles: {
      borderRadius: 8,
      shadow: "0 1px 3px rgba(0,0,0,0.3)",
      fontSize: 14
    }
  }
];