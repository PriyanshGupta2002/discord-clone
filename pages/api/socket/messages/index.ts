import { currentProfilePages } from "@/lib/current-profile-pages";
import { db } from "@/lib/db";
import { NextResponseServerIo } from "@/types";
import { NextApiRequest } from "next";

const functionHandler = async (
  req: NextApiRequest,
  res: NextResponseServerIo
) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: `${req.method} not allowed` });
  }
  try {
    const profile = await currentProfilePages(req);
    console.log("profile", profile?.id);
    const { fileUrl, content } = req.body;
    console.log(fileUrl);
    const { serverId, channelId } = req.query;
    if (!profile) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    if (!serverId) {
      return res.status(400).json({ error: "Server Id is missing" });
    }
    if (!channelId) {
      return res.status(400).json({ error: "Channel Id is missing" });
    }
    if (!content || content.trim().length === 0) {
      return res.status(400).json({ error: "Content is missing" });
    }

    const server = await db.server.findFirst({
      where: {
        id: serverId as string,
        members: {
          some: {
            profileId: profile.id,
          },
        },
      },
      include: {
        members: true,
      },
    });
    console.log("serverMembers", server);

    if (!server) {
      return res.status(404).json({ message: "Server not found" });
    }
    const channel = await db.channel.findFirst({
      where: {
        id: channelId as string,
        serverId: serverId as string,
      },
    });
    if (!channel) {
      return res.status(404).json({ message: "Channel not found" });
    }
    const member = server.members.find(
      (member) => member.profileId === profile.id
    );
    if (!member) {
      return res.status(404).json({ message: "Member not found" });
    }
    const message = await db.message.create({
      data: {
        content,
        fileUrl,
        channelId: channel.id as string,
        memberId: member.id,
      },
      include: {
        member: {
          include: {
            profile: true,
          },
        },
      },
    });
    const channelKey = `chat:${channel.id}:messages`;
    res?.socket?.server?.io?.emit(channelKey, message);
    return res.status(200).json({ message });
  } catch (error) {
    console.log("[MESSAGES_POST]", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export default functionHandler;