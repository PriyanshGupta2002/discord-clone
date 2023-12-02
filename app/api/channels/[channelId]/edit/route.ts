import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { MemberRole } from "@prisma/client";
import { NextResponse } from "next/server";

interface IParams {
  channelId: string;
}
export const PATCH = async (req: Request, { params }: { params: IParams }) => {
  try {
    const { channelId } = params;
    const { searchParams } = new URL(req.url);
    const serverId = searchParams.get("serverId");
    const profile = await currentProfile();
    const { name, type } = await req.json();
    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    if (!serverId) {
      return new NextResponse("Server Id is missing", { status: 400 });
    }
    if (!channelId) {
      return new NextResponse("Channel Id is missing", { status: 400 });
    }
    if (name === "general") {
      return new NextResponse("Name cannot be 'general'", { status: 400 });
    }
    const server = await db.server.update({
      where: {
        id: serverId,
        members: {
          some: {
            profileId: profile.id,
            role: {
              in: [MemberRole.ADMIN || MemberRole.MODERATOR],
            },
          },
        },
      },
      data: {
        channels: {
          update: {
            where: {
              id: channelId,
              NOT: {
                name: "general",
              },
            },
            data: {
              name,
              type,
            },
          },
        },
      },
    });
    return NextResponse.json(server);
  } catch (error) {
    console.log("[EDIT_CHANNEL_ID]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
