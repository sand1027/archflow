"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function ErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  return (
    <Card className="w-full max-w-md shadow-xl">
      <CardHeader className="text-center space-y-4">
        <div className="flex justify-center">
          <AlertCircle className="h-12 w-12 text-red-500" />
        </div>
        <CardTitle className="text-2xl font-bold text-red-600">Authentication Error</CardTitle>
        <CardDescription>
          {error === "OAuthSignin" && "Error in constructing an authorization URL."}
          {error === "OAuthCallback" && "Error in handling the response from an OAuth provider."}
          {error === "OAuthCreateAccount" && "Could not create OAuth provider user in the database."}
          {error === "EmailCreateAccount" && "Could not create email provider user in the database."}
          {error === "Callback" && "Error in the OAuth callback handler route."}
          {error === "OAuthAccountNotLinked" && "Email on the account is already linked, but not with this OAuth account."}
          {error === "EmailSignin" && "Sending the e-mail with the verification token failed."}
          {error === "CredentialsSignin" && "The authorize callback returned null in the Credentials provider."}
          {error === "SessionRequired" && "The content of this page requires you to be signed in at all times."}
          {!error && "An unknown error occurred during authentication."}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button asChild className="w-full">
          <Link href="/auth/signin">
            Try Again
          </Link>
        </Button>
        
        <Button asChild variant="outline" className="w-full">
          <Link href="/">
            Go Home
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}

export default function AuthError() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-red-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <Suspense fallback={
        <Card className="w-full max-w-md shadow-xl">
          <CardContent className="p-6 text-center">
            Loading...
          </CardContent>
        </Card>
      }>
        <ErrorContent />
      </Suspense>
    </div>
  );
}