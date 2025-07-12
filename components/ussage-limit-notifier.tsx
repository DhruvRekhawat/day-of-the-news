"use client"; // This directive is essential

import { useEffect } from "react";
import { toast } from "sonner";
import Link from "next/link";
import { ShieldAlert } from 'lucide-react'; // Example icon

interface UsageLimitNotifierProps {
  limit: number;
}

export function UsageLimitNotifier({ limit }: UsageLimitNotifierProps) {
  
  // Use useEffect to trigger the toast when the component mounts
  useEffect(() => {
    toast.error("Daily Limit Reached", {
      description: `You have viewed your ${limit} free articles for today. Please upgrade for unlimited access.`,
      action: {
        label: "Upgrade",
        onClick: () => (window.location.href = "/pricing"), // Simple navigation to your pricing page
      },
      duration: 10000, // Keep the toast visible for 10 seconds
    });
  }, [limit]); // Dependency array ensures this runs only once on mount

  // Also render a fallback message in the main content area
  return (
    <div className="flex flex-col items-center justify-center text-center p-10 border border-red-500/30 bg-red-500/10 rounded-lg max-w-2xl mx-auto my-12">
      <ShieldAlert className="w-16 h-16 text-red-500 mb-4" />
      <h2 className="text-3xl font-bold text-red-400">Usage Limit Exceeded</h2>
      <p className="mt-2 text-lg text-gray-300">
        You&apos;ve reached your daily reading limit.
      </p>
      <Link href="/pricing"
          className="mt-6 inline-block bg-blue-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-blue-700 transition-colors">
          Upgrade to Premium
      </Link>
    </div>
  );
}