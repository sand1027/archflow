"use client";

import { signIn, getSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Github, Chrome } from "lucide-react";
import Logo from "@/components/Logo";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function SignIn() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      const session = await getSession();
      if (session) {
        router.push("/home");
      }
    };
    checkSession();
  }, [router]);

  const handleOAuthSignIn = async (provider: "github" | "google") => {
    try {
      await signIn(provider, { callbackUrl: "/home" });
    } catch (error) {
      console.error("Sign in error:", error);
    }
  };

  const handleCredentialsAuth = async (isSignUp: boolean) => {
    if (!email || !password || (isSignUp && !name)) return;
    
    setLoading(true);
    try {
      const result = await signIn("credentials", {
        email,
        password,
        name,
        isSignUp: isSignUp.toString(),
        callbackUrl: "/home",
        redirect: false,
      });
      
      if (result?.error) {
        alert(result.error);
      } else {
        router.push("/home");
      }
    } catch (error) {
      console.error("Auth error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black p-4">
      <Card className="w-full max-w-md shadow-2xl border-gray-800 bg-gray-900">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <Logo />
          </div>
          <CardTitle className="text-2xl font-bold text-white">Welcome to ArchFlow</CardTitle>
          <CardDescription className="text-gray-400">
            Sign in to start building powerful automation workflows
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-gray-800">
              <TabsTrigger value="signin" className="text-gray-300 data-[state=active]:bg-gray-700 data-[state=active]:text-white">Sign In</TabsTrigger>
              <TabsTrigger value="signup" className="text-gray-300 data-[state=active]:bg-gray-700 data-[state=active]:text-white">Sign Up</TabsTrigger>
            </TabsList>
            
            <TabsContent value="signin" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-300">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-300">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
                />
              </div>
              <Button
                onClick={() => handleCredentialsAuth(false)}
                className="w-full"
                disabled={loading}
              >
                {loading ? "Signing in..." : "Sign In"}
              </Button>
            </TabsContent>
            
            <TabsContent value="signup" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-gray-300">Name</Label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-300">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-300">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a password"
                  className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
                />
              </div>
              <Button
                onClick={() => handleCredentialsAuth(true)}
                className="w-full"
                disabled={loading}
              >
                {loading ? "Creating account..." : "Sign Up"}
              </Button>
            </TabsContent>
          </Tabs>
          
          <div className="relative my-6">
            <Separator className="bg-gray-700" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="bg-gray-900 px-2 text-sm text-gray-400">or</span>
            </div>
          </div>
          
          <div className="space-y-3">
            <Button
              onClick={() => handleOAuthSignIn("github")}
              variant="outline"
              className="w-full h-12 text-base font-medium bg-gray-800 border-gray-700 text-white hover:bg-gray-700"
            >
              <Github className="mr-3 h-5 w-5" />
              Continue with GitHub
            </Button>
            
            <Button
              onClick={() => handleOAuthSignIn("google")}
              variant="outline"
              className="w-full h-12 text-base font-medium bg-gray-800 border-gray-700 text-white hover:bg-gray-700"
            >
              <Chrome className="mr-3 h-5 w-5" />
              Continue with Google
            </Button>
          </div>
          
          <div className="text-center text-sm text-gray-500 mt-6">
            By signing in, you agree to our Terms of Service and Privacy Policy
          </div>
        </CardContent>
      </Card>
    </div>
  );
}