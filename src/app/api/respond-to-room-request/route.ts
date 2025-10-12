// src/app/api/respond-to-room-request/route.ts
import { createCaller } from "@/server/api/root";
import { createTRPCContext } from "@/server/api/trpc";
import { NextRequest, NextResponse } from "next/server";

// Define the request body type
interface RespondToRoomRequestBody {
  roomRequestId: string;
  status: "accept" | "decline";
}

export async function POST(req: NextRequest) {
  try {
    // Create the full tRPC context (includes headers, db, and session)
    const ctx = await createTRPCContext({
      headers: req.headers,
    });

    // Check if user is authenticated
    if (!ctx.session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Type the request body
    const body = await req.json() as RespondToRoomRequestBody;
    const { roomRequestId, status } = body;

    console.log('Room Request ID:', roomRequestId);
    console.log('Status:', status);

    // Pass the full context to createCaller
    const trpc = createCaller(ctx);
    const result = await trpc.classroomSchedule.respondToRoomRequest({
      roomRequestId,
      status: status === "accept" ? "accepted" : "declined",
    });

    console.log('Result:', result);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Failed to respond to request:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}