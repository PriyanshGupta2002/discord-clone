import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export const PATCH = async (
  req: Request,
  { params }: { params: { serverId: string } }
) => {
  try {
    const profile = await currentProfile();
    const body = await req.json();
    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    if (!params.serverId) {
      return new NextResponse("Server Id Missing", { status: 400 });
    }
    const updatedServer = await db.server.update({
      where: {
        id: params.serverId,
        profileId: profile.id,
      },
      data: {
        ...body,
      },
    });
    return NextResponse.json(updatedServer, { status: 200 });
  } catch (error) {
    return new NextResponse("Something went wrong", { status: 500 });
  }
};
