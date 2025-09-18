"use client";

import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ThemeToggle";
import { ArrowLeft, Play, BookOpen } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function TutorialNavbar() {
  return (
    <motion.nav 
      className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Left side - Back button */}
          <Link href="/">
            <Button variant="outline" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Button>
          </Link>

          {/* Center - Title */}
          <div className="flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              ArchFlow Tutorial
            </h1>
          </div>

          {/* Right side - Theme toggle and Get Started button */}
          <div className="flex items-center gap-3">
            <ModeToggle />
            <Link href="/sign-in">
              <Button className="gap-2">
                <Play className="h-4 w-4" />
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}