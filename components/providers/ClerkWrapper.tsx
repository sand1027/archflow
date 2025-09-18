import { ClerkProvider } from "@clerk/nextjs";
import { ReactNode } from "react";

export function ClerkWrapper({ children }: { children: ReactNode }) {
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  
  // Always render children during build time
  if (typeof window === 'undefined' && !publishableKey) {
    return <>{children}</>;
  }
  
  if (!publishableKey) {
    return <>{children}</>;
  }

  return (
    <ClerkProvider
      publishableKey={publishableKey}
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