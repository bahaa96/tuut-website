"use client";

export function LoadingState() {
  return (
    <div className="space-y-6">
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          className="h-32 bg-gray-100 rounded-xl border-2 border-[#E5E7EB] animate-pulse"
        />
      ))}
    </div>
  );
}

