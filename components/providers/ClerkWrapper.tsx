import { ClerkProvider } from "@clerk/nextjs";
import { ReactNode } from "react";

export function ClerkWrapper({ children }: { children: ReactNode }) {
  return (
    <ClerkProvider
      afterSignOutUrl="/sign-in"
      appearance={{
        elements: {
          formButtonPrimary:
            "bg-primary hover:bg-primary/90 text-sm !shadow-none",
        },
      }}
    >
      {children}
    </ClerkProvider>
  );
}