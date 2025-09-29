"use client";
import { Loader2 } from "lucide-react";

export default function LoadingMessage() {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="text-center">
        <Loader2 className="text-muted-foreground mx-auto mb-4 h-12 w-12 animate-spin" />
        <h3 className="text-foreground text-lg font-semibold">
          Loading facility reports...
        </h3>
        <p className="text-muted-foreground">
          Please wait while we fetch the data.
        </p>
      </div>
    </div>
  );
}
