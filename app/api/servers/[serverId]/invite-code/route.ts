import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
export const PATCH = async (
  req: Request,
  { params }: { params: { serverId: string } }
) => {
  const { serverId } = params;
  try {
    const profile = await currentProfile();
    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    if (!serverId) {
      return new NextResponse("Server Id Missing", { status: 400 });
    }
    const inviteCode = uuidv4();
    const server = await db.server.update({
      where: {
        id: serverId,
        profileId: profile.id,
      },
      data: {
        inviteCode,
      },
    });
    return NextResponse.json(server, { status: 200 });
  } catch (error) {
    console.log("[ServerId]: ", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
};
