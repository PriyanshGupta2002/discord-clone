import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export const DELETE = async (
  req: Request,
  { params }: { params: { serverId: string } }
) => {
  const profile = await currentProfile();
  if (!profile) {
    return new NextResponse("Unauthorized", { status: 401 });
  }
  if (!params.serverId) {
    return new NextResponse("Server Id is missing", { status: 400 });
  }
  try {
    const server = await db.server.delete({
      where: {
        id: params.serverId,
        profileId: profile.id,
      },
    });
    return NextResponse.json(server);
  } catch (error) {
    console.log("DELETE_SERVER_ERROR", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
