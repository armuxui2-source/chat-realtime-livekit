import { NextRequest, NextResponse } from "next/server";
import { AccessToken } from "livekit-server-sdk";

export const dynamic = "force-dynamic";

export interface ConnectionDetails {
  serverUrl: string;
  roomName: string;
  participantToken: string;
  participantName: string;
}

export async function GET(req: NextRequest) {
  try {
    const roomName = req.nextUrl.searchParams.get("roomName") || "general-room";
    const participantName = req.nextUrl.searchParams.get("participantName") || `user-${Math.random().toString(36).slice(2, 7)}`;
    const region = req.nextUrl.searchParams.get("region");

    const apiKey = process.env.LIVEKIT_API_KEY;
    const apiSecret = process.env.LIVEKIT_API_SECRET;
    const livekitUrl = process.env.NEXT_PUBLIC_LIVEKIT_URL || process.env.LIVEKIT_URL;

    if (!apiKey || !apiSecret || !livekitUrl) {
      // Fallback response with helpful dev notice
      return NextResponse.json(
        {
          error: "LiveKit credentials not configured. Please set LIVEKIT_API_KEY, LIVEKIT_API_SECRET, and NEXT_PUBLIC_LIVEKIT_URL in .env.local",
          isConfigured: false,
        },
        { status: 500 }
      );
    }

    // Generate participant token using LiveKit Server SDK
    const at = new AccessToken(apiKey, apiSecret, {
      identity: participantName,
      name: participantName,
    });

    at.addGrant({
      room: roomName,
      roomJoin: true,
      canPublish: true,
      canPublishData: true,
      canSubscribe: true,
    });

    const participantToken = await at.toJwt();

    const data: ConnectionDetails = {
      serverUrl: livekitUrl,
      roomName,
      participantToken,
      participantName,
    };

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error generating connection details:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to generate token" },
      { status: 500 }
    );
  }
}
