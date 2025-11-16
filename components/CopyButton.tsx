"use client";

import { Copy } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";
import { copyToClipboard } from "../lib/clipboard";

interface CopyButtonProps {
  code: string;
  language: string;
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg";
  className?: string;
}

export function CopyButton({ code, language, variant = "outline", size = "sm", className = "" }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await copyToClipboard(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <Button
      size={size}
      variant={variant}
      className={`border-[#5FB57A] text-[#5FB57A] hover:bg-[#5FB57A] hover:text-white text-xs ${className} ${copied ? 'bg-[#5FB57A] text-white' : ''}`}
      onClick={handleCopy}
    >
      <Copy className="h-3 w-3" />
      {copied && (
        <span className="ml-1 text-xs">
          {language === 'en' ? 'Copied!' : 'تم النسخ!'}
        </span>
      )}
    </Button>
  );
}