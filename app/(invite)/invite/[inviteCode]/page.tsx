import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirectToSignIn } from "@clerk/nextjs";
import { redirect, useRouter } from "next/navigation";

const InvitePage = async ({ params }: { params: { inviteCode: string } }) => {
  const { inviteCode } = params;
  const profile = await currentProfile();
  if (!profile) {
    return redirectToSignIn();
  }
  if (!inviteCode) {
    return redirect("/");
  }
  const existingServer = await db.server.findFirst({
    where: {
      inviteCode,
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  });
  if (existingServer) {
    return redirect(`/servers/${existingServer.id}`);
  }
  const newMember = await db.server.update({
    where: {
      inviteCode,
    },
    data: {
      members: {
        create: [
          {
            profileId: profile.id,
          },
        ],
      },
    },
  });
  return redirect("/");
};

export default InvitePage;
