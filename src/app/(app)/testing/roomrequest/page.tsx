"use client";

import { useState } from "react";
import { api } from "@/trpc/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { set } from "better-auth";

export default function TestEmailPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const sendEmail = api.classroomSchedule.sendRoomRequest.useMutation({
    onSuccess: () => setIsLoading(false),
    onError: (err) => setIsLoading(false),
  });

  const handleClick = () => {
    if (!email) return;
    setIsLoading(true);
    sendEmail.mutate({ email });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 gap-4">
      <h1 className="text-2xl font-bold">Test Room Request Email</h1>

      <Input
        type="email"
        placeholder="Enter recipient email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-80"
      />

      <Button onClick={handleClick} disabled={isLoading}>
        {isLoading ? "Sending..." : "Send Email"}
      </Button>

    </div>
  );
}
